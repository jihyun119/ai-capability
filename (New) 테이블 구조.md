# (New) 테이블 구조

상태: 진행 중

![image.png]((New)%20%ED%85%8C%EC%9D%B4%EB%B8%94%20%EA%B5%AC%EC%A1%B0/image.png)

```
로그인 없음
닉네임 기반 임시 응시자 사용
프론트는 GitHub Pages
DB는 Supabase
백엔드는 Supabase Edge Functions
Track 1, Track 2만 MVP 포함
Track 3는 제외
```

---

# 1. MVP 최종 테이블 구조

MVP에서는 아래 4개 테이블만 쓴다.

```
1. respondents
2. track1_results
3. track2_results
4. diagnosis_answers
```

`test_sessions`는 이번 MVP에서는 제외한다.

이유는 사용자가 한 번에 Track 1, 2를 하지 않을 수 있고, 방문 세션 기준으로 묶으면 재방문 연결이 약해지기 때문이다.

대신 `respondents`를 중심으로 묶는다.

---

# 2. 전체 연결 구조

```
respondents
   ├── track1_results
   │       └── diagnosis_answers
   │
   └── track2_results
           └── diagnosis_answers
```

의미는 이렇다.

```
respondents
= 임시 응시자

track1_results
= Track 1 최종 결과

track2_results
= Track 2 최종 결과

diagnosis_answers
= Track 1, Track 2 문항별 원본 답변
```

---

# 3. 전체 서비스 흐름

```
1. 사용자가 사이트 접속
2. 닉네임, 성별, 출생년도 입력
3. respondents 생성
4. respondent_id와 access_token을 localStorage에 저장

5. 사용자가 Track 1 또는 Track 2 선택

6-A. Track 1 진행
   - 객관식 12문항 응답
   - 외부 LLM JSON 붙여넣기
   - Supabase Edge Function으로 제출
   - track1_results 저장
   - diagnosis_answers에 Q1~Q12 저장
   - 결과 화면 표시

6-B. Track 2 진행
   - 객관식 4문항 응답
   - 외부 AI 답변 freeText 붙여넣기
   - Supabase Edge Function으로 제출
   - 백엔드에서 LLM feature extraction
   - track2_results 저장
   - diagnosis_answers에 Q1~Q4 저장
   - 결과 화면 표시

7. 공유 링크 접근
   - share_slug로 track1_results 또는 track2_results 조회
```

---

# 4. 공통 API JSON 스키마

모든 성공 응답은 이 구조를 따른다.

```json
{
  "status": "success",
  "track": "track1",
  "version": "track1-v1",
  "resultId": "res_abc123",
  "shareSlug": "abc123",
  "createdAt": "2026-05-24T12:00:00.000Z",
  "result": {}
}
```

모든 실패 응답은 이 구조를 따른다.

```json
{
  "status": "error",
  "track": "track1",
  "version": "track1-v1",
  "error": {
    "code": "INVALID_INPUT",
    "message": "입력값이 올바르지 않습니다.",
    "retryable": true
  }
}
```

에러 코드는 MVP에서는 이 정도면 충분하다.

```
INVALID_INPUT
INVALID_QUESTIONNAIRE
INVALID_LLM_RESULT
INSUFFICIENT_HISTORY
PRIVACY_BLOCKED
LLM_FEATURE_EXTRACTION_FAILED
INTERNAL_ERROR
```

---

# 5. respondents 테이블

## 의미

`respondents`는 로그인 없는 임시 응시자 테이블이다.

회원가입이 아니고, 닉네임 기반으로 사용자를 임시 구분하기 위한 테이블이다.

## 필요한 이유

```
1. 로그인 없이도 사용자를 구분할 수 있다.
2. 같은 사용자가 Track 1, Track 2를 따로 해도 연결할 수 있다.
3. localStorage에 respondent_id를 저장해 재방문 시 이어갈 수 있다.
4. 결과 테이블들이 공통으로 respondent_id를 참조할 수 있다.
```

## Supabase SQL

```sql
create table respondents (
  id uuid primary key default gen_random_uuid(),

  nickname text not null,
  gender text,
  birth_year smallint,

  access_token text not null unique,

  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),

  constraint respondents_gender_check
    check (gender in ('male', 'female', 'other') or gender is null),

  constraint respondents_birth_year_check
    check (birth_year is null or (birth_year between 1900 and 2026))
);
```

## 컬럼 설명

```
id
- 임시 응시자 고유 ID

nickname
- 사용자가 입력한 닉네임

gender
- 선택 입력
- male, female, other, null

birth_year
- 선택 입력
- 예: 2000

access_token
- localStorage에 저장할 임시 토큰
- 로그인은 아니지만 결과 제출 시 본인 확인용으로 사용

created_at
- 최초 생성 시각

last_seen_at
- 마지막 접속 또는 마지막 제출 시각
```

---

# 6. track1_results 테이블

## 의미

Track 1, AI 관계 유형 테스트의 최종 결과를 저장하는 테이블이다.

## 필요한 이유

```
1. Track 1 결과 화면을 다시 보여줄 수 있다.
2. 공유 링크를 만들 수 있다.
3. 유형별 분포를 분석할 수 있다.
4. 축별 점수와 결과 카드를 저장할 수 있다.
```

## Supabase SQL

```sql
create table track1_results (
  result_id uuid primary key default gen_random_uuid(),

  respondent_id uuid not null references respondents(id) on delete cascade,

  nickname_snapshot text not null,

  version text not null default 'track1-v1',
  status text not null default 'success',
  questionnaire_version text not null default 'track1-12-v1',

  mc_raw_answers jsonb not null,
  mc_scores jsonb not null,

  llm_result_sanitized jsonb,
  prompt_scores jsonb,

  final_scores jsonb not null,

  type_code smallint not null,
  type_name text not null,
  binary_profile jsonb not null,
  result_card jsonb not null,

  evidence_mode text,
  evidence_notice text,

  share_slug text not null unique,

  created_at timestamptz not null default now(),

  constraint track1_status_check
    check (status in ('success', 'error')),

  constraint track1_type_code_check
    check (type_code between 1 and 16)
);
```

## 컬럼 설명

```
result_id
- Track 1 결과 ID

respondent_id
- respondents.id 참조
- 어떤 임시 응시자의 결과인지 연결

nickname_snapshot
- 결과 생성 당시 닉네임
- 나중에 respondent 닉네임이 바뀌어도 결과 화면에 당시 닉네임 표시 가능

version
- Track 1 채점 로직 버전

status
- success 또는 error

questionnaire_version
- track1-12-v1

mc_raw_answers
- Q1~Q12 객관식 원본 답변
- 예: {"Q1":5,"Q2":4,...}

mc_scores
- 객관식 축별 점수
- 예: {"A":83,"B":25,"C":58,"D":91}

llm_result_sanitized
- 외부 LLM 결과 중 개인정보 제거/정제된 JSON

prompt_scores
- 외부 LLM signals/notes 기반 축별 점수

final_scores
- mc 40% + prompt 60% 통합 점수
- 예: {"A":86,"B":31,"C":58,"D":91}

type_code
- 1~16 유형 코드

type_name
- 예: 선긋는 상사형

binary_profile
- 고/저 조합
- 예: {"A":"고","B":"저","C":"고","D":"고"}

result_card
- 프론트가 결과 카드 렌더링할 JSON

evidence_mode
- visible_history, memory_or_impression, self_report, minimal

evidence_notice
- 결과 카드 하단 근거 안내

share_slug
- 공유 링크용 문자열

created_at
- 결과 생성 시각
```

---

# 7. track2_results 테이블

## 의미

Track 2, AI 역량평가 Lv.1 결과를 저장하는 테이블이다.

## 필요한 이유

```
1. Track 2 결과 화면을 다시 보여줄 수 있다.
2. 총점, 등급, 축별 점수를 저장할 수 있다.
3. 공유 링크를 만들 수 있다.
4. 나중에 평균 점수, 등급 분포를 분석할 수 있다.
```

## Supabase SQL

```sql
create table track2_results (
  result_id uuid primary key default gen_random_uuid(),

  respondent_id uuid not null references respondents(id) on delete cascade,

  nickname_snapshot text not null,

  version text not null default 'track2-v1',
  status text not null default 'success',
  questionnaire_version text not null default 'track2-4-v1',

  mc_raw_answers jsonb not null,
  mc_scores jsonb not null,

  extracted_features jsonb,
  prompt_scores jsonb,

  final_scores jsonb not null,

  total_score numeric(5, 2) not null,
  grade text not null,
  usage_type text,

  feedback jsonb not null,

  share_slug text not null unique,

  created_at timestamptz not null default now(),

  constraint track2_status_check
    check (status in ('success', 'error')),

  constraint track2_total_score_check
    check (total_score >= 0 and total_score <= 100)
);
```

## 컬럼 설명

```
result_id
- Track 2 결과 ID

respondent_id
- respondents.id 참조

nickname_snapshot
- 결과 생성 당시 닉네임

version
- Track 2 채점 로직 버전

status
- success 또는 error

questionnaire_version
- track2-4-v1

mc_raw_answers
- Q1~Q4 객관식 원본 답변
- 예: {"Q1":"D","Q2":"D","Q3":"B","Q4":"C"}

mc_scores
- 객관식 축별 환산 점수

extracted_features
- 백엔드 LLM이 freeText에서 추출한 evidence/frequency/features
- 원문 freeText 전체 대신 이 값을 저장 권장

prompt_scores
- 줄글 기반 축별 점수

final_scores
- 6개 축 최종 점수
- 예: {"task_clarity":17.2,"context":15.6,...}

total_score
- 100점 만점 총점

grade
- AI 파트너형, AI 활용형, AI 탐색형, AI 입문형, AI 초보형

usage_type
- 구조설계형, 반복개선형 등 Track 2 활용 유형

feedback
- 강점, 약점, 총평 JSON

share_slug
- 공유 링크용 문자열

created_at
- 결과 생성 시각
```

주의:

```
Track 2 freeText 원문은 MVP에서는 저장하지 않는 것을 추천.
개인정보 위험이 있으므로 extracted_features만 저장.
```

---

# 8. diagnosis_answers 테이블

## 의미

Track 1, Track 2의 객관식 문항별 답변을 한 줄씩 저장하는 공통 테이블이다.

## 필요한 이유

```
1. 문항별 응답 분포를 분석할 수 있다.
2. 점수 로직이 바뀌어도 재계산할 수 있다.
3. 어떤 문항이 변별력이 약한지 확인할 수 있다.
4. Track 1, Track 2 문항 개선에 필요하다.
```

## Supabase SQL

```sql
create table diagnosis_answers (
  id uuid primary key default gen_random_uuid(),

  respondent_id uuid not null references respondents(id) on delete cascade,

  result_id uuid not null,

  track text not null,
  questionnaire_version text not null,

  question_key text not null,
  answer_value text not null,
  axis_key text not null,

  created_at timestamptz not null default now(),

  constraint diagnosis_answers_track_check
    check (track in ('track1', 'track2')),

  constraint diagnosis_answers_axis_check
    check (axis_key in (
      'A',
      'B',
      'C',
      'D',
      'multi',
      'task_clarity',
      'context',
      'role',
      'output_format',
      'iteration',
      'critical_review'
    ))
);
```

## 컬럼 설명

```
id
- 답변 row ID

respondent_id
- 어떤 응시자의 답변인지 연결

result_id
- 어떤 결과에 속한 답변인지 연결
- track1_results.result_id 또는 track2_results.result_id

track
- track1 또는 track2

questionnaire_version
- track1-12-v1 또는 track2-4-v1

question_key
- Q1, Q2 ...

answer_value
- Track 1: 1~5
- Track 2: A~E

axis_key
- Track 1: A, B, C, D
- Track 2: multi 권장
- Track 2는 한 문항이 여러 축에 기여하기 때문

created_at
- 답변 저장 시각
```

---

# 9. Track 1 API JSON

## Request

```json
{
  "respondentId": "uuid",
  "accessToken": "token",
  "questionnaireVersion": "track1-12-v1",
  "questionnaire": {
    "answers": {
      "Q1": 5,
      "Q2": 4,
      "Q3": 5,
      "Q4": 2,
      "Q5": 2,
      "Q6": 2,
      "Q7": 3,
      "Q8": 3,
      "Q9": 4,
      "Q10": 5,
      "Q11": 5,
      "Q12": 4
    }
  },
  "llmResult": {
    "status": "success",
    "evidence_mode": "visible_history",
    "evidence_notice": "Assessment based on repeated observable interaction patterns.",
    "signals": {
      "A": "high",
      "B": "low",
      "C": "medium",
      "D": "high"
    },
    "confidence": {
      "A": "high",
      "B": "medium",
      "C": "medium",
      "D": "high"
    },
    "notes": {
      "A": "Frequently integrates AI into ongoing task workflows.",
      "B": "Uses a task-focused tone with limited emotional engagement.",
      "C": "Builds on useful AI outputs while checking details as quality control.",
      "D": "Consistently specifies goals, structure, format, and revision direction."
    },
    "verdict": "A structured user who treats AI as a productivity tool.",
    "tags": ["workflow-heavy", "task-focused", "directive"]
  }
}
```

## Response

```json
{
  "status": "success",
  "track": "track1",
  "version": "track1-v1",
  "resultId": "uuid",
  "shareSlug": "abc123",
  "createdAt": "2026-05-24T12:00:00.000Z",
  "result": {
    "decisionState": "diagnosable",
    "type": {
      "id": 12,
      "name": "선긋는 상사형"
    },
    "binaryProfile": {
      "A": "고",
      "B": "저",
      "C": "고",
      "D": "고"
    },
    "axisScores": {
      "A": {
        "label": "의존도",
        "score": 86,
        "level": "높음",
        "gauge": "■■■■■■■■■░"
      },
      "B": {
        "label": "친밀도",
        "score": 31,
        "level": "낮음",
        "gauge": "■■■░░░░░░░"
      },
      "C": {
        "label": "신뢰도",
        "score": 58,
        "level": "중간",
        "gauge": "■■■■■■░░░░"
      },
      "D": {
        "label": "통제욕구",
        "score": 91,
        "level": "높음",
        "gauge": "■■■■■■■■■░"
      }
    },
    "resultCard": {
      "title": "선긋는 상사형",
      "description": "자주 쓰지만 휘둘리진 않습니다.\\n조건은 정확히 줍니다.\\n결과는 끝까지 직접 판단합니다.\\n\\nAI를 믿기보다 부리는 타입.",
      "keywords": ["업무형", "거리두기", "명확한지시"],
      "reasonStory": [
        "AI를 그냥 맡기지 않습니다.",
        "조건을 세우고 방향을 잡습니다.",
        "답이 와도 그대로 두지 않습니다.",
        "끝까지 직접 판단합니다.",
        "그래서 이 유형은 믿기보다 부리는 사람에 가깝습니다."
      ],
      "evidenceNotice": "확인된 대화 기록 기반 결과입니다."
    }
  }
}
```

---

# 10. Track 2 API JSON

## Request

```json
{
  "respondentId": "uuid",
  "accessToken": "token",
  "questionnaireVersion": "track2-4-v1",
  "answers": {
    "Q1": "D",
    "Q2": "D",
    "Q3": "B",
    "Q4": "C"
  },
  "freeText": "I usually give the AI my goal, audience, and constraints before asking for an output..."
}
```

## Response

```json
{
  "status": "success",
  "track": "track2",
  "version": "track2-v1",
  "resultId": "uuid",
  "shareSlug": "xyz789",
  "createdAt": "2026-05-24T12:00:00.000Z",
  "result": {
    "total": 78.4,
    "grade": "AI 활용형",
    "usageType": "구조설계형",
    "axes": {
      "task_clarity": {
        "label": "작업 명확성",
        "score": 17.2,
        "max": 20,
        "rate": 0.86,
        "evidence": "I usually give the AI my goal"
      },
      "context": {
        "label": "배경·맥락",
        "score": 15.6,
        "max": 20,
        "rate": 0.78,
        "evidence": "audience"
      },
      "role": {
        "label": "역할 지정",
        "score": 8.5,
        "max": 15,
        "rate": 0.57,
        "evidence": "NONE"
      },
      "output_format": {
        "label": "출력 형식",
        "score": 11.2,
        "max": 15,
        "rate": 0.75,
        "evidence": "table format"
      },
      "iteration": {
        "label": "반복 개선",
        "score": 13,
        "max": 15,
        "rate": 0.87,
        "evidence": "I ask it to revise"
      },
      "critical_review": {
        "label": "비판적 검토",
        "score": 12.9,
        "max": 15,
        "rate": 0.86,
        "evidence": "I check whether the answer fits"
      }
    },
    "feedback": {
      "strengths": ["작업 명확성", "반복 개선"],
      "weaknesses": ["역할 지정", "배경·맥락"],
      "summary": "요청의 목표와 수정 방향을 비교적 잘 잡는 편입니다. 다만 AI에게 어떤 전문가 역할로 답해야 하는지 더 명확히 지정하면 결과의 일관성이 좋아집니다."
    }
  }
}
```

---

# 11. 공유 링크 조회 흐름

Track별 공유 링크는 이렇게 처리한다.

```
/api/results/track1/:shareSlug
→ track1_results에서 share_slug 조회
→ result_card + axisScores 반환

/api/results/track2/:shareSlug
→ track2_results에서 share_slug 조회
→ total + grade + axes + feedback 반환
```

MVP에서는 공통 `/api/results/:shareSlug` 하나로 합치기보다 Track별로 나누는 게 구현이 쉽다.

---

# 12. 최종 저장 정책

```
저장한다
- respondents 기본 정보
- 객관식 원본 답변
- 객관식 축별 점수
- 정제된 LLM 결과
- 추출된 evidence/features
- 최종 점수
- 결과 카드
- 공유 slug

MVP에서는 저장하지 않는다
- Track 2 freeText 원문 전체
- 민감 정보가 포함될 수 있는 긴 원문
- 디버깅용 LLM raw output 전체
```

단, 개발 중 디버깅이 꼭 필요하면 별도 로그로 짧게 보관하고 배포 전에는 끄는 게 좋다.

---

# 13. 최종 결론

MVP 기준 최종 DB 구조는 이거다.

```
respondents
- 닉네임 기반 임시 응시자

track1_results
- Track 1 상세 결과

track2_results
- Track 2 상세 결과

diagnosis_answers
- 문항별 객관식 답변 공통 저장
```

이 구조면 5월 30일까지 MVP 구현에 충분하고, 이후 배포 후에도 Track 3, 대시보드, 통계, 랭킹으로 확장할 수 있다.