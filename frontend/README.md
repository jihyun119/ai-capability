# 포미닛 AI 활용 진단 와이어프레임

Figma 와이어프레임을 기준으로 만든 모바일 웹 프로토타입입니다.

## 실행 방법

```powershell
cd frontend
node .\preview-server.cjs
```

브라우저에서 아래 주소를 엽니다.

```text
http://127.0.0.1:4173/
```

## 현재 구현 범위

- H01 랜딩 홈
- H02 Track 선택
- Track 1 안내, 객관식 문항, 프롬프트 복붙, 붙여넣기, 분석 로딩, 결과 화면
- Track 2 안내, 상황 객관식 문항, 프롬프트 복붙, 붙여넣기, 결과 화면
- Track 3는 베타 이후 구현 예정이며 현재 Coming Soon 처리

## 주요 파일

- `index.html`: 앱 진입점
- `styles.css`: 화면 스타일, 폰트, 모바일 프레임 레이아웃
- `app.js`: 화면 렌더링, 클릭 흐름, Track 1/2 문항 데이터
- `preview-server.cjs`: 로컬 미리보기 서버
- `fonts/`: Pretendard, Paperlogy, Unbounded 폰트
- `Logo/`: 서비스 로고 에셋
- `characters-final/`: 결과 화면에 사용되는 캐릭터 PNG
- `characters/`: 캐릭터 더보기 화면에 사용되는 PNG
- `design-reference/`: Figma 기준 와이어프레임 참고 자료

## 백엔드 연결 메모

현재는 정적 프로토타입입니다. 백엔드 연결 시 우선 연결할 지점은 다음입니다.

- Track 1 객관식 12문항 응답 저장
- Track 1 프롬프트 복붙 결과 JSON 제출 및 유형 산출
- Track 2 객관식 4문항 응답 저장
- Track 2 프롬프트 복붙 결과 제출 및 6개 역량 점수 산출
