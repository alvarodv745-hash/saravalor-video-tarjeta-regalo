import { Video } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { WordReveal } from "../components/WordReveal";
import { COLORS } from "../constants";
import { SANS, SERIF } from "../fonts";
import { EASE_OUT, progress } from "../motion";

// Paneles a resolución nativa de las grabaciones, sin ampliar.
const PANEL = { width: 440, height: 620, top: 560, gap: 40 };

const Panel: React.FC<{ src: string; label: string; start: number; index: number }> = ({
  src,
  label,
  start,
  index,
}) => {
  const frame = useCurrentFrame();
  const t = progress(frame, start, start + 26, EASE_OUT);
  return (
    <div
      style={{
        left: (1080 - PANEL.width * 2 - PANEL.gap) / 2 + index * (PANEL.width + PANEL.gap),
        opacity: t,
        position: "absolute",
        top: PANEL.top,
        translate: `0 ${interpolate(t, [0, 1], [30, 0])}px`,
        width: PANEL.width,
      }}
    >
      <div
        style={{
          borderRadius: `${PANEL.width / 2}px ${PANEL.width / 2}px 0 0`,
          boxShadow: `0 0 0 2px ${COLORS.gold}, 0 30px 60px rgba(60, 45, 30, 0.22)`,
          height: PANEL.height,
          overflow: "hidden",
        }}
      >
        <Video muted objectFit="cover" src={staticFile(src)} style={{ height: "100%", width: "100%" }} />
      </div>
      <div
        style={{
          color: COLORS.text,
          fontFamily: SANS,
          fontSize: 38,
          fontWeight: 300,
          marginTop: 30,
          textAlign: "center",
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const OpcionesScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      <WordReveal
        startFrame={4}
        style={{
          color: COLORS.text,
          fontFamily: SERIF,
          fontSize: 84,
          left: 0,
          position: "absolute",
          right: 0,
          textAlign: "center",
          top: 300,
        }}
        text="Elige cómo regalarla"
      />
      <Panel index={0} label="Sobre incluido" src="derived/panel-sobre.mp4" start={10} />
      <Panel index={1} label="Caja de regalo · 5 €" src="derived/panel-caja.mp4" start={20} />
    </AbsoluteFill>
  );
};
