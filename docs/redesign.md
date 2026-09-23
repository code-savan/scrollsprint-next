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

TypeScript, production build and existing performance budgets pass. Browser checks are recorded after preview verification.
