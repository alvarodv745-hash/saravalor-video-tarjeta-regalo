import { AbsoluteFill } from "remotion";
import { SAFE_ZONE, STICKER_ZONE } from "../constants";

const zone: React.CSSProperties = {
  backgroundColor: "rgba(255, 60, 60, 0.25)",
  left: 0,
  position: "absolute",
  right: 0,
};

export const SafeZoneGuide: React.FC = () => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ ...zone, height: SAFE_ZONE.top, top: 0 }} />
      <div style={{ ...zone, bottom: 0, height: SAFE_ZONE.bottom }} />
      <div
        style={{
          border: "3px dashed rgba(255, 60, 60, 0.8)",
          height: STICKER_ZONE.height,
          left: (1080 - STICKER_ZONE.width) / 2,
          position: "absolute",
          top: STICKER_ZONE.top,
          width: STICKER_ZONE.width,
        }}
      />
    </AbsoluteFill>
  );
};
