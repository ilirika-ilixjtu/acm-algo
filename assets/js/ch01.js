/* 第1章《程序设计入门》专属配置与交互 */
window.LESSON_CONFIG = {
  storageKey: 'acm-ch01-v1',
  title: '第1章《程序设计入门》学习记录',
  downloadName: '第1章_程序设计入门_学习记录.txt',
  problemTotal: 4,
  quizExplanations: {
    pre1: [
      '正确。C 语言里两个 int 相除做整数除法，结果取整数部分，8/5 等于 1。',
      '不对。8 和 5 都是 int，整数除法直接丢弃小数部分，结果是 1，不是 1.6。'
    ],
    pre2: [
      '正确。printf 的 %d 会输出整数 3-4 的值，也就是 -1。',
      '不对。%d 是格式占位符，3-4 会被先算出结果再输出，答案是 -1。'
    ],
    pre3: [
      '正确。把 3 放进变量 a，要用赋值语句 a = 3;（注意分号）。',
      '不对。a == 3 是比较是否相等，不是赋值；3 = a 把常量放左边会编译报错。'
    ],
    pre4: [
      '正确。先用临时变量 t 保存 a，再把 b 给 a，最后把 t 给 b，完成交换。',
      '不对。直接 a=b; b=a; 会让两个变量都变成原来的 b。'
    ],
    pre5: [
      '正确。x % 2 是 x 除以 2 的余数，奇数 % 2 一定等于 1。',
      '不对。判断奇偶要用取余运算符 %，看余数是不是 1。'
    ],
    'quiz-express': [
      '正确。两个 int 相除结果是整数，8/5 输出 1；想得到 1.6 必须写成 8.0/5.0 并配合 %.1f。',
      '不对。8/5 是整数除法，结果为 1；浮点结果要写 8.0/5.0。'
    ],
    'quiz-variable': [
      '正确。int 相除丢弃小数，5/2=2，% 取余 5%2=1，所以输出 2 1。',
      '不对。5/2 整数除法等于 2，5%2 等于 1，注意 %d 之间那个空格。'
    ],
    'quiz-sequence': [
      '正确。n/100 取百位 1，n/10%10 取十位 2，n%10 取个位 3，按 个、十、百 输出得到 321。',
      '不对。三个表达式分别取出百位、十位、个位，输出顺序是 个位→百位，答案是 321。'
    ],
    'quiz-branch': [
      '正确。x%2==1 时 x 是奇数，进入 if 分支，输出 ODD。',
      '不对。7%2 等于 1，条件 7%2==1 成立，输出的是 ODD。'
    ]
  },
  exportSections: [
    { title: '预诊断', type: 'quiz', keys: ['pre1', 'pre2', 'pre3', 'pre4', 'pre5'] },
    { title: '课堂小测', type: 'quiz', keys: ['quiz-express', 'quiz-variable', 'quiz-sequence', 'quiz-branch'] },
    { title: '训练与口诀', type: 'text', keys: ['p1-answer', 'p2-answer', 'p3-answer', 'finish-method'] },
    { title: '错因记录', type: 'text', keys: ['mistake-log'] },
    { title: '本章总结', type: 'text', keys: ['final-summary'] }
  ],
  completionTexts: [
    { min: 88, html: '<strong>掌握较稳。</strong>本章核心概念与常见题型都能独立完成，可以进入第2章循环结构了。' },
    { min: 70, html: '<strong>基础理解。</strong>能跟随讲解完成，但独立解题仍不稳定，建议明天把训练 1–3 闭卷重做一遍。' },
    { min: 45, html: '<strong>初步上手。</strong>先把「整数除法」「三变量交换」「if/else 判断」三块回看，再重做训练。' },
    { min: 0, html: '<strong>尚未通关。</strong>先回到「算术表达式」小节，亲手把每段代码敲一遍再继续。' }
  ]
};

document.addEventListener('DOMContentLoaded', () => {

  /* ===== 交互 1：整数除法 vs 浮点除法 ===== */
  const divStage = document.getElementById('divStage');
  if (divStage) {
    const data = {
      int85: {
        label: '8 / 5（整数）', code: 'printf("%d\\n", 8/5);',
        steps: ['两个操作数都是 int → 执行整数除法', '8 ÷ 5 = 商 1，余 3（小数部分被丢弃）', 'printf 按 %d 输出：1'],
        value: 1, markerX: 95
      },
      float85: {
        label: '8.0 / 5.0（浮点）', code: 'printf("%.1f\\n", 8.0/5.0);',
        steps: ['只要有一个操作数是 double → 先转成浮点再除', '8.0 ÷ 5.0 = 1.6（保留小数）', 'printf 按 %.1f 保留 1 位小数输出：1.6'],
        value: 1.6, markerX: 140
      },
      int72: {
        label: '7 / 2（整数）', code: 'printf("%d\\n", 7/2);',
        steps: ['7 和 2 都是 int → 整数除法', '7 ÷ 2 = 商 3（余 1）', 'printf 按 %d 输出：3'],
        value: 3, markerX: 245
      },
      mod72: {
        label: '7 % 2（取余）', code: 'printf("%d\\n", 7%2);',
        steps: ['% 是取余运算符，返回整除后的余数', '7 ÷ 2 = 3 余 1，余数为 1', 'printf 按 %d 输出：1'],
        value: 1, markerX: 95
      }
    };
    const keys = ['int85', 'float85', 'int72', 'mod72'];
    let current = 'int85';
    const logEl = document.getElementById('divLog');
    const codeEl = document.getElementById('divCode');
    const marker = document.getElementById('divMarker');
    const markerLabel = document.getElementById('divMarkerLabel');
    const resultEl = document.getElementById('divResult');
    const render = () => {
      const d = data[current];
      document.querySelectorAll('[data-div-btn]').forEach(b => b.classList.toggle('primary', b.dataset.divBtn === current));
      if (codeEl) codeEl.textContent = d.code;
      if (logEl) logEl.textContent = d.steps.map((s, i) => `${i + 1}. ${s}`).join('\n');
      if (marker) marker.setAttribute('x', d.markerX);
      if (markerLabel) { markerLabel.setAttribute('x', d.markerX); markerLabel.textContent = '结果 ' + d.value; }
      if (resultEl) resultEl.textContent = '输出：' + d.value;
    };
    keys.forEach(k => {
      const b = document.querySelector(`[data-div-btn="${k}"]`);
      if (b) b.onclick = () => { current = k; render(); };
    });
    render();
  }

  /* ===== 交互 2：三位数反转 执行流程 ===== */
  const revStage = document.getElementById('revStage');
  if (revStage) {
    const lines = [
      { text: 'int n = 123;', note: '读入一个三位数 n = 123' },
      { text: 'int a = n / 100;', note: 'a = 123 / 100 = 1（百位）' },
      { text: 'int b = n / 10 % 10;', note: 'b = 123/10%10 = 12%10 = 2（十位）' },
      { text: 'int c = n % 10;', note: 'c = 123 % 10 = 3（个位）' },
      { text: 'printf("%d%d%d\\n", c, b, a);', note: '依次输出 3、2、1 → 屏幕上出现 321' }
    ];
    let idx = 0;
    const lineEls = document.querySelectorAll('[data-rev-line]');
    const valEls = { a: document.getElementById('revA'), b: document.getElementById('revB'), c: document.getElementById('revC') };
    const noteEl = document.getElementById('revNote');
    const outEl = document.getElementById('revOut');
    const btn = document.getElementById('revNext');
    const render = () => {
      lineEls.forEach((el, i) => el.classList.toggle('active', i === idx - 1));
      const vals = { a: '—', b: '—', c: '—', out: '' };
      if (idx >= 1) vals.a = '1';
      if (idx >= 2) vals.b = '2';
      if (idx >= 3) vals.c = '3';
      if (idx >= 5) vals.out = '输出：321';
      if (valEls.a) valEls.a.textContent = vals.a;
      if (valEls.b) valEls.b.textContent = vals.b;
      if (valEls.c) valEls.c.textContent = vals.c;
      if (outEl) outEl.textContent = vals.out;
      if (noteEl) noteEl.textContent = idx === 0 ? '点击「执行下一步」，看程序一行一行地跑。' : lines[idx - 1].note;
      if (btn) { btn.textContent = idx >= lines.length ? '重置' : '执行下一步'; btn.disabled = false; }
    };
    const step = () => {
      if (idx >= lines.length) { idx = 0; }
      else { idx++; }
      render();
    };
    if (btn) btn.onclick = step;
    render();
  }

  /* ===== 交互 3：分支判断可视化（奇偶 + 成绩等级） ===== */
  const branchStage = document.getElementById('branchStage');
  if (branchStage) {
    const run = () => {
      const input = document.getElementById('branchInput');
      const v = Number(input.value);
      const flow = document.getElementById('branchFlow');
      const out = document.getElementById('branchOut');
      let txt = '';
      if (Number.isInteger(v)) {
        if (v % 2 === 0) txt = `%2 == 0 成立 → 输出 "EVEN"（${v} 是偶数）`;
        else txt = `%2 == 0 不成立 → 走 else → 输出 "ODD"（${v} 是奇数）`;
      } else {
        txt = '请输入一个整数。';
      }
      flow.textContent = `输入 ${input.value} → 判断 v % 2 == 0`;
      out.textContent = txt;
    };
    const btn = document.getElementById('branchRun');
    if (btn) btn.onclick = run;
    run();
  }
});
