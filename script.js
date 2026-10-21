/* Vexon Systems — portfolio v3
   Theme toggle, reveal-on-scroll, and the stats count-up. No dependencies. */
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
    // Thousands separator, no locale surprises.
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  var counters = Array.prototype.slice.call(document.querySelectorAll('.count[data-target]'));
  if (counters.length) {
    if (reduceMotion.matches || !('IntersectionObserver' in window) || !window.requestAnimationFrame) {
      // Render final values straight away.
      counters.forEach(function (el) { el.textContent = format(parseFloat(el.getAttribute('data-target'))); });
    } else {
      counters.forEach(function (el) { el.textContent = '0'; });
      function runCounter(el) {
        var target = parseFloat(el.getAttribute('data-target'));
        var duration = 1100 + Math.min(600, target / 2);   // a touch longer for bigger numbers
        var start = null;
        function step(ts) {
          if (start === null) start = ts;
          var p = Math.min(1, (ts - start) / duration);
          el.textContent = format(target * easeOutCubic(p));
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = format(target);
        }
        requestAnimationFrame(step);
      }
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
})();
