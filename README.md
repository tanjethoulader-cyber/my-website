# Tanjet Hawlader — Personal Portfolio

A responsive single-page personal portfolio built with plain HTML, CSS and JavaScript.

## Files
- `index.html` — website structure and CV-based content
- `css/style.css` — responsive styling, light/dark themes and animations
- `js/main.js` — navigation, theme preference, scroll progress, reveal effects and contact form
- `assets/Tanjet-Hawlader-CV.pdf` — the CV supplied for this portfolio
- `assets/favicon.svg` — browser tab icon
- `assets/og-cover.svg` — social sharing cover graphic

## Run locally
1. Extract the ZIP.
2. Open `index.html` in a modern browser.

Optional local server:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`.

## Deploy
Upload the contents of this folder to a static host such as GitHub Pages, Netlify, Vercel or the `public_html` folder in cPanel. Keep `index.html` alongside the `css`, `js` and `assets` folders.

## Contact form
The contact form currently uses `mailto:`. It opens the visitor's configured email app with the message prepared; it does not submit to a server or store messages. To receive messages without opening an email app, connect a backend or form service and update `js/main.js`.

## Content accuracy
Website details are based on the supplied CV. No unverified client names, campaign results, metrics, awards or certifications have been added. Review contact details and the LinkedIn URL before publishing.
