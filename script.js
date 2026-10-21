/* Vexon Systems — portfolio v4
   Theme toggle, reveal-on-scroll, stats count-up, scroll progress, hero parallax,
   magnetic button. No dependencies. Everything motion-related respects prefers-reduced-motion. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- theme toggle ---------- */
  var btn = document.getElementById('themeToggle');
  var mqDark = window.matchMedia('(prefers-color-scheme: dark)');
  function currentTheme() {
    return root.getAttribute('data-theme') || (mqDark.matches ? 'dark' : 'light');
  }
  function paintTheme() {
    var dark = currentTheme() === 'dark';
    btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
    btn.querySelector('.theme-label').textContent = dark ? 'Dark' : 'Light';
  }
  if (btn) {
    btn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      paintTheme();
    });
    if (mqDark.addEventListener) mqDark.addEventListener('change', paintTheme);
    paintTheme();
  }

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- reveal on scroll ---------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- stats count-up ---------- */
  function format(n) {
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  var counters = Array.prototype.slice.call(document.querySelectorAll('.count[data-target]'));
  if (counters.length) {
    if (reduceMotion.matches || !('IntersectionObserver' in window) || !window.requestAnimationFrame) {
      counters.forEach(function (el) { el.textContent = format(parseFloat(el.getAttribute('data-target'))); });
    } else {
      counters.forEach(function (el) { el.textContent = '0'; });
      var runCounter = function (el) {
        var target = parseFloat(el.getAttribute('data-target'));
        var duration = 1100 + Math.min(600, target / 2);
        var start = null;
        function step(ts) {
          if (start === null) start = ts;
          var p = Math.min(1, (ts - start) / duration);
          el.textContent = format(target * easeOutCubic(p));
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = format(target);
        }
        requestAnimationFrame(step);
      };
      var countObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { countObserver.observe(el); });
    }
  }

  /* ---------- scroll progress + hero parallax (one rAF loop, passive) ---------- */
  var progress = document.getElementById('progress');
  var heroMark = document.getElementById('heroMark');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY || window.pageYOffset || 0;
      if (progress) {
        var max = Math.max(1, root.scrollHeight - window.innerHeight);
        progress.style.transform = 'scaleX(' + Math.min(1, y / max) + ')';
      }
      if (heroMark && !reduceMotion.matches && y < 1200) {
        heroMark.style.transform = 'translate3d(0,' + (y * -0.12).toFixed(1) + 'px,0)';
      }
      ticking = false;
    });
  }
  if (progress || heroMark) {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }

  /* ---------- magnetic button (pointer devices only) ---------- */
  var magnets = Array.prototype.slice.call(document.querySelectorAll('.magnet'));
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (magnets.length && finePointer.matches && !reduceMotion.matches) {
    magnets.forEach(function (el) {
      var label = el.querySelector('span');
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = 'translate(' + (dx * 0.22).toFixed(1) + 'px,' + (dy * 0.28).toFixed(1) + 'px)';
        if (label) label.style.transform = 'translate(' + (dx * 0.08).toFixed(1) + 'px,' + (dy * 0.1).toFixed(1) + 'px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = '';
        if (label) label.style.transform = '';
      });
    });
  }
})();
