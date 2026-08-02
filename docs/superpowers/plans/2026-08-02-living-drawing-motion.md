# Living Drawing Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn Subekshya’s portfolio into a refined, architecture-led “living drawing” experience with a short drafting intro, expressive but restrained scroll motion, an architectural pointer reticle, and an accessible mobile navigation system.

**Architecture:** Keep the existing static HTML/CSS/JavaScript architecture and progressive enhancement model. Semantic `data-*` hooks in `index.html` expose motion targets; `styles.css` owns all visual states and compositor-friendly transitions; named initialization functions in `script.js` coordinate behavior and immediately opt out when reduced motion is requested. The page remains readable and navigable if JavaScript fails.

**Tech Stack:** Semantic HTML5, modern CSS, vanilla JavaScript, Node’s built-in test runner, GitHub Pages.

## Global Constraints

- Do not add a framework, animation library, package dependency, build step, or remote image dependency.
- Animate only `transform`, `opacity`, and `clip-path`; scroll handlers must schedule work through `requestAnimationFrame`.
- The intro must finish within 1.25 seconds, run once per browser session, and never hide primary content when JavaScript fails.
- `prefers-reduced-motion: reduce` must skip the intro, reticle, parallax, masking, and staggered transitions.
- The mobile menu must support Escape, focus trapping, focus restoration, accurate ARIA state, and body scroll locking.
- Preserve the six honest placeholder projects and all current profile/CV placeholders.

---

### Task 1: Lock the interaction contract with failing tests

**Files:**
- Modify: `tests/site.test.mjs`
- Modify: `tests/interaction.test.mjs`

- [ ] Add a site-structure test requiring the intro, datum, reticle, hero motion, and mobile-menu hooks.

```js
test('page exposes the living drawing and mobile navigation structures', async () => {
  const html = await readFile(resolve(root, 'index.html'), 'utf8');

  for (const hook of [
    'data-intro', 'data-intro-line', 'data-reticle', 'data-datum',
    'data-datum-label', 'data-hero', 'data-parallax', 'data-menu-toggle',
    'id="mobile-menu"', 'data-mobile-menu', 'aria-controls="mobile-menu"'
  ]) assert.ok(html.includes(hook), `missing interaction hook: ${hook}`);
});
```

- [ ] Expand the CSS contract test to require menu, intro, reticle, datum, and reduced-motion states.

```js
for (const pattern of [
  /\.intro\b/, /\.menu-toggle\b/, /body\.menu-open/,
  /\.drafting-reticle\b/, /\.page-datum\b/,
  /prefers-reduced-motion:\s*reduce/
]) assert.match(css, pattern);
```

- [ ] Replace the single progressive-enhancement assertion with named behavior contracts.

```js
for (const initializer of [
  'initIntro', 'initReveals', 'initMobileMenu', 'initPointerReticle',
  'initScrollMotion', 'initSectionNavigation', 'initArchiveFilter'
]) assert.match(script, new RegExp(`function\\s+${initializer}|const\\s+${initializer}`));

assert.match(script, /requestAnimationFrame/);
assert.match(script, /sessionStorage/);
assert.match(script, /event\.key\s*===\s*['"]Escape['"]/);
assert.match(script, /event\.key\s*!==\s*['"]Tab['"]/);
```

- [ ] Run the tests and confirm the new assertions fail for the missing interaction system.

Run: `/Users/sagaracharya/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test`

Expected: FAIL with missing `data-intro`, `.drafting-reticle`, and `initMobileMenu` contracts.

### Task 2: Add semantic motion and navigation scaffolding

**Files:**
- Modify: `index.html`
- Modify: `styles.css`

- [ ] Add an inert intro overlay immediately after the skip link. It remains hidden unless JavaScript adds `.motion-ready`.

```html
<div class="intro" data-intro aria-hidden="true">
  <div class="intro-mark"><span>S</span><span>K</span></div>
  <span class="intro-line" data-intro-line></span>
  <p>Subekshya / Portfolio 2026</p>
</div>
```

- [ ] Add a real menu toggle in the header and a full-screen menu panel after the header.

```html
<button class="menu-toggle" type="button" data-menu-toggle aria-expanded="false" aria-controls="mobile-menu">
  <span>Menu</span><i aria-hidden="true"></i>
</button>
<nav class="mobile-menu" id="mobile-menu" data-mobile-menu aria-label="Mobile navigation" aria-hidden="true">
  <a href="#work"><span>01</span>Work</a>
  <a href="#archive"><span>02</span>Archive</a>
  <a href="#profile"><span>03</span>Profile</a>
  <a href="#contact"><span>04</span>Contact</a>
</nav>
```

- [ ] Add decorative global datum/progress and pointer-reticle elements before the page script.

```html
<aside class="page-datum" data-datum aria-hidden="true"><span data-datum-label>Top</span><i></i></aside>
<div class="drafting-reticle" data-reticle aria-hidden="true"><i></i><i></i><span></span></div>
```

- [ ] Add `data-hero`, `data-parallax`, and line-mask hooks to the hero without duplicating visible heading text.

- [ ] Add the full CSS state system: intro drawing/leaving states, menu panel and toggle states, datum progress, reticle hover state, hero masks, image wipes, archive-filter mask, and `.motion-ready`/`.intro-complete` progressive-enhancement states.

- [ ] Ensure the non-JavaScript mobile fallback keeps `.nav` visible; hide it only under `.menu-ready` at widths below 960px.

- [ ] Run the site tests and confirm the HTML/CSS contract is green while JavaScript initializer tests remain red.

Run: `/Users/sagaracharya/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/site.test.mjs`

Expected: PASS.

### Task 3: Implement the motion controller and accessible mobile menu

**Files:**
- Modify: `script.js`

- [ ] Refactor behavior into named functions and call them from one `initSite()` entry point.

```js
function initSite() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  initIntro(reducedMotion);
  initReveals(reducedMotion);
  initMobileMenu();
  initPointerReticle(reducedMotion);
  initScrollMotion(reducedMotion);
  initSectionNavigation();
  initArchiveFilter(reducedMotion);
  updateYear();
}
```

- [ ] Implement `initIntro()` using safe `sessionStorage` access, a 1,250 ms completion timeout, and immediate completion for reduced motion or repeat visits.

```js
const INTRO_KEY = 'subekshya-intro-seen';
const hasSeenIntro = () => {
  try { return sessionStorage.getItem(INTRO_KEY) === 'true'; }
  catch { return true; }
};
```

- [ ] Implement `initMobileMenu()` with accurate `aria-expanded`/`aria-hidden`, body locking, first-link focus, close-on-link, Escape handling, Tab wrapping, and restoration to the toggle.

- [ ] Implement `initPointerReticle()` with one delegated `pointermove` listener and an `is-interactive` state for `a`, `button`, and `[data-crosshair]` targets.

- [ ] Implement `initScrollMotion()` with a passive scroll listener and a single queued `requestAnimationFrame` update. Update header state, bottom progress, `--page-progress`, hero parallax custom properties, and the datum’s current section label.

- [ ] Implement capped reveal delays by reveal group, never by global document index.

- [ ] Implement `initArchiveFilter()` with a short `is-filtering` mask before the existing semantic hidden-state update; apply immediately under reduced motion.

- [ ] Run the complete test suite and confirm it passes.

Run: `/Users/sagaracharya/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test`

Expected: PASS.

### Task 4: Visually refine the motion system across breakpoints

**Files:**
- Modify: `styles.css`
- Modify: `index.html` only if browser verification reveals a semantic or layout defect

- [ ] Start a local static server on port 4174.

Run: `/Users/sagaracharya/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 -m http.server 4174 --bind 127.0.0.1`

Expected: `Serving HTTP on 127.0.0.1 port 4174`.

- [ ] Inspect the first-load intro and desktop composition at 1440×1000. Confirm the intro clears by 1.25 seconds, the hero content is readable immediately afterward, and the reticle does not obscure controls.

- [ ] Scroll through the page and confirm image wipes are crisp, repeated reveals are not exhausting, hero parallax remains subtle, and datum labels track `WORK`, `ARCHIVE`, `PROFILE`, and `CONTACT`.

- [ ] Inspect at 390×844. Confirm no horizontal overflow, the menu opens full-screen, focus enters it, Escape closes it, and focus returns to the toggle.

- [ ] Inspect reduced-motion mode. Confirm all content is immediately visible and intro, reticle, parallax, masks, and staggers are absent.

- [ ] Check the browser console and fix all errors introduced by this change.

### Task 5: Verify, commit, deploy, and inspect production

**Files:**
- Modify: `README.md` only if the interaction or run instructions are now inaccurate

- [ ] Run the complete Node test suite from a clean working tree candidate.

Run: `/Users/sagaracharya/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test`

Expected: all tests pass with zero failures.

- [ ] Review the diff for accidental content changes, remote asset references, debugging output, and placeholders in implementation code.

Run: `git diff --check`

Expected: no output.

- [ ] Commit the implementation.

Run: `git add index.html styles.css script.js tests/site.test.mjs tests/interaction.test.mjs docs/superpowers/plans/2026-08-02-living-drawing-motion.md && git commit -m "feat: add living drawing motion system"`

- [ ] Push `main` to `SAGARACH65/subekshya`, wait for the GitHub Pages workflow to succeed, and inspect the deployed page.

Run: `git push origin main`

Expected: push succeeds; the newest Pages workflow concludes successfully.

- [ ] Verify `https://sagarach65.github.io/subekshya/` at desktop and mobile widths and confirm it serves the new `data-intro` markup and motion controller.
