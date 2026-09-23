import { cn } from "@/components/utils";
export function Logo({className}:{className?:string}) {
 return <a href="#top" className={cn("brand",className)} aria-label="ScrollSprint Creative home"><svg viewBox="0 0 44 44" width="40" height="40" fill="none" aria-hidden="true"><path d="M33 5H16C8 5 4 11 7 17c2 5 9 7 16 9l6 2c4 2 2 6-2 6H10l-5 6h22c12 0 17-14 6-20l-16-6c-3-1-3-4 1-4h11Z" fill="currentColor"/><path d="m31 3 9 8-12 5 4-6Z" fill="#F16A43"/></svg><span>ScrollSprint<span className="brand-sub">CREATIVE STUDIO</span></span></a>;
}
