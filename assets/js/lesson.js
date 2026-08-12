(() => {
  const cfg = window.LESSON_CONFIG || {};
  const LS = cfg.storageKey || 'acm-lesson';
  const memoryData = {};
  const memoryStorage = {
    getItem: key => Object.prototype.hasOwnProperty.call(memoryData, key) ? memoryData[key] : null,
    setItem: (key, value) => { memoryData[key] = String(value); },
    removeItem: key => { delete memoryData[key]; }
  };
  let storage = memoryStorage;
  try {
    const testKey = '__acm_storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    storage = window.localStorage;
  } catch (e) {
    console.info('本地存储不可用，已切换为本次打开期间的临时存储。');
  }
  const state = JSON.parse(storage.getItem(LS) || '{}');
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const saveState = () => storage.setItem(LS, JSON.stringify(state));
  const toast = (msg) => {
    const el = $('#toast'); if (!el) return;
    el.textContent = msg; el.classList.add('show');
    clearTimeout(window.__toast); window.__toast = setTimeout(() => el.classList.remove('show'), 1800);
  };

  // Theme
  const setTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    state.theme = theme; saveState();
    const t = $('#themeToggle'); if (t) t.textContent = theme === 'dark' ? '切换纸雾' : '切换夜雾';
  };
  setTheme(state.theme || 'light');
  const themeToggle = $('#themeToggle');
  if (themeToggle) themeToggle.onclick = () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  const mobileTheme = $('#mobileTheme');
  if (mobileTheme) mobileTheme.onclick = themeToggle ? themeToggle.onclick : () => {};

  // Timer
  let elapsed = Number(state.elapsed || 0);
  let running = false;
  let tickHandle = null;
  const fmt = (sec) => [Math.floor(sec / 3600), Math.floor(sec % 3600 / 60), sec % 60].map(v => String(v).padStart(2, '0')).join(':');
  const renderTimer = () => {
    const d = $('#timerDisplay'); if (d) d.textContent = fmt(elapsed);
    const m = $('#mobileTimer'); if (m) m.textContent = fmt(elapsed);
  };
  const tick = () => { elapsed += 1; state.elapsed = elapsed; if (elapsed % 5 === 0) saveState(); renderTimer(); };
  const startTimer = () => { if (running) return; running = true; tickHandle = setInterval(tick, 1000); toast('计时开始，专注完成当前模块'); };
  const pauseTimer = () => { running = false; clearInterval(tickHandle); saveState(); toast('已暂停'); };
  const resetTimer = () => { pauseTimer(); elapsed = 0; state.elapsed = 0; saveState(); renderTimer(); };
  const bind = (id, fn) => { const el = document.getElementById(id); if (el) el.onclick = fn; };
  bind('timerStart', startTimer); bind('mobileStart', startTimer);
  bind('timerPause', pauseTimer); bind('mobilePause', pauseTimer);
  bind('timerReset', resetTimer);
  renderTimer();

  // Generic saved fields
  $$('[data-save]').forEach(el => {
    const key = el.dataset.save;
    if (state.fields && state.fields[key] !== undefined) el.value = state.fields[key];
    el.addEventListener('input', () => { state.fields ||= {}; state.fields[key] = el.value; saveState(); });
  });
  $$('[data-save-check]').forEach(el => {
    const key = el.dataset.saveCheck;
    el.checked = !!(state.checks && state.checks[key]);
    el.addEventListener('change', () => { state.checks ||= {}; state.checks[key] = el.checked; saveState(); calculateFinal(false); });
  });

  // Section completion & progress
  const sections = $$('section.lesson');
  const renderProgress = () => {
    const done = sections.filter(sec => { const cb = $('.section-check', sec); return cb && cb.checked; }).length;
    const pt = $('#progressText'); if (pt) pt.textContent = `${done} / ${sections.length}`;
    const pf = $('#progressFill'); if (pf) pf.style.width = `${done / sections.length * 100}%`;
    $$('#sideNav .nav-link').forEach((a, i) => a.classList.toggle('done', !!sections[i] && !!$('.section-check', sections[i]) && $('.section-check', sections[i]).checked));
  };
  sections.forEach(sec => {
    const key = sec.dataset.section;
    const cb = $('.section-check', sec);
    if (!cb) return;
    cb.checked = !!(state.sections && state.sections[key]);
    cb.addEventListener('change', () => { state.sections ||= {}; state.sections[key] = cb.checked; saveState(); renderProgress(); calculateFinal(false); });
  });
  renderProgress();

  // Active nav
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          $$('#sideNav .nav-link').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
        }
      });
    }, { rootMargin: '-25% 0px -65% 0px' });
    sections.forEach(sec => observer.observe(sec));
  }

  // Quizzes
  const quizExplanations = cfg.quizExplanations || {};
  $$('.quiz').forEach(q => {
    const id = q.dataset.quiz;
    if (!id) return;
    if (state.quiz && state.quiz[id]) {
      const r = $(`input[value="${state.quiz[id].choice}"]`, q); if (r) r.checked = true;
      const fb = $('.feedback', q); if (fb) { fb.textContent = state.quiz[id].msg; fb.className = 'feedback show ' + (state.quiz[id].ok ? 'good' : 'bad'); }
    }
    const btn = $('.quiz-check', q);
    if (btn) btn.addEventListener('click', () => {
      const checked = $('input:checked', q); const fb = $('.feedback', q);
      if (!fb) return;
      if (!checked) { fb.textContent = '请先选择一个答案。'; fb.className = 'feedback show bad'; return; }
      const ok = checked.value === q.dataset.correct;
      const exp = quizExplanations[id] || ['回答正确，继续。', '还不对，回看上面讲解再试一次。'];
      const msg = ok ? exp[0] : exp[1];
      fb.textContent = msg; fb.className = 'feedback show ' + (ok ? 'good' : 'bad');
      state.quiz ||= {}; state.quiz[id] = { choice: checked.value, ok, msg }; saveState(); calculateFinal(false);
    });
  });

  // Step example (one step at a time)
  $$('[data-stepper]').forEach(holder => {
    const stepEls = $$('.step', holder);
    if (!stepEls.length) return;
    const btn = $('.stepper-next', holder);
    const key = holder.dataset.stepper;
    let idx = Number((state.steps || {})[key] || 0);
    const render = () => {
      stepEls.forEach((s, i) => s.classList.toggle('visible', i < idx));
      if (btn) {
        btn.textContent = idx >= stepEls.length ? '已显示全部步骤' : `显示第 ${idx + 1} 步`;
        btn.disabled = idx >= stepEls.length;
      }
    };
    if (btn) btn.onclick = () => { if (idx < stepEls.length) { idx++; state.steps ||= {}; state.steps[key] = idx; saveState(); render(); } };
    render();
  });

  // Reveal / solution / hint toggles
  window.toggleId = id => { const el = document.getElementById(id); if (el) el.classList.toggle('show'); };
  window.showSolution = id => { const el = document.getElementById(id); if (el) { el.classList.add('show'); toast('请看完后闭卷重做一次'); } };
  $$('[data-reveal]').forEach(btn => btn.onclick = () => { const el = document.getElementById(btn.dataset.reveal); if (el) el.classList.toggle('show'); });

  // Collapsible blocks
  $$('[data-collapse]').forEach(btn => {
    btn.onclick = () => {
      const wrap = btn.closest('.collapse-wrap') || document.getElementById(btn.dataset.collapse);
      if (wrap) wrap.classList.toggle('open');
    };
  });

  // Code copy
  window.copyCode = async (btn) => {
    const targetId = btn.dataset.copy;
    const codeEl = targetId ? document.getElementById(targetId) : btn.closest('.code-block')?.querySelector('code');
    if (!codeEl) return;
    let text = codeEl.innerText;
    try { await navigator.clipboard.writeText(text); toast('代码已复制'); }
    catch (e) {
      const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); toast('代码已复制'); } catch (e2) { toast('复制失败，请手动选择'); }
      ta.remove();
    }
  };

  // Generic prompt copy
  window.copyText = async id => {
    const el = document.getElementById(id); if (!el) return;
    const text = el.innerText;
    try { await navigator.clipboard.writeText(text); toast('提示词已复制'); }
    catch (e) {
      const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); toast('提示词已复制');
    }
  };

  // Numeric / exact-output checking
  function valBySaveKey(key) { const el = $(`[data-save="${key}"]`); return el ? el.value.trim().replace(/，/g, ',') : ''; }
  window.checkNumeric = (key, ans, fbid, goodMsg, badMsg) => {
    const raw = valBySaveKey(key);
    const v = Number(raw.replace(/pi/ig, String(Math.PI)));
    const fb = document.getElementById(fbid);
    const ok = raw !== '' && Number.isFinite(v) && Math.abs(v - ans) < 1e-6;
    if (fb) { fb.textContent = ok ? (goodMsg || '结果正确。请继续核对书面步骤。') : (badMsg || '结果暂不正确，再检查一遍计算。'); fb.className = 'feedback show ' + (ok ? 'good' : 'bad'); }
    state.problem ||= {}; state.problem[key] = ok; saveState(); calculateFinal(false);
  };
  window.checkExact = (key, expected, fbid, goodMsg, badMsg, opts) => {
    opts = opts || {};
    let raw = valBySaveKey(key);
    let exp = String(expected);
    if (opts.caseInsensitive) { raw = raw.toLowerCase(); exp = exp.toLowerCase(); }
    if (opts.trim !== false) { raw = raw.replace(/\s+/g, ' ').trim(); exp = exp.replace(/\s+/g, ' ').trim(); }
    const fb = document.getElementById(fbid);
    const ok = raw === exp;
    if (fb) { fb.textContent = ok ? (goodMsg || '回答正确！') : (badMsg || '还不一致，检查输出格式（空格、换行、大小写）。'); fb.className = 'feedback show ' + (ok ? 'good' : 'bad'); }
    state.problem ||= {}; state.problem[key] = ok; saveState(); calculateFinal(false);
  };

  // Final score
  window.calculateFinal = (notify = true) => {
    const quizVals = Object.values(state.quiz || {});
    const quizCorrect = quizVals.filter(x => x.ok).length;
    const quizTotal = $$('.quiz').length || 1;
    const sectionDone = sections.filter(sec => { const cb = $('.section-check', sec); return cb && cb.checked; }).length;
    const checklistTotal = $$('[data-save-check]').length || 1;
    const checklistDone = $$('[data-save-check]').filter(x => x.checked).length;
    const problemTotal = cfg.problemTotal || 1;
    const problemCorrect = Object.values(state.problem || {}).filter(Boolean).length;
    const score = Math.round((quizCorrect / quizTotal * 25) + (sectionDone / sections.length * 25) + (checklistDone / checklistTotal * 25) + (problemCorrect / problemTotal * 25));
    const ring = $('#scoreRing');
    if (ring) { ring.style.background = `conic-gradient(var(--cyan) ${score * 3.6}deg, var(--panel-2) 0deg)`; }
    const sv = $('#scoreValue'); if (sv) sv.textContent = score + '%';
    const texts = cfg.completionTexts || [];
    let text = texts.find(t => score >= t.min) || { html: '<strong>继续加油。</strong>' };
    const lt = $('#levelText'); if (lt) lt.innerHTML = text.html;
    state.finalScore = score; saveState();
    if (notify) toast('已更新本章掌握度');
  };
  calculateFinal(false);

  // Export
  function buildRecord() {
    const lines = [];
    lines.push(cfg.title || '算法学习记录');
    lines.push('='.repeat(38));
    lines.push('学习时长：' + fmt(elapsed));
    lines.push('掌握度：' + (state.finalScore || 0) + '%');
    (cfg.exportSections || []).forEach(sec => {
      lines.push('');
      lines.push(sec.title + '：');
      sec.keys.forEach(k => {
        if (sec.type === 'quiz') lines.push(`- ${k}: ${state.quiz?.[k]?.ok ? '正确' : state.quiz?.[k] ? '错误' : '未答'}`);
        else lines.push(`- ${k}: ${state.fields?.[k] || '未填'}`);
      });
    });
    return lines.join('\n');
  }
  window.exportRecord = () => {
    const blob = new Blob([buildRecord()], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = cfg.downloadName || '算法学习记录.txt'; a.click(); URL.revokeObjectURL(a.href);
    toast('学习记录已导出');
  };
  bind('exportBtn', () => exportRecord());

  window.resetAllProgress = () => {
    if (!confirm('确定清空本页所有进度、答案和计时吗？')) return;
    storage.removeItem(LS); location.reload();
  };

  window.addEventListener('beforeunload', () => { state.elapsed = elapsed; saveState(); });
})();
