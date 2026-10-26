# Brasaland Website

Public-facing, bilingual website for Brasaland. The English landing page is `index.html`; the inquiry form is `application.html`. Spanish pages are in `es/`.

## Run locally

From this directory, install the package dependencies once, then start the static preview:

```sh
npm install
npm run dev
```

The dev command builds the Tailwind stylesheet and serves this directory at `http://localhost:4173`. In Codespaces, forward port `4173` and set its visibility to **Public** to share an audit URL. The preview uses `npx serve`; the first run may download that package.

## Audit

Run PageSpeed Insights against the public Codespaces URL and target a score of at least 80. If PageSpeed cannot reach the forwarded URL, run Lighthouse from Chrome DevTools against the same preview and save a screenshot of the report.

The inquiry form validates in the browser and displays a confirmation only. It does not transmit or store submitted information. The page currently uses a remotely hosted Unsplash image and Google Fonts.
