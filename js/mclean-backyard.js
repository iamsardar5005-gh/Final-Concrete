(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
      }
    });
  }

  /* ---------- hero film ----------
     The poster (a finished, lived-in frame) is the LCP element and renders
     immediately. The film is only requested after the page has loaded, then
     plays once — neglected yard → plan → build → lived in — and holds on its
     final evening frame. The stage rail tracks the six chapters. */
  var hero = document.querySelector('.hero');
  var video = hero && hero.querySelector('.hero-video');
  var rail = hero && hero.querySelector('[data-rail]');
  var stages = rail ? Array.prototype.slice.call(rail.querySelectorAll('[data-stage]')) : [];
  var progress = rail && rail.querySelector('[data-progress]');
  var current = rail && rail.querySelector('[data-current]');
  var control = rail && rail.querySelector('[data-video-toggle]');
  var controlLabel = control && control.querySelector('[data-video-label]');
  var starts = stages.map(function (li) { return parseFloat(li.getAttribute('data-start')) || 0; });
  var names = stages.map(function (li) { return li.querySelector('.rail-t').textContent; });
  var rafId = 0;

  function setStatic() {
    if (!hero) return;
    hero.classList.add('is-static');
    if (current) current.textContent = names[names.length - 1] || '';
  }

  function stageAt(t) {
    var idx = 0;
    for (var i = 0; i < starts.length; i++) if (t >= starts[i]) idx = i;
    return idx;
  }

  function paintRail() {
    if (!video) return;
    var d = video.duration || 10;
    var t = video.currentTime;
    var idx = stageAt(t);
    stages.forEach(function (li, i) {
      li.classList.toggle('is-active', i === idx);
      li.classList.toggle('is-done', i < idx);
    });
    if (progress) progress.parentNode.style.setProperty('--p', Math.min(100, (t / d) * 100).toFixed(2) + '%');
    if (current && current.textContent !== names[idx]) current.textContent = names[idx];
  }

  function loop() {
    paintRail();
    if (!video.paused && !video.ended) rafId = requestAnimationFrame(loop);
  }

  function setControl(state) {
    if (!control) return;
    control.hidden = false;
    control.setAttribute('data-state', state);
    controlLabel.textContent = state === 'playing' ? 'Pause' : state === 'ended' ? 'Replay' : 'Play';
    control.setAttribute('aria-label', (state === 'playing' ? 'Pause' : state === 'ended' ? 'Replay' : 'Play') + ' the transformation film');
  }

  function startFilm() {
    var saveData = navigator.connection && navigator.connection.saveData;
    if (!video || reduceMotion.matches || saveData) { setStatic(); return; }

    // H.264 MP4 first; VP9 WebM for browsers built without H.264.
    var ext = video.canPlayType('video/mp4; codecs="avc1.640020"') ? '.mp4'
      : video.canPlayType('video/webm; codecs="vp9"') ? '.webm' : '';
    if (!ext) { setStatic(); return; }
    var mobile = window.matchMedia('(max-width: 599px)').matches;
    video.src = video.getAttribute(mobile ? 'data-src-mobile' : 'data-src-desktop') + ext;
    video.preload = 'auto';

    video.addEventListener('playing', function () {
      hero.classList.add('is-playing');
      hero.classList.remove('is-static');
      setControl('playing');
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(loop);
    });
    video.addEventListener('pause', function () {
      if (!video.ended) setControl('paused');
      paintRail();
    });
    video.addEventListener('ended', function () {
      setControl('ended');
      paintRail();
    });
    video.addEventListener('seeked', paintRail);
    video.addEventListener('timeupdate', paintRail);
    video.addEventListener('error', function () { setStatic(); if (control) control.hidden = true; });

    var p = video.play();
    if (p && typeof p.catch === 'function') {
      p.catch(function (err) {
        setStatic();
        // Autoplay blocked (e.g. low-power mode): the poster stays, and the film is one tap away.
        if (err && err.name === 'NotAllowedError') setControl('paused');
      });
    }
  }

  if (control) {
    control.addEventListener('click', function () {
      if (video.ended) { video.currentTime = 0; video.play(); }
      else if (video.paused) video.play();
      else video.pause();
    });
  }

  stages.forEach(function (li, i) {
    li.querySelector('button').addEventListener('click', function () {
      if (!video || !video.src || hero.classList.contains('is-static') && reduceMotion.matches) return;
      video.currentTime = starts[i] + 0.05;
      paintRail();
      video.play();
    });
  });

  if (hero) {
    if (reduceMotion.matches) setStatic();
    else if (document.readyState === 'complete') setTimeout(startFilm, 120);
    else window.addEventListener('load', function () { setTimeout(startFilm, 120); });

    reduceMotion.addEventListener && reduceMotion.addEventListener('change', function (e) {
      if (e.matches && video) { video.pause(); hero.classList.remove('is-playing'); setStatic(); }
    });

    // Don't burn CPU while the hero is off-screen mid-film.
    if ('IntersectionObserver' in window && video) {
      var wasPlaying = false;
      new IntersectionObserver(function (entries) {
        var e = entries[0];
        if (!video.src) return;
        if (!e.isIntersecting && !video.paused) { wasPlaying = true; video.pause(); }
        else if (e.isIntersecting && wasPlaying) { wasPlaying = false; video.play(); }
      }, { threshold: 0.15 }).observe(hero);
    }
  }

  /* ---------- before / after ---------- */
  var compare = document.querySelector('[data-compare]');
  if (compare) {
    var range = compare.querySelector('.compare-range');
    var update = function () { compare.style.setProperty('--pos', range.value + '%'); };
    range.addEventListener('input', update);
    update();
  }

  /* ---------- build strip ---------- */
  var strip = document.querySelector('[data-strip]');
  var prev = document.querySelector('[data-strip-prev]');
  var next = document.querySelector('[data-strip-next]');
  if (strip && prev && next) {
    var stepW = function () {
      var first = strip.querySelector('.step');
      var gap = parseFloat(getComputedStyle(strip).columnGap) || 24;
      return first ? first.getBoundingClientRect().width + gap : 320;
    };
    var sync = function () {
      prev.disabled = strip.scrollLeft < 4;
      next.disabled = strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 4;
    };
    prev.addEventListener('click', function () { strip.scrollBy({ left: -stepW(), behavior: reduceMotion.matches ? 'auto' : 'smooth' }); });
    next.addEventListener('click', function () { strip.scrollBy({ left: stepW(), behavior: reduceMotion.matches ? 'auto' : 'smooth' }); });
    strip.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  }

  /* ---------- demo form (does not transmit) ---------- */
  var form = document.querySelector('[data-form]');
  if (form) {
    var status = form.querySelector('[data-form-status]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = null;
      ['name', 'email'].forEach(function (n) {
        var f = form.elements[n];
        var ok = f.value.trim() && (n !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()));
        f.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (!ok && !bad) bad = f;
      });
      if (bad) {
        status.classList.add('is-error');
        status.textContent = 'Please add your name and a valid email so we can reply.';
        bad.focus();
        return;
      }
      var uses = Array.prototype.map.call(form.querySelectorAll('input[name="use"]:checked'), function (c) {
        return c.nextElementSibling.textContent.toLowerCase();
      });
      status.classList.remove('is-error');
      status.textContent = 'Thanks, ' + form.elements.name.value.trim().split(' ')[0] + '. ' +
        (uses.length ? 'Noted: ' + uses.join(', ') + '. ' : '') +
        'This is a demo form, so nothing was sent — connect it to your inbox or CRM before launch.';
    });
  }
})();
