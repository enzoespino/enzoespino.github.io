"use client";

import { useEffect, useRef } from "react";
import { createPond } from "@/lib/pond";

const FADE_MS = 700; // debe coincidir con la transición de .pond-canvas

// Fondo: estanque de koi en ASCII. Toda la lógica vive en lib/pond.js.
// Al apagarlo se desvanece y, una vez invisible, se detiene el motor (sin gasto de CPU).
export default function KoiPond({ enabled = true }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    const pond = createPond(ref.current);
    return () => pond.destroy();
  }, [enabled]);

  return (
    <canvas
      ref={ref}
      className="pond-canvas"
      data-on={enabled ? "true" : "false"}
      aria-hidden="true"
    />
  );
}
