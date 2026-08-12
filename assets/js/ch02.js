/* 第2章《循环结构程序设计》专属配置与交互 */
window.LESSON_CONFIG = {
  storageKey: 'acm-ch02-v1',
  title: '第2章《循环结构程序设计》学习记录',
  downloadName: '第2章_循环结构_学习记录.txt',
  problemTotal: 4,
  quizExplanations: {
    pre1: [
      '正确。i 从 1 到 n 执行 n 次，最后一次 i=n 仍满足 i<=n。',
      '不对。for 的循环次数取决于条件 i<=n：从 1 数到 n，一共 n 次。'
    ],
    pre2: [
      '正确。i 从 1 累加到 10，和为 1+2+...+10=55。',
      '不对。这是 1 到 10 的累加，和是 55，不是 50 或 45。'
    ],
    pre3: [
      '正确。while 先判断后执行；i 从 1 开始，最后一次 i=5 满足条件，执行 5 次。',
      '不对。while(条件) 是条件成立才执行，i=1,2,3,4,5 共 5 次。'
    ],
    pre4: [
      '正确。do-while 先执行一次再判断，所以至少执行 1 次。',
      '不对。do-while 的特点是先做后判，循环体至少执行一次。'
    ],
    pre5: [
      '正确。循环里 i%2==0 时才输出，1..5 中的偶数是 2 和 4。',
      '不对。只有满足 i%2==0（偶数）才输出，1..5 里是 2 和 4。'
    ],
    'quiz-for': [
      '正确。i=1,2,3 时进入循环，i=4 不满足 i<=3，所以输出 1 2 3。',
      '不对。for(i=1;i<=3;i++) 输出 i=1,2,3 三个数，注意换行是每行一个。'
    ],
    'quiz-sum': [
      '正确。每次循环 s += i，等价于 1+2+3+4+5=15。',
      '不对。s 的初值是 0，依次加上 1..5，结果是 15。'
    ],
    'quiz-eof': [
      '正确。while(scanf("%d",&x)==1) 每成功读入一个整数就进入循环，读不到数据时返回 EOF 结束。',
      '不对。scanf 的返回值是成功读入的变量个数，读不到时为 EOF，这正是多组数据输入的写法。'
    ],
    'quiz-nested': [
      '正确。外层 3 次、内层 3 次，printf 共执行 3×3=9 次。',
      '不对。嵌套循环执行次数是外层×内层，即 3×3=9 次。'
    ]
  },
  exportSections: [
    { title: '预诊断', type: 'quiz', keys: ['pre1', 'pre2', 'pre3', 'pre4', 'pre5'] },
    { title: '课堂小测', type: 'quiz', keys: ['quiz-for', 'quiz-sum', 'quiz-eof', 'quiz-nested'] },
    { title: '训练与口诀', type: 'text', keys: ['p1-answer', 'p2-answer', 'p3-answer', 'finish-method'] },
    { title: '错因记录', type: 'text', keys: ['mistake-log'] },
    { title: '本章总结', type: 'text', keys: ['final-summary'] }
  ],
  completionTexts: [
    { min: 88, html: '<strong>掌握较稳。</strong>循环的三种写法、累加与输入框架都能独立完成，可以进入第3章数组和字符串。' },
    { min: 70, html: '<strong>基础理解。</strong>能跟随示例写循环，但独立设计循环条件仍不稳，建议把训练 1–3 闭卷重做。' },
    { min: 45, html: '<strong>初步上手。</strong>先回看「for 循环三要素」和「while(scanf...) 输入框架」，再重做训练。' },
    { min: 0, html: '<strong>尚未通关。</strong>先回到「for 循环」小节，亲手把累加程序敲一遍。' }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  /* 可视化：for 循环累加 1+2+3+4+5 */
  const sumStage = document.getElementById('sumStage');
  if (sumStage) {
    const N = 5;
    let i = 0, s = 0, done = false;
    const iEl = document.getElementById('sumI');
    const sEl = document.getElementById('sumS');
    const logEl = document.getElementById('sumLog');
    const bars = document.querySelectorAll('[data-sum-bar]');
    const btn = document.getElementById('sumNext');
    const render = () => {
      if (iEl) iEl.textContent = i > N ? '—' : String(i);
      if (sEl) sEl.textContent = String(s);
      if (logEl) {
        if (done) logEl.textContent = '循环结束：s = 15，输出结果 15。';
        else if (i === 0) logEl.textContent = '初始化：i = 1，s = 0。';
        else if (i <= N) logEl.textContent = `第 ${i} 次循环：s += ${i}，s 变成 ${s}；然后 i++ 使 i = ${i + 1}。`;
        else logEl.textContent = '判断 i <= 5 不成立，退出循环。';
      }
      bars.forEach((b, idx) => {
        const active = !done && idx < i && idx < N;
        b.classList.toggle('filled', active);
        b.textContent = active ? String(idx + 1) : '';
      });
      if (btn) btn.textContent = done ? '重置' : i === 0 ? '执行第一次循环' : '继续执行';
    };
    const step = () => {
      if (done) { i = 0; s = 0; done = false; }
      else if (i <= N) { i++; if (i <= N) s += i; }
      if (i > N && s === 15) done = true;
      render();
    };
    if (btn) btn.onclick = step;
    render();
  }

  /* 可视化：while 读入直到 0 */
  const readStage = document.getElementById('readStage');
  if (readStage) {
    const inputs = ['5', '3', '8', '0'];
    let idx = 0;
    const valEl = document.getElementById('readVal');
    const logEl = document.getElementById('readLog');
    const btn = document.getElementById('readNext');
    const render = () => {
      const done2 = idx >= inputs.length;
      if (valEl) valEl.textContent = done2 ? '—' : inputs[idx];
      if (logEl) {
        if (done2) logEl.textContent = '读到 0，条件 x!=0 不成立，循环结束。';
        else if (idx === 0) logEl.textContent = '初始化：读入第一个数。';
        else logEl.textContent = `读到 ${inputs[idx]}，x != 0 成立，进入循环体处理，再读下一个数。`;
      }
      if (btn) btn.textContent = done2 ? '重置' : '读下一个数';
    };
    const step = () => {
      if (idx >= inputs.length) idx = 0;
      else idx++;
      render();
    };
    if (btn) btn.onclick = step;
    render();
  }
});
