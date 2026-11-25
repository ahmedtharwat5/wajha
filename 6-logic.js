/* واجهة — منطق التمارين: اختيار تمرين اليوم (ثابت)، تمرين عشوائي، وحساب السلسلة. */
(function (root) {
  // FNV-1a hash → positive int
  function hashSeed(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function todayStr(d) {
    const now = d || new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  function pickIndex(seed, salt, len) {
    return (hashSeed(seed + '|' + salt)) % len;
  }

  // Deterministic combo for a given date string 'YYYY-MM-DD'
  function dailyCombo(dateStr, data) {
    return {
      client: data.clients[pickIndex(dateStr, 'c', data.clients.length)],
      screen: data.screens[pickIndex(dateStr, 's', data.screens.length)],
      audience: data.audiences[pickIndex(dateStr, 'a', data.audiences.length)],
      constraint: data.constraints[pickIndex(dateStr, 'k', data.constraints.length)]
    };
  }

  // Random combo; rand is a function returning [0,1)
  function randomCombo(data, rand) {
    const r = rand || Math.random;
    const pick = (arr) => arr[Math.floor(r() * arr.length)];
    return {
      client: pick(data.clients),
      screen: pick(data.screens),
      audience: pick(data.audiences),
      constraint: pick(data.constraints)
    };
  }

  // doneDates: array of 'YYYY-MM-DD'. Streak = consecutive days ending today (or yesterday if today not done yet).
  function computeStreak(doneDates, today) {
    const done = new Set(doneDates);
    const t = today || todayStr();
    const toDate = (s) => { const p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); };
    const fmt = (d) => todayStr(d);
    let cursor = toDate(t);
    let streak = 0;
    if (!done.has(fmt(cursor))) {
      cursor.setDate(cursor.getDate() - 1); // allow streak counted up to yesterday
    }
    while (done.has(fmt(cursor))) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return { streak: streak, doneToday: done.has(t) };
  }

  function challengeText(combo) {
    return 'صمم ' + combo.screen + ' لـ' + combo.client +
      '، موجّه لـ' + combo.audience +
      '، بشرط: ' + combo.constraint + '.';
  }

  const API = { hashSeed, todayStr, dailyCombo, randomCombo, computeStreak, challengeText };
  if (typeof module !== 'undefined' && module.exports) { module.exports = API; }
  else { root.WAJHA_LOGIC = API; }
})(typeof window !== 'undefined' ? window : globalThis);
