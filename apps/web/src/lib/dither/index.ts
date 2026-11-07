export {
  BAYER_2,
  BAYER_4,
  BAYER_8,
  BLUE_NOISE_64,
  DITHER_MATRICES,
  getThresholdMap,
  isInked,
  thresholdAt,
} from "@/lib/dither/matrices";

export type { DitherMatrix, ThresholdMap } from "@/lib/dither/matrices";

export {
  cssColor,
  DEFAULT_PALETTE,
  DITHER_COLOR_NAMES,
  DITHER_COLORS,
  MOTION,
} from "@/lib/dither/tokens";

export type {
  DitherColor,
  DitherColorName,
  DitherPalette,
  Rgba,
} from "@/lib/dither/tokens";

export {
  readDitherCell,
  resolveColor,
  subscribeToTheme,
  useDitherColors,
} from "@/lib/dither/color";

export {
  useDocumentVisible,
  useFrameLoop,
  useInView,
  usePrefersReducedMotion,
} from "@/lib/dither/motion";

export type {
  FrameLoopCallback,
  FrameLoopOptions,
  FrameLoopState,
} from "@/lib/dither/motion";

export type FillVariant = "gradient" | "dotted" | "hatched" | "solid";
