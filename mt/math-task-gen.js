// math-task-gen.js
export function generateMathTasks(config, count = 1) {
  const OPS = new Set(["+", "-", "*", "/"]);

  function assert(cond, msg) {
    if (!cond) throw new Error(msg);
  }

  function toInt(v, name) {
    const n = Number(v);
    assert(Number.isFinite(n), `${name} must be finite`);
    assert(Number.isInteger(n), `${name} must be integer`);
    return n;
  }

  function normRange(r, name) {
    assert(r && typeof r === "object", `${name} must be {min,max}`);
    const min = r.min == null ? null : toInt(r.min, `${name}.min`);
    const max = r.max == null ? null : toInt(r.max, `${name}.max`);
    if (min != null && max != null)
      assert(min <= max, `${name}.min must be <= ${name}.max`);
    return { min, max };
  }

  function normOperators(arr) {
    assert(
      Array.isArray(arr) && arr.length > 0,
      `operators must be non-empty array`,
    );
    const ops = [];
    for (const o of arr) {
      assert(
        typeof o === "string" && o.length === 1,
        `operators must contain 1-char strings`,
      );
      assert(OPS.has(o), `unsupported operator: ${o}`);
      ops.push(o);
    }
    return ops;
  }

  function normFractionType(ft) {
    if (ft == null) return "n";
    assert(typeof ft === "string", `fractionType must be a string`);
    const v = ft.trim().toLowerCase();
    assert(v === "n" || v === "d", `fractionType must be "n" or "d"`);
    return v;
  }

  function randInt(min, max) {
    return (Math.random() * (max - min + 1) + min) | 0;
  }

  function pick(arr) {
    return arr[randInt(0, arr.length - 1)];
  }

  function shuffleInPlace(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = randInt(0, i);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      const t = a % b;
      a = b;
      b = t;
    }
    return a || 1;
  }

  function simplifyFrac(n, d) {
    assert(d !== 0, "division by zero");
    const sign = (n < 0) ^ (d < 0) ? -1 : 1;
    n = Math.abs(n);
    d = Math.abs(d);
    const g = gcd(n, d);
    n = (n / g) * sign;
    d = d / g;
    return { n, d };
  }

  function formatResult(result, fractionType) {
    if (result.kind === "int") return String(result.v);

    const { n, d } = simplifyFrac(result.n, result.d);

    if (fractionType === "d") return (n / d).toFixed(2);

    assert(n % d === 0, `non-integer result not allowed with fractionType="n"`);
    return String(n / d);
  }

  function withinLimitsNumber(x, lim) {
    if (lim.min != null && x < lim.min) return false;
    if (lim.max != null && x > lim.max) return false;
    return true;
  }

  function withinLimitsResult(res, lim) {
    if (res.kind === "int") return withinLimitsNumber(res.v, lim);

    const { n, d } = simplifyFrac(res.n, res.d);
    return withinLimitsNumber(n / d, lim);
  }

  function compute(A, B, op, fractionType) {
    switch (op) {
      case "+":
        return { kind: "int", v: A + B };
      case "-":
        return { kind: "int", v: A - B };
      case "*":
        return { kind: "int", v: A * B };
      case "/":
        if (B === 0) return null;
        if (fractionType === "n") {
          if (A % B !== 0) return null;
          return { kind: "int", v: A / B };
        }
        return { kind: "frac", n: A, d: B };
      default:
        return null;
    }
  }

  function buildTaskPool(cfg) {
    const rangeA = normRange(cfg.rangeA, "rangeA");
    const rangeB = normRange(cfg.rangeB, "rangeB");
    const resultLimits = normRange(cfg.resultLimits ?? {}, "resultLimits");
    const fractionType = normFractionType(cfg.fractionType);
    const operators = normOperators(cfg.operators);

    assert(
      rangeA.min != null && rangeA.max != null,
      "rangeA.min/max must be set",
    );
    assert(
      rangeB.min != null && rangeB.max != null,
      "rangeB.min/max must be set",
    );

    const pool = [];
    for (const op of operators) {
      for (let A = rangeA.min; A <= rangeA.max; A++) {
        for (let B = rangeB.min; B <= rangeB.max; B++) {
          const res = compute(A, B, op, fractionType);
          if (!res) continue;
          if (!withinLimitsResult(res, resultLimits)) continue;

          pool.push({
            A: String(A),
            B: String(B),
            C: formatResult(res, fractionType),
            O: op,
          });
        }
      }
    }
    return pool;
  }

  function makeEquationWithMissing(task, missingIndex) {
    if (missingIndex === 0) return [null, task.B, task.C, task.O];
    if (missingIndex === 1) return [task.A, null, task.C, task.O];
    return [task.A, task.B, null, task.O];
  }

  function determineCorrectValue(task, missingIndex) {
    if (missingIndex === 0) return task.A;
    if (missingIndex === 1) return task.B;
    return task.C;
  }

  function uniqueStrings(arr) {
    const s = new Set();
    const out = [];
    for (const x of arr) {
      const k = String(x);
      if (s.has(k)) continue;
      s.add(k);
      out.push(k);
    }
    return out;
  }

  function chooseMissingIndex(cfg) {
    const m = (cfg.missing ?? "random").toString().toUpperCase();
    if (m === "A") return 0;
    if (m === "B") return 1;
    if (m === "C") return 2;
    return randInt(0, 2);
  }

  function generateAnswers(pool, correct, totalAnswers, missingIndex, cfg) {
    const need = totalAnswers;
    const slot = missingIndex === 0 ? "A" : missingIndex === 1 ? "B" : "C";

    const out = [];
    const used = new Set();
    const add = (v) => {
      const s = String(v);
      if (!s || used.has(s)) return false;
      used.add(s);
      out.push(s);
      return true;
    };

    add(correct);

    // 1) same-slot candidates
    const slotCandidates = uniqueStrings(pool.map((t) => t[slot])).filter(
      (x) => x !== correct,
    );
    shuffleInPlace(slotCandidates);
    for (const x of slotCandidates) {
      if (out.length >= need) break;
      add(x);
    }

    // 2) numeric near-misses
    const correctNum = Number(correct);
    const isInt = Number.isFinite(correctNum) && Number.isInteger(correctNum);

    const r =
      slot === "A"
        ? cfg.rangeA
        : slot === "B"
          ? cfg.rangeB
          : (cfg.resultLimits ?? { min: 0, max: 100 });

    const min = r && r.min != null ? Number(r.min) : 0;
    const max = r && r.max != null ? Number(r.max) : 100;

    if (Number.isFinite(min) && Number.isFinite(max) && isInt) {
      for (let d = 1; out.length < need && d <= 40; d++) {
        const a = correctNum - d;
        const b = correctNum + d;
        if (a >= min && a <= max) add(a);
        if (out.length >= need) break;
        if (b >= min && b <= max) add(b);
      }
    }

    // 3) last resort: other slots
    if (out.length < need) {
      const extra = uniqueStrings(pool.flatMap((t) => [t.A, t.B, t.C])).filter(
        (x) => x !== correct,
      );
      shuffleInPlace(extra);
      for (const x of extra) {
        if (out.length >= need) break;
        add(x);
      }
    }

    // pad (always unique)
    let pad = 1;
    while (out.length < need) add(`${correct}~${pad++}`);

    return shuffleInPlace(out).slice(0, need);
  }

  // ---- PUBLIC BODY ----
  const totalAnswers =
    config.totalAnswers == null
      ? 4
      : toInt(config.totalAnswers, "totalAnswers");
  const n = toInt(count, "count");
  assert(n >= 1, "count must be >= 1");

  const pool = buildTaskPool(config);
  assert(pool.length > 0, "No valid tasks for given constraints");

  const out = [];
  for (let i = 0; i < n; i++) {
    const task = pick(pool);
    const missingIndex = chooseMissingIndex(config);

    const equation = makeEquationWithMissing(task, missingIndex);
    const correct = determineCorrectValue(task, missingIndex);
    const answers = generateAnswers(
      pool,
      correct,
      totalAnswers,
      missingIndex,
      config,
    );

    out.push({
      equation,
      answer: { correct, answers },
    });
  }

  return out;
}
