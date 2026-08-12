/* 第8章《高效算法设计》专属配置与交互 */
window.LESSON_CONFIG = {
  storageKey: 'acm-ch08-v1',
  title: '第8章《高效算法设计》学习记录',
  downloadName: '第8章_高效算法设计_学习记录.txt',
  problemTotal: 4,
  quizExplanations: {
    pre1: ['正确。二分查找每次把范围减半，O(log n)，10 亿个数据也只要 30 次。','不对。二分每次砍半，复杂度是 O(log n)。'],
    pre2: ['正确。归并排序是典型分治：拆成两半、分别排好、再合并。','不对。归并排序就是分治：分解、解决、合并。'],
    pre3: ['正确。合并两个有序数组用两个指针从头扫，O(n)。','不对。两个指针从各自头部开始比较，扫一遍即可。'],
    pre4: ['正确。二分查找的前提是数组已经有序。','不对。二分要求数组有序，否则砍半没有意义。'],
    pre5: ['正确。贪心每步选当前最优，区间问题按结束时间排序常能保证全局最优。','不对。区间调度贪心通常按结束时间排序。'],
    'quiz-merge': ['正确。两个指针各取较小者，合并结果为 1 2 3 4 6 7。','不对。逐对比较取小：1、2、3、4、6、7。'],
    'quiz-binary': ['正确。在 1 3 5 7 9 中找 7：mid=5 太小，区间右移，再 mid=7 命中。','不对。二分先看中间 5，7 更大所以往右半找。'],
    'quiz-greedy': ['正确。部分背包按单位价值从大到小拿，贪心正确。','不对。部分背包按单位重量价值排序贪心即可最优。'],
    'quiz-lowerbound': ['正确。lower_bound 返回第一个 >= x 的位置；upper_bound 返回第一个 > x 的位置。','不对。lower_bound 是第一个不小于 x，upper_bound 是第一个大于 x。']
  },
  exportSections: [
    { title: '预诊断', type: 'quiz', keys: ['pre1', 'pre2', 'pre3', 'pre4', 'pre5'] },
    { title: '课堂小测', type: 'quiz', keys: ['quiz-merge', 'quiz-binary', 'quiz-greedy', 'quiz-lowerbound'] },
    { title: '训练与口诀', type: 'text', keys: ['p1-answer', 'p2-answer', 'p3-answer', 'finish-method'] },
    { title: '错因记录', type: 'text', keys: ['mistake-log'] },
    { title: '本章总结', type: 'text', keys: ['final-summary'] }
  ],
  completionTexts: [
    { min: 88, html: '<strong>掌握较稳。</strong>分治、二分与贪心的套路都清楚了，可以进入第9章动态规划。' },
    { min: 70, html: '<strong>基础理解。</strong>能写归并与二分，但证明贪心正确性还不熟，建议重做训练 1–3。' },
    { min: 45, html: '<strong>初步上手。</strong>先回看「归并排序」和「二分查找」两节，再重做训练。' },
    { min: 0, html: '<strong>尚未通关。</strong>先回到「分治法」小节，把归并排序亲手写一遍。' }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  /* 可视化1：归并两个有序数组 */
  const mergeStage = document.getElementById('mergeStage');
  if (mergeStage) {
    const A = [1, 4, 7], B = [2, 3, 6];
    let i = 0, j = 0;
    const out = [];
    const aEls = document.querySelectorAll('#mergeA span');
    const bEls = document.querySelectorAll('#mergeB span');
    const outEl = document.getElementById('mergeOut');
    const logEl = document.getElementById('mergeLog');
    const btn = document.getElementById('mergeNext');
    const render = () => {
      aEls.forEach((el, k) => el.classList.toggle('pick', k === i));
      bEls.forEach((el, k) => el.classList.toggle('pick', k === j));
      outEl.textContent = out.length ? out.join(' ') : '（空）';
      if (logEl) {
        if (i >= A.length && j >= B.length) logEl.textContent = '完成！合并结果：1 2 3 4 6 7。';
        else if (i < A.length && j < B.length) logEl.textContent = `比较 A 指针 ${A[i]} 与 B 指针 ${B[j]}，取较小的 ${A[i] < B[j] ? A[i] : B[j]}。`;
        else if (i < A.length) logEl.textContent = `B 已取完，直接把 A 剩下的 ${A.slice(i).join(' ')} 依次放入。`;
        else logEl.textContent = `A 已取完，直接把 B 剩下的 ${B.slice(j).join(' ')} 依次放入。`;
      }
      if (btn) btn.textContent = i >= A.length && j >= B.length ? '重置' : '取下一个';
    };
    const step = () => {
      if (i >= A.length && j >= B.length) { i = 0; j = 0; out.length = 0; }
      else if (j >= B.length || (i < A.length && A[i] <= B[j])) out.push(A[i++]);
      else out.push(B[j++]);
      render();
    };
    if (btn) btn.onclick = step;
    render();
  }

  /* 可视化2：二分查找 7 */
  const binStage = document.getElementById('binStage');
  if (binStage) {
    const arr = [1, 3, 5, 7, 9], target = 7;
    let l = 0, r = arr.length - 1, mid = -1, state = 'init';
    const els = document.querySelectorAll('#binArr span');
    const logEl = document.getElementById('binLog');
    const btn = document.getElementById('binNext');
    const render = () => {
      els.forEach((el, k) => {
        el.classList.toggle('lo', k === l);
        el.classList.toggle('hi', k === r);
        el.classList.toggle('mid', k === mid && mid >= 0);
        el.classList.toggle('found', state === 'found' && k === mid);
      });
      if (logEl) {
        if (state === 'init') logEl.textContent = '目标 7。初始区间 [0, 4]。';
        else if (state === 'found') logEl.textContent = '命中！arr[3] = 7，找到。';
        else if (l > r) logEl.textContent = '区间为空，查找失败。';
        else logEl.textContent = `mid = (${l}+${r})/2 = ${mid}，arr[${mid}] = ${arr[mid]} ${arr[mid] < target ? '小于 7，往右半找' : arr[mid] > target ? '大于 7，往左半找' : '等于 7，命中！'}`;
      }
      if (btn) btn.textContent = state === 'found' || l > r ? '重置' : '下一步';
    };
    const step = () => {
      if (state === 'found' || l > r) { l = 0; r = arr.length - 1; mid = -1; state = 'init'; }
      else {
        mid = Math.floor((l + r) / 2);
        if (arr[mid] === target) state = 'found';
        else if (arr[mid] < target) l = mid + 1;
        else r = mid - 1;
      }
      render();
    };
    if (btn) btn.onclick = step;
    render();
  }
});
