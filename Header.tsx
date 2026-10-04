"use client";
import { useState } from "react";
import { OrderButton } from "./OrderContext";

const LINKS = [["Home", "#home"], ["Services", "#services"], ["Pricing", "#pricing"], ["Work", "#work"], ["About", "#about"], ["Contact", "#contact"]];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-black/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-10">
        <a href="#home" className="font-display text-sm tracking-[0.35em]" aria-label="Nocta Studios home">NOCTA STUDIOS</a>
        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {LINKS.map(([l, h]) => <a key={h} href={h} className="text-sm text-dim transition-colors hover:text-ice">{l}</a>)}
        </nav>
        <div className="flex items-center gap-3">
          <OrderButton className="hidden h-10 border border-ice px-5 text-xs font-medium tracking-[0.2em] transition-colors hover:bg-ice hover:text-black sm:block">START A PROJECT</OrderButton>
          <button type="button" aria-expanded={open} aria-label="Menu" onClick={() => setOpen(!open)} className="flex h-11 w-11 flex-col items-center justify-center gap-[6px] lg:hidden">
            <span className={`h-px w-6 bg-ice transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
            <span className={`h-px w-6 bg-ice transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>
      {open && (
        <nav aria-label="Mobile" className="fixed inset-x-0 top-16 bottom-0 flex flex-col gap-1 overflow-y-auto bg-black px-5 py-8 lg:hidden">
          {LINKS.map(([l, h]) => <a key={h} href={h} onClick={() => setOpen(false)} className="border-b border-line py-4 font-display text-2xl">{l}</a>)}
          <div onClick={() => setOpen(false)} className="mt-8">
            <OrderButton className="h-14 w-full bg-ice text-sm font-medium tracking-[0.2em] text-black">START A PROJECT</OrderButton>
          </div>
        </nav>
      )}
    </header>
  );
}
