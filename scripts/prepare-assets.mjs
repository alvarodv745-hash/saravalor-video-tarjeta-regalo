// Genera public/derived a partir de public/assets. Nunca escribe sobre los originales.
// Si llegan versiones de mayor resolución de los vídeos, basta con sustituir la ruta de origen.
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import ffmpegPath from "ffmpeg-static";
import sharp from "sharp";

const SRC = "public/assets";
const OUT = "public/derived";
const PHOTOS = `${SRC}/fotos-del-centro`;

const SOURCES = {
  cajaPago: `${SRC}/video-caja-de-pago.mov`,
  cajaGratis: `${SRC}/video-caja-gratis.mp4`,
  centro: `${SRC}/video-centro-saravalor.mp4`,
  web: `${SRC}/video-web-saravalor-iphone-resolution.mp4`,
};

mkdirSync(OUT, { recursive: true });

const ffmpeg = (args) => {
  execFileSync(ffmpegPath, ["-hide_banner", "-v", "error", "-y", ...args], { stdio: "inherit" });
};

const encode = ["-c:v", "libx264", "-crf", "14", "-preset", "slow", "-pix_fmt", "yuv420p", "-r", "30", "-an"];

// Corrección suave para las grabaciones de la caja: negros más profundos, luces contenidas
// y un punto más cálido. Sin cambiar el diseño ni los colores del producto.
const GRADE = "eq=contrast=1.07:brightness=-0.015:gamma=0.97:saturation=0.94,colorbalance=rs=0.015:bs=-0.02:rh=0.01:bh=-0.015";
const UPSCALE = (w, h) => `scale=${w}:${h}:flags=lanczos,hqdn3d=1.2:1.2:3:3,unsharp=5:5:0.45:5:5:0`;

// Paneles de presentación a resolución nativa, sin ampliar.
ffmpeg([
  "-ss", "3.6", "-t", "2.7", "-i", SOURCES.cajaGratis,
  "-vf", `${GRADE},crop=440:620:12:120`,
  ...encode, `${OUT}/panel-sobre.mp4`,
]);
ffmpeg([
  "-ss", "11.6", "-t", "4.8", "-i", SOURCES.cajaPago,
  "-vf", `reverse,${GRADE},crop=440:620:12:120`,
  ...encode, `${OUT}/panel-caja.mp4`,
]);

// Fotograma real para el cierre: caja abierta con la tarjeta.
ffmpeg([
  "-ss", "7.2", "-i", SOURCES.cajaPago, "-frames:v", "1",
  "-vf", `${GRADE},crop=380:560:44:150,scale=760:1120:flags=lanczos,unsharp=5:5:0.4:5:5:0`,
  `${OUT}/cierre-caja.png`,
]);

ffmpeg([
  "-ss", "31.2", "-t", "6", "-i", SOURCES.centro,
  "-vf", `crop=440:666:180:420,${UPSCALE(936, 1416)},eq=saturation=0.94`,
  ...encode, `${OUT}/centro-ritual.mp4`,
]);
ffmpeg([
  "-ss", "27.5", "-t", "2.8", "-i", SOURCES.centro,
  "-vf", `crop=450:681:190:280,${UPSCALE(936, 1416)},eq=saturation=0.94`,
  ...encode, `${OUT}/centro-facial.mp4`,
]);

// Web real a pantalla completa. La barra de estado (con la píldora roja de grabación) se cubre
// con una franja blanca lisa, que queda bajo la isla dinámica del mockup.
ffmpeg([
  "-ss", "72", "-t", "32", "-i", SOURCES.web,
  "-vf", "drawbox=x=0:y=0:w=1170:h=128:color=white:t=fill,scale=780:-2:flags=lanczos",
  ...encode, `${OUT}/compra-iphone.mp4`,
]);

ffmpeg(["-ss", "14", "-i", SOURCES.centro, "-vn", "-c:a", "aac", "-b:a", "192k", `${OUT}/musica.m4a`]);

const photo = async (name, out, width) => {
  await sharp(`${PHOTOS}/${name}`)
    .resize({ width, kernel: "lanczos3" })
    .sharpen({ sigma: 0.7 })
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(`${OUT}/${out}`);
};
await photo("foto002.png", "centro-sala.jpg", 1500);
await photo("foto011.jpg", "entrega-bolsa.jpg", 1400);

await sharp(`${SRC}/logos-saravalor/logotipo-sara-valor.png`).negate({ alpha: false }).toFile(`${OUT}/logo-white.png`);

console.log("Listo:", path.resolve(OUT));
