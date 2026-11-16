"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/Providers";

const fmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Madrid",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

// Hora de Madrid en directo. Hasta montar se muestran guiones (evita desajustes de hidratación).
function useMadridTime() {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

// La etiqueta del portfolio original: hora local y lo último que he hecho.
export default function StatusCard() {
  const { t } = useLanguage();
  const h = t.hero;
  const time = useMadridTime();

  return (
    <aside className="card status">
      <div className="card-inner font-mono text-sm">
        <div className="status-head">
          <span className="signal" aria-hidden="true" />
          <span className="tabular-nums">{time}</span>
          <span className="text-muted">{h.timeLabel}</span>
        </div>
        <dl className="mt-4 space-y-4">
          <div>
            <dt className="text-muted">{h.currentlyLabel}</dt>
            <dd className="mt-0.5">{h.currentlyValue}</dd>
          </div>
          <div>
            <dt className="text-muted">{h.previouslyLabel}</dt>
            <dd className="mt-0.5">{h.previouslyValue}</dd>
          </div>
        </dl>
      </div>
    </aside>
  );
}
