"use client";

import { cn } from "@befday-2.0/ui/lib/utils";
import type { ComponentProps, RefObject } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  cssColor,
  thresholdAt,
  useDitherColors,
  useFrameLoop,
  useInView,
} from "@/lib/dither";
import type {
  DitherColor,
  DitherMatrix,
  FillVariant,
  Rgba,
} from "@/lib/dither";

export type LogoSource = "alpha" | "dark";

export type LogoTone = "mono" | "original";

export const LOGO_EFFECTS = ["none", "shimmer", "scan"] as const;

export type LogoEffect = (typeof LOGO_EFFECTS)[number];

export interface DitherGrid {
  readonly columns: number;
  readonly rows: number;
  readonly scale: number;
  readonly width: number;
  readonly height: number;
}

export type DitheredLogoProps = Omit<ComponentProps<"div">, "children"> & {
  src: string;
  alt: string;
  color?: DitherColor;
  tone?: LogoTone;
  source?: LogoSource;
  fill?: FillVariant;
  outline?: boolean;
  floor?: number;
  matrix?: DitherMatrix;
  cell?: number;
  effect?: LogoEffect;
  period?: number;
  phase?: number;
  lazy?: boolean;
};

interface LogoRasterData {
  readonly grid: DitherGrid;
  readonly inside: Uint8Array;
  readonly rim: Uint8Array;
  readonly pixels: ImageData;
  readonly top: number;
  readonly bottom: number;
}

const CANVAS_CLASS =
  "pointer-events-none absolute inset-0 size-full [image-rendering:pixelated]";

const FADE_CLASS =
  "transition-opacity duration-150 motion-reduce:transition-none";

const imageCache = new Map<string, Promise<HTMLImageElement>>();

const decodeImage = async (src: string) => {
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.decoding = "async";
  image.src = src;

  try {
    await image.decode();

    return image;
  } catch (error) {
    imageCache.delete(src);
    throw error;
  }
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
  const cached = imageCache.get(src);

  if (cached) {
    return cached;
  }

  const promise = decodeImage(src);
  imageCache.set(src, promise);

  return promise;
};

const useLoadedImage = (src: string, enabled: boolean) => {
  const [result, setResult] = useState<{
    src: string;
    image: HTMLImageElement | null;
  } | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      let image: HTMLImageElement | null = null;

      try {
        image = await loadImage(src);
      } catch {
        image = null;
      }

      if (!cancelled) {
        setResult({ image, src });
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [src, enabled]);

  if (!enabled || result?.src !== src) {
    return { image: null, status: enabled ? "loading" : "idle" } as const;
  }

  return result.image
    ? ({ image: result.image, status: "ready" } as const)
    : ({ image: null, status: "error" } as const);
};

const gridFor = (width: number, height: number, cell: number): DitherGrid => {
  const ratio = window.devicePixelRatio || 1;
  const scale = Math.max(1, Math.round(cell * ratio));
  const columns = Math.max(1, Math.ceil((width * ratio) / scale));
  const rows = Math.max(1, Math.ceil((height * ratio) / scale));

  return {
    columns,
    height: (rows * scale) / ratio,
    rows,
    scale,
    width: (columns * scale) / ratio,
  };
};

const sameGrid = (a: DitherGrid | null, b: DitherGrid) =>
  a !== null &&
  a.columns === b.columns &&
  a.rows === b.rows &&
  a.scale === b.scale;

const useDitherGrid = (
  ref: RefObject<HTMLElement | null>,
  cell: number
): DitherGrid | null => {
  const [grid, setGrid] = useState<DitherGrid | null>(null);

  useEffect(() => {
    const el = ref.current;

    if (!el) {
      return;
    }

    const measure = () => {
      const { width, height } = el.getBoundingClientRect();

      if (width < 1 || height < 1) {
        return;
      }

      const next = gridFor(width, height, cell);
      setGrid((current) => (sameGrid(current, next) ? current : next));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);

    return () => observer.disconnect();
  }, [ref, cell]);

  return grid;
};

const makeCanvas = (width: number, height: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  return canvas;
};

const rasterize = (
  image: HTMLImageElement,
  columns: number,
  rows: number
): ImageData | null => {
  const scaleX = columns / image.naturalWidth;
  const scaleY = rows / image.naturalHeight;
  const scale = Math.min(scaleX, scaleY);

  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  const x = (columns - width) / 2;
  const y = (rows - height) / 2;

  let source: CanvasImageSource = image;
  let sourceWidth = image.naturalWidth;
  let sourceHeight = image.naturalHeight;

  while (sourceWidth / 2 > width && sourceHeight / 2 > height) {
    const half = makeCanvas(
      Math.ceil(sourceWidth / 2),
      Math.ceil(sourceHeight / 2)
    );

    const context = half.getContext("2d");

    if (!context) {
      break;
    }

    context.imageSmoothingQuality = "high";
    context.drawImage(source, 0, 0, half.width, half.height);
    source = half;
    sourceWidth = half.width;
    sourceHeight = half.height;
  }

  const canvas = makeCanvas(columns, rows);
  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (!context) {
    return null;
  }

  context.imageSmoothingQuality = "high";
  context.drawImage(source, x, y, width, height);

  return context.getImageData(0, 0, columns, rows);
};

const sizeCanvas = (canvas: HTMLCanvasElement, grid: DitherGrid) => {
  if (canvas.width !== grid.columns || canvas.height !== grid.rows) {
    canvas.width = grid.columns;
    canvas.height = grid.rows;
  }

  canvas.style.width = `${grid.width}px`;
  canvas.style.height = `${grid.height}px`;
};

const coverageAt = (
  data: Uint8ClampedArray,
  index: number,
  source: LogoSource
) => {
  const offset = index * 4;
  const alpha = (data[offset + 3] ?? 0) / 255;

  if (source === "alpha") {
    return alpha;
  }

  const light =
    (0.2126 * (data[offset] ?? 0) +
      0.7152 * (data[offset + 1] ?? 0) +
      0.0722 * (data[offset + 2] ?? 0)) /
    255;

  return (1 - light) * alpha;
};

const COLOR_SEAM = 0.3;

const colorGap = (data: Uint8ClampedArray, a: number, b: number) =>
  (Math.abs((data[a] ?? 0) - (data[b] ?? 0)) +
    Math.abs((data[a + 1] ?? 0) - (data[b + 1] ?? 0)) +
    Math.abs((data[a + 2] ?? 0) - (data[b + 2] ?? 0))) /
  255;

const rasterizeLogoGeometry = (
  pixels: ImageData,
  grid: DitherGrid,
  source: LogoSource
): LogoRasterData => {
  const { columns, rows } = grid;
  const inside = new Uint8Array(columns * rows);
  let top = rows;
  let bottom = 0;

  for (let index = 0; index < inside.length; index += 1) {
    if (coverageAt(pixels.data, index, source) >= 0.5) {
      inside[index] = 1;
      const row = Math.floor(index / columns);
      top = Math.min(top, row);
      bottom = Math.max(bottom, row);
    }
  }

  const at = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < columns && y < rows
      ? (inside[y * columns + x] ?? 0)
      : 0;

  const seam = (x: number, y: number, dx: number, dy: number) =>
    at(x + dx, y + dy) === 1 &&
    colorGap(
      pixels.data,
      (y * columns + x) * 4,
      ((y + dy) * columns + x + dx) * 4
    ) > COLOR_SEAM;

  const rim = new Uint8Array(inside.length);

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      const edge =
        at(x, y) === 1 &&
        (at(x - 1, y) === 0 ||
          at(x + 1, y) === 0 ||
          at(x, y - 1) === 0 ||
          at(x, y + 1) === 0 ||
          seam(x, y, 1, 0) ||
          seam(x, y, 0, 1));

      rim[y * columns + x] = edge ? 1 : 0;
    }
  }

  return { bottom, grid, inside, pixels, rim, top };
};

const fillInks = (
  fill: FillVariant,
  matrix: DitherMatrix,
  x: number,
  y: number,
  density: number
) => {
  switch (fill) {
    case "solid": {
      return true;
    }

    case "dotted": {
      return y % 2 === 0 && (x + y / 2) % 2 === 0;
    }

    case "hatched": {
      return (x + y) % 4 === 3;
    }

    case "gradient": {
      return density > thresholdAt(matrix, x, y);
    }

    default: {
      return true;
    }
  }
};

const BAND = 0.14;
const TRAIL = 0.35;

const effectAt = ({
  effect,
  sweep,
  x,
  y,
  columns,
  top,
  height,
}: {
  effect: LogoEffect;
  sweep: number;
  x: number;
  y: number;
  columns: number;
  top: number;
  height: number;
}) => {
  if (effect === "shimmer") {
    const along = x / columns - ((y - top) / height) * 0.3;
    const center = -BAND * 2 + sweep * (1 + BAND * 4);

    return { boost: Math.exp(-(((along - center) / BAND) ** 2)), line: false };
  }

  if (effect === "scan") {
    const row = top - height * TRAIL + sweep * height * (1 + TRAIL * 2);
    const behind = row - y;
    const line = Math.round(row) === y;

    const boost =
      behind >= 0 && behind < height * TRAIL
        ? 1 - behind / (height * TRAIL)
        : 0;

    return { boost, line };
  }

  return { boost: 0, line: false };
};

const writeCell = (out: Uint8ClampedArray, offset: number, color: Rgba) => {
  out[offset] = (color[0] ?? 0) * 255;
  out[offset + 1] = (color[1] ?? 0) * 255;
  out[offset + 2] = (color[2] ?? 0) * 255;
  out[offset + 3] = (color[3] ?? 1) * 255;
};

const sourceColor = (data: Uint8ClampedArray, offset: number): Rgba => [
  (data[offset] ?? 0) / 255,
  (data[offset + 1] ?? 0) / 255,
  (data[offset + 2] ?? 0) / 255,
  1,
];

interface PaintOptions {
  logoData: LogoRasterData;
  work: ImageData;
  ink: Rgba;
  glint: Rgba;
  tone: LogoTone;
  fill: FillVariant;
  outline: boolean;
  floor: number;
  matrix: DitherMatrix;
  effect: LogoEffect;
  sweep: number;
}

const paintLogo = ({
  logoData,
  work,
  ink,
  glint,
  tone,
  fill,
  outline,
  floor,
  matrix,
  effect,
  sweep,
}: PaintOptions) => {
  const { columns, rows } = logoData.grid;
  const out = work.data;
  const height = Math.max(1, logoData.bottom - logoData.top);

  for (let y = 0; y < rows; y += 1) {
    const fall =
      1 - (1 - floor) * Math.min(1, Math.max(0, (y - logoData.top) / height));

    for (let x = 0; x < columns; x += 1) {
      const index = y * columns + x;
      const offset = index * 4;

      if (logoData.inside[index] !== 1) {
        out[offset + 3] = 0;
        continue;
      }

      const { boost, line } = effectAt({
        columns,
        effect,
        height,
        sweep,
        top: logoData.top,
        x,
        y,
      });

      const density = fall + (1 - fall) * boost;

      const inked =
        (outline && logoData.rim[index] === 1) ||
        fillInks(fill, matrix, x, y, density) ||
        boost > thresholdAt(matrix, x, y);

      if (!inked) {
        out[offset + 3] = 0;
        continue;
      }

      const base =
        tone === "original" ? sourceColor(logoData.pixels.data, offset) : ink;

      writeCell(out, offset, line ? glint : base);
    }
  }
};

const calculateSweep = (
  time: number,
  period: number,
  phase: number,
  moving: boolean
) => {
  if (!moving) {
    return 0;
  }

  return (((time / Math.max(0.5, period) + phase) % 1) + 1) % 1;
};

interface DitheredCanvasProps {
  src: string;
  alt: string;
  color: DitherColor;
  tone: LogoTone;
  source: LogoSource;
  fill: FillVariant;
  outline: boolean;
  floor: number;
  matrix: DitherMatrix;
  cell: number;
  effect: LogoEffect;
  period: number;
  phase: number;
  lazy: boolean;
  className?: string;
}

const DitheredCanvas = ({
  src,
  alt,
  color,
  tone,
  source,
  fill,
  outline,
  floor,
  matrix,
  cell,
  effect,
  period,
  phase,
  lazy,
  className,
}: DitheredCanvasProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inView = useInView(rootRef, { rootMargin: "320px" });
  const { image, status } = useLoadedImage(src, inView || !lazy);
  const grid = useDitherGrid(rootRef, cell);

  const colors = useDitherColors(rootRef, [
    color,
    `color-mix(in oklch, ${cssColor(color)} 35%, white)`,
  ]);

  const logoData = useMemo(() => {
    if (!image || !grid) {
      return null;
    }

    const pixels = rasterize(image, grid.columns, grid.rows);

    return pixels ? rasterizeLogoGeometry(pixels, grid, source) : null;
  }, [image, grid, source]);

  const workRef = useRef<ImageData | null>(null);

  useEffect(() => {
    if (logoData) {
      workRef.current = new ImageData(
        logoData.grid.columns,
        logoData.grid.rows
      );
    }
  }, [logoData]);

  const paint = useCallback(
    (time: number) => {
      const context = canvasRef.current?.getContext("2d");
      const work = workRef.current;

      if (!(context && work && logoData && colors)) {
        return;
      }

      const [ink = [0, 0, 0, 1] as const, glint = [1, 1, 1, 1] as const] =
        colors;

      const moving = effect !== "none";
      const sweep = calculateSweep(time, period, phase, moving);

      paintLogo({
        effect: moving ? effect : "none",
        fill,
        floor,
        glint,
        ink,
        logoData,
        matrix,
        outline,
        sweep,
        tone,
        work,
      });
      context.putImageData(work, 0, 0);
    },
    [
      logoData,
      colors,
      effect,
      period,
      phase,
      fill,
      floor,
      matrix,
      outline,
      tone,
    ]
  );

  const loop = useFrameLoop((time) => paint(time), {
    enabled: effect !== "none" && logoData !== null,
    fps: 30,
    stillTime: -phase * period,
    target: rootRef,
  });

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!(canvas && logoData)) {
      return;
    }

    sizeCanvas(canvas, logoData.grid);
    paint(-phase * period);
  }, [logoData, paint, phase, period]);

  const isReady = status === "ready" && Boolean(logoData);

  return (
    <div
      ref={rootRef}
      role={alt === "" ? undefined : "img"}
      aria-label={alt === "" ? undefined : alt}
      aria-hidden={alt === "" ? true : undefined}
      data-state={isReady ? "ready" : status}
      data-loop={effect === "none" ? undefined : loop}
      className={cn("relative shrink-0 overflow-hidden", className)}
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        className={cn(
          CANVAS_CLASS,
          FADE_CLASS,
          logoData ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
};

export const DitheredLogo = ({
  src,
  alt,
  color = "ink",
  tone = "mono",
  source = "alpha",
  fill = "gradient",
  outline = true,
  floor = 0.3,
  matrix = "bayer4",
  cell = 2,
  effect = "none",
  period = 6,
  phase = 0,
  lazy = true,
  className,
}: DitheredLogoProps) => (
  <DitheredCanvas
    src={src}
    alt={alt}
    color={color}
    tone={tone}
    source={source}
    fill={fill}
    outline={outline}
    floor={floor}
    matrix={matrix}
    cell={cell}
    effect={effect}
    period={period}
    phase={phase}
    lazy={lazy}
    className={className}
  />
);
