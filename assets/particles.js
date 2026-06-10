/* ============================================================
   particles.js — Particules flottantes (atomes / molécules)
   Physique-Chimie Seconde · Mme Poirault-Gauvin
   À inclure en bas de <body> dans index.html :
   <script src="assets/particles.js"></script>
   ============================================================ */

(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Symboles chimiques et scientifiques
  const SYMBOLS = ['H₂O', 'CO₂', 'NaCl', 'O₂', 'H⁺', 'e⁻', '⚛', '∆', 'λ', 'ν', 'φ', 'n', 'v'];

  let particles = [];
  let W, H;

  function resize() {
    const hero = canvas.parentElement;
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }

  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  function createParticle() {
    return {
      x:       randomBetween(0, W),
      y:       randomBetween(0, H),
      vx:      randomBetween(-0.25, 0.25),
      vy:      randomBetween(-0.35, -0.1),
      opacity: randomBetween(0.06, 0.2),
      size:    randomBetween(10, 16),
      symbol:  SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      type:    Math.random() < 0.55 ? 'circle' : 'text',
      radius:  randomBetween(3, 7),
    };
  }

  function init() {
    resize();
    const count = Math.min(28, Math.floor(W / 36));
    particles = Array.from({ length: count }, createParticle);
    // Étaler les y de départ
    particles.forEach((p, i) => {
      p.y = randomBetween(0, H);
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle   = '#ffffff';
      ctx.strokeStyle = '#ffffff';

      if (p.type === 'circle') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.lineWidth = 1.2;
        ctx.stroke();
        // petit point central
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.font = `${p.size}px system-ui, sans-serif`;
        ctx.fillText(p.symbol, p.x, p.y);
      }

      ctx.restore();

      // Mouvement
      p.x += p.vx;
      p.y += p.vy;

      // Reboucler en bas quand sorti par le haut
      if (p.y < -20) {
        p.y = H + 10;
        p.x = randomBetween(0, W);
      }
      if (p.x < -30) p.x = W + 10;
      if (p.x > W + 30) p.x = -10;
    });

    requestAnimationFrame(draw);
  }

  // Respecter prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('resize', () => {
    resize();
    // Recadrer les particules hors-champ
    particles.forEach(p => {
      if (p.x > W) p.x = randomBetween(0, W);
      if (p.y > H) p.y = randomBetween(0, H);
    });
  });

  init();
  draw();
})();
