"use client";

import { useMemo, useState, type CSSProperties } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Clapperboard,
  Copy,
  Gauge,
  Layers3,
  Menu,
  Play,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { Reveal } from "@/components/reveal";

const portfolio = [
  { name: "PrePaw", title: "The Hair Has to Go Somewhere", type: "Pet grooming", idea: "Mess → capture → clean result", tone: "01" },
  { name: "Automotive", title: "One Panel. One Pass.", type: "Detailing", idea: "Application → transformation", tone: "02" },
  { name: "Dēpology", title: "Your Skincare Routine Has a Night Shift", type: "Skincare", idea: "Routine → product → payoff", tone: "03" },
  { name: "Furbo", title: "The 2:17 PM Check-in", type: "Pet tech", idea: "Notification → reassurance → day", tone: "04" },
  { name: "ZeoFill", title: "Looks Clean. Smells Clean?", type: "Home / pet", idea: "Invisible problem → application", tone: "05" },
  { name: "Hyperice", title: "The Workout Ends. The Routine Doesn’t.", type: "Recovery", idea: "Use-case → interaction → lifestyle", tone: "06" },
];

const pricing = [
  {
    name: "Starter Test",
    price: "$397",
    description: "A low-risk first test for one product and one core angle.",
    items: ["2 finished ads", "3 hook variations", "1 core angle", "9:16 delivery", "Captions + sound", "1 revision round"],
  },
  {
    name: "Creative Sprint",
    price: "$897",
    description: "The core offer: enough finished creative to actually learn something.",
    items: ["5 finished ads", "10 hook variations", "2 creative angles", "VO + captions + sound", "Testing-ready variations", "1 revision round", "72-hour target turnaround"],
    featured: true,
  },
  {
    name: "Scale Pack",
    price: "$1,497",
    description: "For brands already spending consistently and hungry for more test inventory.",
    items: ["10 finished creatives", "20 hooks / openings", "3 creative angles", "UGC + product-led concepts", "Multiple CTAs", "Testing recommendations", "Priority production"],
  },
];

const faq = [
  ["Do you guarantee performance?", "No. Performance depends on the offer, product, audience, media buying, landing page and other factors. We produce testing-ready creative and variations; we do not promise specific ROAS, CPA or revenue outcomes."],
  ["Do we need to ship a product?", "Not always. Some campaigns can be built from approved product imagery, existing footage, screenshots and generated production. Physical product requirements depend on the concept."],
  ["Are the portfolio examples client work?", "Commissioned work will be identified as client work. Self-initiated demonstrations are clearly labeled Concept Campaign or Spec Creative."],
  ["Do you run the ads?", "The core offer is creative production. Media buying is separate unless explicitly included in a custom engagement."],
  ["What platforms do you produce for?", "The primary format is vertical paid-social creative for Meta, TikTok and YouTube Shorts. Other formats can be included by scope."],
];

function Pill({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return <span className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[.12em] ${dark ? "border-white/15 bg-white/6 text-white/70" : "border-black/12 bg-white/35 text-black/60"}`}>{children}</span>;
}

function ArrowButton({ href, children, inverse = false, small = false }: { href: string; children: React.ReactNode; inverse?: boolean; small?: boolean }) {
  return (
    <a href={href} className={`group inline-flex items-center justify-between gap-6 rounded-full border transition duration-300 ${small ? "px-4 py-2.5 text-sm" : "px-5 py-3.5 text-[15px]"} ${inverse ? "border-white/18 bg-white text-black hover:bg-[#dfff3f]" : "border-black/15 bg-black text-white hover:bg-[#dfff3f] hover:text-black"}`}>
      <span className="font-semibold tracking-[-.02em]">{children}</span>
      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}

export function ScrollSprintSite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [productUrl, setProductUrl] = useState("");
  const [goal, setGoal] = useState("");

  const brief = useMemo(() => `SCROLLSPRINT CREATIVE SPRINT BRIEF\n\nProduct: ${productUrl || "[product URL]"}\nPrimary goal / offer: ${goal || "[what we want the creative to sell or test]"}\nCurrent ads / assets: [links]\nPriority platform: [Meta / TikTok / Shorts]\nAnything we must avoid: [claims, visuals, competitors, etc.]`, [productUrl, goal]);

  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(brief);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="noise min-h-screen overflow-x-clip">
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-7">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between rounded-[18px] border border-black/10 bg-[#f4f2ea]/88 px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,.06)] backdrop-blur-xl md:px-5">
          <Logo />
          <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
            <a href="#work" className="text-black/58 hover:text-black">Work</a>
            <a href="#services" className="text-black/58 hover:text-black">Services</a>
            <a href="#process" className="text-black/58 hover:text-black">Process</a>
            <a href="#pricing" className="text-black/58 hover:text-black">Pricing</a>
            <ArrowButton href="#start" small>Start a sprint</ArrowButton>
          </nav>
          <button onClick={() => setMenuOpen((v) => !v)} className="grid size-10 place-items-center rounded-full border border-black/12 md:hidden" aria-label="Toggle menu">
            {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
        {menuOpen && (
          <div className="mx-auto mt-2 max-w-[1500px] rounded-[18px] border border-black/10 bg-[#f4f2ea] p-4 shadow-2xl md:hidden">
            {["work", "services", "process", "pricing", "start"].map((item) => <a onClick={() => setMenuOpen(false)} className="block border-b border-black/8 py-3 text-lg capitalize last:border-0" href={`#${item}`} key={item}>{item}</a>)}
          </div>
        )}
      </header>

      <main id="top">
        <section className="relative min-h-[100svh] overflow-hidden bg-[#0a0a0a] px-4 pb-8 pt-32 text-white md:px-7 md:pt-36">
          <div className="pointer-events-none absolute inset-0 grid-lines opacity-60" />
          <div className="pointer-events-none absolute -left-40 top-10 size-[520px] rounded-full bg-[#7c62ff]/20 blur-[120px]" />
          <div className="pointer-events-none absolute -right-40 bottom-0 size-[520px] rounded-full bg-[#dfff3f]/10 blur-[120px]" />

          <div className="relative mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[1.18fr_.82fr] lg:items-end">
            <div>
              <div className="kicker anim-rise mb-8 text-[#dfff3f]" style={{ "--rise-y": "18px", "--rise-d": ".7s" } as CSSProperties}>Direct-response creative for ecommerce</div>
              <h1 className="display anim-rise max-w-[1150px]" style={{ "--rise-y": "35px", "--rise-d": ".8s", "--rise-delay": ".05s" } as CSSProperties}>
                More ads<br />to test. <span className="text-white/32">Less</span><br /><span className="text-white/32">production</span> drag.
              </h1>
              <div className="mt-10 grid gap-7 border-t border-white/14 pt-7 md:grid-cols-[1fr_auto] md:items-end">
                <p className="max-w-[680px] text-lg leading-relaxed text-white/62 md:text-xl">Product-first video creatives for ecommerce teams that need fresh hooks, new angles and testing variations—without waiting weeks for production.</p>
                <div className="flex flex-wrap gap-3">
                  <ArrowButton href="#start" inverse>Start a Creative Sprint</ArrowButton>
                  <a href="#work" className="group inline-flex items-center gap-3 rounded-full border border-white/16 px-5 py-3.5 text-[15px] font-semibold text-white/80 hover:border-white/40 hover:text-white">Watch the work <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" /></a>
                </div>
              </div>
            </div>

            <div className="anim-rise relative min-h-[520px] rounded-[28px] border border-white/12 bg-white/[.035] p-4 backdrop-blur-sm md:min-h-[610px] md:p-5" style={{ "--rise-y": "25px", "--rise-scale": ".97", "--rise-d": ".9s", "--rise-delay": ".2s" } as CSSProperties}>
              <div className="flex items-center justify-between border-b border-white/10 pb-4 text-[11px] font-semibold uppercase tracking-[.15em] text-white/45"><span>Sprint / 01</span><span>One product · multiple directions</span></div>
              <div className="relative mt-5 h-[445px] md:h-[520px]">
                {[
                  { top: "0%", left: "0%", rotate: -4, label: "HOOK 01 · 0:00", big: "STOP THE\nSCROLL.", accent: "bg-[#dfff3f] text-black" },
                  { top: "25%", left: "18%", rotate: 3.5, label: "ANGLE 02 · 9:16", big: "NEW\nANGLE", accent: "bg-[#7c62ff] text-white" },
                  { top: "50%", left: "4%", rotate: -1, label: "PRODUCT FIRST", big: "MAKE IT\nIMPOSSIBLE\nTO IGNORE.", accent: "bg-white text-black" },
                ].map((card, i) => (
                  <div key={card.label} style={{ top: card.top, left: card.left, "--card-rotate": `${card.rotate}deg`, "--float-amp": `${i % 2 ? 8 : -7}px`, "--float-d": `${5 + i}s` } as CSSProperties} className="anim-float absolute w-[78%] rounded-[22px] border border-white/14 bg-[#121212] p-4 shadow-[0_35px_80px_rgba(0,0,0,.45)] md:w-[74%] md:p-5">
                    <div className="mb-8 flex items-center justify-between text-[10px] font-bold tracking-[.13em] text-white/42"><span>{card.label}</span><Play className="size-3.5" /></div>
                    <div className="whitespace-pre-line text-[clamp(2rem,5vw,4.5rem)] font-black leading-[.83] tracking-[-.06em]">{card.big}</div>
                    <div className={`mt-8 inline-flex rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[.12em] ${card.accent}`}>testing-ready</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="overflow-hidden border-y border-black/10 bg-[#dfff3f] py-3">
          <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap text-[12px] font-black uppercase tracking-[.16em]">
            {[...Array(2)].flatMap(() => ["Meta", "TikTok", "Shorts", "Product demos", "Hooks", "Angles", "UGC-style", "Variations", "Sound design"]).map((item, i) => <span className="flex items-center gap-8" key={`${item}-${i}`}>{item}<span className="size-1.5 rounded-full bg-black" /></span>)}
          </div>
        </div>

        <section id="services" className="px-4 py-24 md:px-7 md:py-32">
          <div className="mx-auto max-w-[1500px]">
            <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr]">
              <div>
                <div className="kicker mb-6 text-black/50">01 / The problem</div>
                <p className="max-w-sm text-base leading-relaxed text-black/50">Most brands do not run out of products. They run out of fresh ways to sell them.</p>
              </div>
              <div>
                <h2 className="section-title">Your media buyer cannot test ideas <span className="text-black/25">you never produce.</span></h2>
                <p className="mt-8 max-w-3xl text-xl leading-relaxed text-black/60">We turn one product into multiple hooks, angles and finished video creatives so your team has more credible creative to put into market.</p>
              </div>
            </div>

            <div className="mt-20 grid border-l border-t border-black/10 sm:grid-cols-2 lg:grid-cols-4">
              {[
                [Clapperboard, "Product demos", "Show the mechanism, use-case and payoff without burying the product."],
                [Sparkles, "UGC-style concepts", "Creator-native structures without turning the brand into generic talking-head content."],
                [Layers3, "Hook variations", "One core idea becomes multiple openings so the test actually tests the hook."],
                [Gauge, "Testing velocity", "Finished variations, captions, sound and CTAs ready for the paid-social queue."],
              ].map(([Icon, title, copy], i) => {
                const IconComponent = Icon as typeof Clapperboard;
                return <div key={String(title)} className="min-h-[280px] border-b border-r border-black/10 p-6 md:p-7"><div className="flex items-center justify-between"><IconComponent className="size-5" /><span className="text-xs font-bold text-black/25">0{i + 1}</span></div><h3 className="mt-20 text-2xl font-semibold tracking-[-.04em]">{String(title)}</h3><p className="mt-3 text-sm leading-relaxed text-black/50">{String(copy)}</p></div>;
              })}
            </div>
          </div>
        </section>

        <section id="work" className="bg-[#0b0b0b] px-4 py-24 text-white md:px-7 md:py-32">
          <div className="mx-auto max-w-[1500px]">
            <div className="flex flex-col gap-8 border-b border-white/12 pb-12 md:flex-row md:items-end md:justify-between">
              <div><div className="kicker mb-6 text-[#dfff3f]">02 / Selected concepts</div><h2 className="section-title max-w-5xl">Built to make the product <span className="text-white/28">impossible to ignore.</span></h2></div>
              <p className="max-w-sm text-sm leading-relaxed text-white/45">Portfolio videos are currently in production. Every unpaid example is clearly labeled concept/spec work.</p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {portfolio.map((item, i) => (
                <Reveal key={item.title} delay={i * .04} className="group overflow-hidden rounded-[24px] border border-white/12 bg-white/[.035]">
                  <div className="video-placeholder aspect-[9/11] p-5">
                    <div className="relative z-10 flex h-full flex-col justify-between">
                      <div className="flex items-center justify-between"><Pill dark>Concept Campaign</Pill><span className="text-[11px] font-bold tracking-[.12em] text-white/35">{item.tone} / 06</span></div>
                      <div className="mx-auto flex size-24 items-center justify-center rounded-full border border-white/15 bg-black/25 backdrop-blur-lg transition-transform duration-500 group-hover:scale-105"><div className="text-center text-[10px] font-black uppercase leading-tight tracking-[.14em] text-white/60">Video<br />coming soon</div></div>
                      <div><div className="mb-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#dfff3f]">{item.type}</div><div className="text-sm text-white/45">{item.idea}</div></div>
                    </div>
                  </div>
                  <div className="p-5"><div className="text-[11px] font-bold uppercase tracking-[.14em] text-white/35">{item.name}</div><h3 className="mt-2 text-[clamp(1.45rem,3vw,2rem)] font-semibold leading-[1.02] tracking-[-.045em]">{item.title}</h3></div>
                </Reveal>
              ))}
            </div>
            <div className="mt-7 border-t border-white/10 pt-5 text-[10px] font-semibold uppercase tracking-[.12em] text-white/30">All work shown above is self-initiated concept/spec work, not commissioned client work.</div>
          </div>
        </section>

        <section id="process" className="px-4 py-24 md:px-7 md:py-32">
          <div className="mx-auto max-w-[1500px]">
            <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr]">
              <div><div className="kicker mb-6 text-black/50">03 / The sprint</div><Pill>Concept → production → variations</Pill></div>
              <div><h2 className="section-title">A creative pipeline, <span className="text-black/25">not one expensive commercial.</span></h2><p className="mt-7 max-w-2xl text-lg leading-relaxed text-black/55">The goal is not to make one beautiful video and hope. The goal is to give your paid-social team multiple credible creative directions to test quickly.</p></div>
            </div>
            <div className="mt-20 grid gap-px overflow-hidden rounded-[24px] bg-black/10 border border-black/10 md:grid-cols-2 xl:grid-cols-4">
              {[
                ["01", "Send the product", "Share your URL, existing ads and what your team already knows."],
                ["02", "Map the angles", "We identify the strongest hooks, pain points and concepts."],
                ["03", "Build the sprint", "Production, editing, voiceover, captions and variations."],
                ["04", "Test + learn", "Your team tests. The learnings shape the next creative batch."],
              ].map(([n, title, copy]) => <div key={n} className="min-h-[310px] bg-[#f4f2ea] p-7"><div className="text-xs font-black text-black/25">{n}</div><div className="mt-24 text-2xl font-semibold tracking-[-.04em]">{title}</div><p className="mt-3 text-sm leading-relaxed text-black/50">{copy}</p></div>)}
            </div>
          </div>
        </section>

        <section id="pricing" className="bg-[#c8bfff] px-4 py-24 md:px-7 md:py-32">
          <div className="mx-auto max-w-[1500px]">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end"><div><div className="kicker mb-6 text-black/55">04 / Packages</div><h2 className="section-title max-w-5xl">Start with one sprint.<br /><span className="text-black/35">Scale what earns another test.</span></h2></div><div className="max-w-sm text-sm leading-relaxed text-black/55">No fake guarantees. No bloated retainers before we have learned anything. Start with a defined batch.</div></div>
            <div className="mt-16 grid gap-4 lg:grid-cols-3">
              {pricing.map((pack) => <div key={pack.name} className={`relative flex min-h-[590px] flex-col rounded-[24px] border p-6 md:p-7 ${pack.featured ? "border-black bg-black text-white shadow-[0_30px_80px_rgba(0,0,0,.18)]" : "border-black/15 bg-[#f4f2ea]/65"}`}>
                {pack.featured && <span className="absolute right-5 top-5 rounded-full bg-[#dfff3f] px-3 py-1.5 text-[10px] font-black uppercase tracking-[.12em] text-black">Primary offer</span>}
                <div className={`text-[11px] font-bold uppercase tracking-[.14em] ${pack.featured ? "text-white/40" : "text-black/40"}`}>{pack.name}</div>
                <div className="mt-7 text-6xl font-semibold tracking-[-.06em]">{pack.price}</div>
                <p className={`mt-4 max-w-sm text-sm leading-relaxed ${pack.featured ? "text-white/50" : "text-black/50"}`}>{pack.description}</p>
                <div className={`my-7 h-px ${pack.featured ? "bg-white/12" : "bg-black/10"}`} />
                <div className="space-y-3.5">{pack.items.map((item) => <div className="flex items-start gap-3 text-sm" key={item}><span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${pack.featured ? "bg-[#dfff3f] text-black" : "bg-black text-white"}`}><Check className="size-3" /></span><span className={pack.featured ? "text-white/75" : "text-black/65"}>{item}</span></div>)}</div>
                <div className="mt-auto pt-8"><ArrowButton href="#start" inverse={pack.featured}>Choose {pack.name}</ArrowButton></div>
              </div>)}
            </div>
            <div className="mt-4 flex flex-col gap-4 rounded-[22px] border border-black/15 bg-[#f4f2ea]/65 p-6 md:flex-row md:items-center md:justify-between"><div><div className="text-lg font-semibold tracking-[-.03em]">Monthly Creative Engine</div><div className="mt-1 text-sm text-black/50">Scope defined after the first sprint based on volume and testing cadence.</div></div><div className="text-2xl font-semibold tracking-[-.04em]">From $2,000/mo</div></div>
          </div>
        </section>

        <section className="px-4 py-24 md:px-7 md:py-32">
          <div className="mx-auto max-w-[1500px]">
            <div className="grid gap-14 lg:grid-cols-2">
              <div><div className="kicker mb-6 text-black/50">05 / FAQ</div><h2 className="section-title">Straight answers.<br /><span className="text-black/25">No pitch fog.</span></h2></div>
              <div className="divide-y divide-black/12 border-y border-black/12">{faq.map(([q, a]) => <details className="group py-5" key={q}><summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-lg font-semibold tracking-[-.025em]"><span>{q}</span><span className="grid size-8 shrink-0 place-items-center rounded-full border border-black/12"><ChevronDown className="size-4 transition-transform group-open:rotate-180" /></span></summary><p className="max-w-2xl pr-12 pt-4 text-sm leading-relaxed text-black/55">{a}</p></details>)}</div>
            </div>
          </div>
        </section>

        <section id="start" className="bg-[#dfff3f] px-4 py-24 md:px-7 md:py-32">
          <div className="mx-auto max-w-[1500px]">
            <div className="grid gap-14 lg:grid-cols-[1fr_.72fr]">
              <div><div className="kicker mb-7 text-black/55">06 / Start</div><h2 className="section-title max-w-5xl">Give us one product.<br /><span className="text-black/38">We’ll give you more ways to sell it.</span></h2><p className="mt-7 max-w-2xl text-lg leading-relaxed text-black/60">Start with the essentials. Build a clean sprint brief in under a minute, then send it through the contact channel where we connected.</p></div>
              <div className="rounded-[26px] border border-black/15 bg-[#f4f2ea] p-5 shadow-[0_35px_90px_rgba(0,0,0,.12)] md:p-7">
                <div className="mb-6 flex items-center justify-between"><div><div className="text-lg font-semibold tracking-[-.03em]">Creative Sprint Brief</div><div className="mt-1 text-xs text-black/45">Two fields. One useful starting point.</div></div><Zap className="size-5" /></div>
                <label className="block text-xs font-bold uppercase tracking-[.12em] text-black/45">Product URL<input value={productUrl} onChange={(e) => setProductUrl(e.target.value)} placeholder="https://yourstore.com/product" className="mt-2 w-full rounded-[14px] border border-black/12 bg-white/70 px-4 py-3.5 text-sm font-medium tracking-normal outline-none transition focus:border-black/35" /></label>
                <label className="mt-4 block text-xs font-bold uppercase tracking-[.12em] text-black/45">What should the creative sell or test?<textarea value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g. Lead with the mess problem, demonstrate the product, then test 3 opening hooks." rows={4} className="mt-2 w-full resize-none rounded-[14px] border border-black/12 bg-white/70 px-4 py-3.5 text-sm font-medium leading-relaxed tracking-normal outline-none transition focus:border-black/35" /></label>
                <button onClick={copyBrief} className="group mt-5 flex w-full items-center justify-between rounded-full bg-black px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#7c62ff]"><span>{copied ? "Brief copied" : "Copy sprint brief"}</span>{copied ? <Check className="size-4" /> : <Copy className="size-4" />}</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#0a0a0a] px-4 py-8 text-white md:px-7">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div><Logo className="[&_span]:text-white [&_span_span]:text-white/35" /><div className="mt-5 max-w-md text-sm leading-relaxed text-white/38">Direct-response creative for ecommerce. More ads to test. Less production drag.</div></div>
          <div className="flex flex-wrap items-center gap-5 text-xs font-semibold text-white/45"><a href="#top" className="hover:text-white">Top</a><a href="#work" className="hover:text-white">Work</a><a href="#pricing" className="hover:text-white">Pricing</a><a href="#start" className="inline-flex items-center gap-2 text-white hover:text-[#dfff3f]">Start a sprint <ArrowRight className="size-3.5" /></a></div>
        </div>
        <div className="mx-auto mt-8 flex max-w-[1500px] flex-col gap-2 border-t border-white/10 pt-5 text-[10px] font-semibold uppercase tracking-[.12em] text-white/25 md:flex-row md:justify-between"><span>© {new Date().getFullYear()} ScrollSprint Creative</span><span>Concept work is labeled. No fabricated performance claims.</span></div>
      </footer>
    </div>
  );
}
