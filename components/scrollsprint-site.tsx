"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, ArrowRight, ArrowDown, Check, X, Menu, Plus, Copy, Download, Film, AudioLines, MousePointer2, Scissors, CheckCheck } from "lucide-react";
import { Logo } from "@/components/logo";

const concepts = [
  { brand: "PrePaw", title: "The hair has to go somewhere.", category: "Product demo", color: "sage", image: "pet-care", hook: "What if grooming day ended with less cleanup?", angle: "The everyday mess", frames: ["Open on the grooming mess people recognize.", "Show the product capturing loose hair during use.", "Close on the clean result and one direct next step."], format: "20–30 seconds · 9:16" },
  { brand: "Automotive detailing", title: "One panel. One pass.", category: "Product demo", color: "blue", image: "auto-care", hook: "Give one panel the attention it deserves.", angle: "Show the transformation", frames: ["Start close on the surface and its visible condition.", "Follow one deliberate product application.", "Reveal the same panel in the same light."], format: "15–25 seconds · 9:16" },
  { brand: "Dēpology", title: "Your routine has a night shift.", category: "Lifestyle", color: "rose", image: "skincare", hook: "The last step before you switch off.", angle: "A familiar ritual", frames: ["Set the scene with an evening skincare ritual.", "Bring the product, texture and application into focus.", "Finish with a simple routine-led call to action."], format: "20–30 seconds · 9:16" },
  { brand: "Furbo", title: "The 2:17 PM check-in.", category: "Story-led", color: "sand", image: "pet-tech", hook: "A little reassurance in the middle of your day.", angle: "An everyday moment", frames: ["Open with a pet owner checking in during their day.", "Demonstrate the approved camera interaction.", "Return to the person, reassured and ready to carry on."], format: "20–30 seconds · 9:16" },
  { brand: "ZeoFill", title: "Looks clean. Smells clean?", category: "Product demo", color: "sage", image: "home-care", hook: "Some outdoor messes are harder to see.", angle: "An overlooked problem", frames: ["Introduce the outdoor pet area and the problem.", "Show the product application clearly.", "Explain its intended use with brand-approved claims."], format: "20–30 seconds · 9:16" },
  { brand: "Hyperice", title: "The routine doesn’t end here.", category: "Lifestyle", color: "lavender", image: "recovery", hook: "Your post-workout routine deserves a moment too.", angle: "Beyond the workout", frames: ["Start at the end of a recognizable workout.", "Focus on the product and how it is used.", "Make recovery part of the closing routine."], format: "20–30 seconds · 9:16" },
];
type Concept = typeof concepts[number];
const packages = [
  { name: "Starter Test", price: "$397", intro: "Find your first direction.", ads: "2", hooks: "3", items: ["One product, one core angle", "9:16 vertical delivery", "Captions + sound design", "One revision round"] },
  { name: "Creative Sprint", price: "$897", intro: "Give your next test more to work with.", ads: "5", hooks: "10", items: ["Two creative angles", "Voiceover, captions + sound", "Testing-ready variations", "One revision round", "72-hour target after brief approval"], featured: true },
  { name: "Scale Pack", price: "$1,497", intro: "Keep your creative queue moving.", ads: "10", hooks: "20", items: ["Three creative angles", "UGC-style + product concepts", "Multiple calls to action", "Testing recommendations", "Priority production"] },
];
const questions = [
  ["What do you need to get started?", "Your product link, approved product photos or footage, brand guidelines, and any existing ads or learnings. We agree on the scope and creative direction before production."],
  ["Do we need to ship a product?", "Not always. We often work with approved product imagery, existing footage and generated production. We will flag any concept requiring a physical shoot before you commit."],
  ["How does the 72-hour turnaround work?", "It is a production target for the Creative Sprint package, starting after the brief is approved and all required assets are received. We confirm the delivery date before production. Revisions and complex requests may need additional time."],
  ["Are these concepts commissioned client work?", "These are self-initiated concept campaigns. The illustrations show the creative direction while the videos are in production. They do not imply a client relationship or endorsement."],
  ["Do you run the ads or guarantee results?", "Our packages cover creative production. Your team handles media buying. Results depend on your offer, audience, landing page and campaign execution. We do not guarantee ROAS, CPA or revenue."],
  ["What do we receive?", "Finished videos, the hook variations in your package, captions and sound design, plus an organized delivery for your team. The primary format is 9:16 for Meta, TikTok and YouTube Shorts. Additional formats are scoped separately."],
];

function CTA({ href = "#start", children, light = false, className = "" }: { href?: string; children: React.ReactNode; light?: boolean; className?: string }) {
  return <a href={href} className={`ss-button ${light ? "ss-button-light" : "ss-button-dark"} ${className}`}><span>{children}</span><ArrowUpRight size={17} aria-hidden="true" /></a>;
}

export function ScrollSprintSite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const [selectedPackage, setSelectedPackage] = useState("Creative Sprint");
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
        <div className="header-actions"><CTA className="header-cta">Let’s make a move</CTA><button ref={menuButton} className="menu-toggle" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22}/> : <Menu size={22}/>}</button></div>
      </div>
      {menuOpen && <nav id="mobile-menu" aria-label="Mobile navigation" className="mobile-nav"><a href="#work" onClick={() => setMenuOpen(false)}>The work <ArrowUpRight size={20}/></a><a href="#approach" onClick={() => setMenuOpen(false)}>Our approach <ArrowUpRight size={20}/></a><a href="#pricing" onClick={() => setMenuOpen(false)}>Packages <ArrowUpRight size={20}/></a><a href="#start" onClick={() => setMenuOpen(false)}>Start a brief <ArrowUpRight size={20}/></a></nav>}
    </header>
    <main id="main">
      <section id="top" className="hero-section">
        <div className="page-width hero-grid">
          <div className="hero-copy"><div className="eyebrow"><span className="status-dot"/> Independent ecommerce creative studio</div><h1>Good product.<br/>Great story.<br/><em>Next ad.</em></h1><p>We turn what makes your product worth buying into video ads worth testing. Fresh hooks. Clear demos. More ways in.</p><div className="hero-actions"><CTA>Build your creative sprint</CTA><a href="#work" className="text-link">Explore the concepts <ArrowDown size={16}/></a></div><div className="hero-footnote"><span>Strategy through final cut</span><span>Packages from $397</span></div></div>
          <div className="hero-visual"><div className="art-caption"><span>THE CREATIVE POSSIBILITIES DEPT.</span><span>EST. 2026</span></div><img src="/illustrations/creative-studio.svg" width="640" height="660" alt="Custom studio illustration of a body wash bottle, botanical leaves, an orange ribbon and a director’s clapperboard" fetchPriority="high"/><div className="art-note"><span className="note-arrow" aria-hidden="true">↖</span> One product. A whole lot of angles.</div></div>
        </div>
        <div className="page-width platform-line"><span>Made for the feed.<br/><strong>Built for your next test.</strong></span><div><span>Meta</span><span>TikTok</span><span>YouTube Shorts</span></div><span className="platform-aside">SCROLL LESS.<br/>SEE MORE. <ArrowDown size={14}/></span></div>
      </section>

      <section id="work" className="section-space work-section">
        <div className="page-width">
          <div className="section-topline"><span className="eyebrow">01 / The concept room</span><span className="tiny-note">A LITTLE PRODUCT OBSESSION GOES A LONG WAY.</span></div>
          <div className="section-heading"><h2>Different products.<br/><em>Distinct possibilities.</em></h2><p>A glimpse into the ideas we’re developing. Explore the opening hook, the story and the product moment behind each concept.</p></div>
          <div className="concept-grid">
            {(showAll ? concepts : concepts.slice(0,3)).map((item, i) => <article className="concept-card" key={item.brand}>
              <button className={`concept-art tone-${item.color}`} onClick={() => setSelectedConcept(item)} aria-label={`Explore ${item.brand} concept`}><div className="concept-art-top"><span>CONCEPT {String(i+1).padStart(2,"0")}</span><span>{item.category}</span></div><img src={`/illustrations/${item.image}.svg`} alt={`Original ${item.category.toLowerCase()} illustration for the ${item.brand} concept`} width="600" height="480" loading="lazy"/><div className="concept-art-bottom"><span><Film size={13}/> Video coming soon</span><span className="concept-open"><ArrowUpRight size={19}/></span></div></button>
              <div className="concept-info"><span>{item.brand}</span><h3><button onClick={() => setSelectedConcept(item)}>{item.title}</button></h3><p>{item.angle}</p></div>
            </article>)}
          </div>
          <div className="work-bottom"><p>Self-initiated concept campaigns. Illustrations show creative direction, not final product renders or commissioned work.</p><button className="text-link" aria-expanded={showAll} onClick={() => setShowAll(!showAll)}>{showAll ? "Show featured concepts" : "Explore all six concepts"} {showAll ? <ArrowRight size={16}/> : <Plus size={16}/>}</button></div>
        </div>
      </section>

      <section id="services" className="promise-section section-space">
        <div className="page-width promise-grid"><div><span className="eyebrow">02 / More room to test</span><h2>A great product<br/>has more than<br/><em>one good story.</em></h2><p>Your next creative batch should give your team something new to learn. We build around the product, the buying moment and the reason to care.</p><a href="#pricing" className="text-link">Find your starting point <ArrowUpRight size={17}/></a></div>
          <div className="deliverables"><div className="deliverable"><span className="drawn-index">01</span><div><h3>A reason to stop</h3><p>Openings built around a recognizable problem, an unexpected detail or a compelling product moment.</p><span className="deliverable-tag">HOOKS + CREATIVE ANGLES</span></div><MousePointer2 size={24}/></div><div className="deliverable"><span className="drawn-index">02</span><div><h3>A product to believe in</h3><p>Clear demonstrations and thoughtful stories showing what the product does and where it fits.</p><span className="deliverable-tag">PRODUCT DEMOS + UGC-STYLE</span></div><Film size={24}/></div><div className="deliverable"><span className="drawn-index">03</span><div><h3>More ways to find the fit</h3><p>Finished cuts, opening variations, captions and sound, organized for the next round of testing.</p><span className="deliverable-tag">EDITING + VARIATIONS + SOUND</span></div><Scissors size={24}/></div></div>
        </div>
      </section>

      <section id="approach" className="section-space approach-section">
        <div className="page-width"><div className="section-topline"><span className="eyebrow">03 / Small team. Clear process.</span><span className="tiny-note">FROM YOUR PRODUCT PAGE TO THE PAID-SOCIAL QUEUE.</span></div><div className="section-heading"><h2>Less back-and-forth.<br/><em>More forward motion.</em></h2><p>You bring the product knowledge. We connect the strategy, production and edit into one focused sprint.</p></div>
          <div className="process-grid">{[
            ["01", "Get the product.", "Your product link, assets, current ads and learnings. We agree on the brief and what the batch needs to explore.", "A focused brief"],
            ["02", "Find the story.", "We map the hooks, buying moments and product demonstrations. The creative direction gets approved before production.", "A clear creative direction"],
            ["03", "Make the move.", "Production, editing, voiceover, captions and sound come together. Your revision round helps refine the final batch.", "Finished creative + variations"],
            ["04", "Test. Learn. Repeat.", "Your team launches the ads. Share the results and the next sprint builds on what you learn.", "A smarter next batch"],
          ].map(([num,title,body,output])=><div className="process-step" key={num}><div className="process-number">{num}<ArrowUpRight size={20}/></div><h3>{title}</h3><p>{body}</p><div className="process-output"><Check size={14}/>{output}</div></div>)}</div>
          <div className="delivery-strip"><AudioLines size={22}/><p>Every detail earns its place. <span>Hook. Product. Voice. Cut. Caption. CTA.</span></p><span>READY FOR YOUR NEXT TEST</span></div>
        </div>
      </section>

      <section id="pricing" className="section-space pricing-section"><div className="page-width"><div className="section-topline"><span className="eyebrow">04 / Pick your pace</span><span className="tiny-note">DEFINED SCOPE. ONE CREATIVE BATCH.</span></div><div className="section-heading"><h2>Start with a sprint.<br/><em>See where it takes you.</em></h2><p>A first experiment or a fuller queue. Choose the batch your team is ready to put into market.</p></div>
        <div className="pricing-grid">{packages.map(pack=><article key={pack.name} className={`price-card ${pack.featured ? "price-featured" : ""}`}><div className="price-top"><h3>{pack.name}</h3>{pack.featured && <span>THE CORE SPRINT</span>}</div><p className="price-intro">{pack.intro}</p><div className="price-amount">{pack.price}<span>USD / project</span></div><div className="price-stats"><div><strong>{pack.ads}</strong><span>finished ads</span></div><div><strong>{pack.hooks}</strong><span>hook variations</span></div></div><ul>{pack.items.map(item=><li key={item}><Check size={15}/><span>{item}</span></li>)}</ul><a href="#start" onClick={()=>choosePackage(pack.name)} className={`ss-button ${pack.featured ? "ss-button-orange" : "ss-button-outline"}`}><span>Choose {pack.name}</span><ArrowUpRight size={17}/></a></article>)}</div>
        <div className="retainer-line"><div><strong>Already thinking about the next batch?</strong><p>Monthly creative partnerships start at $2,000. Scope follows your testing cadence.</p></div><a href="#start" onClick={()=>choosePackage("Monthly partnership")} className="text-link">Plan an ongoing partnership <ArrowUpRight size={17}/></a></div>
      </div></section>

      <section className="section-space faq-section"><div className="page-width faq-grid"><div><span className="eyebrow">05 / Before we get rolling</span><h2>Good questions.<br/><em>Clear answers.</em></h2><p>The details, without the guesswork.</p></div><div className="faq-list">{questions.map(([q,a])=><details key={q}><summary><span>{q}</span><Plus size={20} aria-hidden="true"/></summary><p>{a}</p></details>)}</div></div></section>

      <section id="start" className="start-section section-space"><div className="page-width start-grid"><div className="start-copy"><span className="eyebrow">06 / Your next good move</span><h2>Bring the product.<br/>We’ll bring<br/><em>the possibilities.</em></h2><p>A few details give us a better starting point. Prepare your brief, then share it in our conversation so we can confirm the scope and next steps.</p><div className="brief-promise"><CheckCheck size={22}/><span>No payment here.<br/><strong>Start with a clear conversation.</strong></span></div></div>
          <div className="brief-panel"><div className="brief-panel-head"><span>YOUR CREATIVE BRIEF</span><span>01 / LET’S START HERE</span></div>
          <form onSubmit={prepareBrief} onChange={()=>{setBriefReady(false);setCopyStatus("");}}>
            <label htmlFor="product">What are we making ads for?<input id="product" name="product" type="url" placeholder="https://yourstore.com/product" value={product} onChange={e=>setProduct(e.target.value)} required autoComplete="url"/></label>
            <div className="brief-fields"><label htmlFor="package">Your starting point<select id="package" value={selectedPackage} onChange={e=>setSelectedPackage(e.target.value)}>{[...packages.map(p=>p.name),"Monthly partnership","Help me choose"].map(n=><option key={n}>{n}</option>)}</select></label><label htmlFor="platform">Primary platform<select id="platform" value={platform} onChange={e=>setPlatform(e.target.value)}><option>Meta</option><option>TikTok</option><option>YouTube Shorts</option><option>Multiple platforms</option></select></label></div>
            <label htmlFor="goal">What do you want this batch to explore?<textarea id="goal" name="goal" rows={3} placeholder="Your product’s strongest benefit, a new offer, or an angle you want to test…" value={goal} onChange={e=>setGoal(e.target.value)} required minLength={10}/></label>
            <button type="submit" className="ss-button ss-button-dark brief-submit"><span>{briefReady ? "Update my brief" : "Prepare my brief"}</span><ArrowRight size={18}/></button><p className="brief-privacy">Nothing is sent automatically. You review and share the brief.</p>
          </form>
          {briefReady && <div ref={result} tabIndex={-1} className="brief-result"><h3><Check size={18}/> Your brief is ready.</h3><p>Copy or download it, then send it through the channel where we connected.</p><textarea readOnly value={brief} aria-label="Your prepared creative brief" rows={7}/><div className="brief-result-actions"><button type="button" className="ss-button ss-button-dark" onClick={copyBrief}><Copy size={15}/> Copy brief</button><button type="button" className="ss-button ss-button-outline" onClick={downloadBrief}><Download size={15}/> Download</button></div></div>}
          <p role="status" aria-live="polite" className="copy-status">{copyStatus}</p>
          </div></div></section>
    </main>
    <footer className="site-footer"><div className="page-width"><div className="footer-top"><Logo/><p>More ads to test.<br/><em>Less production drag.</em></p><a href="#top" className="back-top" aria-label="Back to top"><ArrowUpRight size={25}/></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} ScrollSprint Creative</span><nav aria-label="Footer navigation"><a href="#work">The work</a><a href="#pricing">Packages</a><a href="#start">Start a brief</a></nav><span>INDEPENDENT BY DESIGN.</span></div></div></footer>
    <dialog ref={dialog} className="concept-dialog" onClose={()=>setSelectedConcept(null)} onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close();}} aria-labelledby="concept-dialog-title">
      {selectedConcept && <><button className="dialog-close" onClick={()=>dialog.current?.close()} aria-label="Close concept"><X size={21}/></button><div className={`dialog-art tone-${selectedConcept.color}`}><img src={`/illustrations/${selectedConcept.image}.svg`} width="600" height="480" alt={`${selectedConcept.brand} concept illustration`}/><span><Film size={14}/> Video coming soon</span></div><div className="dialog-copy"><span className="eyebrow">{selectedConcept.brand} / Spec creative</span><h2 id="concept-dialog-title">{selectedConcept.title}</h2><p className="concept-hook">“{selectedConcept.hook}”</p><ol>{selectedConcept.frames.map((frame,i)=><li key={frame}><span>0{i+1}</span>{frame}</li>)}</ol><div className="dialog-foot"><span>{selectedConcept.format}</span><span>Self-initiated concept</span></div></div></>}
    </dialog>
  </div>;
}
