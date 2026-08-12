/* 第10章《数学概念与方法》专属配置与交互 */
window.LESSON_CONFIG = {
  storageKey: 'acm-ch10-v1',
  title: '第10章《数学概念与方法》学习记录',
  downloadName: '第10章_数学概念与方法_学习记录.txt',
  problemTotal: 4,
  quizExplanations: {
    pre1: ['正确。gcd(a,b) 用辗转相除，复杂度 O(log max(a,b))。','不对。欧几里德算法（辗转相除）是 O(log)。'],
    pre2: ['正确。埃氏筛：从小到大，把每个素数的倍数标记为合数。','不对。筛法是把每个素数的倍数标记掉。'],
    pre3: ['正确。10^9 % 7：快速幂把指数拆成二进制，只需约 30 次乘法。','不对。快速幂二进制拆分指数，log 级别次乘法。'],
    pre4: ['正确。杨辉三角第 n 行第 k 个就是组合数 C(n,k)。','不对。杨辉三角就是组合数的表格。'],
    pre5: ['正确。取模只影响结果，不影响算法复杂度，但能防溢出。','不对。取模是为了防止溢出，不影响复杂度。'],
    'quiz-gcd': ['正确。gcd(12,18)=6，是 12 和 18 的最大公约数。','不对。12 和 18 的最大公约数是 6。'],
    'quiz-sieve': ['正确。从 2 开始，把 2 的倍数 4、6、8…标掉，第一个没被标的是 3。','不对。2 是最小的素数，先标掉它的倍数。'],
    'quiz-pow': ['正确。3^4 = (3^2)^2 = 81。','不对。3^4 = 81。'],
    'quiz-comb': ['正确。C(5,2) = 5×4/2 = 10。','不对。C(5,2)=5!/(2!3!)=10。']
  },
  exportSections: [
    { title: '预诊断', type: 'quiz', keys: ['pre1', 'pre2', 'pre3', 'pre4', 'pre5'] },
    { title: '课堂小测', type: 'quiz', keys: ['quiz-gcd', 'quiz-sieve', 'quiz-pow', 'quiz-comb'] },
    { title: '训练与口诀', type: 'text', keys: ['p1-answer', 'p2-answer', 'p3-answer', 'finish-method'] },
    { title: '错因记录', type: 'text', keys: ['mistake-log'] },
    { title: '本章总结', type: 'text', keys: ['final-summary'] }
  ],
  completionTexts: [
    { min: 88, html: '<strong>掌握较稳。</strong>gcd、筛法、快速幂与组合数都清楚了，可以进入第11章图论。' },
    { min: 70, html: '<strong>基础理解。</strong>能写 gcd 和快速幂，但筛法与组合数还不熟，建议重做训练 1–3。' },
    { min: 45, html: '<strong>初步上手。</strong>先回看「数论初步」和「快速幂」两节，再重做训练。' },
    { min: 0, html: '<strong>尚未通关。</strong>先回到「数论初步」小节，把 gcd 和筛法亲手写一遍。' }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  /* 可视化1：埃氏筛 2..30 */
  const sieveStage = document.getElementById('sieveStage');
  if (sieveStage) {
    const N = 30;
    const isPrime = Array(N + 1).fill(true);
    isPrime[0] = isPrime[1] = false;
    let p = 1;
    const cells = document.querySelectorAll('[data-sieve-cell]');
    const logEl = document.getElementById('sieveLog');
    const btn = document.getElementById('sieveNext');
    const findNext = () => { let i = p + 1; while (i <= N && !isPrime[i]) i++; return i; };
    const render = () => {
      const cur = findNext();
      cells.forEach((el, k) => {
        const v = k + 2;
        if (v > N) { el.style.visibility = 'hidden'; return; }
        el.style.visibility = 'visible';
        el.classList.toggle('prime', isPrime[v]);
        el.classList.toggle('marked', !isPrime[v]);
        el.classList.toggle('current', v === cur);
      });
      if (logEl) {
        if (p === 1) logEl.textContent = '从 2 开始。2 是素数，标掉它的倍数。';
        else if (cur > N) logEl.textContent = '筛完了！剩下的都是素数。';
        else logEl.textContent = `当前素数 ${cur}：把它的倍数 ${cur*2}、${cur*3}… 标为合数。`;
      }
      if (btn) btn.textContent = cur > N ? '重置' : `筛掉 ${findNext()} 的倍数`;
    };
    const step = () => {
      if (p > N) { isPrime.fill(true); isPrime[0] = isPrime[1] = false; p = 1; }
      else {
        p = findNext();
        if (p > N) return;
        for (let m = p * p; m <= N; m += p) isPrime[m] = false;
      }
      render();
    };
    if (btn) btn.onclick = step;
    render();
  }

  /* 可视化2：杨辉三角 */
  const pascalStage = document.getElementById('pascalStage');
  if (pascalStage) {
    let rows = 0;
    const box = document.getElementById('pascalBox');
    const logEl = document.getElementById('pascalLog');
    const btn = document.getElementById('pascalNext');
    const render = () => {
      box.innerHTML = '';
      const C = [];
      for (let i = 0; i < rows; i++) {
        C[i] = [];
        const rowEl = document.createElement('div');
        rowEl.style.cssText = 'display:flex;gap:6px;justify-content:center;flex-wrap:wrap';
        for (let j = 0; j <= i; j++) {
          C[i][j] = (j === 0 || j === i) ? 1 : C[i - 1][j - 1] + C[i - 1][j];
          const d = document.createElement('span');
          d.textContent = C[i][j];
          d.style.cssText = 'border:1px solid var(--line);background:var(--sage-soft);border-radius:8px;padding:4px 12px;font-weight:800;font-family:ui-monospace,Consolas,monospace';
          rowEl.appendChild(d);
        }
        box.appendChild(rowEl);
      }
      if (logEl) logEl.textContent = rows === 0 ? '点击生成下一行。' : `第 ${rows} 行：${C[rows - 1].join(' ')}。第 n 行第 k 个 = C(n, k)。`;
      if (btn) btn.textContent = rows >= 6 ? '重置' : '生成下一行';
    };
    const step = () => { if (rows >= 6) rows = 0; else rows++; render(); };
    if (btn) btn.onclick = step;
    render();
  }
});
