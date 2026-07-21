export function splitTrack3ArtifactSections(value, artifactSections = []) {
  const text = String(value || "").replace(/\r\n?/g, "\n");
  const values = new Map(artifactSections.map((section) => [section, ""]));
  const markers = artifactSections.flatMap((section) => {
    const escaped = escapeRegExp(section);
    const match = new RegExp(`(?:^|\\n)\\s*#{1,6}\\s+${escaped}\\s*(?:\\n|$)`, "i").exec(text);
    return match ? [{ section, index: match.index, contentStart: match.index + match[0].length }] : [];
  }).sort((a, b) => a.index - b.index);

  markers.forEach((marker, index) => {
    const end = markers[index + 1]?.index ?? text.length;
    values.set(marker.section, text.slice(marker.contentStart, end).trim());
  });

  return { matched: markers.length > 0, values };
}

export function getTrack3FinalArtifactContent(value, scenario) {
  const finalSection = String(scenario?.final_artifact_section || "").trim();
  if (!finalSection) return "";
  return splitTrack3ArtifactSections(value, scenario.artifact_sections).values.get(finalSection) || "";
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
