export function initAudioPlayer(trackList) {
  const player = document.getElementById('player');
  const playBtn = document.getElementById('play');
  const seekbar = document.getElementById('seekbar');
  const desktopList = document.getElementById('tracklist');
  const mobileList = document.getElementById('tracklist-mobile');

  let currentIndex = -1;
  let isPlaying = false;

  function loadTrack(index) {
    const filename = trackList[index];
    player.innerHTML = `
      <source src="./audio/zerone/${filename}.ogg" type="audio/ogg">
      <source src="./audio/zerone/${filename}.mp3" type="audio/mpeg">
    `;
    currentIndex = index;
    highlightTrack(index);
    player.load();
  }

  function playTrack(index) {
    loadTrack(index);
    player.play();
    isPlaying = true;
    playBtn.textContent = '⏸';
  }

  function highlightTrack(index) {
    [desktopList, mobileList].forEach(list => {
      if (!list) return;
      Array.from(list.children).forEach((li, i) => {
        li.classList.toggle('active', i === index);
      });
    });
  }

  function togglePlay() {
    if (currentIndex === -1) {
      playTrack(0);
    } else if (isPlaying) {
      player.pause();
      isPlaying = false;
      playBtn.textContent = '▶';
    } else {
      player.play();
      isPlaying = true;
      playBtn.textContent = '⏸';
    }
  }

  function playNext() {
    if (currentIndex + 1 < trackList.length) playTrack(currentIndex + 1);
  }

  function playPrev() {
    if (currentIndex > 0) playTrack(currentIndex - 1);
  }

  player.addEventListener('timeupdate', () => {
    if (!isNaN(player.duration)) {
      seekbar.value = (player.currentTime / player.duration) * 100;
    }
  });

  seekbar.addEventListener('input', () => {
    if (!isNaN(player.duration)) {
      player.currentTime = (seekbar.value / 100) * player.duration;
    }
  });

  function buildTracklist(container) {
    trackList.forEach((track, index) => {
      const li = document.createElement('li');
      li.textContent = track.replace(/^01 - \d+ - /, '');
      li.addEventListener('click', () => playTrack(index));
      container.appendChild(li);
    });
  }

  if (desktopList) buildTracklist(desktopList);
  if (mobileList) buildTracklist(mobileList);

  playBtn.addEventListener('click', togglePlay);
  document.getElementById('next').addEventListener('click', playNext);
  document.getElementById('prev').addEventListener('click', playPrev);
  player.addEventListener('ended', playNext);
}
