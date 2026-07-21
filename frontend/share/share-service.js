// 공유 파이프라인 오케스트레이션.
//
//   shareResult / saveResultImage
//     └─ createShareImage      결과 화면 DOM 캡처 → 실패 시 캔버스 카드로 폴백
//     └─ deliver               Web Share API → 미지원/거부 시 파일 다운로드
//
// app.js의 상태에 직접 접근하지 않고 configure()로 주입받습니다.
// 의존: share-theme.js, canvas-kit.js, share-cards.js, dom-capture.js
window.ShareService = (() => {
  const K = window.CanvasKit;
  const Cards = window.ShareCards;
  const Capture = window.DomCapture;

  const TRACKS = {
    track1: { shareScreen: "t1-share", resultScreen: "t1-result", filename: "pookie-track1-result.png" },
    track2: { shareScreen: "t2-share", resultScreen: "t2-result", filename: "pookie-track2-result.png" },
    track3: { shareScreen: null, resultScreen: "t3-result", filename: "pookie-track3-result.png" },
  };

  // app.js가 주입하는 어댑터. 기본값은 서비스 단독 로드 시의 안전한 no-op입니다.
  let deps = {
    getTrack1Result: () => null,
    getTrack2Result: () => ({}),
    getTrack3ShareData: () => ({}),
    getShareUrl: () => "",
    characterSrcByType: () => "",
    normalizeShareKeywords: (keywords) => (Array.isArray(keywords) ? keywords : []),
    displayTrack2Grade: () => "AI 활용 역량",
    displayTrack2Summary: (_result, summary) => String(summary || ""),
    shareText: "",
  };

  function configure(overrides) {
    deps = { ...deps, ...overrides };
  }

  // ── 공유 문구 ────────────────────────────────────────────────────────────

  function buildShareMeta(track) {
    if (track === "track3") {
      const result = deps.getTrack3ShareData();
      return {
        title: "푸키 AI 실무 활용 역량 진단",
        text: buildTrack3ShareText(result, deps.getShareUrl()),
      };
    }
    if (track === "track2") {
      const grade = deps.displayTrack2Grade(deps.getTrack2Result());
      return { title: `내 AI 활용 역량은 ${grade}`, text: deps.shareText };
    }
    const typeName = deps.getTrack1Result()?.type?.name || "AI 관계 유형";
    return { title: `내 AI 관계 유형은 ${typeName}`, text: deps.shareText };
  }

  function buildTrack3ShareText(result = {}, shareUrl = "") {
    const grade = String(result.grade || "평가 결과");
    const total = Number.isFinite(Number(result.total)) ? Math.round(Number(result.total)) : "-";
    return [
      "푸키 Track 3에서 AI 실무 활용 역량을 진단했어요.",
      `제 결과는 "${grade}, ${total}점"이에요.`,
      "직접 도전하고 나의 AI 활용 역량도 확인해보세요!",
      String(shareUrl || "").trim(),
    ].filter(Boolean).join("\n");
  }

  // ── 이미지 생성 ──────────────────────────────────────────────────────────

  // 현재 활성 화면에서 캡처 대상을 찾습니다. 공유 화면이 열려 있으면 그쪽을 우선합니다.
  function resolveCaptureNode(track) {
    const { shareScreen, resultScreen } = TRACKS[track] || TRACKS.track1;
    for (const screenId of [shareScreen, resultScreen]) {
      const node = document.querySelector(`.screen.active[data-screen="${screenId}"]`);
      if (node) return node.querySelector("[data-share-capture]") || node;
    }
    return null;
  }

  async function createShareImage(track) {
    const { filename } = TRACKS[track] || TRACKS.track1;
    const meta = buildShareMeta(track);

    if (track === "track3") {
      const data = deps.getTrack3ShareData();
      const captureNode = Cards.createTrack3ShareCard(data);
      document.body.appendChild(captureNode);
      try {
        const blob = await Capture.captureElementAsPng(captureNode);
        return { blob, filename, ...meta };
      } catch (error) {
        console.warn("Track 3 공유 카드 DOM 캡처 실패. 캔버스 카드로 대체합니다.", error);
      } finally {
        captureNode.remove();
      }
      return { blob: await renderTrack3Card(data), filename, ...meta };
    }

    const captureNode = resolveCaptureNode(track);
    if (captureNode) {
      try {
        const blob = await Capture.captureElementAsPng(captureNode);
        return { blob, filename, ...meta };
      } catch (error) {
        console.warn("결과 DOM 캡처 실패. 캔버스 카드로 대체합니다.", error);
      }
    }

    const blob = track === "track2" ? await renderTrack2Card() : await renderTrack1Card();
    return { blob, filename, ...meta };
  }

  async function renderTrack1Card() {
    const result = deps.getTrack1Result();
    const typeName = result?.type?.name || "AI 관계 유형";
    const card = result?.resultCard || {};
    const canvas = K.createCanvas();
    await Cards.drawTrack1Card(canvas.getContext("2d"), canvas, {
      typeName,
      keywords: deps.normalizeShareKeywords(card.keywords),
      description: card.description || "AI 활용 진단 결과를 확인해보세요.",
      characterSrc: deps.characterSrcByType(typeName),
    });
    return K.toBlob(canvas);
  }

  async function renderTrack2Card() {
    const result = deps.getTrack2Result() || {};
    const feedback = result.feedback || {};
    const total = Number.isFinite(Number(result.total)) ? Math.round(Number(result.total)) : "--";
    const canvas = K.createCanvas();
    Cards.drawTrack2Card(canvas.getContext("2d"), canvas, {
      total,
      grade: deps.displayTrack2Grade(result),
      axes: result.axes || {},
      summary: deps.displayTrack2Summary(result, feedback.summary || "AI 활용 진단 결과를 확인해보세요."),
      strength: feedback.strength || feedback.strengths?.[0]?.description || "강점 분석이 표시됩니다.",
      weakness: feedback.weakness || feedback.weaknesses?.[0]?.description || "보완점 분석이 표시됩니다.",
    });
    return K.toBlob(canvas);
  }

  async function renderTrack3Card(data) {
    const canvas = K.createCanvas();
    Cards.drawTrack3Card(canvas.getContext("2d"), canvas, data);
    return K.toBlob(canvas);
  }

  // ── 전달 ─────────────────────────────────────────────────────────────────

  // "shared"(네이티브 공유창 열림) 또는 "downloaded"(파일 저장)를 반환합니다.
  // 사용자가 공유창을 닫으면 AbortError를 그대로 던져 호출부가 구분할 수 있게 합니다.
  async function deliver({ blob, filename, title, text }, { preferNativeShare }) {
    const file = new File([blob], filename, { type: "image/png" });
    const canShareFile = navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }));

    if (preferNativeShare && canShareFile) {
      try {
        await navigator.share({ title, text, files: [file] });
        return "shared";
      } catch (error) {
        if (error?.name === "AbortError") throw error;
        // 그 외 공유 실패는 다운로드로 폴백합니다.
      }
    }

    downloadBlob(blob, filename);
    return "downloaded";
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // iOS/모바일 웹뷰는 download 속성을 무시하는 경우가 있어 새 탭으로 한 번 더 엽니다.
    if (isTouchShareDevice()) {
      setTimeout(() => {
        try {
          window.open(url, "_blank", "noopener,noreferrer");
        } catch {
          // 다운로드 동작은 모바일 브라우저/웹뷰 버전마다 다릅니다.
        }
      }, 120);
    }
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  // ── 기기 판별 ────────────────────────────────────────────────────────────

  function isMobileSafari() {
    const userAgent = navigator.userAgent || "";
    return /iP(ad|hone|od)/.test(userAgent) && /Safari/i.test(userAgent) && !/CriOS|FxiOS|EdgiOS/i.test(userAgent);
  }

  function isTouchShareDevice() {
    return isMobileSafari()
      || (navigator.maxTouchPoints > 0 && /Android|Mobile|iP(ad|hone|od)/i.test(navigator.userAgent || ""));
  }

  // ── 공개 API ─────────────────────────────────────────────────────────────

  // "공유" 버튼: 어디서든 네이티브 공유를 먼저 시도합니다.
  async function shareResult(track) {
    const preferNativeShare = track === "track3" ? isTouchShareDevice() : true;
    return deliver(await createShareImage(track), { preferNativeShare });
  }

  // "저장" 버튼: 데스크톱에서는 곧장 파일로 내려받고, 터치 기기에서만 공유창을 씁니다.
  async function saveResultImage(track) {
    return deliver(await createShareImage(track), { preferNativeShare: isTouchShareDevice() });
  }

  return {
    configure,
    shareResult,
    saveResultImage,
    isTouchShareDevice,
    isMobileSafari,
    buildTrack3ShareText,
  };
})();
