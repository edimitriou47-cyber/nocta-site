import { NextResponse } from "next/server";
import { Resend } from "resend";
import { randomBytes } from "crypto";
import { PACKAGES, TYPES, STYLES, FEATURES, TIMELINES } from "@/lib/data";

export const runtime = "nodejs";

const MAX_BODY = 20000;
const fail = (status: number) => NextResponse.json({ success: false, error: "Unable to submit project" }, { status });

// Strip control characters (blocks email header injection), trim, cap length.
const clean = (v: unknown, max: number, multiline = false) =>
  typeof v === "string" ? v.normalize("NFC").replace(multiline ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, " ").trim().slice(0, max) : "";
const allowed = (v: unknown, options: string[]) => (Array.isArray(v) ? options.filter((o) => v.includes(o)) : []);
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));

// Best-effort abuse limits (per server instance).
const hits = new Map<string, number[]>();
const limited = (ip: string) => {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < 600_000);
  arr.push(now); hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > 8;
};
const done = new Map<string, string>(); // Idempotency-Key -> orderId, stops duplicate emails on retries
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const newOrderId = () => `NS-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${Array.from(randomBytes(5), (b) => ALPHABET[b % ALPHABET.length]).join("")}`;

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
  if (limited(ip)) return fail(429);
  if (Number(req.headers.get("content-length") || 0) > MAX_BODY) return fail(413);

  let raw: Record<string, unknown>;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY) return fail(413);
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return fail(400);
    raw = parsed;
  } catch { return fail(400); }

  if (raw.hp) return fail(400); // honeypot: real people never fill this hidden field

  const pkg = PACKAGES.find((p) => p.id === raw.pkg); // price comes from the server, never from the client
  const d = {
    name: clean(raw.name, 120), company: clean(raw.company, 160), email: clean(raw.email, 200).toLowerCase(), website: clean(raw.website, 300),
    type: TYPES.find((t) => t === raw.type) || "", details: clean(raw.details, 5000, true), refs: clean(raw.refs, 2000, true),
    styles: allowed(raw.styles, STYLES), features: allowed(raw.features, FEATURES), timeline: TIMELINES.find((t) => t === raw.timeline) || "",
  };
  if (d.name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email) || !pkg || !d.type || d.details.length < 10 || !d.timeline) return fail(400);

  const idem = (req.headers.get("idempotency-key") || "").trim();
  const validIdem = /^[\w-]{8,80}$/.test(idem);
  if (validIdem && done.has(idem)) return NextResponse.json({ success: true, orderId: done.get(idem) });

  const key = process.env.RESEND_API_KEY;
  if (!key) { console.error("[submit-project] RESEND_API_KEY is not set"); return fail(500); }
  const to = process.env.EMAIL_TO || "edimitriou47@gmail.com";
  const from = process.env.EMAIL_FROM || "Nocta Studios <onboarding@resend.dev>";

  const orderId = newOrderId();
  const now = new Date();
  const date = now.toLocaleDateString("en-GB", { timeZone: "Europe/Athens", dateStyle: "full" });
  const time = now.toLocaleTimeString("en-GB", { timeZone: "Europe/Athens", hour: "2-digit", minute: "2-digit", second: "2-digit" }) + " (Athens time)";
  const dash = (s: string) => s || "-";
  const sections: [string, [string, string][]][] = [
    ["CLIENT INFORMATION", [["Full name", d.name], ["Company / brand", dash(d.company)], ["Email", d.email], ["Current website", dash(d.website)]]],
    ["PROJECT INFORMATION", [["Package", pkg.label], ["Price", pkg.price], ["Website type", d.type], ["Project description", d.details], ["Design / style", dash(d.styles.join(", "))], ["Reference URLs", dash(d.refs)], ["Features", dash(d.features.join(", "))], ["Timeline", d.timeline]]],
    ["ORDER INFORMATION", [["Order ID", orderId], ["Submission date", date], ["Submission time", time]]],
  ];
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;color:#111">
<div style="background:#000;color:#fff;padding:24px"><div style="letter-spacing:4px;font-size:13px">NOCTA STUDIOS</div><div style="font-size:22px;margin-top:8px">New project: ${esc(d.name)}</div><div style="color:#9aa7d8;margin-top:6px">${esc(pkg.label)} &middot; ${esc(pkg.price)}</div></div>
${sections.map(([h, rows]) => `<div style="padding:20px 24px 4px"><div style="font-size:12px;letter-spacing:2px;color:#5b6fb8;font-weight:bold">${h}</div><table style="width:100%;border-collapse:collapse;margin-top:8px">${rows.map(([k, v]) => `<tr><td style="padding:9px 8px 9px 0;border-bottom:1px solid #e5e7ee;color:#666;width:160px;vertical-align:top;font-size:14px">${k}</td><td style="padding:9px 0;border-bottom:1px solid #e5e7ee;font-size:14px;white-space:pre-wrap">${esc(v)}</td></tr>`).join("")}</table></div>`).join("")}
<div style="padding:16px 24px;color:#888;font-size:12px">Reply to this email to answer the client directly.</div></div>`;
  const text = sections.map(([h, rows]) => `${h}\n${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}`).join("\n\n");

  try {
    const { error } = await new Resend(key).emails.send({ from, to: [to], replyTo: d.email, subject: `New Nocta Studios Project — ${d.name} — ${pkg.label}`, html, text });
    if (error) throw new Error(`${error.name}: ${error.message}`);
  } catch (e) {
    console.error(`[submit-project ${orderId}] email failed:`, e instanceof Error ? e.message : e);
    return fail(502);
  }
  if (validIdem) { done.set(idem, orderId); if (done.size > 2000) done.clear(); }
  return NextResponse.json({ success: true, orderId });
}
