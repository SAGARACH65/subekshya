# Subekshya Architecture Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a polished, responsive placeholder architecture portfolio for Subekshya.

**Architecture:** A dependency-free static site separates semantic content (`index.html`), visual system (`styles.css`), and progressive enhancement (`script.js`). Local generated concept images keep the portfolio self-contained and GitHub Pages compatible.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Node’s built-in test runner, GitHub Pages

## Global Constraints

- Use `Subekshya` consistently.
- Clearly disclose every fictional project and placeholder contact detail.
- Support keyboard navigation, reduced motion, mobile layouts, and no-JavaScript reading.
- Use only local optimized image assets in production.

---

### Task 1: Establish the static-site contract

**Files:**
- Create: `package.json`
- Create: `tests/site.test.mjs`
- Create: `tests/interaction.test.mjs`

**Interfaces:**
- Consumes: the approved design specification
- Produces: `npm test`, the executable acceptance contract for all later tasks

- [ ] Write tests that assert semantic sections, disclosure copy, local image integrity, responsive styles, focus states, reduced-motion support, and progressive-enhancement hooks.
- [ ] Run `npm test` and confirm failure because production files do not yet exist.
- [ ] Commit the test contract.

### Task 2: Build the visual portfolio

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `script.js`
- Create: `assets/project-library.webp`
- Create: `assets/project-pavilion.webp`
- Create: `assets/project-courtyard.webp`
- Create: `assets/favicon.svg`

**Interfaces:**
- Consumes: the DOM hooks and file paths asserted by Task 1
- Produces: a responsive static portfolio and `initPortfolio(document, window)` progressive enhancement entry point

- [ ] Convert the generated PNG concept images to WebP with sizes appropriate for the layout.
- [ ] Write semantic HTML with the full portfolio copy and placeholder disclosures.
- [ ] Implement the token-driven editorial layout, responsive states, focus treatment, and reduced-motion fallback.
- [ ] Implement current-year text, reveal states, pointer crosshair, and active navigation as progressive enhancement.
- [ ] Run `npm test` until all acceptance tests pass.
- [ ] Commit the complete site.

### Task 3: Verify and publish

**Files:**
- Create: `README.md`
- Create: `.github/workflows/pages.yml`

**Interfaces:**
- Consumes: the verified static build from Task 2
- Produces: a documented repository with automatic GitHub Pages deployment

- [ ] Add concise editing, preview, testing, and deployment instructions.
- [ ] Add the official Pages artifact/deploy workflow.
- [ ] Serve the site locally and inspect desktop and mobile screenshots.
- [ ] Run the full test suite and validate internal HTTP requests.
- [ ] Create the `sagarach65/subekshya` GitHub repository, push `main`, enable Pages through GitHub Actions, and verify the public URL.
