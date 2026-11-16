// Scroll animado con easing propio, para que la duración sea la misma en todos
// los navegadores. Se interrumpe si la persona toma el control (rueda, dedo o
// teclas de desplazamiento). Devuelve una función para cancelarlo.
const SCROLL_KEYS = new Set(["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "]);
const easeInOutCubic = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

export function smoothScrollTo(targetY, { duration = 900, onDone } = {}) {
  const startY = window.scrollY;
  const dist = targetY - startY;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (Math.abs(dist) < 2 || reduce) {
    window.scrollTo(0, targetY);
    onDone?.();
    return () => {};
  }

  let raf = 0;
  let t0 = null;
  let cancelled = false;

  const onUser = (e) => {
    if (e.type === "keydown" && !SCROLL_KEYS.has(e.key)) return;
    cancel();
  };
  const events = ["wheel", "touchstart", "keydown"];
  const cleanup = () => events.forEach((ev) => window.removeEventListener(ev, onUser));
  function cancel() {
    cancelled = true;
    cancelAnimationFrame(raf);
    cleanup();
  }
  events.forEach((ev) => window.addEventListener(ev, onUser, { passive: true }));

  const step = (now) => {
    if (t0 === null) t0 = now;
    const p = Math.min(1, (now - t0) / duration);
    window.scrollTo(0, startY + dist * easeInOutCubic(p));
    if (p < 1 && !cancelled) {
      raf = requestAnimationFrame(step);
    } else {
      cleanup();
      if (!cancelled) onDone?.();
    }
  };
  raf = requestAnimationFrame(step);
  return cancel;
}
