# Repository instructions

- This is a static site hosted on GitHub Pages. Keep it usable without an install step or server-side runtime.
- The site uses plain HTML, CSS, and browser JavaScript. `index.html` is the homepage; `music/` contains the generated music listing, album pages, and legacy redirects. `scripts/build-pages.mjs` generates their shared page shell, navigation, footer, and player markup.
- `javascripts/albums.mjs` is the music catalog shared by the generator and player. Audio files live in `audio/`, and album artwork and social images live in `metaimages/`.
- `mt/` is a separate mathematics practice app with its own HTML, CSS, and JavaScript modules; `wd/` is another standalone page. Older site styles and scripts also remain in `stylesheets/` and `javascripts/`, so check which files a page actually loads before changing them.
- Node.js is used for page generation and optional checks, not to serve the deployed site. The README documents a local Node.js static server and the available checks.
- Keep page titles and descriptions descriptive and specific. Aim for descriptions of at most 160 characters, including spaces, and ensure generated descriptions remain accurate when content changes.
- Preserve canonical URLs and the shared Open Graph (`og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:image`) and Twitter card metadata in generated pages. Album pages also include MusicAlbum JSON-LD; keep its album and track details consistent with the catalog and ensure referenced images and URLs remain valid.
- For the homepage and music pages, edit `scripts/build-pages.mjs` and `javascripts/albums.mjs` as appropriate, then run `node scripts/build-pages.mjs` and include the generated HTML in the change. Do not edit generated pages alone.
- Album metadata is ordered newest first. Set `visible` to control inclusion on `/music/`; preserve direct album URLs and existing redirects.
- Shared site styles live in `stylesheets/site.css`; music playback behavior lives in `javascripts/audioplayer.js`. The `mt/` directory contains a separate browser-based application.
- Preserve existing audio and image assets and their paths unless the task explicitly calls for changes.
- For music or generated-page changes, run `node --check javascripts/audioplayer.js` and `node scripts/build-pages.mjs`. When relevant and Playwright with a browser is available, run `node scripts/check-music.cjs <path-to-playwright-package>`; append `webkit` to test WebKit.
- For SEO audits, follow the README workflow: check generated homepage and music metadata, canonical URLs, crawlable links, MusicAlbum data and referenced assets, plus robots.txt and sitemap coverage. Keep sitemap last-modified dates accurate or omit them; `visible: false` hides an album from the listing, not from indexing. Run Lighthouse when available and distinguish local findings from deployed HTTP and indexing checks.
- Keep changes focused and follow the existing plain HTML, CSS, and JavaScript conventions. Avoid adding dependencies or build tooling without a clear need.
