// Estanque koi en ASCII.
//
// Todo se dibuja en un <canvas> como una rejilla de caracteres. Cada frame:
//   1. Se avanza una simulación de ondas (ecuación de ondas discretizada).
//   2. Se mueven los koi (cadena articulada que sigue a la cabeza).
//   3. Se "rasterizan" los koi y sus sombras sobre la rejilla.
//   4. Cada celda elige un sprite (agua, destello, nenúfar o pez) de un atlas
//      de glifos pre-renderizado, que es mucho más barato que fillText.
//
// Los colores salen de variables CSS (--water, --koi-*, ...), así que el cambio
// de tema claro/oscuro solo reconstruye el atlas.

const FONT = '"Share Tech Mono", ui-monospace, monospace';

// ---- Sprites ---------------------------------------------------------------
const WATER_CH = [".", ",", ":", "-", "~", "=", "+", "*"];
const WATER_A = [0.26, 0.34, 0.42, 0.5, 0.6, 0.72, 0.84, 0.95];
const GLINT_CH = ["=", "+", "*", "#"];
const GLINT_A = [0.72, 0.84, 0.94, 1];
const PAD_CH = ['"', "%", "O"]; // interior apagado, interior brillante, borde
const PAD_A = [0.5, 0.72, 0.95];
const FISH_CH = [".", ":", "+", "o", "O", "8", "#", "@"];
const KOI = ["white", "orange", "red", "gold", "dark"]; // índices 0..4

const S_WATER = 1; // 1..8
const S_GLINT = S_WATER + WATER_CH.length; // 9..12
const S_PAD = S_GLINT + GLINT_CH.length; // 13..15
const S_FLOWER = S_PAD + PAD_CH.length; // 16 pétalo, 17 centro
const S_FISH = S_FLOWER + 2; // + color*8 + (nivel-1)
const S_EYE = S_FISH + KOI.length * FISH_CH.length;
const S_COUNT = S_EYE + 1;

const TAU = Math.PI * 2;
const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const wrapAngle = (a) => {
  while (a > Math.PI) a -= TAU;
  while (a < -Math.PI) a += TAU;
  return a;
};

function readPalette() {
  const cs = getComputedStyle(document.documentElement);
  const g = (name, fallback) => {
    const v = cs.getPropertyValue(name).trim();
    return v ? v.split(/\s+/).join(",") : fallback;
  };
  return {
    water: g("--water", "34,229,212"),
    glint: g("--glint", "190,255,246"),
    pad: g("--pad", "47,217,138"),
    flower: g("--flower", "255,79,163"),
    eye: g("--eye", "6,9,18"),
    white: g("--koi-white", "243,251,255"),
    orange: g("--koi-orange", "255,122,47"),
    red: g("--koi-red", "255,61,90"),
    gold: g("--koi-gold", "255,193,77"),
    dark: g("--koi-dark", "78,96,150"),
  };
}

// Colores de cada variedad de koi según la posición sobre el cuerpo.
// t: 0 cabeza -> 1 cola. s: -1..1 de un costado al otro.
function koiColor(f, t, s) {
  const q =
    Math.sin(t * 9 + f.seed) +
    0.7 * Math.sin(t * 19 + s * 2.6 + f.seed * 1.7) +
    0.35 * Math.cos(s * 3.1 + f.seed * 0.9);
  switch (f.kind) {
    case 0: // kohaku: blanco con manchas rojas
      return q > 0.55 ? 2 : 0;
    case 1: // ogon: dorado liso, con algo de naranja
      return q > 1.05 ? 1 : 3;
    case 2: // sanke: blanco, rojo y motas oscuras
      return q > 0.7 ? 2 : q < -1.3 ? 4 : 0;
    case 3: // naranja con vientre claro
      return q < -1.0 ? 0 : 1;
    default: // showa: oscuro con rojo y blanco
      return q > 0.6 ? 2 : q < -0.6 ? 0 : 4;
  }
}

export function createPond(canvas) {
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let W = 0, H = 0, dpr = 1, qs = 1;
  let cols = 0, rows = 0, cw = 0, ch = 0, cwCss = 0, chCss = 0, ky = 0.33;
  let fontPx = 12;
  let atlas = null;
  let pal = readPalette();

  // Buffers por celda
  let h, hp, hn, grain, fCov, fT, fS, fId, sCov, eyeMark, padMask;
  let fish = [];
  let pads = [];

  let t = 0, last = 0, acc = 0, raf = 0, ready = false, destroyed = false;
  let emaDt = 0.016, frames = 0, nextRain = 1.5;
  const pending = []; // gotas programadas (los "ecos")
  let food = null;
  const pointer = { x: -1, y: -1, px: -1, py: -1, t: 0, speed: 0, until: 0 };

  // ---- Layout --------------------------------------------------------------
  function layout() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    fontPx = (W < 640 ? 10 : W < 1400 ? 12 : 13) * qs;

    ctx.font = `${fontPx * dpr}px ${FONT}`;
    cw = Math.max(4, Math.round(ctx.measureText("M").width));
    ch = Math.max(6, Math.round(fontPx * dpr * 1.2));
    cwCss = cw / dpr;
    chCss = ch / dpr;
    ky = (cwCss / chCss) ** 2; // las celdas son más altas que anchas

    cols = Math.ceil(W / cwCss);
    rows = Math.ceil(H / chCss);
    canvas.width = cols * cw;
    canvas.height = rows * ch;
    canvas.style.width = `${canvas.width / dpr}px`;
    canvas.style.height = `${canvas.height / dpr}px`;

    const n = cols * rows;
    h = new Float32Array(n);
    hp = new Float32Array(n);
    hn = new Float32Array(n);
    grain = new Float32Array(n);
    for (let i = 0; i < n; i++) grain[i] = Math.random();
    fCov = new Float32Array(n);
    fT = new Float32Array(n);
    fS = new Float32Array(n);
    fId = new Uint8Array(n);
    sCov = new Float32Array(n);
    eyeMark = new Uint8Array(n);
    padMask = new Uint8Array(n);

    buildAtlas();
    buildPads();
    buildFish();
    baseAt = -1;
  }

  function buildAtlas() {
    pal = readPalette();
    const defs = new Array(S_COUNT).fill(null);
    const put = (i, chr, color, a) => (defs[i] = { chr, c: pal[color], a });
    // En oscuro el agua necesita algo más de presencia para leerse igual de bien.
    const gain =
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--water-gain")) || 1;
    const fishA =
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--fish-alpha")) || 0.78;
    WATER_CH.forEach((c, i) => put(S_WATER + i, c, "water", Math.min(1, WATER_A[i] * gain)));
    GLINT_CH.forEach((c, i) => put(S_GLINT + i, c, "glint", GLINT_A[i]));
    PAD_CH.forEach((c, i) => put(S_PAD + i, c, "pad", PAD_A[i]));
    put(S_FLOWER, "*", "flower", 0.95);
    put(S_FLOWER + 1, "@", "flower", 1);
    KOI.forEach((k, ci) =>
      FISH_CH.forEach((c, li) => put(S_FISH + ci * FISH_CH.length + li, c, k, fishA)),
    );
    put(S_EYE, "@", "eye", 1);
    baseAt = -1; // el atlas cambió (tema o tamaño): hay que rehacer la base

    // OffscreenCanvas -> ImageBitmap: dibujar desde un bitmap es bastante más
    // barato que desde un <canvas>, y aquí son miles de llamadas por frame.
    const src =
      typeof OffscreenCanvas !== "undefined"
        ? new OffscreenCanvas(S_COUNT * cw, ch)
        : Object.assign(document.createElement("canvas"), { width: S_COUNT * cw, height: ch });
    const a = src.getContext("2d");
    a.font = `${fontPx * dpr}px ${FONT}`;
    a.textAlign = "center";
    a.textBaseline = "middle";
    defs.forEach((d, i) => {
      if (!d) return;
      a.fillStyle = `rgba(${d.c},${d.a})`;
      a.fillText(d.chr, i * cw + cw / 2, ch / 2 + fontPx * dpr * 0.04);
    });
    atlas = src.transferToImageBitmap ? src.transferToImageBitmap() : src;
  }

  // ---- Nenúfares -----------------------------------------------------------
  function buildPads() {
    padMask.fill(0);
    const spots = [
      [0.12, 0.2, 52], [0.2, 0.78, 66], [0.86, 0.24, 60],
      [0.9, 0.72, 48], [0.55, 0.9, 40],
    ];
    const scale = clamp(Math.min(W, H) / 800, 0.6, 1.3);
    pads = spots.map(([fx, fy, r], i) => ({
      x: fx * W, y: fy * H, r: r * scale, notch: rand(0, TAU), flower: i % 2 === 0,
    }));
    for (const p of pads) {
      const x0 = Math.max(0, Math.floor((p.x - p.r) / cwCss));
      const x1 = Math.min(cols - 1, Math.floor((p.x + p.r) / cwCss));
      const y0 = Math.max(0, Math.floor((p.y - p.r) / chCss));
      const y1 = Math.min(rows - 1, Math.floor((p.y + p.r) / chCss));
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          const dx = (x + 0.5) * cwCss - p.x;
          const dy = (y + 0.5) * chCss - p.y;
          const d = Math.hypot(dx, dy);
          if (d > p.r) continue;
          // muesca en forma de cuña
          const ang = wrapAngle(Math.atan2(dy, dx) - p.notch);
          if (Math.abs(ang) < 0.28 && d > p.r * 0.12) continue;
          const i = y * cols + x;
          if (p.flower && d < p.r * 0.2) padMask[i] = d < p.r * 0.09 ? 5 : 4;
          else padMask[i] = d > p.r * 0.8 ? 3 : grain[i] > 0.55 ? 2 : 1;
        }
      }
    }
  }

  // ---- Koi -----------------------------------------------------------------
  const N = 14; // puntos de la columna
  const SUB = 3; // subdivisiones por tramo al dibujar
  const M = (N - 1) * SUB + 1;

  function buildFish() {
    const count = W < 700 ? 4 : W < 1200 ? 5 : 6;
    const base = clamp(Math.min(W, H) * 0.3, 120, 340);
    const old = fish;
    fish = [];
    for (let k = 0; k < count; k++) {
      const L = base * rand(0.72, 1.1);
      const f = {
        L,
        kind: k % 5,
        seed: rand(0, 100),
        x: old[k] ? clamp(old[k].x, 0, W) : rand(0.1, 0.9) * W,
        y: old[k] ? clamp(old[k].y, 0, H) : rand(0.1, 0.9) * H,
        angle: old[k] ? old[k].angle : rand(0, TAU),
        speed: 0.16 * L,
        boost: 0,
        turn: 0,
        turnTarget: 0,
        turnTimer: rand(0, 2),
        phase: rand(0, TAU),
        wake: rand(0, 0.4),
        nibble: 0,
        sx: new Float32Array(N),
        sy: new Float32Array(N),
        px: new Float32Array(M),
        py: new Float32Array(M),
        nx: new Float32Array(M),
        ny: new Float32Array(M),
      };
      const seg = L / (N - 1);
      for (let i = 0; i < N; i++) {
        f.sx[i] = f.x - Math.cos(f.angle) * seg * i;
        f.sy[i] = f.y - Math.sin(f.angle) * seg * i;
      }
      fish.push(f);
    }
  }

  function updateFish(dt) {
    const sp = reduceMotion ? 0.4 : 1;
    const pointerLive = pointer.until > t && pointer.speed > 260;
    for (let i = 0; i < fish.length; i++) {
      const f = fish[i];

      // Deriva: gira hacia un rumbo aleatorio que cambia cada pocos segundos.
      f.turnTimer -= dt;
      if (f.turnTimer <= 0) {
        f.turnTarget = rand(-0.9, 0.9);
        f.turnTimer = rand(1.2, 4);
      }
      f.turn += (f.turnTarget - f.turn) * Math.min(1, dt * 1.2);
      let dAngle = f.turn * dt;

      // Nadar hacia el centro cuando se acerca a un borde.
      const margin = f.L * 0.9;
      const pen = Math.max(
        0, margin - f.x, f.x - (W - margin), margin - f.y, f.y - (H - margin),
      ) / margin;
      if (pen > 0) {
        const want = Math.atan2(H / 2 - f.y, W / 2 - f.x);
        dAngle += wrapAngle(want - f.angle) * Math.min(1, dt * (1.5 + clamp(pen, 0, 1) * 3));
      }

      // Separación entre peces.
      for (let j = 0; j < fish.length; j++) {
        if (j === i) continue;
        const o = fish[j];
        const dx = f.x - o.x, dy = f.y - o.y;
        const d = Math.hypot(dx, dy);
        const lim = (f.L + o.L) * 0.3;
        if (d < lim && d > 0.001) {
          dAngle += wrapAngle(Math.atan2(dy, dx) - f.angle) * Math.min(1, dt * 1.6) * (1 - d / lim);
        }
      }

      // Se asustan si el cursor pasa rápido cerca.
      if (pointerLive) {
        const dx = f.x - pointer.x, dy = f.y - pointer.y;
        const d = Math.hypot(dx, dy);
        if (d < 260) {
          dAngle += wrapAngle(Math.atan2(dy, dx) - f.angle) * Math.min(1, dt * 4);
          f.boost = Math.max(f.boost, f.L * 0.5);
        }
      }

      // Se acercan a la comida (clic) y la picotean.
      let slow = 1;
      if (food && t < food.until) {
        const dx = food.x - f.x, dy = food.y - f.y;
        const d = Math.hypot(dx, dy);
        if (d < 420) {
          dAngle += wrapAngle(Math.atan2(dy, dx) - f.angle) * Math.min(1, dt * 2.2);
          if (d < f.L * 0.22) {
            slow = 0.25;
            f.nibble -= dt;
            if (f.nibble <= 0) {
              addDrop(f.x, f.y, 0.12, 9);
              f.nibble = rand(0.35, 0.8);
            }
          }
        }
      }

      f.angle += dAngle;
      f.boost *= Math.max(0, 1 - dt * 1.6);
      const target = (0.16 * f.L + f.boost) * slow * sp;
      f.speed += (target - f.speed) * Math.min(1, dt * 2.5);
      f.x += Math.cos(f.angle) * f.speed * dt;
      f.y += Math.sin(f.angle) * f.speed * dt;
      f.phase += dt * (2.2 + f.speed * 0.045);

      // Columna: cada punto sigue al anterior a distancia fija.
      const seg = f.L / (N - 1);
      f.sx[0] = f.x;
      f.sy[0] = f.y;
      for (let k = 1; k < N; k++) {
        let dx = f.sx[k] - f.sx[k - 1];
        let dy = f.sy[k] - f.sy[k - 1];
        const d = Math.hypot(dx, dy) || 1;
        const kf = seg / d;
        f.sx[k] = f.sx[k - 1] + dx * kf;
        f.sy[k] = f.sy[k - 1] + dy * kf;
      }

      // Estela
      f.wake -= dt;
      if (f.wake <= 0 && f.speed > 6) {
        addDrop(f.x, f.y, 0.05 + f.speed * 0.0006, 10);
        f.wake = rand(0.25, 0.45);
      }
    }
  }

  // Perfil del cuerpo: semiancho relativo (0..1) según la posición u (0 cabeza).
  function profile(u) {
    if (u < 0.16) return Math.sqrt(u / 0.16) * 0.78;
    if (u < 0.3) return 0.78 + (0.22 * (u - 0.16)) / 0.14;
    if (u < 0.78) return 1 - Math.pow((u - 0.3) / 0.48, 1.1) * 0.8;
    return 0.2;
  }

  function stamp(x, y, r, covScale, u, nx, ny, id) {
    r = Math.max(r, chCss * 0.6);
    const x0 = Math.max(0, Math.floor((x - r) / cwCss));
    const x1 = Math.min(cols - 1, Math.floor((x + r) / cwCss));
    const y0 = Math.max(0, Math.floor((y - r) / chCss));
    const y1 = Math.min(rows - 1, Math.floor((y + r) / chCss));
    const r2 = r * r;
    for (let yy = y0; yy <= y1; yy++) {
      const dy = (yy + 0.5) * chCss - y;
      for (let xx = x0; xx <= x1; xx++) {
        const dx = (xx + 0.5) * cwCss - x;
        const d2 = dx * dx + dy * dy;
        if (d2 >= r2) continue;
        const d = Math.sqrt(d2);
        const cov = (d < r * 0.55 ? 1 : (r - d) / (r * 0.45)) * covScale;
        const i = yy * cols + xx;
        if (cov > fCov[i]) {
          fCov[i] = cov;
          fT[i] = u;
          fS[i] = (dx * nx + dy * ny) / r;
          fId[i] = id;
        }
      }
    }
  }

  function stampShadow(x, y, r) {
    r = Math.max(r, chCss * 0.7);
    const x0 = Math.max(0, Math.floor((x - r) / cwCss));
    const x1 = Math.min(cols - 1, Math.floor((x + r) / cwCss));
    const y0 = Math.max(0, Math.floor((y - r) / chCss));
    const y1 = Math.min(rows - 1, Math.floor((y + r) / chCss));
    for (let yy = y0; yy <= y1; yy++) {
      const dy = (yy + 0.5) * chCss - y;
      for (let xx = x0; xx <= x1; xx++) {
        const dx = (xx + 0.5) * cwCss - x;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d >= r) continue;
        const v = d < r * 0.5 ? 1 : (r - d) / (r * 0.5);
        const i = yy * cols + xx;
        if (v > sCov[i]) sCov[i] = v;
      }
    }
  }

  function rasterFish(f, id) {
    const wmax = 0.13 * f.L;
    // Puntos suavizados a lo largo de la columna, con ondulación al nadar.
    for (let k = 0; k < M; k++) {
      const u = k / (M - 1);
      const seg = Math.min(N - 2, Math.floor(u * (N - 1)));
      const lf = u * (N - 1) - seg;
      f.px[k] = f.sx[seg] + (f.sx[seg + 1] - f.sx[seg]) * lf;
      f.py[k] = f.sy[seg] + (f.sy[seg + 1] - f.sy[seg]) * lf;
    }
    for (let k = 0; k < M; k++) {
      const a = Math.max(0, k - 1), b = Math.min(M - 1, k + 1);
      let tx = f.px[b] - f.px[a], ty = f.py[b] - f.py[a];
      const tl = Math.hypot(tx, ty) || 1;
      tx /= tl; ty /= tl;
      f.nx[k] = -ty;
      f.ny[k] = tx;
    }
    const amp = 0.055 * f.L * clamp(0.35 + f.speed / (0.3 * f.L), 0.35, 1.2);
    for (let k = 0; k < M; k++) {
      const u = k / (M - 1);
      const env = 0.1 + 0.9 * Math.pow(u, 1.3);
      const off = amp * Math.sin(f.phase - u * 5.4) * env;
      f.px[k] += f.nx[k] * off;
      f.py[k] += f.ny[k] * off;
    }

    const sdx = 0.07 * f.L, sdy = 0.1 * f.L; // sombra desplazada
    for (let k = 0; k < M; k++) {
      const u = k / (M - 1);
      const r = profile(u) * wmax;
      const x = f.px[k], y = f.py[k], nx = f.nx[k], ny = f.ny[k];
      if (u < 0.78) {
        stamp(x, y, r, 1, u, nx, ny, id);
        if (k % 2 === 0) stampShadow(x + sdx, y + sdy, r * 1.1);
      } else if (u < 0.86) {
        stamp(x, y, r, 0.8, u, nx, ny, id);
      } else {
        // Cola bifurcada: dos lóbulos translúcidos
        const spread = wmax * (0.35 + 1.6 * (u - 0.86));
        const lr = wmax * (0.28 + 0.9 * (u - 0.86));
        stamp(x + nx * spread, y + ny * spread, lr, 0.6, u, nx, ny, id);
        stamp(x - nx * spread, y - ny * spread, lr, 0.6, u, nx, ny, id);
      }
    }

    // Aletas pectorales: aleteo suave
    const kf = Math.round(0.2 * (M - 1));
    const flap = Math.sin(f.phase * 1.3) * 0.35;
    for (const side of [-1, 1]) {
      const r0 = profile(0.2) * wmax;
      const bx = f.px[kf] + f.nx[kf] * side * r0 * 0.95;
      const by = f.py[kf] + f.ny[kf] * side * r0 * 0.95;
      // dirección hacia atrás (cola) y hacia fuera, con aleteo
      const tx = f.ny[kf], ty = -f.nx[kf];
      for (let j = 1; j <= 3; j++) {
        const back = j * 0.04 * f.L;
        const out = side * (0.016 + 0.016 * j + flap * 0.025 * j) * f.L;
        stamp(
          bx + tx * back + f.nx[kf] * out,
          by + ty * back + f.ny[kf] * out,
          (0.05 - j * 0.007) * f.L,
          0.6, 0.2, f.nx[kf], f.ny[kf], id,
        );
      }
    }

    // Ojos
    const ke = Math.round(0.075 * (M - 1));
    const re = profile(0.075) * wmax * 0.55;
    for (const side of [-1, 1]) {
      const ex = f.px[ke] + f.nx[ke] * side * re;
      const ey = f.py[ke] + f.ny[ke] * side * re;
      const cx = Math.floor(ex / cwCss), cy = Math.floor(ey / chCss);
      if (cx >= 0 && cx < cols && cy >= 0 && cy < rows) eyeMark[cy * cols + cx] = 1;
    }
  }

  // ---- Agua ----------------------------------------------------------------
  function addDrop(px, py, amp, sigma = 12) {
    const ix = Math.floor(px / cwCss), iy = Math.floor(py / chCss);
    const rx = Math.ceil((sigma * 2) / cwCss), ry = Math.ceil((sigma * 2) / chCss);
    const s2 = sigma * sigma;
    for (let yy = iy - ry; yy <= iy + ry; yy++) {
      if (yy < 1 || yy >= rows - 1) continue;
      for (let xx = ix - rx; xx <= ix + rx; xx++) {
        if (xx < 1 || xx >= cols - 1) continue;
        const dx = (xx + 0.5) * cwCss - px;
        const dy = (yy + 0.5) * chCss - py;
        const i = yy * cols + xx;
        h[i] = clamp(h[i] + amp * Math.exp(-(dx * dx + dy * dy) / s2), -2, 2);
      }
    }
  }

  // Una gota y sus ecos: un hundimiento y un nuevo pico unos instantes después.
  function splash(x, y, amp, sigma) {
    addDrop(x, y, amp, sigma);
    pending.push({ at: t + 0.12, x, y, amp: -amp * 0.6, sigma });
    pending.push({ at: t + 0.26, x, y, amp: amp * 0.35, sigma });
    if (pending.length > 80) pending.splice(0, pending.length - 80);
  }

  function stepWaves() {
    const C = 0.6, damp = 0.9935;
    for (let y = 1; y < rows - 1; y++) {
      const row = y * cols;
      for (let x = 1; x < cols - 1; x++) {
        const i = row + x;
        const c = h[i];
        const lap = h[i - 1] + h[i + 1] - 2 * c + ky * (h[i - cols] + h[i + cols] - 2 * c);
        hn[i] = (2 * c - hp[i] + C * lap) * damp;
      }
    }
    const tmp = hp;
    hp = h;
    h = hn;
    hn = tmp;
  }

  // ---- Dibujo --------------------------------------------------------------
  // Dos capas para pintar pocos glifos por frame:
  //  - Base (agua en calma + nenúfares): se cachea en un canvas aparte y se
  //    refresca unas 8 veces por segundo.
  //  - Dinámica (peces, sombras, ondas): cada frame solo se repintan las celdas
  //    que cambian, encima de la base.
  const BASE_EVERY = 0.12;
  const RIPPLE_MIN = 0.045;
  let baseCanvas = null, baseCtx = null, baseAt = -1;

  function waterBase(X, Y, i) {
    return (
      0.28 +
      0.09 * Math.sin(X * 0.018 + t * 0.6 + 1.3 * Math.sin(Y * 0.012 - t * 0.35)) +
      0.065 * Math.sin((X * 0.7 + Y) * 0.011 - t * 0.45) +
      0.04 * Math.sin(X * 0.05 + Y * 0.04 + t * 1.1) +
      (grain[i] - 0.5) * 0.16
    );
  }

  function drawBase() {
    if (!baseCanvas || baseCanvas.width !== canvas.width || baseCanvas.height !== canvas.height) {
      baseCanvas = document.createElement("canvas");
      baseCanvas.width = canvas.width;
      baseCanvas.height = canvas.height;
      baseCtx = baseCanvas.getContext("2d");
    }
    baseCtx.clearRect(0, 0, baseCanvas.width, baseCanvas.height);
    for (let y = 0; y < rows; y++) {
      const py = y * ch;
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x;
        const pm = padMask[i];
        let s = 0;
        if (pm) {
          s = pm === 5 ? S_FLOWER + 1 : pm === 4 ? S_FLOWER : S_PAD + pm - 1;
        } else {
          const idx = Math.min(8, (waterBase(x * cwCss, y * chCss, i) * 9) | 0);
          if (idx > 0) s = S_WATER + idx - 1;
        }
        if (s) baseCtx.drawImage(atlas, s * cw, 0, cw, ch, x * cw, py, cw, ch);
      }
    }
    baseAt = t;
  }

  function draw() {
    if (baseAt < 0 || t - baseAt > BASE_EVERY) drawBase();
    ctx.globalCompositeOperation = "copy";
    ctx.drawImage(baseCanvas, 0, 0);
    ctx.globalCompositeOperation = "source-over";

    for (let y = 0; y < rows; y++) {
      const py = y * ch;
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x;
        if (padMask[i]) continue; // los nenúfares van por encima de todo, ya están en la base
        const hh = h[i];
        let s = 0;
        let dynamic = true;
        if (eyeMark[i]) {
          s = S_EYE;
        } else if (fCov[i] > 0.1) {
          const f = fish[fId[i]];
          const shade = 1 - Math.abs(fS[i]) * 0.42;
          const lvl = clamp(Math.ceil(fCov[i] * shade * FISH_CH.length), 1, FISH_CH.length);
          s = S_FISH + koiColor(f, fT[i], fS[i]) * FISH_CH.length + (lvl - 1);
        } else if (hh > RIPPLE_MIN || hh < -RIPPLE_MIN || sCov[i] > 0.05) {
          let lv = waterBase(x * cwCss, y * chCss, i);
          const crest = hh > 0 ? hh : 0;
          lv += crest * 1.1 - (hh < 0 ? -hh * 0.35 : 0);
          lv *= 1 - 0.75 * sCov[i];
          if (crest > 0.16) s = S_GLINT + Math.min(3, ((crest - 0.16) / 0.14) | 0);
          else {
            const idx = Math.min(8, (lv * 9) | 0);
            if (idx > 0) s = S_WATER + idx - 1;
          }
        } else {
          dynamic = false;
        }
        if (!dynamic) continue;
        ctx.clearRect(x * cw, py, cw, ch);
        if (s) ctx.drawImage(atlas, s * cw, 0, cw, ch, x * cw, py, cw, ch);
      }
    }
  }

  // ---- Bucle ---------------------------------------------------------------
  function tick(now) {
    raf = 0;
    if (destroyed || !ready) return;
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    t += dt;

    // Calidad adaptativa: si va lento, la rejilla se hace más gruesa.
    if (!window.__koiFixedQuality) {
      emaDt += (dt - emaDt) * 0.05;
      if (++frames > 90 && emaDt > 0.026 && qs < 1.5) {
        qs += 0.25;
        frames = 0;
        emaDt = 0.016;
        layout();
      }
    }

    // Gotas programadas y lluvia ocasional
    while (pending.length && pending[0].at <= t) {
      const p = pending.shift();
      addDrop(p.x, p.y, p.amp, p.sigma);
    }
    if (!reduceMotion && t > nextRain) {
      addDrop(rand(0.05, 0.95) * W, rand(0.05, 0.95) * H, rand(0.12, 0.26), 12);
      nextRain = t + rand(2, 5);
    }

    acc += dt;
    let steps = 0;
    while (acc >= 1 / 60 && steps < 3) {
      stepWaves();
      acc -= 1 / 60;
      steps++;
    }
    if (steps === 3) acc = 0;

    updateFish(dt);

    fCov.fill(0);
    sCov.fill(0);
    eyeMark.fill(0);
    for (let i = 0; i < fish.length; i++) rasterFish(fish[i], i);

    draw();
    schedule();
  }

  function schedule() {
    if (!raf && !destroyed && document.visibilityState === "visible") {
      raf = requestAnimationFrame(tick);
    }
  }

  // ---- Eventos -------------------------------------------------------------
  function onMove(e) {
    const now = performance.now();
    const x = e.clientX, y = e.clientY;
    if (pointer.px < 0) {
      pointer.px = x; pointer.py = y; pointer.t = now;
    }
    pointer.x = x;
    pointer.y = y;
    const dist = Math.hypot(x - pointer.px, y - pointer.py);
    const dtm = Math.max(1, now - pointer.t);
    if (dist > cwCss * 2.5 && dtm > 16) {
      const sp = (dist / dtm) * 1000;
      pointer.speed = pointer.speed * 0.6 + sp * 0.4;
      splash(x, y, 0.22 + 0.5 * Math.min(1, sp / 1600), 13);
      pointer.px = x; pointer.py = y; pointer.t = now;
    }
    pointer.until = t + 0.25;
  }

  function onDown(e) {
    splash(e.clientX, e.clientY, 0.9, 18);
    food = { x: e.clientX, y: e.clientY, until: t + 6 };
  }

  let resizeTimer = 0;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (destroyed || !ready) return;
      // En móvil la barra del navegador aparece y desaparece al hacer scroll y
      // cambia un poco el alto: eso no debe reiniciar el estanque.
      if (window.innerWidth === W && Math.abs(window.innerHeight - H) < 160) return;
      layout();
    }, 120);
  }

  function onVisibility() {
    if (document.visibilityState === "visible") {
      last = performance.now();
      emaDt = 0.016;
      frames = 0;
      schedule();
    }
  }

  const themeObserver = new MutationObserver(() => {
    if (ready) buildAtlas();
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onDown, { passive: true });
  window.addEventListener("resize", onResize);
  document.addEventListener("visibilitychange", onVisibility);

  // Espera a la tipografía para medir bien las celdas.
  const fontsReady = document.fonts
    ? document.fonts.load(`13px "Share Tech Mono"`).catch(() => {})
    : Promise.resolve();
  fontsReady.then(() => {
    if (destroyed) return;
    layout();
    ready = true;
    last = performance.now();
    // Unas gotas iniciales para que el agua no empiece quieta
    addDrop(W * 0.3, H * 0.4, 0.5, 16);
    addDrop(W * 0.7, H * 0.6, 0.4, 16);
    schedule();
  });

  return {
    destroy() {
      destroyed = true;
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    },
  };
}
