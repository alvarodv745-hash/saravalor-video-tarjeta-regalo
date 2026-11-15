import { BrandSymbol, BrandWordmark } from "../../brand/BrandMark";
import { SERIF_TEXT } from "../../fonts";

// Caja de regalo, tarjeta impresa y tarjeta regalo construidas en 3D con CSS.
// Medidas en píxeles del mundo: x a la derecha, y hacia el espectador, z hacia arriba.
export const BOX = { width: 520, depth: 560, height: 96 };
export const TRAY = { width: 500, depth: 548, height: 84, wall: 10 };
export const CARD = { width: 400, height: Math.round((400 * 54) / 85.6), radius: 15 };
export const NOTE = { width: 440, height: 300 };

// Textura mate muy fina para el cartón.
const PAPER_GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='220' height='220' filter='url(%23n)' opacity='0.5'/></svg>")`;

const face = (width: number, height: number, transform: string, background: string): React.CSSProperties => ({
  backfaceVisibility: "hidden",
  background,
  height,
  left: -width / 2,
  position: "absolute",
  top: -height / 2,
  transform,
  width,
});

const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.18 }) => (
  <div
    style={{
      backgroundImage: PAPER_GRAIN,
      inset: 0,
      mixBlendMode: "overlay",
      opacity,
      position: "absolute",
    }}
  />
);

// Reflejo diagonal. El degradado se pinta en una capa mucho mayor que la superficie y solo se
// desplaza; así el reflejo se desvanece con naturalidad, sin cortes rectos en los bordes.
const Sheen: React.FC<{ width: number; height: number; offset: number; color: string }> = ({
  width,
  height,
  offset,
  color,
}) => (
  <div
    style={{
      background: `linear-gradient(120deg, transparent 43%, ${color} 50%, transparent 57%)`,
      height: height * 3,
      left: -width,
      pointerEvents: "none",
      position: "absolute",
      top: -height,
      translate: `${offset}px 0`,
      width: width * 3,
    }}
  />
);

// Tirador: lazo de cinta de raso negra, como el de la caja real. Una cinta ancha doblada
// sobre sí misma, con costuras en los bordes y una pequeña abertura en el doblez para
// engancharla con dos dedos. Sale por debajo del frontal del cajón y queda sobre la mesa.
export const TAB = { width: 72, length: 70 };

export const PullTab: React.FC<{ sway: number; top: number }> = ({ sway, top }) => {
  const { width: w, length: l } = TAB;
  const stitch = { stroke: "rgba(255,255,255,0.13)", strokeDasharray: "2.2 1.6", strokeWidth: 0.8 };
  return (
    <div
      style={{
        height: l + 8,
        left: -w / 2,
        position: "absolute",
        top,
        transform: `translateZ(5px) rotateZ(${sway}deg)`,
        transformOrigin: "50% 0",
        width: w,
      }}
    >
      <svg height={l + 8} viewBox={`0 0 ${w} ${l + 8}`} width={w}>
        <defs>
          <linearGradient id="satin" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#0c0c0f" />
            <stop offset="0.06" stopColor="#17171b" />
            <stop offset="0.94" stopColor="#141418" />
            <stop offset="1" stopColor="#0c0c0f" />
          </linearGradient>
          <pattern height="1.6" id="weave" patternUnits="userSpaceOnUse" width="3">
            <rect fill="rgba(255,255,255,0.035)" height="0.7" width="3" />
            <rect fill="rgba(255,255,255,0.025)" height="1.6" width="0.6" />
          </pattern>
          <linearGradient id="fold" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="rgba(0,0,0,0)" />
            <stop offset="0.7" stopColor="rgba(0,0,0,0.35)" />
            <stop offset="1" stopColor="rgba(0,0,0,0.6)" />
          </linearGradient>
        </defs>
        {/* Sombra blanda bajo el lazo. */}
        <rect fill="rgba(45,32,20,0.28)" height={l} rx="7" width={w - 4} x="3" y="8" />
        {/* Cinta plana. */}
        <rect fill="url(#satin)" height={l} rx="4" width={w} x="0" y="0" />
        <rect fill="url(#weave)" height={l} rx="4" width={w} x="0" y="0" />
        {/* Brillo diagonal muy suave del raso. */}
        <rect fill="rgba(255,255,255,0.035)" height={l} transform={`skewX(-24) translate(${w * 0.45} 0)`} width={w * 0.3} x="0" y="0" />
        {/* Costuras de los bordes. */}
        <line x1="4.5" x2="4.5" y1="0" y2={l - 6} {...stitch} />
        <line x1={w - 4.5} x2={w - 4.5} y1="0" y2={l - 6} {...stitch} />
        {/* Doblez del extremo, más oscuro, con la abertura del lazo. */}
        <rect fill="url(#fold)" height="12" rx="4" width={w} x="0" y={l - 12} />
        <path d={`M${w * 0.3} ${l - 2.5} Q${w / 2} ${l - 6} ${w * 0.7} ${l - 2.5}`} fill="none" stroke="rgba(0,0,0,0.8)" strokeLinecap="round" strokeWidth="2" />
      </svg>
    </div>
  );
};

// Funda de la caja: tapa con el símbolo y paredes. Abierta por delante, de donde sale el cajón.
export const Sleeve: React.FC<{ sheen: number }> = ({ sheen }) => {
  const { width: W, depth: D, height: H } = BOX;
  return (
    <>
      <div
        style={{
          ...face(W, D, `translateZ(${H}px)`, "linear-gradient(158deg, #3d3d42 0%, #2e2e33 45%, #252529 100%)"),
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
          overflow: "hidden",
        }}
      >
        <Grain />
        {/* Brillo suave que recorre la tapa con el movimiento de cámara. La capa del degradado
            es tres veces mayor que la tapa para que sus bordes nunca queden a la vista. */}
        <Sheen color="rgba(255,250,240,0.09)" height={D} offset={(sheen - 0.5) * W * 1.2} width={W} />
        <BrandSymbol
          fill="#ece8e1"
          style={{ left: (W - 196) / 2, position: "absolute", top: D * 0.2 }}
          width={196}
        />
      </div>
      {/* La funda es un tubo abierto por delante, como la real: sin pared frontal.
          Solo se ven los cantos del cartón alrededor de la boca, por donde sale el cajón. */}
      <div style={face(W, D, "translateZ(0.5px)", "#111113")} />
      <div
        style={face(W, 5, `translate3d(0, ${D / 2}px, ${H - 2.5}px) rotateX(-90deg)`, "#3b3b40")}
      />
      <div
        style={face(W, 4, `translate3d(0, ${D / 2}px, 2px) rotateX(-90deg)`, "#2a2a2e")}
      />
      {[-1, 1].map((side) => (
        <div
          key={side}
          style={face(5, H, `translate3d(${side * (W / 2 - 2.5)}px, ${D / 2}px, ${H / 2}px) rotateX(-90deg)`, "#303035")}
        />
      ))}
      <div
        style={{ ...face(D, H, `translate3d(${-W / 2}px, 0, ${H / 2}px) rotateY(-90deg) rotateZ(90deg)`, "#1d1d20"), backfaceVisibility: "visible" }}
      />
      <div
        style={{ ...face(D, H, `translate3d(${W / 2}px, 0, ${H / 2}px) rotateY(90deg) rotateZ(90deg)`, "#26262a"), backfaceVisibility: "visible" }}
      />
    </>
  );
};

// Cajón: bandeja con frontal, suelo, paredes y tirador de cinta.
export const Tray: React.FC<{ sway: number }> = ({ sway }) => {
  const { width: W, depth: D, height: H, wall } = TRAY;
  return (
    <>
      <div style={face(W, D, "translateZ(2px)", "#141416")} />
      <div
        style={face(W, H, `translate3d(0, ${D / 2}px, ${H / 2}px) rotateX(-90deg)`, "linear-gradient(180deg, #303034, #1e1e21)")}
      />
      <div
        style={face(W, H, `translate3d(0, ${D / 2 - wall}px, ${H / 2}px) rotateX(-90deg)`, "#101012")}
      />
      <div
        style={face(D, H, `translate3d(${-W / 2 + wall}px, 0, ${H / 2}px) rotateY(90deg) rotateZ(90deg)`, "#18181a")}
      />
      <div
        style={face(D, H, `translate3d(${W / 2 - wall}px, 0, ${H / 2}px) rotateY(-90deg) rotateZ(90deg)`, "#1c1c1f")}
      />
      {/* Borde superior de las paredes, que recoge la luz. */}
      <div
        style={face(W, wall, `translate3d(0, ${D / 2 - wall / 2}px, ${H}px)`, "linear-gradient(180deg, #4a4a50, #35353a)")}
      />
      {/* Tramo de cinta que baja por el frontal del cajón. */}
      <div
        style={face(TAB.width, 24, `translate3d(0, ${D / 2 + 0.6}px, 12px) rotateX(-90deg)`, "linear-gradient(90deg, #09090b, #26262b 50%, #09090b)")}
      />
      <PullTab sway={sway} top={D / 2} />
    </>
  );
};

// Tarjeta impresa con la frase real de la caja.
export const Note: React.FC = () => (
  <div
    style={{
      alignItems: "center",
      background: "linear-gradient(170deg, #fbfaf7, #efece6)",
      boxShadow: "0 1px 0 rgba(0,0,0,0.2)",
      display: "flex",
      flexDirection: "column",
      height: NOTE.height,
      justifyContent: "center",
      position: "relative",
      width: NOTE.width,
    }}
  >
    <div style={{ border: "1.5px solid #c9c4bb", inset: 14, position: "absolute" }} />
    <div
      style={{
        color: "#6e6a65",
        fontFamily: SERIF_TEXT,
        fontSize: 25,
        fontWeight: 300,
        lineHeight: 1.32,
        marginTop: -26,
        textAlign: "center",
      }}
    >
      Disfruta de tu momento de
      <br />
      cuidado, belleza
      <br />y bienestar.
    </div>
    <BrandSymbol fill="#7a7671" style={{ marginTop: 30 }} width={34} />
  </div>
);

// Tarjeta regalo: negro brillante con la rotulación SARAVALOR.
export const Card: React.FC<{ gloss: number }> = ({ gloss }) => (
  <div
    style={{
      alignItems: "center",
      background: "linear-gradient(150deg, #1b1b1f 0%, #0c0c0e 55%, #121215 100%)",
      borderRadius: CARD.radius,
      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
      display: "flex",
      height: CARD.height,
      justifyContent: "center",
      overflow: "hidden",
      position: "relative",
      width: CARD.width,
    }}
  >
    <BrandWordmark fill="#f1eee9" width={CARD.width * 0.72} />
    <Sheen color="rgba(255,255,255,0.13)" height={CARD.height} offset={(gloss - 0.5) * CARD.width * 2.2} width={CARD.width} />
  </div>
);
