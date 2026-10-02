  // Tap a video: it opens in a larger player (YouTube for full videos, local clip as a fallback)
  var modal = document.getElementById('modal');
  var player = document.getElementById('player');
  var ytwrap = document.getElementById('ytwrap');
  var ytfb = document.getElementById('ytfb');
  var ytPlayer = null, fbTimer = null, apiRequested = false;
  function loadYT(cb) {
    if (window.YT && window.YT.Player) { cb(); return; }
    window.onYouTubeIframeAPIReady = cb;
    if (apiRequested) return;
    apiRequested = true;
    var s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(s);
  }
  function openYT(id) {
    player.style.display = 'none';
    ytwrap.style.display = 'block';
    ytfb.hidden = true;
    ytfb.href = 'https://www.youtube.com/watch?v=' + id;
    modal.classList.add('open');
    var ifr = document.createElement('iframe');
    var origin = (location.protocol === 'http:' || location.protocol === 'https:') ? '&origin=' + encodeURIComponent(location.origin) : '';
    ifr.src = 'https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0&playsinline=1&modestbranding=1&enablejsapi=1' + origin;
    ifr.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    ifr.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen');
    ifr.setAttribute('allowfullscreen', '');
    ifr.setAttribute('title', 'Video');
    ytwrap.innerHTML = '';
    ytwrap.appendChild(ifr);
    ytPlayer = null;
    loadYT(function () {
      try {
        ytPlayer = new YT.Player(ifr, { events: { onStateChange: function (e) { if (e.data === 0) closeModal(); } } });
      } catch (err) {}
    });
    clearTimeout(fbTimer);
    fbTimer = setTimeout(function () {
      var playing = ytPlayer && ytPlayer.getPlayerState && ytPlayer.getPlayerState() === 1;
      if (!playing) ytfb.hidden = false;
    }, 6000);
  }
  function closeModal() {
    player.pause(); player.removeAttribute('src'); player.load();
    clearTimeout(fbTimer);
    ytwrap.innerHTML = '';
    ytPlayer = null;
    ytfb.hidden = true;
    modal.classList.remove('open');
  }
  document.querySelectorAll('.frame[data-video], .frame[data-yt]').forEach(function (frame) {
    frame.addEventListener('click', function () {
      var yt = frame.getAttribute('data-yt');
      if (yt) { openYT(yt); return; }
      ytwrap.style.display = 'none';
      ytfb.hidden = true;
      player.style.display = 'block';
      player.src = frame.getAttribute('data-video');
      modal.classList.add('open');
      player.play();
    });
  });
  document.getElementById('close').addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

  // Copy email
  var toast = document.getElementById('toast');
  document.getElementById('copy').addEventListener('click', function () {
    var email = 'nathaliortiznieto10@gmail.com';
    var done = function () { toast.classList.add('show'); setTimeout(function () { toast.classList.remove('show'); }, 1800); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(done, done);
    } else { done(); }
  });
  // Count-up for the reach numbers when they scroll into view
  (function () {
    var nums = document.querySelectorAll('.num[data-target]');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var el = e.target, target = parseFloat(el.dataset.target), dec = parseInt(el.dataset.decimals || '0', 10), suf = el.dataset.suffix || '';
        var start = null, dur = 1300;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * eased).toFixed(dec) + suf;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { n.textContent = '0' + (n.dataset.suffix || ''); io.observe(n); });
  })();
  // Fill in images; if one is missing, run its fallback (brand name text or nothing)
  document.querySelectorAll('img[data-k]').forEach(function (im) {
    var v = (window.IM || {})[im.getAttribute('data-k')];
    if (v) { im.src = v; } else { im.dispatchEvent(new Event('error')); }
  });
