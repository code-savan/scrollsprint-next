"use client";

import { useLayoutEffect, useRef, type CSSProperties, type ReactNode, type Ref } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger delay in seconds, mirrors the previous motion transition delay. */
  delay?: number;
};

/**
 * Scroll-triggered fade-up reveal (replaces motion's whileInView).
 * SSR HTML ships fully visible (crawlable, no-JS safe); the hidden state is
 * applied in useLayoutEffect pre-paint, then removed on intersection.
 */
export function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add("reveal-init");
    void el.offsetWidth;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.disconnect();
          }
        }
      },
      { rootMargin: "-100px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <article
      ref={ref as Ref<HTMLElement>}
      className={`${className} reveal`}
      style={{ "--reveal-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </article>
  );
}
