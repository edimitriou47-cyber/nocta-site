"use client";
import { useState } from "react";
import { SERVICES, PROCESS } from "@/lib/data";

export function Services() {
  const [i, setI] = useState(0);
  const s = SERVICES[i];
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
      <div role="tablist" aria-label="Services" className="border-t border-line">
        {SERVICES.map((x, n) => (
          <button key={x.name} role="tab" aria-selected={n === i} onMouseEnter={() => setI(n)} onFocus={() => setI(n)} onClick={() => setI(n)}
            className={`flex min-h-16 w-full items-center justify-between border-b border-line py-4 text-left font-display text-xl transition-all duration-300 md:text-2xl ${n === i ? "pl-4 text-ice" : "text-dim hover:text-ice"}`}>
            {x.name}
            <span aria-hidden className={`h-px bg-glow transition-all duration-500 ${n === i ? "w-12" : "w-0"}`} />
          </button>
        ))}
      </div>
      <div role="tabpanel" key={s.name} className="fade-in self-start border border-line p-6 md:p-10" style={{ animationDelay: "0s", animationDuration: ".5s" }}>
        <h3 className="font-display text-2xl">{s.name}</h3>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-dim">{s.text}</p>
        <ul className="mt-8 space-y-3 border-t border-line pt-6">
          {s.points.map((p) => <li key={p} className="flex gap-3 text-ice/90"><span className="mt-[0.7em] h-px w-4 shrink-0 bg-glow" />{p}</li>)}
        </ul>
      </div>
    </div>
  );
}

export function Process() {
  const [i, setI] = useState(0);
  return (
    <div>
      <div role="tablist" aria-label="Process" className="grid grid-cols-5 border-b border-line">
        {PROCESS.map((p, n) => (
          <button key={p.name} role="tab" aria-selected={n === i} onClick={() => setI(n)} className="relative min-h-16 py-4 text-left">
            <span className={`block font-display text-xs transition-colors md:text-sm ${n <= i ? "text-ice" : "text-dim"}`}>0{n + 1}</span>
            <span className={`mt-1 hidden text-sm md:block ${n === i ? "text-ice" : "text-dim"}`}>{p.name}</span>
            <span className={`absolute -bottom-px left-0 h-px bg-glow transition-all duration-500 ${n <= i ? "w-full" : "w-0"}`} />
          </button>
        ))}
      </div>
      <div key={i} className="fade-in pt-10" style={{ animationDelay: "0s", animationDuration: ".5s" }} role="tabpanel">
        <h3 className="font-display text-4xl md:text-6xl">{PROCESS[i].name}</h3>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-dim">{PROCESS[i].text}</p>
      </div>
    </div>
  );
}
