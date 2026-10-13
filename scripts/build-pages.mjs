// Run after editing the catalog. Generated HTML keeps content readable without JS.
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import albums from '../javascripts/albums.mjs';

const root = new URL('../', import.meta.url);
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const url = album => `/music/${album.slug}/`;
const meta = album => `${escape(album.genre)} · ${album.year} · ${album.tracks.length} tracks`;
const musicCopy = 'I started with words, moods and sounds recorded at home, then shaped them into songs with guitars, piano and AI tools. The voices are synthetic; the stories and feelings are my own. Coming from graphic design, this is my way of learning to compose with sound instead of images.';

function page({ title, description, path, content, album, player = false }) {
  const image = album ? album.cover : '/metaimages/cocteau.png';
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(title)} · cocteau.name</title>
  <meta name="description" content="${escape(description)}">
  <meta name="author" content="Aleksi Salo">
  <link rel="canonical" href="https://cocteau.name${path}">
  <meta property="og:type" content="${album ? 'music.album' : 'website'}">
  <meta property="og:site_name" content="cocteau.name">
  <meta property="og:title" content="${escape(title)} · Aleksi Salo">
  <meta property="og:description" content="${escape(description)}">
  <meta property="og:url" content="https://cocteau.name${path}">
  <meta property="og:image" content="https://cocteau.name${image}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escape(title)} · Aleksi Salo">
  <meta name="twitter:description" content="${escape(description)}">
  <meta name="twitter:image" content="https://cocteau.name${image}">
  <link rel="stylesheet" href="/stylesheets/site.css">
  ${album ? `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'MusicAlbum', '@id': `https://cocteau.name${path}`,
    name: album.title, url: `https://cocteau.name${path}`, image: `https://cocteau.name${image}`,
    description: album.description, genre: album.genre, numTracks: album.tracks.length,
    byArtist: { '@type': 'Person', name: 'Aleksi Salo', url: 'https://cocteau.name/' },
    track: { '@type': 'ItemList', itemListElement: album.tracks.map((track, i) => ({
      '@type': 'ListItem', position: i + 1, item: { '@type': 'MusicRecording', name: track.name,
        url: `https://cocteau.name${path}#track-${i + 1}`, audio: { '@type': 'AudioObject', contentUrl: `https://cocteau.name${encodeURI(track.src)}`, encodingFormat: 'audio/mpeg' } },
    })) },
  }).replace(/</g, '\\u003c')}</script>` : ''}
  ${player ? '<script type="module" src="/javascripts/audioplayer.js"></script>' : ''}
</head>
<body${album ? ' class="album-page"' : ''}>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header"><div class="wrap header-inner">
    <a class="brand" href="/">cocteau.name<small>MUSIC &amp; CODE</small></a>
    <nav aria-label="Main"><a href="https://cocteau.name/wkly-datetime-picker/">WKLY</a><a href="/music/"${path.startsWith('/music/') ? ' aria-current="' + (album ? 'true' : 'page') + '"' : ''}>Music</a></nav>
  </div></header>
  <main id="main" class="wrap">${content}</main>
  <footer class="site-footer"><div class="wrap footer-inner"><span>Aleksi Salo · Made in the Nordics.</span><a href="https://linkedin.com/in/cocteau">LinkedIn</a></div></footer>
  ${player && !album ? playerMarkup('bar') : ''}
</body>
</html>
`;
}

function playerMarkup(skin, album) {
  return `<section class="player player-${skin}" data-player${album ? ` data-album="${album.id}"` : ' hidden'} aria-label="Music player">
    ${album ? `<img class="art" src="${album.cover}" alt="${escape(album.title)} album artwork" width="600" height="600">` : ''}
    <div class="now-playing"><img data-now-cover ${album ? `src="${album.cover}"` : ''} alt="" width="50" height="50"><div><span class="track-name" data-track-name>${album ? escape(album.tracks[0].name) : ''}</span><a class="album-name" data-album-name${album ? ` href="${url(album)}"` : ''}>${album ? escape(album.title) : ''}</a></div></div>
    <div class="transport"><div class="controls">
      <button class="control secondary" data-action="repeat" aria-label="Repeat album" aria-pressed="false" title="Repeat album" disabled>${icon('repeat')}</button>
      <button class="control" data-action="previous" aria-label="Previous track" title="Previous track" disabled>${icon('previous')}</button>
      <button class="control play" data-action="play" aria-label="Play" title="Play" disabled>${icon('play')}</button>
      <button class="control" data-action="next" aria-label="Next track" title="Next track" disabled>${icon('next')}</button>
      <button class="control" data-action="stop" aria-label="Stop" title="Stop" disabled>${icon('stop')}</button>
    </div><div class="timeline"><span data-elapsed>0:00</span><input data-seek type="range" min="0" max="100" step="0.1" value="0" aria-label="Seek within track" disabled><span data-duration>0:00</span></div></div>
    ${skin === 'bar' ? '<a class="player-extra" data-album-link>View album ↗</a>' : ''}
    <p class="player-status" data-status role="status"></p>
    <audio preload="none"></audio>
  </section>`;
}

function icon(name) {
  const paths = {
    play: '<path d="m8 4 13 8-13 8z"/>',
    previous: '<path d="M4 4h3v16H4zm16 0v16L8 12z"/>',
    next: '<path d="M17 4h3v16h-3zM4 4l12 8-12 8z"/>',
    stop: '<rect x="6" y="6" width="12" height="12" rx="1"/>',
    repeat: '<path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="m16 2 4 4-4 4M4 11V9a3 3 0 0 1 3-3h13M8 22l-4-4 4-4m12-1v2a3 3 0 0 1-3 3H4"/>',
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name]}</svg>`;
}

const featured = albums.find(album => album.id === 'zerone-be-side');
const home = `<section class="hero" aria-labelledby="wkly-title"><div class="stack">
  <p class="eyebrow">A little less clicking</p><h1 id="wkly-title">Meet WKLY.</h1>
  <p>A date and time picker that lets you scroll through weeks without jumping from month to month. Pick a day, set a time or choose a range — on your phone or at your desk.</p>
  <p>I built WKLY for Angular apps, with room for different languages, calendars and the way people actually plan their time.</p>
  <div class="actions"><a class="button primary" href="https://cocteau.name/wkly-datetime-picker/">Try WKLY ↗</a><a href="https://github.com/cokkto/wkly-datetime-picker">GitHub</a><a href="https://www.npmjs.com/package/@wkly/datetime-picker">npm</a></div>
  </div><div class="calendar-art" role="img" aria-label="Illustration of a continuous calendar with a selected range of days">
    <div class="calendar-top"><strong>One week into the next.</strong><span>WKLY</span></div>
    <div class="calendar-grid">${['M','T','W','T','F','S','S'].map(d => `<span class="day">${d}</span>`).join('')}${Array.from({length: 28}, (_, i) => `<span${i >= 10 && i <= 16 ? ` class="selected${i === 10 ? ' start' : i === 16 ? ' end' : ''}"` : ''}>${(i + 22) % 31 + 1}</span>`).join('')}</div><p class="calendar-note">Dates, times and the space in between.</p>
  </div></section>
  <section class="section" aria-labelledby="music-title"><div class="section-heading"><div class="stack"><p class="eyebrow">Away from the keyboard. Sort of.</p><h2 id="music-title">Learning to think in sound.</h2></div><a href="/music/">Explore the music ↗</a></div>
    <p>${musicCopy}</p>
    <article class="feature"><a href="${url(featured)}"><img class="art" src="${featured.cover}" alt="Zerone: Be-side album artwork" width="600" height="600" loading="lazy"></a><div class="stack"><p class="eyebrow">Featured album</p><h3>${featured.title}</h3><p class="meta">${meta(featured)}</p><p>${featured.description}</p><div class="actions"><a class="button primary" href="${url(featured)}">Listen to Be-side</a><a href="/music/zerone/">Discover Zerone ↗</a></div></div></article>
  </section>`;

const listing = `<section class="intro stack"><p class="eyebrow">Music by Aleksi Salo</p><h1>Small stories.<br>Room to listen.</h1><p>${musicCopy}</p></section>
  <div class="album-grid">${albums.filter(a => a.visible).map(album => `<article class="album-card"><div class="cover-wrap"><a href="${url(album)}" aria-label="Explore ${escape(album.title)}"><img class="art" src="${album.cover}" alt="${escape(album.title)} album artwork" width="600" height="600"></a><button class="cover-play" data-play-album="${album.id}" aria-label="Play ${escape(album.title)}" disabled><span class="triangle" aria-hidden="true"></span><span>Play</span></button></div><div class="stack"><p class="meta">${meta(album)}</p><h2><a href="${url(album)}">${escape(album.title)}</a></h2><p>${escape(album.description)}</p><a href="${url(album)}">About the album &amp; tracks ↗</a></div></article>`).join('\n')}</div>
  <noscript><p>Open an album to listen using the audio file links.</p></noscript>`;

async function save(path, html) {
  const file = new URL(path, root);
  await mkdir(fileURLToPath(new URL('./', file)), { recursive: true });
  await writeFile(file, html.replace(/ +$/gm, ''));
}

await save('index.html', page({ title: 'Music & code', description: 'Aleksi Salo: making WKLY, a date and time picker for Angular, and exploring music through home recordings, stories and digital tools.', path: '/', content: home }));
await save('music/index.html', page({ title: 'Music', description: 'Listen to music by Aleksi Salo. Explore Zerone: Be-side and Zerone, from summer light to Nordic winter, with full albums and tracklists.', path: '/music/', content: listing, player: true }));

for (const album of albums) {
  const content = `<section class="intro stack"><a href="/music/">← All music</a><p class="eyebrow">Album by Aleksi Salo</p><h1>${escape(album.title)}</h1><p class="meta">${meta(album)}</p></section>
    <div class="album-layout"><div>${playerMarkup('full', album)}<noscript><p>JavaScript is off. Use the audio links below to listen.</p></noscript></div><section aria-label="Album tracks"><div class="stack"><p>${escape(album.description)}</p><div><button class="button primary" data-play-album="${album.id}" disabled>Play album</button></div></div><ol class="tracklist">${album.tracks.map((track, i) => `<li id="track-${i + 1}"><button data-track="${i}" disabled><span class="track-number">${String(i + 1).padStart(2, '0')}</span><span>${escape(track.name)}</span></button><noscript><a href="${escape(encodeURI(track.src))}">Listen to ${escape(track.name)}</a></noscript></li>`).join('')}</ol><p class="album-copy">${escape(album.detail)}</p></section></div>`;
  await save(`music/${album.slug}/index.html`, page({ title: album.title, description: album.description, path: url(album), content, album, player: true }));
  await save(`music/${album.id}.html`, `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(album.title)} · cocteau.name</title><link rel="canonical" href="https://cocteau.name${url(album)}"><meta http-equiv="refresh" content="0;url=${url(album)}"></head><body><p>This album has moved to <a href="${url(album)}">${escape(album.title)}</a>.</p></body></html>\n`);
}
console.log('Generated homepage, music listing, four album pages and legacy redirects.');
