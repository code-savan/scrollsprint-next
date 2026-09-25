"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowRight, ArrowDown, Check, X, Menu, Plus, Film, AudioLines, MousePointer2, Scissors, ChevronLeft, ChevronRight, Play, MessageCircle, Sparkles, BadgeCheck, ClipboardList, Package, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/logo";
import { ContactFlow } from "@/components/contact-flow";
import { ConceptVideo } from "@/components/concept-video";

const heroSlides = [
  { niche: "BEAUTY / CREATOR FRAME", headline: "next beauty story.", image: "/hero/beauty.webp", alt: "Beauty creator showing a hair styling brush in her room", description: "A familiar styling moment gives the product a natural role." },
  { niche: "WELLNESS / CREATOR FRAME", headline: "next daily ritual.", image: "/hero/wellness.webp", alt: "Wellness creator holding a hydration bottle in her kitchen", description: "Show how an everyday product fits into a real routine." },
  { niche: "PETS / CREATOR FRAME", headline: "next pet-care test.", image: "/hero/pet.webp", alt: "Pet creator with her dog and a grooming brush at home", description: "Start with a moment pet owners already recognize." },
];
const platforms = ["meta", "tiktok", "youtube", "instagram", "facebook", "pinterest", "snapchat"];

const concepts = [
  { brand: "TYMO Ring Plus", title: "The getting-ready race.", category: "Beauty / challenge", color: "rose", video: "hair-challenge", hook: "Two friends, one mirror, and a race to get ready.", angle: "A competition gives the straightening comb a role in the story, with styling and reactions on screen.", frames: ["Two friends race to get ready.", "The hair tool enters the challenge.", "The reveal and reaction close the story."], format: "27 seconds · 9:16", kind: "Spec ad" },
  { brand: "Hair-styling tool", title: "The salon comparison.", category: "Beauty / comparison", color: "rose", video: "hair-salon", hook: "Two salon chairs. One styling challenge.", angle: "A side-by-side salon setup creates curiosity before a heated styling brush and the finished hair become the reveal.", frames: ["Set up two salon chairs and an audience.", "Show the styling tool in use.", "Reveal the finished look."], format: "34 seconds · 9:16", kind: "Provided reference" },
  { brand: "PrePaw", title: "The fur came back.", category: "Pet care / story", color: "sage", video: "dog-grooming", hook: "She just cleaned. The dog has other plans.", angle: "A familiar cleanup complaint leads to a grooming vacuum unboxing and a calmer routine with the dog.", frames: ["Loose fur interrupts a clean room.", "The grooming vacuum comes out of its parcel.", "The owner uses it with the dog."], format: "27 seconds · 9:16", kind: "Spec ad" },
  { brand: "Travel activity toy", title: "The flight distraction.", category: "Parenting / drama", color: "blue", video: "flight-activity", hook: "A tense flight gives way to a focused little passenger.", angle: "A dramatic cabin scene sets up a hands-on activity board as the visual payoff for a parent and child.", frames: ["Open on a worried parent in the cabin.", "Introduce the activity board on the tray table.", "Show the child playing while the cabin settles."], format: "40 seconds · 9:16", kind: "Provided reference" },
  { brand: "Electric toothbrush", title: "The toothbrush investigation.", category: "Personal care / comedy", color: "sage", video: "toothbrush-demo", hook: "Brushing teeth becomes a mock investigation.", angle: "An exaggerated cleanup scene turns an ordinary bathroom product into a comedic reveal.", frames: ["Introduce the everyday bathroom problem.", "Build the joke with the cleanup crew.", "Reveal the powered toothbrush in use."], format: "42 seconds · 9:16", kind: "Provided reference" },
  { brand: "Hair care", title: "The barber pressure test.", category: "Grooming / drama", color: "rose", video: "barber-challenge", hook: "The bathroom mirror becomes a stage.", angle: "A barber challenge builds tension, then uses the haircut reaction as the payoff.", frames: ["Introduce the client and barber.", "Build the pressure around the grooming moment.", "Finish on the group reaction."], format: "37 seconds · 9:16", kind: "Provided reference" },
];
type Concept = typeof concepts[number];
const packages = [
  { name: "Trial Ad", tag: "LOW-RISK START", price: "$99", intro: "A small first test for one product.", ads: "3", longer: "1", items: ["Three vertical ads up to 30 seconds", "One 60–90 second product explainer", "One product and one bounded revision round"], checkout: "https://whop.com/checkout/plan_6OrvvrFEUnYa1" },
  { name: "Test Sprint", tag: "RECOMMENDED", price: "$299", intro: "A focused batch of hooks, demos and deeper explanations.", ads: "6", longer: "3", items: ["Six vertical ads up to 30 seconds", "Three 60–90 second product explainers", "One product and one bounded revision round"], checkout: "https://whop.com/checkout/plan_ospIIPGODzxd1", featured: true },
  { name: "Growth Sprint", tag: "FOR ACTIVE CAMPAIGNS", price: "$699", intro: "More angles and explanations for an active testing cycle.", ads: "10", longer: "5", items: ["Ten vertical ads up to 30 seconds", "Five 60–90 second product explainers", "One product and one bounded revision round"], checkout: "https://whop.com/checkout/plan_fSMAw8tgMTaBT" },
  { name: "Scale Batch", tag: "BY REQUEST", price: "By request", intro: "A scoped creative queue sized to your campaign needs.", ads: "15–25", longer: "10", items: ["Fifteen to twenty-five vertical ads up to 30 seconds", "Ten 60–90 second product explainers", "One product, scoped directions and a bounded revision round"], checkout: "" },
];
const questions = [
  ["What do you need to get started?", "Your product link, approved product photos or footage, brand guidelines, and any existing ads or learnings. We agree on the scope and creative direction before production."],
  ["Do we need to ship a product?", "Not always. We often work with approved product imagery, existing footage and generated production. We will flag any concept requiring a physical shoot before you commit."],
  ["When will my ads be ready?", "After payment, we review your product page, claims, assets, current ads and goals. We confirm the creative direction and delivery date before production begins. Revision timing depends on the feedback and scope."],
  ["Are the portfolio videos commissioned client work?", "No. We identify our self-initiated spec ads and the reference videos provided to us. Product names do not imply a paid client relationship or brand endorsement."],
  ["Do you run the ads or guarantee results?", "Our packages cover creative production. Your team handles media buying. Results depend on your offer, audience, landing page and campaign execution. We do not guarantee ROAS, CPA or revenue."],
  ["What counts as a finished ad?", "Each ad has its own opening and payoff. Ads within a batch may share approved footage and production elements. Longer explainers run 60–90 seconds. One bounded revision round applies to the batch. Scale Batch is quoted for 15–25 short ads and ten explainers."],
  ["What happens after payment?", "We review your product page, claims, assets, current ads and goals, then confirm the creative direction and delivery date before production begins. The one-time payment covers creative production; ad spend and media buying are separate. There is no ongoing commitment."],
];

// Configure this in Vercel when the business WhatsApp number is available.
// A complete wa.me URL may be used; any text parameter is replaced per CTA.
const whatsappDestination = process.env.NEXT_PUBLIC_SCROLLSPRINT_WHATSAPP_URL?.trim() || "";
function whatsappHref(message: string) {
  if (!whatsappDestination) return "#start";
  try {
    const url = new URL(whatsappDestination);
    if (url.protocol !== "https:" || !["wa.me", "api.whatsapp.com", "www.whatsapp.com"].includes(url.hostname)) return "#start";
    if (url.hostname === "wa.me" && !/^\/\d{7,15}$/.test(url.pathname)) return "#start";
    if (url.hostname !== "wa.me" && (!/^\d{7,15}$/.test(url.searchParams.get("phone") || "") || url.pathname !== "/send")) return "#start";
    url.searchParams.set("text", message);
    return url.toString();
  } catch { return "#start"; }
}
const whatsappReady = whatsappHref("hello") !== "#start";
const adMessage = "Hi ScrollSprint, I'd like feedback on an ad for my product.";
const packageMessage = (name: string) => `Hi ScrollSprint, I'm interested in the ${name} for my product. I'd like to check if it's a fit.`;
// The three fixed-price Whop listings and checkout summaries match this scope.
const checkoutsUpdated = true;

function CTA({ href = "#start", children, light = false, className = "", icon }: { href?: string; children: React.ReactNode; light?: boolean; className?: string; icon?: React.ReactNode }) {
  return <a href={href} className={`ss-button ${light ? "ss-button-light" : "ss-button-dark"} ${className}`}><span>{children}</span>{icon ?? <ArrowUpRight size={17} aria-hidden="true" />}</a>;
}

export function ScrollSprintSite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const [selectedPackage, setSelectedPackage] = useState("Test Sprint");
  const dialog = useRef<HTMLDialogElement>(null);
  const slider = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const drag = useRef({ down: false, startX: 0, startScroll: 0, moved: false });
  const [workIndex, setWorkIndex] = useState(0);
  const [workProgress, setWorkProgress] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") setActiveSlide(current => (current + 1) % heroSlides.length);
    }, 5200);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedConcept || !dialog.current) return;
    if (!dialog.current.open) dialog.current.showModal();
  }, [selectedConcept]);
  useEffect(() => {
    if (!menuOpen) return;
    function onKey(event: KeyboardEvent) { if (event.key === "Escape") { setMenuOpen(false); menuButton.current?.focus(); } }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);
  function choosePackage(name: string) { setSelectedPackage(name); }
  function workStep() {
    const track = slider.current;
    if (!track) return 320;
    const card = track.querySelector<HTMLElement>(".video-slide");
    return card ? card.offsetWidth + 28 : Math.max(280, track.clientWidth * 0.8);
  }
  function updateWorkState() {
    const track = slider.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    const left = track.scrollLeft;
    setCanPrev(left > 8);
    setCanNext(left < max - 8);
    setWorkProgress(max > 0 ? Math.min(1, Math.max(0, left / max)) : 0);
    const step = workStep();
    setWorkIndex(step > 0 ? Math.min(concepts.length - 1, Math.max(0, Math.round(left / step))) : 0);
  }
  function scrollWork(direction: 1 | -1) {
    const track = slider.current;
    if (!track) return;
    track.scrollBy({ left: direction * Math.max(280, track.clientWidth * 0.8), behavior: "smooth" });
  }
  function goToWork(index: number) {
    const track = slider.current;
    if (!track) return;
    track.scrollTo({ left: index * workStep(), behavior: "smooth" });
  }
  function onWorkPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if ((e.target as HTMLElement).closest("button, a, video, input, .custom-player-bar")) return;
    const track = slider.current;
    if (!track) return;
    drag.current = { down: true, startX: e.clientX, startScroll: track.scrollLeft, moved: false };
    setIsDragging(true);
    track.setPointerCapture?.(e.pointerId);
  }
  function onWorkPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current.down) return;
    const track = slider.current;
    if (!track) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 6) drag.current.moved = true;
    track.scrollLeft = drag.current.startScroll - dx;
  }
  function endWorkDrag(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current.down) return;
    drag.current.down = false;
    setIsDragging(false);
    try { slider.current?.releasePointerCapture?.(e.pointerId); } catch { /* noop */ }
  }
  useEffect(() => {
    updateWorkState();
    window.addEventListener("resize", updateWorkState);
    return () => window.removeEventListener("resize", updateWorkState);
  }, []);

  return <div className="site-shell">
    <a href="#main" className="skip-link">Skip to content</a>
    <header className="site-header">
      <div className="page-width header-inner">
        <Logo />
        <nav aria-label="Main navigation" className="desktop-nav"><a href="#work">The work</a><a href="#approach">Our approach</a><a href="#pricing">Packages</a></nav>
        <div className="header-actions"><CTA className="header-cta" href={whatsappHref(adMessage)}>{whatsappReady ? "Send your ad" : "Start a brief"}</CTA><button ref={menuButton} className="menu-toggle" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22}/> : <Menu size={22}/>}</button></div>
      </div>
      {menuOpen && <nav id="mobile-menu" aria-label="Mobile navigation" className="mobile-nav"><a href="#work" onClick={() => setMenuOpen(false)}>The work <ArrowUpRight size={20}/></a><a href="#approach" onClick={() => setMenuOpen(false)}>Our approach <ArrowUpRight size={20}/></a><a href="#pricing" onClick={() => setMenuOpen(false)}>Packages <ArrowUpRight size={20}/></a><a href="#start" onClick={() => setMenuOpen(false)}>Start a brief <ArrowUpRight size={20}/></a></nav>}
    </header>
    <main id="main">
      <section id="top" className="hero-section">
        <div className="page-width hero-grid">
          <div className="hero-copy"><div className="eyebrow"><span className="status-dot"/> Short-form ad creative for ecommerce brands</div><h1>More creative<br/>angles for your<br/><em key={activeSlide} className="hero-headline-swap">{heroSlides[activeSlide].headline}</em></h1><p>ScrollSprint turns what makes your product worth buying into short-form ads worth testing, with stronger hooks, clearer product demos, and fresh creative directions for Meta, TikTok, and YouTube Shorts.</p><div className="hero-actions"><CTA href={whatsappHref(adMessage)} icon={whatsappReady ? <MessageCircle size={17} aria-hidden="true" /> : <Sparkles size={17} aria-hidden="true" />}>{whatsappReady ? "Send us your current ad" : "Find your starting point"}</CTA><a href="#work" className="pill-action"><span className="pill-action-disc"><Play size={13} fill="currentColor" aria-hidden="true" /></span>Watch the ads</a></div><div className="hero-assurance"><BadgeCheck size={21} aria-hidden="true" /><div><p><strong>Already running paid ads?</strong> Send us your product page or current ad and we’ll suggest where the next creative opportunity may be.</p><ul><li><Check size={14} aria-hidden="true" />Strategy through final cut</li><li><Check size={14} aria-hidden="true" />One-time projects from $99</li></ul></div></div></div>
          <div className="hero-visual creator-visual"><div className="creator-stage">{heroSlides.map((slide, index) => <div key={slide.image} className={`creator-slide ${activeSlide === index ? "is-active" : ""}`} aria-hidden={activeSlide !== index}><img src={slide.image} width="720" height="1280" alt={activeSlide === index ? slide.alt : ""} fetchPriority={index === 0 ? "high" : undefined} loading={index === 0 ? "eager" : "lazy"}/></div>)}</div></div>
        </div>
        <div className="page-width platform-line"><span>Made for the feed.<br/><strong>Built for your next test.</strong></span><div className="platform-marquee" aria-label="Creative for Meta, TikTok, YouTube, Instagram, Facebook, Pinterest and Snapchat"><div className="platform-track">{[0,1].map(copy=><div className="platform-set" key={copy} aria-hidden={copy===1}>{platforms.map(name=><span className="platform-logo" key={name}><img src={`/brands/${name}.svg`} alt={copy===0 ? name[0].toUpperCase()+name.slice(1) : ""} width="34" height="34"/></span>)}</div>)}</div></div><span className="platform-aside">SCROLL LESS.<br/>SEE MORE. <ArrowDown size={14}/></span></div>
      </section>

      <section className="whatsapp-section" aria-labelledby="whatsapp-heading"><div className="page-width whatsapp-grid"><div><span className="eyebrow">A focused first conversation</span><h2 id="whatsapp-heading">Send us the ad you’re<br/><em>currently running.</em></h2><p>We’ll look at your product, current creative, and the opportunity you may be missing. If there’s a fit, we’ll suggest a few directions for your next test.</p></div><div><ol><li><span>01</span>Send your product link or current ad</li><li><span>02</span>Get a focused creative recommendation</li><li><span>03</span>Choose the sprint that fits your testing needs</li></ol><CTA href={whatsappHref(adMessage)}>{whatsappReady ? "Start a WhatsApp conversation" : "Prepare a brief to start"}</CTA></div></div></section>

      <section id="work" className="section-space work-section">
        <div className="page-width">
          <div className="section-topline"><span className="eyebrow">01 / The concept room</span><span className="tiny-note">A LITTLE PRODUCT OBSESSION GOES A LONG WAY.</span></div>
          <div className="section-heading"><h2>Different products.<br/><em>Distinct stories.</em></h2><p>One product can invite multiple testable stories: a problem-first hook, product demo, before-and-after moment, comedy, tension, UGC-style story, comparison, or visual payoff. These six videos explore different directions.</p></div>
          <div className="work-slider-head">
            <span className="work-slider-hint">Tap a video to watch it with its story.</span>
            <div className="work-slider-meta">
              <span className="work-slider-count" aria-live="polite">{String(workIndex + 1).padStart(2, "0")} / {String(concepts.length).padStart(2, "0")}</span>
              <div className="work-slider-nav">
                <button type="button" onClick={() => scrollWork(-1)} disabled={!canPrev} aria-label="Scroll videos left"><ChevronLeft size={19} /></button>
                <button type="button" onClick={() => scrollWork(1)} disabled={!canNext} aria-label="Scroll videos right"><ChevronRight size={19} /></button>
              </div>
            </div>
          </div>
          <div className="video-slider-wrap">
            <div
              ref={slider}
              className={`video-slider${isDragging ? " is-dragging" : ""}`}
              role="region"
              aria-roledescription="carousel"
              aria-label="Concept videos — scroll horizontally"
              tabIndex={0}
              onScroll={updateWorkState}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") { e.preventDefault(); scrollWork(1); }
                if (e.key === "ArrowLeft") { e.preventDefault(); scrollWork(-1); }
              }}
              onPointerDown={onWorkPointerDown}
              onPointerMove={onWorkPointerMove}
              onPointerUp={endWorkDrag}
              onPointerCancel={endWorkDrag}
              onClickCapture={(e) => {
                if (drag.current.moved) {
                  e.preventDefault();
                  e.stopPropagation();
                  drag.current.moved = false;
                }
              }}
            >
              {concepts.map((item, i) => <article className="video-slide" key={item.video} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${concepts.length}: ${item.brand} ${item.title}`} data-active={i === workIndex}>
                <button type="button" className="video-poster" onClick={() => setSelectedConcept(item)} aria-label={`Watch ${item.brand} — ${item.title}`}>
                  <img src={`/posters/${item.video}.webp?v=2`} alt="" width="540" height="960" loading="lazy" />
                  <span className="video-poster-play" aria-hidden="true"><Play size={24} fill="currentColor" /></span>
                </button>
                <div className="concept-info"><span>{item.brand} · {item.kind}</span><h3><button onClick={() => setSelectedConcept(item)}>{item.title}</button></h3><p>{item.angle}</p></div>
              </article>)}
            </div>
          </div>
          <div className="work-slider-foot">
            <div className="work-slider-rail" aria-hidden="true"><span style={{ transform: `scaleX(${workProgress || 1 / concepts.length})` }} /></div>
            <div className="work-slider-dots" role="tablist" aria-label="Choose a video">
              {concepts.map((item, i) => <button key={item.video} type="button" role="tab" aria-selected={i === workIndex} aria-label={`Go to ${item.brand} ${item.title}`} className={i === workIndex ? "is-active" : ""} onClick={() => goToWork(i)} />)}
            </div>
          </div>
          <div className="work-bottom"><p>Spec ads show our creative work. Supplied references show story formats we study. No paid client relationship or product endorsement is implied.</p><a className="text-link" href="#pricing">See project pricing <ArrowRight size={16}/></a></div>
        </div>
      </section>

      <section id="services" className="promise-section section-space">
        <div className="page-width promise-grid"><div><span className="eyebrow">02 / More room to test</span><h2>A great product<br/>has more than<br/><em>one good story.</em></h2><p>Creative fatigue can look like the same opening, the same product montage, and a benefit that never gets demonstrated. Your product may need more ways to introduce, demonstrate, and frame the reason to buy. More angles give your next campaign more ways to learn.</p><a href="#pricing" className="text-link">Find your starting point <ArrowUpRight size={17}/></a></div>
          <div className="deliverables"><div className="deliverable"><span className="drawn-index">01</span><div><h3>A reason to stop</h3><p>Openings built around a recognizable problem, an unexpected detail or a compelling product moment.</p><span className="deliverable-tag">HOOKS + CREATIVE ANGLES</span></div><MousePointer2 size={24}/></div><div className="deliverable"><span className="drawn-index">02</span><div><h3>A product to believe in</h3><p>Clear demonstrations and thoughtful stories showing what the product does and where it fits.</p><span className="deliverable-tag">PRODUCT DEMOS + UGC-STYLE</span></div><Film size={24}/></div><div className="deliverable"><span className="drawn-index">03</span><div><h3>More ways to find the fit</h3><p>Finished cuts, opening variations, captions and sound, organized for the next round of testing.</p><span className="deliverable-tag">EDITING + VARIATIONS + SOUND</span></div><Scissors size={24}/></div></div>
        </div>
      </section>

      <section id="approach" className="section-space approach-section">
        <div className="page-width"><div className="section-topline"><span className="eyebrow">03 / Small team. Clear process.</span><span className="tiny-note">FROM YOUR PRODUCT PAGE TO THE PAID-SOCIAL QUEUE.</span></div><div className="section-heading"><h2>Less back-and-forth.<br/><em>More forward motion.</em></h2><p>We review what you have, find a buying moment worth showing, and turn it into finished vertical creative your team can test.</p></div>
          <div className="process-grid">{[
            ["01", "Review the product.", "We look at the product, current ads and available assets, then agree on what the batch should explore.", "A focused brief"],
            ["02", "Find the story.", "We identify buying moments and shape hooks, demos, UGC-style concepts and story angles.", "Creative directions to approve"],
            ["03", "Make the move.", "We produce finished vertical ads and variations, with captions and sound where included. One bounded revision round refines the batch.", "Finished creative + variations"],
            ["04", "Test. Learn. Repeat.", "Your team launches the ads. What performs informs the next creative sprint.", "A smarter next batch"],
          ].map(([num,title,body,output])=><div className="process-step" key={num}><div className="process-number">{num}<ArrowUpRight size={20}/></div><h3>{title}</h3><p>{body}</p><div className="process-output"><Check size={14}/>{output}</div></div>)}</div>
          <div className="delivery-strip"><AudioLines size={22}/><p>Every detail earns its place. <span>Hook. Product. Voice. Cut. Caption. CTA.</span></p><span>READY FOR YOUR NEXT TEST</span></div>
        </div>
      </section>

      <section id="who" className="section-space fit-section"><div className="page-width fit-grid"><div><span className="eyebrow">For the next round of testing</span><h2>Built for brands that already have<br/><em>something worth selling.</em></h2><p>You do not need a complete repositioning to test a better introduction or a clearer demonstration.</p></div><div><ul><li><Check size={16}/>You are running or preparing paid social</li><li><Check size={16}/>Your current ads are becoming repetitive</li><li><Check size={16}/>You need more hooks and angles to test</li><li><Check size={16}/>Your product benefit is clearer when demonstrated</li><li><Check size={16}/>You want a focused sprint, not a large agency engagement</li></ul><p>Not a fit for guaranteed ROAS, media buying, or a full brand redesign.</p></div></div></section>

      <section id="pricing" className="section-space pricing-section"><div className="page-width"><div className="section-topline"><span className="eyebrow">04 / Pick your pace</span><span className="tiny-note">ONE PRODUCT. ONE-TIME PAYMENT. DEFINED CREATIVE.</span></div><div className="section-heading"><h2>Choose the amount of<br/><em>creative room you need.</em></h2><p>Start with a focused test or build a larger batch for your next paid-social cycle. Every sprint covers one product and one bounded revision round. Scale Batch is scoped by request.</p></div>
        <div className="pricing-grid">{packages.map(pack=><article key={pack.name} className={`price-card ${pack.featured ? "price-featured" : ""}`}><div className="price-top"><h3>{pack.name}</h3><span>{pack.tag}</span></div><p className="price-intro">{pack.intro}</p><div className={`price-amount ${pack.checkout ? "" : "price-custom"}`}>{pack.price}<span>{pack.checkout ? "USD / one-time project" : "SCOPED QUOTE / ONE-TIME PROJECT"}</span></div><div className="price-stats"><div><strong>{pack.ads}</strong><span>ads up to 30s</span></div><div><strong>{pack.longer}</strong><span>60–90s explainers</span></div></div><ul>{pack.items.map(item=><li key={item}><Check size={15}/><span>{item}</span></li>)}</ul>{pack.name === "Test Sprint" && <p className="package-note">Captions and sound where scoped. Media buying and ad spend are separate.</p>}{pack.checkout && checkoutsUpdated ? <a href={pack.checkout} onClick={()=>choosePackage(pack.name)} className={`ss-button ${pack.featured ? "ss-button-orange" : "ss-button-outline"}`}><span>Proceed to checkout</span><ArrowUpRight size={17}/></a> : <a href="#start" onClick={()=>choosePackage(pack.name)} className={`ss-button ${pack.featured ? "ss-button-orange" : "ss-button-outline"}`}><span>{pack.checkout ? "Check this sprint" : "Request a Scale quote"}</span><ArrowUpRight size={17}/></a>}<a href={whatsappHref(packageMessage(pack.name))} onClick={()=>choosePackage(pack.name)} className="price-whatsapp">{whatsappReady ? "Ask about this sprint on WhatsApp" : "Prepare a brief for this sprint"}<ArrowUpRight size={14}/></a></article>)}</div>
        <div className="retainer-line"><div><strong>Want to check the fit first?</strong><p>Send your product page or current ad. We can suggest a sensible first creative test before you choose a package.</p></div><a href={whatsappHref(adMessage)} className="text-link">{whatsappReady ? "Start on WhatsApp" : "Prepare a brief"} <ArrowUpRight size={17}/></a></div>
      </div></section>

      <section className="section-space faq-section"><div className="page-width faq-grid"><div><span className="eyebrow">05 / Before we get rolling</span><h2>Good questions.<br/><em>Clear answers.</em></h2><p>The details, without the guesswork.</p></div><div className="faq-list">{questions.map(([q,a])=><details key={q}><summary><span>{q}</span><Plus size={20} aria-hidden="true"/></summary><p>{a}</p></details>)}</div></div></section>

      <section id="start" className="start-section section-space"><div className="page-width start-grid"><div className="start-copy"><span className="eyebrow">06 / Your next good move</span><h2>Have a product that needs<br/><em>more ways to be tested?</em></h2><p>Choose a few answers, then tell us how you want to talk. We’ll suggest a sensible creative starting point for your next test.</p><div className="final-actions"><a href="#contact-panel" className="ss-button ss-button-dark"><span>Find your starting point</span><ClipboardList size={17} aria-hidden="true" /></a><a href="#pricing" className="pill-action"><span className="pill-action-disc"><Package size={13} aria-hidden="true" /></span>View packages</a></div><div className="start-assurance"><ShieldCheck size={21} aria-hidden="true" /><div><p><strong>One-time project scope.</strong> Clear direction before production.</p><ul><li><Check size={14} aria-hidden="true" />Nothing is sent until you choose to send it</li><li><Check size={14} aria-hidden="true" />No ongoing commitment, just the next test</li></ul></div></div></div><div id="contact-panel"><ContactFlow initialPackage={selectedPackage} whatsappHref={whatsappHref} whatsappReady={whatsappReady}/></div></div></section>
    </main>
    <footer className="site-footer"><div className="page-width"><div className="footer-top"><Logo/><p>More ads to test.<br/><em>Less production drag.</em></p><a href="#top" className="back-top" aria-label="Back to top"><ArrowUpRight size={25}/></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} ScrollSprint Creative</span><nav aria-label="Footer navigation"><a href="#work">The work</a><a href="#pricing">Packages</a><a href="#start">Start a brief</a></nav><span>INDEPENDENT BY DESIGN.</span></div></div></footer>
    <dialog ref={dialog} className="concept-dialog concept-dialog-story" onClose={()=>{setSelectedConcept(null);}} onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close();}} aria-labelledby="concept-dialog-title">
      {selectedConcept && <><button className="dialog-close" onClick={()=>dialog.current?.close()} aria-label="Close concept"><X size={21}/></button><div className={`dialog-art tone-${selectedConcept.color}`}><ConceptVideo key={selectedConcept.video} src={`/videos/${selectedConcept.video}.mp4?v=2`} poster={`/posters/${selectedConcept.video}.webp?v=2`} label={`${selectedConcept.brand} — ${selectedConcept.title}`} autoPlay /><span><Film size={14}/> {selectedConcept.kind}</span></div><div className="dialog-copy"><span className="eyebrow">{selectedConcept.brand} / {selectedConcept.kind}</span><h2 id="concept-dialog-title">{selectedConcept.title}</h2><p className="concept-hook">“{selectedConcept.hook}”</p><ol>{selectedConcept.frames.map((frame,i)=><li key={frame}><span>0{i+1}</span>{frame}</li>)}</ol><div className="dialog-foot"><span>{selectedConcept.format}</span><span>{selectedConcept.kind === "Spec ad" ? "Self-initiated concept" : "Supplied creative reference"}</span></div></div></>}
    </dialog>
  </div>;
}
