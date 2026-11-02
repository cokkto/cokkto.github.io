# cocteau.name

Static homepage and music pages, hosted on GitHub Pages. No browser dependencies or install step.

## Run locally

Install Node.js (which includes npm), then run this from the repository root:

```sh
npx --yes http-server . -p 8000 -c-1
```

Open [http://localhost:8000/](http://localhost:8000/) in your browser. The first run downloads the Node.js `http-server` package, so it requires internet access; it does not add a dependency to this repository. Press Ctrl+C in the terminal to stop the server. Serving from the repository root keeps the site's root-relative links and assets working.

## Editing music and pages

- Edit `javascripts/albums.mjs`: album metadata, cover, social image (`metaImage`), descriptions, and tracks live here, newest first. Each track resolves to a name, MP3 URL and Ogg fallback URL.
- Album descriptions, introductions, and detail paragraphs are rendered as HTML. Each album must have a plain-text `metaDescription` of at most 160 characters; the generator checks this before writing pages.
- Use `artist`, `language`, `showReleaseDate`, `introEyebrow`, `intro`, `detail`, and `releaseLinks` to configure album pages. Use empty arrays or an empty eyebrow when there is no content; set `releaseDate` to `null` when unknown. Set `featured` on the album shown on the homepage.
- Set an album's `visible` field to `true` to include it on `/music/`. Hidden albums remain accessible by their direct URLs.
- Edit homepage copy and shared HTML in `scripts/build-pages.mjs`, styling in `stylesheets/site.css`, and playback behavior in `javascripts/audioplayer.js`.
- Run `node scripts/build-pages.mjs` after content changes and commit the generated HTML too. GitHub Pages serves these files directly; no deployment build is needed.

The music listing uses one audio element and a compact bottom bar. Each album page uses the same controller with a full player and tracklist. Playback stops when navigating. Existing `.html` album URLs redirect to the clean directory URLs.

Release years are shown until exact release dates are available. Streaming links can be added once releases are live.

## Local checks

Run `node --check javascripts/audioplayer.js` and `node scripts/build-pages.mjs`.
For browser checks, run `node scripts/check-music.cjs <path-to-playwright-package>` with an installed Playwright package and Chromium browser. Append `webkit` to check that engine instead. The check starts and stops its own local server and writes screenshots to the system temp directory.

## SEO audit

After changing homepage or music content, regenerate the pages and check their titles, descriptions, headings, canonical URLs, Open Graph and Twitter metadata. Check that each album's MusicAlbum JSON-LD matches the catalog and that image, track and internal links resolve. Check `robots.txt` and `sitemap.xml`: list the canonical URLs intended for search, keep dates accurate or omit them, and update the sitemap when releases change. A hidden album is still publicly accessible and may be indexed; `visible` only controls the music listing.

For a browser audit, start the local server above in one terminal. In another terminal, with Chrome or Chromium installed and internet access for the first download, run for example:

```sh
npx --yes lighthouse http://localhost:8000/ --only-categories=seo,performance,accessibility,best-practices --output=html --output-path=./lighthouse-home.html
```

Repeat for `/music/` and each album URL, giving each report a different output path. Review individual findings rather than treating scores as guarantees of ranking or indexing. Reports are local artifacts; do not commit them. Audit the deployed URLs separately after publication to check real HTTP status codes, redirects, assets and crawler access; local results do not establish production behavior. Search Console's URL Inspection and sitemap reports can help verify Google's view when access is available.
