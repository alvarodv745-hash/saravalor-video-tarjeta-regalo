import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { AbsoluteFill, Easing, interpolate, staticFile, useVideoConfig } from "remotion";
import { FilmGrain } from "./components/FilmGrain";
import { SafeZoneGuide } from "./components/SafeZoneGuide";
import { DURATIONS, TRANSITION_FRAMES } from "./constants";
import { MUSIC } from "./music";
import { CentroScene } from "./scenes/CentroScene";
import { CierreScene } from "./scenes/CierreScene";
import { CompraScene } from "./scenes/CompraScene";
import { EntregaScene } from "./scenes/EntregaScene";
import { IntroScene } from "./scenes/intro/IntroScene";
import { OpcionesScene } from "./scenes/OpcionesScene";
import { archReveal, focusDissolve, slitReveal } from "./transitions";

export type GiftCardStoryProps = {
  showSafeZones: boolean;
};

const archTiming = linearTiming({
  durationInFrames: TRANSITION_FRAMES.arch,
  easing: Easing.bezier(0.65, 0, 0.35, 1),
});

const slitTiming = linearTiming({
  durationInFrames: TRANSITION_FRAMES.slit,
  easing: Easing.bezier(0.6, 0, 0.2, 1),
});

const dissolveTiming = linearTiming({ durationInFrames: TRANSITION_FRAMES.dissolve });

export const GiftCardStory: React.FC<GiftCardStoryProps> = ({ showSafeZones }) => {
  const { durationInFrames, fps } = useVideoConfig();
  // La música acompaña baja la apertura y crece cuando la rendija abre paso al centro.
  const swell = DURATIONS.intro - TRANSITION_FRAMES.slit;
  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence name="Intro" durationInFrames={DURATIONS.intro}>
          <IntroScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slitReveal()} timing={slitTiming} />
        <TransitionSeries.Sequence name="Centro" durationInFrames={DURATIONS.centro}>
          <CentroScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={focusDissolve()} timing={dissolveTiming} />
        <TransitionSeries.Sequence name="Entrega" durationInFrames={DURATIONS.entrega}>
          <EntregaScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={focusDissolve()} timing={dissolveTiming} />
        <TransitionSeries.Sequence name="Compra" durationInFrames={DURATIONS.compra}>
          <CompraScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={focusDissolve()} timing={dissolveTiming} />
        <TransitionSeries.Sequence name="Opciones" durationInFrames={DURATIONS.opciones}>
          <OpcionesScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={archReveal()} timing={archTiming} />
        <TransitionSeries.Sequence name="Cierre" durationInFrames={DURATIONS.cierre}>
          <CierreScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <FilmGrain />
      <Audio
        src={staticFile(MUSIC.src)}
        trimBefore={Math.round(MUSIC.startSeconds * fps)}
        volume={(frame) =>
          interpolate(
            frame,
            [0, 1.5 * fps, swell, swell + TRANSITION_FRAMES.slit, durationInFrames - 2.5 * fps, durationInFrames],
            [0, MUSIC.quietVolume, MUSIC.quietVolume, MUSIC.fullVolume, MUSIC.fullVolume, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {showSafeZones ? <SafeZoneGuide /> : null}
    </AbsoluteFill>
  );
};
