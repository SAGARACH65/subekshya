# Subekshya Architecture Portfolio — Design Specification

## Purpose

Create a memorable one-page portfolio for Subekshya, an architecture student seeking internships. The page must help an architecture practice understand her design sensibility quickly, inspect three placeholder case studies, and find a direct contact action. All placeholder work must be clearly labeled so it cannot be mistaken for real academic or professional work.

## Visual direction: Drawn in Light

The design borrows from the working language of architecture rather than generic portfolio templates: tracing-paper translucency, survey coordinates, plan-grid alignments, drawing captions, and material-led photography. It should feel like a compact exhibition sheet translated to the browser.

### Tokens

- Paper: `#F2F0EA`
- Ink: `#161817`
- Blueprint: `#274C77`
- Signal: `#E4572E`
- Concrete: `#A7A9A3`
- White: `#FCFCF8`
- Display type: Cormorant Garamond, with Georgia fallback
- Body type: Manrope, with Arial fallback
- Utility type: IBM Plex Mono, with monospace fallback

### Signature element

A fine coordinate crosshair follows the pointer only over project imagery. On touch devices it becomes a fixed framing mark. The effect evokes site surveying and drawing registration without interfering with content.

## Information architecture

1. Sticky wordmark and compact navigation.
2. Hero thesis with role, availability, and a generated fictional concept image.
3. Short profile statement and capabilities.
4. Three fictional case-study previews with distinct program, location, year, and concept copy.
5. Process strip covering observation, drawing, making, and iteration.
6. About/contact section with placeholder email and résumé action marked for replacement.
7. Minimal footer with the portfolio status and current year.

## Content rules

- Use the spelling `Subekshya` throughout.
- Label the collection `Concept studies — placeholder work` near the first project and repeat `Placeholder concept` on each project.
- Avoid invented university names, awards, work history, software proficiency, or personal biography.
- Use `hello@subekshya.com.np` as a visibly marked placeholder email.
- Include a prominent note explaining that project imagery and text will be replaced with Subekshya’s own work.

## Interaction and motion

- A restrained page-load sequence introduces the wordmark, thesis, and hero image.
- Project images reveal through a single clip-path transition when they enter the viewport.
- The coordinate crosshair responds to pointer position inside project media.
- Navigation links use native anchors and smooth scrolling only when reduced motion is not requested.
- A compact mobile menu remains usable without JavaScript because navigation links stay present and wrap.

## Responsive behavior

- Desktop: 12-column grid, asymmetric hero, alternating project layouts.
- Tablet: 8-column grid, reduced display scale, stacked project information.
- Mobile: single-column reading order, edge-to-edge imagery, large tap targets, no pointer-following effect.

## Accessibility and performance

- Semantic landmarks, descriptive headings, meaningful image alternative text, visible focus states, and adequate contrast.
- Respect `prefers-reduced-motion` and avoid motion-dependent information.
- Use locally stored WebP images with explicit width and height, lazy loading below the fold, and no JavaScript framework.
- The website remains useful if JavaScript fails.

## Hosting

The site is a dependency-free static build suitable for GitHub Pages. The repository should be named `subekshya`; the initial public address will be `https://sagarach65.github.io/subekshya/`. A custom `.np` domain can be attached later without rebuilding the site.

## Verification

- Automated structural tests verify essential sections, placeholder disclosures, local assets, responsive CSS, focus styling, and reduced-motion handling.
- Browser review at desktop and mobile widths checks composition, clipping, overflow, keyboard navigation, and console errors.
- All internal navigation and asset requests must resolve successfully.
