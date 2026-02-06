// --- Config presets (as per your spec) ---
const presets = {
  add: [],
  sub: [],
  basic: [],
  mul: [],
  div: [],
};

// Addition 1..10 (a fixed, b 0..10)
for (let n = 1; n <= 10; n++) {
  presets.add.push({
    label: String(n),
    secondsPerTask: 3,
    cfg: {
      rangeA: { min: n, max: n },
      rangeB: { min: 0, max: 10 },
      resultLimits: { min: null, max: null },
      operators: ["+"],
      fractionType: "n",
      totalAnswers: 4,
    },
  });
}
presets.add.push({
  label: "0 - 10",
  secondsPerTask: 3,
  cfg: {
    rangeA: { min: 0, max: 10 },
    rangeB: { min: 0, max: 10 },
    resultLimits: { min: 0, max: 10 },
    operators: ["+"],
    fractionType: "n",
    totalAnswers: 4,
  },
});
presets.add.push({
  label: "0 - 20",
  secondsPerTask: 4,
  cfg: {
    rangeA: { min: 0, max: 10 },
    rangeB: { min: 0, max: 10 },
    resultLimits: { min: 0, max: 20 },
    operators: ["+"],
    fractionType: "n",
    totalAnswers: 4,
  },
});
presets.add.push({
  label: "0 - 100",
  secondsPerTask: 7,
  cfg: {
    rangeA: { min: 0, max: 100 },
    rangeB: { min: 0, max: 100 },
    resultLimits: { min: 0, max: 100 },
    operators: ["+"],
    fractionType: "n",
    totalAnswers: 4,
  },
});

// Subtraction 1..10 (a fixed, b 0..10, op "-") -> keep results non-negative and within 0..10
for (let n = 1; n <= 10; n++) {
  presets.sub.push({
    label: String(n),
    secondsPerTask: 3,
    cfg: {
      rangeA: { min: 0, max: 10 },
      rangeB: { min: n, max: n },
      resultLimits: { min: 0, max: null },
      operators: ["-"],
      fractionType: "n",
      totalAnswers: 4,
    },
  });
}
presets.sub.push({
  label: "0 - 10",
  secondsPerTask: 3,
  cfg: {
    rangeA: { min: 0, max: 10 },
    rangeB: { min: 0, max: 10 },
    resultLimits: { min: 0, max: 10 },
    operators: ["-"],
    fractionType: "n",
    totalAnswers: 4,
  },
});
presets.sub.push({
  label: "0 - 20",
  secondsPerTask: 4,
  cfg: {
    rangeA: { min: 0, max: 10 },
    rangeB: { min: 0, max: 10 },
    resultLimits: { min: 0, max: 20 },
    operators: ["-"],
    fractionType: "n",
    totalAnswers: 4,
  },
});
presets.sub.push({
  label: "0 - 100",
  secondsPerTask: 7,
  cfg: {
    rangeA: { min: 0, max: 100 },
    rangeB: { min: 0, max: 100 },
    resultLimits: { min: 0, max: 100 },
    operators: ["-"],
    fractionType: "n",
    totalAnswers: 4,
  },
});

// Basic math ( + and - )
presets.basic.push({
  label: "0 - 10",
  secondsPerTask: 3,
  cfg: {
    rangeA: { min: 0, max: 10 },
    rangeB: { min: 0, max: 10 },
    resultLimits: { min: 0, max: 10 },
    operators: ["+", "-"],
    fractionType: "n",
    totalAnswers: 4,
  },
});
presets.basic.push({
  label: "0 - 20",
  secondsPerTask: 4,
  cfg: {
    rangeA: { min: 0, max: 10 },
    rangeB: { min: 0, max: 10 },
    resultLimits: { min: 0, max: 20 },
    operators: ["+", "-"],
    fractionType: "n",
    totalAnswers: 4,
  },
});
presets.basic.push({
  label: "0 - 100",
  secondsPerTask: 7,
  cfg: {
    rangeA: { min: 0, max: 100 },
    rangeB: { min: 0, max: 100 },
    resultLimits: { min: 0, max: 100 },
    operators: ["+", "-"],
    fractionType: "n",
    totalAnswers: 4,
  },
});

// Multiplication 2..9 (a fixed, b 0..10)
for (let n = 2; n <= 9; n++) {
  presets.mul.push({
    label: String(n),
    secondsPerTask: 4,
    cfg: {
      rangeA: { min: n, max: n },
      rangeB: { min: 0, max: 10 },
      resultLimits: { min: 0, max: 100 },
      operators: ["*"],
      fractionType: "n",
      totalAnswers: 4,
    },
  });
}

// Division 2..9 (integer division only; avoids non-integers)
for (let n = 2; n <= 9; n++) {
  presets.div.push({
    label: String(n),
    secondsPerTask: 4,
    cfg: {
      rangeA: { min: n, max: n * 10 }, // IMPORTANT to include range to 100
      rangeB: { min: n, max: n },
      resultLimits: { min: 0, max: 100 },
      operators: ["/"],
      fractionType: "n",
      totalAnswers: 4,
    },
  });
}

export const PRESETS = Object.freeze(presets);
