import albums from './albums.mjs';

const root = document.querySelector('[data-player]');
if (root) initAudioPlayer(root);

function initAudioPlayer(root) {
  const audio = root.querySelector('audio');
  const find = selector => root.querySelector(selector);
  const playButton = find('[data-action="play"]');
  const seek = find('[data-seek]');
  const status = find('[data-status]');
  const trackButtons = [...document.querySelectorAll('[data-track]')];
  let album = albums.find(item => item.id === root.dataset.album);
  let index = 0;
  let repeat = false;
  let generation = 0;
  let triedFallback = false;
  const time = seconds => Number.isFinite(seconds) ? Math.floor(seconds / 60) + ':' + String(Math.floor(seconds % 60)).padStart(2, '0') : '0:00';

  function updatePlaying() {
    const playing = !audio.paused && !audio.ended;
    const label = playing ? 'Pause' : 'Play';
    playButton.setAttribute('aria-label', label);
    playButton.title = label;
    playButton.querySelector('svg').innerHTML = playing
      ? '<path d="M6 4h4v16H6zm8 0h4v16h-4z"/>' : '<path d="m8 4 13 8-13 8z"/>';
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
  }

  function updateTime() {
    const ready = Number.isFinite(audio.duration) && audio.duration > 0;
    seek.disabled = !ready;
    seek.value = ready ? audio.currentTime / audio.duration * 100 : 0;
    seek.setAttribute('aria-valuetext', time(audio.currentTime) + ' of ' + time(audio.duration));
    find('[data-elapsed]').textContent = time(audio.currentTime);
    find('[data-duration]').textContent = time(audio.duration);
  }

  async function play() {
    const request = generation;
    status.textContent = '';
    try { await audio.play(); }
    catch (error) {
      if (request !== generation || error.name === 'AbortError') return;
      status.textContent = error.name === 'NotAllowedError' ? 'Tap Play to start listening.' : 'This track could not play. Try again or choose another track.';
    }
    updatePlaying();
  }

  function loadTrack(nextIndex, autoplay = true) {
    if (!album?.tracks[nextIndex]) return;
    generation++;
    audio.pause();
    index = nextIndex;
    triedFallback = false;
    const track = album.tracks[index];
    audio.src = track.src;
    audio.load();
    status.textContent = '';
    find('[data-track-name]').textContent = track.name;
    find('[data-track-name]').title = track.name;
    find('[data-now-cover]').src = album.cover;
    const albumName = find('[data-album-name]');
    albumName.textContent = album.title;
    albumName.href = '/music/' + album.slug + '/';
    const albumLink = find('[data-album-link]');
    if (albumLink) albumLink.href = albumName.href;
    trackButtons.forEach((button, i) => {
      if (i === index) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
    updateBoundaries();
    updateTime();
    if ('mediaSession' in navigator && 'MediaMetadata' in window) {
      navigator.mediaSession.metadata = new MediaMetadata({ title: track.name, artist: 'Aleksi Salo', album: album.title, artwork: [{ src: album.cover }] });
    }
    if (autoplay) play();
  }

  function updateBoundaries() {
    find('[data-action="previous"]').disabled = index === 0 && !repeat;
    find('[data-action="next"]').disabled = index === album.tracks.length - 1 && !repeat;
  }

  function next() {
    if (!album) return;
    if (index + 1 < album.tracks.length) loadTrack(index + 1);
    else if (repeat) loadTrack(0);
  }

  function previous() {
    if (!album) return;
    if (index > 0) loadTrack(index - 1);
    else if (repeat) loadTrack(album.tracks.length - 1);
  }

  function stop() {
    generation++;
    audio.pause();
    audio.currentTime = 0;
    updateTime();
  }

  root.querySelectorAll('button').forEach(button => { button.disabled = false; });
  document.querySelectorAll('[data-play-album]').forEach(button => {
    button.disabled = false;
    button.addEventListener('click', () => {
      album = albums.find(item => item.id === button.dataset.playAlbum);
      if (!album) return;
      root.hidden = false;
      if (root.classList.contains('player-bar')) document.body.classList.add('has-player');
      loadTrack(0);
    });
  });
  trackButtons.forEach(button => {
    button.disabled = false;
    button.addEventListener('click', () => loadTrack(Number(button.dataset.track)));
  });
  playButton.addEventListener('click', () => {
    if (audio.paused) {
      if (audio.ended) loadTrack(index);
      else play();
    } else { generation++; audio.pause(); }
  });
  find('[data-action="next"]').addEventListener('click', next);
  find('[data-action="previous"]').addEventListener('click', previous);
  find('[data-action="stop"]').addEventListener('click', stop);
  find('[data-action="repeat"]').addEventListener('click', event => {
    repeat = !repeat;
    event.currentTarget.setAttribute('aria-pressed', String(repeat));
    updateBoundaries();
  });
  seek.addEventListener('input', () => {
    if (Number.isFinite(audio.duration)) audio.currentTime = seek.value / 100 * audio.duration;
  });
  for (const event of ['timeupdate', 'loadedmetadata', 'durationchange', 'emptied']) audio.addEventListener(event, updateTime);
  for (const event of ['play', 'pause', 'ended']) audio.addEventListener(event, updatePlaying);
  audio.addEventListener('ended', next);
  audio.addEventListener('error', () => {
    if (!triedFallback && album.tracks[index].ogg && audio.canPlayType('audio/ogg')) {
      triedFallback = true;
      generation++;
      audio.src = album.tracks[index].ogg;
      audio.load();
      play();
    } else status.textContent = 'This track is unavailable. Please try another track.';
  });
  if (root.classList.contains('player-bar')) {
    new ResizeObserver(() => {
      document.body.style.setProperty('--player-height', (root.getBoundingClientRect().height + 16) + 'px');
    }).observe(root);
  }
  if ('mediaSession' in navigator) {
    for (const [action, handler] of Object.entries({ play, pause: () => audio.pause(), stop, previoustrack: previous, nexttrack: next })) {
      try { navigator.mediaSession.setActionHandler(action, handler); } catch { /* Some browsers expose fewer actions. */ }
    }
  }
  if (album) loadTrack(0, false);
}
