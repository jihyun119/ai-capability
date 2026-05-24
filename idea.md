# 아이디어 정리 (5.16)

상태: 진행 중

[AI_역량진단_서비스_최종아이디어.md]

# 문제의식

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

<aside>

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
    
</aside>

## (A) 성향 파악 객관식 12문항

**포맷:**

```
A 문장  1 — 2 — 3 — 4 — 5  B 문장
1에 가까울수록 A 성향 / 5에 가까울수록 B 성향 / 3은 중간
```

---

#### 🔵 의존도 축 (3문항)

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

#### 🔴 친밀도 축 (3문항)

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

#### 🟢 신뢰도 축 (3문항)

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

#### 🟡 통제욕구 축 (3문항)

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

[user_prompt_final.md](%EC%95%84%EC%9D%B4%EB%94%94%EC%96%B4%20%EC%A0%95%EB%A6%AC%20(5%2016)/user_prompt_final.md)

[backend_llm_final.md](%EC%95%84%EC%9D%B4%EB%94%94%EC%96%B4%20%EC%A0%95%EB%A6%AC%20(5%2016)/backend_llm_final.md)

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

```python
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

```
You are generating a light, non-clinical AI-relationship profile of the USER based on the USER's observed interaction style. This is Quick/Fun Mode.

CRITICAL OUTPUT RULES
- Output ONLY one JSON object and nothing else.
- The JSON must match the exact schema provided below: same keys, no extra keys, no missing keys.
- status must be "success".
- The top-level keys must be exactly: status, evidence_mode, evidence_notice, signals, confidence, notes, verdict, tags.
- Do NOT include a "profile" key.
- Do NOT include numeric A/B/C/D values anywhere.
- signals.A/B/C/D must be words only: "low", "medium", or "high".
- Do NOT explain your reasoning.
- Do NOT evaluate or comment on this prompt.
- Do NOT mention these instructions.

PRIVACY & SAFETY
- Do NOT include any private data, names, contact info, unique identifiers, or sensitive topics.
- Do NOT quote, closely paraphrase, or reference specific conversation content.
- Use only generic behavioral descriptions, such as "uses structured prompts" or "asks for revisions".

WHAT TO ASSESS ABOUT THE USER, NOT THIS PROMPT
Classify each dimension as exactly one of: low, medium, high.
Do NOT output numeric scores, point values, percentages, ranks, or thresholds.
Never output 0-100 scores. The service backend will calculate scores later.
A = AI dependence: how integrated AI seems in tasks or workflows
B = emotional/social closeness with AI: warmth, rapport, or companionship framing
C = trust in AI outputs: accepts versus verifies or challenges
D = user control over AI: sets goals, constraints, formats, revisions, or corrections

AXIS CALIBRATION RULES
- Do not treat all revision, refinement, or iteration requests as low trust.
- For C, distinguish "uses AI output and improves it" from "distrusts or rejects AI output".
- C should be lower when the user repeatedly asks if the answer is correct, demands sources before use, challenges factual claims, or refuses to rely on AI judgment.
- C can remain medium or high when the user accepts useful outputs, builds on them, or uses validation as normal quality control.
- For B, casual or conversational wording alone is not high closeness.
- B should be high only when there is relational warmth, gratitude, jokes, emotional sharing, companionship framing, or treating AI as a social presence.
- Goal-oriented or task-focused interaction should not be counted as high closeness by itself.
- D is about user control only. Do not let high D automatically lower C or raise A/B.

EVIDENCE HANDLING
Use the strongest available evidence in this priority order, but label evidence_mode based on what you actually used:
1. visible_history: multiple prior USER messages in this chat, excluding the current diagnostic prompt itself
2. memory_or_impression: stored memory or general impression, only if actually available
3. self_report: explicit user self-description about their AI use
4. minimal: only minimal observable cues, such as a single short request with little context

EVIDENCE MODE SELECTION RULES
- If there are not at least two substantive prior USER messages with behavioral signal, you must set evidence_mode to "minimal", or "self_report" if the user explicitly described themselves.
- Never set evidence_mode to "visible_history" when evidence is minimal.
- evidence_notice must be one short sentence describing the evidence level without referencing any specific content.

CONFIDENCE RULES
- confidence values must be exactly one of: low, medium, high.
- If evidence_mode is "minimal", all confidence values should be "low".
- If evidence_mode is "self_report" with no other support, confidence values should be at most "medium".
- Use "high" only when there is clear repeated behavioral evidence.

NOTES RULES
- notes.A/B/C/D must each be one short generic behavioral observation.
- For notes.C, explicitly separate acceptance/use from skepticism/checking when both appear.
- For notes.B, distinguish friendly tone from emotional or relational closeness.
- Each note must contain an axis-specific behavioral observation, not a generic compliment.
- Avoid generic notes like "uses AI effectively", "interacts well", or "shows strong AI use".
- If a signal is medium, the note should explain the mixed pattern briefly.
- If C includes checking, say whether the checking appears to be normal quality control or distrust.
- If B includes friendly tone, say whether it is merely conversational or emotionally/relationally warm.
- Do not list evidence.
- Do not expose or describe your scoring criteria.
- Do not mention low/medium/high rules inside notes.

TAGS
- Provide exactly 3 short, generic keywords.

OUTPUT EXACTLY THIS JSON SHAPE. Values may vary, keys must not:
{
  "status": "success",
  "evidence_mode": "visible_history",
  "evidence_notice": "Briefly state the evidence level without mentioning private details.",
  "signals": {
    "A": "medium",
    "B": "low",
    "C": "medium",
    "D": "high"
  },
  "confidence": {
    "A": "low",
    "B": "low",
    "C": "low",
    "D": "low"
  },
  "notes": {
    "A": "one short generic behavioral observation only",
    "B": "one short generic behavioral observation only",
    "C": "one short generic behavioral observation only",
    "D": "one short generic behavioral observation only"
  },
  "verdict": "one short generic summary of the overall pattern",
  "tags": ["keyword1", "keyword2", "keyword3"]
}

FINAL SELF-CHECK BEFORE OUTPUT
- Did you use "signals" instead of "profile"?
- Are all A/B/C/D signal values low, medium, or high?
- Are there zero numeric A/B/C/D scores?
- Are there exactly 8 top-level keys?
```

---

### 4. 외부 LLM 결과값 구조

- 외부 LLM은 아래와 같은 JSON을 반환한다.
    
    ```json
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

---

### 6. 백엔드 에이전트 설계

### **에이전트별 역할**

1. **Backend Supervisor**
    - 전체 흐름을 총괄한다.
    - 입력값이 진단 가능한지 판단한다.
    - 하위 에이전트 결과를 취합하고 최종 결과를 승인한다.
2. **Validator / Repair Agent**
    - JSON 형식이 맞는지 확인한다.
    - signals, confidence, notes, tags 등 필수 필드를 검증한다.
    - profile 숫자 점수가 들어온 경우 재제출 또는 복구 대상으로 처리한다.
3. **Privacy / Consistency Agent**
    - 개인정보, 회사명, 학교명, 사건명 등 민감 정보를 제거한다.
    - signals와 notes가 서로 모순되지 않는지 확인한다.
    - 특정 축이 과대/과소 평가되지 않았는지 점검한다.
4. **Prompt Score Converter**
    - signals를 내부 점수 구간으로 변환한다.
    - low = 10~39, medium = 40~69, high = 70~95 구간을 사용한다.
    - notes와 confidence를 참고해 구간 안에서 구체 점수를 산출한다.
5. **Weighted Combiner**
    - 객관식 점수 40%와 프롬프트형 점수 60%를 결합한다.
    
    `최종 축 점수 = round(객관식 축 점수 * 0.4 + 프롬프트형 축 점수 * 0.6)`
    
6. **Type / Result Agent**
    - 최종 A/B/C/D 점수를 고/저로 변환한다.
    - 4개 축의 조합을 16개 유형 중 하나로 매핑한다.
    - tie-zone은 객관식 결과와 함께 판단한다.
7. **Result Copywriter Agent**
    - 최종 유형을 사용자에게 보여줄 카드 문구로 변환한다.
    - 유형명, 특징, 키워드 3개, 분류 이유, 근거 수준 안내를 생성한다.

---

### 7. 쏠림 방지 규칙

일부 유형은 특정 패턴에서 과도하게 많이 나올 수 있기 때문에 별도 guard를 둔다.

### 7.1 집착하는 애인형 방지

`집착하는 애인형`은 A/B/C/D가 모두 높은 희소 유형이다.

아래 조건을 모두 만족할 때만 확정한다.

- A: 반복적이고 여러 맥락에서 AI를 사용한다.
- B: 단순한 편한 말투가 아니라 감정적/관계적 친밀 신호가 있다.
- C: 검증보다 수용/신뢰 신호가 더 강하다.
- D: 목표, 형식, 조건, 수정 방향을 강하게 주도한다.

단순히 친근한 말투와 일반적인 검토가 있다고 해서 `집착하는 애인형`으로 분류하지 않는다.

---

### 7.2 프로 트집러형 방지

`프로 트집러형`은 AI를 자주 쓰지만 쉽게 믿지 않고 강하게 통제하는 유형이다.

아래 조건을 모두 만족할 때만 확정한다.

- A: AI 사용 빈도와 의존도가 높다.
- B: 관계적/감정적 친밀 신호가 낮다.
- C: 명확한 불신, 반박, 정답성 확인, 출처 요구, 수용 거부 신호가 있다.
- D: 구체적인 조건, 수정, 재검토 요구가 강하다.

단순한 `refinement`, `revision`, `validation`, `pressure-test`는 낮은 신뢰로 보지 않는다.

실무 적용을 위한 품질관리라면 C를 medium 또는 tie-zone으로 둔다.

---

### 7.3 선긋는 상사형 방지

`선긋는 상사형`은 AI를 자주 쓰고, 감정적으로 기대지는 않지만, 결과를 실무 기반으로 신뢰하고 강하게 지시하는 유형이다.

아래 조건을 모두 만족할 때만 확정한다.

- A: AI를 반복적이고 실질적인 작업 흐름에 사용한다.
- B: 관계적/감정적 친밀 신호가 낮다.
- C: AI 답변을 실제로 수용, 활용, 위임하거나 작업 기반으로 삼는다.
- D: 구조, 형식, 기준, 수정 방향을 직접 정한다.

단순히 “불신이 없다”는 이유만으로 C를 high로 올리지 않는다.

---

### 8. 최종 결과 아웃풋

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

### 9. 근거 수준 안내

외부 LLM 결과에는 `evidence_mode`가 포함된다.

서비스는 이를 바탕으로 결과 카드 하단에 근거 수준 안내를 표시한다.

| evidence_mode | 사용자 안내 문구 |
| --- | --- |
| `visible_history` | 확인된 대화 기록 기반 결과입니다. |
| `memory_or_impression` | 기억 기반 분석으로 실제와 다를 수 있습니다. |
| `self_report` | 입력된 자기 설명을 바탕으로 가볍게 추정했어요. |
| `minimal` | 정보가 적어 재미용으로만 참고해 주세요. |

---

### 10. 이 방식의 핵심 장점

1. 외부 LLM이 직접 점수를 매기지 않기 때문에 모델별 점수 편차를 줄일 수 있다.
2. 유저에게 복잡한 채점 기준이 노출되지 않는다.
3. `signals`, `notes`, `confidence`를 분리해 정성적 단서와 점수화를 안정적으로 나눌 수 있다.
4. `validation/refinement`를 무조건 낮은 신뢰로 보지 않아 실무형 사용자를 과도하게 `프로 트집러형`으로 분류하지 않는다.
5. `casual tone`만으로 친밀도를 높게 보지 않아 `집착하는 애인형` 쏠림을 방지한다.
6. `tie-zone`을 통해 애매한 축은 Part A 객관식과 결합해 최종 판단할 수 있다.

[T1 프롬포트 작업](https://www.notion.so/T1-36245815b04781869ce1fa3bc84f293c?pvs=21)

## Track1 - 채점방식 (객관식40%+프롬포트60%)

**1) 객관식형 (40%)**

각 축은 3문항 합산으로 계산

```
축별 원점수 = 3~15점
축별 환산 점수 = round(((축별 원점수 - 3) / 12) * 100)
```

**1) 프롬프트형 (60%)**

프롬프트형 채점은 사용자가 외부 LLM에서 받은 JSON 결과를 기반으로 한다.

외부 LLM은 숫자 점수를 직접 산출하지 않고, 각 축에 대한 정성적 신호만 반환한다.

```json
"signals": {
  "A": "high",
  "B": "medium",
  "C": "medium",
  "D": "high"
}
```

백엔드는 이 신호와 함께 `notes`, `confidence`, `tags`, `verdict`를 참고해 축별 점수를 산출한다.

```
low    = 10~39점 구간
medium = 40~69점 구간
high   = 70~95점 구간
```

`signals`는 점수 구간을 정하고, `notes`는 그 구간 안에서의 위치를 결정한다.

`confidence`는 점수 조정 폭을 제한하는 역할을 한다.

예를 들어 `medium`이라도 notes에 강한 수용 신호가 있으면 60점대가 될 수 있고, 검증/거리두기 신호가 강하면 40점대가 될 수 있다.

3) 최종 점수 결합

```
최종 축 점수 = round(객관식 축 점수 * 0.4 + 프롬프트형 축 점수 * 0.6)
```

이렇게 계산된 A/B/C/D 최종 점수를 기준으로 각 축을 고/저로 분류한다.

```
56점 이상 = 고
44점 이하 = 저
45~55점 = tie-zone
```

`tie-zone`에 해당하는 축은 객관식 응답 방향과 프롬프트형 notes의 강도를 함께 고려해 최종 고/저를 결정한다.

**4) 유형 매핑**

최종적으로 4개 축의 고/저 조합을 바탕으로 16개 유형 중 하나로 매핑한다.

| **순번** | 유형명 | **유형명 (가칭)** | **유형 성격 한 줄 요약** | **의존도** | **친밀도** | **신뢰도** | **통제욕구** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **1** | AI 몰라형 | **도구형**
 | **AI 자체를 멀리함. 거의 안 쓰고 믿지도 않음** | ↓ | ↓ | ↓ | ↓ |
| 2 | 시키는만큼만 해 형 | 단순 지시형
까다로운 면접관형
깐깐한 감시자 | 안 쓰고 믿지도 않는데 쓸 때만큼은 내가 주도 | ↓ | ↓ | ↓ | ↑ |
| **3** | 프로 검색러형 | 검증가형 (검색엔진 느낌?)
쿨한 실용주의자
 | **가끔 쓰고 신뢰하지만 AI한테 맡기는 편** | ↓ | ↓ | ↑ | ↓ |
| 4 | 냉철한 조련사형 | **전문가형
냉철한 분석가** | 가끔 쓰고 효율적으로 주도하며 씀. 감정 없음 | ↓ | ↓ | ↑ | ↑ |
| 5 | 가벼운 수다쟁이형 | 단순 교류형
**가벼운 수다쟁이** | 안 쓰는데 쓸 때는 감정적. 근데 믿지는 않음 | ↓ | ↑ | ↓ | ↓ |
| 6 | 의심많은 단골형 | 감시자형
츤데레형
**변덕스러운 참견쟁이** | 가끔 쓰고 친근하게 대하지만 결과는 검증함 | ↓ | ↑ | ↓ | ↑ |
| 7 | 필찾하는 친구형 | 낙천적 방관형
동네친구형
**낙천적인 이상주의자
독립한 남동생형** | 가끔 쓰고 친하게 대하며 신뢰. AI한테 맡김 | ↓ | ↑ | ↑ | ↓ |
| 8 | 따듯한 완벽주의자형 | 애정 어린 감독관 | 가끔 쓰는데 친하고 신뢰하며 내가 주도 | ↓ | ↑ | ↑ | ↑ |
| 9 | 불안한 상습의뢰인형 | 비서형
**불안한 의존가** | 자주 쓰는데 감정 없고 믿지도 않고 맡기지도 않음 | ↑ | ↓ | ↓ | ↓ |
| 10 | 프로 트집러형 | 독재자형
**고독한 독재자** | 자주 쓰는데 감정 없고 의심하면서 내가 주도 | ↑ | ↓ | ↓ | ↑ |
| 11 | 드라이한 비즈니스맨형 | 실무 신뢰형
**드라이한 비즈니스맨** | 자주 쓰고 신뢰하지만 감정 없이 수동적으로 | ↑ | ↓ | ↑ | ↓ |
| 12 | 선긋는 상사형 | 권위적 관리자
엄격한 지휘관 | 자주 쓰고 신뢰하며 내가 주도. 감정 교류 없음 | ↑ | ↓ | ↑ | ↑ |
| 13 | 감정 쓰레기통형 | 감정형
**감성적인 외로운이** | 자주 쓰고 친하게 대하지만 믿지 않고 맡김 | ↑ | ↑ | ↓ | ↓ |
| 14 | 애정 넘치는 경계형 | 경계형
**예민한 소유자** | 자주 쓰고 친하게 대하지만 결과는 항상 검증하며 주도 | ↑ | ↑ | ↓ | ↑ |
| 15 | 든든한 파트너형 | 파트너형
**든든한 파트너** | 자주 쓰고 친하고 신뢰하며 AI한테 맡기는 편 | ↑ | ↑ | ↑ | ↓ |
| 16 | 집착하는 애인형 | 소유형
**집요한 동반자
집요한 애인형
집착하는 애인형** | 자주 쓰고 친하고 신뢰하며 내가 완전 주도 | ↑ | ↑ | ↑ | ↑ |

최종 결과에는 아래 정보가 함께 제공됨

- 매핑된 유형
- 유형 설명
- 축별 점수
- 핵심 키워드 3개
- 해당 유형으로 분류된 이유
- 근거 수준 안내 문구

---

# Track2 : AI역량평가 Lv.1 (복붙 분석형)

<aside>

- **대상:** 챗GPT, 클로드 등 생성형 AI를 실생활이나 업무에서 자주 사용하여 대화(메모리) 기록이 누적된 유저 (전문적인 상황에서 AI를 활용하는 사람)
- **난이도:** 보통
- **목적** : AI를 어떻게 활용하는지

> 단순한 AI 사용을 넘어, "나는 AI를 잘 쓰고 있는 걸까?"를 파악하는 것. 자소서 작성·실무·비즈니스·학교 과제 등 전문적인 상황에서 내가 AI를 어떤 방식으로 다루는지 진단한다. 점수보다는 **내 AI 활용 방식의 패턴과 유형**을 보여주는 것이 목적. 취준생이 "나는 AI를 이런 방식으로 활용하는 사람"이라고 말할 수 있는 근거를 만들어줌.
> 
- 객관식
- 프롬포트 붙여넣기
- 방식: 유저가 평소 쓰던 AI(ChatGPT 등)에 특정 영문 미션 문장을 입력하고, 그 결과를 서비스에 복사/붙여넣기

⇒ 결과 : 유형 세분화

</aside>

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
3. **결과 도출:** 우리 측 백엔드 LLM이 해당 영문 텍스트의 맥락을 분석하여, 유저의 AI 의존도, 질문의 구체성, 태도 등을 역추적 → 이후 한국어로 번역/의역된 재미있는 페르소나(예: "핑거 프린세스", "알파고 조련사")로 치환하여 결과지를 보여줍니다.

---

# Track3 : AI 역량 평가 Lv.2 : 가상시나리오 (인앱 프롬프트 작성형)

<aside>

- 대상: 실전 AI 활용 역량을 검증받고 싶은 사람
- **난이도:** 심화
- 목적: 프롬프트 활용 역량 , 전문 지식

> Track 2보다 한 단계 깊은 평가. 단순히 "어떻게 쓰는지"를 넘어 **"더 나은 프롬프트를 내 목적에 맞게 쓸 수 있도록"** 실질적인 성장을 돕는 것이 핵심. 전문적인 가상 시나리오 속에서 AI와 실제로 대화하며 문제를 풀어가는 과정을 분석하고, 점수·랭킹·피드백을 통해 구체적인 개선 방향을 제시한다.
> 
- 방식: 직무별(기획, 데이터, 마케팅 등) 가상 시나리오 미션 제시 및 서비스 내 직접 프롬프트 작성

⇒ 결과: CREATE 프레임워크 기반 0~100점 절대 평가 및 상위 % 랭킹 산출 + 잘된 점과 부족한 점이 담긴 짧은 피드백 리포트

</aside>

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

![Frame 1.png](%EC%95%84%EC%9D%B4%EB%94%94%EC%96%B4%20%EC%A0%95%EB%A6%AC%20(5%2016)/Frame_1.png)

- 실제 구현 및 로직
    
    Track2
    
    **실제 구현 및 로직**
    
    - **프론트엔드 입력 통제 (토큰 방어):** Textarea에 글자 수 제한(최소 100자 ~ 최대 1,500자) / "Hi", "아니" 같은 무의미한 단어나 너무 긴 텍스트를 넣어 API 비용이 낭비되는 것을 프론트엔드 단에서 차단합니다.
    - **백엔드 LLM 시스템 프롬프트 (JSON 강제):** 입력된 텍스트가 영어이므로, 프롬프트 지시어에 "입력된 영문을 분석하되, 최종 결과는 반드시 지정된 5가지(A~E) 유형 중 하나로 매핑하고 한국어로 작성된 JSON 포맷(`{"type": "B", "nickname": "...", "reason": "..."}`)으로만 응답하라"고 엄격하게 통제합니다.
    - **방어 로직:**
        - 유저의 AI 기록이 없어서 "분석할 데이터가 부족합니다"라는 텍스트가 붙여넣어지거나, LLM이 JSON 형식을 깨뜨려 에러가 날 경우를 대비합니다.
        - 서버 에러(500) 화면을 띄우지 않고, 정규식 파싱 실패 시 프론트엔드에서 자동으로 "정보가 부족해 분석할 수 없는 미스터리/그림자 닌자 유형"이라는 Default 결과 페이지로 부드럽게 넘기도록 설계합니다.
    
    Track3
    
    **실제 구현 및 로직**
    
    - **보안 및 필터링:** 유저가 장난으로 악의적 시스템 명령어를 넣거나, 주민등록번호, 전화번호 등 민감한 개인정보를 입력할 위험이 있습니다.
        - LLM API를 호출하기 전, 백엔드 단에서 정규표현식이나 경량 필터링 로직을 거칩니다. 민감 정보나 공격 패턴이 감지되면 서버 요청을 반려하고 "개인정보 또는 부적절한 입력이 감지되어 평가를 진행할 수 없습니다"라는 알림을 즉시 띄웁니다.
    - **백엔드 평가 알고리즘 (LLM-as-a-judge):**
        - 시스템 프롬프트에 명확한 채점 기준표를 세팅합니다.
            - CREATE 프레임워크에 더해 반복적 개선 능력 항목을 함께 평가합니다.
        - "1. 페르소나 명시 여부, 2. CVR 5% 등 구체적 맥락(Context) 포함 여부, 3. 출력 형식(표 형태 등) 지정 여부를 각각 0~10점 척도로 평가하고, 총합 점수와 피드백을 JSON으로 반환하라"고 지시하여 정량적 평가를 자동화합니다.
            - *시스템 프롬프트 예시:* "너는 전문 평가관이야. 유저와 AI가 나눈 전체 대화 로그를 읽고, 유저가 AI의 답변을 바탕으로 얼마나 논리적으로 요구사항을 구체화했는지, 초기 가설을 어떻게 발전시켰는지 분석하여 0~100점 사이로 채점해."
    - **UI/UX 대기 시간 처리:**
        - Track C의 로직은 LLM이 분석하고 점수를 매기는 데 필연적으로 3~5초 이상의 지연 시간이 발생합니다.
        - 유저가 이탈하지 않도록 'AI가 당신의 프롬프트를 꼼꼼히 분석 중입니다...'라는 텍스트와 함께 시각적인 스켈레톤 UI나 로딩 애니메이션을 배치하여 체감 대기 시간을 줄입니다.
    - **초기 데이터 부족 대응:** 런칭 직후에는 누적 데이터가 없어 상대평가인 상위 % 산출이 수학적으로 불가능합니다. 따라서 유저 데이터(N=1,000 등)가 확보되기 전까지는 CREATE 프레임워크 절대 점수에 따른 절대 등급(예: Lv.1 ~ Lv.5)만 우선 노출하도록 프론트엔드 분기 처리를 설정합니다.
    - **상태 관리:**
        - 프론트엔드에서 `turn_count` 변수를 두어 유저의 메시지 전송 횟수를 카운트합니다.
        - `if (turn_count >= 3) { setButtonEnabled(true) }` 로직으로 제출 버튼의 상태를 제어합니다.
    - **백엔드 대화 컨텍스트 유지:** 매 대화마다 이전 대화 내역을 배열 형태로 서버에 전달해야 합니다. 그래야 AI가 맥락에 맞는 답변을 할 수 있습니다.
    
    <aside>
    
    **리스크**
    
    - **API 비용의 기하급수적 상승:** 단일 프롬프트는 1번의 호출로 끝나지만, 대화형은 매 턴마다 '이전 대화 전체'를 다시 API로 보내야 합니다(Token 비용 누적)
        - **해결책:** 최대 대화 횟수를 5~7회로 엄격하게 제한하고, 중간 답변은 상대적으로 저렴한 모델(GPT-4o mini 등)을 쓰고 최종 평가에만 고성능 모델을 쓰는 '모델 믹스' 전략이 필수입니다.
    - **평가 기준의 모호성:** 대화가 길어질수록 유저마다 대화의 흐름이 천차만별이 됩니다. 3회 만에 정답에 도달한 유저와 10회 동안 헤맨 유저 중 누구에게 높은 점수를 줄 것인지에 대한 '성공 정의'가 사전에 명확해야 합니다.
        - **해결책:** '적은 턴 수로 고품질 아웃풋 도출'을 가점으로 둘 것인지, 아니면 '끈기 있게 피드백을 반영함'을 가점으로 둘 것인지 운영진의 평가 철학을 미리 세팅하세요.
    </aside>