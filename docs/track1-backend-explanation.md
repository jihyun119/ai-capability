# Track 1 Backend Implementation Note

## 핵심 답변

`backend_llm_final.md` 같은 문서를 폴더에 넣어두고 Codex나 Claude에게 "이 문서를 바탕으로 평가해줘"라고 말하는 것만으로는 서비스가 되지 않는다.

그 방식은 개발 중에는 도움을 받을 수 있지만, 실제 서비스의 백엔드는 매 요청마다 채팅창에 문서를 읽히는 구조가 아니다. 사용자가 버튼을 누를 때마다 서버 코드가 실행되어야 하고, 그 서버 코드는 입력 검증, 점수 계산, 유형 매핑, 결과 카드 생성을 안정적으로 처리해야 한다.

즉 문서의 역할은 데이터베이스가 아니라 **설계 명세서**다. 서비스에서는 그 명세를 코드로 옮겨야 한다.

## 현실적인 구조

Track 1에서 LLM agent 7개를 모두 호출할 필요는 없다. 대부분은 함수로 처리하는 편이 더 싸고, 빠르고, 재현 가능하다.

```text
외부 LLM JSON
  -> validateCanonicalResult()
  -> scorePromptResult()
  -> scoreQuestionnaire()
  -> combineScores()
  -> mapScoresToBinary()
  -> resolveType()
  -> buildResultCard()
```

LLM을 써도 되는 부분은 제한적이다.

- JSON이 깨졌을 때 한 번 복구하기
- 결과 카드 문구를 더 다양하게 쓰기

하지만 점수 계산, 고/저 판정, 16유형 매핑은 LLM이 아니라 코드가 해야 한다.

## 이번 구현 파일

- `src/track1/evaluate.js`: Track 1 평가 엔진
- `scripts/track1-backend-evaluate.js`: CLI 실행 파일
- `examples/track1/sample_success.json`: 외부 LLM 결과 샘플
- `examples/track1/sample_questionnaire_answers.json`: 객관식 답변 샘플

## 실행 방법

```sh
npm run track1:backend:sample
```

직접 파일을 넣어 실행할 수도 있다.

```sh
npm run track1:backend -- examples/track1/sample_success.json --questionnaire examples/track1/sample_questionnaire_answers.json
```

## 웹서비스로 붙일 때

나중에 Next.js, Express, FastAPI 같은 서버를 만들면 API route 안에서 아래처럼 호출하면 된다.

```js
import { evaluateTrack1 } from "./src/track1/evaluate.js";

const result = evaluateTrack1({
  llmResult: pastedJsonFromUser,
  questionnaire: questionnaireAnswers
});
```

프론트엔드는 `result.result_card`만 받아서 카드 UI로 보여주면 된다.

## 팀이 이해해야 할 한 문장

md 파일은 "서비스가 참고하는 지식창고"가 아니라 "개발자가 코드로 옮겨야 하는 설계도"다. Codex 같은 agent는 그 설계도를 읽고 코드를 만드는 조수이고, 실제 제품에서는 그 코드가 사용자의 요청을 처리한다.
