/* 第3章《数组和字符串》专属配置与交互 */
window.LESSON_CONFIG = {
  storageKey: 'acm-ch03-v1',
  title: '第3章《数组和字符串》学习记录',
  downloadName: '第3章_数组和字符串_学习记录.txt',
  problemTotal: 4,
  quizExplanations: {
    pre1: [
      '正确。C 数组下标从 0 开始，int a[5] 的下标范围是 0 到 4。',
      '不对。C 数组下标从 0 开始，int a[5] 有 a[0]…a[4]，没有 a[5]。'
    ],
    pre2: [
      '正确。C 不做下标越界检查，a[5] 可能悄悄改掉别的内存，程序结果不可预测。',
      '不对。越界不会报错，而是未定义行为——可能崩溃，也可能“看起来正常”但结果是错的。'
    ],
    pre3: [
      '正确。字符串以 \'\\0\' 结尾，strlen 数到 \\0 为止，所以 "abc" 的长度是 3。',
      '不对。strlen 数的是字符个数，"abc" 是 3；结尾的 \\0 不算长度但占内存。'
    ],
    pre4: [
      '正确。scanf("%s") 遇到空格、换行就会停下，所以它读不到带空格的字符串。',
      '不对。%s 以空白字符为分隔，遇到空格就停止，不能读整行。'
    ],
    pre5: [
      '正确。双指针 i 从头、j 从尾向中间比较，只要有一处不等就不是回文。',
      '不对。回文要首尾对应相等，用两个下标从两端向中间检查。'
    ],
    'quiz-array': [
      '正确。先假设 a[0] 最大，然后依次比较更新，最后 max=9。',
      '不对。max 从 a[0]=1 开始，逐个比较后应更新到 9。'
    ],
    'quiz-reverse': [
      '正确。首尾交换：a[0]↔a[4]、a[1]↔a[3]，得到 5 4 3 2 1。',
      '不对。翻转是首尾对调，1 2 3 4 5 翻转为 5 4 3 2 1。'
    ],
    'quiz-string': [
      '正确。strlen(s) 返回字符串长度，不含结尾的 \\0。',
      '不对。strlen 数到 \\0 为止，结果是 5。'
    ],
    'quiz-blackbox': [
      '正确。OJ 只关心你的程序对隐藏数据是否输出正确答案，不看过程。',
      '不对。OJ 用黑盒测试：只比对输出结果，不检查你怎么写的。'
    ]
  },
  exportSections: [
    { title: '预诊断', type: 'quiz', keys: ['pre1', 'pre2', 'pre3', 'pre4', 'pre5'] },
    { title: '课堂小测', type: 'quiz', keys: ['quiz-array', 'quiz-reverse', 'quiz-string', 'quiz-blackbox'] },
    { title: '训练与口诀', type: 'text', keys: ['p1-answer', 'p2-answer', 'p3-answer', 'finish-method'] },
    { title: '错因记录', type: 'text', keys: ['mistake-log'] },
    { title: '本章总结', type: 'text', keys: ['final-summary'] }
  ],
  completionTexts: [
    { min: 88, html: '<strong>掌握较稳。</strong>数组下标、最值与翻转、字符数组都能独立完成，可以进入第4章函数和递归。' },
    { min: 70, html: '<strong>基础理解。</strong>能跟随示例写数组程序，但越界和字符串细节仍要注意，建议重做训练 1–3。' },
    { min: 45, html: '<strong>初步上手。</strong>先回看「下标从 0 开始」和「\\0 结束符」两节，再重做训练。' },
    { min: 0, html: '<strong>尚未通关。</strong>先回到「一维数组」小节，亲手把求最值的程序敲一遍。' }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  /* 可视化：翻转数组 1 2 3 4 5 */
  const revStage = document.getElementById('revStage');
  if (revStage) {
    const arr = [1, 2, 3, 4, 5];
    let i = 0, j = arr.length - 1, done = false;
    const cells = document.querySelectorAll('[data-rev-cell]');
    const logEl = document.getElementById('revLog');
    const btn = document.getElementById('revNext');
    const outEl = document.getElementById('revOut');
    const render = () => {
      cells.forEach((c, k) => {
        c.textContent = arr[k];
        c.classList.toggle('swap', !done && (k === i || k === j));
      });
      if (logEl) {
        if (done) logEl.textContent = '完成！数组变成 5 4 3 2 1。';
        else if (i < j) logEl.textContent = `交换 a[${i}] 与 a[${j}]：${arr[i]} ↔ ${arr[j]}。然后 i++、j--。`;
        else logEl.textContent = `i(${i}) 不再小于 j(${j})，循环结束。`;
      }
      if (outEl) outEl.textContent = '当前数组：' + arr.join(' ');
      if (btn) btn.textContent = done ? '重置' : i < j ? '执行一次交换' : '结束循环';
    };
    const step = () => {
      if (done) { arr[0]=1; arr[1]=2; arr[2]=3; arr[3]=4; arr[4]=5; i=0; j=4; done=false; }
      else if (i < j) { const t = arr[i]; arr[i] = arr[j]; arr[j] = t; i++; j--; }
      else { done = true; }
      render();
    };
    if (btn) btn.onclick = step;
    render();
  }

  /* 可视化：字符频率统计 */
  const freqStage = document.getElementById('freqStage');
  if (freqStage) {
    const run = () => {
      const input = document.getElementById('freqInput');
      const s = input.value;
      const cnt = {};
      for (const ch of s) cnt[ch] = (cnt[ch] || 0) + 1;
      const out = document.getElementById('freqOut');
      const bar = document.getElementById('freqBar');
      const keys = Object.keys(cnt).sort();
      out.textContent = keys.length ? keys.map(k => `${k}:${cnt[k]}`).join('  ') : '输入一些字符看看统计结果';
      bar.innerHTML = '';
      const max = Math.max(1, ...Object.values(cnt));
      keys.forEach(k => {
        const d = document.createElement('div');
        d.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:4px';
        d.innerHTML = `<span style="font-weight:800;color:var(--sage-deep)">${cnt[k]}</span><div style="width:34px;height:${Math.round(cnt[k]/max*90)+8}px;background:var(--sage);border-radius:8px 8px 4px 4px"></div><span style="font-size:14px;color:var(--muted)">${k}</span>`;
        bar.appendChild(d);
      });
    };
    const btn = document.getElementById('freqRun');
    if (btn) btn.onclick = run;
    run();
  }
});
