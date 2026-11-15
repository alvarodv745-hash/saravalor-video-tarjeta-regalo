// Mockup de iPhone Pro hecho con CSS: pantalla 19,5:9, marco metálico, botones laterales
// e isla dinámica. La pantalla recibe la grabación real de la web, sin modificarla.
const BODY_RATIO = 2.06;

const SideButton: React.FC<{
  side: "left" | "right";
  top: number;
  length: number;
  width: number;
  height: number;
}> = ({ side, top, length, width, height }) => (
  <div
    style={{
      background: "linear-gradient(90deg, #6d6a66, #b9b5ae 50%, #6d6a66)",
      borderRadius: 3,
      height: height * length,
      left: side === "left" ? -width * 0.009 : undefined,
      position: "absolute",
      right: side === "right" ? -width * 0.009 : undefined,
      top: height * top,
      width: width * 0.012,
    }}
  />
);

export const IPhoneFrame: React.FC<{ width: number; children: React.ReactNode }> = ({
  width,
  children,
}) => {
  const height = width * BODY_RATIO;
  const edge = width * 0.012;
  const bezel = width * 0.028;
  const radius = width * 0.165;

  return (
    <div style={{ height, position: "relative", width }}>
      <SideButton height={height} length={0.035} side="left" top={0.16} width={width} />
      <SideButton height={height} length={0.062} side="left" top={0.225} width={width} />
      <SideButton height={height} length={0.062} side="left" top={0.3} width={width} />
      <SideButton height={height} length={0.1} side="right" top={0.25} width={width} />
      <div
        style={{
          background:
            "linear-gradient(135deg, #d9d5ce 0%, #8e8a84 18%, #c8c4bd 34%, #7d7a75 62%, #bdb9b2 82%, #8a8781 100%)",
          borderRadius: radius,
          boxShadow:
            "0 70px 120px rgba(40, 30, 20, 0.3), 0 18px 40px rgba(40, 30, 20, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.35)",
          inset: 0,
          padding: edge,
          position: "absolute",
        }}
      >
        <div
          style={{
            backgroundColor: "#050505",
            borderRadius: radius - edge,
            height: "100%",
            padding: bezel,
            width: "100%",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: radius - edge - bezel,
              height: "100%",
              overflow: "hidden",
              position: "relative",
              width: "100%",
            }}
          >
            {children}
            <div
              style={{
                backgroundColor: "#000",
                borderRadius: width,
                height: width * 0.075,
                left: "50%",
                position: "absolute",
                top: width * 0.028,
                translate: "-50% 0",
                width: width * 0.29,
              }}
            />
            <div
              style={{
                background:
                  "linear-gradient(115deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 30%)",
                inset: 0,
                pointerEvents: "none",
                position: "absolute",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
