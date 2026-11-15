import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { IPhoneFrame } from "../components/IPhoneFrame";
import { WordReveal } from "../components/WordReveal";
import { COLORS } from "../constants";
import { SANS, SERIF } from "../fonts";
import { EASE_IN_OUT, EASE_OUT, progress } from "../motion";

const PHONE = { width: 560, top: 560 };
// Posición aproximada del botón «Añadir al carrito» dentro del teléfono.
const BUTTON_ORIGIN = "50% 62%";
const CUT = 80;

const screen: React.CSSProperties = { height: "100%", width: "100%" };

export const CompraScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = progress(frame, 0, 34, EASE_OUT);
  // Pausa sobre la ficha y acercamiento hasta el botón de compra.
  const push = progress(frame, 92, 116, EASE_IN_OUT);
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream, overflow: "hidden" }}>
      <div
        style={{
          left: 0,
          opacity: 1 - push,
          position: "absolute",
          right: 0,
          textAlign: "center",
          top: 280,
        }}
      >
        <WordReveal
          startFrame={8}
          style={{ color: COLORS.text, fontFamily: SERIF, fontSize: 88 }}
          text="Cómprala online"
        />
        <WordReveal
          startFrame={20}
          style={{
            color: COLORS.text,
            fontFamily: SANS,
            fontSize: 44,
            fontWeight: 300,
            marginTop: 10,
          }}
          text="saravalor.com"
        />
      </div>
      <div
        style={{
          left: (1080 - PHONE.width) / 2,
          perspective: 2200,
          position: "absolute",
          top: PHONE.top,
          translate: `0 ${interpolate(enter, [0, 1], [340, 0]) - push * 330}px`,
        }}
      >
        <div
          style={{
            rotate: `x ${interpolate(enter, [0, 1], [14, 0])}deg`,
            scale: interpolate(push, [0, 1], [1, 1.9]),
            transformOrigin: BUTTON_ORIGIN,
          }}
        >
          <IPhoneFrame width={PHONE.width}>
            <Sequence durationInFrames={CUT} layout="none">
              <Video
                muted
                objectFit="cover"
                playbackRate={1.3}
                src={staticFile("derived/compra-iphone.mp4")}
                style={screen}
                trimBefore={3 * fps}
              />
            </Sequence>
            <Sequence from={CUT} layout="none">
              <Video
                muted
                objectFit="cover"
                src={staticFile("derived/compra-iphone.mp4")}
                style={screen}
                trimBefore={27.6 * fps}
              />
            </Sequence>
          </IPhoneFrame>
        </div>
      </div>
    </AbsoluteFill>
  );
};
