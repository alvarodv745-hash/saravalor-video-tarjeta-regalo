import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import { AbsoluteFill, interpolate } from "remotion";
import { COLORS, VIDEO } from "./constants";

type Props = Record<string, never>;

const archClip = (t: number, grow: number): string => {
  const halfWidth = interpolate(t, [0, 1], [0, 1250]) + grow;
  const top = interpolate(t, [0, 1], [VIDEO.height * 0.56, -1300]) - grow;
  const bottom = interpolate(t, [0, 1], [VIDEO.height * 0.3, -300]) - grow;
  const side = VIDEO.width / 2 - halfWidth;
  return `inset(${top}px ${side}px ${bottom}px ${side}px round ${halfWidth}px ${halfWidth}px 0 0)`;
};

// El arco de las puertas y paredes del centro abre paso a la escena siguiente.
const ArchReveal: React.FC<TransitionPresentationComponentProps<Props>> = ({
  children,
  presentationDirection,
  presentationProgress: t,
}) => {
  if (presentationDirection === "exiting") {
    return (
      <AbsoluteFill style={{ scale: interpolate(t, [0, 1], [1, 1.08]) }}>
        {children}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{ backgroundColor: COLORS.gold, clipPath: archClip(t, 4) }}
      />
      <AbsoluteFill style={{ clipPath: archClip(t, 0) }}>
        <AbsoluteFill style={{ scale: interpolate(t, [0, 1], [1.14, 1]) }}>
          {children}
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const archReveal = (): TransitionPresentation<Props> => ({
  component: ArchReveal,
  props: {},
});

// La tarjeta regalo gira hasta quedar de canto: una línea en el centro de la pantalla.
// Esa línea se abre como una rendija y deja ver la escena siguiente.
const SlitReveal: React.FC<TransitionPresentationComponentProps<Props>> = ({
  children,
  presentationDirection,
  presentationProgress: t,
}) => {
  if (presentationDirection === "exiting") {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }
  const half = interpolate(t, [0, 1], [0, VIDEO.height / 2]);
  const lineWidth = interpolate(t, [0, 0.25], [CARD_EDGE_WIDTH, VIDEO.width], {
    extrapolateRight: "clamp",
  });
  const inset = `${VIDEO.height / 2 - half}px ${(VIDEO.width - lineWidth) / 2}px`;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `inset(${inset})` }}>
        <AbsoluteFill style={{ scale: interpolate(t, [0, 1], [1.12, 1]) }}>{children}</AbsoluteFill>
      </AbsoluteFill>
      {[-1, 1].map((side) => (
        <div
          key={side}
          style={{
            backgroundColor: COLORS.gold,
            height: 2,
            left: (VIDEO.width - lineWidth) / 2,
            opacity: interpolate(t, [0, 0.1, 0.7, 1], [0, 0.9, 0.6, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            position: "absolute",
            top: VIDEO.height / 2 + side * half - 1,
            width: lineWidth,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// Anchura aproximada en pantalla de la tarjeta de canto al empezar la rendija.
const CARD_EDGE_WIDTH = 700;

export const slitReveal = (): TransitionPresentation<Props> => ({
  component: SlitReveal,
  props: {},
});

// Fundido con foco: la imagen entra desenfocada y se asienta.
const FocusDissolve: React.FC<TransitionPresentationComponentProps<Props>> = ({
  children,
  presentationDirection,
  presentationProgress: t,
}) => {
  if (presentationDirection === "exiting") {
    return (
      <AbsoluteFill style={{ scale: interpolate(t, [0, 1], [1, 1.05]) }}>
        {children}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill
      style={{
        filter: `blur(${interpolate(t, [0, 1], [22, 0])}px)`,
        opacity: t,
        scale: interpolate(t, [0, 1], [1.07, 1]),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const focusDissolve = (): TransitionPresentation<Props> => ({
  component: FocusDissolve,
  props: {},
});
