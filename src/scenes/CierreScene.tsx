import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { BrandSymbol, BrandWordmark } from "../brand/BrandMark";
import { WordReveal } from "../components/WordReveal";
import { COLORS } from "../constants";
import { SANS, SERIF } from "../fonts";
import { EASE_OUT, progress } from "../motion";

// Logotipo grande en el centro, entre los precios y el hueco del sticker de enlace.
// Se dibuja con los vectores de la marca para que se vea nítido a este tamaño.
const LOGO = { symbol: 165, wordmark: 410, top: 720, gap: 32 };

// Precio según dónde se compre: online hay un mínimo de 60 € (con envío gratis);
// en el centro, sin importe mínimo.
const PRICES = [
  { where: "ONLINE", price: "Desde 60 €", note: "con envío gratis" },
  { where: "EN EL CENTRO", price: "Sin mínimo", note: "el importe que quieras" },
];

const PriceColumn: React.FC<{ where: string; price: string; note: string; start: number }> = ({
  where,
  price,
  note,
  start,
}) => {
  const frame = useCurrentFrame();
  const t = progress(frame, start, start + 22, EASE_OUT);
  return (
    <div
      style={{
        opacity: t,
        textAlign: "center",
        translate: `0 ${interpolate(t, [0, 1], [10, 0])}px`,
        width: 400,
      }}
    >
      <div style={{ color: COLORS.gold, fontFamily: SANS, fontSize: 26, letterSpacing: 5 }}>{where}</div>
      <div style={{ color: COLORS.cream, fontFamily: SERIF, fontSize: 64, lineHeight: 1.15, marginTop: 4 }}>
        {price}
      </div>
      <div style={{ color: COLORS.cream, fontFamily: SANS, fontSize: 30, fontWeight: 300, opacity: 0.85 }}>
        {note}
      </div>
    </div>
  );
};

export const CierreScene: React.FC = () => {
  const frame = useCurrentFrame();
  // El símbolo aparece primero y la rotulación después, con calma.
  const symbol = progress(frame, 30, 62, EASE_OUT);
  const wordmark = progress(frame, 50, 80, EASE_OUT);
  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at 50% 44%, #2c2622 0%, #15121a 55%, #0b0a0e 100%)",
      }}
    >
      <div style={{ left: 0, position: "absolute", right: 0, textAlign: "center", top: 262 }}>
        <WordReveal
          startFrame={6}
          style={{
            color: COLORS.gold,
            fontFamily: SANS,
            fontSize: 34,
            fontWeight: 400,
            letterSpacing: 9,
          }}
          text="TARJETA REGALO"
        />
        <div style={{ alignItems: "center", display: "flex", justifyContent: "center", marginTop: 26 }}>
          <PriceColumn {...PRICES[0]} start={14} />
          <div
            style={{
              alignSelf: "stretch",
              backgroundColor: COLORS.gold,
              opacity: 0.55 * progress(frame, 18, 36),
              width: 1.5,
            }}
          />
          <PriceColumn {...PRICES[1]} start={22} />
        </div>
        <WordReveal
          startFrame={34}
          style={{
            color: COLORS.cream,
            fontFamily: SANS,
            fontSize: 30,
            fontWeight: 300,
            marginTop: 22,
            opacity: 0.7,
          }}
          text="Canjeable durante 3 meses"
        />
      </div>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          left: 0,
          position: "absolute",
          right: 0,
          top: LOGO.top,
        }}
      >
        <BrandSymbol
          fill={COLORS.cream}
          style={{
            opacity: symbol,
            scale: interpolate(symbol, [0, 1], [0.94, 1]),
            translate: `0 ${interpolate(symbol, [0, 1], [14, 0])}px`,
          }}
          width={LOGO.symbol}
        />
        <BrandWordmark
          fill={COLORS.cream}
          style={{
            marginTop: LOGO.gap,
            opacity: wordmark,
            translate: `0 ${interpolate(wordmark, [0, 1], [10, 0])}px`,
          }}
          width={LOGO.wordmark}
        />
      </div>
    </AbsoluteFill>
  );
};
