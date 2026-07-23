# Supabase → BigQuery 동기화 설정 안내

이 문서는 POOKIE의 Supabase 데이터를 Google BigQuery로 매시간 복제하는 기능을 설정하는 방법을 설명합니다. 실제 인증키는 저장소에 넣지 않고 GitHub Secrets로만 전달합니다.

## A. 추가된 구조

```text
Supabase
  → GitHub Actions가 매시간 17분에 Python 스크립트 실행
  → Google BigQuery
  → Looker Studio에서 조회
```

- 실행 스크립트: `scripts/sync_supabase_to_bigquery.py`
- GitHub Actions: `.github/workflows/sync-bigquery.yml`
- Python 의존성: `requirements-sync.txt`
- Google Cloud 프로젝트: `pookie-analytics`
- BigQuery 데이터셋: `pookie_supabase`
- 대상 테이블: `respondents`, `diagnosis_answers`, `track1_results`, `track2_results`, `track3_results`

각 Supabase 테이블은 같은 이름의 BigQuery 테이블로 적재됩니다. 한 번 실행할 때 전체 행을 읽고 `WRITE_TRUNCATE` 방식으로 교체합니다. Supabase 테이블이 0행이면 기존 BigQuery 테이블을 비우지 않고 그 테이블만 건너뜁니다.

> 이 기능은 BigQuery 데이터셋을 만들지 않습니다. `pookie-analytics.pookie_supabase` 데이터셋은 실행 전에 존재해야 합니다.

## B. GitHub Secrets 등록 방법

1. GitHub에서 POOKIE 저장소를 엽니다.
2. 상단의 **Settings**를 클릭합니다.
3. 왼쪽 메뉴에서 **Secrets and variables**를 펼칩니다.
4. **Actions**를 클릭합니다.
5. **New repository secret**을 눌러 아래 Secret을 하나씩 등록합니다.

| Secret 이름 | 넣을 값 |
| --- | --- |
| `SUPABASE_URL` | Supabase 프로젝트 URL. 예시 형식은 `https://프로젝트-id.supabase.co`이며 실제 값은 공개 문서나 코드에 적지 않습니다. |
| `SUPABASE_SECRET_KEY` | Supabase 서버용 Secret 키 또는 기존 service-role 키. 다섯 테이블을 읽을 수 있는 서버 전용 키를 사용합니다. |
| `GCP_SERVICE_ACCOUNT_JSON` | Google Cloud에서 내려받은 서비스 계정 JSON의 전체 내용 |

Secret 이름은 대소문자까지 표와 완전히 같아야 합니다.

## C. GCP_SERVICE_ACCOUNT_JSON 등록 방법

1. Google Cloud에서 다운로드한 서비스 계정 JSON 파일을 메모장이나 VS Code로 엽니다.
2. 첫 번째 `{`부터 마지막 `}`까지 전체 내용을 복사합니다.
3. GitHub의 **New repository secret** 화면에서 이름에 `GCP_SERVICE_ACCOUNT_JSON`을 입력합니다.
4. 값 영역에 복사한 JSON 전체를 붙여넣고 저장합니다.
5. 원본 JSON 파일은 저장소 폴더로 옮기거나 Git에 추가하지 않습니다.

서비스 계정에는 기존 `pookie_supabase` 데이터셋에 테이블을 만들고 데이터를 적재할 수 있는 BigQuery 권한이 필요합니다. 권한 변경은 이 저장소가 아니라 Google Cloud IAM에서 사용자가 직접 관리합니다.

## D. 첫 실행 방법

1. GitHub 저장소의 **Actions** 탭을 엽니다.
2. 왼쪽 목록에서 **Sync Supabase to BigQuery**를 선택합니다.
3. **Run workflow**를 클릭합니다.
4. 대상 브랜치를 확인하고 다시 **Run workflow**를 누릅니다.
5. 생성된 실행 항목을 클릭해 모든 단계가 초록색으로 완료되는지 확인합니다.

수동 실행이 성공하면 이후에는 UTC 기준 매시간 17분에 자동 실행됩니다. GitHub Actions의 cron은 UTC 기준이며 실행 부하에 따라 수 분 지연될 수 있습니다.

## E. 성공 확인 방법

BigQuery 콘솔에서 아래 테이블이 생성됐는지 확인합니다.

```text
pookie-analytics.pookie_supabase.respondents
pookie-analytics.pookie_supabase.diagnosis_answers
pookie-analytics.pookie_supabase.track1_results
pookie-analytics.pookie_supabase.track2_results
pookie-analytics.pookie_supabase.track3_results
```

예시 확인 SQL:

```sql
SELECT COUNT(*) AS row_count
FROM `pookie-analytics.pookie_supabase.track3_results`;
```

각 테이블이 0행인 경우 동기화 스크립트는 기존 BigQuery 테이블 보호를 위해 해당 테이블 적재를 건너뜁니다. 따라서 Supabase에 최초 데이터가 생긴 뒤 다시 실행해야 새 BigQuery 테이블이 만들어집니다.

## F. 오류 확인 방법

1. GitHub 저장소의 **Actions** 탭을 엽니다.
2. 실패한 **Sync Supabase to BigQuery** 실행을 클릭합니다.
3. `sync` 작업을 열고 빨간색으로 표시된 단계를 펼칩니다.
4. 아래 점검표를 순서대로 확인합니다.

- Secret 이름에 오타가 없는지 확인합니다.
- `SUPABASE_URL`이 `https://...supabase.co` 형식인지 확인합니다.
- `SUPABASE_SECRET_KEY`가 공개용 브라우저 키가 아닌 서버용 키인지 확인합니다.
- Supabase 키가 다섯 테이블을 `SELECT`할 수 있는지 확인합니다.
- Google 서비스 계정 JSON을 일부가 아닌 전체 복사했는지 확인합니다.
- Google Cloud 프로젝트에서 BigQuery API가 활성화돼 있는지 확인합니다.
- `pookie-analytics` 프로젝트에 `pookie_supabase` 데이터셋이 존재하는지 확인합니다.
- 서비스 계정에 BigQuery 작업 실행과 데이터셋 쓰기 권한이 있는지 확인합니다.
- 데이터셋 위치 정책이나 조직 정책이 작업을 막지 않는지 확인합니다.

로그에는 행 수와 실패한 테이블 이름만 표시되며 Secret과 사용자 원문은 출력하지 않습니다. 한 테이블이 실패해도 나머지 테이블을 시도한 뒤 전체 GitHub Action을 실패 상태로 종료합니다.

## G. 보안 주의사항

- `sb_secret` 또는 service-role 키를 코드, 문서, 프론트엔드 환경변수에 넣지 않습니다.
- Google 서비스 계정 JSON 파일을 커밋하거나 Pull Request에 첨부하지 않습니다.
- 키나 JSON 전체를 로그로 출력하지 않습니다.
- `SUPABASE_SECRET_KEY`를 브라우저에서 접근 가능한 공개 환경변수로 사용하지 않습니다.
- GitHub Actions 로그를 공유할 때 Secret이나 사용자 데이터가 포함되지 않았는지 다시 확인합니다.
- BigQuery에는 닉네임, access token, 공유 slug, 사용자 채팅 원문, 사용자 최종 제출 원문을 복제하지 않습니다.

## 동기화되는 데이터와 제외 데이터

스크립트는 Supabase의 실제 컬럼을 `select=*`로 조회하므로 배포 스키마의 일반 분석 컬럼을 자동으로 반영합니다. 저장소에서 확인된 다음 값은 BigQuery에서 제외하거나 원문을 제거합니다.

- `respondents`: `nickname`, `access_token` 제외
- Track 1: 닉네임, 붙여넣은 LLM 원문, 자유 서술형 노트·판정문, 공유 slug 제외
- Track 2: 닉네임, `free_text`, 근거 원문, 상세 피드백 원문, 공유 slug 제외
- Track 3: 닉네임, 전체 채팅 `turns`, `final_output`, 자유 서술형 개입·피드백, 공유 slug 제외
- Track 3 축 점수는 `key`, `axis`, `score`, `max`, `rate`만 JSON 문자열로 보존

`respondent_id`, `birth_year`, `gender`, 문항별 답변은 분석과 테이블 연결을 위해 유지합니다. 이 값들도 조합에 따라 재식별 위험이 있을 수 있으므로 BigQuery와 Looker Studio 접근 권한을 최소 인원으로 제한하고, 외부 공개 대시보드에서는 집계값만 사용하세요.
