import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../../constants";
import { SANS, SERIF } from "../../fonts";
import { EASE_IN_OUT, EASE_OUT, progress } from "../../motion";
import { BOX, Card, CARD, Note, NOTE, Sleeve, Tray, TRAY } from "./GiftBox";

// Apertura construida desde cero: caja, tarjeta impresa y tarjeta regalo en un estudio luminoso.
// Fases: caja cerrada, el cajón sale, la cámara baja sobre la tarjeta impresa, la tarjeta
// impresa se retira, la tarjeta regalo sube hacia la cámara y gira de canto (ver slitReveal).
export const INTRO = {
  drawerOut: [18, 96],
  descend: [92, 150],
  noteAway: [150, 188],
  cardRise: [196, 246],
  cardEdge: [256, 276],
} as const;

const SLIDE = 380;
// La tarjeta regalo sale hacia el espectador antes de subir, para no cruzarse con la tapa.
const CARD_FORWARD = 300;
const CARD_LIFT = 900;
// Posición del contenido dentro del cajón: hacia el frontal, para que con el cajón fuera
// quede entero a la vista y nunca bajo la tapa.
const CONTENT_OFFSET = 87;
// Centro del contenido del cajón, en coordenadas del mundo, con el cajón fuera.
const CONTENT_Y = BOX.depth / 2 + SLIDE - TRAY.depth / 2 + CONTENT_OFFSET;
// Parte de una pieza del cajón que aún queda dentro de la caja: se recorta para que no la atraviese.
const hiddenUnderLid = (slide: number, top: number, height: number) =>
  Math.min(height, Math.max(0, BOX.depth / 2 - slide - top));

const keys = (frame: number, input: number[], output: number[]) =>
  interpolate(frame, input, output, {
    easing: EASE_IN_OUT,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// Permite reutilizar la intro a otra velocidad o sin titular (por ejemplo, en versiones cortas):
// con los valores por defecto se comporta exactamente igual.
export type IntroSceneProps = {
  speed?: number;
  startAt?: number;
  showHeadline?: boolean;
};

export const IntroScene: React.FC<IntroSceneProps> = ({ speed = 1, startAt = 0, showHeadline = true }) => {
  const frame = startAt + useCurrentFrame() * speed;

  const slide = progress(frame, ...INTRO.drawerOut) * SLIDE;
  // La cinta del tirador se balancea un poco con el tirón y se asienta.
  const pull = slide - progress(frame - 3, ...INTRO.drawerOut) * SLIDE;
  const sway = interpolate(pull, [0, 20], [0, 3], { extrapolateRight: "clamp" }) * Math.sin(frame / 4);
  // La tarjeta impresa sube primero y después sale hacia un lado.
  const noteUp = progress(frame, INTRO.noteAway[0], INTRO.noteAway[0] + 20);
  const noteAway = progress(frame, INTRO.noteAway[0] + 10, INTRO.noteAway[1]);
  const rise = progress(frame, ...INTRO.cardRise, EASE_OUT);
  const edge = progress(frame, ...INTRO.cardEdge, EASE_IN_OUT);

  // Cámara: inclinación, giro, escala, punto de interés y su posición en pantalla.
  const tilt = keys(frame, [0, 100, 150, 196, 246], [52, 46, 16, 16, 18]);
  const spin = keys(frame, [0, 110], [-12, 0]);
  const scale = keys(frame, [0, 100, 150, 196, 246], [1.14, 1.1, 1.5, 1.5, 1.15]);
  const focusY = keys(frame, [40, 150, 196, 246], [0, CONTENT_Y, CONTENT_Y, CONTENT_Y + CARD_FORWARD]);
  const screenY = keys(frame, [0, 100, 150, 196, 246], [1160, 1110, 1000, 1000, 1460]);
  // Profundidad de campo: la caja se desenfoca y aclara cuando la tarjeta sube.
  const depth = progress(frame, INTRO.cardRise[0] + 6, INTRO.cardRise[1]);

  const headline = showHeadline ? 1 - progress(frame, 86, 112) : 0;

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse 95% 62% at 50% 40%, #fdfaf5 0%, #f3ece2 46%, #e6dacb 100%)",
        overflow: "hidden",
      }}
    >
      {/* Luz de ventana muy suave que cruza el estudio. */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(115deg, rgba(255,255,255,0) 20%, rgba(255,252,246,0.55) 42%, rgba(255,255,255,0) 64%)",
          translate: `${interpolate(frame, [0, 290], [-120, 120])}px 0`,
        }}
      />
      <div
        style={{
          filter: `blur(${depth * 8}px)`,
          left: 0,
          opacity: 1 - depth * 0.3,
          perspective: 2600,
          position: "absolute",
          right: 0,
          top: screenY,
        }}
      >
        <div
          style={{
            left: 540,
            position: "absolute",
            top: 0,
            transform: `scale(${scale}) rotateX(${tilt}deg) rotateZ(${spin}deg) translate3d(0, ${-focusY}px, 0)`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Sombra de contacto y sombra larga sobre la mesa. */}
          <div
            style={{
              background: "rgba(60, 42, 28, 0.42)",
              borderRadius: 28,
              filter: "blur(26px)",
              height: BOX.depth + slide + 40,
              left: -BOX.width / 2 - 10,
              position: "absolute",
              top: -BOX.depth / 2 + 30,
              width: BOX.width + 40,
            }}
          />
          <div style={{ position: "absolute", transformStyle: "preserve-3d", translate: `0 ${slide}px` }}>
            <div style={{ position: "absolute", transform: "translateZ(4px)", transformStyle: "preserve-3d" }}>
              <Tray sway={sway} />
            </div>
            {/* Tarjeta regalo en reposo; al subir pasa a su propia capa para cruzar por delante de la caja. */}
            <div
              style={{
                left: -CARD.width / 2,
                clipPath: `inset(${hiddenUnderLid(slide, CONTENT_OFFSET - CARD.height / 2, CARD.height)}px 0 0 0)`,
                opacity: frame < INTRO.cardRise[0] ? 1 : 0,
                position: "absolute",
                top: -CARD.height / 2 + CONTENT_OFFSET,
                transform: "translateZ(8px)",
              }}
            >
              <Card gloss={0} />
            </div>
            <div
              style={{
                left: -NOTE.width / 2,
                clipPath: `inset(${noteUp > 0 ? 0 : hiddenUnderLid(slide, CONTENT_OFFSET - NOTE.height / 2, NOTE.height)}px 0 0 0)`,
                opacity: 1 - progress(frame, INTRO.noteAway[1] - 8, INTRO.noteAway[1]),
                position: "absolute",
                top: -NOTE.height / 2 + CONTENT_OFFSET,
                transform: `translate3d(${noteAway * 1000}px, ${-noteAway * 200}px, ${10 + noteUp * 220}px) rotateZ(${noteAway * 12}deg)`,
              }}
            >
              <Note />
            </div>
          </div>
          <div style={{ position: "absolute", transformStyle: "preserve-3d" }}>
            <Sleeve sheen={interpolate(frame, [0, 150], [0.15, 0.85], { extrapolateRight: "clamp" })} />
          </div>
        </div>
      </div>
      {/* Capa de la tarjeta regalo: mismo mundo y misma cámara, sin la caja, para que pase por delante. */}
      <div
        style={{
          left: 0,
          opacity: frame >= INTRO.cardRise[0] ? 1 : 0,
          perspective: 2600,
          position: "absolute",
          right: 0,
          top: screenY,
        }}
      >
        <div
          style={{
            left: 540,
            position: "absolute",
            top: 0,
            transform: `scale(${scale}) rotateX(${tilt}deg) rotateZ(${spin}deg) translate3d(0, ${-focusY}px, 0)`,
            transformStyle: "preserve-3d",
          }}
        >
          <div style={{ position: "absolute", transformStyle: "preserve-3d", translate: `0 ${slide}px` }}>
            <div
              style={{
                left: -CARD.width / 2,
                position: "absolute",
                top: -CARD.height / 2 + CONTENT_OFFSET,
                transform: `translate3d(0, ${rise * CARD_FORWARD}px, ${8 + rise * CARD_LIFT}px) rotateX(${-tilt * rise + edge * 90}deg)`,
                transformStyle: "preserve-3d",
              }}
            >
              <Card gloss={interpolate(frame, [200, 250], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          left: 90,
          opacity: headline,
          position: "absolute",
          right: 90,
          textAlign: "center",
          top: 280,
        }}
      >
        <div style={{ color: "#a3804f", fontFamily: SANS, fontSize: 32, letterSpacing: 9 }}>
          TARJETA REGALO
        </div>
        <div
          style={{
            color: COLORS.text,
            fontFamily: SERIF,
            fontSize: 82,
            lineHeight: 1.1,
            marginTop: 18,
          }}
        >
          Descubre un mundo lleno de sensaciones
        </div>
      </div>
    </AbsoluteFill>
  );
};
