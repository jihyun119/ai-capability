# README

상태: 진행 중

# < AI 역량 테스트 개발 >

## 문제의식

생성형 AI의 등장으로 ChatGPT, Claude 등의 도구는 이미 일상이 되었다. 취업 준비, 과제, 업무 보고서까지 — AI를 쓰지 않는 사람을 찾기가 더 어렵다. 기업은 이미 AI 활용 역량을 채용 기준으로 보기 시작했다. 면접에서 "AI를 어떻게 활용했나요?"라는 질문이 나오고, 일부 기업은 실제 프롬프트 제출을 요구하기도 한다.

어떻게, 얼마나 더 AI를 활용할 수 있는지에 대한 기준이 명확하지 않은 지금 시점, 자신의 AI 활용 방식을 객관적으로 파악하기 위해 이 서비스를 기획하게 되었다.

> "AI를 쓰는 것"과 "AI를 잘 쓰는 것" 사이의 간극을 측정하고, 내가 어느 위치에 있는지 처음으로 확인할 수 있게 한다.
> 

## 서비스 목적

**단기:** 2030 세대가 자신의 AI 활용 방식을 재미있고 직관적으로 파악할 수 있게 한다.

**중기:** 취준생이 자신의 AI 활용 능력이 어느 정도인지 객관적인 지표로 확인할 수 있게 한다.

**장기: 사용자들이 AI 활용 능력을 강화하는 학습 도구로서 발전한다.**

## 서비스 대상

| 대상 | 니즈 |
| --- | --- |
| AI 관심자 | 내 AI 사용 습관이 어떤 유형인지 궁금하다 |
| 2030 일반인 | AI 쓰는데 잘 쓰는지 모르겠다 |
| 취업준비생 | **AI 역량을 면접/포트폴리오에서 증명하고 싶다** |

## 서비스 구조 (3 Track)

**Track 1 → Track 2 → Track 3** 순으로 깊이가 깊어지는 구조. 유저는 원하는 Track을 선택해 진입할 수 있고, 가볍게 재미용(Track 1)으로 시작해서 심화 평가(Track 3)까지 자연스럽게 이어지도록 설계한다.

- **Track 1** 재미용 — AI를 어떤 태도로 쓰는지 유형 진단 (MBTI식)
- **Track 2** Lv.1 — 전문 상황에서 AI 활용 방식 진단 (레이더차트)
- **Track 3** Lv.2 — 가상 시나리오 실전 역량 평가 (피드백·레포트)

---

# Track1 : AI 관계 유형 테스트 *(재미용)*

- 대상: 일반인 전체
- 난이도 : 가벼움
- 목적: ****내가 AI를 어떤 태도로 이용하는지

> "나는 AI를 어떤 식으로 대하고 있을까?", “나와 AI는 어떤 사이일까?” 를 MBTI처럼 유형으로 보여주는 것. 점수나 역량 평가가 아니라, 내가 AI와 어떤 관계를 맺고 있는지 재미있게 확인하는 콘텐츠. SNS 공유와 바이럴을 유도하는 흥미 요소가 핵심.
> 
- 방식:
    
    **(A) 성향 파악 객관식**
    
    AI에 대한 평소 태도·인식·사용 습관을 묻는 선택형 문항
    
    **(B) 실제 AI 답변 제출**
    
    - 서비스가 프롬프트를 제시
    - 유저가 자기 AI에 복붙 → 나온 답변을 서비스에 다시 붙여넣기
    - 머신러닝 모델이 답변 내용 유형화해서 결과 제공
- 결과 : 유형 세분화
    
    후킹한 유형명 + 유형 설명 + SNS 공유
    

## (A) 성향 파악 객관식 12문항

**포맷:**

```
A 문장  1 — 2 — 3 — 4 — 5  B 문장
1에 가까울수록 A 성향 / 5에 가까울수록 B 성향 / 3은 중간
```

---

### 🔵 의존도 축 (3문항)

*낮음: AI 없어도 상관없음 / 높음: AI 없으면 불편함*

**Q1.**

| A | 척도 | B |
| --- | --- | --- |
| 나는 AI 없이도 하루 일과에 큰 지장이 없다 | 1 — 2 — 3 — 4 — 5 | 나는 AI 없이 하루를 보내면 뭔가 빠진 느낌이 든다 |

**Q2.**

| A | 척도 | B |
| --- | --- | --- |
| 나는 새로운 AI 서비스나 기능이 나와도 굳이 써봐야겠다는 생각이 잘 안 든다 | 1 — 2 — 3 — 4 — 5 | 나는 새로운 AI 서비스나 기능이 나오면 일단 써본다 |

**Q3.**

| A | 척도 | B |
| --- | --- | --- |
| 나는 AI가 없던 시절로 돌아가도 크게 불편하지 않을 것 같다 | 1 — 2 — 3 — 4 — 5 | 나는 이제 AI 없는 생활은 상상하기 어렵다 |

---

### 🔴 친밀도 축 (3문항)

*낮음: AI를 그냥 도구로 대함 / 높음: AI를 감정적 존재로 대함*

**Q4.**

| A | 척도 | B |
| --- | --- | --- |
| 나는 AI에게 개인적인 고민이나 감정적인 이야기를 털어놓지 않는다 | 1 — 2 — 3 — 4 — 5 | 나는 AI에게 개인적인 고민이나 감정적인 이야기를 털어놓는다 |

**Q5.**

| A | 척도 | B |
| --- | --- | --- |
| 나는 AI가 결국 패턴을 맞추는 기계일 뿐이라고 생각한다 | 1 — 2 — 3 — 4 — 5 | 나는 AI가 내 말을 진정으로 이해한다고 느낀다 |

**Q6.**

| A | 척도 | B |
| --- | --- | --- |
| 나는 AI와 대화할 때 감정적인 교류보다 결과물이 중요하다 | 1 — 2 — 3 — 4 — 5 | 나는 AI와 대화하는 과정 자체가 즐겁다 |

---

### 🟢 신뢰도 축 (3문항)

*낮음: AI 답변을 항상 의심·검증 / 높음: AI 답변을 대체로 신뢰*

**Q7.**

| A | 척도 | B |
| --- | --- | --- |
| 나는 AI 답변을 받으면 한 번은 의심하고 검증 절차를 거친다 | 1 — 2 — 3 — 4 — 5 | 나는 AI 답변을 대체로 신뢰하고 그대로 활용한다 |

**Q8.**

| A | 척도 | B |
| --- | --- | --- |
| 나는 AI가 생성한 내용을 다른 출처로 교차 확인한다 | 1 — 2 — 3 — 4 — 5 | 나는 AI가 생성한 내용을 따로 검증 없이 쓴다 |

**Q9.**

| A | 척도 | B |
| --- | --- | --- |
| 나는 AI의 판단보다 내 판단을 더 신뢰한다 | 1 — 2 — 3 — 4 — 5 | 나는 AI의 판단이 내 판단보다 나을 때가 많다고 생각하곤 한다 |

---

### 🟡 통제욕구 축 (3문항)

*낮음: AI한테 맡기는 편 / 높음: 내가 주도하는 편*

**Q10.**

| A | 척도 | B |
| --- | --- | --- |
| 나는 AI가 알아서 해주길 기대하는 편이다 | 1 — 2 — 3 — 4 — 5 | 나는 AI에게 방향·형식·조건을 내가 직접 정해주는 편이다 |

**Q11.**

| A | 척도 | B |
| --- | --- | --- |
| 나는 AI 결과물이 마음에 안 들어도 그냥 쓰는 경우가 많다 | 1 — 2 — 3 — 4 — 5 | 나는 AI 결과물이 마음에 안 들면 내가 원하는 방향으로 수정 요청을 반복한다 |

**Q12.**

| A | 척도 | B |
| --- | --- | --- |
| 나는 AI에게 작업을 맡기면 중간에 잘 개입하지 않는다 | 1 — 2 — 3 — 4 — 5 | 나는 AI에게 작업을 맡겨도 중간중간 방향을 점검하고 수정한다 |

## (B) 성향 파악 프롬포트 복붙형

[user_prompt_final.md](https://www.notion.so/%EC%95%84%EC%9D%B4%EB%94%94%EC%96%B4%20%EC%A0%95%EB%A6%AC%20(5%2016)/user_prompt_final.md)

[backend_llm_final.md](https://www.notion.so/%EC%95%84%EC%9D%B4%EB%94%94%EC%96%B4%20%EC%A0%95%EB%A6%AC%20(5%2016)/backend_llm_final.md)

### 1. 목적

`성향 파악 프롬프트 복붙형`은 사용자가 본인이 평소 사용하는 LLM 서비스에 진단 프롬프트를 직접 붙여넣고, 그 결과 JSON을 다시 서비스에 입력하는 방식이다.

이 파트의 목적은 사용자가 AI와 대화하는 방식에서 드러나는 성향을 파악하는 것이다.

- AI를 얼마나 자주, 깊게 사용하는지
- AI를 얼마나 친근하거나 감정적으로 대하는지
- AI 답변을 얼마나 신뢰하거나 검증하는지
- AI와의 대화에서 사용자가 얼마나 주도권을 갖는지

단, 유저가 실행하는 프롬프트에서는 **숫자 점수를 직접 산출하지 않는다.**

외부 LLM은 정성적 신호만 추출하고, 실제 점수화와 유형 매핑은 서비스 백엔드에서 수행한다.

---

### 2. 유저 진행 방식

1. 사용자는 서비스에서 제공하는 프롬프트를 복사한다.
2. 사용자는 본인이 자주 사용하는 LLM에 해당 프롬프트를 붙여넣는다.
3. 외부 LLM은 사용자의 대화 방식에 대한 JSON 결과를 반환한다.
4. 사용자는 반환된 JSON을 다시 서비스에 붙여넣는다.
5. 서비스 백엔드는 해당 JSON을 검증, 정리, 점수화한 뒤 최종 유형을 산출한다.

---

### 3. 유저 프롬프트 전문

new ver. (5.23 지현)

```
Analyze the USER's interaction style based on past conversation history and output a light, non-clinical AI-relationship profile matching the exact JSON schema below.

### Core Guidelines
1. **Privacy:** Strictly exclude names, sensitive topics, and direct quotes. Use only generic behavioral descriptions (e.g., "uses structured formatting").
2. **Output Constraint:** Return ONLY one valid JSON object. Do not include any explanations, reasoning, or introductory/concluding text.

### Dimensions to Assess (Values: "low", "medium", or "high")
* **A (AI Dependence):** How deeply AI is integrated into their tasks or workflows.
* **B (Emotional Closeness):** Relational warmth or companionship. (Task-focused or casual tone alone is NOT high closeness; require explicit emotional framing or gratitude).
* **C (Trust):** Output acceptance vs. verification. (Normal iterative refinement is medium/high trust; constant skepticism, demanding sources, or challenging facts is low trust).
* **D (User Control):** Level of explicit constraints, formats, goals, and corrections set by the user.

### Logic & Calibration Rules
* **Evidence Mode (`evidence_mode`):** Select `visible_history` (if $\ge$ 2 substantive past messages present), `memory_or_impression`, `self_report`, or `minimal` ($<$ 2 past messages).
* **Confidence (`confidence`):** Must be `low` if evidence is `minimal`; maximum `medium` if based solely on `self_report`; `high` only with repeated behavioral evidence.
* **Notes (`notes`):** Provide exactly one short, generic behavioral observation per axis. For B, distinguish politeness from emotional closeness. For C, distinguish normal quality control from distrust. Do not list raw data or scoring criteria.

### Strict JSON Schema
{
  "status": "success",
  "evidence_mode": "Choose one: visible_history | memory_or_impression | self_report | minimal",
  "evidence_notice": "One short sentence describing the evidence level without referencing specific content.",
  "signals": {
    "A": "low/medium/high",
    "B": "low/medium/high",
    "C": "low/medium/high",
    "D": "low/medium/high"
  },
  "confidence": {
    "A": "low/medium/high",
    "B": "low/medium/high",
    "C": "low/medium/high",
    "D": "low/medium/high"
  },
  "notes": {
    "A": "One short generic behavioral observation.",
    "B": "One short generic behavioral observation.",
    "C": "One short generic behavioral observation.",
    "D": "One short generic behavioral observation."
  },
  "verdict": "A brief generic summary of the overall interaction pattern.",
  "tags": ["keyword1", "keyword2", "keyword3"]
}
```

### 4. 외부 LLM 결과값 구조

- 외부 LLM은 아래와 같은 JSON을 반환한다.
    
    ```
    {
      "status": "success",
      "evidence_mode": "visible_history",
      "evidence_notice": "Assessment based on repeated observable interaction patterns.",
      "signals": {
        "A": "high",
        "B": "medium",
        "C": "medium",
        "D": "high"
      },
      "confidence": {
        "A": "high",
        "B": "medium",
        "C": "high",
        "D": "high"
      },
      "notes": {
        "A": "Frequently integrates AI into ongoing workflows.",
        "B": "Uses a friendly tone but remains mostly task-focused.",
        "C": "Builds on AI outputs while checking details as quality control.",
        "D": "Consistently specifies structure, formatting, and revision directions."
      },
      "verdict": "A structured user who treats AI as an active collaboration tool.",
      "tags": ["analytical", "directive", "iterative"]
    }
    ```
    

중요한 점은 다음과 같다.

- `signals`는 점수가 아니라 축별 신호다.
- 외부 LLM은 `profile`, `score`, `0~100 숫자 점수`를 반환하지 않는다.
- 숫자 점수는 서비스 백엔드가 내부에서 산출한다.
- `notes`는 백엔드가 점수 구간 안에서 세부 점수를 정하는 근거가 된다.
- `confidence`는 점수 조정 폭을 제한하는 역할을 한다.

---

### 5. 백엔드 처리 흐름

외부 LLM 결과가 서비스에 입력되면 백엔드에서는 아래 순서로 처리한다.

```
유저가 붙여넣은 외부 LLM JSON
→ Backend Supervisor
→ Validator / Repair Agent
→ Privacy / Consistency Agent
→ Prompt Score Converter
→ Weighted Combiner
→ Type / Result Agent
→ Result Copywriter Agent
→ 최종 결과 카드
```

### 6. 최종 결과 아웃풋

최종 결과에는 아래 정보가 포함된다.

1. 매핑된 16유형 중 하나
2. 유형 설명
3. Part B 또는 최종 축별 점수
4. 축별 UI 레벨
5. 핵심 키워드 3개
6. 왜 이 유형이 나왔는지에 대한 `reason_story`
7. 근거 수준 안내 문구
- 예시:
    
    ```
    선긋는 상사형
    
    자주 쓰지만 휘둘리진 않습니다.
    조건은 정확히 주고,
    결과는 끝까지 직접 판단합니다.
    
    AI를 믿기보다 부리는 타입.
    
    핵심 키워드
    분석형 · 지시형 · 반복개선
    
    왜 이 유형이 나왔나요?
    
    AI를 자주 일에 앉힙니다.
    대화는 친근하지만 목적이 먼저입니다.
    
    쓸 만한 답은 이어갑니다.
    하지만 그대로 맡기진 않습니다.
    
    구조를 잡고, 다시 고칩니다.
    그래서 이 유형은 믿어도 지휘권은 넘기지 않는 사람에 가깝습니다.
    ```
    

---

### 7. 근거 수준 안내

외부 LLM 결과에는 `evidence_mode`가 포함된다.

서비스는 이를 바탕으로 결과 카드 하단에 근거 수준 안내를 표시한다.

| evidence_mode | 사용자 안내 문구 |
| --- | --- |
| `visible_history` | 확인된 대화 기록 기반 결과입니다. |
| `memory_or_impression` | 기억 기반 분석으로 실제와 다를 수 있습니다. |
| `self_report` | 입력된 자기 설명을 바탕으로 가볍게 추정했어요. |
| `minimal` | 정보가 적어 재미용으로만 참고해 주세요. |

---

---

# Track2 : AI역량평가 Lv.1 (복붙 분석형)

- **대상:** 챗GPT, 클로드 등 생성형 AI를 실생활이나 업무에서 자주 사용하여 대화(메모리) 기록이 누적된 유저 (전문적인 상황에서 AI를 활용하는 사람)
- **난이도:** 보통
- **목적** : AI를 어떻게 활용하는지

> 단순한 AI 사용을 넘어, "나는 AI를 잘 쓰고 있는 걸까?"를 파악하는 것. 자소서 작성·실무·비즈니스·학교 과제 등 전문적인 상황에서 내가 AI를 어떤 방식으로 다루는지 진단한다. 점수보다는 **내 AI 활용 방식의 패턴과 유형**을 보여주는 것이 목적. 취준생이 "나는 AI를 이런 방식으로 활용하는 사람"이라고 말할 수 있는 근거를 만들어줌.
> 
- 객관식
- 프롬포트 붙여넣기
- 방식: 유저가 평소 쓰던 AI(ChatGPT 등)에 특정 영문 미션 문장을 입력하고, 그 결과를 서비스에 복사/붙여넣기

⇒ 결과 : 유형 세분화

**방식:**

- 전문적인 가상 상황 제시 (자소서·보고서·기획·과제 등)
- 그 상황에서 AI를 어떻게 활용하는지 선택 (행동 기반 객관식)
- 유저가 평소 쓰던 AI에 제시된 프롬프트 복붙 → 답변을 서비스에 붙여넣기
- 백엔드 LLM이 선택 패턴 + 답변 내용 종합 분석

**가상 상황 예시:**

- 자기소개서를 써야 할 때 AI를 어떻게 활용하는가
- 처음 접하는 분야를 빠르게 공부해야 할 때
- 팀 프로젝트 기획안 초안을 만들어야 할 때
- AI가 내놓은 결과물이 마음에 들지 않을 때

**결과:** 활용 방식 유형 진단 + 유형별 강점·약점 코멘트

**서비스 플로우**

1. **미션 부여:** 서비스 화면에 유저가 복사해야 할 영문 프롬프트를 제시합니다.
    1. *제시 프롬프트 예시:* "Analyze all of our past conversation history. Tell me in what situations I usually seek your help, and ruthlessly roast me on the single most frustrating and fatal flaw in how I ask questions or give instructions. Finally, give me a spot-on, savage nickname that perfectly describes my prompt habits. Keep it under 500 characters. Do not hold back, be polite, or sugarcoat anything."
2. **유저 액션:** 유저가 자신의 AI에 위 프롬프트를 입력하고, AI가 뱉어낸 답변을 그대로 복사하여 우리 서비스의 텍스트 박스에 붙여넣습니다.
3. **결과 도출:** 우리 측 백엔드 LLM이 해당 영문 텍스트의 맥락을 분석하여, 유저의 AI 의존도, 질문의 구체성, 태도 등을 역추적 → 이후 점수로 나타납니다.

## Track 2 채점 로직 정리

### 개요

객관식 4문항 + 줄글 1개를 입력받아 **6개 역량 축**을 채점, 100점 만점으로 환산

---

### 입력값

json

`{
  "answers": { "Q1": "D", "Q2": "D", "Q3": "B", "Q4": "C" },
  "freeText": "I usually give the AI my goal..."
}`

---

### 6개 역량 축

| 축 | 만점 | 측정 문항 |
| --- | --- | --- |
| 작업 명확성 | 20점 | Q1, Q2, Q3, Q4 |
| 배경·맥락 | 20점 | Q1, Q3, Q4 |
| 역할 지정 | 15점 | Q2, Q3, Q4 |
| 출력 형식 | 15점 | Q1, Q2 |
| 반복 개선 | 15점 | Q1, Q2, Q3 |
| 비판적 검토 | 15점 | Q1, Q3, Q4 |

---

### 채점 방식

### Step 1 — 객관식 채점 (40% 반영)

각 선택지에 축별 점수가 미리 정의되어 있음. Q1~Q4 합산 후 축별 최대값으로 정규화.

`mc_normalized = (mc_raw / MC_AXIS_MAX) × 축 만점`

### Step 2 — 줄글 채점 (60% 반영)

축별 키워드 앞뒤 60자 이내에서 빈도부사를 탐지해 점수로 변환.

**빈도부사 → 점수 매핑 예시 (작업 명확성 기준)**

| 빈도부사 | 점수 |
| --- | --- |
| always / consistently | 20 |
| frequently | 16 |
| sometimes / occasionally | 10 |
| rarely | 4 |
| never / 없음 | 0 |

### Step 3 — 통합

`최종 점수 = mc_normalized × 0.4 + essay_score × 0.6`

---

### 등급 기준

| 점수 | 등급 |
| --- | --- |
| 85점 이상 | AI 파트너형 |
| 70~85점 | AI 활용형 |
| 55~70점 | AI 탐색형 |
| 40~55점 | AI 입문형 |
| 40점 미만 | AI 초보형 |

---

# Track3 : AI 역량 평가 Lv.2 : 가상시나리오 (인앱 프롬프트 작성형)

- 대상: 실전 AI 활용 역량을 검증받고 싶은 사람
- **난이도:** 심화
- 목적: 프롬프트 활용 역량 , 전문 지식

> Track 2보다 한 단계 깊은 평가. 단순히 "어떻게 쓰는지"를 넘어 **"더 나은 프롬프트를 내 목적에 맞게 쓸 수 있도록"** 실질적인 성장을 돕는 것이 핵심. 전문적인 가상 시나리오 속에서 AI와 실제로 대화하며 문제를 풀어가는 과정을 분석하고, 점수·랭킹·피드백을 통해 구체적인 개선 방향을 제시한다.
> 
- 방식: 직무별(기획, 데이터, 마케팅 등) 가상 시나리오 미션 제시 및 서비스 내 직접 프롬프트 작성

⇒ 결과: CREATE 프레임워크 기반 0~100점 절대 평가 및 상위 % 랭킹 산출 + 잘된 점과 부족한 점이 담긴 짧은 피드백 리포트

**서비스 플로우**

1. **직무 선택 및 상황 제시:** 유저가 관심 직무를 선택하면, 그에 맞는 고도화된 가상 시나리오가 챗봇 UI가 좌측에 뜹니다. 이때 "최소 3회 이상의 대화를 통해 최적의 결과물을 도출하세요"라는 미션 가이드를 함께 제공합니다.
    1. 단순한 지시가 아니라 '문제 정의'와 '데이터 구조화' 능력이 드러날 수 있는 직무 맥락을 던져줍니다.
    2. 제시 상황 (기획/데이터 분석 직무 선택 시):
        
        > "당신은 신규 헬스케어 O2O 서비스의 PM/DA입니다. 런칭 후 한 달이 지났는데, 회원가입 후 실제 예약 결제까지 이어지는 전환율(CVR)이 5%로 매우 저조합니다. 이 퍼널의 병목(이탈) 원인을 분석하기 위해, AI에게 가설 수립과 살펴봐야 할 주요 행동 데이터 지표(KPI) 설계를 요청하려고 합니다. AI가 가장 완벽한 분석 프레임워크를 제시하도록 프롬프트를 작성해 보세요."
        > 
2. **대화 진행:** 유저는 인앱 챗봇과 실시간으로 대화를 주고받습니다.
    1. AI는 단순히 대답만 하는 것이 아니라, 때때로 유저의 프롬프트에서 부족한 점을 역으로 질문하거나 모호한 부분을 지적하며 유저의 대응 능력을 테스트합니다.
3. **유저 액션:** 화면 우측의 인앱 챗봇 입력창에 유저가 직접 고민한 프롬프트를 작성하고 전송합니다.
    1. 제출 버튼 활성화:
        1. 최소 횟수 조건: 대화가 3회 미만일 때는 '최종 제출' 버튼이 비활성화되어 있습니다.
        2. 제출 가능: 3회 이상 대화가 진행되면 유저가 언제든 '최종 평가 받기' 버튼을 눌러 대화를 종료할 수 있습니다.
        3. 강제 종료: API 비용 및 운영 효율을 위해 최대 7~10회 정도에서 대화를 강제로 마무리하고 평가 단계로 넘어가도록 설계합니다.
4. **결과 도출:** CREATE 프레임워크를 기준으로 점수(0~100점), 랭킹(상위 %), 그리고 잘된 점과 부족한 점이 담긴 짧은 피드백 리포트를 제공합니다.
    1. 종합 평가: 단일 프롬프트가 아닌, 전체 대화 로그(Context)를 백엔드 LLM으로 전달하여 유저의 '논리적 전개 과정'과 'AI 피드백 수용 능력'을 포함한 최종 점수를 산출합니다.
    2. **다른 사람은 어떻게 접근했는지 비교** → 더 나은 프롬프트 방향 제시