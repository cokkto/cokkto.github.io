// ======================= app.js =======================
import { PRESETS } from "./presets.js";
import { generateMathTasks } from "./math-task-gen.js";
import { qs, showOnly, setText } from "./dom.js";
import { makeChip, refreshAllSelections, fillChips } from "./ui.js";
import { flashWrong, flashCorrect, resetAnswerButtonVisuals } from "./fx.js";
import { fmtTime, createCountdown } from "./time.js";

(function () {
  // ---------- DOM ----------
  const elViewStart = qs("viewStart");
  const elViewTrain = qs("viewTrain");
  const elViewDone = qs("viewDone");

  const btnStart = qs("btnStart");
  const btnBack1 = qs("btnBack1");
  const btnBack2 = qs("btnBack2");

  const elTimer = qs("timer");
  const elProgress = qs("progress");
  const elTask = qs("task");

  const elScoreText = qs("scoreText");
  const elScoreTime = qs("scoreTime");
  const elBadge = qs("badge");

  const ansBtns = [qs("a0"), qs("a1"), qs("a2"), qs("a3")];

  const pickCount = qs("pickCount");
  const pickTimer = qs("pickTimer");
  const pickAdd = qs("pickAdd");
  const pickSub = qs("pickSub");
  const pickBasic = qs("pickBasic");
  const pickMul = qs("pickMul");
  const pickDiv = qs("pickDiv");

  const panels = [elViewStart, elViewTrain, elViewDone];

  // ---------- STATE ----------
  const presets = structuredClone(PRESETS);

  const state = {
    totalTests: 30,
    timerOn: false,
    selectedPresetKey: "basic",
    selectedPresetIndex: 1,

    tasks: [],
    i: 0,
    correct: 0,

    secondsPerTask: 4,
    secondsLeft: 0,
    startedAtMs: 0,
    endedAtMs: 0,
  };

  const countdown = createCountdown();

  // ---------- UTILS ----------
  function eqToText(eq) {
    const [A, B, C, O] = eq;
    const a = A == null ? "__" : String(A);
    const b = B == null ? "__" : String(B);
    const c = C == null ? "__" : String(C);
    return `${a} ${O} ${b} = ${c}`;
  }

  function updateProgress() {
    setText(
      elProgress,
      `${Math.min(state.i + 1, state.tasks.length)} / ${state.tasks.length}`
    );
  }

  function selectPreset(key, idx) {
    state.selectedPresetKey = key;
    state.selectedPresetIndex = idx;
  }

  function getSelectedPreset() {
    const arr = presets[state.selectedPresetKey] || [];
    return arr[state.selectedPresetIndex] || null;
  }

  // ---------- SELECTION UI ----------
  const refreshSelections = () =>
    refreshAllSelections([
      pickCount,
      pickTimer,
      pickAdd,
      pickSub,
      pickBasic,
      pickMul,
      pickDiv,
    ]);

  function buildSelectionUI() {
    // counts
    fillChips(
      pickCount,
      [10, 30, 50],
      (c) =>
        makeChip(
          String(c),
          () => (state.totalTests = c),
          () => state.totalTests === c,
          refreshSelections
        )
    );

    // timer
    fillChips(
      pickTimer,
      [
        { label: "Päällä", val: true },
        { label: "Pois", val: false },
      ],
      (t) =>
        makeChip(
          t.label,
          () => (state.timerOn = t.val),
          () => state.timerOn === t.val,
          refreshSelections
        )
    );

    function fill(container, key) {
      const arr = presets[key] || [];
      fillChips(
        container,
        arr.map((p, idx) => ({ ...p, idx })),
        (p) =>
          makeChip(
            p.label,
            () => selectPreset(key, p.idx),
            () =>
              state.selectedPresetKey === key &&
              state.selectedPresetIndex === p.idx,
            refreshSelections
          )
      );
    }

    fill(pickAdd, "add");
    fill(pickSub, "sub");
    fill(pickBasic, "basic");
    fill(pickMul, "mul");
    fill(pickDiv, "div");

    refreshSelections();
  }

  // ---------- GAME ----------
  function renderCurrent() {
    resetAnswerButtonVisuals(ansBtns);

    const t = state.tasks[state.i];
    setText(elTask, eqToText(t.equation));

    const answers = t.answer?.answers ?? [];

    ansBtns.forEach((b, idx) => {
      const v = answers[idx] ?? "";
      setText(b, v);
      b.dataset.value = v;
      b.disabled = !v;
    });

    updateProgress();
  }

  function finish() {
    countdown.stop();
    state.endedAtMs = Date.now();

    const total = state.tasks.length;
    const plannedTotal = state.totalTests * state.secondsPerTask;

    const usedSec = state.timerOn
      ? plannedTotal - state.secondsLeft
      : Math.max(
          0,
          Math.round((state.endedAtMs - state.startedAtMs) / 1000)
        );

    const pct = total ? state.correct / total : 0;

    let msg = "Kokeile uudelleen.";
    if (pct >= 0.95) msg = "Erinomaista! Olet valmis.";
    else if (pct >= 0.85) msg = "Hienoa työtä! Jatka samaan malliin.";
    else if (pct >= 0.7) msg = "Hyvä! Vielä vähän harjoitusta.";
    else msg = "Tarvitset lisää harjoitusta. Älä luovuta.";

    setText(elScoreTime, `Aika: ${fmtTime(usedSec)}`);
    setText(elScoreText, `${state.correct} / ${total}`);
    setText(elBadge, msg);

    showOnly(elViewDone, panels);
  }

  function nextOrFinish() {
    state.i++;
    if (state.i >= state.tasks.length) return finish();
    renderCurrent();
  }

  function startGame() {
    const preset = getSelectedPreset();
    if (!preset) return;

    state.secondsPerTask = preset.secondsPerTask ?? 4;

    const cfg = structuredClone(preset.cfg);
    cfg.totalAnswers = 4;

    state.tasks = generateMathTasks(cfg, state.totalTests);
    state.i = 0;
    state.correct = 0;

    state.secondsLeft = state.totalTests * state.secondsPerTask;
    state.startedAtMs = Date.now();

    if (state.timerOn) {
      countdown.start(
        state.secondsLeft,
        (s) => {
          state.secondsLeft = s;
          setText(elTimer, fmtTime(s));
        },
        finish
      );
    } else {
      setText(elTimer, "--:--");
    }

    showOnly(elViewTrain, panels);
    renderCurrent();
  }

  function resetToStart() {
    countdown.stop();

    state.tasks = [];
    state.i = 0;
    state.correct = 0;
    state.secondsLeft = 0;

    setText(elTask, "__");
    setText(elTimer, "--:--");
    setText(elProgress, `0 / ${state.totalTests}`);

    showOnly(elViewStart, panels);
  }

  // ---------- ANSWERS ----------
  ansBtns.forEach((b) => {
    b.addEventListener("click", () => {
      const t = state.tasks[state.i];
      const chosen = String(b.dataset.value ?? "");
      const isCorrect =
        t && t.answer && String(t.answer.correct) === chosen;

      if (!state.timerOn) {
        if (!isCorrect) return flashWrong(b);

        state.correct++;
        flashCorrect(b);
        setTimeout(nextOrFinish, 500);
        return;
      }

      if (isCorrect) state.correct++;
      nextOrFinish();
    });
  });

  // ---------- EVENTS ----------
  btnStart.addEventListener("click", startGame);
  btnBack1.addEventListener("click", resetToStart);
  btnBack2.addEventListener("click", resetToStart);

  // ---------- INIT ----------
  buildSelectionUI();
  resetToStart();
})();
