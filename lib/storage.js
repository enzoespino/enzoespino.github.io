// localStorage puede lanzar (modo privado, cookies bloqueadas): nunca debe romper la página.
export function readPref(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writePref(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {}
}
