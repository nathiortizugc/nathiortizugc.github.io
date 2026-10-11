  // VIDEO LIST. To add a video: copy one line, change c (category), y (YouTube ID), b (bold line) and s (small line).
  var CATS = [
    { id: 'beauty', t: 'Beauty & Skincare' },
    { id: 'fashion', t: 'Fashion & Accessories' },
    { id: 'tech', t: 'Tech' }
  ];
  var VIDEOS = [
    {"c":"beauty","y":"YIRntu3lvWE","b":"Hook + Talking head + B-roll","s":"FAEBEA Magnetic Lashes: sweat and wind tests"},
    {"c":"beauty","y":"EAl9j4mzGaU","b":"Talking head + B-roll + Tutorial","s":"DPDP foundation stick: wrong vs right way and touch-ups"},
    {"c":"beauty","y":"nDHGLlbCfyQ","b":"Problem / solution + Tutorial + Before and after","s":"GURANTANG keratin hair mask: voiceover and transformation"},
    {"c":"beauty","y":"zL_nr3eT4T0","b":"Hook + Talking head + Product demo","s":"DPDP lip gloss: swatches in different shades"},
    {"c":"beauty","y":"Sg5NRBAANAs","b":"Hook + Problem / solution + Talking head + Tutorial","s":"FAEBEA Magnetic Lashes: vs regular lashes and how to apply"},
    {"c":"beauty","y":"YXdjg0Tlh9g","b":"Story time + Testimonial + Before and after","s":"DPDP foundation stick: my honest skin story and half-face test"},
    {"c":"beauty","y":"BOOcjGb0mfU","b":"Testimonial + Voiceover + Problem / solution","s":"GURANTANG hair mask: tangled hair to smooth, close-up texture shots"},
    {"c":"beauty","y":"IKCbk_d6TLk","b":"Hook + Talking head + Tutorial + CTA","s":"DPDP foundation stick: half-face comparison, how to apply and shade close-ups"},
    {"c":"beauty","y":"xQId67dL8oc","b":"Unboxing + Voiceover + B-roll + ASMR","s":"BIANEMA skincare set: unboxing, textures and product breakdown"},
    {"c":"beauty","y":"Tz_8MtcPHVQ","b":"Hook + Talking head + Tutorial + Before and after","s":"FAEBEA Magnetic Lashes: scam doubts, how to apply and wind test"},
    {"c":"fashion","y":"DHA5QzZ3rrs","b":"Hook + Talking head + Try-on","s":"Waist trainer: what to look for, closure and sit test"},
    {"c":"fashion","y":"a-vXMJK09V0","b":"Hook + Talking head + Try-on + CTA","s":"OOTD Eyewear sunglasses: for small faces, designs and styles"},
    {"c":"fashion","y":"Eagz_repRn4","b":"Unboxing + Try-on + Transitions + Trending audio","s":"NOCME fashion: unboxing, try-on and outfit transitions"},
    {"c":"tech","y":"z-D9Zq_TER4","b":"Problem / solution + Talking head + App demo + B-roll","s":"Viaim Rise AI earbuds: from meeting to summary and to-dos"},
    {"c":"tech","y":"MchELd-E4dk","b":"Sketch + Voiceover + Product demo","s":"M-VAVE Tank Pro guitar pedal: storyline hook, close-ups and features"},
    {"c":"tech","y":"koJPzmn3OG4","b":"Product showcase + B-roll + Music and transitions","s":"Viaim Rise AI earbuds: case and earbuds close-ups"},
    {"c":"tech","y":"KMLcsGywtOs","b":"Quick reaction + App demo","s":"Sample: app walkthrough"},
    {"c":"tech","y":"dc1HTyrK8Xo","b":"App demo + Aesthetic + Photo mode","s":"Sample: vintage film camera app, from shot to result"}
  ];
  (function () {
    var css = document.createElement('style');
    css.textContent = '.cat-nav{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-bottom:8px}' +
      '.cat-nav a{padding:10px 22px;border-radius:999px;border:2px solid var(--cocoa);text-decoration:none;transition:background .2s,border-color .2s}' +
      '.cat-nav a:hover{background:var(--apricot-soft);border-color:var(--apricot)}' +
      '.cat{margin-top:44px;scroll-margin-top:16px}' +
      '.cat h3{font-weight:400;font-size:clamp(1.5rem,4vw,2rem);text-align:left;margin-bottom:18px;padding-bottom:10px;border-bottom:1px solid var(--cocoa-soft)}';
    document.head.appendChild(css);
    var root = document.getElementById('vids');
    if (!root) return;
    var nav = document.createElement('nav');
    nav.className = 'cat-nav';
    nav.setAttribute('aria-label', 'Video categories');
    root.appendChild(nav);
    CATS.forEach(function (c) {
      var a = document.createElement('a');
      a.href = '#cat-' + c.id; a.textContent = c.t; nav.appendChild(a);
      var sec = document.createElement('div');
      sec.className = 'cat'; sec.id = 'cat-' + c.id;
      var h = document.createElement('h3'); h.textContent = c.t; sec.appendChild(h);
      var grid = document.createElement('div'); grid.className = 'grid'; sec.appendChild(grid);
      VIDEOS.filter(function (v) { return v.c === c.id; }).forEach(function (v) {
        var fig = document.createElement('figure'); fig.className = 'item';
        var btn = document.createElement('button');
        btn.className = 'frame'; btn.type = 'button'; btn.setAttribute('data-yt', v.y);
        btn.setAttribute('aria-label', 'Play video: ' + v.s);
        var im = document.createElement('img');
        im.className = 'poster'; im.alt = ''; im.loading = 'lazy';
        im.src = 'https://i.ytimg.com/vi/' + v.y + '/hqdefault.jpg';
        im.onerror = function () { im.style.visibility = 'hidden'; };
        var pl = document.createElement('span'); pl.className = 'play';
        btn.appendChild(im); btn.appendChild(pl);
        var cap = document.createElement('figcaption'); cap.className = 'cap';
        var b = document.createElement('b'); b.textContent = v.b;
        var sp = document.createElement('span'); sp.textContent = v.s;
        cap.appendChild(b); cap.appendChild(sp);
        fig.appendChild(btn); fig.appendChild(cap); grid.appendChild(fig);
      });
      root.appendChild(sec);
    });
  })();

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
  // Images come from files in the same folder; video covers come from YouTube
  var FILES = {
    k1: 'photo-hero.jpg', k2: 'photo-about.jpg', k3: 'photo-services.jpg', k24: 'photo-contact.jpg',
    k18: 'logo-faebea.png', k19: 'logo-gurantang.png', k20: 'logo-dpdp.png',
    k21: 'logo-nocme.png', k22: 'logo-bianema.png', k23: 'logo-mvave.png'
  };
  document.querySelectorAll('img[data-k]').forEach(function (im) {
    var frame = im.closest('.frame');
    var yt = frame && frame.getAttribute('data-yt');
    if (yt) { im.src = 'https://i.ytimg.com/vi/' + yt + '/hqdefault.jpg'; return; }
    var file = FILES[im.getAttribute('data-k')];
    if (file) { im.src = file; } else { im.dispatchEvent(new Event('error')); }
  });
