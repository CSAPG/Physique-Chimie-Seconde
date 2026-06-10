/* ============================================================
   milkyway.js — Voie lactée animée (arrière-plan hero)
   Physique-Chimie Seconde · Mme Poirault-Gauvin
   À inclure en bas de <body> dans index.html :
   <script src="assets/milkyway.js"></script>
   ============================================================ */

(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, stars = [], nebulae = [], angle = 0;

  /* ---- Resize ---- */
  function resize() {
    const hero = canvas.parentElement;
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }

  function rand(a, b) { return a + Math.random() * (b - a); }

  /* ---- Création des étoiles ---- */
  function createStars() {
    const count = Math.min(320, Math.floor(W * H / 900));
    stars = Array.from({ length: count }, () => ({
      x:       rand(0, W),
      y:       rand(0, H),
      r:       rand(0.3, 1.6),
      opacity: rand(0.2, 0.9),
      twinkle: rand(0.003, 0.012),
      phase:   rand(0, Math.PI * 2),
      // vitesse de dérive très lente
      vx:      rand(-0.015, 0.015),
      vy:      rand(-0.008, 0.008),
    }));
  }

  /* ---- Nébuleuses (taches floues colorées) ---- */
  function createNebulae() {
    nebulae = [
      // Centre voie lactée
      { x: 0.5, y: 0.55, rx: 0.55, ry: 0.22, color: '100,140,255', opacity: 0.09, angle: -0.35 },
      { x: 0.48, y: 0.5, rx: 0.38, ry: 0.12, color: '160,100,255', opacity: 0.07, angle: -0.3 },
      // Bras spiraux
      { x: 0.25, y: 0.7,  rx: 0.28, ry: 0.09, color: '80,160,255',  opacity: 0.06, angle: -0.5 },
      { x: 0.75, y: 0.35, rx: 0.28, ry: 0.09, color: '80,160,255',  opacity: 0.06, angle: -0.5 },
      // Teinte chaude au centre
      { x: 0.5,  y: 0.52, rx: 0.18, ry: 0.08, color: '200,160,255', opacity: 0.08, angle: -0.32 },
    ];
  }

  /* ---- Dessin nébuleuse (ellipse floue) ---- */
  function drawNebula(n) {
    ctx.save();
    ctx.translate(n.x * W, n.y * H);
    ctx.rotate(n.angle);

    const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, n.rx * W);
    grd.addColorStop(0,   `rgba(${n.color},${n.opacity})`);
    grd.addColorStop(0.5, `rgba(${n.color},${n.opacity * 0.4})`);
    grd.addColorStop(1,   `rgba(${n.color},0)`);

    ctx.scale(1, n.ry / n.rx);
    ctx.beginPath();
    ctx.arc(0, 0, n.rx * W, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.restore();
  }

  /* ---- Boucle principale ---- */
  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Flou global via filtre CSS sur le canvas
    // (on dessine tout, le flou est géré par style CSS)

    // Nébuleuses
    nebulae.forEach(drawNebula);

    // Étoiles scintillantes
    const t = performance.now() / 1000;
    stars.forEach(s => {
      const twinkle = 0.5 + 0.5 * Math.sin(t * s.twinkle * 60 + s.phase);
      const alpha   = s.opacity * (0.5 + 0.5 * twinkle);

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();

      // Légère dérive
      s.x += s.vx;
      s.y += s.vy;
      if (s.x < 0) s.x = W;
      if (s.x > W) s.x = 0;
      if (s.y < 0) s.y = H;
      if (s.y > H) s.y = 0;
    });

    // Rotation très lente de l'ensemble (illusion de mouvement galactique)
    angle += 0.00008;

    requestAnimationFrame(draw);
  }

  /* ---- Flou CSS sur le canvas ---- */
  function applyBlur() {
    canvas.style.filter = 'blur(1.5px)';
    canvas.style.opacity = '0.85';
  }

  /* ---- Init ---- */
  function init() {
    resize();
    createStars();
    createNebulae();
    applyBlur();
    draw();
  }

  window.addEventListener('resize', () => {
    resize();
    createStars();
    createNebulae();
  });

  init();
})();
