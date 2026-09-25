"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, Copy, MessageCircle, Mail } from "lucide-react";

const categories = [
  { value: "Beauty & grooming", description: "Hair, skin, tools and everyday routines" },
  { value: "Wellness", description: "Products people need to see in use" },
  { value: "Home & lifestyle", description: "Show the problem and the payoff" },
  { value: "Pets", description: "The moments owners recognize" },
  { value: "Something else", description: "Tell us about it at the end" },
];
const goals = [
  { value: "New hooks", description: "Give the first seconds more ways in" },
  { value: "Clearer product demo", description: "Show what the product does" },
  { value: "Fresh variations", description: "Add angles to an active test" },
  { value: "Longer explanation", description: "Make the use and benefit easier to follow" },
];
const packages = ["Trial Ad", "Test Sprint", "Growth Sprint", "Scale Batch", "Help me choose"];
type Channel = "whatsapp" | "email" | "copy";

export function ContactFlow({ initialPackage, whatsappHref, whatsappReady }: {
  initialPackage: string;
  whatsappHref: (message: string) => string;
  whatsappReady: boolean;
}) {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState("");
  const [goal, setGoal] = useState("");
  const [packageName, setPackageName] = useState(initialPackage);
  const [channel, setChannel] = useState<Channel | "">("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [website, setWebsite] = useState("");
  const [emailReady, setEmailReady] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const [done, setDone] = useState(false);
  const [requestId, setRequestId] = useState("");

  useEffect(() => { setPackageName(initialPackage); }, [initialPackage]);
  useEffect(() => {
    let active = true;
    fetch("/api/contact", { cache: "no-store" })
      .then(response => response.json())
      .then(data => { if (active) setEmailReady(data.emailReady === true); })
      .catch(() => { if (active) setEmailReady(false); });
    return () => { active = false; };
  }, []);

  const summary = useMemo(() => [
    "Hi ScrollSprint, I'd like to discuss creative for my product.",
    `Name: ${name.trim()}`,
    `Phone: ${phone.trim()}`,
    `Niche: ${category}`,
    `Creative need: ${goal}`,
    `Sprint: ${packageName}`,
    productUrl.trim() ? `Product page: ${productUrl.trim()}` : "Product page: I can share it in our conversation",
  ].join("\n"), [category, goal, packageName, name, phone, productUrl]);

  function choose(value: string) {
    if (step === 0) setCategory(value);
    if (step === 1) setGoal(value);
    if (step === 2) setPackageName(value);
    if (step === 3) setChannel(value as Channel);
    setStatus("");
    setStep(current => Math.min(current + 1, 4));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending || !channel) return;
    setStatus("");
    if (channel === "whatsapp") {
      const href = whatsappHref(summary);
      if (href === "#start") { setStatus("WhatsApp is not connected yet. Choose another route."); return; }
      window.location.assign(href);
      setDone(true);
      return;
    }
    if (channel === "copy") {
      try { await navigator.clipboard.writeText(summary); }
      catch { setStatus("Select the summary below to copy it manually."); }
      setDone(true);
      return;
    }
    if (!emailReady) { setStatus("Email is not connected yet. Go back and choose another route."); return; }
    setSending(true);
    try {
      const id = requestId || crypto.randomUUID();
      if (!requestId) setRequestId(id);
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, goal, packageName, channel, name, phone, email, productUrl, website, requestId: id }),
      });
      const data = await response.json();
      if (!response.ok) { setStatus(data.message || "The message did not send. Please try again."); return; }
      setDone(true);
    } catch { setStatus("The message did not send. Check your connection and try again."); }
    finally { setSending(false); }
  }

  const steps = ["Product", "Creative need", "Sprint", "Contact route", "Your details"];
  const choices = step === 0 ? categories : step === 1 ? goals : step === 2
    ? packages.map(value => ({ value, description: value === "Help me choose" ? "We’ll recommend a starting point" : "One product, one focused scope" }))
    : [
      { value: "whatsapp", description: whatsappReady ? "Your message opens in WhatsApp for you to send" : "Available when our WhatsApp number is connected" },
      { value: "email", description: emailReady ? "We send your details directly to ScrollSprint" : "Available when email delivery is connected" },
      ...(!whatsappReady && !emailReady ? [{ value: "copy", description: "Keep a copy while contact routes are connected" }] : []),
    ];

  return <div className="brief-panel contact-panel">
    <div className="brief-panel-head"><span>FIND YOUR STARTING POINT</span><span>{done ? "ALL SET" : `${String(step + 1).padStart(2, "0")} / 05`}</span></div>
    {done ? <div className="contact-done" role="status">
      <span className="contact-done-icon"><Check size={22}/></span>
      <h3>{channel === "email" ? "Your message is on its way." : channel === "whatsapp" ? "Finish in WhatsApp." : "Your summary is ready."}</h3>
      <p>{channel === "email" ? "We’ve received your request and will review your product and creative need." : channel === "whatsapp" ? "Press send in WhatsApp to start the conversation." : "Paste this into a conversation with us."}</p>
      {channel === "copy" && <textarea value={summary} readOnly rows={9} aria-label="Your creative summary"/>}
      <button type="button" className="text-link" onClick={() => { setDone(false); setStep(0); setRequestId(""); }}>Start again <ArrowRight size={16}/></button>
    </div> : <>
      <div className="contact-progress" aria-label={`Step ${step + 1} of five`}><span style={{width:`${(step + 1) * 20}%`}}/></div>
      <div className="contact-stage" key={step}>
        <span className="contact-step-label">{steps[step]}</span>
        <h3>{["What do you sell?", "What should the next ad improve?", "How much creative room do you need?", "How should we continue?", "Who are we speaking with?"][step]}</h3>
        {step < 4 ? <div className="contact-choices">{choices.map(item => {
          const disabled = step === 3 && ((item.value === "whatsapp" && !whatsappReady) || (item.value === "email" && !emailReady));
          return <button type="button" key={item.value} className="contact-choice" onClick={() => choose(item.value)} disabled={disabled} aria-disabled={disabled}>
            <span>{step === 3 && item.value === "whatsapp" && <MessageCircle size={17}/>}{step === 3 && item.value === "email" && <Mail size={17}/>}{step === 3 && item.value === "copy" && <Copy size={17}/>}{item.value}<small>{item.description}</small></span><ArrowRight size={17}/>
          </button>;
        })}</div> : <form className="contact-details" onSubmit={submit}>
          <p>{channel === "whatsapp" ? "We’ll open WhatsApp with your answers ready. You choose when to send." : channel === "email" ? "We’ll email your answers to ScrollSprint as soon as you submit." : "We’ll prepare a copy of your answers for you."}</p>
          <label htmlFor="contact-name">Your name<input id="contact-name" autoComplete="name" value={name} onChange={event=>setName(event.target.value)} required maxLength={100} placeholder="Your name"/></label>
          <label htmlFor="contact-phone">Phone number<input id="contact-phone" autoComplete="tel" type="tel" value={phone} onChange={event=>setPhone(event.target.value)} required minLength={7} maxLength={25} pattern="[+0-9 ()-]{7,25}" placeholder="+1 555 123 4567"/></label>
          {channel === "email" && <label htmlFor="contact-email">Email for our reply<input id="contact-email" autoComplete="email" type="email" value={email} onChange={event=>setEmail(event.target.value)} required maxLength={254} placeholder="you@brand.com"/></label>}
          <label htmlFor="contact-url">Product page <span>(optional)</span><input id="contact-url" type="url" value={productUrl} onChange={event=>setProductUrl(event.target.value)} maxLength={500} placeholder="https://yourstore.com/product"/></label>
          <label className="contact-honeypot" htmlFor="contact-website" aria-hidden="true">Leave this field empty<input id="contact-website" type="text" value={website} onChange={event=>setWebsite(event.target.value)} tabIndex={-1} autoComplete="off"/></label>
          <button className="ss-button ss-button-dark" type="submit" disabled={sending}><span>{sending ? "Sending…" : channel === "email" ? "Send my request" : channel === "whatsapp" ? "Continue to WhatsApp" : "Copy my summary"}</span><ArrowRight size={17}/></button>
          {status && <p className="contact-error" role="alert">{status}</p>}
          <small>{channel === "email" ? "Your contact details go to ScrollSprint. We use them to reply about your request." : "Nothing is sent until you choose to send it."}</small>
        </form>}
      </div>
      {step > 0 && <button type="button" className="contact-back" onClick={() => { setStep(step - 1); setStatus(""); }}><ArrowLeft size={15}/> Back</button>}
    </>}
  </div>;
}
