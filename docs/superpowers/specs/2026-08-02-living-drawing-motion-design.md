# Living Drawing Motion Design Specification

## Objective

Turn Subekshya’s existing architecture portfolio into a memorable interactive artifact without weakening clarity, performance, accessibility, or the ability to replace placeholder content. The page should feel like a drawing set becoming spatial: lines establish order, masks reveal material, and movement explains hierarchy.

## Chosen direction

Living Drawing uses one motion language derived from architectural drafting. A continuous datum line, crosshair registration marks, measured delays, and drawing-mask reveals connect the page entrance, navigation, project imagery, and scroll state. The motion is precise rather than playful and never competes with project content.

## Visual system

The existing palette and typography remain unchanged. Motion uses only existing tokens:

- Ink `#161817`
- Paper `#F2F0EA`
- Blueprint `#274C77`
- Signal `#E4572E`
- Display: Cormorant Garamond
- Body: Manrope
- Technical labels: IBM Plex Mono

The signature element is a one-pixel datum line that crosses the opening screen, becomes the site scroll-progress indicator, and reappears as the registration line used for image reveals.

## Entrance sequence

- An accessible presentation layer covers the initial viewport only when JavaScript and motion are available.
- The SK crosshair draws first, followed by the datum line and the label `SUBEKSHYA / PORTFOLIO 2026`.
- The sequence completes within 1.25 seconds and removes itself from pointer and accessibility flow.
- The page remains readable immediately if JavaScript fails.
- Returning within the same browsing session skips the presentation layer.
- Reduced-motion users never see the entrance sequence.

## Hero motion

- The hero thesis reveals line by line through vertical masks.
- The blueprint grid shifts by a small bounded amount based on scroll progress.
- The image and coordinate label move at different restrained rates, creating depth without hiding or distorting information.
- Continuous motion uses `requestAnimationFrame`, updates CSS custom properties, and stops when the hero is outside the viewport.

## Global interaction

- A small drafting reticle follows the pointer on fine-pointer devices. It expands over links, buttons, and project media and displays no sensitive coordinates.
- The native cursor remains available for text inputs and when reduced motion is requested.
- A fixed vertical datum at the right edge reports page progress through a moving marker and section abbreviation.
- Active navigation is still driven by semantic section visibility.

## Project and section motion

- Major images reveal once through a datum-aligned clip mask.
- Text groups use a shallow stagger capped at 240 milliseconds.
- Project images translate no more than two percent on hover and retain their current crosshair response.
- Archive filtering briefly masks the grid, applies the existing category logic, and reveals the result count. Filtering remains immediate for reduced-motion users.
- Section labels gain a line-drawing transition, but body copy does not animate word by word.

## Mobile navigation

- A visible menu button replaces the hidden desktop navigation below 640 pixels.
- The button opens a full-viewport ink panel with indexed links for Work, Archive, Profile, and Contact.
- The panel traps focus, closes with Escape, closes after a link is chosen, restores focus to the menu button, and prevents background scrolling while open.
- The menu remains usable with large touch targets and does not depend on animation.

## Accessibility and failure handling

- `prefers-reduced-motion: reduce` removes the entrance, parallax, cursor reticle, stagger delays, filter mask, and smooth scrolling.
- All content is visible before animation classes are applied.
- The presentation layer is `aria-hidden` and never receives focus.
- The menu button exposes `aria-expanded` and `aria-controls`; the panel uses `aria-hidden` when closed.
- JavaScript failures leave native navigation links, project filters, content, and contact actions visible.
- Touch devices do not receive pointer-following effects.

## Performance constraints

- No animation libraries or build tools.
- Animate only `transform`, `opacity`, and `clip-path`.
- One shared scroll animation frame updates all scroll-linked CSS variables.
- No image canvas processing, video backgrounds, or added network assets.
- The page must retain zero horizontal overflow at 390, 768, and 1440 pixels.

## Verification

- Automated tests verify entrance, datum, reticle, mobile-menu hooks, accessibility attributes, reduced-motion CSS, and filter integration.
- Browser QA covers desktop entrance, archive filter transitions, mobile menu open/close behavior, Escape handling, viewport overflow, console errors, and reduced-motion state.
- GitHub Actions and Pages deployment must pass before public handoff.
