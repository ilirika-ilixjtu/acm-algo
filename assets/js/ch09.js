/* 第9章《动态规划初步》专属配置与交互 */
window.LESSON_CONFIG = {
  storageKey: 'acm-ch09-v1',
  title: '第9章《动态规划初步》学习记录',
  downloadName: '第9章_动态规划初步_学习记录.txt',
  problemTotal: 4,
  quizExplanations: {
    pre1: ['正确。动态规划的核心是「用子问题的答案推出大问题的答案」，关键是定义好状态。','不对。DP 的关键是状态定义与转移，不是枚举。'],
    pre2: ['正确。数字三角形从底往上算，dp[i][j] = a[i][j] + max(下, 右下)。','不对。答案是 7+3+8+7+5=30，走 7→3→8→7→5。'],
    pre3: ['正确。记忆化搜索 = 递归 + 记录算过的结果，避免重复计算。','不对。记忆化就是把递归的结果存起来，下次直接查。'],
    pre4: ['正确。0-1 背包每个物品最多拿一次，递推式 dp[j]=max(dp[j], dp[j-w]+v)。','不对。0-1 背包每个物品选或不选，状态是容量。'],
    pre5: ['正确。重叠子问题让暴力递归指数爆炸，DP 用表格避免重复计算。','不对。重叠子问题是 DP 的价值所在：算一次存起来。'],
    'quiz-tri': ['正确。从底向上：8+7 与 8+5 中取大，路径和是 30。','不对。最长路径是 7→3→8→7→5，和为 30。'],
    'quiz-knapsack': ['正确。容量 4，选 1 号和 2 号：价值 3+2=5（重量 3），最优。','不对。最优是拿第1、2件：重量 3、价值 5。'],
    'quiz-memo': ['正确。fib(5) 若每个子问题只算一次，只做 5 次加法。','不对。记忆化后每个 fib(i) 只算一次，共约 5 次加法。'],
    'quiz-state': ['正确。定义状态 dp[i][j] 表示前 i 个物品、容量 j 的最大价值，这就是 0-1 背包的状态。','不对。状态 dp[i][j] 是前 i 件物品容量 j 的最大价值。']
  },
  exportSections: [
    { title: '预诊断', type: 'quiz', keys: ['pre1', 'pre2', 'pre3', 'pre4', 'pre5'] },
    { title: '课堂小测', type: 'quiz', keys: ['quiz-tri', 'quiz-knapsack', 'quiz-memo', 'quiz-state'] },
    { title: '训练与口诀', type: 'text', keys: ['p1-answer', 'p2-answer', 'p3-answer', 'finish-method'] },
    { title: '错因记录', type: 'text', keys: ['mistake-log'] },
    { title: '本章总结', type: 'text', keys: ['final-summary'] }
  ],
  completionTexts: [
    { min: 88, html: '<strong>掌握较稳。</strong>状态定义、递推与记忆化都清楚了，0-1 背包也拿下了，可以进入第10章数学。' },
    { min: 70, html: '<strong>基础理解。</strong>能跟着例题写递推，但自己定义状态还不稳，建议重做训练 1–3。' },
    { min: 45, html: '<strong>初步上手。</strong>先回看「数字三角形」和「0-1 背包」两节，再重做训练。' },
    { min: 0, html: '<strong>尚未通关。</strong>先回到「数字三角形」小节，把递推表亲手填一遍。' }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  /* 可视化1：数字三角形从底向上 */
  const triStage = document.getElementById('triStage');
  if (triStage) {
    const a = [[7], [3, 8], [8, 1, 0], [2, 7, 4, 4], [4, 5, 2, 6, 5]];
    const n = a.length;
    const dp = a.map(row => row.slice());
    let row = n - 2;
    let col = -1;
    const cells = document.querySelectorAll('[data-tri-cell]');
    const logEl = document.getElementById('triLog');
    const outEl = document.getElementById('triOut');
    const btn = document.getElementById('triNext');
    const render = () => {
      cells.forEach((el, k) => {
        const i = Math.floor(k / n), j = k % n;
        if (j > i) { el.style.visibility = 'hidden'; return; }
        el.style.visibility = 'visible';
        el.textContent = dp[i][j];
        const base = a[i][j];
        const isNew = dp[i][j] !== base;
        el.classList.toggle('computed', isNew);
        el.classList.toggle('pick', i === row && j === col);
      });
      if (logEl) {
        if (row < 0) logEl.textContent = '完成！从底向上填完，顶端 dp[0][0] = 30。';
        else if (col < 0) logEl.textContent = `第 ${row + 1} 行开始（从下往上数第 ${n - row} 层）。`;
        else logEl.textContent = `dp[${row}][${col}] = ${a[row][col]} + max(${dp[row + 1][col]}, ${dp[row + 1][col + 1]}) = ${dp[row][col]}。`;
      }
      if (outEl) outEl.textContent = '最大路径和：' + dp[0][0];
      if (btn) btn.textContent = row < 0 ? '重置' : '下一步';
    };
    const step = () => {
      if (row < 0) {
        dp.forEach((r, i) => { for (let j = 0; j <= i; j++) dp[i][j] = a[i][j]; });
        row = n - 2; col = -1;
      } else {
        col++;
        if (col > row) { row--; col = -1; }
        else dp[row][col] = a[row][col] + Math.max(dp[row + 1][col], dp[row + 1][col + 1]);
      }
      render();
    };
    if (btn) btn.onclick = step;
    render();
  }

  /* 可视化2：0-1 背包 */
  const knapStage = document.getElementById('knapStage');
  if (knapStage) {
    const items = [[2, 3], [1, 2], [3, 4]];  // (w, v)
    const W = 4, n = items.length;
    const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));
    let i = 0, j = 0;
    const cells = document.querySelectorAll('[data-knap-cell]');
    const logEl = document.getElementById('knapLog');
    const btn = document.getElementById('knapNext');
    const render = () => {
      cells.forEach((el, k) => {
        const r = Math.floor(k / (W + 1)), c = k % (W + 1);
        el.textContent = dp[r][c];
        el.classList.toggle('pick', r === i + 1 && c === j);
      });
      if (logEl) {
        if (i >= n) logEl.textContent = '填表完成！dp[3][4] = 5，最优价值是 5（选第 1、2 件）。';
        else logEl.textContent = `第 ${i + 1} 件物品(w=${items[i][0]},v=${items[i][1]})，容量 ${j}：dp = max(不选 ${dp[i][j]}, 选 ${j >= items[i][0] ? dp[i][j - items[i][0]] + items[i][1] : '—'}) = ${dp[i + 1][j]}。`;
      }
      if (btn) btn.textContent = i >= n ? '重置' : '填下一个格子';
    };
    const step = () => {
      if (i >= n) { i = 0; j = 0; dp.forEach((r, ri) => r.fill(0)); }
      else {
        if (j > W) { i++; j = 0; }
        else {
          dp[i + 1][j] = dp[i][j];
          if (j >= items[i][0]) dp[i + 1][j] = Math.max(dp[i + 1][j], dp[i][j - items[i][0]] + items[i][1]);
          j++;
        }
      }
      render();
    };
    if (btn) btn.onclick = step;
    render();
  }
});
