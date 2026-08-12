/* 第6章《数据结构基础》专属配置与交互 */
window.LESSON_CONFIG = {
  storageKey: 'acm-ch06-v1',
  title: '第6章《数据结构基础》学习记录',
  downloadName: '第6章_数据结构基础_学习记录.txt',
  problemTotal: 4,
  quizExplanations: {
    pre1: ['正确。栈是后进先出（LIFO），最后放进去的最先被取出。','不对。栈的特性是后进先出：最后入栈的元素最先出栈。'],
    pre2: ['正确。队列先进先出（FIFO），先来先服务。','不对。队列是先进先出，最先入队的先出队。'],
    pre3: ['正确。二叉树每个节点最多两个孩子，根是第1层，第h层最多 2^(h-1) 个节点。','不对。第 h 层最多有 2 的 (h-1) 次方个节点。'],
    pre4: ['正确。先序=根左右，中序=左根右，后序=左右根，所以后序是左右根。','不对。后序遍历是左子树、右子树、根，即左右根。'],
    pre5: ['正确。BFS 用队列逐层扩展，先找到的路径就是最短路径（无权图）。','不对。无权图求最短路要用 BFS，它按层扩展，第一次到达即最短。'],
    'quiz-stack': ['正确。依次压 1、2、3 后，出栈顺序是 3、2、1（后进先出）。','不对。栈后进先出，压入 1 2 3 后先出的是 3，再 2、1。'],
    'quiz-queue': ['正确。依次入队 1、2、3 后，出队顺序是 1、2、3（先进先出）。','不对。队列先进先出，出队顺序是 1、2、3。'],
    'quiz-tree': ['正确。先序是根左右：1、2、4、5、3，先访问根再左右。','不对。先序 = 根 → 左子树 → 右子树，答案是 1 2 4 5 3。'],
    'quiz-bfs': ['正确。BFS 从起点逐层扩展，第一次访问到的路径就是最短的。','不对。BFS 按层扩展，第一次到达即最短；DFS 不一定。']
  },
  exportSections: [
    { title: '预诊断', type: 'quiz', keys: ['pre1', 'pre2', 'pre3', 'pre4', 'pre5'] },
    { title: '课堂小测', type: 'quiz', keys: ['quiz-stack', 'quiz-queue', 'quiz-tree', 'quiz-bfs'] },
    { title: '训练与口诀', type: 'text', keys: ['p1-answer', 'p2-answer', 'p3-answer', 'finish-method'] },
    { title: '错因记录', type: 'text', keys: ['mistake-log'] },
    { title: '本章总结', type: 'text', keys: ['final-summary'] }
  ],
  completionTexts: [
    { min: 88, html: '<strong>掌握较稳。</strong>栈队列、二叉树与 BFS 都清楚了，可以进入第7章暴力求解法。' },
    { min: 70, html: '<strong>基础理解。</strong>能用 STL 容器与基本遍历，但图遍历还不够熟，建议重做训练 1–3。' },
    { min: 45, html: '<strong>初步上手。</strong>先回看「栈与队列」和「二叉树遍历」两节，再重做训练。' },
    { min: 0, html: '<strong>尚未通关。</strong>先回到「栈和队列」小节，把 push/pop 的演示亲手点一遍。' }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  /* 可视化1：栈 push/pop */
  const stackStage = document.getElementById('stackStage');
  if (stackStage) {
    const stack = [];
    const box = document.getElementById('stackBox');
    const log = document.getElementById('stackLog');
    const render = () => {
      box.innerHTML = '';
      [...stack].reverse().forEach(v => {
        const d = document.createElement('div');
        d.textContent = v;
        d.style.cssText = 'border:1px solid var(--line);background:var(--sage-soft);border-radius:9px;padding:6px 14px;font-weight:800;font-family:ui-monospace,Consolas,monospace;text-align:center';
        box.appendChild(d);
      });
      if (!stack.length) { box.textContent = '（空栈）'; box.style.color = 'var(--muted)'; }
    };
    const push = () => { stack.push(stack.length + 1); log.textContent = `push(${stack.length})：把 ${stack.length} 压入栈顶。`; render(); };
    const pop = () => { if (!stack.length) { log.textContent = '栈是空的，不能 pop。'; return; } const v = stack.pop(); log.textContent = `pop()：弹出栈顶 ${v}。`; render(); };
    const bp = document.getElementById('stackPush'); if (bp) bp.onclick = push;
    const bq = document.getElementById('stackPop'); if (bq) bq.onclick = pop;
    render();
  }

  /* 可视化2：队列 enqueue/dequeue */
  const queueStage = document.getElementById('queueStage');
  if (queueStage) {
    const q = [];
    const box = document.getElementById('queueBox');
    const log = document.getElementById('queueLog');
    const render = () => {
      box.innerHTML = '';
      q.forEach(v => {
        const d = document.createElement('div');
        d.textContent = v;
        d.style.cssText = 'border:1px solid var(--line);background:var(--blue-soft);border-radius:9px;padding:6px 14px;font-weight:800;font-family:ui-monospace,Consolas,monospace;text-align:center';
        box.appendChild(d);
      });
      if (!q.length) { box.textContent = '（空队列）'; box.style.color = 'var(--muted)'; }
    };
    const enq = () => { q.push(q.length + 1); log.textContent = `enqueue(${q.length})：${q.length} 从队尾入队。`; render(); };
    const deq = () => { if (!q.length) { log.textContent = '队列是空的，不能 dequeue。'; return; } const v = q.shift(); log.textContent = `dequeue()：${v} 从队头出队。`; render(); };
    const be = document.getElementById('queueEnq'); if (be) be.onclick = enq;
    const bd = document.getElementById('queueDeq'); if (bd) bd.onclick = deq;
    render();
  }

  /* 可视化3：二叉树先序遍历 */
  const treeStage = document.getElementById('treeStage');
  if (treeStage) {
    const order = ['1', '2', '4', '5', '3'];
    let idx = 0;
    const nodes = { '1': document.getElementById('t1'), '2': document.getElementById('t2'), '3': document.getElementById('t3'), '4': document.getElementById('t4'), '5': document.getElementById('t5') };
    const log = document.getElementById('treeLog');
    const out = document.getElementById('treeOut');
    const btn = document.getElementById('treeNext');
    const render = () => {
      Object.keys(nodes).forEach(k => {
        const el = nodes[k];
        const pos = order.indexOf(k);
        el.classList.toggle('visited', pos < idx);
        el.classList.toggle('current', pos === idx);
      });
      if (log) log.textContent = idx === 0 ? '从根 1 开始，先访问根。' : `访问节点 ${order[idx - 1]}（先序：根 → 左 → 右）。`;
      if (out) out.textContent = '访问顺序：' + order.slice(0, idx).join(' → ');
      if (btn) btn.textContent = idx >= order.length ? '重置' : `访问第 ${idx + 1} 个节点`;
    };
    const step = () => { if (idx >= order.length) idx = 0; else idx++; render(); };
    if (btn) btn.onclick = step;
    render();
  }
});
