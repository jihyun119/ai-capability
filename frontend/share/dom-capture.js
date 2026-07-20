// 화면 DOM을 그대로 PNG로 캡처합니다 (SVG foreignObject 경유).
// 결과 화면과 공유 이미지를 픽셀 단위로 일치시키는 것이 목적이며,
// 실패하면 호출부가 ShareCards의 캔버스 렌더러로 폴백합니다.
//
// 알려진 제약:
//  - foreignObject 안에서는 @font-face가 적용되지 않습니다. 캡처 이미지의 글꼴은
//    시스템 폴백으로 렌더링됩니다. (Pretendard/Paperlogy/Unbounded 미반영)
//  - 화면에 보이지 않는(.active가 아닌) 노드는 캡처할 수 없습니다 — 아래에서 명시적으로 거부합니다.
//
// 의존: share-theme.js, canvas-kit.js
window.DomCapture = (() => {
  const theme = window.ShareTheme;
  const K = window.CanvasKit;

  // 캡처 가능 여부. .screen은 CSS에서 display:none이 기본이라,
  // 숨겨진 노드를 캡처하면 계산된 스타일이 그대로 복사되어 빈 이미지가 만들어집니다.
  function isCapturable(node) {
    if (!node) return false;
    const rect = node.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return false;
    return window.getComputedStyle(node).display !== "none";
  }

  async function captureElementAsPng(node) {
    if (!isCapturable(node)) {
      throw new Error("화면에 표시되지 않은 요소는 캡처할 수 없습니다.");
    }

    const rect = node.getBoundingClientRect();
    const width = Math.ceil(rect.width || theme.fallbackCaptureWidth);
    // 공유 전용 캡처 영역은 자기 높이를 그대로 쓰고, 결과 화면 전체는 최소 높이를 보장합니다.
    const minHeight = node.matches?.("[data-share-capture]") ? 0 : 920;
    const height = Math.ceil(Math.max(node.scrollHeight, rect.height, minHeight));

    const clone = prepareClone(node, width, height);
    await inlineImages(clone);
    inlineComputedStyles(node, clone);

    const url = URL.createObjectURL(toSvgBlob(clone, width, height));
    try {
      return await rasterize(url, width, height);
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  // 화면 밖 배치·그림자·변형을 제거해 캡처에 적합한 정적 사본을 만듭니다.
  function prepareClone(node, width, height) {
    const clone = node.cloneNode(true);
    clone.classList.add("active");
    Object.assign(clone.style, {
      position: "relative",
      left: "0",
      top: "0",
      width: `${width}px`,
      height: `${height}px`,
      minHeight: `${height}px`,
      margin: "0",
      transform: "none",
      boxShadow: "none",
      overflow: "hidden",
    });
    return clone;
  }

  // SVG는 외부 스타일시트를 로드하지 못하므로 계산된 스타일을 인라인으로 옮깁니다.
  // source와 target은 cloneNode로 만들어진 동형 트리라 인덱스로 짝지을 수 있습니다.
  function inlineComputedStyles(source, target) {
    const computed = window.getComputedStyle(source);
    const computedText = computed.cssText || Array.from(computed)
      .map((property) => `${property}:${computed.getPropertyValue(property)};`)
      .join("");
    target.setAttribute("style", `${target.getAttribute("style") || ""};${computedText}`);

    const sourceChildren = Array.from(source.children);
    const targetChildren = Array.from(target.children);
    for (let index = 0; index < sourceChildren.length; index += 1) {
      inlineComputedStyles(sourceChildren[index], targetChildren[index]);
    }
  }

  // SVG 안에서는 상대 경로 이미지를 가져올 수 없으므로 data: URI로 치환합니다.
  async function inlineImages(root) {
    const images = Array.from(root.querySelectorAll("img"));
    await Promise.all(images.map(async (image) => {
      try {
        const absoluteUrl = new URL(image.getAttribute("src"), window.location.href).href;
        const response = await fetch(absoluteUrl);
        image.src = await blobToDataUrl(await response.blob());
      } catch {
        // 장식용 이미지가 빠져도 캡처 자체는 계속 진행합니다.
      }
    }));
  }

  function toSvgBlob(clone, width, height) {
    const serialized = new XMLSerializer().serializeToString(clone);
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml">${serialized}</div>
        </foreignObject>
      </svg>`;
    return new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  }

  async function rasterize(url, width, height) {
    const image = await K.loadImage(url);
    const { min, max } = theme.captureScale;
    const scale = Math.min(max, Math.max(min, window.devicePixelRatio || min));
    const canvas = K.createCanvas(Math.round(width * scale), Math.round(height * scale));
    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);
    ctx.drawImage(image, 0, 0, width, height);
    return K.toBlob(canvas);
  }

  function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  return { captureElementAsPng, isCapturable };
})();
