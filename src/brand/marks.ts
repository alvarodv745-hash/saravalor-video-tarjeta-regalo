// Marcador de posición público.
//
// Los vectores reales del símbolo y la rotulación son propiedad de la marca y no se publican.
// Se generan en local con `node scripts/trace-brand.mjs` a partir de los originales privados,
// que sustituyen este archivo. Estas formas neutras permiten compilar y previsualizar el proyecto.
export const MARK = {
  d: "M 100 10 C 150 10 190 50 190 100 C 190 150 150 190 100 190 C 50 190 10 150 10 100 C 10 50 50 10 100 10 Z M 100 40 C 67 40 40 67 40 100 C 40 133 67 160 100 160 C 133 160 160 133 160 100 C 160 67 133 40 100 40 Z",
  width: 200,
  height: 200,
};

export const WORDMARK = {
  d: "M 0 0 H 600 V 20 H 0 Z M 0 60 H 600 V 80 H 0 Z",
  width: 600,
  height: 80,
};
