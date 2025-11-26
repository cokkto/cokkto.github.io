// javascripts/audioplayer.js
window.initAudioPlayer = function (trackList, albumFolder) {
  const folder = albumFolder || "zerone";

  const player = document.getElementById("player");
  const playBtn = document.getElementById("play");
  const seekbar = document.getElementById("seekbar");
  const desktopList = document.getElementById("tracklist");
  const mobileList = document.getElementById("tracklist-mobile");

  if (!player || !playBtn || !seekbar) return;

  const audioBasePath = "./audio/" + folder + "/";

  let currentIndex = -1;
  let isPlaying = false;

  function cleanName(track) {
    return track.replace(/^\d{2}\s*-\s*\d+\s*-\s*/, "");
  }

  function setPlaying(playing) {
    isPlaying = playing;
    playBtn.innerHTML = playing ? "&#9208;&#65038;" : "&#9654;&#65038;";
  }

  function highlightTrack(index) {
    const lists = [desktopList, mobileList].filter(Boolean);
    lists.forEach((list) => {
      Array.from(list.children).forEach((li, i) => {
        const name = cleanName(trackList[i]);

        if (i === index) {
          li.textContent = "▶︎ " + name;
          li.classList.add(
            "font-semibold",
            "text-sky-300",
            "underline",
            "underline-offset-4"
          );
        } else {
          li.textContent = name;
          li.classList.remove(
            "font-semibold",
            "text-sky-300",
            "underline",
            "underline-offset-4"
          );
        }
      });
    });
  }

  function loadTrack(index) {
    const filename = trackList[index];
    if (!filename) return;

    player.innerHTML =
      '<source src="' +
      audioBasePath +
      filename +
      '.ogg" type="audio/ogg">' +
      '<source src="' +
      audioBasePath +
      filename +
      '.mp3" type="audio/mpeg">';

    currentIndex = index;
    highlightTrack(index);
    player.load();
  }

  function playTrack(index) {
    loadTrack(index);
    player.play();
    setPlaying(true);
  }

  function togglePlay() {
    if (currentIndex === -1) {
      playTrack(0);
    } else if (isPlaying) {
      player.pause();
      setPlaying(false);
    } else {
      player.play();
      setPlaying(true);
    }
  }

  function playNext() {
    if (currentIndex + 1 < trackList.length) playTrack(currentIndex + 1);
  }

  function playPrev() {
    if (currentIndex > 0) playTrack(currentIndex - 1);
  }

  player.addEventListener("timeupdate", () => {
    if (!isNaN(player.duration) && player.duration > 0) {
      seekbar.value = (player.currentTime / player.duration) * 100;
    }
  });

  seekbar.addEventListener("input", () => {
    if (!isNaN(player.duration) && player.duration > 0) {
      player.currentTime = (seekbar.value / 100) * player.duration;
    }
  });

  function buildTracklist(container) {
    trackList.forEach((track, index) => {
      const li = document.createElement("li");
      li.textContent = cleanName(track);
      li.className =
        "cursor-pointer rounded-md px-3 py-2 text-slate-200 hover:bg-slate-800/80 " +
        "hover:text-slate-50 transition-colors";
      li.addEventListener("click", () => playTrack(index));
      container.appendChild(li);
    });
  }

  if (desktopList) buildTracklist(desktopList);
  if (mobileList) buildTracklist(mobileList);

  playBtn.addEventListener("click", togglePlay);
  const nextBtn = document.getElementById("next");
  const prevBtn = document.getElementById("prev");
  if (nextBtn) nextBtn.addEventListener("click", playNext);
  if (prevBtn) prevBtn.addEventListener("click", playPrev);

  player.addEventListener("ended", playNext);
};
