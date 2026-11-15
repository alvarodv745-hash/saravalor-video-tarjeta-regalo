export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;

// Zonas que tapa la interfaz de Instagram Stories/Reels.
export const SAFE_ZONE = {
  top: 250,
  bottom: 340,
} as const;

// Hueco libre para el sticker de enlace, que se añade a mano en Instagram.
export const STICKER_ZONE = {
  top: 1150,
  height: 200,
  width: 620,
} as const;

export const COLORS = {
  ink: "#0b0a0e",
  inkSoft: "#17151b",
  cream: "#f4efe8",
  paper: "#fbf8f3",
  gold: "#c9a26b",
  text: "#201d22",
} as const;

export const CENTRO_PART = 80;

export const TRANSITION_FRAMES = {
  slit: 24,
  arch: 26,
  dissolve: 18,
} as const;

// Duraciones en fotogramas.
export const DURATIONS = {
  intro: 290,
  centro: CENTRO_PART * 3 - TRANSITION_FRAMES.dissolve * 2,
  entrega: 90,
  compra: 150,
  opciones: 108,
  cierre: 150,
} as const;

export const STORY_FRAMES =
  Object.values(DURATIONS).reduce((sum, value) => sum + value, 0) -
  (TRANSITION_FRAMES.slit + TRANSITION_FRAMES.arch + TRANSITION_FRAMES.dissolve * 3);
