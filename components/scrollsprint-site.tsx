"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, ArrowRight, ArrowDown, Check, X, Menu, Plus, Copy, Download, Film, AudioLines, MousePointer2, Scissors, CheckCheck } from "lucide-react";
import { Logo } from "@/components/logo";

const concepts = [
  { brand: "TYMO Ring Plus", title: "The getting-ready race.", category: "Beauty / challenge", color: "rose", video: "hair-challenge", hook: "Two friends, one mirror, and a race to get ready.", angle: "A competition gives the straightening comb a role in the story, with styling and reactions on screen.", frames: ["Two friends race to get ready.", "The hair tool enters the challenge.", "The reveal and reaction close the story."], format: "27 seconds · 9:16", kind: "Spec ad" },
  { brand: "Hair-styling tool", title: "The salon comparison.", category: "Beauty / comparison", color: "rose", video: "hair-salon", hook: "Two salon chairs. One styling challenge.", angle: "A side-by-side salon setup creates curiosity before a heated styling brush and the finished hair become the reveal.", frames: ["Set up two salon chairs and an audience.", "Show the styling tool in use.", "Reveal the finished look."], format: "34 seconds · 9:16", kind: "Provided reference" },
  { brand: "PrePaw", title: "The fur came back.", category: "Pet care / story", color: "sage", video: "dog-grooming", hook: "She just cleaned. The dog has other plans.", angle: "A familiar cleanup complaint leads to a grooming vacuum unboxing and a calmer routine with the dog.", frames: ["Loose fur interrupts a clean room.", "The grooming vacuum comes out of its parcel.", "The owner uses it with the dog."], format: "27 seconds · 9:16", kind: "Spec ad" },
  { brand: "Travel activity toy", title: "The flight distraction.", category: "Parenting / drama", color: "blue", video: "flight-activity", hook: "A tense flight gives way to a focused little passenger.", angle: "A dramatic cabin scene sets up a hands-on activity board as the visual payoff for a parent and child.", frames: ["Open on a worried parent in the cabin.", "Introduce the activity board on the tray table.", "Show the child playing while the cabin settles."], format: "40 seconds · 9:16", kind: "Provided reference" },
  { brand: "Electric toothbrush", title: "The toothbrush investigation.", category: "Personal care / comedy", color: "sage", video: "toothbrush-demo", hook: "Brushing teeth becomes a mock investigation.", angle: "An exaggerated cleanup scene turns an ordinary bathroom product into a comedic reveal.", frames: ["Introduce the everyday bathroom problem.", "Build the joke with the cleanup crew.", "Reveal the powered toothbrush in use."], format: "42 seconds · 9:16", kind: "Provided reference" },
  { brand: "Hair care", title: "The barber pressure test.", category: "Grooming / drama", color: "rose", video: "barber-challenge", hook: "The bathroom mirror becomes a stage.", angle: "A barber challenge builds tension, then uses the haircut reaction as the payoff.", frames: ["Introduce the client and barber.", "Build the pressure around the grooming moment.", "Finish on the group reaction."], format: "37 seconds · 9:16", kind: "Provided reference" },
  { brand: "One Pass", title: "Washed yesterday. Dusty today.", category: "Car care / demo", color: "blue", video: "car-wash", hook: "The car looked clean yesterday. Look at it now.", angle: "The repeat-cleaning frustration sets up a spray-and-wipe transformation on a dusty panel.", frames: ["Show the owner noticing the dusty finish.", "Spray and wipe the same panel.", "Reveal the finish and the One Pass bottle."], format: "15 seconds · 9:16", kind: "Spec ad" },
];
type Concept = typeof concepts[number];
const packages = [
  { name: "Trial Ad", tag: "LOW-RISK START", price: "$99", intro: "A simple way to test the fit before committing to a larger creative batch.", ads: "3", longer: "0", items: ["Three finished ads with distinct openings and payoffs", "Each up to 30 seconds, vertical 9:16", "One product and one batch revision round"], checkout: "https://whop.com/checkout/plan_6OrvvrFEUnYa1" },
  { name: "Test Sprint", tag: "RECOMMENDED", price: "$299", intro: "The best starting point for a brand that needs fresh angles for one product.", ads: "5", longer: "1", items: ["Five ads up to 30 seconds across two directions", "One 60–90 second product explainer", "One product and one batch revision round"], checkout: "https://whop.com/checkout/plan_ospIIPGODzxd1", featured: true },
  { name: "Growth Sprint", tag: "FOR ACTIVE CAMPAIGNS", price: "$699", intro: "More directions, more variations, and more room to learn what resonates.", ads: "8", longer: "2", items: ["Eight ads up to 30 seconds across four directions", "Two 60–90 second product explainers", "One product and one batch revision round"], checkout: "https://whop.com/checkout/plan_fSMAw8tgMTaBT" },
  { name: "Scale Batch", tag: "FOR ACTIVE TESTING", price: "$1,499", intro: "A larger creative queue for brands testing consistently across paid social.", ads: "12", longer: "4", items: ["Twelve ads up to 30 seconds across six directions", "Four 60–90 second explainers and a testing sequence", "One product and one batch revision round"], checkout: "https://whop.com/checkout/plan_V7DWvqie2zGrG" },
];
const questions = [
  ["What do you need to get started?", "Your product link, approved product photos or footage, brand guidelines, and any existing ads or learnings. We agree on the scope and creative direction before production."],
  ["Do we need to ship a product?", "Not always. We often work with approved product imagery, existing footage and generated production. We will flag any concept requiring a physical shoot before you commit."],
  ["When will my ads be ready?", "After payment, we review your product page, claims, assets, current ads and goals. We confirm the creative direction and delivery date before production begins. Revision timing depends on the feedback and scope."],
  ["Are the portfolio videos commissioned client work?", "No. We identify our self-initiated spec ads and the reference videos provided to us. Product names do not imply a paid client relationship or brand endorsement."],
  ["Do you run the ads or guarantee results?", "Our packages cover creative production. Your team handles media buying. Results depend on your offer, audience, landing page and campaign execution. We do not guarantee ROAS, CPA or revenue."],
  ["What counts as a finished ad?", "Each ad has its own opening and payoff. Ads within a batch may share approved footage, production elements and a creative direction. Longer explainers run 60–90 seconds. One bounded revision round applies to the batch."],
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
const productMessage = "Hi ScrollSprint, I'd like to discuss a creative test for my product.";
const packageMessage = (name: string) => `Hi ScrollSprint, I'm interested in the ${name} for my product. I'd like to check if it's a fit.`;

function CTA({ href = "#start", children, light = false, className = "" }: { href?: string; children: React.ReactNode; light?: boolean; className?: string }) {
  return <a href={href} className={`ss-button ${light ? "ss-button-light" : "ss-button-dark"} ${className}`}><span>{children}</span><ArrowUpRight size={17} aria-hidden="true" /></a>;
}

export function ScrollSprintSite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const [selectedPackage, setSelectedPackage] = useState("Test Sprint");
  const [product, setProduct] = useState("");
  const [goal, setGoal] = useState("");
  const [platform, setPlatform] = useState("Meta");
  const [briefReady, setBriefReady] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const result = useRef<HTMLDivElement>(null);
  const brief = `SCROLLSPRINT CREATIVE / PROJECT BRIEF\n\nPackage: ${selectedPackage}\nProduct: ${product}\nPrimary platform: ${platform}\nGoal / offer: ${goal}\n\nApproved photos / footage: [add links]\nCurrent ads / learnings: [add links]\nClaims or visuals to avoid: [add details]\n\nPlease review this brief and confirm scope, timing and next steps.`;

  useEffect(() => {
    if (selectedConcept && !dialog.current?.open) dialog.current?.showModal();
  }, [selectedConcept]);
  useEffect(() => {
    if (!menuOpen) return;
    function onKey(event: KeyboardEvent) { if (event.key === "Escape") { setMenuOpen(false); menuButton.current?.focus(); } }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);
  useEffect(() => { if (briefReady) result.current?.focus(); }, [briefReady]);
  function choosePackage(name: string) { setSelectedPackage(name); setBriefReady(false); setCopyStatus(""); }
  function prepareBrief(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setBriefReady(true); setCopyStatus(""); }
  async function copyBrief() {
    try { await navigator.clipboard.writeText(brief); setCopyStatus("Copied. Paste it into our conversation to share your brief."); }
    catch { setCopyStatus("Copy is unavailable here. Select the brief below or download it."); }
  }
  function downloadBrief() {
    const url = URL.createObjectURL(new Blob([brief], {type:"text/plain;charset=utf-8"}));
    const link = document.createElement("a"); link.href = url; link.download = "scrollsprint-creative-brief.txt"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000); setCopyStatus("Brief downloaded. Send the file through our conversation.");
  }

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
          <div className="hero-copy"><div className="eyebrow"><span className="status-dot"/> Short-form ad creative for ecommerce brands</div><h1>More creative<br/>angles for your<br/><em>next ad test.</em></h1><p>ScrollSprint turns what makes your product worth buying into short-form ads worth testing — with stronger hooks, clearer product demos, and fresh creative directions for Meta, TikTok, and YouTube Shorts.</p><div className="hero-actions"><CTA href={whatsappHref(adMessage)}>{whatsappReady ? "Send us your current ad on WhatsApp" : "Prepare your ad brief"}</CTA><a href="#work" className="text-link">Watch the ads <ArrowDown size={16}/></a></div><p className="hero-support">Already running paid ads? Send us your product page or current ad and we’ll suggest where the next creative opportunity may be.</p><div className="hero-footnote"><span>Strategy through final cut</span><span>One-time projects from $99</span></div></div>
          <div className="hero-visual"><div className="art-caption"><span>THE CREATIVE POSSIBILITIES DEPT.</span><span>EST. 2026</span></div><img src="/illustrations/creative-studio.svg" width="640" height="660" alt="Custom studio illustration of a body wash bottle, botanical leaves, an orange ribbon and a director’s clapperboard" fetchPriority="high"/><div className="art-note"><span className="note-arrow" aria-hidden="true">↖</span> One product. A whole lot of angles.</div></div>
        </div>
        <div className="page-width platform-line"><span>Made for the feed.<br/><strong>Built for your next test.</strong></span><div><span>Meta</span><span>TikTok</span><span>YouTube Shorts</span></div><span className="platform-aside">SCROLL LESS.<br/>SEE MORE. <ArrowDown size={14}/></span></div>
      </section>

      <section className="whatsapp-section" aria-labelledby="whatsapp-heading"><div className="page-width whatsapp-grid"><div><span className="eyebrow">A focused first conversation</span><h2 id="whatsapp-heading">Send us the ad you’re<br/><em>currently running.</em></h2><p>We’ll look at your product, current creative, and the opportunity you may be missing. If there’s a fit, we’ll suggest a few directions for your next test.</p></div><div><ol><li><span>01</span>Send your product link or current ad</li><li><span>02</span>Get a focused creative recommendation</li><li><span>03</span>Choose the sprint that fits your testing needs</li></ol><CTA href={whatsappHref(adMessage)}>{whatsappReady ? "Start a WhatsApp conversation" : "Prepare a brief to start"}</CTA></div></div></section>

      <section id="work" className="section-space work-section">
        <div className="page-width">
          <div className="section-topline"><span className="eyebrow">01 / The concept room</span><span className="tiny-note">A LITTLE PRODUCT OBSESSION GOES A LONG WAY.</span></div>
          <div className="section-heading"><h2>Different products.<br/><em>Distinct stories.</em></h2><p>One product can invite multiple testable stories: a problem-first hook, product demo, before-and-after moment, comedy, tension, UGC-style story, comparison, or visual payoff. These seven videos explore different directions.</p></div>
          <div className="concept-grid">
            {concepts.map((item, i) => <article className="concept-card" key={item.brand}>
              <button className={`concept-art tone-${item.color}`} onClick={() => setSelectedConcept(item)} aria-label={`Watch ${item.brand} ${item.kind}`}><div className="concept-art-top"><span>{item.kind.toUpperCase()} {String(i+1).padStart(2,"0")}</span><span>{item.category}</span></div><img src={`/posters/${item.video}.webp`} alt={`Scene from the ${item.brand} video`} width="270" height="480" loading="lazy"/><div className="concept-art-bottom"><span><Film size={13}/> Watch video</span><span className="concept-open"><ArrowUpRight size={19}/></span></div></button>
              <div className="concept-info"><span>{item.brand} · {item.kind}</span><h3><button onClick={() => setSelectedConcept(item)}>{item.title}</button></h3><p>{item.angle}</p></div>
            </article>)}
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

      <section id="pricing" className="section-space pricing-section"><div className="page-width"><div className="section-topline"><span className="eyebrow">04 / Pick your pace</span><span className="tiny-note">ONE PRODUCT. ONE-TIME PAYMENT. DEFINED CREATIVE.</span></div><div className="section-heading"><h2>Choose the amount of<br/><em>creative room you need.</em></h2><p>Start with a focused test or build a larger batch of creative directions for your next paid-social cycle. Every package covers one product, defined deliverables, and one bounded revision round.</p></div>
        <div className="pricing-grid">{packages.map(pack=><article key={pack.name} className={`price-card ${pack.featured ? "price-featured" : ""}`}><div className="price-top"><h3>{pack.name}</h3><span>{pack.tag}</span></div><p className="price-intro">{pack.intro}</p><div className="price-amount">{pack.price}<span>USD / one-time project</span></div><div className="price-stats"><div><strong>{pack.ads}</strong><span>ads up to 30s</span></div><div><strong>{pack.longer}</strong><span>60–90s explainers</span></div></div><ul>{pack.items.map(item=><li key={item}><Check size={15}/><span>{item}</span></li>)}</ul>{pack.name === "Test Sprint" && <p className="package-note">A focused creative testing batch. Captions and sound are included where scoped. No ongoing commitment; media buying and ad spend are separate.</p>}<a href={pack.checkout} onClick={()=>choosePackage(pack.name)} className={`ss-button ${pack.featured ? "ss-button-orange" : "ss-button-outline"}`}><span>Proceed to checkout</span><ArrowUpRight size={17}/></a><a href={whatsappHref(packageMessage(pack.name))} onClick={()=>choosePackage(pack.name)} className="price-whatsapp">{whatsappReady ? "Ask about this sprint on WhatsApp" : "Prepare a brief for this sprint"}<ArrowUpRight size={14}/></a></article>)}</div>
        <div className="retainer-line"><div><strong>Want to check the fit first?</strong><p>Send your product page or current ad. We can suggest a sensible first creative test before you choose a package.</p></div><a href={whatsappHref(adMessage)} className="text-link">{whatsappReady ? "Start on WhatsApp" : "Prepare a brief"} <ArrowUpRight size={17}/></a></div>
      </div></section>

      <section className="section-space faq-section"><div className="page-width faq-grid"><div><span className="eyebrow">05 / Before we get rolling</span><h2>Good questions.<br/><em>Clear answers.</em></h2><p>The details, without the guesswork.</p></div><div className="faq-list">{questions.map(([q,a])=><details key={q}><summary><span>{q}</span><Plus size={20} aria-hidden="true"/></summary><p>{a}</p></details>)}</div></div></section>

      <section id="start" className="start-section section-space"><div className="page-width start-grid"><div className="start-copy"><span className="eyebrow">06 / Your next good move</span><h2>Have a product that needs<br/><em>more ways to be tested?</em></h2><p>Send us your product page or current ad. We’ll help identify a sensible creative starting point and point you toward the sprint that fits.</p><div className="final-actions"><CTA href={whatsappHref(productMessage)}>{whatsappReady ? "Send your product on WhatsApp" : "Prepare your product brief"}</CTA><a href="#pricing" className="text-link">View packages <ArrowUpRight size={17}/></a></div><p className="final-reassurance">No long application. No guaranteed-results promises. Just a focused conversation about the next creative test.</p><div className="brief-promise"><CheckCheck size={22}/><span>One-time project scope.<br/><strong>Clear direction before production.</strong></span></div></div>
          <div className="brief-panel"><div className="brief-panel-head"><span>OPTIONAL CREATIVE BRIEF</span><span>01 / IF YOU HAVE THE DETAILS READY</span></div>
          <form onSubmit={prepareBrief} onChange={()=>{setBriefReady(false);setCopyStatus("");}}>
            <label htmlFor="product">What are we making ads for?<input id="product" name="product" type="url" placeholder="https://yourstore.com/product" value={product} onChange={e=>setProduct(e.target.value)} required autoComplete="url"/></label>
            <div className="brief-fields"><label htmlFor="package">Your starting point<select id="package" value={selectedPackage} onChange={e=>setSelectedPackage(e.target.value)}>{[...packages.map(p=>p.name),"Help me choose"].map(n=><option key={n}>{n}</option>)}</select></label><label htmlFor="platform">Primary platform<select id="platform" value={platform} onChange={e=>setPlatform(e.target.value)}><option>Meta</option><option>TikTok</option><option>YouTube Shorts</option><option>Multiple platforms</option></select></label></div>
            <label htmlFor="goal">What do you want this batch to explore?<textarea id="goal" name="goal" rows={3} placeholder="Your product’s strongest benefit, a new offer, or an angle you want to test…" value={goal} onChange={e=>setGoal(e.target.value)} required minLength={10}/></label>
            <button type="submit" className="ss-button ss-button-dark brief-submit"><span>{briefReady ? "Update my brief" : "Prepare my brief"}</span><ArrowRight size={18}/></button><p className="brief-privacy">Nothing is sent automatically. You review and share the brief.</p>
          </form>
          {briefReady && <div ref={result} tabIndex={-1} className="brief-result"><h3><Check size={18}/> Your brief is ready.</h3><p>Copy or download it, then send it through the channel where we connected.</p><textarea readOnly value={brief} aria-label="Your prepared creative brief" rows={7}/><div className="brief-result-actions"><button type="button" className="ss-button ss-button-dark" onClick={copyBrief}><Copy size={15}/> Copy brief</button><button type="button" className="ss-button ss-button-outline" onClick={downloadBrief}><Download size={15}/> Download</button></div></div>}
          <p role="status" aria-live="polite" className="copy-status">{copyStatus}</p>
          </div></div></section>
    </main>
    <footer className="site-footer"><div className="page-width"><div className="footer-top"><Logo/><p>More ads to test.<br/><em>Less production drag.</em></p><a href="#top" className="back-top" aria-label="Back to top"><ArrowUpRight size={25}/></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} ScrollSprint Creative</span><nav aria-label="Footer navigation"><a href="#work">The work</a><a href="#pricing">Packages</a><a href="#start">Start a brief</a></nav><span>INDEPENDENT BY DESIGN.</span></div></div></footer>
    <dialog ref={dialog} className="concept-dialog" onClose={()=>setSelectedConcept(null)} onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close();}} aria-labelledby="concept-dialog-title">
      {selectedConcept && <><button className="dialog-close" onClick={()=>dialog.current?.close()} aria-label="Close concept"><X size={21}/></button><div className={`dialog-art tone-${selectedConcept.color}`}><video key={selectedConcept.video} controls playsInline preload="none" poster={`/posters/${selectedConcept.video}.webp`} src={`/videos/${selectedConcept.video}.mp4`} aria-label={`${selectedConcept.brand} video`} /><span><Film size={14}/> {selectedConcept.kind}</span></div><div className="dialog-copy"><span className="eyebrow">{selectedConcept.brand} / {selectedConcept.kind}</span><h2 id="concept-dialog-title">{selectedConcept.title}</h2><p className="concept-hook">“{selectedConcept.hook}”</p><ol>{selectedConcept.frames.map((frame,i)=><li key={frame}><span>0{i+1}</span>{frame}</li>)}</ol><div className="dialog-foot"><span>{selectedConcept.format}</span><span>{selectedConcept.kind === "Spec ad" ? "Self-initiated concept" : "Supplied creative reference"}</span></div></div></>}
    </dialog>
  </div>;
}
