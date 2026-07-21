// 캔버스 저수준 드로잉 프리미티브.
// 이 파일은 푸키 도메인을 전혀 모릅니다 — 도형, 텍스트, 이미지 로딩만 다룹니다.
// 의존: share-theme.js (기본 폰트/캔버스 폭)
window.CanvasKit = (() => {
  const theme = window.ShareTheme;

  function roundRect(ctx, x, y, width, height, radius) {
    const safeRadius = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + safeRadius, y);
    ctx.arcTo(x + width, y, x + width, y + height, safeRadius);
    ctx.arcTo(x + width, y + height, x, y + height, safeRadius);
    ctx.arcTo(x, y + height, x, y, safeRadius);
    ctx.arcTo(x, y, x + width, y, safeRadius);
    ctx.closePath();
  }

  function drawPolygonPath(ctx, points) {
    ctx.beginPath();
    points.forEach(([x, y], index) => {
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
  }

  function drawText(ctx, text, x, y, fontSize, fontWeight, color, fontFamily = theme.font.body) {
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = "left";
    ctx.fillText(text, x, y);
  }

  function drawCenteredText(ctx, text, y, fontSize, fontWeight, color, fontFamily = theme.font.body) {
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(text, theme.canvas.centerX, y);
    ctx.textAlign = "left";
  }

  // 공백 단위로 줄바꿈합니다. maxWidth를 넘는 단일 어절은 자르지 않고 그대로 넘깁니다.
  function wrapText(ctx, text, maxWidth, fontSize, fontWeight, fontFamily = theme.font.body) {
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    const words = String(text).split(/\s+/);
    const lines = [];
    let line = "";
    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (ctx.measureText(next).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = next;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  function drawMultilineText(ctx, text, x, y, maxWidth, lineHeight, fontSize, fontWeight, color, maxLines = 5) {
    const lines = wrapText(ctx, String(text || "").replace(/\n+/g, " "), maxWidth, fontSize, fontWeight);
    ctx.font = `${fontWeight} ${fontSize}px ${theme.font.body}`;
    ctx.fillStyle = color;
    ctx.textAlign = "left";
    lines.slice(0, maxLines).forEach((line, index) => {
      ctx.fillText(line, x, y + index * lineHeight);
    });
  }

  function drawCenteredMultilineText(ctx, text, y, maxWidth, lineHeight, fontSize, fontWeight, color, maxLines = 5) {
    const lines = wrapText(ctx, String(text).replace(/\n+/g, " "), maxWidth, fontSize, fontWeight);
    ctx.font = `${fontWeight} ${fontSize}px ${theme.font.body}`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    lines.slice(0, maxLines).forEach((line, index) => {
      ctx.fillText(line, theme.canvas.centerX, y + index * lineHeight);
    });
    ctx.textAlign = "left";
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
  }

  function createCanvas(width = theme.canvas.width, height = theme.canvas.height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  function toBlob(canvas) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("공유 이미지를 만들 수 없습니다."));
          return;
        }
        resolve(blob);
      }, "image/png");
    });
  }

  return {
    roundRect,
    drawPolygonPath,
    drawText,
    drawCenteredText,
    drawMultilineText,
    drawCenteredMultilineText,
    wrapText,
    loadImage,
    createCanvas,
    toBlob,
  };
})();
