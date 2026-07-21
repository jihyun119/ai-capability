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

  // ── Track 3 카드 ─────────────────────────────────────────────────────────

  const TRACK3_AXIS_LABELS = [
    "목표 정의",
    "맥락 제공",
    "정보 구조화",
    "작업 분해",
    "출력 설계",
    "상호작용 조율",
    "검증 유도",
    "실무 적용",
  ];

  function clampPercent(value) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(0, Math.min(100, number)) : 0;
  }

  function track3Level(percent) {
    return ["최하", "하", "중", "상", "최상"][Math.round(clampPercent(percent) / 25)];
  }

  function normalizeTrack3ShareData(input = {}) {
    const rawAxes = Array.isArray(input.axes) ? input.axes : [];
    const axes = TRACK3_AXIS_LABELS.map((fallbackLabel, index) => {
      const axis = rawAxes[index] || {};
      const score = clampPercent(axis.score ?? axis.percent);
      return {
        key: String(axis.key || ""),
        label: String(axis.label || fallbackLabel),
        score: Math.round(score),
        percent: clampPercent(axis.percent ?? score),
        level: String(axis.level || track3Level(axis.percent ?? score)),
        description: String(axis.description || ""),
      };
    });

    const rawDetails = Array.isArray(input.details) ? input.details.slice(0, 3) : [];
    const fallbackDetails = [...axes].sort((left, right) => left.score - right.score);
    const details = Array.from({ length: 3 }, (_, index) => {
      const detail = rawDetails[index] || fallbackDetails[index] || {};
      const score = clampPercent(detail.score ?? detail.percent);
      return {
        key: String(detail.key || ""),
        label: String(detail.label || fallbackDetails[index]?.label || "보완 역량"),
        score: Math.round(score),
        percent: clampPercent(detail.percent ?? score),
        level: String(detail.level || track3Level(detail.percent ?? score)),
        description: String(detail.description || "이 역량을 더 구체적으로 보여주는 요청을 추가해보세요."),
      };
    });

    return {
      total: Math.round(clampPercent(input.total)),
      grade: String(input.grade || "평가 결과"),
      headline: String(input.headline || "AI 실무 활용 역량 결과입니다"),
      summary: String(input.summary || "대화와 최종 결과물을 바탕으로 분석한 결과입니다."),
      axes,
      details,
    };
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function track3ProgressMarkup(row) {
    return `<div style="display:grid;grid-template-columns:96px 38px minmax(0,1fr);align-items:center;gap:8px;width:100%;box-sizing:border-box;">
      <strong style="font-size:13px;line-height:1.25;font-weight:700;color:${color.brand};white-space:nowrap;">${escapeHtml(row.label)}</strong>
      <b style="font-size:13px;line-height:1.25;font-weight:800;color:${color.ink};white-space:nowrap;">${escapeHtml(row.level)}</b>
      <i style="display:block;height:12px;border-radius:999px;background:${color.grid};overflow:hidden;">
        <span style="display:block;width:${row.percent}%;height:100%;border-radius:inherit;background:${color.brand};"></span>
      </i>
    </div>`;
  }

  function createTrack3ShareCard(input) {
    const data = normalizeTrack3ShareData(input);
    const card = document.createElement("section");
    card.dataset.shareCapture = "track3";
    card.setAttribute("aria-hidden", "true");
    card.style.cssText = `position:fixed;left:-10000px;top:0;width:384px;height:auto;box-sizing:border-box;padding:28px 24px 34px;background:${color.surface};color:${color.ink};font-family:${font.body},sans-serif;overflow:visible;z-index:-1;`;
    card.innerHTML = `
      <header style="display:flex;align-items:center;gap:9px;margin:0 0 30px;">
        <img src="./Logo/Logo.v2.png" alt="" style="display:block;width:25px;height:25px;object-fit:contain;" />
        <strong style="font-size:18px;line-height:1;font-weight:900;">푸키</strong>
      </header>
      <div style="display:flex;justify-content:center;margin-bottom:24px;">
        <strong style="display:inline-flex;align-items:center;justify-content:center;min-width:118px;min-height:38px;padding:8px 18px;box-sizing:border-box;border:1.5px solid ${color.ink};border-radius:999px;background:${color.accent};font-size:16px;line-height:1.2;font-weight:800;">${escapeHtml(data.grade)}</strong>
      </div>
      <h1 style="margin:0 0 30px;text-align:center;font-family:${font.numeric},${font.body},sans-serif;font-size:54px;line-height:1;font-weight:900;">${data.total}점</h1>
      <div style="display:grid;gap:20px;margin-bottom:34px;">${data.axes.map(track3ProgressMarkup).join("")}</div>
      <section style="margin-bottom:30px;">
        <h2 style="margin:0 0 12px;font-size:21px;line-height:1.35;font-weight:900;word-break:keep-all;overflow-wrap:anywhere;">${escapeHtml(data.headline)}</h2>
        <p style="margin:0;font-size:14px;line-height:1.5;font-weight:500;white-space:pre-wrap;word-break:keep-all;overflow-wrap:anywhere;">${escapeHtml(data.summary)}</p>
      </section>
      <div style="display:grid;gap:18px;">${data.details.map((detail) => `
        <article style="display:grid;gap:12px;">
          ${track3ProgressMarkup(detail)}
          <p style="margin:0;padding:14px 16px;border-radius:12px;background:#f4f4f5;color:#71717a;font-size:12px;line-height:1.45;font-weight:500;white-space:pre-wrap;word-break:keep-all;overflow-wrap:anywhere;">${escapeHtml(detail.description)}</p>
        </article>`).join("")}
      </div>`;
    return card;
  }

  function drawTrack3Card(ctx, canvas, input) {
    const data = normalizeTrack3ShareData(input);
    const summaryLines = K.wrapText(ctx, data.summary, 936, 30, 500);
    const detailLines = data.details.map((detail) => K.wrapText(ctx, detail.description, 856, 25, 500));
    const detailsHeight = detailLines.reduce((sum, lines) => sum + 150 + Math.max(1, lines.length) * 34, 0);
    canvas.width = theme.canvas.width;
    canvas.height = 1340 + Math.max(0, data.axes.length - 7) * 98 + summaryLines.length * 40 + detailsHeight;

    fillSurface(ctx, canvas);
    drawBrandMark(ctx, 64, 64);
    drawPill(ctx, data.grade, 330, 174, 420, 76, 38);
    K.drawCenteredText(ctx, `${data.total}점`, 362, 94, 900, color.ink, font.numeric);

    let y = 458;
    for (const row of data.axes) {
      drawTrack3ProgressRow(ctx, row, y);
      y += 98;
    }

    y += 34;
    const headlineLines = K.wrapText(ctx, data.headline, 936, 42, 900);
    ctx.font = `900 42px ${font.body}`;
    ctx.fillStyle = color.ink;
    headlineLines.forEach((line, index) => ctx.fillText(line, 72, y + index * 52));
    y += Math.max(1, headlineLines.length) * 52 + 30;

    ctx.font = `500 30px ${font.body}`;
    summaryLines.forEach((line, index) => ctx.fillText(line, 72, y + index * 40));
    y += Math.max(1, summaryLines.length) * 40 + 54;

    data.details.forEach((detail, index) => {
      drawTrack3ProgressRow(ctx, detail, y);
      y += 66;
      const lines = detailLines[index];
      const boxHeight = 48 + Math.max(1, lines.length) * 34;
      ctx.fillStyle = "#f4f4f5";
      K.roundRect(ctx, 72, y, 936, boxHeight, 24);
      ctx.fill();
      ctx.font = `500 25px ${font.body}`;
      ctx.fillStyle = "#71717a";
      lines.forEach((line, lineIndex) => ctx.fillText(line, 104, y + 42 + lineIndex * 34));
      y += boxHeight + 50;
    });
  }

  function drawTrack3ProgressRow(ctx, row, y) {
    K.drawText(ctx, row.label, 72, y + 32, 28, 800, color.brand, font.body);
    K.drawText(ctx, row.level, 300, y + 32, 28, 800, color.ink, font.body);
    ctx.fillStyle = color.grid;
    K.roundRect(ctx, 420, y, 588, 36, 18);
    ctx.fill();
    const fillWidth = 588 * (clampPercent(row.percent) / 100);
    if (fillWidth > 0) {
      ctx.fillStyle = color.brand;
      K.roundRect(ctx, 420, y, fillWidth, 36, 18);
      ctx.fill();
    }
  }

  return {
    drawTrack1Card,
    drawTrack2Card,
    createTrack3ShareCard,
    drawTrack3Card,
    normalizeTrack3ShareData,
  };
})();
