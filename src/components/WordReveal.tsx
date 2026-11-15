import { interpolate, useCurrentFrame } from "remotion";
import { EASE_OUT, progress } from "../motion";

type Props = {
  text: string;
  startFrame: number;
  stagger?: number;
  style?: React.CSSProperties;
};

// Las palabras aparecen de una en una, con un ascenso corto y sin prisa.
export const WordReveal: React.FC<Props> = ({
  text,
  startFrame,
  stagger = 6,
  style,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={style}>
      {text.split(" ").map((word, index) => {
        const t = progress(
          frame,
          startFrame + index * stagger,
          startFrame + index * stagger + 24,
          EASE_OUT,
        );
        return (
          <span
            key={`${word}-${index}`}
            style={{
              display: "inline-block",
              marginRight: "0.26em",
              opacity: t,
              translate: `0 ${interpolate(t, [0, 1], [10, 0])}px`,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
