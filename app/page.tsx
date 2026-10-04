import Header from "@/components/Header";
import Mark from "@/components/Mark";
import { OrderProvider, OrderButton } from "@/components/OrderContext";
import { Services, Process } from "@/components/Interactive";
import { PACKAGES, FAQ, CONTACT, SITE_URL } from "@/lib/data";

const btn = "h-14 px-8 text-sm font-medium tracking-[0.2em] transition-colors";
const wrap = "mx-auto max-w-7xl px-5 md:px-10";
const sec = "py-24 md:py-36";

const PROJECTS = [
  {
    title: "NLS",
    category: "Music label website",
    note: "A bold, dark website for a Greek music label and artist family: artists, releases, team and a membership form.",
    url: "https://nls-theta.vercel.app/",
  },
  {
    title: "STRAHL",
    category: "Automotive brand website",
    note: "A premium brand website for an automotive concept: The Ultimate Driving Experience.",
    url: "https://strahl-automotive-website.vercel.app/",
  },
];

function Frame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <figure className="rv">
      <div className="border border-line">
        <div className="flex gap-1.5 border-b border-line px-3 py-2.5">{[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 rounded-full bg-line" />)}</div>
        <div className="aspect-[4/3] overflow-hidden p-4" role="img" aria-label={`Concept layout: ${title}`}>{children}</div>
      </div>
      <figcaption className="mt-3 flex justify-between text-sm"><span>{title}</span><span className="text-dim">Concept layout</span></figcaption>
    </figure>
  );
}
const b = "bg-ice/10";

export default function Page() {
  return (
    <OrderProvider>
      <Header />
      <main>
        <section id="home" className="relative flex min-h-[100svh] items-center overflow-hidden pt-16">
          <div className={`${wrap} grid w-full items-center gap-8 lg:grid-cols-[1.25fr_1fr]`}>
            <div>
              <h1 className="font-display text-[2.1rem] leading-[1.12] sm:text-5xl lg:text-6xl xl:text-7xl">
                <span className="mask"><span style={{ animationDelay: ".5s" }}>Websites</span></span>
                <span className="mask"><span style={{ animationDelay: ".65s" }}>built to be</span></span>
                <span className="mask"><span style={{ animationDelay: ".8s" }}>remembered.</span></span>
              </h1>
              <p className="fade-in mt-8 max-w-lg text-lg leading-relaxed text-dim">Nocta Studios designs and develops premium websites for brands that want to stand out. Fixed prices, starting at €100.</p>
              <div className="fade-in mt-10 flex flex-col gap-3 sm:flex-row">
                <OrderButton className={`${btn} bg-ice text-black hover:bg-glow`}>START A PROJECT</OrderButton>
                <a href="#work" className={`${btn} flex items-center justify-center border border-line hover:border-ice`}>VIEW WORK</a>
              </div>
            </div>
            <div className="mx-auto aspect-square w-full max-w-[26rem] lg:max-w-none"><Mark /></div>
          </div>
        </section>

        <section id="services" className={sec}>
          <div className={wrap}>
            <h2 className="rv font-display text-3xl md:text-5xl">What we build</h2>
            <p className="rv mt-5 max-w-xl text-lg text-dim">Six services, one studio. Pick a service to see what it covers.</p>
            <div className="rv mt-14"><Services /></div>
          </div>
        </section>

        <section id="pricing" className={`${sec} border-t border-line`}>
          <div className={wrap}>
            <h2 className="rv font-display text-3xl md:text-5xl">Pricing by page count</h2>
            <p className="rv mt-5 max-w-xl text-lg text-dim">Starting prices. Choose a package and we confirm the scope with you.</p>
            <div className="mt-14 border-t border-line">
              {PACKAGES.map((p) => (
                <div key={p.id} className="price-row rv grid items-center gap-4 border-b border-line py-8 md:grid-cols-[1fr_1.4fr_auto_auto] md:gap-10 md:px-4">
                  <h3 className="font-display text-xl md:text-2xl">{p.label}</h3>
                  <p className="text-dim">{p.note}</p>
                  <p className="font-display text-3xl md:text-4xl">{p.price}</p>
                  <OrderButton pkg={p.id} className="h-12 border border-ice px-6 text-xs font-medium tracking-[0.2em] transition-colors hover:bg-ice hover:text-black">ORDER NOW</OrderButton>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="work" className={`${sec} border-t border-line`}>
          <div className={wrap}>
            <h2 className="rv font-display text-3xl md:text-5xl">Selected work</h2>
            <p className="rv mt-5 max-w-xl text-lg text-dim">Live websites designed and built by Nocta Studios, plus concept layouts that show the kinds of sites we create.</p>

            <h3 className="rv mt-14 text-sm tracking-[0.2em] text-dim">LIVE PROJECTS</h3>
            <div className="mt-6 grid gap-8 sm:grid-cols-2">
              {PROJECTS.map((p) => (
                <a
                  key={p.title}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rv group flex min-h-64 flex-col justify-between border border-line p-8 transition-colors hover:border-ice"
                >
                  <div>
                    <p className="text-sm text-dim">{p.category}</p>
                    <h4 className="mt-3 font-display text-3xl md:text-4xl">{p.title}</h4>
                    <p className="mt-4 leading-relaxed text-dim">{p.note}</p>
                  </div>
                  <p className="mt-8 text-xs font-medium tracking-[0.2em] transition-colors group-hover:text-glow">VISIT SITE →</p>
                </a>
              ))}
            </div>

            <h3 className="rv mt-20 text-sm tracking-[0.2em] text-dim">CONCEPT LAYOUTS</h3>
            <div className="mt-6 grid gap-8 sm:grid-cols-2">
              <Frame title="Business website"><div className="flex h-full flex-col gap-3"><div className={`h-1/2 ${b} relative`}><span className="absolute bottom-3 left-3 h-3 w-1/2 bg-ice/40" /></div><div className="grid flex-1 grid-cols-3 gap-3"><div className={b} /><div className={b} /><div className={b} /></div></div></Frame>
              <Frame title="Portfolio"><div className="grid h-full grid-cols-[1fr_2fr] gap-3"><div className="flex flex-col justify-end gap-2"><span className="h-3 w-3/4 bg-ice/40" /><span className={`h-2 w-full ${b}`} /></div><div className="grid grid-cols-2 gap-3"><div className={b} /><div className={`${b} translate-y-4`} /><div className={`${b} -translate-y-0`} /><div className={`${b} translate-y-4`} /></div></div></Frame>
              <Frame title="Landing page"><div className="flex h-full flex-col items-center justify-center gap-3 text-center"><span className="h-4 w-2/3 bg-ice/40" /><span className={`h-2 w-1/2 ${b}`} /><span className="mt-2 h-7 w-24 bg-glow/60" /></div></Frame>
              <Frame title="Online store"><div className="grid h-full grid-cols-3 gap-3">{[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="flex flex-col gap-2"><div className={`flex-1 ${b}`} /><span className="h-2 w-2/3 bg-ice/30" /></div>)}</div></Frame>
            </div>
          </div>
        </section>

        <section id="showreel" className={`${sec} border-t border-line`}>
          <div className={`${wrap} grid items-center gap-12 lg:grid-cols-[1fr_auto] lg:gap-24`}>
            <div>
              <h2 className="rv font-display text-3xl md:text-5xl">Showreel</h2>
              <p className="rv mt-5 max-w-md text-lg leading-relaxed text-dim">Motion and atmosphere from Nocta Studios. Press play to watch with sound.</p>
              <OrderButton className={`${btn} rv mt-10 w-full bg-ice text-black hover:bg-glow sm:w-auto`}>START A PROJECT</OrderButton>
            </div>
            <div className="rv mx-auto w-full max-w-[19rem] border border-line p-2 shadow-[0_0_60px_rgba(143,168,255,0.12)]">
              <video className="aspect-[9/16] w-full bg-black object-cover" controls playsInline preload="none" poster="/video/showreel-poster.jpg" aria-label="Nocta Studios showreel">
                <source src="/video/showreel.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </section>

        <section id="process" className={`${sec} border-t border-line`}>
          <div className={wrap}>
            <h2 className="rv mb-14 font-display text-3xl md:text-5xl">From first message to launch</h2>
            <Process />
          </div>
        </section>

        <section id="about" className={`${sec} border-t border-line`}>
          <div className={`${wrap} grid gap-10 lg:grid-cols-2 lg:gap-20`}>
            <h2 className="rv font-display text-3xl md:text-5xl">A studio for websites that look and perform like a serious brand</h2>
            <div className="rv space-y-6 text-lg leading-relaxed text-dim">
              <p>Nocta Studios is a web design and development studio. We create premium websites: designed with care, built to load fast and ready to be found on Google.</p>
              <p>We keep pricing fixed and visible, and we keep the process simple, so you know what you get and what it costs before you start.</p>
            </div>
          </div>
        </section>

        <section id="faq" className={`${sec} border-t border-line`}>
          <div className={`${wrap} grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-20`}>
            <h2 className="rv font-display text-3xl md:text-5xl">Questions</h2>
            <div className="border-t border-line">
              {FAQ.map((x) => (
                <details key={x.q} className="border-b border-line">
                  <summary className="flex min-h-16 items-center justify-between gap-6 py-4 text-lg"><h3>{x.q}</h3><span aria-hidden className="plus text-2xl text-glow">+</span></summary>
                  <p className="max-w-xl pb-6 leading-relaxed text-dim">{x.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className={`${sec} border-t border-line`}>
          <div className={wrap}>
            <h2 className="rv font-display text-4xl leading-tight md:text-7xl">Ready when you are.</h2>
            <div className="mt-14 grid gap-10 md:grid-cols-2">
              <div><p className="text-sm text-dim">Email</p><a href={`mailto:${CONTACT.email}`} className="mt-2 block break-all py-2 text-xl hover:text-glow">{CONTACT.email}</a></div>
              <div><p className="text-sm text-dim">Instagram</p><a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className="mt-2 block py-2 text-xl hover:text-glow">@noctastudio4</a></div>
            </div>
            <OrderButton className={`${btn} mt-14 w-full bg-ice text-black hover:bg-glow sm:w-auto`}>START A PROJECT</OrderButton>
          </div>
        </section>
      </main>

      <footer className="border-t border-line py-14">
        <div className={`${wrap} grid gap-10 md:grid-cols-3`}>
          <div><p className="font-display tracking-[0.3em]">NOCTA STUDIOS</p><p className="mt-3 text-dim">Web Design & Development</p></div>
          <div className="space-y-1 text-dim">
            <a className="block py-1 hover:text-ice" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <a className="block py-1 hover:text-ice" href={CONTACT.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-1 text-dim">
            {[["Home", "#home"], ["Services", "#services"], ["Pricing", "#pricing"], ["Work", "#work"], ["About", "#about"], ["Contact", "#contact"]].map(([l, h]) => <a key={h} href={h} className="py-1 hover:text-ice">{l}</a>)}
          </nav>
        </div>
        <p className={`${wrap} mt-12 text-sm text-dim`}>© 2026 Nocta Studios. All rights reserved.</p>
      </footer>
    </OrderProvider>
  );
}
