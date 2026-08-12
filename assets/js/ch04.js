/* 第4章《函数和递归》专属配置与交互 */
window.LESSON_CONFIG = {
  storageKey: 'acm-ch04-v1',
  title: '第4章《函数和递归》学习记录',
  downloadName: '第4章_函数和递归_学习记录.txt',
  problemTotal: 4,
  quizExplanations: {
    pre1: [
      '正确。函数名字前面的 int 是返回类型，return 0 把 0 交回给调用者。',
      '不对。int 是返回类型，说明这个函数返回一个整数。'
    ],
    pre2: [
      '正确。C 默认按值传递：f(a) 里改的是副本，外面的 a 不受影响。',
      '不对。值传递只把 a 的值复制给形参，函数里改形参不影响外面的 a。'
    ],
    pre3: [
      '正确。必须有递归出口（不再调用自己的条件），否则会无限递归。',
      '不对。没有出口会无限递归下去，直到栈溢出崩溃。'
    ],
    pre4: [
      '正确。fac(4)=4×fac(3)=4×3×fac(2)=4×3×2×fac(1)=4×3×2×1=24。',
      '不对。阶乘 4! = 4×3×2×1 = 24。'
    ],
    pre5: [
      '正确。每次调用都要在栈上占一块空间，递归太深会把栈耗尽。',
      '不对。栈溢出是递归层数太多、把有限的内存栈占满了。'
    ],
    'quiz-prime': [
      '正确。只要在 2 到 sqrt(x) 之间找到一个能整除的，x 就不是素数。',
      '不对。for 里 i*i<=x 的意思是检查到根号 x 就够，找到一个因子就返回 0。'
    ],
    'quiz-swap': [
      '正确。传指针才能改到外面变量的值，*pa、*pb 才是真正的 a、b。',
      '不对。swap(&a,&b) 传的是地址，函数里 *pa=*pb 才能交换真正的 a、b。'
    ],
    'quiz-fib': [
      '正确。f(3)=f(2)+f(1)=1+1=2，所以 fib(5)=5。',
      '不对。斐波那契 0 1 1 2 3 5，第 5 项是 5。'
    ],
    'quiz-debug': [
      '正确。小规模递归可以，递归深度太大（如 10 万层）会栈溢出。',
      '不对。递归有栈深度上限，几万层就会爆栈。'
    ]
  },
  exportSections: [
    { title: '预诊断', type: 'quiz', keys: ['pre1', 'pre2', 'pre3', 'pre4', 'pre5'] },
    { title: '课堂小测', type: 'quiz', keys: ['quiz-prime', 'quiz-swap', 'quiz-fib', 'quiz-debug'] },
    { title: '训练与口诀', type: 'text', keys: ['p1-answer', 'p2-answer', 'p3-answer', 'finish-method'] },
    { title: '错因记录', type: 'text', keys: ['mistake-log'] },
    { title: '本章总结', type: 'text', keys: ['final-summary'] }
  ],
  completionTexts: [
    { min: 88, html: '<strong>掌握较稳。</strong>函数定义、参数传递、递归出口都清楚了，可以进入第5章 C++ 与 STL。' },
    { min: 70, html: '<strong>基础理解。</strong>能写简单函数，但参数传递和递归追踪还不稳，建议重做训练 1–3。' },
    { min: 45, html: '<strong>初步上手。</strong>先回看「值传递 vs 指针」和「递归出口」两节，再重做训练。' },
    { min: 0, html: '<strong>尚未通关。</strong>先回到「自定义函数」小节，亲手把判断素数的函数敲一遍。' }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  /* 可视化：递归调用栈 fac(4) */
  const recStage = document.getElementById('recStage');
  if (recStage) {
    const steps = [
      { log: 'main 调用 fac(4)，在栈上压入 fac(4) 的帧。', stack: ['fac(4)'], ret: '' },
      { log: 'fac(4) 发现 n!=0，递归调用 fac(3)，压栈。', stack: ['fac(4)', 'fac(3)'], ret: '' },
      { log: 'fac(3) 递归调用 fac(2)，压栈。', stack: ['fac(4)', 'fac(3)', 'fac(2)'], ret: '' },
      { log: 'fac(2) 递归调用 fac(1)，压栈。', stack: ['fac(4)', 'fac(3)', 'fac(2)', 'fac(1)'], ret: '' },
      { log: 'fac(1) 递归调用 fac(0)，压栈。', stack: ['fac(4)', 'fac(3)', 'fac(2)', 'fac(1)', 'fac(0)'], ret: '' },
      { log: 'fac(0) 命中递归出口 n==0，返回 1，弹出 fac(0)。', stack: ['fac(4)', 'fac(3)', 'fac(2)', 'fac(1)'], ret: 'fac(0) → 1' },
      { log: 'fac(1) = 1×1 = 1，返回，弹出 fac(1)。', stack: ['fac(4)', 'fac(3)', 'fac(2)'], ret: 'fac(1) → 1' },
      { log: 'fac(2) = 2×1 = 2，返回，弹出 fac(2)。', stack: ['fac(4)', 'fac(3)'], ret: 'fac(2) → 2' },
      { log: 'fac(3) = 3×2 = 6，返回，弹出 fac(3)。', stack: ['fac(4)'], ret: 'fac(3) → 6' },
      { log: 'fac(4) = 4×6 = 24，返回给 main，弹出 fac(4)。', stack: [], ret: 'fac(4) → 24' }
    ];
    let idx = 0;
    const stackEl = document.getElementById('recStack');
    const logEl = document.getElementById('recLog');
    const retEl = document.getElementById('recRet');
    const btn = document.getElementById('recNext');
    const render = () => {
      const s = steps[idx];
      stackEl.innerHTML = '';
      s.stack.forEach(name => {
        const d = document.createElement('div');
        d.textContent = name;
        d.style.cssText = 'border:1px solid var(--line);background:var(--surface);border-radius:10px;padding:8px 14px;font-family:ui-monospace,Consolas,monospace;font-weight:700';
        stackEl.appendChild(d);
      });
      if (logEl) logEl.textContent = s.log;
      if (retEl) retEl.textContent = s.ret || ' ';
      if (btn) btn.textContent = idx >= steps.length - 1 ? '重置' : '下一步';
    };
    const step = () => {
      if (idx >= steps.length - 1) idx = 0;
      else idx++;
      render();
    };
    if (btn) btn.onclick = step;
    render();
  }

  /* 可视化：值传递 vs 指针 */
  const swapStage = document.getElementById('swapStage');
  if (swapStage) {
    const run = (mode) => {
      const box = document.getElementById('swapBox');
      const log = document.getElementById('swapLog');
      const a = document.getElementById('swapA');
      const b = document.getElementById('swapB');
      if (mode === 'value') {
        log.textContent = '按值传：函数里交换的是副本，外面的 a=3、b=5 不变。';
      } else {
        log.textContent = '按指针传：函数通过地址直接改真正的 a、b，交换成功！';
      }
      box.innerHTML = '';
      const mk = (label, val, color) => {
        const d = document.createElement('div');
        d.style.cssText = `border:1px solid var(--line);background:${color};border-radius:10px;padding:10px 16px;text-align:center;font-weight:800`;
        d.innerHTML = `<span style="color:var(--muted);font-size:12px;display:block">${label}</span><span style="font-size:20px">${val}</span>`;
        return d;
      };
      const newA = mode === 'pointer' ? '5' : '3';
      const newB = mode === 'pointer' ? '3' : '5';
      box.appendChild(mk('a（调用后）', newA, 'var(--sage-soft)'));
      box.appendChild(mk('b（调用后）', newB, 'var(--rose-soft)'));
    };
    const bv = document.getElementById('swapValue');
    const bp = document.getElementById('swapPointer');
    if (bv) bv.onclick = () => run('value');
    if (bp) bp.onclick = () => run('pointer');
    run('value');
  }
});
