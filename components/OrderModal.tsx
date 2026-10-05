"use client";
import { useEffect, useRef, useState } from "react";
import Mark from "./Mark";
import { PACKAGES, TYPES, STYLES, FEATURES, TIMELINES, CONTACT } from "@/lib/data";

type F = { name: string; company: string; email: string; website: string; pkg: string; type: string; details: string; styles: string[]; refs: string; features: string[]; timeline: string; hp: string };
const STEPS = ["Contact", "Package", "Type", "Project", "Style", "References", "Features", "Timeline", "Review"];
const input = "h-14 w-full border border-line bg-black px-4 text-base text-ice placeholder:text-dim/70 focus:border-glow focus:outline-none";

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" aria-pressed={on} onClick={onClick} className={`min-h-14 border px-4 py-3 text-left text-base transition-colors ${on ? "border-glow bg-glow/10 text-ice" : "border-line text-dim hover:border-ice/50 hover:text-ice"}`}>{children}</button>;
}

function L({ t, children }: { t: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-sm text-dim">{t}</span>{children}</label>;
}

export default function OrderModal({ pkg, onClose }: { pkg?: string; onClose: () => void }) {
  const [step, setStep] = useState(pkg ? 0 : 0);
  const [err, setErr] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "payment" | "done" | "error">("idle");
  const [orderNo, setOrderNo] = useState("");
  const lock = useRef(false);
  const idem = useRef(typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);
  const [f, setF] = useState<F>({ name: "", company: "", email: "", website: "", pkg: pkg ?? "", type: "", details: "", styles: [], refs: "", features: [], timeline: "", hp: "" });
  const body = useRef<HTMLDivElement>(null);
  const set = <K extends keyof F>(k: K, v: F[K]) => setF((p) => ({ ...p, [k]: v }));
  const toggle = (k: "styles" | "features", v: string) => set(k, f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v]);
  const price = PACKAGES.find((p) => p.id === f.pkg)?.price ?? "";

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", k); };
  }, [onClose]);
  useEffect(() => { body.current?.scrollTo({ top: 0 }); }, [step, status]);

  const validate = (s: number) => {
    if (s === 0) {
      if (f.name.trim().length < 2) return "Enter your full name.";
      if (!/^\S+@\S+\.\S+$/.test(f.email)) return "Enter a valid email address.";
    }
    if (s === 1 && !f.pkg) return "Choose a package.";
    if (s === 2 && !f.type) return "Choose a website type.";
    if (s === 3 && f.details.trim().length < 10) return "Describe your project in a few words.";
    if (s === 7 && !f.timeline) return "Choose a timeline.";
    return "";
  };
  const next = () => { const e = validate(step); setErr(e); if (!e) setStep(step + 1); };
  const submit = async () => {
    if (lock.current) return; // blocks double clicks and double taps
    for (let i = 0; i < 8; i++) { const e = validate(i); if (e) { setErr(e); setStep(i); return; } }
    lock.current = true; setStatus("sending"); setErr("");
    const t0 = Date.now();
    try {
      const r = await fetch("/api/submit-project", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": idem.current }, body: JSON.stringify(f) });
      const j = await r.json().catch(() => null);
      if (!r.ok || !j?.success || !j?.orderId) throw new Error("not submitted");
      const wait = 1400 - (Date.now() - t0);
      if (wait > 0) await new Promise((res) => setTimeout(res, wait));
     setOrderNo(j.orderId); setStatus("payment");
    } catch { lock.current = false; setStatus("error"); }
  };

  const rows: [string, string, number][] = [
    ["Name", f.name, 0], ["Company", f.company || "Not provided", 0], ["Email", f.email, 0], ["Current website", f.website || "Not provided", 0],
    ["Package", `${f.pkg} (${price})`, 1], ["Website type", f.type, 2], ["Project", f.details, 3], ["Design style", f.styles.join(", ") || "Not specified", 4],
    ["References", f.refs || "Not provided", 5], ["Features", f.features.join(", ") || "None selected", 6], ["Timeline", f.timeline, 7],
  ];

  return (
    <div role="dialog" aria-modal="true" aria-label="Start a project" className="fixed inset-0 z-50 flex flex-col bg-black">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5 md:px-10">
        <span className="font-display text-xs tracking-[0.3em]">NOCTA STUDIOS</span>
        <button type="button" onClick={onClose} className="h-11 px-2 text-sm text-dim hover:text-ice">Close</button>
      </div>
      {status !== "done" && <div className="h-px shrink-0 bg-line"><div className="h-px bg-glow transition-all duration-500" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} /></div>}
      <div ref={body} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-5 py-10 md:py-16">
         {status === "payment" ? (
            <div className="fade-in text-center" style={{ animationDelay: "0s", animationDuration: ".8s" }}>
              <div className="mx-auto h-40 w-40 md:h-52 md:w-52"><Mark /></div>
              <p className="mt-6 text-xs tracking-[0.4em] text-glow">ORDER CONFIRMED</p>
              <h2 className="mt-4 font-display text-4xl md:text-5xl">Thank you!</h2>
              <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-dim">Your order has been received successfully.</p>
              <div className="mx-auto mt-10 max-w-sm border border-glow/60 px-6 py-5 shadow-[0_0_40px_rgba(143,168,255,0.18)]">
                <p className="text-xs tracking-[0.3em] text-dim">ORDER NUMBER</p>
                <a
  href="https://www.paypal.me/EktorasDimitriou147"
  target="_blank"
  rel="noopener noreferrer"
  className="mt-8 inline-flex items-center justify-center border border-glow bg-glow/10 px-8 py-4 text-xs tracking-[0.3em] text-glow transition hover:bg-glow/20"
>
  PAY WITH PAYPAL
</a>
                <a
  href={`mailto:${CONTACT.email}?subject=Better price for order ${orderNo}`}
  className="mt-4 inline-flex items-center justify-center border border-line px-8 py-4 text-xs tracking-[0.3em] text-dim transition hover:border-glow hover:text-glow"
>
  DISCUSS A BETTER PRICE
                  <div className="mx-auto mt-8 max-w-md border border-line px-6 py-5 text-left">
  <p className="text-xs tracking-[0.3em] text-dim">BANK TRANSFER</p>

  <div className="mt-4 space-y-2 text-sm text-dim">
    <p>IBAN: LT19 325 0890 2846 1933</p>
    <p>Account holder: Nocta Studios</p>
  </div>

  <p className="mt-4 text-xs leading-relaxed text-dim">
    Please include your order number as the payment reference.
  </p>
</div>
</a>
                <p className="mt-2 select-all font-display text-xl tracking-widest md:text-2xl">{orderNo}</p>
              </div>
              <p className="mx-auto mt-8 max-w-md leading-relaxed text-dim">{f.pkg} ({price}). We will contact you at {f.email} to confirm the details and next steps. Keep your order number for reference.</p>
              <button type="button" onClick={onClose} className="mt-10 h-14 bg-ice px-8 text-sm font-medium tracking-[0.2em] text-black transition-colors hover:bg-glow">BACK TO SITE</button>
            </div>
          ) : status === "sending" ? (
            <div role="status" aria-live="polite" className="flex min-h-[50vh] flex-col items-center justify-center text-center">
              <div className="h-16 w-16 animate-spin rounded-full border border-line border-t-glow" />
              <p className="mt-8 font-display text-xl">Processing your order</p>
              <p className="mt-3 text-dim">This only takes a moment.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-dim">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>
              <div className="mt-6">
                {step === 0 && (<><h2 className="font-display text-3xl md:text-4xl">Who are we building for?</h2>
                  <div className="mt-8 space-y-5">
                    <L t="Full name"><input className={input} autoComplete="name" value={f.name} onChange={(e) => set("name", e.target.value)} /></L>
                    <L t="Company or brand name"><input className={input} autoComplete="organization" value={f.company} onChange={(e) => set("company", e.target.value)} /></L>
                    <L t="Email"><input className={input} type="email" inputMode="email" autoComplete="email" value={f.email} onChange={(e) => set("email", e.target.value)} /></L>
                    <L t="Current website (optional)"><input className={input} type="url" inputMode="url" autoComplete="url" placeholder="https://" value={f.website} onChange={(e) => set("website", e.target.value)} /></L>
                    <input tabIndex={-1} aria-hidden autoComplete="off" className="hidden" value={f.hp} onChange={(e) => set("hp", e.target.value)} />
                  </div></>)}
                {step === 1 && (<><h2 className="font-display text-3xl md:text-4xl">Which package are you interested in?</h2>
                  <div className="mt-8 grid gap-3">{PACKAGES.map((p) => <Chip key={p.id} on={f.pkg === p.id} onClick={() => set("pkg", p.id)}><span className="flex justify-between gap-4"><span>{p.label}</span><span className="font-display">{p.price}</span></span></Chip>)}</div>
                  {f.pkg && <p className="mt-6 border-t border-line pt-4 text-ice">Order summary: {f.pkg}, starting at {price}</p>}</>)}
                {step === 2 && (<><h2 className="font-display text-3xl md:text-4xl">What type of website do you need?</h2>
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">{TYPES.map((t) => <Chip key={t} on={f.type === t} onClick={() => set("type", t)}>{t}</Chip>)}</div></>)}
                {step === 3 && (<><h2 className="font-display text-3xl md:text-4xl">Tell us about your project.</h2>
                  <p className="mt-3 text-dim">What your business does, what you want, what the site should achieve and any specific requirements.</p>
                  <textarea className={`${input} mt-8 h-56 py-4`} value={f.details} onChange={(e) => set("details", e.target.value)} aria-label="Project details" /></>)}
                {step === 4 && (<><h2 className="font-display text-3xl md:text-4xl">What style are you looking for?</h2>
                  <p className="mt-3 text-dim">Choose as many as you like.</p>
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">{STYLES.map((t) => <Chip key={t} on={f.styles.includes(t)} onClick={() => toggle("styles", t)}>{t}</Chip>)}</div></>)}
                {step === 5 && (<><h2 className="font-display text-3xl md:text-4xl">Do you have websites or designs you like?</h2>
                  <p className="mt-3 text-dim">Paste one URL per line. This step is optional.</p>
                  <textarea className={`${input} mt-8 h-44 py-4`} placeholder="https://" value={f.refs} onChange={(e) => set("refs", e.target.value)} aria-label="Reference URLs" /></>)}
                {step === 6 && (<><h2 className="font-display text-3xl md:text-4xl">What functionality do you need?</h2>
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">{FEATURES.map((t) => <Chip key={t} on={f.features.includes(t)} onClick={() => toggle("features", t)}>{t}</Chip>)}</div></>)}
                {step === 7 && (<><h2 className="font-display text-3xl md:text-4xl">When would you like the website completed?</h2>
                  <div className="mt-8 grid gap-3">{TIMELINES.map((t) => <Chip key={t} on={f.timeline === t} onClick={() => set("timeline", t)}>{t}</Chip>)}</div></>)}
                {step === 8 && (<><h2 className="font-display text-3xl md:text-4xl">Review your project.</h2>
                  <dl className="mt-8 border-t border-line">{rows.map(([k, v, s]) => (
                    <div key={k} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[10rem_1fr_auto] sm:gap-6">
                      <dt className="text-sm text-dim">{k}</dt><dd className="whitespace-pre-wrap break-words">{v}</dd>
                      <button type="button" onClick={() => { setErr(""); setStep(s); }} className="min-h-11 self-start text-left text-sm text-glow sm:text-right">Edit</button>
                    </div>))}</dl>
                  {status === "error" && (<div role="alert" className="mt-6 border border-line p-4 text-dim">We could not submit your project just now. Your answers are still saved here, so please press SUBMIT PROJECT again. If it keeps happening, email <a className="text-ice underline" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> and we will take it from there.</div>)}</>)}
              </div>
              {err && <p role="alert" className="mt-6 text-red-300">{err}</p>}
              <div className="mt-10 flex gap-3">
                {step > 0 && <button type="button" onClick={() => { setErr(""); setStep(step - 1); }} className="h-14 border border-line px-6 text-sm tracking-[0.15em] hover:border-ice">BACK</button>}
                {step < 8 ? <button type="button" onClick={next} className="h-14 flex-1 bg-ice text-sm font-medium tracking-[0.2em] text-black">CONTINUE</button>
                  : <button type="button" disabled={status === "sending"} onClick={submit} className="h-14 flex-1 bg-ice text-sm font-medium tracking-[0.2em] text-black disabled:opacity-60">SUBMIT PROJECT</button>}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
