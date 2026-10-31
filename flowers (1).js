(function () {
  'use strict';
  var cv = document.getElementById('bg-flowers');
  if (!cv || !cv.getContext) return;
  var ctx = cv.getContext('2d');
  var W = 0, H = 0, flowers = [], rgb = '90,90,90';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function rand(a, b) { return a + Math.random() * (b - a); }
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }

  function readTheme() {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    rgb = dark ? '210,210,210' : '90,90,90';
  }

  function make(atStart) {
    return {
      x: rand(0, W), y: atStart ? rand(0, H) : H + 40,
      r: rand(10, 26), petals: pick([5, 6, 8]),
      rot: rand(0, 6.28), vr: rand(-0.004, 0.004),
      vy: rand(0.12, 0.35), sway: rand(0.2, 0.7), phase: rand(0, 6.28),
      a: rand(0.14, 0.3)
    };
  }

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var count = Math.max(8, Math.min(22, Math.round(W / 70)));
    while (flowers.length < count) flowers.push(make(true));
    flowers.length = count;
  }

  function drawFlower(f) {
    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.rotate(f.rot);
    ctx.strokeStyle = 'rgba(' + rgb + ',' + f.a + ')';
    ctx.lineWidth = 1.2;
    var step = (Math.PI * 2) / f.petals;
    for (var i = 0; i < f.petals; i++) {
      ctx.save();
      ctx.rotate(i * step);
      ctx.beginPath();
      ctx.ellipse(f.r * 0.5, 0, f.r * 0.5, f.r * 0.2, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    ctx.beginPath();
    ctx.arc(0, 0, f.r * 0.14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  var t = 0;
  function frame() {
    ctx.clearRect(0, 0, W, H);
    t += 0.01;
    for (var i = 0; i < flowers.length; i++) {
      var f = flowers[i];
      if (!reduce) {
        f.y -= f.vy;
        f.x += Math.sin(t + f.phase) * f.sway * 0.5;
        f.rot += f.vr;
        if (f.y < -40) flowers[i] = make(false);
      }
      drawFlower(flowers[i]);
    }
    if (!reduce) requestAnimationFrame(frame);
  }

  readTheme(); resize(); frame();
  window.addEventListener('resize', function () { resize(); if (reduce) frame(); });
  new MutationObserver(function () { readTheme(); if (reduce) frame(); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
})();
