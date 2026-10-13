# cocteau.name

Static homepage and music pages, hosted on GitHub Pages. No browser dependencies or install step.

## Editing music and pages

- Edit `javascripts/albums.mjs`: album metadata, cover, descriptions, and tracks live here, newest first. Each track resolves to a name, MP3 URL and Ogg fallback URL.
- Set an album's `visible` field to `true` to include it on `/music/`. Hidden albums remain accessible by their direct URLs.
- Edit homepage copy and shared HTML in `scripts/build-pages.mjs`, styling in `stylesheets/site.css`, and playback behavior in `javascripts/audioplayer.js`.
- Run `node scripts/build-pages.mjs` after content changes and commit the generated HTML too. GitHub Pages serves these files directly; no deployment build is needed.

The music listing uses one audio element and a compact bottom bar. Each album page uses the same controller with a full player and tracklist. Playback stops when navigating. Existing `.html` album URLs redirect to the clean directory URLs.

Release years are shown until exact release dates are available. Streaming links can be added once releases are live.

## Local checks

Run `node --check javascripts/audioplayer.js` and `node scripts/build-pages.mjs`.
For browser checks, run `node scripts/check-music.cjs <path-to-playwright-package>` with an installed Playwright package and Chromium browser. Append `webkit` to check that engine instead. The check starts and stops its own local server and writes screenshots to the system temp directory.
