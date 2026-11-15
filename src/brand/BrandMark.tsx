import { MARK, WORDMARK } from "./marks";

// Símbolo y rotulación vectorizados a partir de los originales (scripts/trace-brand.mjs).
const Vector: React.FC<{
  shape: { d: string; width: number; height: number };
  width: number;
  fill: string;
  style?: React.CSSProperties;
}> = ({ shape, width, fill, style }) => (
  <svg
    height={(width * shape.height) / shape.width}
    style={{ display: "block", ...style }}
    viewBox={`0 0 ${shape.width} ${shape.height}`}
    width={width}
  >
    <path d={shape.d} fill={fill} fillRule="evenodd" />
  </svg>
);

export const BrandSymbol: React.FC<{ width: number; fill: string; style?: React.CSSProperties }> = (
  props,
) => <Vector shape={MARK} {...props} />;

export const BrandWordmark: React.FC<{ width: number; fill: string; style?: React.CSSProperties }> = (
  props,
) => <Vector shape={WORDMARK} {...props} />;
