/* 第7章《暴力求解法》专属配置与交互 */
window.LESSON_CONFIG = {
  storageKey: 'acm-ch07-v1',
  title: '第7章《暴力求解法》学习记录',
  downloadName: '第7章_暴力求解法_学习记录.txt',
  problemTotal: 4,
  quizExplanations: {
    pre1: ['正确。n 个不同元素的排列有 n! 个，4! = 24。','不对。全排列个数是 n!，4 个元素是 4×3×2×1=24。'],
    pre2: ['正确。1 2 3 的下一个字典序排列是 1 3 2。','不对。下一个排列要找到能变大的最小变化：1 3 2。'],
    pre3: ['正确。二进制法：n 个元素的子集共有 2^n 个。','不对。子集个数是 2^n，3 个元素有 8 个子集。'],
    pre4: ['正确。回溯法在发现当前路径不可能时，撤销选择回到上一步继续尝试。','不对。回溯的核心就是「走不通就退回去换条路」。'],
    pre5: ['正确。暴力 + 剪枝：枚举所有候选，但用条件提前砍掉明显不行的分支。','不对。暴力求解法的核心就是枚举 + 剪枝。'],
    'quiz-perm': ['正确。按字典序，1 2 3 之后是 1 3 2，再 2 1 3。','不对。字典序下一个是 1 3 2，第三个是 2 1 3。'],
    'quiz-subset': ['正确。3 个元素的子集有 2^3=8 个（含空集）。','不对。子集数是 2 的 n 次方，3 个元素是 8 个。'],
    'quiz-queen': ['正确。第1行第1列放了皇后后，第2行第1列同列冲突。','不对。同一列上已经有一个皇后了，会互相攻击。'],
    'quiz-np': ['正确。n 皇后问题是一个 NP 问题，没有已知的多项式算法，只能枚举+剪枝。','不对。n 皇后没有多项式解法，属于 NP 问题。']
  },
  exportSections: [
    { title: '预诊断', type: 'quiz', keys: ['pre1', 'pre2', 'pre3', 'pre4', 'pre5'] },
    { title: '课堂小测', type: 'quiz', keys: ['quiz-perm', 'quiz-subset', 'quiz-queen', 'quiz-np'] },
    { title: '训练与口诀', type: 'text', keys: ['p1-answer', 'p2-answer', 'p3-answer', 'finish-method'] },
    { title: '错因记录', type: 'text', keys: ['mistake-log'] },
    { title: '本章总结', type: 'text', keys: ['final-summary'] }
  ],
  completionTexts: [
    { min: 88, html: '<strong>掌握较稳。</strong>枚举、排列、子集与回溯的套路都清楚了，可以进入第8章高效算法设计。' },
    { min: 70, html: '<strong>基础理解。</strong>能写简单枚举，但回溯和剪枝还不熟，建议重做训练 1–3。' },
    { min: 45, html: '<strong>初步上手。</strong>先回看「枚举排列」和「回溯法」两节，再重做训练。' },
    { min: 0, html: '<strong>尚未通关。</strong>先回到「简单枚举」小节，把全排列程序亲手跑一遍。' }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  /* 可视化1：next_permutation 1 2 3 */
  const permStage = document.getElementById('permStage');
  if (permStage) {
    const perms = [['1','2','3'],['1','3','2'],['2','1','3'],['2','3','1'],['3','1','2'],['3','2','1']];
    let idx = 0;
    const box = document.getElementById('permBox');
    const log = document.getElementById('permLog');
    const btn = document.getElementById('permNext');
    const render = () => {
      box.innerHTML = '';
      perms[idx].forEach(v => {
        const d = document.createElement('span');
        d.textContent = v;
        d.style.cssText = 'border:1px solid var(--line);background:var(--sage-soft);border-radius:9px;padding:8px 16px;font-weight:800;font-family:ui-monospace,Consolas,monospace;font-size:20px';
        box.appendChild(d);
      });
      if (log) log.textContent = `第 ${idx + 1} / 6 个排列：${perms[idx].join(' ')}${idx === 0 ? '（初始排列）' : '（next_permutation 得到）'}`;
      if (btn) btn.textContent = idx >= perms.length - 1 ? '重置' : '下一个排列';
    };
    const step = () => { if (idx >= perms.length - 1) idx = 0; else idx++; render(); };
    if (btn) btn.onclick = step;
    render();
  }

  /* 可视化2：四皇后冲突检测 */
  const queenStage = document.getElementById('queenStage');
  if (queenStage) {
    const N = 4;
    const queens = [];
    const board = document.getElementById('queenBoard');
    const log = document.getElementById('queenLog');
    const resetBtn = document.getElementById('queenReset');
    const attack = (r, c) => queens.some(q => q[0] === r || q[1] === c || Math.abs(q[0] - r) === Math.abs(q[1] - c));
    const render = () => {
      board.innerHTML = '';
      for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
          const cell = document.createElement('button');
          cell.type = 'button';
          cell.style.cssText = `width:64px;height:64px;border:1px solid var(--line);border-radius:10px;font-size:24px;font-weight:800;background:${(r + c) % 2 ? 'var(--surface-soft)' : 'var(--surface-strong)'};color:var(--sage-deep)`;
          const q = queens.find(q => q[0] === r && q[1] === c);
          if (q) {
            cell.textContent = '♛';
            cell.style.background = 'var(--sage)';
            cell.style.color = '#fff';
          } else if (attack(r, c)) {
            cell.style.boxShadow = 'inset 0 0 0 2px var(--rose)';
          }
          cell.onclick = () => {
            const i = queens.findIndex(q => q[0] === r && q[1] === c);
            if (i >= 0) queens.splice(i, 1);
            else queens.push([r, c]);
            render();
          };
          board.appendChild(cell);
        }
      }
      const ok = queens.length === N && !queens.some((q, i) => queens.slice(i + 1).some(p => attack2(q, p)));
      function attack2(a, b) { return a[0] === b[0] || a[1] === b[1] || Math.abs(a[0] - b[0]) === Math.abs(a[1] - b[1]); }
      if (log) log.textContent = queens.length === N && ok ? '🎉 成功！4 个皇后互不攻击，这是 4 皇后问题的一个解。' : `已放 ${queens.length} 个皇后。红色框表示会被攻击的位置；点击可放置/移除。目标：放满 4 个且互不攻击。`;
    };
    if (resetBtn) resetBtn.onclick = () => { queens.length = 0; render(); };
    render();
  }
});
