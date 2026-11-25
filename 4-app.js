/* واجهة — ربط الواجهة بالمنطق والتخزين المحلي. */
(function () {
  const DATA = window.WAJHA_DATA;
  const L = window.WAJHA_LOGIC;
  const KEY = 'wajha.done';

  function loadDone() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }
  function saveDone(arr) {
    localStorage.setItem(KEY, JSON.stringify(arr));
  }

  function renderChallenge(combo, label) {
    document.getElementById('challenge-label').textContent = label;
    document.getElementById('challenge-text').textContent = L.challengeText(combo);
    document.getElementById('c-client').textContent = combo.client;
    document.getElementById('c-screen').textContent = combo.screen;
    document.getElementById('c-audience').textContent = combo.audience;
    document.getElementById('c-constraint').textContent = combo.constraint;
  }

  function renderStreak() {
    const t = L.todayStr();
    const res = L.computeStreak(loadDone(), t);
    document.getElementById('streak-count').textContent = res.streak;
    const btn = document.getElementById('done-btn');
    btn.disabled = res.doneToday;
    btn.textContent = res.doneToday ? 'تمارين النهاردة خلصت ✓' : 'خلصت تمرين النهاردة';
  }

  function renderGlossary(filter) {
    const q = (filter || '').trim().toLowerCase();
    const list = DATA.glossary.filter(function (g) {
      if (!q) return true;
      return g.en.toLowerCase().indexOf(q) !== -1 ||
             g.ar.indexOf(q) !== -1 ||
             g.desc.indexOf(q) !== -1;
    });
    const box = document.getElementById('glossary-list');
    box.innerHTML = '';
    list.forEach(function (g) {
      const item = document.createElement('div');
      item.className = 'g-item';
      const h = document.createElement('h3');
      h.textContent = g.en + ' — ' + g.ar;
      const p = document.createElement('p');
      p.textContent = g.desc;
      item.appendChild(h);
      item.appendChild(p);
      box.appendChild(item);
    });
    document.getElementById('glossary-count').textContent = list.length + ' مصطلح';
  }

  function init() {
    const today = L.todayStr();
    document.getElementById('today-date').textContent = today;
    renderChallenge(L.dailyCombo(today, DATA), 'تمرين النهاردة');
    renderStreak();
    renderGlossary('');

    document.getElementById('shuffle-btn').addEventListener('click', function () {
      renderChallenge(L.randomCombo(DATA), 'تمرين إضافي');
    });
    document.getElementById('done-btn').addEventListener('click', function () {
      const arr = loadDone();
      if (arr.indexOf(today) === -1) { arr.push(today); saveDone(arr); }
      renderStreak();
    });
    document.getElementById('glossary-search').addEventListener('input', function (e) {
      renderGlossary(e.target.value);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
