/* 第11章《图论模型与算法》专属配置与交互 */
window.LESSON_CONFIG = {
  storageKey: 'acm-ch11-v1',
  title: '第11章《图论模型与算法》学习记录',
  downloadName: '第11章_图论模型与算法_学习记录.txt',
  problemTotal: 4,
  quizExplanations: {
    pre1: ['正确。Kruskal 把边按权值从小到大排，用并查集判断是否成环。','不对。Kruskal 按边权排序 + 并查集判环。'],
    pre2: ['正确。Dijkstra 每次取「距离最小的未确定点」，用堆优化后是 O((n+m)log n)。','不对。Dijkstra 每次选当前距离最小的点，堆优化 O((n+m)log n)。'],
    pre3: ['正确。Floyd 三层循环，中间点 k 作为中转，O(n³)。','不对。Floyd 用 k 中转，复杂度 O(n³)。'],
    pre4: ['正确。最大流问题建模：源点→…→汇点，求最大可输送流量。','不对。最大流求源点到汇点能送的最大流量。'],
    pre5: ['正确。MST 是连接所有点且总权最小的边集。','不对。最小生成树连接所有点且总权最小。'],
    'quiz-mst': ['正确。选 (1,2) 权1、(3,4) 权2、(2,3) 权3，总权 6。','不对。最小生成树选权 1、2、3 的三条边，总权 6。'],
    'quiz-dijkstra': ['正确。d[1]=0，松弛后 d[2]=2、d[3]=4、d[4]=6。','不对。1 到 4 的最短路是 1→2→4 = 2+4 = 6。'],
    'quiz-floyd': ['正确。Floyd 允许 k 作为中转点，能处理所有点对最短路。','不对。Floyd 的三层循环正是用每个点作中转。'],
    'quiz-flow': ['正确。增广路算法每次找一条能多送流量的路并增加，直到没有增广路。','不对。最大流靠反复找增广路并累加流量。']
  },
  exportSections: [
    { title: '预诊断', type: 'quiz', keys: ['pre1', 'pre2', 'pre3', 'pre4', 'pre5'] },
    { title: '课堂小测', type: 'quiz', keys: ['quiz-mst', 'quiz-dijkstra', 'quiz-floyd', 'quiz-flow'] },
    { title: '训练与口诀', type: 'text', keys: ['p1-answer', 'p2-answer', 'p3-answer', 'finish-method'] },
    { title: '错因记录', type: 'text', keys: ['mistake-log'] },
    { title: '本章总结', type: 'text', keys: ['final-summary'] }
  ],
  completionTexts: [
    { min: 88, html: '<strong>掌握较稳。</strong>Kruskal、Dijkstra、Floyd 都清楚了，网络流概念也懂了，可以进入第12章高级专题。' },
    { min: 70, html: '<strong>基础理解。</strong>能写模板题，但建图与细节仍不稳，建议重做训练 1–3。' },
    { min: 45, html: '<strong>初步上手。</strong>先回看「最小生成树」和「最短路」两节，再重做训练。' },
    { min: 0, html: '<strong>尚未通关。</strong>先回到「最小生成树」小节，把 Kruskal 模板亲手写一遍。' }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  /* 可视化1：Kruskal */
  const kruskalStage = document.getElementById('kruskalStage');
  if (kruskalStage) {
    const edges = [
      { u: 1, v: 2, w: 1 }, { u: 3, v: 4, w: 2 }, { u: 2, v: 3, w: 3 },
      { u: 1, v: 3, w: 4 }, { u: 2, v: 4, w: 5 }
    ];
    let idx = 0;
    const chosen = [];
    const parent = [0, 1, 2, 3, 4];
    const find = (x) => parent[x] === x ? x : (parent[x] = find(parent[x]));
    const rowEls = document.querySelectorAll('[data-kruskal-row]');
    const logEl = document.getElementById('kruskalLog');
    const sumEl = document.getElementById('kruskalSum');
    const btn = document.getElementById('kruskalNext');
    const render = () => {
      rowEls.forEach((el, k) => {
        const e = edges[k];
        el.textContent = `${e.u} — ${e.v}（权 ${e.w}）`;
        el.classList.toggle('chosen', chosen.includes(k));
        el.classList.toggle('current', k === idx && chosen.length + (idx < edges.length ? 0 : 0) <= 3);
        el.classList.toggle('current', k === idx && idx < edges.length && chosen.length < 3);
      });
      if (logEl) {
        if (idx >= edges.length) logEl.textContent = '选够 n-1=3 条边，完成！';
        else {
          const e = edges[idx];
          const ru = find(e.u), rv = find(e.v);
          logEl.textContent = ru === rv ? `边 ${e.u}—${e.v}(权${e.w})：两端已在同一集合，成环，跳过。` : `边 ${e.u}—${e.v}(权${e.w})：两端不同集合，选中！合并集合。`;
        }
      }
      if (sumEl) sumEl.textContent = '已选：' + chosen.map(k => `${edges[k].u}-${edges[k].v}`).join('，') + (chosen.length ? `；总权 ${chosen.reduce((s, k) => s + edges[k].w, 0)}` : '');
      if (btn) btn.textContent = idx >= edges.length ? '重置' : '考虑下一条边';
    };
    const step = () => {
      if (idx >= edges.length) { idx = 0; chosen.length = 0; parent.forEach((_, i) => parent[i] = i); }
      else {
        const e = edges[idx];
        const ru = find(e.u), rv = find(e.v);
        if (ru !== rv) { parent[ru] = rv; chosen.push(idx); }
        idx++;
      }
      render();
    };
    if (btn) btn.onclick = step;
    render();
  }

  /* 可视化2：Dijkstra */
  const dijStage = document.getElementById('dijStage');
  if (dijStage) {
    const g = { 1: [[2, 2], [3, 4]], 2: [[4, 4]], 3: [[4, 3], [5, 5]], 4: [[5, 1]], 5: [] };
    const n = 5, INF = 999;
    let dist = [0, 0, INF, INF, INF, INF];
    let done = [false, false, false, false, false, false];
    let u = 1;
    let finished = false;
    const cellEls = document.querySelectorAll('[data-dij-cell]');
    const logEl = document.getElementById('dijLog');
    const btn = document.getElementById('dijNext');
    const minUnvisited = () => { let m = -1, mv = INF; for (let i = 1; i <= n; i++) if (!done[i] && dist[i] < mv) { mv = dist[i]; m = i; } return m; };
    const render = () => {
      cellEls.forEach((el, k) => {
        const node = k + 1;
        el.textContent = dist[node] === INF ? '∞' : dist[node];
        el.classList.toggle('done', done[node]);
        el.classList.toggle('current', node === u);
      });
      if (logEl) {
        const nxt = minUnvisited();
        if (finished) logEl.textContent = '所有点都已确定，完成！d[4] = 6，d[5] = 7。';
        else logEl.textContent = `取未确定中距离最小的点 ${nxt}（d=${dist[nxt]}），松弛它的邻居。`;
      }
      if (btn) btn.textContent = finished ? '重置' : '确定下一个点';
    };
    const step = () => {
      const nxt = minUnvisited();
      if (finished) { dist = [0, 0, INF, INF, INF, INF]; done = [false, false, false, false, false, false]; u = 1; finished = false; }
      else if (nxt !== -1) {
        u = nxt; done[u] = true;
        for (const [v, w] of g[u]) if (!done[v] && dist[u] + w < dist[v]) dist[v] = dist[u] + w;
        if (minUnvisited() === -1) finished = true;
      }
      render();
    };
    if (btn) btn.onclick = step;
    render();
  }
});




