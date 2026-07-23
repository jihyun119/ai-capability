window.PookieAnalytics = (() => {
  const ALLOWED_EVENTS = new Set([
    "track_select",
    "profile_submit",
    "track_start",
    "track_submit",
    "result_view",
    "share_open",
    "share_result",
    "other_track_click",
    "track_error",
    "scenario_select",
    "chat_start",
    "message_send",
    "character_card_open",
  ]);
  const ALLOWED_PARAMS = new Set([
    "track_id",
    "entry_screen",
    "scenario_id",
    "scenario_index",
    "turn_number",
    "turn_count",
    "message_length",
    "input_method",
    "result_type",
    "score",
    "grade",
    "share_method",
    "previous_track_id",
    "error_stage",
    "error_code",
    "character_type",
    "source_screen",
  ]);
  const MAX_STRING_LENGTH = 100;
  const analyticsState = {
    activeTrackId: null,
    nextEntryScreen: null,
    profileTracks: new Set(),
    startedTracks: new Set(),
    submittedTracks: new Set(),
    viewedResults: new Set(),
    chatSessions: new Set(),
  };

  function safeParams(params = {}) {
    return Object.fromEntries(
      Object.entries(params).filter(([key, value]) => {
        if (!ALLOWED_PARAMS.has(key)) return false;
        if (!["string", "number", "boolean"].includes(typeof value)) return false;
        if (typeof value === "number" && !Number.isFinite(value)) return false;
        if (typeof value === "string" && (!value || value.length > MAX_STRING_LENGTH)) return false;
        return true;
      }),
    );
  }

  function sendGaEvent(eventName, params = {}) {
    try {
      if (!ALLOWED_EVENTS.has(eventName)) return false;
      window.dataLayer = Array.isArray(window.dataLayer) ? window.dataLayer : [];
      window.dataLayer.push({ event: eventName, ...safeParams(params) });
      return true;
    } catch (error) {
      console.error("[analytics]", error);
      return false;
    }
  }

  function sendOnce(bucket, key, eventName, params) {
    const safeKey = String(key || "");
    if (!safeKey || bucket.has(safeKey)) return false;
    if (!sendGaEvent(eventName, params)) return false;
    bucket.add(safeKey);
    return true;
  }

  function trackSelected(trackId, entryScreen) {
    analyticsState.activeTrackId = trackId;
    const entry = analyticsState.nextEntryScreen || entryScreen;
    analyticsState.nextEntryScreen = null;
    return sendGaEvent("track_select", { track_id: trackId, entry_screen: entry });
  }

  function profileSubmitted(trackId) {
    return sendOnce(
      analyticsState.profileTracks,
      trackId,
      "profile_submit",
      { track_id: trackId },
    );
  }

  function trackStarted(trackId) {
    return sendOnce(
      analyticsState.startedTracks,
      trackId,
      "track_start",
      { track_id: trackId },
    );
  }

  function trackSubmitted(trackId, params = {}) {
    return sendOnce(
      analyticsState.submittedTracks,
      trackId,
      "track_submit",
      { track_id: trackId, ...params },
    );
  }

  function resultViewed(trackId, resultKey, params = {}) {
    return sendOnce(
      analyticsState.viewedResults,
      `${trackId}:${resultKey || "attempt"}`,
      "result_view",
      { track_id: trackId, ...params },
    );
  }

  function chatStarted(scenarioId) {
    return sendOnce(
      analyticsState.chatSessions,
      `track3:${scenarioId || "unknown"}`,
      "chat_start",
      { track_id: "track3", scenario_id: scenarioId },
    );
  }

  function otherTrackClicked(previousTrackId) {
    analyticsState.nextEntryScreen = "result";
    return sendGaEvent("other_track_click", { previous_track_id: previousTrackId });
  }

  function trackError(trackId, errorStage, error) {
    const rawCode = String(error?.code || error?.name || "unknown");
    const safeCode = /^[a-z0-9_-]{1,64}$/i.test(rawCode) ? rawCode : "unknown";
    return sendGaEvent("track_error", {
      track_id: trackId,
      error_stage: errorStage,
      error_code: safeCode,
    });
  }

  function resetTrack(trackId) {
    analyticsState.profileTracks.delete(trackId);
    analyticsState.startedTracks.delete(trackId);
    analyticsState.submittedTracks.delete(trackId);
    [...analyticsState.viewedResults]
      .filter((key) => key.startsWith(`${trackId}:`))
      .forEach((key) => analyticsState.viewedResults.delete(key));
    if (trackId === "track3") analyticsState.chatSessions.clear();
  }

  return {
    sendGaEvent,
    trackSelected,
    profileSubmitted,
    trackStarted,
    trackSubmitted,
    resultViewed,
    chatStarted,
    otherTrackClicked,
    trackError,
    resetTrack,
    getActiveTrack: () => analyticsState.activeTrackId,
  };
})();
