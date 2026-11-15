import { loadFont as loadBodoni } from "@remotion/google-fonts/BodoniModa";
import { loadFont as loadMerriweather } from "@remotion/google-fonts/Merriweather";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";

// Serif de texto, parecida a la de la tarjeta impresa de la caja.
export const SERIF_TEXT = loadMerriweather("normal", {
  weights: ["300"],
  subsets: ["latin"],
}).fontFamily;

export const SERIF = loadBodoni("normal", {
  weights: ["400", "500"],
  subsets: ["latin"],
}).fontFamily;

export const SANS = loadPoppins("normal", {
  weights: ["300", "400"],
  subsets: ["latin"],
}).fontFamily;
