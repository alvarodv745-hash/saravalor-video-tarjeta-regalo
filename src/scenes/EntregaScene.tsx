import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { WordReveal } from "../components/WordReveal";
import { COLORS } from "../constants";
import { SERIF } from "../fonts";

export const EntregaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = interpolate(frame, [0, durationInFrames], [0, 1]);
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ink, overflow: "hidden" }}>
      <Img
        src={staticFile("derived/entrega-bolsa.jpg")}
        style={{
          height: "100%",
          objectFit: "cover",
          objectPosition: "62% 50%",
          scale: interpolate(t, [0, 1], [1.04, 1.16]),
          transformOrigin: "60% 30%",
          width: "100%",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(11,10,14,0) 46%, rgba(11,10,14,0.82) 82%)",
        }}
      />
      <WordReveal
        startFrame={12}
        style={{
          bottom: 370,
          color: COLORS.cream,
          fontFamily: SERIF,
          fontSize: 92,
          left: 90,
          lineHeight: 1.1,
          position: "absolute",
          right: 90,
          textAlign: "center",
        }}
        text="Haz que se sientan especiales"
      />
    </AbsoluteFill>
  );
};
