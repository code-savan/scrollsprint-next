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
  MoveUpRight,
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
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-7 md:pt-5">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between rounded-[14px] border border-black/10 bg-[#f4f2ea]/95 px-3 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,.08)] backdrop-blur-xl md:rounded-[18px] md:px-5 md:py-3">
          <Logo />
          <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
            <a href="#work" className="text-black/58 hover:text-black">Work</a>
            <a href="#services" className="text-black/58 hover:text-black">Services</a>
            <a href="#process" className="text-black/58 hover:text-black">Process</a>
            <a href="#pricing" className="text-black/58 hover:text-black">Pricing</a>
            <ArrowButton href="#start" small>Start a sprint</ArrowButton>
          </nav>
          <button onClick={() => setMenuOpen((v) => !v)} className="grid size-11 place-items-center rounded-full border border-black/12 md:hidden" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation">
            {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
        {menuOpen && (
          <nav id="mobile-navigation" aria-label="Mobile navigation" className="mx-auto mt-2 max-w-[1500px] rounded-[18px] border border-black/10 bg-[#f4f2ea] p-4 shadow-2xl md:hidden">
            {["work", "services", "process", "pricing", "start"].map((item) => <a onClick={() => setMenuOpen(false)} className="block border-b border-black/8 py-3 text-lg capitalize last:border-0" href={`#${item}`} key={item}>{item}</a>)}
          </nav>
        )}
      </header>

      <main id="main">
        <section id="top" className="hero-shell relative overflow-hidden bg-[#10110f] px-4 pb-8 pt-28 text-white md:px-7 md:pb-10 md:pt-36">
          <div className="pointer-events-none absolute inset-0 grid-lines opacity-40" />
          <div className="pointer-events-none absolute -right-32 -top-40 size-[650px] rounded-full bg-[#7155ff]/15 blur-[140px]" />
          <div className="relative mx-auto max-w-[1500px]">
            <div className="mb-7 flex items-center justify-between border-b border-white/15 pb-5 text-[10px] font-bold uppercase tracking-[.16em] text-white/45 md:mb-12">
              <span className="text-[#dfff3f]">Independent creative studio</span><span>Built for the next test ↗</span>
            </div>
            <div className="grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-end lg:gap-8">
              <div className="pb-0 lg:pb-10">
                <div className="kicker mb-6 text-[#dfff3f]">Direct-response ecommerce creative</div>
                <h1 className="hero-title max-w-[1000px]">The scroll<br />doesn’t <span className="hero-outline">wait.</span><span className="text-[#dfff3f]">✳</span></h1>
                <p className="mt-7 max-w-[610px] text-base leading-[1.55] text-white/65 md:mt-10 md:text-xl">Your product deserves more than one shot at attention. We build product-first video ads, fresh hooks and new angles your team can put to the test.</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center md:mt-10">
                  <ArrowButton href="#start" inverse>Start a creative sprint</ArrowButton>
                  <a href="#work" className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white/80 hover:border-white/60 hover:text-white">Explore concepts <ArrowDown className="size-4 transition-transform group-hover:translate-y-1" /></a>
                </div>
                <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/15 pt-5 text-[11px] font-semibold uppercase tracking-[.12em] text-white/42 md:mt-16"><span>Product-first</span><span>Multiple angles</span><span>Made for testing</span></div>
              </div>
              <div className="hero-art relative min-h-[450px] overflow-hidden rounded-[24px] border border-white/15 bg-[#1d1f1a] p-4 sm:min-h-[550px] md:p-6 lg:min-h-[630px]">
                <div className="absolute inset-0 hero-art-grid" />
                <div className="relative flex items-center justify-between text-[10px] font-bold uppercase tracking-[.15em] text-white/55"><span>ScrollSprint / Creative lab</span><span>01—03</span></div>
                <div className="hero-art-frame absolute inset-x-[12%] top-[15%] bottom-[13%] rotate-[-7deg] overflow-hidden rounded-[20px] border border-white/30 bg-[#dfff3f] p-5 text-black shadow-[24px_32px_0_rgba(0,0,0,.25)] sm:p-8">
                  <div className="flex items-center justify-between border-b border-black/25 pb-3 text-[10px] font-black uppercase tracking-[.14em]"><span>Concept / motion</span><span>9:16 ↗</span></div>
                  <div className="absolute inset-x-0 top-[22%] flex justify-center"><div className="hero-orbit grid size-48 place-items-center rounded-full border-[20px] border-black/90 text-[100px] font-black leading-none tracking-[-.1em] sm:size-64 sm:border-[27px]">S</div></div>
                  <div className="absolute bottom-6 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8"><div className="text-[clamp(2.5rem,6vw,5.5rem)] font-black uppercase leading-[.82] tracking-[-.09em]">Make<br />them<br />look.</div><div className="mt-5 flex justify-between border-t border-black/25 pt-3 text-[9px] font-black uppercase tracking-[.14em]"><span>Hook / Angle / Action</span><span>↗</span></div></div>
                </div>
                <div className="absolute bottom-5 right-5 rounded-full border border-white/20 bg-[#171816] px-4 py-2 text-[10px] font-bold uppercase tracking-[.1em] text-white/80 backdrop-blur">Creative testing, on repeat</div>
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
                return <div key={String(title)} className="min-h-[220px] border-b border-r border-black/10 p-6 md:p-7"><div className="flex items-center justify-between"><IconComponent className="size-5" /><span className="text-xs font-bold text-black/25">0{i + 1}</span></div><h3 className="mt-12 md:mt-20 text-2xl font-semibold tracking-[-.04em]">{String(title)}</h3><p className="mt-3 text-sm leading-relaxed text-black/50">{String(copy)}</p></div>;
              })}
            </div>
          </div>
        </section>

        <section id="work" className="bg-[#0b0b0b] px-4 py-24 text-white md:px-7 md:py-32">
          <div className="mx-auto max-w-[1500px]">
            <div className="flex flex-col gap-8 border-b border-white/12 pb-12 md:flex-row md:items-end md:justify-between">
              <div><div className="kicker mb-6 text-[#dfff3f]">02 / Selected concepts</div><h2 className="section-title max-w-5xl">Built to make the product <span className="text-white/28">impossible to ignore.</span></h2></div>
              <p className="max-w-sm text-sm leading-relaxed text-white/45">Six self-initiated concepts. Videos will be added here as production finishes. The creative direction is ready to explore.</p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-12">
              {portfolio.map((item, i) => (
                <Reveal key={item.title} delay={i * .04} className={`portfolio-card group overflow-hidden rounded-[22px] border border-white/15 bg-[#181a17] ${i < 2 ? "xl:col-span-6" : "xl:col-span-3"}`}>
                  <div className={`video-placeholder portfolio-stage stage-${i + 1} relative flex flex-col justify-between overflow-hidden p-5 md:p-6 ${i < 2 ? "aspect-[4/4.2] sm:aspect-[4/3]" : "aspect-[4/4.2]"}`}>
                    <div className="relative z-10 flex items-start justify-between gap-2"><Pill dark>Spec creative</Pill><span className="text-[11px] font-bold tracking-[.12em] text-white/55">{item.tone} / 06</span></div>
                    <div aria-hidden="true" className="portfolio-glyph relative z-10 self-center text-[clamp(6rem,20vw,15rem)] font-black leading-none tracking-[-.14em] text-white/80">{["P", "A", "D", "F", "Z", "H"][i]}</div>
                    <div className="relative z-10 flex items-end justify-between gap-2"><span className="rounded-full border border-white/25 bg-black/30 px-3 py-2 text-[10px] font-bold uppercase tracking-[.12em] backdrop-blur">Video coming soon</span><MoveUpRight className="size-5 text-white/65" /></div>
                  </div>
                  <div className="flex min-h-36 flex-col justify-between p-5 md:p-6"><div className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[.14em] text-white/45"><span>{item.name} / {item.type}</span><span>Concept</span></div><div><h3 className="mt-5 text-[clamp(1.45rem,2.5vw,2rem)] font-semibold leading-[1.02] tracking-[-.045em]">{item.title}</h3><p className="mt-2 text-xs text-white/45">{item.idea}</p></div></div>
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
              ].map(([n, title, copy]) => <div key={n} className="min-h-[220px] md:min-h-[310px] bg-[#f4f2ea] p-7"><div className="text-xs font-black text-black/25">{n}</div><div className="mt-12 md:mt-24 text-2xl font-semibold tracking-[-.04em]">{title}</div><p className="mt-3 text-sm leading-relaxed text-black/50">{copy}</p></div>)}
            </div>
          </div>
        </section>

        <section id="pricing" className="bg-[#c8bfff] px-4 py-24 md:px-7 md:py-32">
          <div className="mx-auto max-w-[1500px]">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end"><div><div className="kicker mb-6 text-black/55">04 / Packages</div><h2 className="section-title max-w-5xl">Start with one sprint.<br /><span className="text-black/35">Scale what earns another test.</span></h2></div><div className="max-w-sm text-sm leading-relaxed text-black/55">Choose a defined batch. Each package includes finished creative and opening variations for your team to test.</div></div>
            <div className="mt-16 grid gap-4 lg:grid-cols-3">
              {pricing.map((pack) => <div key={pack.name} className={`relative flex min-h-[500px] lg:min-h-[590px] flex-col rounded-[24px] border p-6 md:p-7 ${pack.featured ? "border-black bg-black text-white shadow-[0_30px_80px_rgba(0,0,0,.18)]" : "border-black/15 bg-[#f4f2ea]/65"}`}>
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
              <div><div className="kicker mb-7 text-black/55">06 / Start</div><h2 className="section-title max-w-5xl">Give us one product.<br /><span className="text-black/38">We’ll give you more ways to sell it.</span></h2><p className="mt-7 max-w-2xl text-lg leading-relaxed text-black/60">Tell us what you sell and what you want to test. Copy the brief, then send it through the channel where we connected.</p></div>
              <div className="rounded-[26px] border border-black/15 bg-[#f4f2ea] p-5 shadow-[0_35px_90px_rgba(0,0,0,.12)] md:p-7">
                <div className="mb-6 flex items-center justify-between"><div><div className="text-lg font-semibold tracking-[-.03em]">Creative Sprint Brief</div><div className="mt-1 text-xs text-black/45">Your starting point for a focused creative batch.</div></div><Zap className="size-5" /></div>
                <label className="block text-xs font-bold uppercase tracking-[.12em] text-black/45">Product URL<input value={productUrl} onChange={(e) => setProductUrl(e.target.value)} placeholder="https://yourstore.com/product" className="mt-2 w-full rounded-[14px] border border-black/12 bg-white/70 px-4 py-3.5 text-sm font-medium tracking-normal outline-none transition focus:border-black/35" /></label>
                <label className="mt-4 block text-xs font-bold uppercase tracking-[.12em] text-black/45">What should the creative sell or test?<textarea value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g. Lead with the mess problem, demonstrate the product, then test 3 opening hooks." rows={4} className="mt-2 w-full resize-none rounded-[14px] border border-black/12 bg-white/70 px-4 py-3.5 text-sm font-medium leading-relaxed tracking-normal outline-none transition focus:border-black/35" /></label>
                <p className="mt-4 text-xs leading-relaxed text-black/55">This brief stays on your device until you copy and send it.</p>
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
