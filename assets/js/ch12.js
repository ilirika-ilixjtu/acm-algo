/* 第12章《高级专题》专属配置与交互 */
window.LESSON_CONFIG = {
  storageKey: 'acm-ch12-v1',
  title: '第12章《高级专题》学习记录',
  downloadName: '第12章_高级专题_学习记录.txt',
  problemTotal: 4,
  quizExplanations: {
    pre1: ['正确。Trie（字典树）把字符串按字符逐层存储，适合前缀匹配。','不对。Trie 按字符分层存字符串，是自动机的基础。'],
    pre2: ['正确。KMP 的核心是 next 数组（前缀函数），失配时按它跳。','不对。KMP 用 next 数组在失配时跳跃，避免重复比较。'],
    pre3: ['正确。LCA 是树上两点的最近公共祖先，可配合倍增/树链剖分求。','不对。LCA 是最近公共祖先。'],
    pre4: ['正确。可持久化数据结构保存历史版本，常用于主席树、可持久化线段树。','不对。可持久化 = 保留历史版本，典型是主席树。'],
    pre5: ['正确。这类题往往没有「完美算法」，常用随机化、爬山、模拟退火等非完美算法。','不对。非完美算法用启发式/随机化，接受近似解。'],
    'quiz-trie': ['正确。acm 与 ac 共享前缀 a、c 两个节点；与 icpc 从根就分叉。','不对。acm 和 ac 共用了 a、c 两个节点。'],
    'quiz-kmp': ['正确。next 数组记录「失配后跳到哪」，是 KMP 的核心。','不对。next 数组（前缀函数）是 KMP 的核心。'],
    'quiz-lca': ['正确。LCA 指树上两点的最近公共祖先。','不对。LCA = 最近公共祖先。'],
    'quiz-persist': ['正确。主席树 = 可持久化线段树，能查历史版本、静态区间第 k 小。','不对。主席树是可持久化线段树。']
  },
  exportSections: [
    { title: '预诊断', type: 'quiz', keys: ['pre1', 'pre2', 'pre3', 'pre4', 'pre5'] },
    { title: '课堂小测', type: 'quiz', keys: ['quiz-trie', 'quiz-kmp', 'quiz-lca', 'quiz-persist'] },
    { title: '训练与口诀', type: 'text', keys: ['p1-answer', 'p2-answer', 'p3-answer', 'finish-method'] },
    { title: '错因记录', type: 'text', keys: ['mistake-log'] },
    { title: '本章总结', type: 'text', keys: ['final-summary'] }
  ],
  completionTexts: [
    { min: 88, html: '<strong>掌握较稳。</strong>自动机、树的经典问题与可持久化的概念都清楚了，全书通关！去赛场上检验吧。' },
    { min: 70, html: '<strong>基础理解。</strong>概念清楚但代码不熟，建议挑 1–2 个专题刷模板题，再回来总结。' },
    { min: 45, html: '<strong>初步上手。</strong>先回看「自动机与 Trie」和「树的经典问题」两节，再重做训练。' },
    { min: 0, html: '<strong>尚未通关。</strong>先回到「自动机与 Trie」小节，把 Trie 插入亲手写一遍。' }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  /* 可视化：Trie 插入（真实共享前缀） */
  var trieStage = document.getElementById('trieStage');
  if (trieStage) {
    var words = ['acm', 'ac', 'icpc'];
    var layout = [
      { x: 200, y: 25, label: 'root' },
      { x: 120, y: 85, label: 'a' }, { x: 185, y: 85, label: 'c' }, { x: 185, y: 155, label: 'm' },
      { x: 280, y: 85, label: 'i' }, { x: 260, y: 155, label: 'c' }, { x: 330, y: 155, label: 'p' }, { x: 330, y: 225, label: 'c' }
    ];
    var nodes = [{ label: 'root', x: 200, y: 25, children: {} }];
    var edges = [];
    var created = 1, wi = 0, ci = 0, cur = 0, done = false;
    var svg = document.getElementById('trieSvg');
    var logEl = document.getElementById('trieLog');
    var btn = document.getElementById('trieNext');
    function draw() {
      svg.innerHTML = '';
      var NS = 'http://www.w3.org/2000/svg';
      for (var i = 0; i < edges.length; i++) {
        var e = edges[i];
        var l = document.createElementNS(NS, 'line');
        l.setAttribute('x1', e.x1); l.setAttribute('y1', e.y1); l.setAttribute('x2', e.x2); l.setAttribute('y2', e.y2);
        l.setAttribute('stroke', 'var(--line-strong)'); l.setAttribute('stroke-width', '2');
        svg.appendChild(l);
      }
      for (var k = 0; k < nodes.length; k++) {
        var n = nodes[k];
        var c = document.createElementNS(NS, 'circle');
        c.setAttribute('cx', n.x); c.setAttribute('cy', n.y); c.setAttribute('r', '18');
        c.setAttribute('fill', (k === cur && !done) ? 'var(--rose)' : 'var(--sage)');
        c.setAttribute('stroke', 'var(--sage-deep)'); c.setAttribute('stroke-width', '2');
        svg.appendChild(c);
        var t = document.createElementNS(NS, 'text');
        t.setAttribute('x', n.x); t.setAttribute('y', n.y + 5); t.setAttribute('text-anchor', 'middle');
        t.setAttribute('fill', '#fff'); t.setAttribute('font-size', '15'); t.setAttribute('font-weight', '700');
        t.textContent = n.label;
        svg.appendChild(t);
      }
    }
    function render() {
      draw();
      if (logEl) {
        if (done) logEl.textContent = '插入完成！三个单词共享前缀节点：acm 与 ac 共用 a、c。';
        else {
          var w = words[wi];
          if (ci === 0 && wi > 0) logEl.textContent = '插入 "' + w + '"：首字符已存在，沿路径继续。';
          else if (ci >= w.length) logEl.textContent = '单词 "' + w + '" 插入完成，回到根节点，插入下一个词。';
          else if (ci === 0 && wi > 0) logEl.textContent = '插入 "' + w + '"：首字符已存在，沿路径继续。';
          else logEl.textContent = '插入单词 "' + w + '"，当前字符 ' + w[ci] + '：' + (w.slice(0, ci) === 'ac' && ci === 1 ? '已存在，共享节点' : '创建/走到对应节点');
        }
      }
      if (btn) btn.textContent = done ? '重置' : '下一步';
    }
    function step() {
      if (done) {
        nodes.length = 0; edges.length = 0;
        nodes.push({ label: 'root', x: 200, y: 25, children: {} });
        created = 1; wi = 0; ci = 0; cur = 0; done = false;
      } else {
        var w = words[wi];
        if (ci >= w.length) { wi++; ci = 0; cur = 0; }
        else {
          var ch = w[ci];
          var parent = nodes[cur];
          var nxt = parent.children[ch];
          if (nxt === undefined) {
            nxt = created++;
            var l = layout[nxt];
            nodes.push({ label: ch, x: l.x, y: l.y, children: {} });
            edges.push({ x1: parent.x, y1: parent.y, x2: l.x, y2: l.y });
            parent.children[ch] = nxt;
          }
          cur = nxt;
          ci++;
        }
        if (wi >= words.length) done = true;
      }
      render();
    }
    if (btn) btn.onclick = step;
    render();
  }
});


