// Vectoriza el símbolo y la rotulación SARAVALOR a partir de los originales, para dibujarlos
// nítidos a cualquier tamaño en la apertura. Genera src/brand/marks.ts.
// El símbolo sale de la tapa de la caja (0208ddb1), más grande que en el logotipo, y la
// rotulación, del logotipo oficial (con VALOR en negrita, como en la marca).
import { writeFileSync, mkdirSync } from "node:fs";
import potrace from "potrace";
import sharp from "sharp";

const PACK = "public/assets/tarjeta-y-packaging";
const UPSCALE = 4;

const trace = async (file, region, { lightOnDark = true, upscale = UPSCALE } = {}) => {
  let image = sharp(file).flatten({ background: "#ffffff" }).extract(region).greyscale();
  image = image.resize({ width: region.width * upscale, kernel: "lanczos3" }).blur(upscale / 4);
  if (lightOnDark) image = image.negate();
  const input = await image.png().toBuffer();
  const svg = await new Promise((resolve, reject) => {
    potrace.trace(input, { threshold: 128, turdSize: 60, optTolerance: 0.9, alphaMax: 1.1 }, (error, result) =>
      error ? reject(error) : resolve(result),
    );
  });
  const d = [...svg.matchAll(/ d="([^"]+)"/g)].map((match) => match[1]).join(" ");
  return { d, width: region.width * upscale, height: region.height * upscale };
};

const mark = await trace(`${PACK}/0208ddb1-9f86-47f0-95a1-c9e98a571c45.JPG`, {
  left: 606,
  top: 323,
  width: 203,
  height: 217,
});
const wordmark = await trace(
  "public/assets/logos-saravalor/logotipo-sara-valor.png",
  { left: 4, top: 92, width: 336, height: 46 },
  { lightOnDark: false, upscale: 8 },
);

mkdirSync("src/brand", { recursive: true });
writeFileSync(
  "src/brand/marks.ts",
  `// Generado por scripts/trace-brand.mjs. No editar a mano.
export const MARK = ${JSON.stringify(mark)};
export const WORDMARK = ${JSON.stringify(wordmark)};
`,
);
console.log("Vectores:", mark.d.length, wordmark.d.length);
