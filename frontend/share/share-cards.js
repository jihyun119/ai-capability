// 트랙별 공유 카드 캔버스 드로잉.
// DOM 캡처가 불가능하거나 실패했을 때 쓰이는 폴백 렌더러입니다.
// 의존: share-theme.js, canvas-kit.js
window.ShareCards = (() => {
  const theme = window.ShareTheme;
  const K = window.CanvasKit;
  const { color, font } = theme;

  // ── 공통 요소 ────────────────────────────────────────────────────────────

  // 좌상단 푸키 로고 마크. Track 1·2 카드가 동일한 위치/크기로 사용합니다.
  function drawBrandMark(ctx, x = 72, y = 72) {
    ctx.fillStyle = color.brand;
    K.roundRect(ctx, x, y, 56, 56, 8);
    ctx.fill();
    drawLogoEyes(ctx, x, y);
    K.drawText(ctx, "푸키", x + 76, y + 41, 34, 800, color.ink, font.display);
  }

  function drawLogoEyes(ctx, x, y) {
    ctx.fillStyle = color.surface;
    ctx.strokeStyle = color.ink;
    ctx.lineWidth = 1.5;
    for (const offset of [17, 34]) {
      ctx.beginPath();
      ctx.ellipse(x + offset, y + 34, 8, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = color.ink;
      ctx.beginPath();
      ctx.arc(x + offset - 1, y + 34, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = color.surface;
    }
  }

  function drawCloseIcon(ctx, x, y, size) {
    ctx.save();
    ctx.strokeStyle = color.ink;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + size, y + size);
    ctx.moveTo(x + size, y);
    ctx.lineTo(x, y + size);
    ctx.stroke();
    ctx.restore();
  }

  function drawPill(ctx, text, x, y, width, height, radius) {
    ctx.fillStyle = color.accent;
    K.roundRect(ctx, x, y, width, height, radius);
    ctx.fill();
    ctx.strokeStyle = color.ink;
    ctx.lineWidth = 3;
    ctx.stroke();
    K.drawCenteredText(ctx, text, y + 48, 32, 800, color.ink, font.body);
  }

  function fillSurface(ctx, canvas) {
    ctx.fillStyle = color.surface;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function strokeCard(ctx, x, y, width, height, radius, lineWidth) {
    ctx.strokeStyle = color.ink;
    ctx.lineWidth = lineWidth;
    K.roundRect(ctx, x, y, width, height, radius);
    ctx.stroke();
  }

  // ── Track 1 카드 ─────────────────────────────────────────────────────────

  async function drawTrack1Card(ctx, canvas, { typeName, keywords, description, characterSrc }) {
    const descriptionLines = String(description || "").split("\n").filter(Boolean);
    const mainDescription = descriptionLines.slice(0, 2).join(" ") || "AI 관계 유형 결과입니다.";
    const subDescription = descriptionLines.slice(2).join(" ")
      || descriptionLines[0]
      || "AI 사용 패턴을 바탕으로 나온 결과입니다.";

    fillSurface(ctx, canvas);
    drawBrandMark(ctx);
    strokeCard(ctx, 56, 164, 968, 1030, 34, 4);

    K.drawCenteredText(ctx, "당신의 AI 관계 유형은", 250, 50, 300, color.inkSoft, font.body);
    K.drawCenteredText(ctx, typeName, 324, 72, 800, color.brand, font.numeric);
    drawKeywordPills(ctx, keywords, 358, 760);
    await drawCharacter(ctx, characterSrc, 220, 468, 640, 450);
    K.drawCenteredMultilineText(ctx, mainDescription, 1000, 720, 44, 36, 800, color.brand);
    K.drawCenteredMultilineText(ctx, subDescription, 1120, 700, 34, 28, 300, color.inkSoft);
  }

  function drawKeywordPills(ctx, keywords, y, maxWidth) {
    const labels = keywords.slice(0, 3).map(String);
    if (labels.length === 0) return;
    ctx.font = `800 32px ${font.body}`;
    const widths = labels.map((label) => ctx.measureText(label).width + 58);
    const totalWidth = widths.reduce((sum, width) => sum + width, 0) + (labels.length - 1) * 18;
    let currentX = theme.canvas.centerX - Math.min(totalWidth, maxWidth) / 2;
    for (const [index, label] of labels.entries()) {
      const width = widths[index];
      ctx.fillStyle = color.accent;
      K.roundRect(ctx, currentX, y, width, 58, 29);
      ctx.fill();
      ctx.strokeStyle = color.ink;
      ctx.lineWidth = 4;
      ctx.stroke();
      K.drawText(ctx, label, currentX + 29, y + 40, 32, 800, color.ink, font.body);
      currentX += width + 18;
    }
  }

  // 캐릭터 이미지를 지정 박스 안에 비율 유지하며 중앙 배치합니다.
  async function drawCharacter(ctx, src, x, y, width, height) {
    try {
      const image = await K.loadImage(src);
      const ratio = Math.min(width / image.width, height / image.height);
      const drawWidth = image.width * ratio;
      const drawHeight = image.height * ratio;
      ctx.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
    } catch {
      K.drawCenteredText(ctx, "푸키", y + height / 2, 72, 800, color.brand, font.display);
    }
  }

  // ── Track 2 카드 ─────────────────────────────────────────────────────────

  function drawTrack2Card(ctx, canvas, { total, grade, axes, summary, strength, weakness }) {
    fillSurface(ctx, canvas);
    drawBrandMark(ctx);
    drawCloseIcon(ctx, 958, 80, 46);
    strokeCard(ctx, 56, 164, 968, 548, 28, 3);

    K.drawCenteredText(ctx, "당신의 AI 활용 역량 점수는", 255, 48, 300, color.inkSoft, font.body);
    K.drawCenteredText(ctx, `${total}점`, 338, 98, 800, color.ink, font.numeric);
    drawRadar(ctx, axes, 380, 378, 320);

    drawPill(ctx, grade, 326, 782, 428, 72, 36);
    K.drawCenteredMultilineText(ctx, summary, 936, 840, 42, 32, 300, color.inkSoft);
    drawFeedbackCard(ctx, 56, 1050, "Strength", "강점", strength);
    drawFeedbackCard(ctx, 56, 1202, "Weakness", "약점", weakness);
  }

  function drawFeedbackCard(ctx, x, y, labelEn, labelKo, body) {
    ctx.fillStyle = color.surface;
    K.roundRect(ctx, x, y, 968, 116, 16);
    ctx.fill();
    strokeCard(ctx, x, y, 968, 116, 16, 3);

    ctx.font = `800 30px ${font.body}`;
    ctx.fillStyle = color.brand;
    ctx.textAlign = "left";
    ctx.fillText(labelEn, x + 62, y + 44);
    const labelWidth = ctx.measureText(labelEn).width;
    ctx.fillStyle = color.ink;
    ctx.fillText(` ${labelKo}`, x + 62 + labelWidth, y + 44);

    K.drawMultilineText(ctx, body, x + 62, y + 82, 820, 29, 24, 400, color.ink, 2);
  }

  const RADAR_AXIS_ORDER = ["task_clarity", "context", "role", "output_format", "iteration", "critical_review"];
  const RADAR_FALLBACK_LABELS = {
    task_clarity: "작업 명확성",
    context: "맥락 설명",
    role: "역할 지정",
    output_format: "출력 형식",
    iteration: "반복 개선",
    critical_review: "비판적 검토",
  };
  const RADAR_ANGLES = [-90, -30, 30, 90, 150, 210];

  function drawRadar(ctx, axes = {}, x, y, size) {
    const centerX = x + size / 2;
    const centerY = y + size / 2;
    const maxRadius = size * 0.28;
    const point = (rate, index) => {
      const angle = (RADAR_ANGLES[index] * Math.PI) / 180;
      const radius = maxRadius * rate;
      return [centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius];
    };

    ctx.save();

    // 배경 격자
    ctx.strokeStyle = color.grid;
    ctx.lineWidth = 2;
    for (const rate of [0.2, 0.4, 0.6, 0.8]) {
      K.drawPolygonPath(ctx, RADAR_AXIS_ORDER.map((_, index) => point(rate, index)));
      ctx.stroke();
    }
    for (let index = 0; index < RADAR_AXIS_ORDER.length; index += 1) {
      const [axisX, axisY] = point(1, index);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(axisX, axisY);
      ctx.stroke();
    }

    // 점수 폴리곤
    const radarPoints = RADAR_AXIS_ORDER.map((key, index) => {
      const rate = Math.max(0, Math.min(1, Number(axes[key]?.rate) || 0));
      return point(rate, index);
    });
    ctx.fillStyle = color.brand;
    K.drawPolygonPath(ctx, radarPoints);
    ctx.fill();
    ctx.strokeStyle = color.brand;
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = color.ink;
    for (const [dotX, dotY] of radarPoints) {
      ctx.beginPath();
      ctx.arc(dotX, dotY, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // 축 라벨 (RADAR_ANGLES와 같은 순서)
    const labelPositions = [
      [centerX, y + 24, "center"],
      [x + size - 8, y + 112, "right"],
      [x + size - 8, y + 222, "right"],
      [centerX, y + size - 8, "center"],
      [x + 8, y + 222, "left"],
      [x + 8, y + 112, "left"],
    ];
    ctx.font = `500 22px ${font.body}`;
    ctx.fillStyle = color.ink;
    RADAR_AXIS_ORDER.forEach((key, index) => {
      const [labelX, labelY, align] = labelPositions[index];
      ctx.textAlign = align;
      ctx.fillText(axes[key]?.label || RADAR_FALLBACK_LABELS[key], labelX, labelY);
    });

    ctx.restore();
  }

  return { drawTrack1Card, drawTrack2Card };
})();
