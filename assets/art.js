/* CITYTI 城格测试 · 原创「城市团子」插画（纯代码绘制的 SVG：无外部素材、无文字、无位图）
 * TI_ART.svg(key, {size, cls, shiny, title}) -> SVG 字符串
 * 画风与 DOGTI 小狗同一家族：粗描边 #3a2a22 + 扁平马卡龙色 + 粉腮红 + 带高光的圆点眼
 * 约定：<g class="d-eyes"> 只包眼睛（CSS 眨眼）；<g class="d-acc"> 只放漂浮小物（CSS 上下浮动）
 */
(function () {
  'use strict';
  var INK = '#3a2a22';
  var SW = 5;
  var BLUSH = '#ff9aae';
  var uid = 0;

  function f(n) { return Math.round(n * 10) / 10; }
  function ext(o1, o2) {
    var o = {}, k;
    for (k in o1) if (o1.hasOwnProperty(k)) o[k] = o1[k];
    if (o2) for (k in o2) if (o2.hasOwnProperty(k)) o[k] = o2[k];
    return o;
  }
  function a(attrs) {
    var s = '', k;
    for (k in attrs) if (attrs.hasOwnProperty(k) && attrs[k] !== undefined && attrs[k] !== null) s += ' ' + k + '="' + attrs[k] + '"';
    return s;
  }
  function E(cx, cy, rx, ry, fill, extra) { return '<ellipse' + a(ext({ cx: cx, cy: cy, rx: rx, ry: ry, fill: fill }, extra)) + '/>'; }
  function C(cx, cy, r, fill, extra) { return E(cx, cy, r, r, fill, extra); }
  function P(d, fill, extra) { return '<path' + a(ext({ d: d, fill: fill || 'none' }, extra)) + '/>'; }
  function R(x, y, w, h, r, fill, extra) { return '<rect' + a(ext({ x: x, y: y, width: w, height: h, rx: r, fill: fill }, extra)) + '/>'; }
  function G(inner, attrs) { return '<g' + a(attrs || {}) + '>' + inner + '</g>'; }
  function acc(inner) { return '<g class="d-acc">' + inner + '</g>'; }
  var OL = { stroke: INK, 'stroke-width': SW, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' };
  function ol(w) { return { stroke: INK, 'stroke-width': w || SW, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }; }
  function st(color, w, extra) { return ext({ stroke: color, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, extra); }
  // 带墨线的彩色线条（竹签、筷子、提手）
  function stick(d, color, w) { w = w || 4; return P(d, 'none', ol(w + 4.4)) + P(d, 'none', st(color, w)); }
  function rot(deg, x, y) { return 'rotate(' + deg + ' ' + x + ' ' + y + ')'; }

  /* ---------- 团子身体 ---------- */
  // 软麻薯：顶部圆拱、底部微平，最宽处在下 1/4
  function bodyD(o) {
    o = o || {};
    var t = o.t || 58, b = o.b || 175, w = o.w || 75, cx = o.cx || 100;
    var L = cx - w, Rr = cx + w, h = b - t, my = t + h * 0.74;
    return 'M' + cx + ' ' + b +
      ' C' + f(cx - w * 0.56) + ' ' + (b + 1) + ' ' + (L + 2) + ' ' + (b - 3) + ' ' + L + ' ' + f(my) +
      ' C' + (L - 2) + ' ' + f(t + h * 0.34) + ' ' + f(cx - w * 0.6) + ' ' + t + ' ' + cx + ' ' + t +
      ' C' + f(cx + w * 0.6) + ' ' + t + ' ' + (Rr + 2) + ' ' + f(t + h * 0.34) + ' ' + Rr + ' ' + f(my) +
      ' C' + (Rr - 2) + ' ' + (b - 3) + ' ' + f(cx + w * 0.56) + ' ' + (b + 1) + ' ' + cx + ' ' + b + 'Z';
  }
  // 身体 + 裁在身体里的花纹 + 麻薯光泽
  function body(id, fill, o) {
    o = o || {};
    var d = o.d || bodyD(o), cid = 'cb' + id + (o.sfx || '');
    var marks = (o.marks || '') + (o.shine === false ? '' : (o.shineD || shine()));
    return '<defs><clipPath id="' + cid + '"><path d="' + d + '"/></clipPath></defs>' +
      P(d, fill) + '<g clip-path="url(#' + cid + ')">' + marks + '</g>' + P(d, 'none', OL);
  }
  function shine() {
    return P('M42 116 Q44 94 58 82', 'none', st('#fff', 5, { opacity: 0.7 })) + C(67, 75, 3, '#fff', { opacity: 0.7 });
  }
  function belly(color, o) { o = o || {}; return E(o.x || 100, o.y || 170, o.rx || 48, o.ry || 26, color); }
  function feet(fill, o) {
    o = o || {};
    var y = o.y || 178, dx = o.dx || 28;
    return '<g class="d-paws">' + E(100 - dx, y, 14, 10, fill, OL) + E(100 + dx, y, 14, 10, fill, OL) + '</g>';
  }
  // 小短手：rot 为顺时针角度
  function arm(x, y, r, fill) { return E(x, y, 8.5, 10.5, fill, ext(OL, { transform: rot(r, x, y) })); }
  function arms(fill, o) { o = o || {}; var y = o.y || 146; return arm(31, y, 28, fill) + arm(169, y, -28, fill); }

  /* ---------- 五官 ---------- */
  var EY = 120, EXL = 76, EXR = 124, MY = 133;
  function eyes(kind, o) {
    o = o || {};
    var y = o.y || EY, xl = o.xl || EXL, xr = o.xr || (200 - xl), ink = o.ink || '#2a1d17', s = '';
    function dot(x, rx, ry) {
      return E(x, y, rx, ry, ink) + E(f(x + rx * 0.3), f(y - ry * 0.38), f(rx * 0.38), f(ry * 0.3), '#fff') + E(f(x - rx * 0.3), f(y + ry * 0.4), f(rx * 0.16), f(ry * 0.13), '#fff');
    }
    function arc(x, up) {
      return up ? P('M' + (x - 8) + ' ' + (y + 3) + ' Q' + x + ' ' + (y - 8) + ' ' + (x + 8) + ' ' + (y + 3), 'none', ol(4.6)) :
        P('M' + (x - 8) + ' ' + (y - 2) + ' Q' + x + ' ' + (y + 7) + ' ' + (x + 8) + ' ' + (y - 2), 'none', ol(4.6));
    }
    if (kind === 'dot') s = dot(xl, 6.2, 7.6) + dot(xr, 6.2, 7.6);
    else if (kind === 'big') s = dot(xl, 7.6, 9.4) + dot(xr, 7.6, 9.4);
    else if (kind === 'small') s = dot(xl, 5, 6.2) + dot(xr, 5, 6.2);
    else if (kind === 'happy') s = arc(xl, true) + arc(xr, true);
    else if (kind === 'closed') s = arc(xl, false) + arc(xr, false);
    else if (kind === 'wink') s = dot(xl, 6.2, 7.6) + arc(xr, true);
    else if (kind === 'squish') {
      s = P('M' + (xl - 7) + ' ' + (y - 7) + ' L' + (xl + 6) + ' ' + y + ' L' + (xl - 7) + ' ' + (y + 7), 'none', ol(4.8)) +
        P('M' + (xr + 7) + ' ' + (y - 7) + ' L' + (xr - 6) + ' ' + y + ' L' + (xr + 7) + ' ' + (y + 7), 'none', ol(4.8));
    } else if (kind === 'lazy' || kind === 'side') { // 半眯（松弛）/ 斜睨（酷）
      var sh = kind === 'side' ? (o.dir || -3) : 0, lid = o.fur || '#fff';
      [xl, xr].forEach(function (x) {
        s += E(x + sh, y + 1, 6.4, 7.4, ink) + E(x + sh + 2.2, y + 3.4, 1.9, 1.6, '#fff');
        s += P('M' + (x - 10) + ' ' + (y - 10) + ' H' + (x + 10) + ' V' + (y + 0.5) + ' H' + (x - 10) + ' Z', lid);
        s += P('M' + (x - 8.5) + ' ' + (y + 0.5) + ' H' + (x + 8.5), 'none', ol(4));
      });
    } else if (kind === 'relaxed') { // 慵懒弯弯的眼皮
      [xl, xr].forEach(function (x) {
        s += E(x, y + 1, 6.4, 7.4, ink) + E(x + 2, y + 4, 1.9, 1.6, '#fff');
        s += P('M' + (x - 10) + ' ' + (y - 10) + ' H' + (x + 10) + ' V' + (y - 1) + ' Q' + x + ' ' + (y + 5) + ' ' + (x - 10) + ' ' + (y - 1) + ' Z', o.fur || '#fff');
        s += P('M' + (x - 8.5) + ' ' + (y - 0.5) + ' Q' + x + ' ' + (y + 5) + ' ' + (x + 8.5) + ' ' + (y - 0.5), 'none', ol(4));
      });
    } else if (kind === 'star') s = star5(xl, y, 10.5, '#ffd54a') + star5(xr, y, 10.5, '#ffd54a');
    return '<g class="d-eyes">' + s + '</g>';
  }
  function mouth(kind, o) {
    o = o || {};
    var x = o.x || 100, y = o.y || MY, s = '';
    if (kind === 'u') s = P('M' + (x - 6) + ' ' + y + ' Q' + x + ' ' + (y + 6.5) + ' ' + (x + 6) + ' ' + y, 'none', ol(3.8));
    else if (kind === 'w') s = P('M' + (x - 9) + ' ' + (y - 1) + ' Q' + (x - 4.5) + ' ' + (y + 6) + ' ' + x + ' ' + (y - 0.5) + ' Q' + (x + 4.5) + ' ' + (y + 6) + ' ' + (x + 9) + ' ' + (y - 1), 'none', ol(3.8));
    else if (kind === 'open' || kind === 'grin') {
      var hw = kind === 'grin' ? 11 : 8.5, dp = kind === 'grin' ? 10 : 12;
      s = P('M' + (x - hw) + ' ' + (y - 2) + ' Q' + x + ' ' + (y + 1) + ' ' + (x + hw) + ' ' + (y - 2) + ' Q' + (x + hw - 1) + ' ' + (y + dp) + ' ' + x + ' ' + (y + dp) + ' Q' + (x - hw + 1) + ' ' + (y + dp) + ' ' + (x - hw) + ' ' + (y - 2) + 'Z', '#8e3b46', ol(3.6)) +
        P('M' + (x - 5) + ' ' + (y + dp - 3) + ' Q' + x + ' ' + (y + dp - 8) + ' ' + (x + 5) + ' ' + (y + dp - 3) + ' Q' + x + ' ' + (y + dp - 1) + ' ' + (x - 5) + ' ' + (y + dp - 3) + 'Z', '#ff8fa3');
    } else if (kind === 'o') s = E(x, y + 3, 4.2, 5, '#8e3b46', ol(3.4));
    else if (kind === 'smirk') s = P('M' + (x - 8) + ' ' + (y + 1) + ' Q' + (x + 1) + ' ' + (y + 5) + ' ' + (x + 9) + ' ' + (y - 4), 'none', ol(3.8));
    else if (kind === 'flat') s = P('M' + (x - 5) + ' ' + (y + 2) + ' H' + (x + 5), 'none', ol(3.8));
    return '<g class="d-mouth">' + s + '</g>';
  }
  function blush(o) {
    o = o || {};
    var y = o.y || 136, dx = o.dx || 46, rx = o.rx || 10.5, c = o.c || BLUSH, op = o.op || 0.6, cx = o.cx || 100;
    return E(cx - dx, y, rx, f(rx * 0.6), c, { opacity: op }) + E(cx + dx, y, rx, f(rx * 0.6), c, { opacity: op });
  }

  /* ---------- 小物件 ---------- */
  function star(x, y, r, fill) { // 四角闪光
    var d = 'M' + x + ' ' + (y - r) + ' Q' + f(x + r * 0.22) + ' ' + f(y - r * 0.22) + ' ' + (x + r) + ' ' + y + ' Q' + f(x + r * 0.22) + ' ' + f(y + r * 0.22) + ' ' + x + ' ' + (y + r) + ' Q' + f(x - r * 0.22) + ' ' + f(y + r * 0.22) + ' ' + (x - r) + ' ' + y + ' Q' + f(x - r * 0.22) + ' ' + f(y - r * 0.22) + ' ' + x + ' ' + (y - r) + 'Z';
    return P(d, fill || '#ffd54a', ol(3));
  }
  function star5(x, y, r, fill, w) { // 五角星
    var d = '', i, ang, rr;
    for (i = 0; i < 10; i++) {
      ang = -Math.PI / 2 + i * Math.PI / 5; rr = i % 2 ? r * 0.5 : r;
      d += (i ? ' L' : 'M') + f(x + rr * Math.cos(ang)) + ' ' + f(y + rr * Math.sin(ang));
    }
    return P(d + 'Z', fill || '#ffd54a', ol(w || 3));
  }
  function heart(x, y, s, fill, w) {
    var d = 'M' + x + ' ' + f(y + 9 * s) + ' C' + f(x - 14 * s) + ' ' + f(y - 1 * s) + ' ' + f(x - 9 * s) + ' ' + f(y - 12 * s) + ' ' + x + ' ' + f(y - 5 * s) +
      ' C' + f(x + 9 * s) + ' ' + f(y - 12 * s) + ' ' + f(x + 14 * s) + ' ' + f(y - 1 * s) + ' ' + x + ' ' + f(y + 9 * s) + 'Z';
    return P(d, fill || '#ff6f91', w === 0 ? {} : ol(w || 3));
  }
  function steam(x, y, h) { // 一缕热气
    h = h || 20;
    var d = 'M' + x + ' ' + y + ' q-6 ' + f(-h / 4) + ' 0 ' + f(-h / 2) + ' q6 ' + f(-h / 4) + ' 0 ' + f(-h / 2);
    return P(d, 'none', ol(7.4)) + P(d, 'none', st('#fff', 3.4));
  }
  function note(x, y, fill) { // 音符
    return P('M' + (x + 5) + ' ' + y + ' V' + (y - 19) + ' Q' + (x + 13) + ' ' + (y - 15) + ' ' + (x + 13) + ' ' + (y - 8), 'none', ol(3.4)) +
      E(x, y, 6.2, 4.8, fill || INK, ext(ol(3), { transform: rot(-20, x, y) }));
  }
  function flower(x, y, r, fill, mid) { // 五瓣小花
    var s = '', i, ang;
    for (i = 0; i < 5; i++) {
      ang = -Math.PI / 2 + i * 2 * Math.PI / 5;
      s += C(f(x + r * 0.6 * Math.cos(ang)), f(y + r * 0.6 * Math.sin(ang)), f(r * 0.52), fill, ol(2.6));
    }
    return s + C(x, y, f(r * 0.36), mid || '#ffd54a', ol(2.2));
  }
  function petal(x, y, deg, fill) { // 飘落的花瓣
    return P('M0 0 C-7 -4 -7 -13 -2.4 -15 L0 -12.4 L2.4 -15 C7 -13 7 -4 0 0Z', fill || '#ffb3c8', ext(ol(2.6), { transform: 'translate(' + x + ' ' + y + ') rotate(' + deg + ')' }));
  }
  function drop(x, y, s) { // 水滴 / 汗滴
    s = s || 1;
    return P('M' + x + ' ' + y + ' Q' + f(x - 7 * s) + ' ' + f(y + 10 * s) + ' ' + f(x - 4 * s) + ' ' + f(y + 14 * s) + ' Q' + x + ' ' + f(y + 18 * s) + ' ' + f(x + 4 * s) + ' ' + f(y + 14 * s) + ' Q' + f(x + 7 * s) + ' ' + f(y + 10 * s) + ' ' + x + ' ' + y + 'Z', '#9fd8ff', ol(3));
  }

  /* ---------- 16 座城市团子 + 隐藏款 + 彩蛋 + 进度条小高铁 ---------- */
  var ARTS = {
    shenzhen: function (id) { // 天蓝团子 + 头顶小无人机 + 遥控器
      var c = '#8fd4f3';
      var drone = P('M68 33 H132', 'none', ol(5)) + P('M70 33 V23 M130 33 V23', 'none', ol(4)) +
        E(70, 20, 18, 4.6, '#e6f6ff', ol(3.4)) + E(130, 20, 18, 4.6, '#e6f6ff', ol(3.4)) +
        P('M89 43 L85 50 M111 43 L115 50', 'none', ol(3.6)) +
        R(83, 25, 34, 19, 9.5, '#fff', ol(4.4)) + C(100, 34.5, 4.6, '#3d4f70') + C(101.6, 32.8, 1.6, '#fff') + C(111.5, 30, 1.8, '#4cd47a') +
        P('M46 15 Q42 20 46 25 M154 15 Q158 20 154 25', 'none', st('#5cb6e6', 3));
      return feet(c) + body(id, c, { marks: belly('#c6ebfb') }) +
        eyes('big') + mouth('open') + blush() +
        R(77, 150, 46, 21, 9, '#5d6f93', OL) + C(89, 160.5, 4.4, '#dfe7f5', ol(2.4)) + C(111, 160.5, 4.4, '#dfe7f5', ol(2.4)) +
        P('M116 150 L120 141', 'none', ol(3.4)) + C(120.5, 139.5, 3, '#ff7d96', ol(2.4)) +
        arm(76, 163, 30, c) + arm(124, 163, -30, c) +
        acc(drone);
    },
    shanghai: function (id) { // 薰衣草团子 + 小笼包帽子 + 咖啡杯
      var c = '#d8c4f2';
      var bao = P('M46 84 Q40 60 66 48 Q84 41 92 34 Q100 26 108 34 Q116 41 134 48 Q160 60 154 84 Q100 96 46 84Z', '#fff8ec', OL) +
        P('M100 34 Q82 54 64 80 M100 34 Q90 58 82 86 M100 34 L100 88 M100 34 Q110 58 118 86 M100 34 Q118 54 136 80', 'none', st('rgba(58,42,34,.38)', 3)) +
        E(100, 31, 9, 6.5, '#fff8ec', ol(3.8)) + P('M95 31 Q100 27 105 31', 'none', ol(2.8));
      var cup = P('M152 124 H182 L178 170 Q178 174 174 174 H160 Q156 174 156 170 Z', '#fffdf8', OL) +
        P('M153.3 140 H180.7 L179.5 156 H154.5 Z', '#c48a5a', ol(3.4)) + heart(167, 148, 0.42, '#ffd6de', 0) +
        R(147, 116, 40, 10, 5, '#f1e7e1', OL) + R(156, 109, 22, 9, 4.5, '#f1e7e1', ol(4));
      return feet(c) + body(id, c) + bao +
        eyes('dot') + mouth('u') + blush() + arm(31, 146, 28, c) + cup + arm(154, 152, 40, c) +
        acc(steam(74, 42, 22) + steam(126, 42, 22));
    },
    changsha: function (id) { // 橙色团子 + 霓虹眼镜 + 臭豆腐串
      var c = '#ffa552', glow = '', frame = '';
      [EXL, EXR].forEach(function (x) {
        glow += R(x - 20, 107, 40, 27, 11, 'none', st('#ff6fe0', 11, { opacity: 0.35 }));
        frame += R(x - 20, 107, 40, 27, 11, 'rgba(150,240,255,.22)', ol(7)) + R(x - 20, 107, 40, 27, 11, 'none', st('#ff4fd8', 3.2));
      });
      frame += P('M96 117 Q100 113 104 117', 'none', ol(7)) + P('M96 117 Q100 113 104 117', 'none', st('#ff4fd8', 3.2)) +
        P('M61 113 l6 0 M109 113 l6 0', 'none', st('#fff', 2.6, { opacity: 0.8 }));
      var tofu = function (y) {
        return R(145, y, 21, 21, 5, '#2f2a31', ol(4.2)) + P('M149.5 ' + (y + 5) + ' h5', 'none', st('rgba(255,255,255,.5)', 2.6)) +
          C(158, y + 13, 1.9, '#7bd35a') + C(151, y + 15, 1.6, '#ff5b4a') + C(161, y + 6, 1.4, '#ff5b4a');
      };
      var skewer = G(stick('M155.5 176 V72', '#e9c98f', 3.6) + tofu(80) + tofu(104) + tofu(128), { transform: rot(8, 155, 176) });
      return feet(c) + body(id, c, { marks: belly('#ffc48a') }) +
        eyes('big') + glow + frame + mouth('open') + blush({ y: 145 }) +
        arm(31, 146, 28, c) + skewer + arm(155, 158, -30, c) +
        acc(steam(177, 72, 20) + note(30, 74, '#ff4fd8') + note(16, 102, '#33d1ff'));
    },
    chongqing: function (id) { // 红色团子 + 冒泡火锅帽 + 辣椒
      var c = '#f4725f';
      var pot = stick('M51 54 Q40 54 40 62 Q40 70 51 68', '#f2c14e', 3.5) + stick('M149 54 Q160 54 160 62 Q160 70 149 68', '#f2c14e', 3.5) +
        P('M52 56 Q54 82 78 86 H122 Q146 82 148 56 Z', '#f2c14e', OL) +
        P('M60 70 Q100 78 140 70', 'none', st('rgba(58,42,34,.22)', 3)) +
        E(100, 56, 50, 11, '#f7d46e', OL) + E(100, 56, 42, 7, '#e8452f') +
        P('M72 55 q4 -4 9 -1 M113 54 q5 -4 9 0', 'none', st('#a8171c', 3)) +
        C(91, 58, 1.8, '#5a9e3a') + C(104, 53, 1.8, '#3d2a20') + C(121, 59, 1.8, '#5a9e3a');
      var chili = P('M40 100 Q14 104 11 132 Q9 156 22 170 Q19 142 31 125 Q41 112 40 100Z', '#c81f2a', OL) +
        P('M33 108 Q22 112 19 126', 'none', st('rgba(255,255,255,.6)', 3)) +
        stick('M39 101 Q42 91 35 86', '#5bb14a', 3.8);
      return feet(c) + body(id, c, { marks: belly('#f99a8a') }) + pot +
        eyes('happy') + mouth('open') + blush({ c: '#ffd0c8', op: 0.75 }) + chili + arm(36, 146, 20, c) + arm(169, 146, -28, c) +
        acc(C(84, 42, 4, '#ff8a6e', ol(2.6)) + C(110, 35, 5, '#ff8a6e', ol(2.6)) + C(124, 44, 3, '#ff8a6e', ol(2.6)) + steam(66, 40, 20) + steam(138, 38, 20) + drop(160, 92));
    },
    beijing: function (id) { // 奶油团子 + 红脸蛋 + 鸭舌帽 + 糖葫芦
      var c = '#fde4bf';
      var cap = P('M44 86 Q40 62 70 52 Q100 44 130 52 Q160 62 156 86 Q100 78 44 86Z', '#6f7d9a', OL) +
        P('M100 48 V80 M72 54 Q66 66 64 82 M128 54 Q134 66 136 82', 'none', st('rgba(30,30,50,.28)', 3)) +
        C(100, 48, 4.2, '#5c6986', ol(3)) +
        P('M58 84 Q100 72 142 84 Q146 94 132 96 Q100 89 68 96 Q54 94 58 84Z', '#58657f', OL);
      var haw = function (y, r) { return C(33, y, r, '#e23a3f', ol(4.4)) + E(f(29 + 0 * r), f(y - r * 0.4), f(r * 0.32), f(r * 0.22), '#fff', { opacity: 0.85 }); };
      var tang = stick('M33 174 V54', '#e9c98f', 3.6) + haw(68, 10) + haw(90, 11) + haw(113, 11);
      return feet(c) + body(id, c) + cap + eyes('dot') + mouth('grin') + blush({ c: '#ff5f5f', op: 0.7, rx: 12 }) +
        tang + arm(37, 148, 10, c) + arm(169, 146, -28, c) + acc(star(56, 58, 6, '#fff3a8'));
    },
    wuhan: function (id) { // 樱花粉团子 + 热干面碗帽 + 筷子
      var c = '#ffc4d1';
      var bowl = stick('M112 42 L150 13', '#d9a36a', 3.6) + stick('M121 46 L161 21', '#d9a36a', 3.6) +
        P('M56 62 Q56 40 78 33 Q100 24 122 33 Q144 40 144 62 Z', '#f7d26a', OL) +
        P('M64 56 q6 -9 12 0 q6 9 12 0 q6 -9 12 0 q6 9 12 0 q6 -9 12 0 q6 9 12 0', 'none', st('#d6a13c', 3)) +
        P('M71 45 q6 -8 12 0 q6 8 12 0 q6 -8 12 0 q6 8 12 0 q6 -8 12 0', 'none', st('#d6a13c', 3)) +
        P('M82 36 Q100 26 118 36 Q122 43 111 43 Q100 49 89 43 Q78 43 82 36Z', '#a8673a', ol(3.2)) +
        C(92, 37, 2.6, '#6cc04a') + C(106, 34, 2.6, '#6cc04a') + C(101, 41, 2.3, '#8fd66a') +
        P('M50 60 H150 Q148 84 124 88 H76 Q52 84 50 60Z', '#fffaf3', OL) +
        P('M54 70 H146', 'none', st('#e8604c', 4));
      return feet(c) + body(id, c) + bowl + P('M63 104 Q72 99 83 103 M117 103 Q128 99 137 104', 'none', ol(4.2)) +
        eyes('dot') + mouth('grin') + blush() + arm(31, 146, 28, c) + arm(172, 112, 32, c) +
        acc(petal(30, 76, -20) + petal(18, 104, 25, '#ffd0dc') + star(186, 92, 6, '#fff3a8'));
    },
    chengdu: function (id) { // 熊猫团子 + 盖碗茶
      var c = '#fffdf8', k = '#3a3236';
      var patch = E(75, 122, 13, 16, k, { transform: rot(28, 75, 122) }) + E(125, 122, 13, 16, k, { transform: rot(-28, 125, 122) });
      var pe = '<g class="d-eyes">' + [76, 124].map(function (x) { return C(x, 120, 6.4, '#fff') + C(x + 0.6, 120.6, 4, '#1c1719') + C(x + 1.8, 118.8, 1.5, '#fff'); }).join('') + '</g>';
      var cup = E(158, 171, 23, 6, '#8fcfab', OL) +
        P('M138 149 Q140 167 158 169 Q176 167 178 149 Z', '#e8f7ee', OL) +
        P('M141 158 Q158 163 175 158', 'none', st('#8fcfab', 3)) +
        P('M136 149 Q138 133 158 131 Q178 133 180 149 Q158 153 136 149Z', '#8fcfab', OL) +
        E(158, 129, 5.5, 4, '#8fcfab', ol(3.6));
      return feet(k) + C(58, 78, 15, k, OL) + C(142, 78, 15, k, OL) + body(id, c) + patch + pe +
        mouth('w') + blush({ y: 142, dx: 50, op: 0.7 }) + arm(31, 146, 28, k) + cup + arm(140, 161, 40, k) +
        acc(steam(152, 120, 22) + steam(165, 118, 18));
    },
    xian: function (id) { // 陶土团子 + 兵马俑发髻 + 小胡子 + 肉夹馍
      var c = '#d98f6a', hair = '#6b4535';
      var hairMarks = P('M0 0 H200 V96 Q150 70 100 74 Q50 70 0 96 Z', hair) +
        P('M0 96 Q50 70 100 74 Q150 70 200 96', 'none', ol(4.4)) +
        P('M70 66 Q84 72 98 71 M104 71 Q118 71 132 64 M100 60 V73', 'none', st('rgba(255,255,255,.2)', 2.6));
      var knot = C(128, 54, 15, hair, OL) + P('M117 63 Q128 70 140 64', 'none', ol(8.4)) + P('M117 63 Q128 70 140 64', 'none', st('#d8453b', 4)) +
        P('M123 47 Q129 44 134 49', 'none', st('rgba(255,255,255,.25)', 2.6));
      var stache = P('M100 131 Q93 125 86 129 Q82 132 85 135 M100 131 Q107 125 114 129 Q118 132 115 135', 'none', ol(4.2));
      var bun = P('M12 157 Q12 173 37 173 Q62 173 62 157 Z', '#efbf6e', OL) +
        P('M10 156 Q23 147 37 151 Q51 147 64 156 Q60 163 37 163 Q14 163 10 156Z', '#9a4f33', ol(3.6)) +
        C(23, 154, 2.4, '#6cc04a') + C(46, 152, 2.4, '#6cc04a') +
        P('M12 152 Q12 129 37 129 Q62 129 62 152 Q37 157 12 152Z', '#f5cf80', OL) +
        P('M26 139 Q37 133 48 139', 'none', st('#d0943f', 3)) + C(37, 142, 3, '#d0943f');
      return feet(c) + body(id, c, { marks: hairMarks, shine: false }) + knot +
        P('M64 106 Q74 100 85 104 M115 104 Q126 100 136 106', 'none', ol(5)) +
        eyes('dot') + stache + mouth('u', { y: 139 }) + blush({ op: 0.5 }) +
        bun + arm(56, 160, -20, c) + arm(169, 146, -28, c);
    }
    ,
    hefei: function (id) { // 青绿团子 + 圆框眼镜 + 电动车充电插头
      var c = '#4fc4b6';
      var specs = C(EXL, EY, 14.5, 'rgba(255,255,255,.3)', ol(4.2)) + C(EXR, EY, 14.5, 'rgba(255,255,255,.3)', ol(4.2)) +
        P('M90.5 118 Q100 112 109.5 118', 'none', ol(4.2)) + P('M67 112 l5 -4 M115 112 l5 -4', 'none', st('#fff', 2.6, { opacity: 0.9 }));
      var cable = stick('M31 160 Q31 184 56 184 Q66 184 72 180', '#3e4b5e', 4);
      var plug = R(21, 114, 6, 15, 2.5, '#d5dde6', ol(3.4)) + R(35, 114, 6, 15, 2.5, '#d5dde6', ol(3.4)) +
        R(14, 126, 34, 34, 10, '#fff', OL) +
        P('M33 132 L24 146 L31 146 L27 156 L40 141 L33 141 L37 132 Z', '#ffd23f', ol(2.6));
      return cable + feet(c) + body(id, c, { marks: belly('#8ad9cf') }) +
        eyes('dot') + specs + mouth('u') + blush({ y: 143, dx: 48 }) +
        plug + arm(47, 152, 20, c) + arm(169, 146, -28, c) +
        acc(star(162, 66, 9, '#ffe066') + star(180, 88, 5, '#ffe066'));
    },
    hangzhou: function (id) { // 茶绿团子 + 荷叶伞 + 茶叶
      var c = '#d3eba9';
      var leaf = 'M-64 22 Q-60 -20 0 -24 Q60 -20 64 22 Q52 14 40 21 Q28 12 14 20 Q0 12 -14 20 Q-28 12 -40 21 Q-52 14 -64 22Z';
      var umb = G(stick('M0 14 V128', '#4f9a52', 3.6) + P(leaf, '#5cae5e', OL) +
        P('M0 -22 L-52 17 M0 -22 L-27 16 M0 -22 L0 15 M0 -22 L27 16 M0 -22 L52 17', 'none', st('rgba(255,255,255,.45)', 2.6)) +
        C(0, -24, 4, '#4f9a52', ol(3)), { transform: 'translate(114 44) rotate(-20)' });
      var tea = stick('M34 160 Q30 140 36 122', '#6a9a3a', 2.6) +
        P('M36 122 Q24 112 30 98 Q44 106 36 122Z', '#7cc15a', ol(3.4)) +
        P('M33 138 Q16 136 14 124 Q30 120 33 138Z', '#8fd06a', ol(3.4)) +
        P('M35 119 L31 106 M31 136 L20 127', 'none', st('rgba(255,255,255,.55)', 2));
      return feet(c) + body(id, c) + umb +
        eyes('dot') + mouth('u') + blush() +
        tea + arm(37, 150, 10, c) + arm(152, 160, 30, c) +
        acc(drop(46, 34, 0.75) + drop(184, 58, 0.7));
    },
    xiamen: function (id) { // 奶黄团子 + 头顶海鸥 + 扇贝
      var c = '#ffe18c';
      var gull = E(106, 50, 24, 13, '#fff', OL) + P('M124 45 L140 37 L136 52 Z', '#fff', ol(4)) +
        P('M98 48 Q112 39 126 48 Q114 57 98 48Z', '#c9d3de', ol(3.6)) +
        C(85, 38, 11, '#fff', OL) + P('M75 37 L62 41 L75 44 Z', '#ffb84a', ol(3.2)) +
        C(82, 35.5, 2.4, INK) + C(82.8, 34.7, 0.8, '#fff') + E(88, 42, 3, 2, BLUSH, { opacity: 0.7 });
      var shell = G(P('M-5 1 L-21 -13 Q-24 -27 -12 -32 Q-6 -35 0 -33 Q6 -35 12 -32 Q24 -27 21 -13 L5 1 Z', '#ffb7c5', OL) +
        P('M0 0 L-14 -27 M0 0 L-6 -31 M0 0 L0 -32 M0 0 L6 -31 M0 0 L14 -27', 'none', st('rgba(58,42,34,.35)', 2.4)) +
        P('M-9 1 L-12 8 H12 L9 1 Z', '#ffa3b6', ol(3.4)), { transform: 'translate(160 166) rotate(12)' });
      return feet(c) + body(id, c, { marks: belly('#fff0bf') }) +
        eyes('dot') + mouth('w') + blush() +
        arm(31, 146, 28, c) + shell + arm(148, 162, 30, c) +
        acc(gull);
    },
    dali: function (id) { // 长春花蓝团子 + 花环 + 爱心墨镜
      var c = '#b3c2ff';
      var vine = 'M42 94 Q58 66 100 62 Q142 66 158 94';
      var crown = P(vine, 'none', ol(8.4)) + P(vine, 'none', st('#6cbf5a', 4)) +
        E(60, 77, 7, 4, '#7cc96a', ext(ol(2.6), { transform: rot(-40, 60, 77) })) + E(86, 63, 7, 4, '#7cc96a', ext(ol(2.6), { transform: rot(-10, 86, 63) })) +
        E(114, 63, 7, 4, '#7cc96a', ext(ol(2.6), { transform: rot(10, 114, 63) })) + E(140, 77, 7, 4, '#7cc96a', ext(ol(2.6), { transform: rot(40, 140, 77) })) +
        flower(47, 88, 11, '#ff9ec4') + flower(70, 70, 11, '#fffaf0', '#ffb84a') + flower(100, 61, 12.5, '#ffd84a', '#ff8a5b') +
        flower(130, 70, 11, '#ff8a9a') + flower(153, 88, 11, '#fffaf0', '#ff9ec4');
      var shades = heart(EXL, EY + 3, 1.45, 'rgba(255,90,150,.36)', 4.4) + heart(EXR, EY + 3, 1.45, 'rgba(255,90,150,.36)', 4.4) +
        P('M94 112 Q100 108 106 112', 'none', ol(4.4)) + P('M64 110 l4 -3 M112 110 l4 -3', 'none', st('#fff', 2.6, { opacity: 0.9 }));
      var bfly = P('M172 40 V56', 'none', ol(3.4)) + E(165, 43, 8, 6, '#ffd84a', ext(ol(3), { transform: rot(-30, 165, 43) })) +
        E(179, 43, 8, 6, '#ffd84a', ext(ol(3), { transform: rot(30, 179, 43) })) + E(166, 53, 5.5, 4.2, '#ff9ec4', ol(3)) + E(178, 53, 5.5, 4.2, '#ff9ec4', ol(3)) +
        P('M171 38 Q168 32 164 31 M173 38 Q176 32 180 31', 'none', ol(2.4));
      return feet(c) + body(id, c) + crown +
        eyes('dot') + shades + mouth('u', { y: 136 }) + blush({ y: 142, dx: 48 }) + arms(c) +
        acc(bfly);
    },
    guangzhou: function (id) { // 蜜桃团子 + 竹蒸笼帽 + 虾饺
      var c = '#ffcdb0';
      var hargow = function (x, y) {
        return P('M' + (x - 16) + ' ' + (y + 7) + ' Q' + (x - 17) + ' ' + (y - 13) + ' ' + x + ' ' + (y - 14) + ' Q' + (x + 17) + ' ' + (y - 13) + ' ' + (x + 16) + ' ' + (y + 7) + ' Z', '#fffaf6', ol(3.8)) +
          E(x, y - 1, 8, 5, '#ffb8a3', { opacity: 0.9 }) +
          P('M' + (x - 10) + ' ' + (y - 8) + ' q3.3 -4.5 6.6 0 q3.3 -4.5 6.6 0 q3.3 -4.5 6.6 0', 'none', st('rgba(58,42,34,.45)', 2.4));
      };
      var basket = E(100, 58, 52, 10, '#a77a3c', OL) +
        hargow(77, 51) + hargow(123, 51) + hargow(100, 43) +
        P('M48 58 Q100 74 152 58 L148 86 Q100 96 52 86 Z', '#e9c27f', OL) +
        P('M50 73 Q100 87 150 73', 'none', st('#c99a52', 3)) +
        P('M66 70 L65.5 88 M84 73 L83.6 92 M100 74 V93 M116 73 L116.4 92 M134 70 L134.5 88', 'none', st('#c99a52', 2.6));
      return feet(c) + body(id, c) + basket +
        eyes('happy') + mouth('w') + blush() + arms(c) +
        acc(steam(78, 30, 20) + steam(122, 30, 20));
    },
    suzhou: function (id) { // 青灰团子 + 发髻簪子 + 团扇
      var c = '#a9bed3';
      var bun = C(100, 50, 17, '#3d3848', OL) + P('M90 42 Q98 36 106 40', 'none', st('rgba(255,255,255,.25)', 2.6)) +
        stick('M72 62 L132 38', '#e8b04a', 3) + C(132, 38, 5, '#ff8fa8', ol(3)) + P('M133 43 L135 55', 'none', ol(2.6)) + C(135, 58, 3.2, '#ff8fa8', ol(2.4));
      var fan = stick('M36 138 V172', '#b98a5a', 3.4) + P('M36 172 Q33 180 36 188', 'none', st('#e05a5a', 4)) +
        C(36, 114, 23, '#fff8ef', OL) + C(36, 114, 17.5, 'none', st('#d9c7a6', 2.2)) +
        P('M22 126 Q32 118 40 106 Q44 100 50 98', 'none', st('#7a5a48', 2.6)) +
        C(40, 106, 3.6, '#ff9eb5', ol(2)) + C(47, 100, 3, '#ff9eb5', ol(2)) + C(30, 119, 3.2, '#ff9eb5', ol(2));
      return feet(c) + body(id, c, { marks: belly('#c7d6e4') }) + bun +
        eyes('dot') + mouth('u') + blush() +
        fan + arm(41, 152, 10, c) + arm(169, 146, -28, c) +
        acc(star(150, 30, 6, '#fff3a8'));
    },
    nanjing: function (id) { // 焦糖团子 + 梧桐叶 + 小鸭子
      var c = '#e8c08a';
      // 梧桐叶：三裂、圆润
      var leafD = 'M0 2 Q-14 0 -24 -8 L-32 -23 Q-22 -22 -14 -25 Q-15 -39 0 -48 Q15 -39 14 -25 Q22 -22 32 -23 L24 -8 Q14 0 0 2Z';
      var leafIn = P('M0 0 Q2 8 -3 13', 'none', ol(5)) + P(leafD, '#8acb5c', ol(4)) +
        P('M0 -2 L0 -40 M0 -5 L-25 -20 M0 -5 L25 -20', 'none', st('rgba(255,255,255,.5)', 2.2));
      var leaf = G(leafIn, { transform: 'translate(78 66) rotate(78) scale(1.25 1.1)' });
      var duck = E(167, 169, 19, 13, '#fff', OL) + P('M183 162 L192 152 L191 170 Z', '#fff', ol(4)) +
        P('M157 167 Q166 175 177 167', 'none', st('rgba(58,42,34,.38)', 2.8)) +
        C(155, 147, 12.5, '#fff', OL) + P('M144 145 L131 149.5 L144 154 Z', '#ffa940', ol(3.2)) + C(151, 143.5, 2.5, INK) + C(151.8, 142.7, 0.8, '#fff') + E(160, 152, 3.4, 2.2, BLUSH, { opacity: 0.75 });
      return feet(c) + body(id, c) + leaf +
        eyes('closed') + mouth('u') + blush() + arm(31, 146, 28, c) + duck + arm(146, 160, 40, c) +
        acc(heart(180, 128, 0.5, '#ff8fb1', 2.6) + G(leafIn.replace('#8acb5c', '#f2c14e'), { transform: 'translate(40 62) rotate(-30) scale(0.6)' }));
    },
    jingdezhen: function (id) { // 青花瓷团子 + 陶泥碗
      var c = '#fbfdff', b = '#2f63b8';
      var pattern = P('M0 0 H200 V80 Q150 68 100 70 Q50 68 0 80 Z', b) +
        P('M20 86 Q100 70 180 86', 'none', st(b, 3)) +
        C(56, 92, 2.6, b) + C(78, 86, 2.6, b) + C(100, 84, 2.6, b) + C(122, 86, 2.6, b) + C(144, 92, 2.6, b) +
        P('M52 76 q8 -8 16 0 q8 -8 16 0 q8 -8 16 0 q8 -8 16 0 q8 -8 16 0 q8 -8 16 0', 'none', st('#fff', 2.6)) +
        P('M0 154 Q100 166 200 154 V200 H0Z', b) + P('M18 148 Q100 160 182 148', 'none', st(b, 3)) +
        P('M30 172 q8 -8 16 0 q8 -8 16 0 q8 -8 16 0 q8 -8 16 0 q8 -8 16 0 q8 -8 16 0 q8 -8 16 0 q8 -8 16 0', 'none', st('#fff', 2.6)) +
        P('M30 104 q0 -9 9 -9 q9 0 9 9 q0 7 -7 7 q-5 0 -5 -5', 'none', st(b, 3)) + P('M170 104 q0 -9 -9 -9 q-9 0 -9 9 q0 7 7 7 q5 0 5 -5', 'none', st(b, 3));
      var bowl = P('M73 152 Q75 173 100 174 Q125 173 127 152 Z', '#d6a47c', OL) +
        E(100, 152, 27, 6.5, '#c28c62', OL) + E(100, 152, 20, 3.6, '#a8724a') +
        P('M83 162 Q100 167 117 162', 'none', st('rgba(255,255,255,.35)', 2.6));
      return feet(c) + body(id, c, { marks: pattern }) +
        eyes('dot') + mouth('u') + blush({ op: 0.7 }) + E(141, 145, 5, 2.4, '#c99a76', { opacity: 0.9, transform: rot(-18, 141, 145) }) +
        bowl + arm(75, 163, 30, c) + arm(125, 163, -30, c) +
        acc(star(166, 50, 7, '#cfe0ff') + star(30, 60, 5, '#cfe0ff'));
    }
    ,
    /* ---------- 隐藏款 ---------- */
    mystery: function (id) { // 高铁上的人：车窗里的团子 + 窗外飞驰的风景
      var c = '#d3c9f6', cid = 'cw' + id, tid = 'ct' + id;
      // 高铁车厢侧面：左端圆润车尾，右端流线车头
      var car = 'M30 174 H150 Q189 174 190 152 Q190 138 176 126 L153 86 Q140 58 108 56 H36 Q11 56 11 84 V150 Q11 174 30 174Z';
      var win = 'M42 70 H110 Q124 70 124 84 V132 Q124 146 110 146 H42 Q28 146 28 132 V84 Q28 70 42 70Z';
      var scenery = R(0, 0, 200, 200, 0, '#d6ecff') + P('M20 124 Q46 110 70 122 Q96 106 130 120 V160 H20Z', '#b5e0a8') +
        P('M32 84 H58 M86 80 H118 M40 98 H52 M96 132 H120 M30 140 H64', 'none', st('#fff', 4, { opacity: 0.9 }));
      var dango = body(id, c, { t: 92, b: 200, w: 46, cx: 76, shineD: P('M42 132 Q44 116 52 108', 'none', st('#fff', 4.4, { opacity: 0.7 })) }) +
        eyes('big', { y: 122, xl: 60, xr: 92 }) + mouth('o', { x: 76, y: 132 }) + blush({ cx: 76, y: 136, dx: 28, rx: 8 });
      return R(28, 168, 40, 16, 8, '#5a6275', OL) + R(120, 168, 40, 16, 8, '#5a6275', OL) +
        '<defs><clipPath id="' + tid + '"><path d="' + car + '"/></clipPath><clipPath id="' + cid + '"><path d="' + win + '"/></clipPath></defs>' +
        P(car, '#f6f9fc') + '<g clip-path="url(#' + tid + ')">' + R(0, 150, 200, 11, 0, '#4aa3df') + P('M0 150 H200 M0 161 H200', 'none', ol(2.6)) +
        P('M134 66 Q150 72 160 98 L146 104 Q138 82 124 76 Z', '#3d5a80') + R(136, 104, 16, 30, 6, '#d8e2ec', ol(3.4)) + '</g>' + P(car, 'none', OL) +
        '<g clip-path="url(#' + cid + ')">' + scenery + dango + P('M112 74 L90 96 M124 84 L104 104', 'none', st('#fff', 5, { opacity: 0.55 })) + '</g>' +
        P(win, 'none', ol(5.6)) + E(62, 146, 10, 7, c, OL) + E(92, 146, 10, 7, c, OL) +
        acc(P('M8 26 H50 M18 40 H60 M8 54 H34', 'none', st('#9aa4b8', 4)) +
          P('M166 22 Q166 13 174 13 Q182 13 182 21 Q182 27 175 29 L175 34', 'none', ol(4.2)) + C(175, 41, 2.8, INK));
    },
    echo: function (id) { // 城市全都要：摇摇晃晃的一摞小帽子 + 星星眼
      var c = '#ffcf8f';
      var cap = P('M58 90 Q56 70 80 64 Q100 60 120 64 Q144 70 142 90 Q100 83 58 90Z', '#6f7d9a', OL) + C(100, 61, 3.4, '#5c6986', ol(3)) +
        P('M68 88 Q100 79 132 88 Q134 96 122 97 Q100 91 78 97 Q66 96 68 88Z', '#58657f', ol(4));
      var pot = stick('M66 46 Q60 46 60 51 Q60 56 67 55', '#f2c14e', 2.6) + stick('M134 46 Q140 46 140 51 Q140 56 133 55', '#f2c14e', 2.6) +
        P('M68 46 Q70 62 86 64 H114 Q130 62 132 46 Z', '#f2c14e', OL) + E(100, 46, 33, 7.5, '#f7d46e', ol(4)) + E(100, 46, 27, 4.4, '#e8452f') +
        C(90, 45, 1.7, '#5a9e3a') + C(110, 47, 1.7, '#5a9e3a');
      var steamer = E(100, 22, 25, 6, '#a77a3c', ol(4)) + P('M89 21 Q89 9 100 9 Q111 9 111 21 Z', '#fffaf6', ol(3.4)) +
        P('M75 22 Q100 30 125 22 L123 36 Q100 42 77 36 Z', '#e9c27f', ol(4)) + P('M87 27 V38 M100 29 V40 M113 27 V38', 'none', st('#c99a52', 2.4));
      return feet(c) + body(id, c, { t: 68, marks: belly('#ffe2b8') }) +
        G(cap, { transform: rot(-5, 100, 80) }) + G(pot, { transform: rot(6, 100, 56) }) + G(steamer, { transform: rot(-7, 100, 30) }) +
        eyes('star', { y: 122 }) + mouth('open', { y: 136 }) + blush({ y: 140, op: 0.7 }) + arms(c) +
        acc(P('M46 30 Q40 40 46 50 M154 24 Q160 34 154 44', 'none', ol(3.4)) + star(28, 76, 7, '#fff3a8') + star(174, 70, 8, '#fff3a8'));
    },
    rebel: function (id) { // 反向旅游家：反戴帽 + 背对热门路牌往回走
      var c = '#a3a9bf', cx = 84;
      var sign = stick('M168 64 V186', '#b98a5a', 4.4) +
        P('M128 28 H168 V18 L190 43 L168 68 V58 H128 Z', '#ffd23f', OL) +
        C(140, 39, 3.4, INK) + C(152, 39, 3.4, INK) + C(164, 39, 3.4, INK) +
        P('M134 52 Q140 44 146 52 M146 52 Q152 44 158 52 M158 52 Q164 44 170 52', 'none', ol(3.2));
      var ft = E(56, 180, 14, 10, c, OL) + E(110, 175, 14, 10, c, ext(OL, { transform: rot(-24, 110, 175) }));
      var hat = P('M118 78 Q142 70 154 82 Q146 90 122 88 Z', '#e8414f', OL) +
        P('M42 92 Q40 62 84 58 Q128 62 126 92 Q84 82 42 92Z', '#ff5a6b', OL) +
        P('M73 88 Q84 74 95 88 Z', c, ol(3.6)) + P('M72 86 H96', 'none', ol(3)) + C(84, 58, 3.6, '#e8414f', ol(3));
      return sign + ft + body(id, c, { cx: cx, w: 66, t: 62, b: 176, shineD: P('M30 118 Q32 98 44 86', 'none', st('#fff', 5, { opacity: 0.7 })) }) + hat +
        eyes('side', { xl: 62, xr: 106, y: 118, fur: c, dir: -3 }) + mouth('smirk', { x: 82, y: 132 }) + blush({ cx: cx, dx: 40, op: 0.5 }) +
        arm(22, 140, 40, c) + arm(144, 146, -28, c) +
        acc(C(140, 182, 6, '#fff', ol(3)) + C(152, 176, 4.5, '#fff', ol(3)) + C(160, 184, 3.5, '#fff', ol(3)));
    },
    diode: function (id) { // 冰火两重天：一半冰蓝一半火红
      var ice = '#a9dcff', fire = '#ff7a5c';
      var marks = R(100, 0, 100, 200, 0, fire) +
        P('M136 176 Q130 160 142 148 Q142 160 152 158 Q148 144 160 134 Q168 154 160 176Z', '#ffb36b') +
        P('M44 150 l6 0 M47 147 l0 6 M60 168 l5 0 M62.5 165.5 l0 5', 'none', st('#fff', 2.6)) + P('M100 50 V180', 'none', ol(3.4));
      var cube = G(R(-15, -15, 30, 30, 7, '#e2f6ff', OL) + P('M-8 -8 h8 M-8 -8 v8', 'none', st('#fff', 3.4)), { transform: 'translate(28 128) rotate(-12)' });
      var chili = P('M156 100 Q182 104 185 132 Q187 156 174 170 Q177 142 165 125 Q155 112 156 100Z', '#c81f2a', OL) +
        P('M163 108 Q174 112 177 126', 'none', st('rgba(255,255,255,.6)', 3)) + stick('M157 101 Q154 91 161 86', '#5bb14a', 3.8);
      var flake = 'M34 30 V54 M23.6 36 L44.4 48 M23.6 48 L44.4 36';
      var flame = P('M168 18 Q182 32 177 46 Q173 56 164 54 Q154 50 158 38 Q161 46 165 44 Q162 32 168 18Z', '#ff9f43', ol(3.4)) + P('M166 36 Q172 42 169 50 Q164 50 163 45 Q164 41 166 36Z', '#ffe066');
      return '<g class="d-paws">' + E(72, 178, 14, 10, ice, OL) + E(128, 178, 14, 10, fire, OL) + '</g>' +
        body(id, ice, { marks: marks }) + eyes('dot') + mouth('w') + blush({ op: 0.55 }) +
        cube + arm(40, 146, 20, ice) + chili + arm(162, 148, -20, fire) +
        acc(P(flake, 'none', ol(8)) + P(flake, 'none', st('#fff', 3.6)) + flame);
    }
    ,
    /* ---------- 彩蛋卡 ---------- */
    speed: function (id) { // 特种兵游客：运动鞋 + 背包 + 相机 + 速度线
      var c = '#c5f08a';
      var shoe = function (x, y, r) {
        return G(P('M-15 4 Q-17 -9 -6 -12 Q2 -13 6 -6 Q17 -5 19 3 Z', '#fff', ol(4.4)) + R(-17, 2, 38, 8, 4, '#ff6f91', ol(3.6)) +
          P('M-2 -8 L2 -4 M4 -9 L8 -5', 'none', ol(2.4)), { transform: 'translate(' + x + ' ' + y + ') rotate(' + r + ')' });
      };
      var pack = R(12, 84, 40, 64, 14, '#ff8a5b', OL) + R(18, 116, 28, 24, 8, '#ff6f3c', ol(3.6)) + P('M24 92 H40', 'none', ol(3));
      var cam = R(81, 147, 40, 26, 7, '#4a4f5c', OL) + R(86, 142, 10, 6, 2, '#4a4f5c', ol(3)) + C(101, 160, 8.5, '#9fd8ff', ol(3.4)) + C(101, 160, 3.6, '#3d4f70') + C(114, 152, 2, '#ffd23f');
      return pack + G(body(id, c, { marks: belly('#e2f8c4') }) + P('M48 92 Q62 124 54 158', 'none', ol(9)) + P('M48 92 Q62 124 54 158', 'none', st('#e86a3e', 5)) +
          eyes('big') + mouth('open', { y: 129 }) + blush({ y: 134 }) + cam + arm(80, 162, 30, c) + arm(122, 162, -30, c), { transform: rot(6, 100, 176) }) +
        shoe(70, 179, -6) + shoe(136, 179, 0) +
        acc(P('M9 52 H36 M12 66 H32 M9 80 H24', 'none', st('#9aa4b8', 4)) + drop(176, 52, 0.8));
    },
    sloth: function (id) { // City Walk 慢游家：遮阳草帽 + 小蜗牛朋友 + 松弛眯眼
      var c = '#f1d3e8';
      var hat = E(100, 74, 70, 15, '#f6d58a', OL) + P('M64 74 Q64 38 100 38 Q136 38 136 74 Z', '#f6d58a', OL) +
        P('M65 62 Q100 70 135 62 L136 72 Q100 80 64 72 Z', '#ff8fa8', ol(3.6)) +
        P('M76 52 Q100 46 124 52', 'none', st('#d9b060', 2.6)) + P('M40 80 Q100 92 160 80', 'none', st('#d9b060', 2.6));
      var snail = E(162, 182, 25, 6.5, '#f9dca0', OL) + C(184, 172, 7.5, '#f9dca0', OL) +
        P('M182 165 L179 155 M187 165 L190 155', 'none', ol(2.6)) + C(179, 154, 2.4, INK) + C(190, 154, 2.4, INK) +
        C(160, 168, 13, '#f4a96a', OL) + P('M160 168 m-6 0 a6 6 0 1 1 6 6 a3.5 3.5 0 1 1 -3.5 -3.5', 'none', ol(2.6));
      return feet(c) + body(id, c) + hat +
        eyes('relaxed', { fur: c }) + mouth('u') + blush() + arms(c) + snail +
        acc(heart(186, 136, 0.45, '#ff8fb1', 2.4));
    },
    night: function (id) { // 夜市冠军：烤串 + 小灯笼 + 月亮
      var c = '#8f86d9';
      var lantern = function (x, y) {
        return P('M' + x + ' ' + (y - 15) + ' V' + (y - 10), 'none', ol(2.6)) +
          E(x, y, 11, 9.5, '#ff5a4f', ol(3.4)) + R(x - 5.5, y - 12.5, 11, 4, 1.5, '#ffcf4a', ol(2.6)) + R(x - 5.5, y + 8.5, 11, 4, 1.5, '#ffcf4a', ol(2.6)) +
          P('M' + x + ' ' + (y + 12.5) + ' V' + (y + 19), 'none', st('#ffcf4a', 2.8)) + P('M' + (x - 4) + ' ' + (y - 6) + ' Q' + (x - 6.5) + ' ' + y + ' ' + (x - 4) + ' ' + (y + 6), 'none', st('rgba(255,255,255,.55)', 2));
      };
      var meat = stick('M34 174 V64', '#e9c98f', 3.4) + [74, 95, 116].map(function (y) {
        return R(23, y - 9, 22, 18, 6, '#b5653a', ol(4)) + C(28, y - 4, 1.7, '#ffd36a') + C(38, y + 2, 1.7, '#7bd35a');
      }).join('');
      var sausage = stick('M166 174 V62', '#e9c98f', 3.4) + R(155, 68, 22, 54, 11, '#e8604c', OL) + P('M159 84 L173 79 M159 97 L173 92 M159 110 L173 105', 'none', st('#a83a2a', 3));
      return feet(c) + body(id, c, { marks: belly('#a9a1e6') }) +
        eyes('happy') + mouth('open') + blush({ op: 0.7 }) +
        meat + arm(38, 148, 10, c) + sausage + arm(162, 148, -10, c) +
        acc(P('M8 14 Q62 40 128 16', 'none', ol(2.6)) + lantern(40, 38) + lantern(88, 40) + P('M178 12 a20 20 0 1 0 12 34 a16 16 0 1 1 -12 -34z', '#ffe066', ol(3.5)) + star(150, 28, 5.5, '#fff3a8'));
    },
    early: function (id) { // 早茶晨型人：朝阳 + 一盏热茶
      var c = '#c8f0dc', rays = '', i, ang;
      for (i = 0; i < 6; i++) {
        ang = (-170 + i * 34) * Math.PI / 180;
        rays += 'M' + f(52 + 37 * Math.cos(ang)) + ' ' + f(52 + 37 * Math.sin(ang)) + ' L' + f(52 + 45 * Math.cos(ang)) + ' ' + f(52 + 45 * Math.sin(ang)) + ' ';
      }
      var cup = P('M138 140 Q140 166 158 167 Q176 166 178 140 Z', '#fffdf8', OL) + E(158, 140, 20, 5.5, '#fffdf8', OL) + E(158, 140, 15, 3.4, '#b7d77a') +
        P('M141 150 Q158 156 175 150', 'none', st('#ff9eb5', 3));
      return P(rays, 'none', st('#f0a500', 4)) + C(52, 52, 29, '#ffd65c', OL) +
        feet(c) + body(id, c, { marks: belly('#e6fbef') }) +
        eyes('happy') + mouth('w') + blush() + arm(31, 146, 28, c) + cup + arm(142, 158, 40, c) +
        acc(steam(152, 128, 18) + steam(165, 126, 16) + P('M150 36 Q154 30 160 34 Q166 28 172 34', 'none', ol(3.2)));
    },
    again: function (id) { // 回头客：第二张车票
      var c = '#ffbca6';
      var ticket = G(P('M-27 -16 H27 V-5 A5 5 0 0 0 27 5 V16 H-27 V5 A5 5 0 0 0 -27 -5 Z', '#ffe27a', OL) +
        P('M13 -11 V11', 'none', st('rgba(58,42,34,.45)', 2.4, { 'stroke-dasharray': '3 4' })) +
        P('M-13 -5 Q-13 -11 -6 -11 Q1 -11 1 -5 Q1 -1 -6 4 L-13 10 H2', 'none', ol(4.2)) + C(20, 0, 3.2, '#ff8a7a', ol(2.4)),
        { transform: 'translate(156 148) rotate(-12)' });
      return feet(c) + body(id, c, { marks: belly('#ffd9cc') }) +
        eyes('big') + mouth('open') + blush() + arm(31, 146, 28, c) + ticket + arm(134, 156, 30, c) +
        acc(P('M56 52 A20 20 0 1 1 40 28', 'none', ol(8)) + P('M56 52 A20 20 0 1 1 40 28', 'none', st('#ffd65c', 4.4)) + P('M32 18 L44 27 L31 35 Z', '#ffd65c', ol(3)));
    },
    twin: function (id) { // 老乡见老乡：抱在一起喜极而泣
      var c = '#ffd39a';
      var one = function (sfx, x) {
        return body(id, c, { sfx: sfx, cx: x, w: 50, t: 84, marks: belly('#ffe8c8', { x: x, rx: 34, ry: 18, y: 172 }),
          shineD: P('M' + (x - 38) + ' 138 Q' + (x - 36) + ' 120 ' + (x - 26) + ' 108', 'none', st('#fff', 4.4, { opacity: 0.7 })) }) +
          eyes('happy', { xl: x - 14, xr: x + 14, y: 124 }) + mouth('open', { x: x, y: 135 }) + blush({ cx: x, dx: 29, y: 143, rx: 8 }) +
          drop(x - 25, 123, 0.7) + drop(x + 25, 123, 0.7);
      };
      return '<g class="d-paws">' + E(44, 179, 11, 8, c, OL) + E(80, 179, 11, 8, c, OL) + E(120, 179, 11, 8, c, OL) + E(156, 179, 11, 8, c, OL) + '</g>' +
        one('a', 62) + arm(19, 148, 30, c) + one('b', 138) + arm(181, 148, -30, c) + arm(101, 150, -55, c) +
        acc(heart(100, 66, 1.3) + star(30, 82, 6, '#fff3a8') + star(170, 80, 7, '#fff3a8'));
    },
    shiny: function (id) { // 城市之光：金光闪闪的团子
      var c = '#ffd23f', gid = 'gs' + id;
      return '<defs><radialGradient id="' + gid + '"><stop offset="0" stop-color="#fff6c2" stop-opacity="1"/><stop offset=".55" stop-color="#ffe680" stop-opacity=".55"/><stop offset="1" stop-color="#ffe680" stop-opacity="0"/></radialGradient></defs>' +
        C(100, 108, 88, 'url(#' + gid + ')') +
        P('M100 8 V24 M30 40 L40 50 M170 40 L160 50 M10 110 H24 M176 110 H190', 'none', st('#ffc21a', 4)) +
        feet('#f5b800') + body(id, c, { marks: belly('#fff0a8') }) +
        eyes('big') + mouth('open') + blush({ op: 0.5 }) + arms(c) +
        acc(star(166, 66, 12, '#fff3a8') + star(34, 72, 9, '#fff3a8') + star(184, 140, 6, '#fff3a8') + star(18, 150, 6, '#fff3a8'));
    },
    petter: function (id) { // 捏捏团子：被捏扁的开心脸
      var c = '#ffc2dc';
      return feet(c, { dx: 36 }) + body(id, c, { t: 84, w: 84, shineD: P('M30 142 Q32 122 46 108', 'none', st('#fff', 5, { opacity: 0.7 })) + C(57, 99, 3, '#fff', { opacity: 0.7 }) }) +
        P('M86 66 Q100 58 114 66 M74 74 Q70 68 72 62 M126 74 Q130 68 128 62', 'none', ol(3.4)) +
        eyes('squish', { y: 128 }) + mouth('open', { y: 140 }) + blush({ y: 144, dx: 52, rx: 12, op: 0.8 }) + arms(c, { y: 154 }) +
        acc(heart(36, 52, 1, '#ff6f91') + heart(166, 44, 0.75, '#ff8fb1') + star(150, 76, 6, '#fff3a8') + star(52, 84, 5, '#fff3a8'));
    },
    weekend: function (id) { // 周末出逃：行李箱 + 头顶墨镜 + 小飞机
      var c = '#a6e6e3';
      var shades = R(64, 66, 30, 17, 8, '#3a3f55', ol(4)) + R(106, 66, 30, 17, 8, '#3a3f55', ol(4)) + P('M94 72 Q100 68 106 72', 'none', ol(4)) +
        P('M70 71 l6 0 M112 71 l6 0', 'none', st('#fff', 2.4, { opacity: 0.8 }));
      var suit = stick('M150 110 V86 H176 V110', '#9aa3b5', 3.4) + R(140, 106, 46, 64, 10, '#ff8a7a', OL) +
        P('M152 110 V166 M174 110 V166', 'none', st('#e8604c', 3)) + C(150, 179, 5, '#5a6275', ol(3)) + C(176, 179, 5, '#5a6275', ol(3)) +
        star5(163, 128, 7.5, '#ffe066', 2.6) + C(170, 152, 5, '#9fe0ff', ol(2.4)) + R(148, 142, 9, 9, 2, '#b7f0a4', ol(2.4));
      var plane = G(P('M-22 0 Q-22 -7 -14 -7 H12 Q24 -7 26 0 Q24 6 12 6 H-14 Q-22 6 -22 0Z', '#fff', ol(3.4)) +
        P('M-19 -5 L-23 -17 H-16 L-9 -6 Z', '#ff8a7a', ol(3)) + P('M-4 2 L-13 14 H-6 L8 2 Z', '#9fd8ff', ol(3)) +
        C(-4, -1, 1.8, '#5cb6e6') + C(3, -1, 1.8, '#5cb6e6') + C(10, -1, 1.8, '#5cb6e6'), { transform: 'translate(52 34) rotate(-12)' });
      return feet(c) + body(id, c, { marks: belly('#d4f5f3') }) + shades +
        eyes('wink') + mouth('open') + blush() + arm(31, 146, 28, c) + suit + arm(142, 140, 30, c) +
        acc(plane + P('M14 50 Q20 48 26 46', 'none', st('#9aa4b8', 3, { 'stroke-dasharray': '4 5' })));
    },
    bilingual: function (id) { // 双语市民：两个对话泡泡 + 小地球仪
      var c = '#dcc8ff';
      var b1 = P('M10 22 Q10 10 22 10 H70 Q82 10 82 22 V36 Q82 48 70 48 H48 L36 60 L38 48 H22 Q10 48 10 36Z', '#fff', ol(3.6)) +
        P('M22 30 q6 -8 12 0 q6 8 12 0 q6 -8 12 0 q5 6 10 1', 'none', st('#ff6f91', 3.8));
      var b2 = P('M190 22 Q190 10 178 10 H130 Q118 10 118 22 V36 Q118 48 130 48 H152 L164 60 L162 48 H178 Q190 48 190 36Z', '#ffe27a', ol(3.6)) +
        C(136, 29, 4.4, '#4a7dff') + P('M148 34 L154 24 L160 34 Z', '#4a7dff', ol(2)) + R(167, 24.5, 9, 9, 2, '#4a7dff');
      var globe = P('M146 182 H174 M160 182 V170', 'none', ol(4.6)) + P('M141 140 A21 21 0 0 0 176 166', 'none', ol(8)) + P('M141 140 A21 21 0 0 0 176 166', 'none', st('#e8b04a', 4)) +
        C(158, 150, 16, '#7cc4ff', OL) + E(158, 150, 6.5, 15, 'none', st('#fff', 2.4)) + P('M143 150 H173 M146 142 H170 M146 158 H170', 'none', st('#fff', 2.4));
      return feet(c) + body(id, c, { marks: belly('#ece2ff') }) +
        eyes('dot') + mouth('open') + blush() + arm(31, 146, 28, c) + globe + arm(140, 156, 30, c) +
        acc(b1 + b2);
    },
    /* ---------- 进度条上的小高铁（车头朝右） ---------- */
    train: function (id) {
      var c = '#fbfdff', cid = 'cr' + id;
      var d = 'M28 160 H152 Q192 160 192 140 Q192 126 176 114 L150 84 Q130 62 100 62 H40 Q12 62 12 92 V136 Q12 160 28 160Z';
      return R(26, 152, 44, 18, 9, '#5a6275', OL) + R(112, 152, 44, 18, 9, '#5a6275', OL) +
        '<defs><clipPath id="' + cid + '"><path d="' + d + '"/></clipPath></defs>' + P(d, c) +
        '<g clip-path="url(#' + cid + ')">' + R(0, 143, 200, 10, 0, '#4aa3df') + P('M0 143 H200 M0 153 H200', 'none', ol(2.6)) +
        P('M26 76 Q40 70 60 70', 'none', st('#fff', 5, { opacity: 0.9 })) + '</g>' + P(d, 'none', OL) +
        R(28, 80, 22, 20, 6, '#8fd0f5', ol(4)) + R(60, 80, 22, 20, 6, '#8fd0f5', ol(4)) + R(92, 80, 22, 20, 6, '#8fd0f5', ol(4)) +
        P('M118 70 Q136 72 150 90 L140 98 Q128 82 112 80 Z', '#3d5a80', ol(4)) +
        eyes('dot', { xl: 150, xr: 172, y: 122 }) + mouth('u', { x: 161, y: 134 }) + E(140, 134, 7, 4.2, BLUSH, { opacity: 0.7 }) + E(183, 136, 6, 3.8, BLUSH, { opacity: 0.7 });
    }
  };

  var SHINY = function () {
    return '<g class="d-shiny">' + star(24, 30, 9, '#fff3a8') + star(178, 112, 7, '#fff3a8') + star(36, 150, 6, '#fff3a8') + '</g>';
  };

  function svg(key, opts) {
    opts = opts || {};
    var fn = ARTS[key] || ARTS.mystery;
    var id = ++uid;
    var size = opts.size ? ' width="' + opts.size + '" height="' + opts.size + '"' : '';
    var title = opts.title ? '<title>' + opts.title + '</title>' : '';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"' + size + ' class="art art-' + key + (opts.cls ? ' ' + opts.cls : '') + '" data-art="' + key + '" role="img">' + title +
      '<g class="d-body">' + fn(id) + '</g>' + (opts.shiny ? SHINY() : '') + '</svg>';
  }

  // 点一下团子时播放的动作
  var REACT = {
    shenzhen: 'jump', shanghai: 'pop', changsha: 'jelly', chongqing: 'shake', beijing: 'bounce', wuhan: 'wobble',
    chengdu: 'squish', xian: 'bounce', hefei: 'spin', hangzhou: 'sway', xiamen: 'carousel', dali: 'float',
    guangzhou: 'jelly', suzhou: 'tilt', nanjing: 'rock', jingdezhen: 'spin',
    mystery: 'carousel', echo: 'wobble', rebel: 'shake', diode: 'flip',
    speed: 'gallop', sloth: 'sway', night: 'jelly', early: 'float', again: 'spin', twin: 'bounce',
    shiny: 'pop', petter: 'squish', weekend: 'jump', bilingual: 'tilt', train: 'bounce'
  };
  // particle：彩纸团子（FILL 运行时替换成彩纸颜色）；goal：进度条终点的爱心定位针
  var ICONS = {
    particle: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="26" height="26">' +
      '<path d="M20 35 C11 35 5.5 33.4 5.5 26 C5.5 15 12 8 20 8 C28 8 34.5 15 34.5 26 C34.5 33.4 29 35 20 35Z" fill="FILL" stroke="#2b211c" stroke-width="2.6" stroke-linejoin="round"/>' +
      '<circle cx="14.6" cy="22.6" r="2.2" fill="#2b211c"/><circle cx="25.4" cy="22.6" r="2.2" fill="#2b211c"/>' +
      '<circle cx="15.3" cy="21.8" r=".7" fill="#fff"/><circle cx="26.1" cy="21.8" r=".7" fill="#fff"/>' +
      '<ellipse cx="10.6" cy="27.4" rx="2.6" ry="1.5" fill="#ff8fa3" opacity=".75"/><ellipse cx="29.4" cy="27.4" rx="2.6" ry="1.5" fill="#ff8fa3" opacity=".75"/></svg>',
    goal: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="34" height="34">' +
      '<ellipse cx="20" cy="37" rx="7" ry="1.9" fill="#2b211c" opacity=".18"/>' +
      '<path d="M20 36 C20 36 6.5 23.5 6.5 15.5 A13.5 13.5 0 0 1 33.5 15.5 C33.5 23.5 20 36 20 36Z" fill="#ff7a6b" stroke="#2b211c" stroke-width="2.6" stroke-linejoin="round"/>' +
      '<path d="M11 13 Q12 8.6 16 7" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/>' +
      '<circle cx="20" cy="15.5" r="7.6" fill="#fff" stroke="#2b211c" stroke-width="2"/>' +
      '<path d="M20 20 C15.8 17.2 15.2 14.2 17 12.8 C18.4 11.8 19.6 12.4 20 13.5 C20.4 12.4 21.6 11.8 23 12.8 C24.8 14.2 24.2 17.2 20 20Z" fill="#ff4d6d"/></svg>'
  };
  window.TI_ART = { svg: svg, keys: Object.keys(ARTS), react: REACT, icons: ICONS };
})();
