# ScrollSprint: studio redesign

## Audit findings

1. Entry: CTA labels were invisible. Unlayered `a { color: inherit }` overrode Tailwind color utilities. Browser computed the hero CTA foreground and background as white.
2. Concept discovery: letter placeholders provided little information about the actual creative direction. The hero illustration also overlapped its own text.
3. Package selection: identical anchor links discarded which package a visitor selected.
4. Brief: copying empty fields was allowed, failures were silent, and there was no visible review or download step.

## New architecture

Offer → concept room → deliverables → production process → packages → FAQ → brief builder.

The concept room leads with three illustrations. Visitors can reveal all six or open a concept to read its hook and three-part story. Videos retain an explicit coming-soon state.

## Visual direction

Warm ivory, deep green, orange, and botanical pastels. Expressive serif accents complement restrained sans-serif typography. Custom SVG product scenes replace generic letter cards. Original packaging is illustrative, not a claim about the exact branded product. No fabricated client relationships, testimonials or performance metrics.

## Interaction changes

- Explicit foreground/background button tokens and layered reset rules.
- Package choices persist into the brief form.
- Native URL and required-field validation before preparing a brief.
- Review, clipboard feedback, manual selection fallback, and text download.
- Keyboard-operable native concept dialogs and native FAQ disclosure.
- Mobile navigation with expanded state, Escape handling and focus return.
- Visible keyboard focus, skip link and reduced-motion handling.

## Delivery boundary

The form prepares a brief on the visitor's device. It does not pretend to submit to a backend or invent an email address. The visitor shares the result through the existing conversation channel.

## Verification

- TypeScript and production build passed.
- Existing budgets passed: 178.6 KB gzip client JavaScript, 7.7 KB gzip CSS, 46.0 KB prerendered HTML.
- Desktop rendering inspected in Chrome at 1348 px. Responsive iframe widths checked at 360, 390 and 768 px; actual content viewports were 345, 375 and 753 px after scrollbars, with no horizontal overflow.
- The three-line hero was corrected after the first mobile capture and rechecked.
- All primary CTA styles measured at least 4.68:1 text contrast. Dark CTAs measured 11.79:1.
- Mobile navigation opens, exposes expanded state, closes on section selection, and closes with Escape.
- All six concepts expand; the native detail dialog opens and dismisses with Escape on desktop and mobile.
- FAQ disclosure opens correctly.
- Empty briefs are blocked. Starter Test and Scale Pack selections reach the prepared brief.
- Prepared brief receives focus. Clipboard content and downloaded text were verified using sample product details.

These checks do not constitute a full screen-reader audit. The temporary responsive review page is excluded from production.
