"""Supabase REST 데이터를 BigQuery 분석용 테이블로 전체 동기화한다."""

from __future__ import annotations

import json
import logging
import os
import tempfile
import uuid
from datetime import date, datetime
from decimal import Decimal
from pathlib import Path
from typing import Any, Callable

GCP_PROJECT_ID = "pookie-analytics"
BIGQUERY_DATASET_ID = "pookie_supabase"
PAGE_SIZE = 1_000

TABLE_PRIMARY_KEYS = {
    "respondents": "id",
    "diagnosis_answers": "id",
    "track1_results": "result_id",
    "track2_results": "result_id",
    "track3_results": "result_id",
}

# 저장소의 backend/db.js payload와 (New) 테이블 구조.md를 기준으로 정리했다.
# 실제 Supabase 스키마에 아래 컬럼이 없어도 무시되며, 새 컬럼은 기본적으로 동기화된다.
EXCLUDED_COLUMNS = {
    "respondents": {
        "nickname",
        "access_token",
    },
    "diagnosis_answers": set(),
    "track1_results": {
        "nickname",
        "raw_pasted_llm_result",
        "parsed_llm_result",
        "llm_raw_json",
        "note_A",
        "note_B",
        "note_C",
        "note_D",
        "reason_A",
        "reason_B",
        "reason_C",
        "reason_D",
        "llm_verdict",
        "share_slug",
    },
    "track2_results": {
        "nickname",
        "free_text",
        "evidence_task_clarity",
        "evidence_context",
        "evidence_role",
        "evidence_format",
        "evidence_iteration",
        "evidence_critical",
        "extracted_features",
        "feedback_text",
        "llm_text_output",
        "feedback",
        "share_slug",
    },
    "track3_results": {
        "turns",
        "final_output",
        "best_intervention",
        "missed_intervention",
        "feedback",
        "share_slug",
    },
}

LOGGER = logging.getLogger("supabase-bigquery-sync")


class SyncError(RuntimeError):
    """사용자 데이터나 Secret을 포함하지 않는 동기화 오류."""


def required_environment() -> dict[str, str]:
    names = ("SUPABASE_URL", "SUPABASE_SECRET_KEY", "GCP_SERVICE_ACCOUNT_JSON")
    missing = [name for name in names if not os.environ.get(name, "").strip()]
    if missing:
        raise SyncError(f"필수 환경변수가 없습니다: {', '.join(missing)}")

    return {name: os.environ[name].strip() for name in names}


def normalize_supabase_url(value: str) -> str:
    normalized = value.strip().rstrip("/")
    if normalized.endswith("/rest/v1"):
        normalized = normalized[: -len("/rest/v1")]
    if not normalized.startswith(("https://", "http://")):
        raise SyncError("SUPABASE_URL은 https://...supabase.co 형식이어야 합니다.")
    return normalized


def build_supabase_session(secret_key: str) -> Any:
    try:
        import requests
        from requests.adapters import HTTPAdapter
        from urllib3.util.retry import Retry
    except ImportError as error:
        raise SyncError("Python 의존성이 없습니다. requirements-sync.txt를 설치해주세요.") from error

    session = requests.Session()
    session.headers.update(
        {
            "apikey": secret_key,
            "Accept": "application/json",
        }
    )
    # 기존 service_role JWT와 새 sb_secret 키를 모두 지원한다.
    if secret_key.count(".") == 2:
        session.headers["Authorization"] = f"Bearer {secret_key}"

    retry = Retry(
        total=4,
        connect=4,
        read=4,
        backoff_factor=1,
        status_forcelist=(429, 500, 502, 503, 504),
        allowed_methods=frozenset({"GET"}),
    )
    session.mount("https://", HTTPAdapter(max_retries=retry))
    return session


def fetch_all_rows(session: Any, supabase_url: str, table: str) -> list[dict[str, Any]]:
    primary_key = TABLE_PRIMARY_KEYS[table]
    endpoint = f"{supabase_url}/rest/v1/{table}"
    rows: list[dict[str, Any]] = []
    offset = 0

    while True:
        response = session.get(
            endpoint,
            params={
                "select": "*",
                "order": f"{primary_key}.asc",
                "limit": PAGE_SIZE,
                "offset": offset,
            },
            timeout=(10, 60),
        )
        if not response.ok:
            raise SyncError(f"Supabase가 {table} 조회에 HTTP {response.status_code}를 반환했습니다.")

        try:
            page = response.json()
        except ValueError as error:
            raise SyncError(f"Supabase {table} 응답이 JSON 형식이 아닙니다.") from error
        if not isinstance(page, list):
            raise SyncError(f"Supabase {table} 응답이 행 배열이 아닙니다.")

        rows.extend(page)
        LOGGER.info("[%s] %d행 조회(누적 %d행)", table, len(page), len(rows))
        if len(page) < PAGE_SIZE:
            break
        offset += len(page)

    return rows


def sanitize_track1_prompt_scores(value: Any) -> Any:
    if not isinstance(value, dict):
        return value
    return {
        key: nested
        for key, nested in value.items()
        if key not in {"notes", "verdict", "tags"}
    }


def sanitize_track1_final_scores(value: Any) -> Any:
    if not isinstance(value, dict):
        return value
    sanitized = {
        key: nested
        for key, nested in value.items()
        if key not in {"result_card", "tie_resolution"}
    }
    tie_resolution = value.get("tie_resolution")
    if isinstance(tie_resolution, dict):
        sanitized["tie_resolution"] = {
            axis: {"source": detail.get("source")}
            for axis, detail in tie_resolution.items()
            if isinstance(detail, dict)
        }
    return sanitized


def sanitize_track3_axis_scores(value: Any) -> Any:
    if not isinstance(value, list):
        return value
    allowed = {"key", "axis", "score", "max", "rate"}
    return [
        {key: nested for key, nested in item.items() if key in allowed}
        for item in value
        if isinstance(item, dict)
    ]


def sanitize_track3_delta_score(value: Any) -> Any:
    if not isinstance(value, dict):
        return value
    return {"score": value.get("score")}


def sanitize_track3_move_tagging(value: Any) -> Any:
    if not isinstance(value, list):
        return value
    return [
        {
            "turn": item.get("turn"),
            "moves": item.get("moves", []),
        }
        for item in value
        if isinstance(item, dict)
    ]


NESTED_SANITIZERS: dict[tuple[str, str], Callable[[Any], Any]] = {
    ("track1_results", "prompt_scores"): sanitize_track1_prompt_scores,
    ("track1_results", "final_scores"): sanitize_track1_final_scores,
    ("track3_results", "axis_scores"): sanitize_track3_axis_scores,
    ("track3_results", "delta_score"): sanitize_track3_delta_score,
    ("track3_results", "move_tagging"): sanitize_track3_move_tagging,
}


def normalize_scalar(value: Any) -> Any:
    if value is None:
        return None
    if isinstance(value, str):
        return value if value.strip() else None
    if isinstance(value, bool):
        return value
    if isinstance(value, (int, float)):
        return value
    if isinstance(value, Decimal):
        return float(value)
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    if isinstance(value, uuid.UUID):
        return str(value)
    return str(value)


def normalize_value(table: str, column: str, value: Any) -> Any:
    sanitizer = NESTED_SANITIZERS.get((table, column))
    if sanitizer:
        value = sanitizer(value)
    if isinstance(value, (dict, list)):
        return json.dumps(value, ensure_ascii=False, separators=(",", ":"), default=str)
    return normalize_scalar(value)


def normalize_rows(table: str, rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    excluded = EXCLUDED_COLUMNS[table]
    return [
        {
            column: normalize_value(table, column, value)
            for column, value in row.items()
            if column not in excluded
        }
        for row in rows
    ]


def build_bigquery_client(service_account_json: str) -> Any:
    try:
        from google.cloud import bigquery
        from google.oauth2 import service_account
    except ImportError as error:
        raise SyncError("Google Cloud Python 의존성이 없습니다. requirements-sync.txt를 설치해주세요.") from error

    try:
        service_account_info = json.loads(service_account_json)
        credentials = service_account.Credentials.from_service_account_info(service_account_info)
    except (ValueError, TypeError, KeyError) as error:
        raise SyncError("GCP_SERVICE_ACCOUNT_JSON 형식이 올바르지 않습니다.") from error

    return bigquery.Client(project=GCP_PROJECT_ID, credentials=credentials)


def load_rows_to_bigquery(client: Any, table: str, rows: list[dict[str, Any]]) -> None:
    from google.cloud import bigquery

    table_id = f"{GCP_PROJECT_ID}.{BIGQUERY_DATASET_ID}.{table}"
    temporary_path: Path | None = None
    try:
        with tempfile.NamedTemporaryFile(
            mode="w",
            encoding="utf-8",
            suffix=".ndjson",
            prefix=f"pookie-{table}-",
            delete=False,
        ) as temporary_file:
            temporary_path = Path(temporary_file.name)
            for row in rows:
                temporary_file.write(json.dumps(row, ensure_ascii=False, separators=(",", ":")))
                temporary_file.write("\n")

        job_config = bigquery.LoadJobConfig(
            source_format=bigquery.SourceFormat.NEWLINE_DELIMITED_JSON,
            autodetect=True,
            write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE,
            max_bad_records=0,
        )
        with temporary_path.open("rb") as source_file:
            job = client.load_table_from_file(source_file, table_id, job_config=job_config)
            job.result()
        LOGGER.info("[%s] BigQuery에 %d행 적재 완료", table, len(rows))
    finally:
        if temporary_path:
            temporary_path.unlink(missing_ok=True)


def sync_table(
    session: Any,
    supabase_url: str,
    bigquery_client: Any,
    table: str,
) -> None:
    rows = fetch_all_rows(session, supabase_url, table)
    if not rows:
        LOGGER.warning("[%s] 0행이므로 기존 BigQuery 테이블을 유지하고 건너뜁니다.", table)
        return
    normalized_rows = normalize_rows(table, rows)
    load_rows_to_bigquery(bigquery_client, table, normalized_rows)


def main() -> int:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
    try:
        environment = required_environment()
        supabase_url = normalize_supabase_url(environment["SUPABASE_URL"])
        session = build_supabase_session(environment["SUPABASE_SECRET_KEY"])
        bigquery_client = build_bigquery_client(environment["GCP_SERVICE_ACCOUNT_JSON"])
    except SyncError as error:
        LOGGER.error("%s", error)
        return 1

    failures: dict[str, str] = {}
    for table in TABLE_PRIMARY_KEYS:
        try:
            sync_table(session, supabase_url, bigquery_client, table)
        except Exception as error:  # 테이블별 실패를 모은 뒤 전체 작업을 실패 처리한다.
            message = str(error) if isinstance(error, SyncError) else error.__class__.__name__
            failures[table] = message
            LOGGER.error("[%s] 동기화 실패: %s", table, message)

    if failures:
        LOGGER.error("동기화 실패 테이블: %s", ", ".join(failures))
        return 1

    LOGGER.info("Supabase → BigQuery 동기화가 모두 완료됐습니다.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
