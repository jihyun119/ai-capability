// 공유 이미지 디자인 토큰.
// 캔버스 드로잉 코드 곳곳에 흩어져 있던 색상/치수/폰트 리터럴을 한곳으로 모읍니다.
// styles.css의 @font-face 이름과 반드시 일치해야 합니다.
window.ShareTheme = (() => {
  const width = 1080;
  const height = 1440;

  return {
    canvas: { width, height, centerX: width / 2 },

    color: {
      brand: "#7d39eb",
      accent: "#c6ff33",
      ink: "#000",
      inkSoft: "#111",
      muted: "#777",
      grid: "#d9d9d9",
      surface: "#fff",
    },

    font: {
      body: "Pretendard",
      display: "Paperlogy",
      numeric: "Unbounded",
    },

    // 캡처 배율: 화면 DPR을 따르되 2~3배로 제한합니다.
    captureScale: { min: 2, max: 3 },

    // 캡처 대상의 폭을 잴 수 없을 때 쓰는 모바일 기준 폭.
    fallbackCaptureWidth: 393,
  };
})();
