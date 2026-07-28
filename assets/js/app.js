(function () {
  'use strict';

  /* ---------- data ---------- */
  var DATA = {
    benchmarks: {
      openvla_indomain: { title: 'OpenVLA · In-Domain SIMPLER', ymax: 100, series: ['Vanilla', 'Repeated', 'RL² (Compose-Always)', 'RL² (Compose-Adaptive)'],
        tasks: { 'Eggplant in Basket': [53.3, 75.3, 80.7, 77.3], 'Stack Cubes': [33.3, 42.7, 27.3, 44], 'Spoon on Towel': [43.3, 27.3, 30, 46.7], 'Carrot on Plate': [17.3, 15.3, 19.3, 22.7], 'Average': [36.8, 40.2, 39.3, 47.7] },
        std: { 'Eggplant in Basket': [4.2, 6.4, 1.2, 3.1], 'Stack Cubes': [3.1, 3.1, 6.4, 6.0], 'Spoon on Towel': [4.2, 9.9, 5.3, 8.1], 'Carrot on Plate': [3.1, 2.3, 4.2, 3.1], 'Average': [2.3, 2.5, 1.6, 2.4] } },
      pi0_indomain_ood_prompt: { title: 'π₀ · In-Domain SIMPLER (OOD Prompt)', ymax: 100, series: ['Vanilla', 'Rephrase', 'RL² (Compose-Always)', 'RL² (Compose-Adaptive)'],
        tasks: { 'Eggplant in Basket': [74.0, 90.7, 94.0, 93.3], 'Stack Cubes': [13.3, 28.7, 32.0, 40.7], 'Spoon on Towel': [24.7, 36.0, 44.7, 50.7], 'Carrot on Plate': [48.7, 45.3, 52.7, 56.7], 'Average': [40.2, 50.2, 55.9, 60.4] },
        std: { 'Eggplant in Basket': [6.0, 5.8, 2.0, 3.1], 'Stack Cubes': [3.1, 5.0, 4.0, 2.3], 'Spoon on Towel': [5.0, 7.2, 5.0, 6.1], 'Carrot on Plate': [4.2, 4.2, 6.4, 12.2], 'Average': [4.6, 5.6, 4.4, 5.9] } },
      pi0_ood_env: { title: 'π₀ · Out-of-Domain SIMPLER Environments', ymax: 70, series: ['Vanilla', 'Rephrase', 'RL² (Compose-Always)', 'RL² (Compose-Adaptive)'],
        tasks: { 'Orange Juice on Plate': [31.3, 35.3, 41.3, 43.3], 'Spoon on Towel (Google)': [46.0, 44.7, 54.0, 59.3], 'Tape Measure in Basket': [18.7, 52.0, 44.7, 59.3], 'Toy Dinosaur on Towel': [48.0, 49.3, 46.0, 53.3], 'Average': [36.0, 45.3, 46.5, 53.8] },
        std: { 'Orange Juice on Plate': [2.3, 6.4, 6.1, 8.1], 'Spoon on Towel (Google)': [2.3, 3.1, 4.0, 6.4], 'Tape Measure in Basket': [8.3, 3.1, 3.5, 6.4], 'Toy Dinosaur on Towel': [3.5, 3.1, 3.5, 6.4], 'Average': [0.5, 1.5, 1.8, 3.2] } },
      polaris_S: { title: 'π₀.₅ · OOD Prompt', ymax: 80, series: ['Vanilla', 'Rephrase', 'RL² (Compose)', 'RL² (Adaptive)'],
        tasks: { 'Move Latte Cup': [18.7, 48.7, 55.3, 66.0], 'Tape into Container': [12.7, 22.0, 22.0, 28.7], 'Pan Cleaning': [11.5, 24.7, 24.0, 33.3], 'Average': [14.3, 31.8, 33.8, 42.7] },
        std: { 'Move Latte Cup': [2.3, 11.0, 3.1, 3.5], 'Tape into Container': [3.0, 5.3, 5.3, 1.2], 'Pan Cleaning': [4.3, 8.1, 4.0, 7.0], 'Average': [2.0, 3.4, 1.7, 2.3] } },
      polaris_P: { title: 'PolaRiS · OOD Prompt — Progress Rate', ymax: 80, series: ['Vanilla', 'Rephrase', 'RL² (Compose)', 'RL² (Adaptive)'],
        tasks: { 'Move Latte Cup': [39.5, 65.6, 72.0, 78.0], 'Tape into Container': [34.6, 41.3, 40.9, 46.9], 'Pan Cleaning': [45.7, 58.7, 54.4, 64.0], 'Average': [40.0, 55.2, 55.8, 63.0] } },
      real_indomain: { title: 'Real Robot · In-Domain (OOD Prompt)', ymax: 80, series: ['Vanilla', 'Rephrase', 'RL² (Compose-Always)', 'RL² (Compose-Adaptive)'],
        tasks: { 'Carrot on Plate': [13.3, 36.7, 40, 63.3], 'Cube in Toolbox': [3.3, 40, 50, 50], 'Average': [8.3, 38.4, 45.0, 56.7] },
        std: { 'Carrot on Plate': [5.8, 5.8, 10.0, 11.5], 'Cube in Toolbox': [5.8, 10.0, 17.3, 17.3], 'Average': [5.8, 7.9, 13.7, 14.4] } },
      real_ood: { title: 'Real Robot · Out-of-Domain', ymax: 80, series: ['Vanilla', 'Rephrase', 'RL² (Compose-Always)', 'RL² (Compose-Adaptive)'],
        tasks: { 'Tape in Toolbox': [16.7, 36.7, 33.3, 53.3], 'Screwdriver in Toolbox': [6.7, 16.7, 20, 33.3], 'Average': [11.7, 26.7, 26.7, 43.3] },
        std: { 'Tape in Toolbox': [11.5, 15.3, 5.8, 5.8], 'Screwdriver in Toolbox': [5.8, 5.8, 10.0, 5.8], 'Average': [8.7, 10.6, 7.9, 5.8] } }
    },
    scaling: {
      failure: { Repeated: [0.4099, -0.0438], Residual: [0.4051, -0.0814], Rephrase: [0.4073, -0.0829], RL: [0.4099, -0.0858], RLT: [0.4111, -0.0867], Concat: [0.4116, -0.0882], RBF: [0.4147, -0.0988], 'RL² (Ours)': [0.3983, -0.1081] },
      success: { Repeated: [0.0380, -0.1657], Residual: [0.0454, -0.2878], Rephrase: [0.0385, -0.3243], RL: [0.0431, -0.2884], RLT: [0.0445, -0.2865], Concat: [0.0416, -0.3373], RBF: [0.0548, -0.3007], 'RL² (Ours)': [0.0468, -0.3250] }
    },
    scalingSamples: {
      ymax: 70,
      series: ['8 Rephrases × 5 Samples', '40× Samples', '1× Sample'],
      colors: ['#7D2184', '#A02B93', '#C8A4C2'],
      groups: [
        { name: 'RL² (Compose-Adaptive)', vals: [60.3, 47.3, 44.5], std: [1.6, 3.8, 1.3], gain: 15.8, gainColor: '#1A8341' },
        { name: 'RL² (Compose-Always)', vals: [57.8, 43.7, 39.2], std: [1.6, 1.9, 3.8], gain: 18.6, gainColor: '#29A9DF' },
        { name: 'Repeated / Rephrase', vals: [50.2, 42, 40.2], std: [4.6, 0.0, 0.8], gain: 10.0, gainColor: '#E27B33' }
      ]
    },
    gallery: {
      ood_prompt: [
        { task: 'Pan Cleaning', env: 'Simulation · π₀.₅', base: 24.7, ours: 33.3,
          rephrase: 'ood_prompt/sim/pan_cleaning/REPHRASE_Pan_Cleaning_speedx3.mp4',
          adaptive: 'ood_prompt/sim/pan_cleaning/ADAPTIVE_COMPOSE_Pan_Cleaning_speedx3.mp4',
          plot: 'ood_prompt/sim/pan_cleaning/CP_ADAPTIVE_COMPOSE_Pan_Cleaning_speedx3.mp4' },
        { task: 'Spoon on Towel', env: 'Simulation · π₀', base: 36.0, ours: 50.7,
          rephrase: 'ood_prompt/sim/spoon_on_towel/REPHRASE_Spoon_on_Towel_speedx1.mp4',
          adaptive: 'ood_prompt/sim/spoon_on_towel/ADAPTIVE_COMPOSE_Spoon_on_Towel_speedx1.mp4',
          plot: 'ood_prompt/sim/spoon_on_towel/CP_ADAPTIVE_COMPOSE_Spoon_on_Towel_speedx1.mp4' },
        { task: 'Carrot on Plate', env: 'Real robot · π₀', base: 36.7, ours: 63.3,
          rephrase: 'ood_prompt/real/carrot_on_plate/REPHRASE_Carrot_on_Plate_speedx8.mp4',
          adaptive: 'ood_prompt/real/carrot_on_plate/ADAPTIVE_COMPOSE_Carrot_on_Plate_speedx8.mp4',
          plot: 'ood_prompt/real/carrot_on_plate/CP_ADAPTIVE_COMPOSE_Carrot_on_Plate_speedx8.mp4' },
        { task: 'Cube in Toolbox', env: 'Real robot · π₀', base: 40, ours: 50,
          rephrase: 'ood_prompt/real/cube_in_toolbox/REPHRASE_Cube_in_Toolbox_speedx8.mp4',
          adaptive: 'ood_prompt/real/cube_in_toolbox/ADAPTIVE_COMPOSE_Cube_in_Toolbox_speedx8.mp4',
          plot: 'ood_prompt/real/cube_in_toolbox/CP_ADAPTIVE_COMPOSE_Cube_in_Toolbox_speedx8.mp4' }
      ],
      ood_env: [
        { task: 'Toy Dinosaur on Towel', env: 'Simulation · π₀', base: 49.3, ours: 53.3, compose: 46,
          rephrase: 'ood_env/sim/dino_on_towel/REPHRASE_sim_Dino_in_Toolbox_speedx5.mp4',
          composeAlways: 'ood_env/sim/dino_on_towel/COMPOSE_ALWAYS_sim_Dino_in_Toolbox_speedx5.mp4',
          adaptive: 'ood_env/sim/dino_on_towel/ADAPTIVE_COMPOSE_sim_Dino_in_Toolbox_speedx5.mp4',
          plot: 'ood_env/sim/dino_on_towel/CP_ADAPTIVE_COMPOSE_sim_Dino_in_Toolbox_speedx5.mp4' },
        { task: 'Tape in Toolbox', env: 'Real robot · π₀', base: 36.7, ours: 53.3, compose: 33.3,
          rephrase: 'ood_env/real/tape_in_toolbox/REPHRASE_Tape_in_Toolbox_speedx5.mp4',
          composeAlways: 'ood_env/real/tape_in_toolbox/COMPOSE_ALWAYS_Tape_in_Toolbox_speedx5.mp4',
          adaptive: 'ood_env/real/tape_in_toolbox/ADAPTIVE_COMPOSE_Tape_in_Toolbox_speedx5.mp4',
          plot: 'ood_env/real/tape_in_toolbox/CP_ADAPTIVE_COMPOSE_Tape_in_Toolbox_speedx5.mp4' },
        { task: 'Screwdriver in Toolbox', env: 'Real robot · π₀', base: 16.7, ours: 33.3, compose: 20,
          rephrase: 'ood_env/real/screwdriver_in_toolbox/REPHRASE_Screwdriver_in_Toolbox_speedx5.mp4',
          composeAlways: 'ood_env/real/screwdriver_in_toolbox/COMPOSE_ALWAYS_Screwdriver_in_Toolbox_speedx5.mp4',
          adaptive: 'ood_env/real/screwdriver_in_toolbox/ADAPTIVE_COMPOSE_Ext_Screwdriver_in_Toolbox_speedx5.mp4',
          plot: 'ood_env/real/screwdriver_in_toolbox/CP_ADAPTIVE_COMPOSE_Screwdriver_in_Toolbox_speedx5.mp4' }
      ]
    }
  };
  var GVID = 'assets/videos/';

  var ARCH_DUR = 4500;
  var ARCH_FRAMES = [
    { src: 'assets/images/workflow_1.jpeg', title: 'Standard VLA Inference', caption: 'Run standard inference with the frozen off-the-shelf VLA (OpenVLA*, π₀/π₀.₅) to produce base action candidates and expressive action-expert latents eₜ.' },
    { src: 'assets/images/workflow_2.jpeg', title: 'RL Compositional Steering', caption: 'An RL action expert generates a steering velocity V_RL, composed with the VLA velocity V_VLA during flow-matching — diversifying candidate actions toward success.' },
    { src: 'assets/images/workflow_3.jpeg', title: 'SAFE Failure Detection', caption: 'A lightweight detector reads the latents and predicts failure (sₜ > δ), gating steering so compositional sampling activates only when the base VLA is likely to fail.' },
    { src: 'assets/images/workflow_4.jpeg', title: 'Action Verification', caption: 'A verifier VLM (RoboMonkey / CoVer) scores the composed action candidates and selects the best action â* to execute on the robot.' }
  ];

  var R = 'assets/images/fig2_real/', SM = 'assets/images/fig2_sim/';
  var DEMO_EXAMPLES = [
    {
      id: 'real', eyebrow: 'Real robot · OOD environment', title: 'Put screwdriver in toolbox', tag: 'OOD Env',
      layout: '2x2', blockAspect: '1440/1080',
      top: [
        { label: 'Rephrase', src: R + 'tape_toolbox_rephrase.mp4' },
        { label: 'Compose-Always', src: R + 'compose_always_screwdriver_toolbox.mp4' }
      ],
      cam: { label: 'Adaptive steering', src: GVID + 'ood_env/real/screwdriver_in_toolbox/ADAPTIVE_COMPOSE_Ext_Screwdriver_in_Toolbox_speedx5.mp4' },
      plot: { label: 'Failure detection', src: GVID + 'ood_env/real/screwdriver_in_toolbox/CP_ADAPTIVE_COMPOSE_Screwdriver_in_Toolbox_speedx5.mp4' },
      markers: [
        { n: 1, t: 3.6, x: 34.0, y: 37.5, title: 'EEF nears the screwdriver', desc: 'The frozen VLA drives the gripper down onto the screwdriver, but failure scores sₜ climb across the conformal (CP) band — RL² preemptively flags the impending grasp failure.' },
        { n: 2, t: 5.5, x: 42.0, y: 27.0, title: 'Grasp — steering rejects the distractor', desc: 'Compositional steering diversifies the grasp away from the distractor tape and secures the screwdriver — undistracted while sₜ stays above the band.' },
        { n: 3, t: 8.5, x: 53.0, y: 36.0, title: 'Lift toward the toolbox', desc: 'Still under RL² steering, the corrected trajectory lifts the screwdriver up and carries it toward the toolbox — undistracted by the surrounding clutter.' },
        { n: 4, t: 11.3, x: 64.0, y: 68.0, title: 'Placed in the success zone', desc: 'Failure scores collapse back under the CP band as the screwdriver is placed into the toolbox. Task succeeds.' }
      ]
    },
    {
      id: 'sim', eyebrow: 'Simulation · PolaRiS · OOD prompt', title: 'Pan cleaning', tag: 'OOD Prompt',
      layout: '1+2', blockAspect: '16/9',
      top: [
        { label: 'Rephrase', src: SM + 'rephrase_pan_clean_polaris.mp4' }
      ],
      cam: { label: 'Adaptive steering', src: SM + 'adaptive_compose_pan_clean.mp4' },
      plot: { label: 'Failure detection', src: SM + 'adaptive_compose_SAFE_pan_clean.mp4' },
      markers: [
        { n: 1, t: 2.59, x: 33.0, y: 39.0, title: 'Failed grasp', desc: 'The base VLA fumbles the grasp on the brush — failure scores sₜ begin climbing toward the conformal (CP) band as the approach goes wrong.' },
        { n: 2, t: 4.07, x: 49.0, y: 27.0, title: 'Failure detected', desc: 'Failure scores cross above the CP band. RL² flags the failing grasp via Conformal Prediction and gates on compositional steering.' },
        { n: 3, t: 5.93, x: 69.0, y: 22.0, title: 'Steering — successful grasp', desc: 'RL² composes its RL steering velocity with the VLA, diversifying candidate grasps until the brush is securely grasped.' },
        { n: 4, t: 8.15, x: 91.0, y: 64.0, title: 'Undistracted — brush wipes the pan', desc: 'Failure scores fall back under the band: the corrected, undistracted trajectory brings the brush into contact with the pan. Task succeeds.' }
      ]
    }
  ];

  var BIBTEX = '@article{tan2026rl2vla,\n  title   = {RL^2-VLA: Adaptive RL Latent Compositional Steering with Test-Time\n             Scaling for Vision-Language-Action Models},\n  author  = {Tan, Derek Ming Siang and Shailesh, Shailesh and Iyer, Srikrishna and\n             Teo, William Wei Jie and Ju, Yuanliang and Gu, Qiao and Sartoretti, Guillaume},\n  year    = {2026},\n  journal = {arXiv preprint}\n}';

  var TOC = [['overview', 'Overview'], ['abstract', 'Abstract'], ['demo', 'RL² in Action'], ['method', 'Method'], ['results', 'Results'], ['gallery', 'Task Gallery'], ['bibtex', 'BibTeX']];
  var BENCH_TABS = [['pi0_indomain_ood_prompt', 'π₀ · OOD Prompt'], ['pi0_ood_env', 'π₀ · OOD Env'], ['polaris_S', 'π₀.₅ · OOD Prompt'], ['openvla_indomain', 'OpenVLA · In-Domain'], ['real_indomain', 'Real · OOD Prompt'], ['real_ood', 'Real · OOD Env']];

  /* ---------- state ---------- */
  var state = { activeBench: 'pi0_indomain_ood_prompt', benchHidden: {}, scalingHidden: {}, samplesHidden: {}, galleryTab: 'ood_prompt', grown: false, activeSection: 'overview', lineHover: null };

  /* ---------- color helpers ---------- */
  function colorFor(n) { if (/adaptive/i.test(n)) return '#1A8341'; if (/compose/i.test(n)) return '#29A9DF'; if (/rephrase/i.test(n)) return '#E27B33'; if (/repeated/i.test(n)) return '#E27B33'; if (/vanilla/i.test(n)) return '#1C6488'; return '#8A8A85'; }
  function scaleColor(n) { if (/ours/i.test(n)) return '#1B7A1B'; return { Repeated: '#1565C0', Residual: '#808080', Rephrase: '#DB4800', RL: '#CBB703', RLT: '#6A1B9A', Concat: '#217ACB', RBF: '#9E6651' }[n] || '#8A8A85'; }
  function scaleDash(n) { return (n === 'Concat' || n === 'Residual' || n === 'RL') ? '6 4' : '0'; }

  /* ---------- dom helpers ---------- */
  var SVG_ATTR = { strokeWidth: 'stroke-width', strokeDasharray: 'stroke-dasharray', strokeLinecap: 'stroke-linecap', strokeLinejoin: 'stroke-linejoin', textAnchor: 'text-anchor', fontSize: 'font-size', fontFamily: 'font-family', fontWeight: 'font-weight' };
  function make(ns, tag, attrs, kids) {
    var e = ns ? document.createElementNS('http://www.w3.org/2000/svg', tag) : document.createElement(tag);
    attrs = attrs || {};
    for (var k in attrs) {
      var v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'style' && typeof v === 'object') { for (var s in v) e.style[s] = v[s]; }
      else if (k === 'class') e.setAttribute('class', v);
      else if (k === 'html') e.innerHTML = v;
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k.slice(0, 5) === 'data-') e.setAttribute(k, v);
      else e.setAttribute(ns ? (SVG_ATTR[k] || k) : k, v);
    }
    (kids || []).forEach(function (c) { if (c == null) return; e.appendChild(typeof c === 'object' ? c : document.createTextNode(String(c))); });
    return e;
  }
  function h(tag, attrs, kids) { return make(false, tag, attrs, kids); }
  function S(tag, attrs, kids) { return make(true, tag, attrs, kids); }
  function $(id) { return document.getElementById(id); }
  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); }
  function wrap(s, max) { var w = String(s).split(' '), lines = [], cur = ''; w.forEach(function (x) { if ((cur + ' ' + x).trim().length > max) { if (cur) lines.push(cur); cur = x; } else cur = (cur ? cur + ' ' : '') + x; }); if (cur) lines.push(cur); return lines.slice(0, 2); }
  function scaler(dom, rng, log) { var d0 = dom[0], d1 = dom[1], r0 = rng[0], r1 = rng[1]; if (log) { var l0 = Math.log10(d0), l1 = Math.log10(d1); return function (v) { return r0 + ((Math.log10(v) - l0) / (l1 - l0)) * (r1 - r0); }; } return function (v) { return r0 + ((v - d0) / (d1 - d0)) * (r1 - r0); }; }
  function buildScale(dict, ks) { return Object.keys(dict).map(function (name) { return { name: name, color: scaleColor(name), dash: scaleDash(name), width: /ours/i.test(name) ? 3.2 : 1.7, data: ks.map(function (k) { return [k, dict[name][0] * Math.pow(k, dict[name][1])]; }) }; }); }

  /* ---------- tooltip ---------- */
  var TT = { box: null, title: null, rows: null };
  function showTip(e, title, rows) {
    TT.box.style.display = 'block';
    TT.box.style.left = (e.clientX + 15) + 'px';
    TT.box.style.top = (e.clientY + 15) + 'px';
    TT.title.textContent = title;
    clear(TT.rows);
    rows.forEach(function (r) {
      TT.rows.appendChild(h('div', { style: { display: 'flex', alignItems: 'center', gap: '9px', padding: '2px 0' } }, [
        h('span', { style: { width: '9px', height: '9px', flex: 'none', background: r.color, borderRadius: '50%' } }),
        h('span', { style: { flex: '1', fontFamily: "'DM Sans'", fontSize: '12px', color: '#222222', whiteSpace: 'nowrap' } }, [r.name]),
        h('span', { style: { fontFamily: "'Chakra Petch'", fontSize: '12px', color: '#111111', fontWeight: '600' } }, [r.val])
      ]));
    });
  }
  function hideTip() { TT.box.style.display = 'none'; }

  /* ---------- charts ---------- */
  function barChart(cfg) {
    var W = 760, H = 440, m = { l: 44, r: 14, t: 24, b: 72 };
    var pw = W - m.l - m.r, ph = H - m.t - m.b, names = Object.keys(cfg.tasks), ng = names.length, ns = cfg.series.length;
    var gw = pw / ng, bandPad = gw * 0.16, innerW = gw - bandPad * 2, bw = innerW / ns, ymax = cfg.ymax;
    var y = function (v) { return m.t + ph - (v / ymax) * ph; }, els = [], nt = 5;
    for (var i = 0; i <= nt; i++) { var tk = ymax / nt * i, yy = y(tk);
      els.push(S('line', { x1: m.l, x2: m.l + pw, y1: yy, y2: yy, stroke: 'rgba(17,17,17,0.09)', strokeWidth: 1 }));
      els.push(S('text', { x: m.l - 9, y: yy + 4, textAnchor: 'end', fontSize: 11, fill: '#737373', fontFamily: "'Chakra Petch'" }, [Math.round(tk)])); }
    names.forEach(function (nm, gi) {
      var gx = m.l + gi * gw + bandPad;
      cfg.series.forEach(function (sn, si) {
        if (state.benchHidden[sn]) return;
        var v = cfg.tasks[nm][si], col = colorFor(sn), bx = gx + si * bw, bh = (v / ymax) * ph, by = m.t + ph - bh, ours = /adaptive/i.test(sn);
        var sd = (cfg.std && cfg.std[nm]) ? cfg.std[nm][si] : 0, ecx = bx + bw / 2, eTop = y(Math.min(ymax, v + sd)), labelY = sd > 0 ? eTop - 4 : by - 4;
        els.push(S('rect', { 'class': 'bar', x: bx + 1, y: by, width: Math.max(bw - 2, 1), height: bh, rx: 2.5, fill: col, style: { cursor: 'pointer' },
          onMouseMove: (function (nm, sn, v, col, sd) { return function (e) { showTip(e, nm, [{ name: sn, val: v + '% ± ' + sd, color: col }]); }; })(nm, sn, v, col, sd), onMouseLeave: hideTip }));
        if (sd > 0) {
          var eBot = y(Math.max(0, v - sd)), cap = Math.min(bw * 0.32, 5);
          els.push(S('line', { 'class': 'bar-anno', x1: ecx, x2: ecx, y1: eTop, y2: eBot, stroke: '#111111', strokeWidth: 1.1, 'stroke-opacity': 0.62 }));
          els.push(S('line', { 'class': 'bar-anno', x1: ecx - cap, x2: ecx + cap, y1: eTop, y2: eTop, stroke: '#111111', strokeWidth: 1.1, 'stroke-opacity': 0.62 }));
          els.push(S('line', { 'class': 'bar-anno', x1: ecx - cap, x2: ecx + cap, y1: eBot, y2: eBot, stroke: '#111111', strokeWidth: 1.1, 'stroke-opacity': 0.62 }));
        }
        if (state.grown) els.push(S('text', { 'class': 'bar-anno', x: bx + bw / 2, y: labelY, textAnchor: 'middle', fontSize: 8.5, fontFamily: "'Chakra Petch'", fill: ours ? '#1A8341' : '#525252', fontWeight: ours ? 700 : 600 }, [v]));
      });
      wrap(nm, 13).forEach(function (ln, li) { els.push(S('text', { x: m.l + gi * gw + gw / 2, y: m.t + ph + 19 + li * 13, textAnchor: 'middle', fontSize: 11, fill: '#404040', fontFamily: "'DM Sans'" }, [ln])); });
    });
    els.push(S('line', { x1: m.l, x2: m.l + pw, y1: m.t + ph, y2: m.t + ph, stroke: '#111111', strokeWidth: 1.5 }));
    return h('div', { style: { width: '100%' } }, [S('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', style: { display: 'block', overflow: 'visible' } }, els)]);
  }

  function lineChart(cfg) {
    var W = 560, H = 380, m = { l: 54, r: 14, t: 16, b: 48 };
    var pw = W - m.l - m.r, ph = H - m.t - m.b, sx = scaler(cfg.xDomain, [m.l, m.l + pw], cfg.xLog), sy = scaler(cfg.yDomain, [m.t + ph, m.t], cfg.yLog);
    var els = [], xf = cfg.xfmt || function (v) { return v; }, yf = cfg.yfmt || function (v) { return v; };
    cfg.yTicks.forEach(function (t) { var yy = sy(t); els.push(S('line', { x1: m.l, x2: m.l + pw, y1: yy, y2: yy, stroke: 'rgba(17,17,17,0.09)' })); els.push(S('text', { x: m.l - 9, y: yy + 4, textAnchor: 'end', fontSize: 10.5, fill: '#737373', fontFamily: "'Chakra Petch'" }, [yf(t)])); });
    cfg.xTicks.forEach(function (t) { var xx = sx(t); els.push(S('line', { x1: xx, x2: xx, y1: m.t, y2: m.t + ph, stroke: 'rgba(17,17,17,0.06)' })); els.push(S('text', { x: xx, y: m.t + ph + 18, textAnchor: 'middle', fontSize: 10.5, fill: '#737373', fontFamily: "'Chakra Petch'" }, [xf(t)])); });
    cfg.series.forEach(function (s) { if (cfg.hiddenMap[s.name]) return; var d = s.data.map(function (p, i) { return (i ? 'L' : 'M') + sx(p[0]).toFixed(1) + ' ' + sy(p[1]).toFixed(1); }).join(' ');
      els.push(S('path', { d: d, fill: 'none', stroke: s.color, strokeWidth: s.width || 2, strokeDasharray: s.dash || '0', strokeLinecap: 'round', strokeLinejoin: 'round', opacity: (s.width >= 3) ? 1 : 0.92 })); });
    var lh = state.lineHover;
    if (lh && lh.chart === cfg.id) { var xx = sx(cfg.series[0].data[lh.idx][0]); els.push(S('line', { x1: xx, x2: xx, y1: m.t, y2: m.t + ph, stroke: 'rgba(17,17,17,0.4)', strokeDasharray: '3 3' }));
      cfg.series.forEach(function (s) { if (cfg.hiddenMap[s.name]) return; var p = s.data[lh.idx]; els.push(S('circle', { cx: sx(p[0]), cy: sy(p[1]), r: 3.4, fill: s.color, stroke: '#F9F9F7', strokeWidth: 1.4 })); }); }
    els.push(S('text', { x: m.l + pw / 2, y: H - 3, textAnchor: 'middle', fontSize: 11, fill: '#404040', fontFamily: "'DM Sans'" }, [cfg.xLabel]));
    els.push(S('text', { x: 15, y: m.t + ph / 2, textAnchor: 'middle', fontSize: 11, fill: '#404040', fontFamily: "'DM Sans'", transform: 'rotate(-90 15 ' + (m.t + ph / 2) + ')' }, [cfg.yLabel]));
    els.push(S('rect', { x: m.l, y: m.t, width: pw, height: ph, fill: 'transparent', style: { cursor: 'crosshair' }, onMouseMove: function (e) { lineTip(e, cfg); }, onMouseLeave: lineTipOut }));
    return h('div', { style: { width: '100%' } }, [S('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', style: { display: 'block', overflow: 'visible' } }, els)]);
  }
  function lineTip(e, cfg) {
    var rect = e.currentTarget.getBoundingClientRect(), frac = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)), n = cfg.series[0].data.length;
    var idx = Math.max(0, Math.min(n - 1, Math.round(frac * (n - 1)))), xv = cfg.series[0].data[idx][0];
    var rows = cfg.series.filter(function (s) { return !cfg.hiddenMap[s.name]; }).map(function (s) { return { name: s.name, color: s.color, val: cfg.tipfmt ? cfg.tipfmt(s.data[idx][1]) : s.data[idx][1] }; });
    state.lineHover = { chart: cfg.id, idx: idx };
    showTip(e, cfg.tipTitle ? cfg.tipTitle(xv) : ('x = ' + xv), rows);
    renderScaling();
  }
  function lineTipOut() { state.lineHover = null; hideTip(); renderScaling(); }

  /* ---------- scaling config ---------- */
  var KS = []; for (var _i = 0; _i <= 50; _i++) KS.push(Math.pow(10, (_i / 50) * 3));
  var XF = function (v) { return ({ 1: '1', 10: '10', 100: '100', 1000: '1000' })[Math.round(v)] || ''; };
  function scalingCfg(idx) {
    if (idx === 0) return { id: 'sf', series: buildScale(DATA.scaling.failure, KS), hiddenMap: state.scalingHidden, xDomain: [1, 1000], yDomain: [0.18, 0.42], xLog: true, yLog: false, xTicks: [1, 10, 100, 1000], yTicks: [0.20, 0.25, 0.30, 0.35, 0.40], xLabel: 'Action samples (k)', yLabel: 'Oracle action error', xfmt: XF, yfmt: function (v) { return v.toFixed(2); }, tipfmt: function (v) { return v.toFixed(3); }, tipTitle: function (v) { return 'k ≈ ' + Math.round(v); } };
    return { id: 'ss', series: buildScale(DATA.scaling.success, KS), hiddenMap: state.scalingHidden, xDomain: [1, 1000], yDomain: [0.004, 0.058], xLog: true, yLog: false, xTicks: [1, 10, 100, 1000], yTicks: [0.01, 0.02, 0.03, 0.04, 0.05], xLabel: 'Action samples (k)', yLabel: 'Oracle action error', xfmt: XF, yfmt: function (v) { return v.toFixed(2); }, tipfmt: function (v) { return v.toFixed(3); }, tipTitle: function (v) { return 'k ≈ ' + Math.round(v); } };
  }

  /* ---------- renderers ---------- */
  function renderToc() {
    var nav = $('toc-nav'); clear(nav);
    TOC.forEach(function (t) {
      var id = t[0], a = state.activeSection === id;
      nav.appendChild(h('a', { href: '#' + id, 'data-toc': id, style: { display: 'block', fontFamily: "'Chakra Petch'", fontSize: '11px', lineHeight: '1.3', padding: '7px 0 7px 13px', borderLeft: '2px solid ' + (a ? '#1A8341' : '#E2E2DC'), color: a ? '#1A8341' : '#525252', fontWeight: a ? 600 : 500, letterSpacing: '0.05em', textTransform: 'uppercase' } }, [t[1]]));
    });
  }

  function renderBench() {
    var bench = DATA.benchmarks[state.activeBench];
    $('bench-title').textContent = bench.title;
    var tabs = $('bench-tabs'); clear(tabs);
    BENCH_TABS.forEach(function (t) {
      var id = t[0], a = id === state.activeBench;
      tabs.appendChild(h('button', { 'data-id': id, onClick: function () { state.activeBench = id; renderBench(); }, style: { cursor: 'pointer', fontFamily: "'Chakra Petch'", fontSize: '10.5px', fontWeight: '500', letterSpacing: '0.04em', textTransform: 'uppercase', padding: '8px 11px', background: a ? '#111111' : '#F9F9F7', color: a ? '#F9F9F7' : '#111111', border: '1px solid #111111', borderRadius: '8px', transition: 'all .2s' } }, [t[1]]));
    });
    var ser = $('bench-series'); clear(ser);
    bench.series.forEach(function (n) {
      var col = colorFor(n);
      ser.appendChild(h('button', { onClick: function () { state.benchHidden[n] = !state.benchHidden[n]; renderBench(); }, style: { cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', padding: '2px 0', opacity: state.benchHidden[n] ? '0.34' : '1' } }, [
        h('span', { style: { width: '12px', height: '12px', background: col } }),
        h('span', { style: { fontFamily: "'DM Sans'", fontSize: '12.5px', color: '#222222' } }, [n])
      ]));
    });
    var chart = $('bench-chart'); clear(chart);
    chart.className = state.grown ? 'bench-grown' : '';
    chart.appendChild(barChart({ tasks: bench.tasks, series: bench.series, ymax: bench.ymax, std: bench.std }));
  }

  /* combined test-time scaling — its own block under the benchmark card */
  function renderSamples() {
    var sc = DATA.scalingSamples, legend = $('samples-legend'); if (!legend) return;
    clear(legend);
    sc.series.forEach(function (n, i) {
      legend.appendChild(h('button', { onClick: function () { state.samplesHidden[n] = !state.samplesHidden[n]; renderSamples(); }, style: { cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', padding: '2px 0', opacity: state.samplesHidden[n] ? '0.34' : '1' } }, [
        h('span', { style: { width: '12px', height: '12px', background: sc.colors[i] } }),
        h('span', { style: { fontFamily: "'DM Sans'", fontSize: '12.5px', color: '#222222' } }, [n])
      ]));
    });
    var chart = $('samples-chart'); clear(chart);
    chart.className = state.grown ? 'samples-grown' : '';
    chart.appendChild(hbarChart(sc));
  }

  function renderScaling() {
    var legend = $('scaling-legend'); clear(legend);
    Object.keys(DATA.scaling.failure).forEach(function (n) {
      legend.appendChild(h('button', { onClick: function () { state.scalingHidden[n] = !state.scalingHidden[n]; renderScaling(); }, style: { cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px', background: 'none', border: 'none', padding: '2px 0', opacity: state.scalingHidden[n] ? '0.34' : '1' } }, [
        h('span', { style: { width: '16px', height: '3px', background: scaleDash(n) !== '0' ? 'repeating-linear-gradient(90deg,' + scaleColor(n) + ' 0 4px,transparent 4px 7px)' : scaleColor(n) } }),
        h('span', { style: { fontFamily: "'Chakra Petch'", fontSize: '11.5px', color: '#222222' } }, [n])
      ]));
    });
    var cf = $('scaling-chart-failure'); clear(cf); cf.appendChild(lineChart(scalingCfg(0)));
    var cs = $('scaling-chart-success'); clear(cs); cs.appendChild(lineChart(scalingCfg(1)));
  }

  /* ---------- combined scaling (samples × rephrases) horizontal bar chart ---------- */
  function hbarChart(cfg) {
    var W = 820, H = 372, m = { l: 128, r: 150, t: 20, b: 40 };
    var pw = W - m.l - m.r, ph = H - m.t - m.b, ymax = cfg.ymax, ng = cfg.groups.length, ns = cfg.series.length;
    var x = function (v) { return m.l + (v / ymax) * pw; }, els = [];
    for (var t = 0; t <= ymax; t += 10) { var xx = x(t);
      els.push(S('line', { x1: xx, x2: xx, y1: m.t, y2: m.t + ph, stroke: 'rgba(17,17,17,0.09)', strokeWidth: 1 }));
      els.push(S('text', { x: xx, y: m.t + ph + 20, textAnchor: 'middle', fontSize: 11, fill: '#737373', fontFamily: "'Chakra Petch'" }, [t])); }
    els.push(S('text', { x: m.l + pw / 2, y: H - 2, textAnchor: 'middle', fontSize: 11, fill: '#404040', fontFamily: "'DM Sans'" }, ['Success Rate (%)']));
    var gh = ph / ng;
    cfg.groups.forEach(function (grp, gi) {
      var gy0 = m.t + gi * gh, gpad = gh * 0.11, bgap = 4, bh = (gh - 2 * gpad - (ns - 1) * bgap) / ns, gyc = gy0 + gh / 2;
      var lines = wrap(grp.name, 16);
      lines.forEach(function (ln, li) { els.push(S('text', { x: m.l - 12, y: gyc - (lines.length - 1) * 9 + li * 18 + 4, textAnchor: 'end', fontSize: 12.5, fontFamily: "'DM Sans'", fontWeight: 600, fill: '#111111' }, [ln])); });
      grp.vals.forEach(function (v, si) {
        var sn = cfg.series[si]; if (state.samplesHidden[sn]) return;
        var by = gy0 + gpad + si * (bh + bgap), col = cfg.colors[si], sd = grp.std[si], yc = by + bh / 2;
        els.push(S('rect', { 'class': 'hbar', x: m.l, y: by, width: Math.max(1, x(v) - m.l), height: bh, rx: 2.5, fill: col, style: { cursor: 'pointer' },
          onMouseMove: (function (v, sn, col, sd) { return function (e) { showTip(e, grp.name, [{ name: sn, val: v.toFixed(1) + '% ± ' + sd.toFixed(1), color: col }]); }; })(v, sn, col, sd), onMouseLeave: hideTip }));
        if (sd > 0) { var xl = x(Math.max(0, v - sd)), xr = x(Math.min(ymax, v + sd)), cap = Math.min(bh * 0.32, 6);
          els.push(S('line', { 'class': 'hbar-anno', x1: xl, x2: xr, y1: yc, y2: yc, stroke: '#111111', strokeWidth: 1.2, 'stroke-opacity': 0.62 }));
          els.push(S('line', { 'class': 'hbar-anno', x1: xl, x2: xl, y1: yc - cap, y2: yc + cap, stroke: '#111111', strokeWidth: 1.2, 'stroke-opacity': 0.62 }));
          els.push(S('line', { 'class': 'hbar-anno', x1: xr, x2: xr, y1: yc - cap, y2: yc + cap, stroke: '#111111', strokeWidth: 1.2, 'stroke-opacity': 0.62 })); }
        els.push(S('text', { 'class': 'hbar-anno', x: x(Math.min(ymax, v + sd)) + 6, y: yc + 3.5, textAnchor: 'start', fontSize: 9.5, fontFamily: "'Chakra Petch'", fontWeight: 600, fill: '#525252' }, [v.toFixed(1)]));
      });
      var ax = m.l + pw + 20, ty = gyc - 20, tx = ax + 28;
      els.push(S('line', { 'class': 'hbar-anno', x1: ax, x2: tx, y1: gyc + 20, y2: ty, stroke: grp.gainColor, strokeWidth: 2.6, strokeLinecap: 'round' }));
      els.push(S('polygon', { 'class': 'hbar-anno', points: tx + ',' + ty + ' ' + (tx - 11) + ',' + (ty + 3) + ' ' + (tx - 4) + ',' + (ty + 11), fill: grp.gainColor }));
      els.push(S('text', { 'class': 'hbar-anno', x: tx + 8, y: gyc + 5, textAnchor: 'start', fontSize: 14, fontFamily: "'Chakra Petch'", fontWeight: 700, fill: grp.gainColor }, ['+' + grp.gain.toFixed(1) + '%']));
    });
    els.push(S('line', { x1: m.l, x2: m.l + pw, y1: m.t + ph, y2: m.t + ph, stroke: '#111111', strokeWidth: 1.5 }));
    return h('div', { style: { width: '100%' } }, [S('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', style: { display: 'block', overflow: 'visible' } }, els)]);
  }
  var galleryVids = [], galleryIO = null, galleryTimer = null;
  var GALLERY_AUTO_MS = 12000, GALLERY_STALL_MS = 8000;
  var galleryRemain = GALLERY_AUTO_MS, galleryLast = 0, galleryStall = 0;
  function galleryInView() { var g = $('gallery'); if (!g) return false; var r = g.getBoundingClientRect(), vh = window.innerHeight || 800; return r.bottom > vh * 0.15 && r.top < vh * 0.85; }
  function galleryPlaying() {
    for (var i = 0; i < galleryVids.length; i++) { var v = galleryVids[i]; if (v && !v.paused && !v.ended && v.currentTime > 0) return true; }
    return false;
  }
  // The tab's turn is measured in *watch* time, not wall-clock time: the clock only
  // advances while the gallery is on screen and its clips are actually rolling.
  // Otherwise the seconds spent scrolling down the page (or on a hidden tab) burn
  // the turn and the videos get cut off part-way through.
  function scheduleGalleryAuto() {
    clearInterval(galleryTimer);
    galleryRemain = GALLERY_AUTO_MS; galleryStall = 0; galleryLast = performance.now();
    galleryTimer = setInterval(function () {
      var now = performance.now(), dt = now - galleryLast;
      galleryLast = now;
      if (document.hidden || !galleryInView()) { galleryStall = 0; return; }
      if (!galleryPlaying()) {
        // safety net: never wedge the rotation on a clip that fails to load
        galleryStall += dt;
        if (galleryStall < GALLERY_STALL_MS) return;
      } else galleryStall = 0;
      galleryRemain -= dt;
      if (galleryRemain <= 0) {
        clearInterval(galleryTimer);
        state.galleryTab = (state.galleryTab === 'ood_prompt') ? 'ood_env' : 'ood_prompt';
        renderGallery();
      }
    }, 250);
  }
  function renderGallery() {
    var tab = state.galleryTab;
    var tabs = $('gallery-tabs'); clear(tabs);
    [['ood_prompt', 'OOD Prompt'], ['ood_env', 'OOD Environment']].forEach(function (g, i) {
      var a = g[0] === tab;
      tabs.appendChild(h('button', { onClick: function () { state.galleryTab = g[0]; renderGallery(); }, style: { cursor: 'pointer', fontFamily: "'Chakra Petch'", fontSize: '11.5px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '9px 20px', border: 'none', borderRight: '1px solid ' + (i === 0 ? '#111111' : 'transparent'), background: a ? '#111111' : '#F9F9F7', color: a ? '#F9F9F7' : '#111111' } }, [g[1]]));
    });
    var fc = $('gallery-filters'); clear(fc);
    fc.appendChild(h('div', { style: { display: 'flex', alignItems: 'center', gap: '14px', fontFamily: "'Chakra Petch'", fontSize: '10.5px', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#525252' } }));

    var INSIGHT = {
      ood_prompt: 'On out-of-domain prompts, adaptive steering pre-empts failure and <strong style="color:#111111;font-style:normal">replans on the fly</strong> &mdash; recovering task success where the frozen VLA stalls.',
      ood_env: 'In out-of-domain environments, adaptive steering <strong style="color:#111111;font-style:normal">diversifies actions to reject distractors and unfamiliar objects</strong> (e.g. lifting the tape clear of clutter) &mdash; where the base VLA gets stuck.'
    };
    var ins = $('gallery-insight'); clear(ins);
    ins.appendChild(h('div', { style: { margin: '26px 0 4px' } }, [
      h('div', { style: { fontFamily: "'Chakra Petch'", fontSize: '11px', fontWeight: '600', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#1A8341' } }, ['Key Insight']),
      h('blockquote', { style: { position: 'relative', fontFamily: "'DM Sans'", fontStyle: 'italic', fontWeight: '500', fontSize: 'clamp(18px,2.3vw,24px)', lineHeight: '1.4', color: '#111111', margin: '14px 0 0', padding: '0 0 0 54px', maxWidth: '820px', textWrap: 'pretty' }, html: '<span aria-hidden="true" style="position:absolute;left:0;top:-14px;font-family:\'DM Sans\';font-style:italic;font-weight:700;font-size:74px;line-height:1;color:#1A8341">&ldquo;</span>' + INSIGHT[tab] })
    ]));

    if (galleryIO) { galleryIO.disconnect(); }
    galleryVids = [];
    var items = DATA.gallery[tab];
    var grid = $('gallery-grid'); clear(grid);
    grid.style.display = 'block';
    items.forEach(function (it) {
      var methods = h('div', { 'class': 'gal-methods ' + (tab === 'ood_env' ? 'env' : 'prompt') }, [
        galGroup('Rephrase', [galTile(it.rephrase, 'Rephrase', {})]),
        tab === 'ood_env' ? galGroup('Compose-Always', [galTile(it.composeAlways, 'Compose-Always', {})]) : null,
        galGroup('RL² Adaptive', [galTile(it.adaptive, 'Adaptive steering', { ours: true }), galTile(it.plot, 'Failure detection', { ours: true, plot: true })], true)
      ]);
      grid.appendChild(h('div', { 'class': 'gal-card hv-card' }, [
        h('div', { 'class': 'gal-head' }, [
          h('div', {}, [
            h('div', { style: { fontFamily: "'DM Sans'", fontWeight: '700', fontSize: '16px', color: '#111111' } }, [it.task]),
            h('div', { style: { fontFamily: "'Chakra Petch'", fontSize: '10.5px', color: '#A3A3A3', marginTop: '3px', letterSpacing: '0.06em', textTransform: 'uppercase' }, html: it.env })
          ]),
          h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '7px' } }, [
            galStatRow('Rephrase', it.base, '#E27B33', 'RL<sup>2</sup> (Compose-Adaptive)', it.ours, '#1A8341'),
            (tab === 'ood_env' && it.compose != null) ? galStatRow('RL<sup>2</sup> (Compose-Always)', it.compose, '#29A9DF', 'RL<sup>2</sup> (Compose-Adaptive)', it.ours, '#1A8341') : null
          ])
        ]),
        methods
      ]));
    });

    galleryIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        // lazily attach the source as the tile nears the viewport, but only start
        // playback once the tile is actually visible on screen
        if (e.isIntersecting && !v.src) { v.src = v.getAttribute('data-src'); }
        if (e.isIntersecting && e.intersectionRatio >= 0.25) { v.play().catch(function () {}); }
        else { v.pause(); }
      });
    }, { rootMargin: '0px', threshold: [0, 0.25] });
    galleryVids.forEach(function (v) { galleryIO.observe(v); });
    scheduleGalleryAuto();
  }
  function galStatRow(fromName, fromVal, fromColor, toName, toVal, toColor) {
    var d = toVal - fromVal, up = d >= 0, bc = up ? '#1A8341' : '#B91C1C';
    return h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' } }, [
      h('span', { style: { fontFamily: "'Chakra Petch'", fontSize: '11px', color: '#525252' }, html: fromName + ' <span style="color:' + fromColor + ';font-weight:700">' + fromVal + '%</span> &rarr; ' + toName + ' <span style="color:' + toColor + ';font-weight:700">' + toVal + '%</span>' }),
      h('span', { style: { fontFamily: "'Chakra Petch'", fontSize: '12px', fontWeight: '700', color: bc, background: '#F9F9F7', border: '1px solid ' + bc, padding: '4px 9px', whiteSpace: 'nowrap', borderRadius: '6px' }, html: (up ? '&#9650; +' : '&#9660; &minus;') + Math.abs(d).toFixed(1) + '%' })
    ]);
  }
  function galGroup(label, tiles, combo) {
    return h('div', { 'class': 'gal-group' + (combo ? ' combo' : '') }, [
      h('div', { 'class': 'gal-group-label', html: label.replace('²', '<sup>2</sup>') }),
      h('div', { 'class': 'gal-tiles' }, tiles)
    ]);
  }
  function galTile(src, tag, opts) {
    opts = opts || {};
    var v = h('video', { preload: 'none', 'data-src': GVID + encodeURI(src) });
    v.muted = true; v.loop = true; v.playsInline = true;
    v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('loop', '');
    galleryVids.push(v);
    return h('div', { 'class': 'gal-tile' + (opts.plot ? ' plot' : '') + (opts.ours ? ' ours' : '') }, [
      v, h('div', { 'class': 'gal-tag' }, [tag])
    ]);
  }

  /* ---------- arch carousel ---------- */
  var archStep = 0, archPaused = false, archTimer = null, archStart = 0, archRem = ARCH_DUR;
  function archIcon() { return archPaused ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>' : '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14"></rect><rect x="14" y="5" width="4" height="14"></rect></svg>'; }
  function archRenderFrames() {
    var box = $('arch-frames'); clear(box);
    ARCH_FRAMES.forEach(function (f, i) { box.appendChild(h('img', { src: f.src, alt: f.title, style: { position: 'absolute', inset: '0', width: '100%', height: '100%', objectFit: 'contain', opacity: i === archStep ? '1' : '0', transition: 'opacity .7s ease-in-out', pointerEvents: 'none' } })); });
  }
  function archRender() {
    $('arch-counter').textContent = (archStep + 1) + ' / ' + ARCH_FRAMES.length;
    $('arch-pause').innerHTML = archIcon();
    var frames = $('arch-frames').children;
    for (var i = 0; i < frames.length; i++) frames[i].style.opacity = i === archStep ? '1' : '0';
    var cur = ARCH_FRAMES[archStep], cap = $('arch-caption'); clear(cap);
    cap.appendChild(h('div', { style: { animation: 'archcapin .5s ease-out' } }, [
      h('div', { style: { fontFamily: "'Chakra Petch'", fontSize: '11px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1A8341', marginBottom: '6px' } }, ['Step ' + (archStep + 1) + ' — ' + cur.title]),
      h('p', { style: { fontFamily: "'DM Sans'", fontSize: '14.5px', lineHeight: '1.6', color: '#404040', margin: '0 auto', maxWidth: '640px' } }, [cur.caption])
    ]));
    var steps = $('arch-steps'); clear(steps);
    ARCH_FRAMES.forEach(function (f, i) {
      var a = i === archStep;
      var btn = h('button', { 'data-i': i, onClick: function () { archGoTo(i); }, style: { cursor: 'pointer', position: 'relative', textAlign: 'left', overflow: 'hidden', background: a ? '#F0F6F2' : '#F9F9F7', border: '1px solid ' + (a ? '#1A8341' : '#E2E2DC'), borderRadius: '9px', padding: '9px 11px', transition: 'background .3s,border-color .3s' } }, [
        h('div', { style: { fontFamily: "'Chakra Petch'", fontSize: '9.5px', fontWeight: '600', letterSpacing: '0.1em', color: a ? '#1A8341' : '#A3A3A3' } }, ['0' + (i + 1)]),
        h('div', { style: { fontFamily: "'DM Sans'", fontSize: '12px', fontWeight: '600', lineHeight: '1.22', marginTop: '3px', color: a ? '#111111' : '#525252' } }, [f.title])
      ]);
      if (a) btn.appendChild(h('div', { style: { position: 'absolute', left: '0', bottom: '0', height: '2.5px', background: '#1A8341', animation: 'archfill ' + ARCH_DUR + 'ms linear forwards', animationPlayState: archPaused ? 'paused' : 'running' } }));
      steps.appendChild(btn);
    });
  }
  function archSchedule(delay) { clearTimeout(archTimer); archStart = Date.now(); archRem = delay; archTimer = setTimeout(archAdvance, delay); }
  function archAdvance() { archStep = (archStep + 1) % ARCH_FRAMES.length; archRender(); if (!archPaused) archSchedule(ARCH_DUR); }
  function archGoTo(i) { archStep = i; archRender(); if (!archPaused) archSchedule(ARCH_DUR); }
  function archTogglePause() { archPaused = !archPaused; if (archPaused) { archRem = Math.max(0, archRem - (Date.now() - archStart)); clearTimeout(archTimer); archRender(); } else { archRender(); archSchedule(archRem || ARCH_DUR); } }

  /* ---------- demo player (RL² in action carousel) ---------- */
  var demo = { ex: 0, gen: 0, phase: 'baseline', phaseStart: 0, cam: null, plot: null, ov: null, ovNum: null, ovTitle: null, ovDesc: null,
    loaders: [], mbtns: [], tops: [], markers: [], ticks: [], groupBase: null, groupOurs: null, baseStatus: null, oursStatus: null,
    stage: null, playIcon: null, pauseIcon: null, track: null, fill: null, timeEl: null,
    playing: true, ready: false, markerPause: false, pauseUntil: 0, triggered: {}, prevT: 0, inView: false, dur: 8.4, baseDur: 9, fig: null, vc: 0, fallback: null };
  function fmt(s) { s = Math.max(0, s || 0); var m = Math.floor(s / 60), sec = Math.floor(s % 60); return m + ':' + (sec < 10 ? '0' : '') + sec; }
  function demoFigInView() { var fig = demo.fig || (demo.fig = document.querySelector('[data-demo-fig]')); if (!fig) return true; var rr = fig.getBoundingClientRect(), vh = window.innerHeight || 800; return rr.bottom > vh * 0.1 && rr.top < vh * 0.9; }
  function demoLoaders(show) { demo.loaders.forEach(function (l) { if (l) l.style.display = show ? 'flex' : 'none'; }); }
  function topDur() { var d = 0; demo.tops.forEach(function (v) { if (v && v.duration && isFinite(v.duration)) d = Math.max(d, v.duration); }); return d || demo.baseDur; }
  function baseT() { var t = 0; demo.tops.forEach(function (v) { if (v) t = Math.max(t, v.currentTime || 0); }); return t; }
  function phaseVids() { return demo.phase === 'baseline' ? demo.tops : [demo.cam, demo.plot]; }
  function idleVids() { return demo.phase === 'baseline' ? [demo.cam, demo.plot] : demo.tops; }
  function demoPlay() { phaseVids().forEach(function (v) { if (v) v.play().catch(function () {}); }); idleVids().forEach(function (v) { if (v) v.pause(); }); }
  function demoPause() { [demo.cam, demo.plot].concat(demo.tops).forEach(function (v) { if (v) v.pause(); }); }
  function demoSyncIcon() { var p = demo.playing && !demo.markerPause; if (demo.playIcon) demo.playIcon.style.display = p ? 'none' : 'block'; if (demo.pauseIcon) demo.pauseIcon.style.display = p ? 'block' : 'none'; }
  function updateStatusUI() {}
  function toggleTicks(show) { demo.ticks.forEach(function (t) { if (t) t.style.display = show ? 'block' : 'none'; }); }
  function setPhase(p) {
    demo.phase = p; demo.phaseStart = performance.now();
    if (demo.groupBase) demo.groupBase.classList.toggle('active', p === 'baseline');
    if (demo.groupOurs) demo.groupOurs.classList.toggle('active', p === 'proposed');
    toggleTicks(p === 'proposed');
    demoHideOverlay(); updateStatusUI(); demoSyncIcon();
  }
  function demoSetActive(n) { demo.mbtns.forEach(function (b, i) { if (!b) return; var on = (i + 1) === n; b.style.background = on ? '#1A8341' : 'rgba(249,249,247,0.95)'; b.style.color = on ? '#F9F9F7' : '#111111'; b.style.borderColor = on ? '#1A8341' : '#111111'; b.style.boxShadow = on ? '0 0 0 4px rgba(26,131,65,0.28),0 2px 9px rgba(0,0,0,0.3)' : '0 2px 7px rgba(0,0,0,0.18)'; }); }
  function demoShowOverlay(m) { if (demo.ovNum) demo.ovNum.textContent = m.n; if (demo.ovTitle) demo.ovTitle.textContent = m.title; if (demo.ovDesc) demo.ovDesc.textContent = m.desc; if (demo.ov) { demo.ov.style.opacity = '1'; demo.ov.style.transform = 'translateY(0)'; } demoSetActive(m.n); }
  function demoHideOverlay() { if (demo.ov) { demo.ov.style.opacity = '0'; demo.ov.style.transform = 'translateY(10px)'; } demoSetActive(0); }
  function demoEnterMarker(m) { demo.markerPause = true; demo.pauseUntil = performance.now() + 3200; demoPause(); demo.triggered[m.n] = true; demoShowOverlay(m); demoSyncIcon(); updateStatusUI(); }
  function togglePlay() { if (!demo.ready) return; if (demo.playing && !demo.markerPause) { demo.playing = false; demoPause(); } else { demo.playing = true; demo.markerPause = false; demoHideOverlay(); demoPlay(); } demoSyncIcon(); updateStatusUI(); }
  function demoSeek(t) { try { if (demo.cam) demo.cam.currentTime = t; if (demo.plot) demo.plot.currentTime = t; } catch (e) {} demo.triggered = {}; demo.markers.forEach(function (x) { if (x.t <= t + 0.001) demo.triggered[x.n] = true; }); demo.prevT = t; }
  function goBaseline() { try { demo.tops.forEach(function (v) { v.currentTime = 0; }); } catch (e) {} setPhase('baseline'); if (demo.playing && demo.inView) demoPlay(); }
  function goProposed() { demoSeek(0); setPhase('proposed'); if (demo.playing && demo.inView) demoPlay(); }
  function clickMarker(i) { if (!demo.ready) return; var m = demo.markers[i]; if (!m) return; demo.playing = true; if (demo.phase !== 'proposed') setPhase('proposed'); demoSeek(m.t); demoEnterMarker(m); }
  function scrub(e) { if (!demo.ready || !demo.track) return; var r = demo.track.getBoundingClientRect(), f = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)), t = f * demo.dur; if (demo.phase !== 'proposed') setPhase('proposed'); demoSeek(t); demo.markerPause = false; demoHideOverlay(); if (demo.playing) demoPlay(); demoSyncIcon(); updateStatusUI(); }
  function demoTick() {
    if (demo.cam && demo.plot && demo.ready) {
      if ((demo.vc = (demo.vc + 1) % 6) === 0) { demo.inView = demoFigInView(); }
      var prop = demo.phase === 'proposed';
      var t = prop ? (demo.cam.currentTime || 0) : baseT();
      var dur = prop ? demo.dur : topDur();
      if (demo.fill) demo.fill.style.width = Math.min(100, (t / dur) * 100) + '%';
      if (demo.timeEl) demo.timeEl.textContent = fmt(t) + ' / ' + fmt(dur);

      if (demo.markerPause) { if (performance.now() >= demo.pauseUntil) { demo.markerPause = false; demoHideOverlay(); if (demo.playing && demo.inView) demoPlay(); demoSyncIcon(); updateStatusUI(); } }
      else if (demo.playing && demo.inView) {
        if (prop) {
          if (demo.plot.readyState >= 1 && !demo.plot.seeking && Math.abs(demo.plot.currentTime - t) > 0.12) { try { demo.plot.currentTime = t; } catch (e) {} }
          if (demo.cam.paused && !demo.cam.seeking) demoPlay();
          for (var i = 0; i < demo.markers.length; i++) { var m = demo.markers[i]; if (!demo.triggered[m.n] && demo.prevT < m.t && t >= m.t) { demoEnterMarker(m); break; } }
          if (t >= demo.dur) stepDemo(1);
          else demo.prevT = t;
        } else {
          demo.tops.forEach(function (v) { if (v && v.paused && !v.ended && !v.seeking) v.play().catch(function () {}); });
          var done = demo.tops.length && demo.tops.every(function (v) { return v.ended || (v.duration && isFinite(v.duration) && v.currentTime >= v.duration - 0.2); });
          if (done || (performance.now() - demo.phaseStart) > (topDur() + 1.6) * 1000) goProposed();
        }
      } else if (!demo.inView) { demoPause(); }
    }
    requestAnimationFrame(demoTick);
  }
  function prime(vid) { return new Promise(function (res) {
    var done = false;
    var kick = function () { if (done) return; try { vid.currentTime = 1e10; } catch (e) {} };
    var onVis = function () { if (!done && !document.hidden) { try { vid.load(); } catch (e) {} kick(); } };
    var cleanup = function () { vid.removeEventListener('seeked', check); vid.removeEventListener('loadedmetadata', check); vid.removeEventListener('progress', check); vid.removeEventListener('canplaythrough', finish); vid.removeEventListener('error', finish); document.removeEventListener('visibilitychange', onVis); };
    var finish = function () { if (done) return; done = true; cleanup(); try { vid.currentTime = 0; } catch (e) {} res(); };
    var check = function () { var d = vid.duration; if (d && isFinite(d) && vid.seekable.length && vid.seekable.end(vid.seekable.length - 1) >= d - 0.6) finish(); };
    vid.addEventListener('seeked', check); vid.addEventListener('loadedmetadata', check); vid.addEventListener('progress', check); vid.addEventListener('canplaythrough', finish); vid.addEventListener('error', finish);
    document.addEventListener('visibilitychange', onVis);
    try { vid.load(); } catch (e) {} kick(); setTimeout(kick, 350); setTimeout(kick, 1200);
  }); }
  function mkVideo(src, kind) {
    var v = h('video', { src: src, preload: kind === 'loop' ? 'metadata' : 'auto',
      style: { position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block',
        objectFit: kind === 'plot' ? 'fill' : 'cover', background: kind === 'plot' ? '#FFFFFF' : '#0A0A0A' } });
    v.muted = true; v.playsInline = true; v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.loop = false;
    return v;
  }
  function mkGroup(kind, eyebrow, chipText, gridEl) {
    var head = h('div', { class: 'demo-group-head' }, [
      h('div', { class: 'demo-group-titrow' }, [
        h('span', { class: 'demo-group-eyebrow' }, [eyebrow]),
        h('span', { class: 'demo-chip ' + (kind === 'ours' ? 'ok' : 'fail') }, [chipText])
      ])
    ]);
    var group = h('div', { class: 'demo-group ' + kind }, [head, gridEl]);
    return { group: group, status: null };
  }
  function mkLoader() {
    return h('div', { class: 'demo-loader', style: { position: 'absolute', inset: '0', zIndex: '5', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#0A0A0A', color: '#A3A3A3', fontFamily: "'Chakra Petch'", fontSize: '10px', fontWeight: '600', letterSpacing: '0.14em', textTransform: 'uppercase' } }, [
      h('span', { style: { width: '22px', height: '22px', border: '2px solid #333333', borderTopColor: '#1A8341', borderRadius: '50%', animation: 'rl2spin .8s linear infinite' } }), 'Loading'
    ]);
  }
  function mkBlock(vidCfg, kind, opts) {
    opts = opts || {};
    var cls = 'demo-block' + (kind === 'plot' ? ' is-plot' : '') + (opts.hero ? ' is-hero' : '') + (opts.span2 ? ' demo-span2' : '');
    var vid = mkVideo(vidCfg.src, kind);
    var kids = [vid, h('div', { class: 'demo-tag' }, [vidCfg.label])];
    var block = h('div', { class: cls, style: { aspectRatio: opts.aspect || '16/9', gridColumn: opts.span2 ? '1 / -1' : 'auto' } }, kids);
    return { block: block, vid: vid };
  }
  function renderDemo() {
    var cfg = DEMO_EXAMPLES[demo.ex];
    demo.gen++; var gen = demo.gen;
    demo.ready = false; demo.markerPause = false; demo.playing = true; demo.triggered = {}; demo.prevT = 0; demo.phase = 'baseline';
    demo.tops = []; demo.mbtns = []; demo.loaders = []; demo.ticks = []; demo.markers = cfg.markers;

    $('demo-ex-eyebrow').textContent = cfg.eyebrow;
    $('demo-ex-title').textContent = cfg.title;
    renderDemoTabs();

    var stage = demo.stage; clear(stage);

    // ---- group 1: baselines (struggle on this task) ----
    var baseGrid = h('div', { class: 'demo-grid' + (cfg.top.length === 1 ? ' demo-grid-solo' : '') });
    cfg.top.forEach(function (tc) {
      var b = mkBlock(tc, 'loop', { aspect: cfg.blockAspect });
      baseGrid.appendChild(b.block); demo.tops.push(b.vid);
    });
    var baseG = mkGroup('base', 'Baselines', 'Fails', baseGrid);
    demo.groupBase = baseG.group; demo.baseStatus = baseG.status;

    // ---- group 2: RL² (ours) — adaptive steering + failure detection as one loop ----
    var oursGrid = h('div', { class: 'demo-grid' });

    // hero cam block (adaptive rollout) with overlay
    var camB = mkBlock(cfg.cam, 'cam', { aspect: cfg.blockAspect, hero: true });
    demo.cam = camB.vid;
    demo.ovNum = h('span', { style: { flex: 'none', width: '28px', height: '28px', borderRadius: '8px', background: '#1A8341', color: '#F9F9F7', fontFamily: "'Chakra Petch'", fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px' } }, ['1']);
    demo.ovTitle = h('div', { style: { fontFamily: "'Chakra Petch'", fontSize: '10px', fontWeight: '600', letterSpacing: '0.13em', textTransform: 'uppercase', color: '#7BE0A3', marginBottom: '3px' } });
    demo.ovDesc = h('div', { style: { fontFamily: "'DM Sans'", fontWeight: '600', fontSize: 'clamp(13px,1.35vw,16px)', lineHeight: '1.34', color: '#F9F9F7', textWrap: 'pretty' } });
    demo.ov = h('div', { style: { position: 'absolute', left: '0', right: '0', bottom: '0', zIndex: '4', padding: '15px 15px 14px', background: 'linear-gradient(to top,rgba(8,8,8,0.94) 0%,rgba(8,8,8,0.76) 52%,rgba(8,8,8,0) 100%)', opacity: '0', transform: 'translateY(10px)', transition: 'opacity .32s ease,transform .32s ease', pointerEvents: 'none' } }, [
      h('div', { style: { display: 'flex', alignItems: 'flex-start', gap: '11px' } }, [demo.ovNum, h('div', {}, [demo.ovTitle, demo.ovDesc])])
    ]);
    var camLoader = mkLoader(); demo.loaders.push(camLoader);
    camB.block.appendChild(demo.ov); camB.block.appendChild(camLoader);

    // hero plot block (failure detection) with numbered markers
    var plotB = mkBlock(cfg.plot, 'plot', { aspect: cfg.blockAspect, hero: true });
    demo.plot = plotB.vid;
    cfg.markers.forEach(function (m, i) {
      var btn = h('button', { class: 'demo-marker hv-marker', 'aria-label': 'Jump to keypoint ' + m.n,
        style: { position: 'absolute', left: m.x + '%', top: m.y + '%', transform: 'translate(-50%,-50%)', zIndex: '3', width: '27px', height: '27px', borderRadius: '8px', cursor: 'pointer', fontFamily: "'Chakra Petch'", fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(249,249,247,0.95)', border: '1.5px solid #111111', color: '#111111', boxShadow: '0 2px 7px rgba(0,0,0,0.18)' },
        onClick: (function (idx) { return function () { clickMarker(idx); }; })(i) }, [m.n]);
      plotB.block.appendChild(btn); demo.mbtns.push(btn);
    });
    var plotLoader = mkLoader(); plotLoader.style.background = '#FFFFFF'; plotLoader.style.color = '#737373'; demo.loaders.push(plotLoader);
    plotB.block.appendChild(plotLoader);

    oursGrid.appendChild(camB.block); oursGrid.appendChild(plotB.block);
    var oursG = mkGroup('ours', 'RL² — Ours', 'Succeeds', oursGrid);
    demo.groupOurs = oursG.group; demo.oursStatus = oursG.status;

    demo.groupBase.classList.add('active');
    stage.appendChild(demo.groupBase);
    stage.appendChild(demo.groupOurs);

    // clear old keypoint ticks
    [].slice.call(demo.track.querySelectorAll('.demo-tick')).forEach(function (n) { n.remove(); });

    demo.fill.style.width = '0%'; demo.timeEl.textContent = '0:00 / 0:00'; updateStatusUI(); demoSyncIcon(); demoLoaders(true);

    // determine whether the demo is on screen right now (demoTick keeps this fresh afterwards)
    demo.inView = demoFigInView();
    // start baseline videos only when in view; prime hero pair, then add timeline ticks
    if (demo.inView) demo.tops.forEach(function (v) { v.play().catch(function () {}); });
    demo.baseDur = 9;
    demo.fallback = setTimeout(function () { if (gen === demo.gen && !demo.ready) { demo.dur = Math.max(6, (demo.cam.duration || 8.4)); demo.ready = true; demoLoaders(false); setPhase('baseline'); if (demo.inView) demoPlay(); } }, 18000);
    Promise.all([prime(demo.cam), prime(demo.plot)]).then(function () {
      if (gen !== demo.gen) return;
      clearTimeout(demo.fallback);
      try { demo.cam.currentTime = 0; demo.plot.currentTime = 0; } catch (e) {}
      var cd = demo.cam.duration || 8.4, pd = demo.plot.duration || 8.4;
      demo.dur = Math.max(4, Math.min(cd, pd) - 0.04);
      demo.markers.forEach(function (m) {
        var tick = h('span', { class: 'demo-tick', style: { position: 'absolute', top: '50%', left: Math.min(99, (m.t / demo.dur) * 100) + '%', transform: 'translate(-50%,-50%)', width: '7px', height: '7px', borderRadius: '50%', background: '#F9F9F7', border: '1.5px solid #111111', display: 'none' } });
        demo.track.appendChild(tick); demo.ticks.push(tick);
      });
      demo.ready = true; demoLoaders(false); setPhase('baseline'); demo.phaseStart = performance.now(); demo.inView = demoFigInView(); if (demo.inView) demoPlay(); });
  }
  function stepDemo(d) { demo.ex = (demo.ex + d + DEMO_EXAMPLES.length) % DEMO_EXAMPLES.length; renderDemo(); }
  function renderDemoTabs() {
    var tabs = $('demo-tabs'); if (!tabs) return; clear(tabs);
    DEMO_EXAMPLES.forEach(function (ex, i) {
      var a = i === demo.ex;
      tabs.appendChild(h('button', { 'aria-label': 'Show ' + ex.tag + ' example: ' + ex.title, onClick: (function (idx) { return function () { if (idx !== demo.ex) { demo.ex = idx; renderDemo(); } }; })(i),
        style: { cursor: 'pointer', fontFamily: "'Chakra Petch'", fontSize: '11px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '9px 15px', border: 'none', borderRight: i < DEMO_EXAMPLES.length - 1 ? '1px solid #111111' : 'none', background: a ? '#111111' : '#F9F9F7', color: a ? '#F9F9F7' : '#111111', whiteSpace: 'nowrap', transition: 'all .2s' },
        html: '<span style="font-weight:700;color:' + (a ? '#7BE0A3' : '#1A8341') + '">' + ex.tag + '</span> <span style="opacity:.4">&middot;</span> ' + ex.title }));
    });
  }
  function initDemo() {
    demo.stage = $('demo-stage'); demo.playIcon = $('demo-play-icon'); demo.pauseIcon = $('demo-pause-icon'); demo.track = $('demo-track'); demo.fill = $('demo-fill'); demo.timeEl = $('demo-time');
    $('demo-play').addEventListener('click', togglePlay);
    demo.track.addEventListener('click', scrub);
    renderDemo();
    requestAnimationFrame(demoTick);
  }

  /* ---------- bibtex ---------- */
  function initBibtex() {
    $('bibtex-pre').textContent = BIBTEX;
    var lbl = $('copy-label'), ct;
    $('copy-btn').addEventListener('click', function () {
      try { navigator.clipboard.writeText(BIBTEX); } catch (e) {}
      lbl.textContent = 'Copied ✓'; clearTimeout(ct); ct = setTimeout(function () { lbl.textContent = 'Copy'; }, 1800);
    });
  }

  /* ---------- observers ---------- */
  function initObservers() {
    try {
      var rev = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); rev.unobserve(en.target); } }); }, { threshold: 0.08, rootMargin: '0px 0px -12% 0px' });
      document.querySelectorAll('[data-sec]').forEach(function (el) { rev.observe(el); });
    } catch (e) { document.querySelectorAll('[data-sec]').forEach(function (el) { el.classList.add('in'); }); }
    try {
      var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { state.grown = true; renderBench(); renderSamples(); io.disconnect(); } }); }, { threshold: 0.12 });
      var el = $('results'); if (el) io.observe(el); else { state.grown = true; renderBench(); renderSamples(); }
    } catch (e) { state.grown = true; renderBench(); renderSamples(); }
    try {
      var spy = new IntersectionObserver(function (es) { var vis = es.filter(function (e) { return e.isIntersecting; }).sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; }); if (vis[0]) { state.activeSection = vis[0].target.id; renderToc(); } }, { rootMargin: '-18% 0px -70% 0px', threshold: 0 });
      TOC.forEach(function (t) { var s = $(t[0]); if (s) spy.observe(s); });
    } catch (e) {}
  }

  /* ---------- scroll-down cue at the bottom of every section ---------- */
  var CUE_SVG = '<svg width="27" height="42" viewBox="0 0 27 42" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
    + '<rect x="2" y="2" width="23" height="38" rx="11.5"></rect>'
    + '<circle cx="13.5" cy="11" r="2" fill="currentColor" stroke="none" style="animation:rl2wheel 1.8s ease-in-out infinite"></circle></svg>'
    + '<svg width="26" height="20" viewBox="0 0 26 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation:rl2bob 1.8s ease-in-out infinite">'
    + '<polyline points="5 3 13 10 21 3"></polyline><polyline points="5 10 13 17 21 10"></polyline></svg>';
  function initScrollCues() {
    var ids = TOC.map(function (t) { return t[0]; });
    // scroll cue only under the overview (hero) section
    if (ids.length < 2) return;
    var sec = $(ids[0]); if (!sec) return;
    var wrap = h('div', { style: { display: 'flex', justifyContent: 'center', marginTop: '34px' } }, [
      h('a', { href: '#' + ids[1], 'class': 'hv-green', 'aria-label': 'Scroll down for more', style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '7px', color: '#A3A3A3' }, html: CUE_SVG })
    ]);
    sec.appendChild(wrap);
  }

  /* ---------- boot ---------- */
  function init() {
    TT.box = $('tooltip'); TT.title = $('tooltip-title'); TT.rows = $('tooltip-rows');
    renderToc();
    renderBench();
    renderSamples();
    renderScaling();
    renderGallery();
    archRenderFrames(); archRender(); archSchedule(ARCH_DUR);
    $('arch-pause').addEventListener('click', archTogglePause);
    initBibtex();
    initDemo();
    initObservers();
    initScrollCues();
    initTooltipGuards();
  }

  /* ---------- tooltip guards ---------- */
  // The line/bar charts re-render on every mousemove, which removes the very SVG
  // element that carries the `mouseleave` handler — so on scroll (or a fast exit)
  // the leave event can be lost and the fixed-position tooltip stays stuck on screen.
  // Attach the safety nets to the stable chart containers (which persist across
  // re-renders) and to scroll, so the tooltip always clears.
  function clearLineTip() { if (state.lineHover) { state.lineHover = null; renderScaling(); } hideTip(); }
  function initTooltipGuards() {
    ['scaling-chart-failure', 'scaling-chart-success'].forEach(function (id) {
      var el = $(id); if (el) el.addEventListener('mouseleave', clearLineTip);
    });
    ['bench-chart', 'samples-chart'].forEach(function (id) { var el = $(id); if (el) el.addEventListener('mouseleave', hideTip); });
    window.addEventListener('scroll', function () {
      if (TT.box && TT.box.style.display === 'block') { clearLineTip(); }
    }, { passive: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
