// ======================= time.js =======================
export function fmtTime(sec) {
  sec = Math.max(0, sec | 0);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

// returns { stop(), start(seconds, onTick, onDone) }
export function createCountdown() {
  let handle = null;

  function stop() {
    if (handle) {
      clearInterval(handle);
      handle = null;
    }
  }

  function start(seconds, onTick, onDone) {
    stop();
    let left = seconds | 0;
    onTick(left);

    handle = setInterval(() => {
      left--;
      if (left <= 0) {
        left = 0;
        onTick(left);
        stop();
        onDone();
        return;
      }
      onTick(left);
    }, 1000);

    return () => left;
  }

  return { stop, start };
}
