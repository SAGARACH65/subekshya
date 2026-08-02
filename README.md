# Subekshya — Architecture Portfolio

A responsive, editorial portfolio for an architecture student seeking internships. The current project imagery and case-study text are clearly labeled fictional placeholders and should be replaced with Subekshya's real work before applications.

The portfolio includes:

- Three large featured case-study narratives.
- A filterable six-project archive with reusable card structures.
- Education, experience, software/making, languages, recognition, and résumé placeholders.
- Responsive desktop and mobile layouts with reduced-motion and keyboard-focus support.

## Preview locally

```bash
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173`.

## Test

```bash
npm test
```

## Replace placeholder content

- Update biography, project descriptions, and email in `index.html`.
- Replace the six project files in `assets/` while preserving their filenames, or update the corresponding image paths and dimensions in `index.html`.
- Keep project images in WebP format where possible and aim for less than 500 KB each.
- Remove the placeholder notices only after all fictional content has been replaced.

## Deploy

Push `main` to GitHub. The workflow in `.github/workflows/pages.yml` tests the repository and deploys the static files to GitHub Pages.
