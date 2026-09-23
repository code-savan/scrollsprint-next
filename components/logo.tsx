import { cn } from "@/components/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <a href="#top" className={cn("group inline-flex items-center gap-3", className)} aria-label="ScrollSprint Creative home">
      <span className="relative grid size-9 place-items-center overflow-hidden rounded-[10px] border border-black/10 bg-[#dfff3f] shadow-[0_8px_30px_rgba(223,255,63,.18)]">
        <svg viewBox="0 0 36 36" className="size-7" aria-hidden="true">
          <path d="M7 9.5h19.5L16.2 17H7z" fill="currentColor" />
          <path d="M29 26.5H9.5L19.8 19H29z" fill="currentColor" />
          <path d="M25.8 9.5 15.2 26.5h-5L20.8 9.5z" fill="currentColor" opacity=".18" />
        </svg>
      </span>
      <span className="font-semibold tracking-[-0.03em] text-[15px] leading-none">
        ScrollSprint<span className="font-normal text-black/45"> Creative</span>
      </span>
    </a>
  );
}
