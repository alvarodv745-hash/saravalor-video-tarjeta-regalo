import { AbsoluteFill, useCurrentFrame } from "remotion";

// Grano fino que unifica fuentes de distinta calidad. Cambia de patrón en cada fotograma.
export const FilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.06 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ mixBlendMode: "overlay", opacity, pointerEvents: "none" }}>
      <svg height="100%" width="100%">
        <filter id="grain">
          <feTurbulence
            baseFrequency="0.85"
            numOctaves={2}
            seed={frame % 12}
            stitchTiles="stitch"
            type="fractalNoise"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect filter="url(#grain)" height="100%" width="100%" />
      </svg>
    </AbsoluteFill>
  );
};
