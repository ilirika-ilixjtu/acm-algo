/* 第5章《C++与STL入门》专属配置与交互 */
window.LESSON_CONFIG = {
  storageKey: 'acm-ch05-v1',
  title: '第5章《C++与STL入门》学习记录',
  downloadName: '第5章_Cpp与STL_学习记录.txt',
  problemTotal: 4,
  quizExplanations: {
    pre1: [
      '正确。cin / cout 在 <iostream> 里，还要 using namespace std;。',
      '不对。cin/cout 属于 <iostream>，不是 stdio.h。'
    ],
    pre2: [
      '正确。C++ 的引用是变量的别名，函数里改 x 就是改外面的 a。',
      '不对。引用是别名，int &x = a 后 x 和 a 是同一个变量。'
    ],
    pre3: [
      '正确。C++ 的 string 可以直接用 ==、+、< 比较和拼接，不用 strcmp。',
      '不对。string 类型重载了运算符，直接写 s1 + s2、s1 == s2 即可。'
    ],
    pre4: [
      '正确。v.push_back(x) 把 x 加到末尾，size 变成 3。',
      '不对。push_back 是在末尾追加，不会覆盖已有元素。'
    ],
    pre5: [
      '正确。set 自动去重并保持有序，插入重复元素会被忽略。',
      '不对。set 的关键特性就是去重 + 有序。'
    ],
    'quiz-cpp': [
      '正确。cout << 会输出 3 5，两个数之间用空格隔开。',
      '不对。cout << a << " " << b 输出 a、空格、b，即 3 5。'
    ],
    'quiz-vector': [
      '正确。push_back 了 3 个元素，v.size() 是 3。',
      '不对。初始为空，push_back 三次后 size 是 3。'
    ],
    'quiz-set': [
      '正确。set 去重：{1,2,3,4,5} 去重后是 1 2 3 4 5。',
      '不对。set 自动去重，1 只出现一次，结果是 1 2 3 4 5。'
    ],
    'quiz-map': [
      '正确。m["a"]=1，m["b"]=2，所以 m["a"] 是 1。',
      '不对。键值对是 a→1、b→2，m["a"] 是 1。'
    ]
  },
  exportSections: [
    { title: '预诊断', type: 'quiz', keys: ['pre1', 'pre2', 'pre3', 'pre4', 'pre5'] },
    { title: '课堂小测', type: 'quiz', keys: ['quiz-cpp', 'quiz-vector', 'quiz-set', 'quiz-map'] },
    { title: '训练与口诀', type: 'text', keys: ['p1-answer', 'p2-answer', 'p3-answer', 'finish-method'] },
    { title: '错因记录', type: 'text', keys: ['mistake-log'] },
    { title: '本章总结', type: 'text', keys: ['final-summary'] }
  ],
  completionTexts: [
    { min: 88, html: '<strong>掌握较稳。</strong>C++ 语法与 vector/set/map 的用法都清楚了，可以进入基础篇第6章数据结构。' },
    { min: 70, html: '<strong>基础理解。</strong>能用 cin/cout 和基本容器，但容器选型和接口还不熟，建议重做训练 1–3。' },
    { min: 45, html: '<strong>初步上手。</strong>先回看「引用与 string」和「vector/set/map」两节，再重做训练。' },
    { min: 0, html: '<strong>尚未通关。</strong>先回到「从 C 到 C++」小节，把第一个 C++ 程序敲一遍。' }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  /* 可视化：vector 与 set 对比演示 */
  const stlStage = document.getElementById('stlStage');
  if (stlStage) {
    const nums = [5, 3, 8, 3, 1];
    let idx = 0;
    const vec = [];
    const setv = new Set();
    const vecEl = document.getElementById('stlVec');
    const setEl = document.getElementById('stlSet');
    const logEl = document.getElementById('stlLog');
    const btn = document.getElementById('stlNext');
    const render = () => {
      const mk = (arr, order) => {
        const box = document.createElement('div');
        box.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;align-items:center';
        (order === 'asc' ? [...arr].sort((a, b) => a - b) : arr).forEach(v => {
          const d = document.createElement('span');
          d.textContent = v;
          d.style.cssText = 'border:1px solid var(--line);background:var(--surface);border-radius:9px;padding:6px 12px;font-weight:700;font-family:ui-monospace,Consolas,monospace';
          box.appendChild(d);
        });
        if (!arr.length) { box.textContent = '（空）'; box.style.color = 'var(--muted)'; }
        return box;
      };
      vecEl.innerHTML = ''; setEl.innerHTML = '';
      vecEl.appendChild(mk(vec, 'insert'));
      setEl.appendChild(mk([...setv], 'asc'));
      if (logEl) {
        if (idx === 0) logEl.textContent = '准备依次插入：5, 3, 8, 3, 1。注意 3 会出现两次。';
        else {
          const v = nums[idx - 1];
          const dup = setv.has(v) && idx > 1 ? '（set 里已有 3，插入被忽略）' : '';
          logEl.textContent = `插入 ${v}：vector 原样追加${setv.has(v) && nums.slice(0, idx - 1).includes(v) ? '；set 去重忽略重复' : ''}。`;
        }
      }
      if (btn) btn.textContent = idx >= nums.length ? '重置' : `插入 ${nums[idx]}`;
    };
    const step = () => {
      if (idx >= nums.length) { idx = 0; vec.length = 0; setv.clear(); }
      else { const v = nums[idx]; vec.push(v); setv.add(v); idx++; }
      render();
    };
    if (btn) btn.onclick = step;
    render();
  }

  /* 可视化：sort 排序 */
  const sortStage = document.getElementById('sortStage');
  if (sortStage) {
    const run = () => {
      const input = document.getElementById('sortInput');
      const arr = input.value.split(/[\s,，]+/).map(Number).filter(n => Number.isFinite(n));
      const asc = document.getElementById('sortAsc');
      const desc = document.getElementById('sortDesc');
      const mk = (a) => a.map(v => `<span style="border:1px solid var(--line);background:var(--surface);border-radius:9px;padding:6px 12px;font-weight:700;font-family:ui-monospace,Consolas,monospace">${v}</span>`).join('');
      asc.innerHTML = arr.length ? mk([...arr].sort((a, b) => a - b)) : '（空）';
      desc.innerHTML = arr.length ? mk([...arr].sort((a, b) => b - a)) : '（空）';
    };
    const btn = document.getElementById('sortRun');
    if (btn) btn.onclick = run;
    run();
  }
});
