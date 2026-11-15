import { Video } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { WordReveal } from "../components/WordReveal";
import { CENTRO_PART, COLORS, TRANSITION_FRAMES } from "../constants";
import { SANS, SERIF } from "../fonts";
import { EASE_IN_OUT } from "../motion";
import { focusDissolve } from "../transitions";

const ARCH = { width: 760, height: 1090, top: 372 };

// Las tres palabras repiten las de la tarjeta impresa de la caja.
const Word: React.FC<{ text: string }> = ({ text }) => (
  <WordReveal
    startFrame={14}
    style={{
      bottom: 400,
      color: COLORS.cream,
      fontFamily: SERIF,
      fontSize: 124,
      left: 0,
      position: "absolute",
      right: 0,
      textAlign: "center",
      textShadow: "0 6px 40px rgba(0, 0, 0, 0.55)",
    }}
    text={text}
  />
);

const SalaPhoto: React.FC<{ duration: number; word: string }> = ({ duration, word }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, duration], [0, 1], { easing: EASE_IN_OUT });
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ink, overflow: "hidden" }}>
      <Img
        src={staticFile("derived/centro-sala.jpg")}
        style={{
          height: "100%",
          objectFit: "cover",
          objectPosition: "45% 50%",
          scale: interpolate(t, [0, 1], [1.18, 1.06]),
          translate: `${interpolate(t, [0, 1], [-36, 24])}px 0`,
          width: "100%",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(11,10,14,0.8) 0%, rgba(11,10,14,0.45) 16%, rgba(11,10,14,0) 30%, rgba(11,10,14,0) 58%, rgba(11,10,14,0.72) 100%)",
        }}
      />
      <Word text={word} />
    </AbsoluteFill>
  );
};

// Vídeo real dentro del arco, con su propia copia desenfocada detrás para dar fondo.
const ArchClip: React.FC<{
  src: string;
  word: string;
  duration: number;
  trimBefore: number;
}> = ({ src, word, duration, trimBefore }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, duration], [0, 1]);
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.inkSoft, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          filter: "blur(46px) brightness(0.42)",
          scale: interpolate(t, [0, 1], [1.5, 1.4]),
        }}
      >
        <Video
          muted
          objectFit="cover"
          src={staticFile(src)}
          style={{ height: "100%", width: "100%" }}
          trimBefore={trimBefore}
        />
      </AbsoluteFill>
      <div
        style={{
          borderRadius: `${ARCH.width / 2}px ${ARCH.width / 2}px 0 0`,
          boxShadow: `0 0 0 2px ${COLORS.gold}, 0 40px 90px rgba(0, 0, 0, 0.55)`,
          height: ARCH.height,
          left: (1080 - ARCH.width) / 2,
          overflow: "hidden",
          position: "absolute",
          top: ARCH.top,
          width: ARCH.width,
        }}
      >
        <AbsoluteFill style={{ scale: interpolate(t, [0, 1], [1.02, 1.1]) }}>
          <Video
            muted
            objectFit="cover"
            src={staticFile(src)}
            style={{ height: "100%", width: "100%" }}
            trimBefore={trimBefore}
          />
        </AbsoluteFill>
      </div>
      <Word text={word} />
    </AbsoluteFill>
  );
};

export const CentroScene: React.FC = () => {
  const { fps } = useVideoConfig();
  const part = CENTRO_PART;
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ink }}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="Cuidado" durationInFrames={part}>
          <ArchClip
            duration={part}
            src="derived/centro-ritual.mp4"
            trimBefore={1.5 * fps}
            word="cuidado"
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={focusDissolve()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES.dissolve })}
        />
        <TransitionSeries.Sequence name="Belleza" durationInFrames={part}>
          <ArchClip
            duration={part}
            src="derived/centro-facial.mp4"
            trimBefore={0}
            word="belleza"
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={focusDissolve()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES.dissolve })}
        />
        <TransitionSeries.Sequence name="Bienestar" durationInFrames={part}>
          <SalaPhoto duration={part} word="bienestar" />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <WordReveal
        startFrame={4}
        style={{
          color: COLORS.cream,
          fontFamily: SANS,
          fontSize: 46,
          fontWeight: 300,
          left: 0,
          letterSpacing: 1,
          position: "absolute",
          right: 0,
          textAlign: "center",
          top: 262,
        }}
        text="Regala momentos de"
      />
    </AbsoluteFill>
  );
};
