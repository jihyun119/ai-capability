# POOKIE — AI 활용 역량 진단 서비스

> AI를 쓰는 것과, AI를 잘 쓰는 것 사이의 간극을 진단합니다.

[서비스 체험하기](https://ai-capability-green.vercel.app/) · [GitHub 저장소](https://github.com/jihyun119/ai-capability)

POOKIE는 사용자의 **AI 활용 태도, 활용 습관, 실전 문제 해결 과정**을 단계적으로 분석하는 웹 기반 AI 역량 진단 서비스입니다.

가볍게 참여할 수 있는 AI 관계 유형 테스트부터, 업무 상황에서의 활용 방식 분석, 직무별 인앱 채팅 기반 실전 평가까지 총 3개의 Track으로 구성되어 있습니다.

현재 저장소에는 정적 웹 프론트엔드, Vercel Serverless API, Track별 채점 로직, OpenAI 연동 및 fallback 로직, Supabase 저장 기능, 결과 공유 UI와 자동화 테스트가 포함되어 있습니다.

---

## 1. 서비스 배경

ChatGPT, Claude 등 생성형 AI는 과제, 취업 준비, 기획, 분석, 보고서 작성과 같은 일상 및 업무 과정에 빠르게 통합되고 있습니다. 하지만 AI를 자주 사용하는 것만으로 실제 활용 역량을 설명하기는 어렵습니다.

POOKIE는 다음 질문에 답하기 위해 시작되었습니다.

- 나는 AI를 어떤 태도로 사용하고 있는가?
- 전문적인 작업에서 AI를 얼마나 구조적으로 활용하는가?
- 실제 문제 상황에서 AI와 대화하며 결과물을 개선할 수 있는가?

단순 사용 빈도가 아니라 **목표 설정, 맥락 제공, 결과 검토, 반복 개선, 의사결정 개입**과 같은 행동을 기준으로 사용자의 AI 활용 방식을 보여주는 것이 서비스의 핵심입니다.

---

## 2. 서비스 구조

사용자는 원하는 Track부터 시작할 수 있으며, Track 1에서 Track 3으로 갈수록 평가 깊이와 난이도가 높아집니다.

| Track | 진단명 | 주요 방식 | 결과 |
|---|---|---|---|
| Track 1 | AI 관계 유형 테스트 | 12문항 객관식 + 외부 LLM 분석 JSON | 4개 관계 축과 16가지 캐릭터 유형 |
| Track 2 | AI 활용 역량 테스트 | 행동 기반 객관식 6문항 + 외부 LLM 분석문 | 6개 역량 축, 100점, 유형 및 피드백 |
| Track 3 | AI 실무 적용 테스트 | 직무별 시나리오에서 최대 5턴 인앱 채팅 | 8개 평가 축, 종합 점수, 강점·약점·개선 제안 |

---

## 3. Track별 구현 내용

### Track 1. AI 관계 유형 테스트

사용자가 AI를 대하는 관계적 태도를 가볍게 진단합니다.

#### 평가 구성

1. **객관식 12문항**
   - AI 의존도
   - 정서적 친밀도
   - AI 신뢰도
   - 사용자 통제 수준

2. **외부 LLM 분석 결과 입력**
   - 사용자가 제공된 진단 프롬프트를 평소 사용하는 ChatGPT, Claude 등의 서비스에 입력합니다.
   - 외부 LLM이 `signals`, `confidence`, `notes`, `evidence_mode`가 포함된 JSON을 반환합니다.
   - 사용자는 반환된 JSON을 POOKIE에 붙여넣습니다.

3. **백엔드 평가**
   - 잘못된 JSON 구조를 로컬 규칙 또는 LLM으로 복구합니다.
   - 숫자 점수가 포함된 비정상 출력, 원본 프롬프트 재입력, 태그 개수 오류 등을 검증합니다.
   - 객관식 점수와 외부 LLM 신호를 결합합니다.
   - 경계 구간에서는 LLM Judge 또는 객관식 방향을 이용해 유형을 결정합니다.

#### 결과

- 4개 축 점수 및 UI 레벨
- 16가지 AI 관계 유형 중 1개
- 유형명, 설명, 핵심 키워드 3개
- 유형 산출 근거
- 분석 근거 수준 안내
- 결과 이미지 저장 및 공유

---

### Track 2. AI 활용 역량 테스트

전문적인 작업에서 사용자가 AI를 어떻게 활용하는지 분석합니다.

#### 평가 구성

- 행동 기반 객관식 6문항
- 사용자의 과거 AI 상호작용 습관을 설명하는 외부 LLM 분석문 1개

#### 평가 축

| 평가 축 | 만점 |
|---|---:|
| 작업 명확성 | 20점 |
| 배경·맥락 | 20점 |
| 역할 지정 | 15점 |
| 출력 형식 | 15점 |
| 반복 개선 | 15점 |
| 비판적 검토 | 15점 |

#### 채점 방식

- 객관식 선택지는 각 역량 축에 서로 다른 점수를 부여합니다.
- 객관식 점수는 축별 최대값을 기준으로 정규화합니다.
- 외부 LLM 분석문에서는 축별 키워드 주변의 빈도 표현을 탐색해 점수를 산출합니다.
- 최종 축 점수는 다음 비율로 결합합니다.

```text
객관식 점수 40% + 분석문 점수 60%
```

객관식 구조상 모든 축에서 동시에 만점을 얻기 어려운 점을 보정하기 위해 기본 점수 `9.8`이 종합 점수에 더해집니다.

#### 결과 유형

| 점수 구간 | 유형 |
|---|---|
| 85점 이상 | AI 파트너형 |
| 70점 이상 85점 미만 | AI 활용형 |
| 55점 이상 70점 미만 | AI 탐색형 |
| 40점 이상 55점 미만 | AI 입문형 |
| 40점 미만 | AI 초보형 |

#### 결과

- 100점 만점 종합 점수
- 6개 축 레이더 차트
- 점수 구간별 상대 위치 표시
- 강점과 보완점
- AI 활용 스타일 요약
- 결과 이미지 저장 및 공유

---

### Track 3. AI 실무 적용 테스트

가상의 직무 상황에서 사용자가 AI와 직접 대화하며 실제 결과물을 만드는 과정을 평가합니다.

#### 제공 시나리오

현재 3개의 직무별 시나리오가 구현되어 있습니다.

| 분야 | 시나리오 |
|---|---|
| PM | 분기 핵심 기능 우선순위 결정 |
| 마케팅 | 신제품 재구매율 개선 캠페인 |
| 데이터 분석 | 사업 성과 변화 분석 프로젝트 |

각 시나리오는 다음 정보를 포함합니다.

- 사용자 역할
- 업무 상황 및 미션
- 활용 가능한 정보
- 제약 조건
- 최종 산출물 필수 항목
- 평가용 중요 맥락과 좋은 결과물·나쁜 결과물 기준

#### 대화 방식

- 서비스 내부 채팅에서 AI와 최대 5턴까지 대화합니다.
- 사용자 메시지는 공백 제외 5자 이상이어야 합니다.
- AI 응답과 별도로 왼쪽 산출물 영역이 누적·수정됩니다.
- AI가 수정했다고 선언한 산출물 구간만 병합합니다.
- 단순 맥락 전달만 한 경우 불필요한 산출물 변경을 차단합니다.
- 반복 프롬프트는 유효 턴으로 중복 계산하지 않습니다.
- 5턴 이전에도 조기 제출할 수 있으나 완료도 보정이 적용됩니다.

#### 평가 축

- 목표 정의
- 맥락 제공
- 정보 구조화
- 작업 분해
- 출력 설계
- 상호작용 조율
- 검증 유도
- 실무 적용

#### 채점 구조

```text
LLM Judge 평가 80점 + 코드 기반 검사 20점
```

추가로 다음 항목을 반영합니다.

- 실제 유효 대화 턴 수
- 시나리오 문구 단순 재진술 여부
- 반복 프롬프트 여부
- 사용자 개입과 개선 과정
- 최종 산출물 완성도
- 조기 종료 여부

OpenAI API 키가 없는 경우에도 휴리스틱 기반 fallback 평가가 동작합니다.

#### 결과 유형

| 점수 구간 | 유형 |
|---|---|
| 85점 이상 | 실전 위임형 |
| 70점 이상 85점 미만 | 구조화 활용형 |
| 55점 이상 70점 미만 | 기본 활용형 |
| 55점 미만 | 초안 의존형 |

#### 결과

- 100점 만점 종합 점수
- 8개 축별 점수와 근거
- 가장 잘한 개입과 놓친 개입
- 강점 및 약점 요약
- 가장 낮은 축을 기준으로 한 개선 제안
- 결과 저장 및 조회

---

## 4. 주요 기능

- 반응형 웹 UI
- 닉네임, 출생연도, 성별 기반 응시자 생성
- Track 1·2 외부 LLM 결과 붙여넣기
- Track 3 인앱 AI 채팅 및 산출물 편집
- OpenAI 연동 상태 확인
- API 키 미설정 시 fallback 모드
- Supabase 결과 저장
- 결과 ID 기반 조회
- Track 1·2 결과 이미지 저장 및 Web Share 지원
- 입력값 검증 및 공통 오류 응답
- Track별 로컬 테스트 및 E2E 스크립트

---

## 5. 기술 스택

### Frontend

- HTML
- CSS
- Vanilla JavaScript
- Marked
- DOMPurify

### Backend

- Node.js ES Modules
- Vercel Serverless Functions
- OpenAI API
- Supabase REST API / PostgreSQL

### Deployment

- Vercel

### Test

- Node.js Test Runner

---

## 6. 프로젝트 구조

```text
.
├── api/                         # Vercel 진입용 API re-export
│   ├── respondents/
│   ├── track1/
│   ├── track2/
│   └── track3/
├── backend/
│   ├── api/                     # 실제 Serverless API 핸들러
│   ├── db.js                    # Supabase 저장 및 결과 조회
│   ├── feedback.js              # Track 2 피드백 생성
│   └── validate.js              # 공통 입력 검증
├── frontend/
│   ├── index.html
│   ├── app.js                   # 화면 렌더링 및 클라이언트 상태 관리
│   ├── styles.css
│   ├── track3.css
│   ├── track3-ui.js
│   ├── assets/
│   ├── characters-final/
│   ├── fonts/
│   └── preview-server.cjs
├── src/
│   ├── shared/env.js
│   ├── track1/                  # 검증, 복구, 점수 결합, 16유형 매핑
│   ├── track2/                  # 6축 규칙 기반 채점
│   └── track3/                  # 시나리오, 채팅, 코드 검사, LLM Judge
├── scripts/                     # Track별 로컬 실행 및 E2E 스크립트
├── examples/                    # Track 1 샘플 입력
├── test/                        # 자동화 테스트
├── .env.example
├── package.json
└── vercel.json
```

---

## 7. 로컬 실행

### 요구 사항

- Node.js 20 이상
- npm

### 설치

```bash
git clone https://github.com/jihyun119/ai-capability.git
cd ai-capability
npm install
```

### 환경변수 설정

루트의 `.env.example`을 복사해 `.env`를 생성합니다.

```bash
cp .env.example .env
```

Windows PowerShell에서는 다음 명령을 사용할 수 있습니다.

```powershell
Copy-Item .env.example .env
```

`.env` 예시:

```env
OPENAI_API_KEY=

ENABLE_TRACK3_CHAT_MODEL=true
ENABLE_TRACK3_LLM_JUDGE=true

TRACK3_CHAT_MODEL=gpt-4o-mini
TRACK3_JUDGE_MODEL=gpt-4o-mini
TRACK3_CHAT_TIMEOUT_MS=20000
TRACK3_JUDGE_TIMEOUT_MS=20000
```

- `OPENAI_API_KEY`가 없으면 Track 3 채팅과 평가가 fallback 모드로 동작합니다.
- `ENABLE_TRACK3_CHAT_MODEL=false`로 설정하면 채팅만 fallback 모드로 고정할 수 있습니다.
- `ENABLE_TRACK3_LLM_JUDGE=false`로 설정하면 평가만 휴리스틱 모드로 고정할 수 있습니다.

Supabase 저장 기능을 사용하려면 배포 환경 또는 백엔드 환경에 다음 값을 설정합니다.

```env
SUPABASE_URL=your-supabase-project-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

> `SUPABASE_SERVICE_ROLE_KEY`는 브라우저에 노출하면 안 됩니다. 반드시 서버 환경변수로만 관리합니다.

### 프론트엔드 미리보기

```bash
npm run frontend:preview
```

브라우저에서 다음 주소로 접속합니다.

```text
http://127.0.0.1:4173/
```

이 서버는 정적 프론트엔드 확인용입니다. Serverless API까지 함께 실행하려면 Vercel 개발 환경을 사용하거나 배포된 API 주소를 연결해야 합니다.

---

## 8. 실행 및 검증 스크립트

```bash
# 전체 자동화 테스트
npm test

# Track 1 샘플 백엔드 평가
npm run track1:backend:sample

# Track 1 E2E
npm run track1:e2e

# Track 2 점수 계산 확인
npm run track2:test

# Track 2 E2E
npm run track2:e2e

# Track 3 로컬 데모
npm run track3:demo
```

현재 테스트 스위트는 다음 동작을 포함해 검증합니다.

- Track 1 JSON 스키마 검증 및 복구
- Track 1 숫자 점수 입력 차단
- Track 1 원본 프롬프트 재입력 탐지
- Track 1 객관식 축별 채점과 16유형 매핑
- Track 2 원본 프롬프트 오입력 탐지
- Track 2 입력 검증
- Track 3 최소 글자 수 및 최대 턴 제한
- Track 3 반복 프롬프트와 유효 턴 계산
- Track 3 산출물 구간 병합과 오염 제거
- Track 3 시나리오 복사 탐지
- Track 3 LLM 80점 + 코드 검사 20점 결합
- OpenAI 미사용 fallback 평가

---

## 9. API

### 응시자

| Method | Endpoint | 설명 |
|---|---|---|
| POST | `/api/respondents` | 응시자 생성 및 접근 토큰 발급 |

### Track 1

| Method | Endpoint | 설명 |
|---|---|---|
| POST | `/api/track1/submit` | JSON 복구·검증, 객관식 결합, 유형 산출 |
| POST | `/api/track1/save` | Track 1 결과 Supabase 저장 |

### Track 2

| Method | Endpoint | 설명 |
|---|---|---|
| POST | `/api/track2/submit` | 객관식과 분석문 채점 및 피드백 생성 |
| POST | `/api/track2/save` | Track 2 결과 Supabase 저장 |
| GET | `/api/track2/:resultId` | 저장된 Track 2 결과 조회 |

### Track 3

| Method | Endpoint | 설명 |
|---|---|---|
| GET | `/api/track3/scenarios` | 시나리오 목록 조회 |
| POST | `/api/track3/chat` | AI 응답 및 산출물 업데이트 |
| POST | `/api/track3/submit` | 전체 대화와 최종 산출물 평가 |
| POST | `/api/track3/save` | Track 3 결과 Supabase 저장 |
| GET | `/api/track3/:resultId` | 저장된 Track 3 결과 조회 |
| GET | `/api/track3/health` | OpenAI 연결 및 fallback 상태 확인 |

### Track 3 상태 확인 예시

```http
GET /api/track3/health
```

응답 예시:

```json
{
  "status": "success",
  "track": "track3",
  "result": {
    "openaiConfigured": true,
    "chatMode": "openai",
    "judgeMode": "openai",
    "scenarioCount": 3,
    "maxTurns": 5
  }
}
```

### Track 3 채팅 요청 예시

```json
{
  "scenarioId": "da_001",
  "turns": [],
  "userMessage": "핵심 문제를 먼저 정의하고 분석 우선순위를 세워주세요.",
  "artifact": ""
}
```

### Track 3 제출 요청 예시

```json
{
  "scenarioId": "da_001",
  "turns": [
    {
      "role": "user",
      "content": "신규 고객 증가와 매출 감소의 관계를 먼저 정리해주세요."
    },
    {
      "role": "assistant",
      "content": "재구매율과 평균 주문 금액을 우선 확인하겠습니다."
    }
  ],
  "finalOutput": "# 핵심 문제\n...\n# 분석 계획\n...\n# 다음 액션\n...",
  "earlyFinish": false
}
```

---

## 10. 데이터 저장

Supabase에는 다음 테이블을 사용하는 구조가 구현되어 있습니다.

- `respondents`
- `track1_results`
- `track2_results`
- `track3_results`
- `diagnosis_answers`

기본 흐름은 다음과 같습니다.

```text
응시자 생성
→ respondentId 및 accessToken 발급
→ Track 평가 API 호출
→ 결과 ID 생성
→ save API를 통한 비동기 저장
→ resultId 기반 결과 조회 및 공유
```

Track 2는 `respondentId`와 `accessToken` 없이도 데모 채점이 가능하며, 이 경우 DB 저장 없이 `demo_` 접두사가 붙은 임시 결과 ID를 반환합니다.

Track 3의 평가 API도 먼저 평가 결과를 반환하고, 영구 저장은 별도의 `/api/track3/save` 요청으로 처리합니다.

---

## 11. 배포

이 프로젝트는 Vercel 배포 구조를 사용합니다.

`vercel.json`은 루트 요청을 `frontend/index.html`로 연결하고, 정적 리소스 경로를 `frontend/` 디렉터리로 rewrite합니다. `/api` 디렉터리의 파일은 Vercel Serverless Functions로 배포됩니다.

Vercel 프로젝트 환경변수에는 최소 다음 값을 등록합니다.

```env
OPENAI_API_KEY=...
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

필요에 따라 Track 3 모델명, timeout, 모델 활성화 여부를 추가로 설정합니다.

---

## 12. 현재 상태

**Status: Portfolio Release**

핵심 진단 흐름과 배포 구성이 완성된 포트폴리오 릴리스입니다. 현재 저장소 기준으로 다음 기능이 구현되어 있습니다.

- Track 1 전체 화면 흐름, 채점, 유형 결과 및 공유
- Track 2 전체 화면 흐름, 규칙 기반 채점, 피드백 및 결과 시각화
- Track 3 시나리오 선택, 인앱 채팅, 산출물 작성, 평가 및 결과 화면
- OpenAI 연결과 fallback 처리
- Supabase 응시자 및 Track별 결과 저장
- 결과 ID 기반 조회
- 반응형 UI 및 데스크톱 Track 3 레이아웃
- 자동화 테스트 122개

향후에는 실사용 데이터를 기반으로 한 평가 기준 보정, Track 3 상대 순위 제공, 운영 분석 대시보드, 학습형 피드백 기능을 확장할 예정입니다.

---

## 13. 보안 및 개인정보 유의사항

- OpenAI API Key와 Supabase Service Role Key를 저장소에 커밋하지 않습니다.
- Service Role Key는 프론트엔드 코드에서 사용하지 않습니다.
- 외부 LLM 분석 프롬프트는 이름, 민감 정보, 직접 인용을 결과에서 제외하도록 설계되어 있습니다.
- 사용자가 붙여넣은 텍스트와 결과 저장 범위는 실제 배포 전 개인정보 처리방침과 함께 검토해야 합니다.

---

## 14. License

이 저장소는 포트폴리오 열람 목적으로 공개되어 있습니다. 별도의 라이선스를 부여하지 않으며, 코드와 시각 자산의 복제·배포·상업적 이용은 허용되지 않습니다.
