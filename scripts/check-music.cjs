// Optional browser regression check; uses an existing Playwright installation.
const browserType = require(process.argv[2] || 'playwright')[process.argv[3] || 'chromium'];
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const root = path.resolve(__dirname, '..');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.jpg': 'image/jpeg', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  if (req.url.includes('?fallback-check')) { res.writeHead(404).end(); return; }
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  let file = path.resolve(root, '.' + pathname);
  if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
  const size = fs.statSync(file).size;
  const range = /bytes=(\d+)-(\d*)/.exec(req.headers.range || '');
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  res.setHeader('Accept-Ranges', 'bytes');
  if (range) {
    const start = Number(range[1]), end = range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    res.writeHead(206, { 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end - start + 1 });
    fs.createReadStream(file, { start, end }).pipe(res);
  } else { res.setHeader('Content-Length', size); fs.createReadStream(file).pipe(res); }
});

(async () => {
  const { default: albums } = await import(pathToFileURL(path.join(root, 'javascripts/albums.mjs')));
  for (const album of albums) for (const file of [album.cover, ...album.tracks.flatMap(t => [t.src, t.ogg])]) {
    assert.ok(fs.existsSync(path.join(root, file)), `Missing asset: ${file}`);
  }
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  let browser;
  const errors = [];
  try {
    browser = await browserType.launch({ headless: true });
    const page = await browser.newPage();
    page.setDefaultTimeout(15000);
    page.on('pageerror', error => errors.push(error.message));
    const playing = () => page.waitForFunction(() => {
      const audio = document.querySelector('audio');
      return !audio.paused && audio.currentTime > 0 && audio.readyState >= 2;
    });
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      for (const route of ['/', '/music/', ...albums.map(a => `/music/${a.slug}/`)]) {
        await page.goto(base + route);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow: ${width} ${route}`);
        assert.equal(await page.locator('h1').count(), 1);
        assert.equal(await page.locator('nav a').count(), 2);
      }
    }
    await page.goto(base + '/music/');
    assert.deepEqual(await page.locator('[data-play-album]').evaluateAll(nodes => nodes.map(n => n.dataset.playAlbum)), ['zerone-be-side', 'zerone']);
    assert.equal(await page.locator('audio').count(), 1);
    assert.equal(await page.locator('[data-player]').isVisible(), false);
    await page.locator('[data-play-album="zerone-be-side"]').click();
    await playing();
    assert.equal(await page.locator('[data-track-name]').textContent(), albums[2].tracks[0].name);
    await page.locator('[data-action="next"]').click();
    await playing();
    assert.equal(await page.locator('[data-track-name]').textContent(), albums[2].tracks[1].name);
    await page.locator('[data-action="previous"]').click();
    await playing();
    await page.locator('[data-action="play"]').click();
    assert.ok(await page.locator('audio').evaluate(a => a.paused));
    await page.locator('[data-action="play"]').click();
    await playing();
    await page.locator('[data-seek]').evaluate(el => { el.value = 50; el.dispatchEvent(new Event('input')); });
    assert.ok(await page.locator('audio').evaluate(a => Math.abs(a.currentTime / a.duration - .5) < .02));
    await page.locator('[data-action="stop"]').click();
    assert.ok(await page.locator('audio').evaluate(a => a.paused && a.currentTime === 0));
    await page.locator('[data-play-album="zerone"]').click();
    await playing();
    assert.equal(await page.locator('[data-track-name]').textContent(), albums[3].tracks[0].name);
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      const bar = await page.locator('[data-player]').boundingBox();
      assert.ok(bar.height < 130, `Player too tall at ${width}: ${bar.height}`);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      for (const action of ['play', 'next', 'stop']) assert.ok(await page.locator(`[data-action="${action}"]`).isVisible());
      await page.screenshot({ path: path.join(os.tmpdir(), `cocteau-music-${width}.png`), fullPage: false });
    }
    for (const album of albums) {
      console.log('Checking album: ' + album.title);
      await page.goto(base + `/music/${album.slug}/`);
      assert.ok(await page.locator('audio').evaluate(a => a.paused));
      const schema = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
      assert.equal(schema.numTracks, album.tracks.length);
      assert.equal(schema.track.itemListElement.length, album.tracks.length);
      await page.locator('[data-play-album]').click();
      await playing();
      await page.locator('[data-track="7"]').click();
      await playing();
      assert.ok(await page.locator('[data-action="next"]').isDisabled());
      await page.locator('audio').evaluate(a => { a.currentTime = a.duration - .1; });
      await page.waitForFunction(() => document.querySelector('audio').ended);
      await page.waitForFunction(() => document.querySelector('[data-action="play"]').getAttribute('aria-label') === 'Play').catch(async error => {
        console.error(await page.locator('audio').evaluate(a => ({ paused: a.paused, ended: a.ended, time: a.currentTime, duration: a.duration })));
        throw error;
      });
      await page.locator('[data-action="repeat"]').click();
      await page.locator('[data-action="play"]').click();
      await playing();
      await page.locator('audio').evaluate(a => { a.currentTime = a.duration - .1; });
      await page.waitForFunction(name => document.querySelector('[data-track-name]').textContent === name, album.tracks[0].name);
      await playing();
      await page.goto(base + `/music/${album.id}.html`);
      await page.waitForURL(base + `/music/${album.slug}/`);
    }
    // Rapid album changes must not let a stale play() promise change current state.
    await page.goto(base + '/music/');
    await page.locator('[data-play-album="zerone"]').click();
    await page.locator('[data-play-album="zerone-be-side"]').click();
    await playing();
    assert.equal(await page.locator('[data-track-name]').textContent(), albums[2].tracks[0].name);
    // A missing MP3 should use the existing Ogg fallback.
    const supportsOgg = await page.locator('audio').evaluate(a => Boolean(a.canPlayType('audio/ogg')));
    await page.locator('[data-play-album="zerone"]').click();
    // Use a real server 404: native media requests can bypass browser interception.
    await page.locator('audio').evaluate(a => { a.src += '?fallback-check'; a.load(); a.play().catch(() => {}); });
    if (supportsOgg) {
      await page.waitForFunction(() => document.querySelector('audio').currentSrc.endsWith('.ogg'));
      await playing();
    } else {
      await page.waitForFunction(() => /unavailable|could not play/.test(document.querySelector('[data-status]').textContent));
      console.log('Ogg unsupported by this browser: verified the playback error message.');
    }
    const noJS = await browser.newContext({ javaScriptEnabled: false });
    const staticPage = await noJS.newPage();
    await staticPage.goto(base + '/music/be-side/');
    assert.equal(await staticPage.locator('.tracklist a').count(), 8);
    await noJS.close();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base + '/music/be-side/');
    await page.screenshot({ path: path.join(os.tmpdir(), 'cocteau-album-mobile.png'), fullPage: true });
    await page.goto(base);
    await page.screenshot({ path: path.join(os.tmpdir(), 'cocteau-home-mobile.png'), fullPage: true });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.screenshot({ path: path.join(os.tmpdir(), 'cocteau-home-desktop.png'), fullPage: true });
    assert.deepEqual(errors, []);
    console.log('PASS: all audio assets, 24 responsive page checks, playback, pause, stop, seek, album switching, track selection, repeat, end-of-album, redirects, metadata, and no browser errors.');
    console.log('Screenshots: ' + os.tmpdir());
  } finally { if (browser) await browser.close(); server.close(); }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
