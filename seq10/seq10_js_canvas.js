<script>
/* ─── Gestion des onglets ─── */
function showTab(id, btn) {
  // Masquer tous les panneaux
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  // Désactiver tous les boutons
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  // Afficher le panneau sélectionné
  document.getElementById(id).classList.add('active');
  btn.classList.add('active');
  // Remonter en haut
  window.scrollTo({ top: document.querySelector('.tab-bar').offsetTop - 2, behavior: 'smooth' });
  // Forcer le redraw du canvas lentille si on arrive sur l'onglet 4
  if(id === 't4') { setTimeout(function(){ if(window.p4Draw) p4Draw(); }, 80); }
  // Redémarrer le quiz si on arrive sur tq et qu'il n'est pas démarré
  if(id === 'tq') { if(typeof renderQuestion === 'function' && !document.querySelector('.quiz-question')) renderQuestion(); }
}

/* ─── Canvas ciel ─── */
(function(){
  const cv = document.getElementById('skyCanvas');
  if(!cv) return;
  const ctx = cv.getContext('2d');
  let t = 0;

  const SUN = { xr: 0.93, yr: 0.08 };

  // Grand nuage FIXE — positionné pour couvrir le soleil aux 3/4
  // Le soleil dépasse sur le coin haut-droit du nuage
  const MAIN_CLOUD = {
    xr: 0.82, yr: 0.18,
    puffs: [
      {dx:-100, dy:22, rx:70, ry:38},
      {dx: -40, dy: 6, rx:86, ry:50},
      {dx:  32, dy:14, rx:72, ry:44},
      {dx:  90, dy:24, rx:54, ry:34},
      {dx: -60, dy:40, rx:60, ry:28},
      {dx:  15, dy:44, rx:64, ry:26},
    ]
  };

  // Petits nuages MOBILES — légers, semi-transparents
  const SMALL_CLOUDS = [
    { xr:0.08, yr:0.25, spd:0.28, alpha:0.36,
      puffs:[{dx:0,dy:0,rx:42,ry:22},{dx:38,dy:6,rx:34,ry:18},{dx:-30,dy:8,rx:28,ry:15}] },
    { xr:0.30, yr:0.62, spd:0.18, alpha:0.28,
      puffs:[{dx:0,dy:0,rx:50,ry:26},{dx:44,dy:5,rx:38,ry:20},{dx:-32,dy:7,rx:30,ry:17}] },
    { xr:0.50, yr:0.42, spd:0.22, alpha:0.32,
      puffs:[{dx:0,dy:0,rx:36,ry:19},{dx:32,dy:4,rx:28,ry:15},{dx:-22,dy:6,rx:22,ry:13}] },
  ];
  const smallOff = SMALL_CLOUDS.map(() => 0);

  // Rayons : faisceaux rectilignes depuis le soleil vers le bas-gauche
  const RAYS = [
    {a: Math.PI*0.54, w:26, op:0.20},
    {a: Math.PI*0.60, w:40, op:0.15},
    {a: Math.PI*0.65, w:20, op:0.19},
    {a: Math.PI*0.70, w:52, op:0.12},
    {a: Math.PI*0.76, w:30, op:0.17},
    {a: Math.PI*0.82, w:18, op:0.14},
    {a: Math.PI*0.88, w:36, op:0.11},
    {a: Math.PI*0.95, w:22, op:0.13},
  ];

  // Ellipse nuage : blanc plein au centre, fondu sur les bords — sans halo circulaire
  function ellipsePuff(cx, cy, rx, ry, alpha, opaque) {
    ctx.save();
    ctx.globalAlpha = alpha;
    // Clip sur l'ellipse exacte → le gradient ne déborde jamais en cercle
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.clip();
    // Remplissage : blanc plein si opaque, semi si non
    if(opaque) {
      ctx.fillStyle = 'rgba(248,252,255,1)';
      ctx.fill();
      // Légère ombre interne bas pour donner du volume
      const sh = ctx.createLinearGradient(cx, cy - ry, cx, cy + ry);
      sh.addColorStop(0,   'rgba(255,255,255,0.5)');
      sh.addColorStop(0.5, 'rgba(230,242,255,0)');
      sh.addColorStop(1,   'rgba(180,210,235,0.25)');
      ctx.fillStyle = sh;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry));
      g.addColorStop(0,   'rgba(255,255,255,0.92)');
      g.addColorStop(0.6, 'rgba(235,246,255,0.65)');
      g.addColorStop(1,   'rgba(215,234,252,0.20)');
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    }
    ctx.restore();
  }

  // Rayons rectilignes stricts : trapèze avec dégradé LINÉAIRE
  function drawRays(sunX, sunY, W, H) {
    const len = Math.sqrt(W*W + H*H) * 1.5;
    RAYS.forEach(r => {
      ctx.save();
      const pulse = 0.82 + 0.18 * Math.sin(t * 0.38 + r.a * 3.1);
      ctx.globalAlpha = r.op * pulse;
      const dx = Math.cos(r.a), dy = Math.sin(r.a);  // direction rayon
      const px = -dy, py = dx;                         // perpendiculaire
      const x1 = sunX, y1 = sunY;
      const x2 = sunX + dx*len, y2 = sunY + dy*len;
      const hw  = r.w * 0.5;
      const hwE = hw + len * 0.035;  // léger évasement en bout
      // Dégradé linéaire le long du rayon → côtés parfaitement droits
      const g = ctx.createLinearGradient(x1, y1, x2, y2);
      g.addColorStop(0,    'rgba(255,248,190,0.88)');
      g.addColorStop(0.08, 'rgba(255,244,175,0.52)');
      g.addColorStop(0.30, 'rgba(255,240,158,0.20)');
      g.addColorStop(0.70, 'rgba(255,238,148,0.05)');
      g.addColorStop(1,    'rgba(255,235,140,0)');
      // Trapèze rectiligne : 4 sommets
      ctx.beginPath();
      ctx.moveTo(x1 + px*hw,  y1 + py*hw);
      ctx.lineTo(x2 + px*hwE, y2 + py*hwE);
      ctx.lineTo(x2 - px*hwE, y2 - py*hwE);
      ctx.lineTo(x1 - px*hw,  y1 - py*hw);
      ctx.closePath();
      ctx.fillStyle = g;
      ctx.fill();
      ctx.restore();
    });
  }

  function drawMainCloud(W, H) {
    const bx = W * MAIN_CLOUD.xr, by = H * MAIN_CLOUD.yr;
    MAIN_CLOUD.puffs.forEach(p => ellipsePuff(bx+p.dx, by+p.dy, p.rx, p.ry, 0.97, false));
    // Liseré doré (contre-jour)
    MAIN_CLOUD.puffs.slice(0, 4).forEach(p => {
      ctx.save();
      ctx.globalAlpha = 0.30;
      const rim = ctx.createRadialGradient(
        bx+p.dx, by+p.dy - p.ry*0.55, p.ry*0.2,
        bx+p.dx, by+p.dy, Math.max(p.rx, p.ry)*1.06
      );
      rim.addColorStop(0,    'rgba(255,248,160,0)');
      rim.addColorStop(0.85, 'rgba(255,248,160,0)');
      rim.addColorStop(1,    'rgba(255,240,120,0.72)');
      ctx.beginPath();
      ctx.ellipse(bx+p.dx, by+p.dy, p.rx*1.06, p.ry*1.06, 0, 0, Math.PI*2);
      ctx.fillStyle = rim;
      ctx.fill();
      ctx.restore();
    });
  }

  function draw() {
    const W0 = cv.parentElement.clientWidth  || 900;
    const H0 = cv.parentElement.clientHeight || 260;
    if(cv.width  !== W0) cv.width  = W0;
    if(cv.height !== H0) cv.height = H0;
    const W = cv.width, H = cv.height;
    const sunX = W * SUN.xr, sunY = H * SUN.yr;

    // Ciel
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0,    '#3070c0');
    sky.addColorStop(0.40, '#5298e0');
    sky.addColorStop(0.82, '#88c4ec');
    sky.addColorStop(1,    '#acd8f4');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Rayons rectilignes (AVANT le nuage)
    drawRays(sunX, sunY, W, H);

    // Grand nuage fixe — couvre le soleil aux 3/4
    drawMainCloud(W, H);

    // Disque solaire dessiné APRÈS le nuage : visible seulement sur le quart droit
    ctx.save();
    ctx.beginPath();
    ctx.arc(sunX, sunY, 28, 0, Math.PI*2);
    ctx.fillStyle = '#fff8c0';
    ctx.fill();
    ctx.fillStyle = '#ffe840';
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 20, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();

    // Petits nuages mobiles
    SMALL_CLOUDS.forEach((c, i) => {
      smallOff[i] += c.spd;
      const bx = (c.xr * W + smallOff[i]) % (W + 200) - 100;
      const by = c.yr * H;
      c.puffs.forEach(p => ellipsePuff(bx+p.dx, by+p.dy, p.rx, p.ry, c.alpha, false));
    });

    // Brume horizon
    const mist = ctx.createLinearGradient(0, H*0.75, 0, H);
    mist.addColorStop(0, 'rgba(175,215,244,0)');
    mist.addColorStop(1, 'rgba(185,220,246,0.25)');
    ctx.fillStyle = mist;
    ctx.fillRect(0, H*0.75, W, H*0.25);

    t += 0.016;
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ─── Animation A : source → objet → ombre (propagation rectiligne) ─── */
(function(){
  const cv = document.getElementById('propCanvas');
  if(!cv) return;
  const ctx = cv.getContext('2d');

  let objetType = 'opaque'; // opaque | translucide | transparent
  let t = 0;

  window.propSetObjet = function(type, btn) {
    objetType = type;
    document.querySelectorAll('#btnOpaque,#btnTranslucide,#btnTransparent').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
  };

  const LABELS = {
    opaque:      'Corps opaque : la lumière ne passe pas — ombre nette',
    translucide: 'Corps translucide : la lumière passe en partie — ombre atténuée (pénombre)',
    transparent: 'Corps transparent : la lumière passe entièrement — pas d\'ombre',
  };

  function draw() {
    cv.width = cv.parentElement.clientWidth || 860;
    const W = cv.width, H = cv.height;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle = '#f8f9fb';
    ctx.fillRect(0,0,W,H);

    const srcX = 52, srcY = H/2;
    const objX = W*0.42, objW = 14, objH = 70;
    const wallX = W - 30;

    // Transparence objet
    const transAlpha = objetType==='opaque' ? 1 : (objetType==='translucide' ? 0.45 : 0);
    const shadowAlpha = objetType==='opaque' ? 0.38 : (objetType==='translucide' ? 0.14 : 0);

    // ─ Rayons tracés en LIGNES DROITES depuis la source ─
    const rayCount = 9;
    for(let i=0; i<rayCount; i++){
      const angle = (-0.55 + 1.10*(i/(rayCount-1)));
      const endY = srcY + Math.tan(angle)*(wallX - srcX);
      const hitObjTop    = srcY + Math.tan(angle)*(objX - srcX);
      const hitObjBottom = hitObjTop;

      // Rayon touche-t-il l'objet ?
      const hitY = srcY + Math.tan(angle)*(objX - objW/2 - srcX);
      const blocked = (hitY > srcY - objH/2 - 4) && (hitY < srcY + objH/2 + 4) && transAlpha > 0.5;

      // Couleur rayon
      const rayAlpha = blocked ? 0 : 0.75;
      if(rayAlpha > 0){
        ctx.save();
        ctx.strokeStyle = `rgba(255,210,60,${rayAlpha})`;
        ctx.lineWidth = 1.8;
        ctx.setLineDash([]);

        // Rayon de la source jusqu'à l'objet ou au mur
        const stopX = (hitY > srcY-objH/2-4 && hitY < srcY+objH/2+4) ? objX - objW/2 : wallX;
        const stopY = srcY + Math.tan(angle)*(stopX - srcX);
        ctx.beginPath();
        ctx.moveTo(srcX, srcY);
        ctx.lineTo(stopX, stopY);
        ctx.stroke();

        // Si translucide : rayon atténué après l'objet
        if(objetType === 'translucide' && hitY > srcY-objH/2-4 && hitY < srcY+objH/2+4){
          ctx.strokeStyle = `rgba(255,210,60,0.22)`;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(objX + objW/2, stopY);
          ctx.lineTo(wallX, srcY + Math.tan(angle)*(wallX-srcX));
          ctx.stroke();
        }

        // Rayon qui passe (transparent ou hors objet)
        if(objetType==='transparent' || (hitY < srcY-objH/2-4 || hitY > srcY+objH/2+4)){
          ctx.strokeStyle = `rgba(255,210,60,0.75)`;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(srcX, srcY);
          ctx.lineTo(wallX, endY);
          ctx.stroke();
        }

        // Flèche sens propagation sur le premier rayon horizontal
        if(i === Math.floor(rayCount/2)){
          const mx = (srcX + (blocked ? objX-objW/2 : wallX))*0.5;
          const my = srcY + Math.tan(angle)*(mx - srcX);
          ctx.fillStyle = 'rgba(200,150,0,0.8)';
          ctx.beginPath();
          ctx.moveTo(mx+6, my);
          ctx.lineTo(mx-4, my-4);
          ctx.lineTo(mx-4, my+4);
          ctx.closePath(); ctx.fill();
        }
        ctx.restore();
      }
    }

    // ─ Ombre portée sur le mur ─
    if(shadowAlpha > 0){
      // Calcul ombre : rayons tangents haut/bas de l'objet
      const tanTop    = (srcY - objH/2 - srcY) / (objX - objW/2 - srcX);
      const tanBot    = (srcY + objH/2 - srcY) / (objX - objW/2 - srcX);
      const shTop = srcY + tanTop*(wallX - srcX);
      const shBot = srcY + tanBot*(wallX - srcX);
      const shadowH = Math.abs(shBot - shTop);

      // Ombre nette
      ctx.save();
      ctx.globalAlpha = shadowAlpha;
      ctx.fillStyle = '#2a3a4a';
      ctx.fillRect(wallX - 8, Math.min(shTop,shBot), 12, shadowH);
      ctx.restore();

      // Étiquette ombre
      ctx.font = '11px "DM Mono", monospace';
      ctx.fillStyle = '#666';
      ctx.textAlign = 'left';
      ctx.fillText('Ombre', wallX - 5, Math.min(shTop,shBot) - 6);
    }

    // ─ Mur écran ─
    ctx.fillStyle = '#c8cdd5';
    ctx.fillRect(wallX, 20, 8, H-40);
    ctx.font = '10px "DM Mono", monospace';
    ctx.fillStyle = '#999';
    ctx.textAlign = 'center';
    ctx.fillText('Écran', wallX+4, H-8);

    // ─ Objet ─
    ctx.save();
    if(objetType === 'transparent'){
      ctx.strokeStyle = '#3a4db5';
      ctx.lineWidth = 2;
      ctx.setLineDash([5,4]);
      ctx.strokeRect(objX-objW/2, srcY-objH/2, objW, objH);
      ctx.setLineDash([]);
    } else {
      const alpha = objetType==='translucide' ? 0.45 : 1;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#3a4db5';
      ctx.fillRect(objX-objW/2, srcY-objH/2, objW, objH);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#2a3aaa';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(objX-objW/2, srcY-objH/2, objW, objH);
    }
    ctx.restore();
    ctx.font = '10px "DM Mono", monospace';
    ctx.fillStyle = '#3a4db5';
    ctx.textAlign = 'center';
    ctx.fillText('Objet', objX, srcY - objH/2 - 8);

    // ─ Source lumineuse (ampoule simplifiée) ─
    // Halo pulsé
    const pulse = 0.5 + 0.5*Math.sin(t*1.8);
    const halo = ctx.createRadialGradient(srcX, srcY, 0, srcX, srcY, 38+pulse*6);
    halo.addColorStop(0, 'rgba(255,240,120,0.45)');
    halo.addColorStop(1, 'rgba(255,240,120,0)');
    ctx.beginPath(); ctx.arc(srcX, srcY, 38+pulse*6, 0, Math.PI*2);
    ctx.fillStyle = halo; ctx.fill();
    // Disque source
    ctx.beginPath(); ctx.arc(srcX, srcY, 12, 0, Math.PI*2);
    ctx.fillStyle = '#ffe066'; ctx.fill();
    ctx.strokeStyle = '#e0a800'; ctx.lineWidth = 2; ctx.stroke();
    ctx.font = '10px "DM Mono", monospace';
    ctx.fillStyle = '#7a5800';
    ctx.textAlign = 'center';
    ctx.fillText('Source', srcX, srcY + 22);

    // ─ Légende bas ─
    ctx.font = '11px "Outfit", sans-serif';
    ctx.fillStyle = '#444';
    ctx.textAlign = 'center';
    ctx.fillText(LABELS[objetType], W/2, H - 10);

    t += 0.025;
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ─── Animation B : Éclair et tonnerre (v2) ─── */
(function(){

  const C_LUM = 3e8;   // m/s
  const V_SON = 343;   // m/s

  // ── État ──
  let distM      = 3000;
  // phases : 'idle' | 'flash' | 'counting' | 'thunder' | 'done'
  let phase      = 'idle';
  let flashT     = 0;
  let nuageSegs  = [];
  let flashAlpha = 0;  // opacité de l'éclair (décroît vite)
  let bgPulse    = 0;  // flash blanc de tout le canvas
  let starField  = [];
  // Onde sonore : position x qui glisse de l'éclair vers l'observateur
  let soundWaveX = -1;
  let audioCtx   = null;

  // ── Audio ──
  function playThunder(distKm){
    try {
      if(!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)();
      const ac = audioCtx;
      const dur = 3;
      const buf = ac.createBuffer(1, ac.sampleRate*dur, ac.sampleRate);
      const d = buf.getChannelData(0);
      let b = 0;
      for(let i=0;i<d.length;i++){ b=(b+(Math.random()*2-1)*0.06)*0.978; d[i]=b; }
      const src = ac.createBufferSource(); src.buffer=buf;
      const filt = ac.createBiquadFilter(); filt.type='lowpass'; filt.frequency.value=160+Math.random()*80;
      const gain = ac.createGain();
      const now = ac.currentTime;
      const vol = Math.max(0.15, 1-distKm/14);
      gain.gain.setValueAtTime(0,now);
      gain.gain.linearRampToValueAtTime(vol, now+0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now+2.8+distKm*0.08);
      src.connect(filt); filt.connect(gain); gain.connect(ac.destination);
      src.start(now);
    } catch(e){}
  }

  // ── Canvas ──
  const cv = document.getElementById('orageCanvas');
  if(!cv) return;
  const ctx = cv.getContext('2d');

  function resize(){
    cv.width  = cv.offsetWidth  || 800;
    cv.height = cv.offsetHeight || 280;
    buildStars();
    buildLightning();
  }

  function buildStars(){
    starField=[];
    const W=cv.width,H=cv.height;
    for(let i=0;i<55;i++)
      starField.push({x:Math.random()*W, y:Math.random()*(H*0.58),
                      r:Math.random()*1.1+0.3, ph:Math.random()*Math.PI*2});
  }

  function buildLightning(){
    // L'éclair part du nuage (droite, ~60% de la largeur) et touche le sol
    const W=cv.width, H=cv.height;
    const sx = W*0.60 + (Math.random()-0.5)*W*0.08;
    let cx=sx, cy=H*0.26;
    nuageSegs=[];
    const steps=9+Math.floor(Math.random()*4);
    for(let i=0;i<steps;i++){
      const nx=cx+(Math.random()-0.5)*W*0.06;
      const ny=cy+H*0.52/steps;
      nuageSegs.push({x1:cx,y1:cy,x2:nx,y2:ny});
      cx=nx; cy=ny;
    }
    nuageSegs.push({x1:cx,y1:cy,x2:sx+(Math.random()-0.5)*W*0.05,y2:H*0.84});
  }

  // ── Dessin principal ──
  function draw(ts){
    const W=cv.width, H=cv.height;
    if(!W||!H){ requestAnimationFrame(draw); return; }

    // --- Fond nuit ---
    const bg=ctx.createLinearGradient(0,0,0,H);
    bg.addColorStop(0,'#08090e');
    bg.addColorStop(0.6,'#101828');
    bg.addColorStop(1,'#0a1208');
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);

    // --- Pulse blanc au flash ---
    if(bgPulse>0){
      ctx.fillStyle=`rgba(255,255,220,${bgPulse})`;
      ctx.fillRect(0,0,W,H);
      bgPulse=Math.max(0,bgPulse-0.055);
    }

    // --- Étoiles ---
    starField.forEach(s=>{
      const a=0.35+0.35*Math.sin(ts*0.0008+s.ph);
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(220,225,255,${a})`; ctx.fill();
    });

    // --- Nuages ---
    drawClouds(W,H);

    // --- Sol et observateur ---
    drawGround(W,H);

    // --- Éclair (disparaît rapidement) ---
    if(flashAlpha>0 && nuageSegs.length){
      ctx.save();
      ctx.shadowBlur=28; ctx.shadowColor=`rgba(255,240,160,${flashAlpha})`;
      // trait principal blanc
      ctx.strokeStyle=`rgba(255,255,255,${flashAlpha})`;
      ctx.lineWidth=3; ctx.lineCap='round'; ctx.lineJoin='round';
      ctx.beginPath();
      ctx.moveTo(nuageSegs[0].x1,nuageSegs[0].y1);
      nuageSegs.forEach(s=>ctx.lineTo(s.x2,s.y2));
      ctx.stroke();
      // halo jaune-orange
      ctx.strokeStyle=`rgba(255,200,60,${flashAlpha*0.6})`;
      ctx.lineWidth=8; ctx.stroke();
      ctx.restore();
      flashAlpha=Math.max(0,flashAlpha-0.05);
    }

    // --- Onde sonore (front d'onde qui se déplace de droite à gauche) ---
    // L'observateur (œil) est à gauche (x≈W*0.08), l'éclair à droite
    if(phase==='counting'||phase==='thunder'||phase==='done'){
      const elapsed=(performance.now()-flashT)/1000;
      const tSon=distM/V_SON;
      const prog=Math.min(elapsed/tSon,1);

      const lightningX = nuageSegs.length ? nuageSegs[nuageSegs.length-1].x2 : W*0.6;
      const obsX = W*0.10;
      // Le son part de l'éclair et avance vers l'observateur
      const waveX = lightningX - (lightningX - obsX)*prog;

      // dessin de l'onde : arc de cercle côté gauche (comme une onde qui s'étend)
      if(phase!=='done' || prog<1){
        ctx.save();
        const waveColor='rgba(230,160,40,'; // orange chaud
        // plusieurs arcs concentriques légèrement décalés
        for(let k=0;k<3;k++){
          const r=18+k*22;
          const al=Math.max(0,0.55-k*0.16-(1-Math.max(0,(prog>0.98?0:1)))*0);
          ctx.beginPath();
          ctx.arc(waveX, H*0.84, r, -Math.PI*0.75, Math.PI*0.75);
          ctx.strokeStyle=waveColor+al+')';
          ctx.lineWidth=2-k*0.3; ctx.stroke();
        }
        ctx.restore();
      }
    }

    // --- HUD ---
    drawHUD(W,H);

    requestAnimationFrame(draw);
  }

  function drawClouds(W,H){
    ctx.save();
    // Nuage orageux (côté éclair, droite)
    const cx=nuageSegs.length ? nuageSegs[0].x1 : W*0.6;
    const cy=H*0.20;
    const g=ctx.createRadialGradient(cx,cy,8,cx,cy,90);
    g.addColorStop(0,'rgba(70,80,110,0.95)');
    g.addColorStop(0.6,'rgba(45,55,90,0.80)');
    g.addColorStop(1,'rgba(20,25,50,0)');
    ctx.fillStyle=g;
    [[-55,0,55],[0,-8,70],[55,6,52],[-18,16,42],[32,14,47]].forEach(([dx,dy,r])=>{
      ctx.beginPath(); ctx.arc(cx+dx,cy+dy,r,0,Math.PI*2); ctx.fill();
    });
    // Lueur interne dans le nuage quand l'éclair est visible
    if(flashAlpha>0){
      const gl=ctx.createRadialGradient(cx,cy+20,5,cx,cy+20,60);
      gl.addColorStop(0,`rgba(255,240,120,${flashAlpha*0.5})`);
      gl.addColorStop(1,'rgba(255,200,80,0)');
      ctx.fillStyle=gl;
      ctx.beginPath(); ctx.arc(cx,cy+20,60,0,Math.PI*2); ctx.fill();
    }
    // Petit nuage décoratif gauche
    const cx2=W*0.18, cy2=H*0.28;
    const g2=ctx.createRadialGradient(cx2,cy2,3,cx2,cy2,40);
    g2.addColorStop(0,'rgba(50,60,90,0.65)'); g2.addColorStop(1,'rgba(20,25,50,0)');
    ctx.fillStyle=g2;
    [[-15,0,25],[8,-4,30],[22,4,20]].forEach(([dx,dy,r])=>{
      ctx.beginPath(); ctx.arc(cx2+dx,cy2+dy,r,0,Math.PI*2); ctx.fill();
    });
    ctx.restore();
  }

  function drawGround(W,H){
    // Bande sol
    const g=ctx.createLinearGradient(0,H*0.84,0,H);
    g.addColorStop(0,'#192616'); g.addColorStop(1,'#0d180a');
    ctx.fillStyle=g; ctx.fillRect(0,H*0.84,W,H*0.16);

    // --- Observateur (œil/bonhomme) à gauche ---
    const ox=W*0.10, oy=H*0.84;
    // Corps simple
    ctx.fillStyle='#c8a060';
    ctx.beginPath(); ctx.ellipse(ox,oy-28,5,10,0,0,Math.PI*2); ctx.fill(); // tronc
    ctx.beginPath(); ctx.arc(ox,oy-42,8,0,Math.PI*2); ctx.fill();          // tête
    // Bras pointant vers l'éclair
    ctx.strokeStyle='#c8a060'; ctx.lineWidth=3; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(ox+4,oy-30); ctx.lineTo(ox+22,oy-20); ctx.stroke();
    // Jambes
    ctx.beginPath(); ctx.moveTo(ox,oy-18); ctx.lineTo(ox-6,oy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox,oy-18); ctx.lineTo(ox+6,oy); ctx.stroke();
    // Label "Vous"
    ctx.font='bold 10px "Outfit",sans-serif';
    ctx.fillStyle='rgba(220,200,130,0.8)'; ctx.textAlign='center';
    ctx.fillText('👁 vous',ox,oy+12);

    // Flèche double indiquant la distance
    if(nuageSegs.length){
      const lx=nuageSegs[nuageSegs.length-1].x2;
      const ay=H*0.92;
      ctx.strokeStyle='rgba(200,180,100,0.5)'; ctx.lineWidth=1.5;
      ctx.setLineDash([4,4]);
      ctx.beginPath(); ctx.moveTo(ox+12,ay); ctx.lineTo(lx-6,ay); ctx.stroke();
      ctx.setLineDash([]);
      // pointes
      [[ox+12,-1],[lx-6,1]].forEach(([x,dir])=>{
        ctx.fillStyle='rgba(200,180,100,0.6)';
        ctx.beginPath();
        ctx.moveTo(x+dir*10,ay);
        ctx.lineTo(x,ay-4); ctx.lineTo(x,ay+4);
        ctx.closePath(); ctx.fill();
      });
      ctx.font='11px "DM Mono",monospace';
      ctx.fillStyle='rgba(220,200,120,0.75)'; ctx.textAlign='center';
      ctx.fillText(`d = ${(distM/1000).toFixed(1)} km`,(ox+lx)/2,ay-7);
    }
  }

  function drawHUD(W,H){
    // ── Zone en bas : chrono + état ──
    const panelH=44, panelY=H-panelH;
    ctx.fillStyle='rgba(0,0,0,0.45)';
    ctx.fillRect(0,panelY,W,panelH);

    if(phase==='idle'){
      ctx.font='bold 13px "Outfit",sans-serif';
      ctx.fillStyle='rgba(245,200,60,0.9)';
      ctx.textAlign='center';
      ctx.fillText('⚡ Appuyez sur le bouton pour déclencher l\'éclair',W/2,panelY+27);
      return;
    }

    const elapsed=(performance.now()-flashT)/1000;
    const tSon=(distM/V_SON);

    // Chronomètre (s'arrête quand le tonnerre arrive)
    const chrono = phase==='done' ? tSon : (phase==='thunder' ? tSon : elapsed);
    const chronoStr = chrono.toFixed(1)+' s';

    // Côté gauche : lumière
    ctx.font='bold 12px "DM Mono",monospace';
    ctx.fillStyle='#f5c842'; ctx.textAlign='left';
    ctx.fillText('⚡ Lumière : instantané ✓', 16, panelY+18);

    // Côté droit : son
    ctx.fillStyle= phase==='done' ? '#f0a040' : '#e07820';
    ctx.textAlign='right';
    if(phase==='done'){
      ctx.fillText(`🔊 Tonnerre : ${tSon.toFixed(1)} s`, W-16, panelY+18);
    } else {
      ctx.fillText(`🔊 Son en route… ${elapsed.toFixed(1)} s`, W-16, panelY+18);
    }

    // Barre de progression sonore (orange)
    const barX=16, barY=panelY+26, barW=W-32, barH=8;
    const prog=Math.min((phase==='done'?tSon:elapsed)/tSon,1);
    ctx.fillStyle='rgba(255,255,255,0.07)'; ctx.fillRect(barX,barY,barW,barH);
    const og=ctx.createLinearGradient(barX,0,barX+barW,0);
    og.addColorStop(0,'#c85a00'); og.addColorStop(1,'#f5a020');
    ctx.fillStyle=og; ctx.fillRect(barX,barY,barW*prog,barH);
    ctx.strokeStyle='rgba(240,140,30,0.35)'; ctx.lineWidth=1;
    ctx.strokeRect(barX,barY,barW,barH);

    // Message final
    if(phase==='done'){
      ctx.font='bold 14px "Outfit",sans-serif';
      ctx.fillStyle='rgba(255,220,100,0.97)';
      ctx.textAlign='center';
      ctx.fillText(`💡 Δt = d / v_son = ${distM} / 343 = ${tSon.toFixed(1)} s`, W/2, panelY-10);
    }
  }

  // ── Actions ──
  window.orageUpdateDist=function(){
    const inp=document.getElementById('orageDistInput');
    const lbl=document.getElementById('orageDistLabel');
    distM=parseInt(inp.value);
    lbl.textContent=(distM/1000).toFixed(1)+' km';
    if(phase==='idle'||phase==='done') orageReset();
  };

  window.orageDeclench=function(){
    if(phase==='flash'||phase==='counting') return;
    buildLightning();
    flashAlpha=1; bgPulse=0.9;
    phase='flash';
    flashT=performance.now();
    const tSonMs=(distM/V_SON)*1000;

    // Montrer le résultat pédagogique immédiatement
    const tSon=(distM/V_SON);
    document.getElementById('orageResultat').style.display='block';
    document.getElementById('orageResultText').innerHTML=
      `⚡ <strong>Lumière</strong> : perçue instantanément — Δt = ${distM} / (3×10⁸) ≈ <strong>${(distM/C_LUM*1e6).toFixed(2)} μs</strong> (négligeable)<br>`+
      `🔊 <strong>Tonnerre</strong> : Δt = d / v<sub>son</sub> = ${distM} m / 343 m·s⁻¹ = <strong>${tSon.toFixed(1)} s</strong><br>`+
      `📏 Règle pratique : compter les secondes entre éclair et tonnerre → <strong>1 s ≈ 340 m</strong>`;

    setTimeout(()=>{ phase='counting'; },150);

    setTimeout(()=>{
      phase='thunder';
      playThunder(distM/1000);
      setTimeout(()=>{ phase='done'; },1200);
    }, tSonMs);
  };

  window.orageReset=function(){
    phase='idle';
    flashAlpha=0; bgPulse=0;
    document.getElementById('orageResultat').style.display='none';
  };

  cv.addEventListener('click',()=>{ if(phase==='idle'||phase==='done') window.orageDeclench(); });

  resize();
  new ResizeObserver(resize).observe(cv.parentElement||cv);
  requestAnimationFrame(draw);

  if(!window.vitRelance) window.vitRelance=function(){};
  const _vc=document.getElementById('vitCanvas');
  if(_vc) _vc.style.display='none';

})();

/* ─── (ancien bloc vitCanvas supprimé) ─── */
(function(){
  const cv = document.getElementById('vitCanvas');
  if(!cv) return;
  const ctx = cv.getContext('2d');

  const ANIM_DUR_LUM = 200; // frames pour que la lumière traverse
  let frameLum = 0;
  let done = false;
  let rafId = null;

  window.vitRelance = function(){
    frameLum = 0;
    done = false;
    if(!rafId) rafId = requestAnimationFrame(draw); // relance la boucle si elle était arrêtée
  };

  function draw() {
    rafId = null;
    // Largeur : ne pas réécrire cv.width à chaque frame (remet le canvas à blanc + peut être 0)
    const W = cv.parentElement.clientWidth || 860;
    if(cv.width !== W) cv.width = W;
    const H = cv.height;

    ctx.clearRect(0,0,W,H);
    ctx.fillStyle = '#f8f9fb';
    ctx.fillRect(0,0,W,H);

    if(!done) frameLum++;
    if(frameLum >= ANIM_DUR_LUM) done = true;

    const progLum = Math.min(frameLum / ANIM_DUR_LUM, 1);
    // Le son : rapport vitesses = 3e8/343 ≈ 874 635 → son avance 874 635 fois moins vite
    const progSon = progLum / 874635;

    const startX = 70, endX = W - 60;
    const trackW = endX - startX;
    const rowLum = H * 0.32, rowSon = H * 0.70;

    // ─ Emojis Terre / Lune ─
    ctx.font = '20px serif';
    ctx.textAlign = 'center';
    ctx.fillText('🌍', startX - 24, rowLum + 7);
    ctx.fillText('🌕', endX + 22,   rowLum + 7);
    ctx.fillText('🌍', startX - 24, rowSon  + 7);
    ctx.fillText('🌕', endX + 22,   rowSon  + 7);

    // ─ Piste lumière ─
    ctx.fillStyle = '#fffbe0';
    ctx.fillRect(startX, rowLum - 10, trackW, 20);
    ctx.strokeStyle = '#e0c800'; ctx.lineWidth = 1;
    ctx.strokeRect(startX, rowLum - 10, trackW, 20);

    const lumX = startX + trackW * progLum;

    // Trait parcouru
    ctx.strokeStyle = '#f5c842'; ctx.lineWidth = 2.5;
    ctx.setLineDash([10, 5]);
    ctx.beginPath(); ctx.moveTo(startX, rowLum); ctx.lineTo(lumX, rowLum); ctx.stroke();
    ctx.setLineDash([]);

    // Front lumineux (seulement si lumX a une taille valide)
    if(lumX > startX + 2){
      const lumGrad = ctx.createRadialGradient(lumX, rowLum, 0, lumX, rowLum, 13);
      lumGrad.addColorStop(0,   '#ffffff');
      lumGrad.addColorStop(0.4, '#f5c842');
      lumGrad.addColorStop(1,   'rgba(245,200,66,0)');
      ctx.beginPath(); ctx.arc(lumX, rowLum, 13, 0, Math.PI*2);
      ctx.fillStyle = lumGrad; ctx.fill();
    }

    // Labels lumière
    ctx.font = 'bold 12px "DM Mono", monospace';
    ctx.fillStyle = '#8a6800'; ctx.textAlign = 'left';
    ctx.fillText('Lumière — c = 3,00 × 10⁸ m·s⁻¹', startX, rowLum - 16);
    if(done){
      ctx.fillStyle = '#1a6b5a';
      ctx.textAlign = 'right';
      ctx.fillText('⏱ arrivée en ≈ 1,28 s', endX, rowLum - 16);
    } else {
      const tLum = (progLum * 1.28).toFixed(2);
      ctx.fillStyle = '#999'; ctx.textAlign = 'left';
      ctx.fillText('t = ' + tLum + ' s', Math.min(lumX + 6, W - 80), rowLum - 16);
    }

    // ─ Piste son ─
    ctx.fillStyle = '#e8f4f8';
    ctx.fillRect(startX, rowSon - 10, trackW, 20);
    ctx.strokeStyle = '#88bbcc'; ctx.lineWidth = 1;
    ctx.strokeRect(startX, rowSon - 10, trackW, 20);

    const sonPx = startX + trackW * progSon;
    // Trait son (infime mais visible au départ)
    ctx.strokeStyle = '#4499bb'; ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.beginPath(); ctx.moveTo(startX, rowSon); ctx.lineTo(Math.max(sonPx, startX + 1), rowSon); ctx.stroke();
    ctx.setLineDash([]);
    // Point sonore
    ctx.beginPath(); ctx.arc(startX + 3, rowSon, 5, 0, Math.PI*2);
    ctx.fillStyle = '#4499bb'; ctx.fill();

    ctx.font = 'bold 12px "DM Mono", monospace';
    ctx.fillStyle = '#336688'; ctx.textAlign = 'left';
    ctx.fillText('Son — v = 343 m·s⁻¹', startX, rowSon - 16);
    ctx.fillStyle = '#cc4400'; ctx.textAlign = 'right';
    ctx.fillText('→ mettrait ≈ 13 jours !', endX, rowSon - 16);

    // Message final
    if(done){
      ctx.font = 'bold 13px "Outfit", sans-serif';
      ctx.fillStyle = '#1a6b5a'; ctx.textAlign = 'center';
      ctx.fillText('La lumière est environ 875 000 fois plus rapide que le son.', W/2, H - 12);
    }

    if(!done) rafId = requestAnimationFrame(draw);
  }

  // Démarrage différé pour que le DOM soit rendu et parentElement.clientWidth valide
  setTimeout(function(){ rafId = requestAnimationFrame(draw); }, 200);
})();

/* ─── Canvas Snell-Descartes interactif ─── */
(function(){
  const cv = document.getElementById('snellCanvas');
  if(!cv) return;
  const ctx = cv.getContext('2d');

  const slI1 = document.getElementById('snell-i1');
  const slN1 = document.getElementById('snell-n1');
  const slN2 = document.getElementById('snell-n2');
  const lblI1 = document.getElementById('snell-i1-val');
  const lblN1 = document.getElementById('snell-n1-val');
  const lblN2 = document.getElementById('snell-n2-val');
  const checkDiv = document.getElementById('snell-check');

  function getMilieu(n) {
    n = parseFloat(n);
    if(n < 1.05) return 'air';
    if(n < 1.15) return 'gaz';
    if(n < 1.40) return 'eau (~1,33)';
    if(n < 1.55) return 'verre (crown)';
    if(n < 1.70) return 'verre (flint)';
    if(n < 1.90) return 'saphir (~1,77)';
    return 'diamant (~2,42)';
  }

  function drawArrow(x1, y1, x2, y2, color) {
    const a = Math.atan2(y2-y1, x2-x1);
    const al = 9;
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x2 - Math.cos(a-0.4)*al, y2 - Math.sin(a-0.4)*al);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x2 - Math.cos(a+0.4)*al, y2 - Math.sin(a+0.4)*al);
    ctx.stroke();
  }

  function redraw() {
    const W = cv.parentElement.clientWidth || 860;
    if(cv.width !== W) cv.width = W;
    const H = cv.height;
    const i1deg = parseInt(slI1.value);
    const n1 = parseFloat(slN1.value);
    const n2 = parseFloat(slN2.value);

    lblI1.textContent = i1deg + '°';
    lblN1.textContent = n1.toFixed(2).replace('.',',');
    lblN2.textContent = n2.toFixed(2).replace('.',',');

    ctx.clearRect(0,0,W,H);

    const midY = H / 2;
    const midX = W / 2;
    const len = Math.min(midY - 20, midX - 60, 120);

    // Fond milieu 1 (haut)
    ctx.fillStyle = '#f0f8ff';
    ctx.fillRect(0, 0, W, midY);
    // Fond milieu 2 (bas)
    ctx.fillStyle = '#e8f5f0';
    ctx.fillRect(0, midY, W, H - midY);

    // Dioptre
    ctx.strokeStyle = 'rgba(26,107,90,0.5)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6,4]);
    ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(W, midY); ctx.stroke();
    ctx.setLineDash([]);

    // Labels milieux
    ctx.font = 'italic 12px "DM Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(20,80,60,0.6)';
    ctx.fillText('Milieu 1 — n₁ = ' + n1.toFixed(2).replace('.',',') + '  (' + getMilieu(n1) + ')', 14, midY - 14);
    ctx.fillText('Milieu 2 — n₂ = ' + n2.toFixed(2).replace('.',',') + '  (' + getMilieu(n2) + ')', 14, midY + 26);

    // Normale
    ctx.strokeStyle = 'rgba(120,120,120,0.35)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4,5]);
    ctx.beginPath(); ctx.moveTo(midX, midY - len - 10); ctx.lineTo(midX, midY + len + 10); ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = '10px "DM Mono"'; ctx.fillStyle = 'rgba(100,100,100,0.5)';
    ctx.textAlign = 'center';
    ctx.fillText('normale', midX, midY - len - 14);

    const i1 = i1deg * Math.PI / 180;
    const sinI2 = n1 * Math.sin(i1) / n2;
    const reflexionTotale = sinI2 > 1;
    const i2 = reflexionTotale ? null : Math.asin(sinI2);

    // ── Rayon incident ──
    const incX = midX - Math.sin(i1)*len;
    const incY = midY - Math.cos(i1)*len;
    ctx.strokeStyle = '#1a6b5a'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(incX, incY); ctx.lineTo(midX, midY); ctx.stroke();
    drawArrow(incX + (midX-incX)*0.5, incY + (midY-incY)*0.5, midX, midY, '#1a6b5a');

    // ── Rayon réfléchi ──
    const refX = midX + Math.sin(i1)*len;
    const refY = midY - Math.cos(i1)*len;
    ctx.strokeStyle = 'rgba(184,92,0,0.8)'; ctx.lineWidth = 2;
    ctx.setLineDash([6,4]);
    ctx.beginPath(); ctx.moveTo(midX, midY); ctx.lineTo(refX, refY); ctx.stroke();
    ctx.setLineDash([]);
    drawArrow(midX + (refX-midX)*0.45, midY + (refY-midY)*0.45, refX, refY, 'rgba(184,92,0,0.8)');

    // ── Rayon réfracté ou RT ──
    if(!reflexionTotale) {
      const ref2X = midX + Math.sin(i2)*len;
      const ref2Y = midY + Math.cos(i2)*len;
      ctx.strokeStyle = '#3a4db5'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(midX, midY); ctx.lineTo(ref2X, ref2Y); ctx.stroke();
      drawArrow(midX + (ref2X-midX)*0.45, midY + (ref2Y-midY)*0.45, ref2X, ref2Y, '#3a4db5');

      // ── Cônes grisés pour les angles ──
      // Dessin par remplissage de triangle entre : point d'incidence, bout de normale, bout du rayon
      // Cône i1 : triangle (midX,midY) → bout normale haut → bout rayon incident (direction source)
      // Cône i2 : triangle (midX,midY) → bout normale bas  → bout rayon réfracté

      const coneR = 55;

      // Points extremités dans chaque direction
      const normHautX = midX;
      const normHautY = midY - coneR;
      const normBasX  = midX;
      const normBasY  = midY + coneR;
      // Direction du rayon incident : de midX,midY vers incX,incY (remonte vers la source)
      const dIncX = incX - midX, dIncY = incY - midY;
      const dIncLen = Math.sqrt(dIncX*dIncX + dIncY*dIncY);
      const incEndX = midX + (dIncX/dIncLen)*coneR;
      const incEndY = midY + (dIncY/dIncLen)*coneR;
      // Direction du rayon réfracté : de midX,midY vers ref2X,ref2Y
      const dRef2X = ref2X - midX, dRef2Y = ref2Y - midY;
      const dRef2Len = Math.sqrt(dRef2X*dRef2X + dRef2Y*dRef2Y);
      const ref2EndX = midX + (dRef2X/dRef2Len)*coneR;
      const ref2EndY = midY + (dRef2Y/dRef2Len)*coneR;

      // Cône i1 (vert) : entre normale↑ et rayon incident (tous deux dans le milieu 1, haut)
      if(i1 > 0.01) {
        ctx.beginPath();
        ctx.moveTo(midX, midY);
        ctx.lineTo(normHautX, normHautY);
        ctx.lineTo(incEndX, incEndY);
        ctx.closePath();
        ctx.fillStyle = 'rgba(26,107,90,0.18)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(26,107,90,0.5)'; ctx.lineWidth = 1;
        ctx.stroke();
        // Label au centre du triangle
        ctx.font = 'bold 12px "DM Mono", monospace';
        ctx.fillStyle = '#1a6b5a'; ctx.textAlign = 'center';
        const lx1 = midX + (coneR+20)*Math.cos(-Math.PI/2 - i1/2);
        const ly1 = midY + (coneR+20)*Math.sin(-Math.PI/2 - i1/2);
        ctx.fillText('i₁ = '+i1deg+'°', lx1, ly1);
      }

      // Cône i2 (bleu) : entre normale↓ et rayon réfracté (tous deux dans le milieu 2, bas)
      if(i2 > 0.01) {
        const i2deg = (i2 * 180 / Math.PI).toFixed(1);
        ctx.beginPath();
        ctx.moveTo(midX, midY);
        ctx.lineTo(normBasX, normBasY);
        ctx.lineTo(ref2EndX, ref2EndY);
        ctx.closePath();
        ctx.fillStyle = 'rgba(58,77,181,0.18)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(58,77,181,0.5)'; ctx.lineWidth = 1;
        ctx.stroke();
        // Label
        ctx.font = 'bold 12px "DM Mono", monospace';
        ctx.fillStyle = '#3a4db5'; ctx.textAlign = 'center';
        const lx2 = midX + (coneR+20)*Math.cos(Math.PI/2 + i2/2);
        const ly2 = midY + (coneR+20)*Math.sin(Math.PI/2 + i2/2);
        ctx.fillText('i₂ = '+i2deg+'°', lx2, ly2);
      }

      // Légendes rayons
      ctx.font = '11px "DM Mono"'; ctx.textAlign = 'right';
      ctx.fillStyle = '#1a6b5a';
      ctx.fillText('rayon incident', incX - 4, incY + 12);
      ctx.fillStyle = '#3a4db5'; ctx.textAlign = 'left';
      ctx.fillText('rayon réfracté', ref2X + 6, ref2Y - 6);
      ctx.fillStyle = 'rgba(184,92,0,0.85)'; ctx.textAlign = 'left';
      ctx.fillText('rayon réfléchi', refX + 6, refY + 12);

      // Vérification numérique
      const n1s1 = (n1 * Math.sin(i1)).toFixed(3);
      const n2s2 = (n2 * Math.sin(i2)).toFixed(3);
      checkDiv.innerHTML =
        '<span style="color:#1a6b5a;font-weight:600;">n₁ · sin i₁ = ' + n1.toFixed(2).replace('.',',') + ' × sin(' + i1deg + '°) = <strong>' + n1s1 + '</strong></span>' +
        '<span style="color:#888;font-size:1.1em;">≈</span>' +
        '<span style="color:#3a4db5;font-weight:600;">n₂ · sin i₂ = ' + n2.toFixed(2).replace('.',',') + ' × sin(' + (i2*180/Math.PI).toFixed(1) + '°) = <strong>' + n2s2 + '</strong></span>' +
        '<span style="margin-left:auto;background:#e8f5f0;border-radius:6px;padding:3px 10px;color:#1a6b5a;font-size:0.78rem;">✓ loi vérifiée</span>';

    } else {
      // Réflexion totale
      ctx.font = 'bold 13px "DM Mono"';
      ctx.fillStyle = '#c0392b'; ctx.textAlign = 'center';
      ctx.fillText('⚠ Réflexion totale interne — aucun rayon réfracté', midX, midY + 30);
      ctx.font = '11px "DM Mono"'; ctx.fillStyle = 'rgba(180,50,30,0.7)';
      ctx.fillText('(n₁ sin i₁ > n₂  →  sin i₂ > 1, impossible)', midX, midY + 48);

      // Angle limite
      const ilim = (Math.asin(n2/n1) * 180/Math.PI).toFixed(1);
      checkDiv.innerHTML =
        '<span style="color:#c0392b;font-weight:600;">Réflexion totale interne</span>' +
        '<span style="color:#888;">·</span>' +
        '<span>Angle limite : i<sub>lim</sub> = arcsin(n₂/n₁) = arcsin(' + (n2/n1).toFixed(3) + ') = <strong>' + ilim + '°</strong></span>' +
        '<span style="margin-left:auto;background:#fdecea;border-radius:6px;padding:3px 10px;color:#c0392b;font-size:0.78rem;">pas de rayon réfracté</span>';
    }
    ctx.textAlign = 'left';
  }

  slI1.addEventListener('input', redraw);
  slN1.addEventListener('input', redraw);
  slN2.addEventListener('input', redraw);
  window.addEventListener('resize', redraw);
  redraw();
})();

/* ─── Illustration Loi 2 — Réflexion interactive (canvas, calqué sur loi 3) ─── */
(function(){
  const cv=document.getElementById('loi2Canvas');
  if(!cv) return;
  const ctx=cv.getContext('2d');
  const sl=document.getElementById('loi2-i1');
  const lbl=document.getElementById('loi2-i1-val');
  if(!sl||!lbl) return;

  function drawArrow(x1,y1,x2,y2,color){
    const a=Math.atan2(y2-y1,x2-x1),al=11;
    ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=2;
    ctx.beginPath();
    ctx.moveTo(x2-al*Math.cos(a-0.38),y2-al*Math.sin(a-0.38));
    ctx.lineTo(x2,y2);
    ctx.lineTo(x2-al*Math.cos(a+0.38),y2-al*Math.sin(a+0.38));
    ctx.stroke();
  }

  function redraw(){
    const W=cv.parentElement.clientWidth||600;
    if(cv.width!==W) cv.width=W;
    const H=cv.height;
    const i1deg=parseInt(sl.value);
    lbl.textContent=i1deg+'°';

    ctx.clearRect(0,0,W,H);

    const midY=Math.round(H*0.58), midX=W/2;
    const len=Math.min(midY-30,midX-70,110);

    // Fond milieu 1 (vert pâle, haut) — réflexion reste dans milieu 1
    ctx.fillStyle='#edf7f2'; ctx.fillRect(0,0,W,midY);
    // Fond milieu 2 (gris très pâle, bas — juste pour montrer qu'il n'y a pas de rayon ici)
    ctx.fillStyle='#f4f4f4'; ctx.fillRect(0,midY,W,H-midY);

    // Dioptre
    ctx.strokeStyle='rgba(26,107,90,0.5)'; ctx.lineWidth=1.8;
    ctx.setLineDash([6,4]);
    ctx.beginPath();ctx.moveTo(0,midY);ctx.lineTo(W,midY);ctx.stroke();
    ctx.setLineDash([]);

    // Labels milieux
    ctx.font='italic 12px "DM Mono",monospace'; ctx.textAlign='left';
    ctx.fillStyle='rgba(20,80,60,0.6)';
    ctx.fillText('Milieu 1  (réflexion dans ce milieu)',14,midY-14);
    ctx.fillStyle='rgba(120,120,120,0.5)';
    ctx.fillText('Milieu 2',14,midY+26);

    // Normale (pointillée, toute la hauteur)
    ctx.strokeStyle='rgba(100,110,180,0.4)'; ctx.lineWidth=1.2; ctx.setLineDash([5,5]);
    ctx.beginPath();ctx.moveTo(midX,midY-len-15);ctx.lineTo(midX,midY+len/2);ctx.stroke();
    ctx.setLineDash([]);
    // Flèche de la normale vers le haut
    ctx.fillStyle='#7788bb';
    ctx.beginPath();ctx.moveTo(midX,midY-len-15);ctx.lineTo(midX-5,midY-len);ctx.lineTo(midX+5,midY-len);ctx.closePath();ctx.fill();
    ctx.font='11px "DM Mono",monospace';ctx.fillStyle='#5566aa';ctx.textAlign='center';
    ctx.fillText('normale',midX,midY-len-18);

    const i1=i1deg*Math.PI/180;

    // Coordonnées des rayons
    // Rayon incident : vient de haut-gauche → I (flèche pointant vers midX,midY)
    const incX=midX-Math.sin(i1)*len;
    const incY=midY-Math.cos(i1)*len;
    // Rayon réfléchi : part de I vers haut-droite (flèche pointant vers refX,refY)
    const refX=midX+Math.sin(i1)*len;
    const refY=midY-Math.cos(i1)*len;

    // Cônes grisés (triangles)
    const coneR=52;
    const normHautX=midX, normHautY=midY-coneR;
    // Direction rayon incident depuis I (vers la source)
    const dIncLen=Math.sqrt((incX-midX)**2+(incY-midY)**2);
    const incEndX=midX+(incX-midX)/dIncLen*coneR;
    const incEndY=midY+(incY-midY)/dIncLen*coneR;
    // Direction rayon réfléchi depuis I
    const dRefLen=Math.sqrt((refX-midX)**2+(refY-midY)**2);
    const refEndX=midX+(refX-midX)/dRefLen*coneR;
    const refEndY=midY+(refY-midY)/dRefLen*coneR;

    if(i1>0.01){
      // Cône i1 (vert) entre normale↑ et direction source
      ctx.beginPath();ctx.moveTo(midX,midY);ctx.lineTo(normHautX,normHautY);ctx.lineTo(incEndX,incEndY);ctx.closePath();
      ctx.fillStyle='rgba(26,107,90,0.15)';ctx.fill();
      ctx.strokeStyle='rgba(26,107,90,0.4)';ctx.lineWidth=1;ctx.stroke();
      // Label i1
      const lx1=midX+(coneR+20)*Math.cos(-Math.PI/2-i1/2);
      const ly1=midY+(coneR+20)*Math.sin(-Math.PI/2-i1/2);
      ctx.font='bold 13px "DM Mono",monospace';ctx.fillStyle='#1a6b5a';ctx.textAlign='center';
      ctx.fillText('i₁ = '+i1deg+'°',lx1,ly1);

      // Cône ir (orange) entre normale↑ et rayon réfléchi (symétrique)
      ctx.beginPath();ctx.moveTo(midX,midY);ctx.lineTo(normHautX,normHautY);ctx.lineTo(refEndX,refEndY);ctx.closePath();
      ctx.fillStyle='rgba(184,92,0,0.15)';ctx.fill();
      ctx.strokeStyle='rgba(184,92,0,0.4)';ctx.lineWidth=1;ctx.stroke();
      // Label ir
      const lx2=midX+(coneR+20)*Math.cos(-Math.PI/2+i1/2);
      const ly2=midY+(coneR+20)*Math.sin(-Math.PI/2+i1/2);
      ctx.font='bold 13px "DM Mono",monospace';ctx.fillStyle='#b85c00';ctx.textAlign='center';
      ctx.fillText('iᵣ = '+i1deg+'°',lx2,ly2);
    }

    // Rayon incident : flèche à 70% du trajet (vers I)
    ctx.strokeStyle='#1a6b5a';ctx.lineWidth=2.5;
    ctx.beginPath();ctx.moveTo(incX,incY);ctx.lineTo(midX,midY);ctx.stroke();
    drawArrow(incX,incY, incX+(midX-incX)*0.7, incY+(midY-incY)*0.7, '#1a6b5a');
    ctx.font='11px "DM Mono",monospace';ctx.fillStyle='#1a6b5a';ctx.textAlign='right';
    ctx.fillText('rayon incident',incX-6,incY+12);

    // Rayon réfléchi : flèche à 70% depuis I
    ctx.strokeStyle='#b85c00';ctx.lineWidth=2.5;
    ctx.beginPath();ctx.moveTo(midX,midY);ctx.lineTo(refX,refY);ctx.stroke();
    drawArrow(midX,midY, midX+(refX-midX)*0.7, midY+(refY-midY)*0.7, '#b85c00');
    ctx.font='11px "DM Mono",monospace';ctx.fillStyle='#b85c00';ctx.textAlign='left';
    ctx.fillText('rayon réfléchi',refX+6,refY+12);

    // Point I
    ctx.beginPath();ctx.arc(midX,midY,5,0,Math.PI*2);
    ctx.fillStyle='#b85c00';ctx.fill();ctx.strokeStyle='white';ctx.lineWidth=1.5;ctx.stroke();
    ctx.font='bold 12px "DM Mono",monospace';ctx.fillStyle='#b85c00';ctx.textAlign='left';
    ctx.fillText('I',midX+7,midY-4);

    // Formule en bas
    ctx.font='bold 14px "DM Mono",monospace';ctx.fillStyle='#b85c00';ctx.textAlign='center';
    ctx.fillText('i₁ = iᵣ  (' +i1deg+'° = '+i1deg+'°)',midX,H-16);

    ctx.textAlign='left';
  }

  sl.addEventListener('input',redraw);
  window.addEventListener('resize',redraw);
  document.querySelectorAll('.tab-btn').forEach(btn=>btn.addEventListener('click',()=>setTimeout(redraw,50)));
  setTimeout(redraw,120);
})();



/* ─── Lentille interactive Partie 4 ─── */
(function(){
  var p4Rays = {1:false, 2:false, 3:false};

  var P4_INFOS = {
    1: "<b>Rayon R₁ (bleu) — par le centre optique O :</b> Tout rayon passant par le centre optique O <b>n'est pas dévié</b> : il poursuit sa trajectoire en ligne droite. On trace ce rayon de B vers O, puis on le prolonge sans changer de direction jusqu'en B'.",
    2: "<b>Rayon R₂ (rouge) — par le foyer objet F :</b> Tout rayon incident qui passe par le foyer objet F <b>ressort de la lentille parallèlement à l'axe optique</b>. On trace ce rayon de B vers F, on prolonge jusqu'à la lentille, puis il repart horizontalement vers la droite.",
    3: "<b>Rayon R₃ (vert) — parallèle à l'axe optique :</b> Tout rayon incident parallèle à l'axe optique <b>passe par le foyer image F' après la lentille</b>. C'est la définition même de F'. On trace ce rayon horizontalement de B jusqu'à la lentille, puis il est dévié vers F'."
  };

  window.p4ToggleRay = function(n){
    p4Rays[n] = !p4Rays[n];
    document.getElementById('p4btn'+n).classList.toggle('on', p4Rays[n]);
    document.getElementById('p4btnAll').classList.remove('on');
    if(p4Rays[n]){
      document.getElementById('p4slbl').textContent = 'Rayon R'+n+' affiché';
      document.getElementById('p4inf').innerHTML = P4_INFOS[n];
    } else {
      var any = p4Rays[1]||p4Rays[2]||p4Rays[3];
      if(!any){ document.getElementById('p4slbl').textContent='Choisissez un rayon ou cliquez sur ▶ Tout afficher'; document.getElementById('p4inf').innerHTML='Sélectionnez un rayon pour afficher sa description.'; }
    }
    p4Draw();
  };

  window.p4LaunchAll = function(){
    p4Rays = {1:true,2:true,3:true};
    [1,2,3].forEach(function(n){ document.getElementById('p4btn'+n).classList.add('on'); });
    document.getElementById('p4btnAll').classList.add('on');
    document.getElementById('p4slbl').textContent = 'Les 3 rayons caractéristiques sont affichés';
    document.getElementById('p4inf').innerHTML = "L'intersection des 3 rayons donne le point <b>B'</b>, extrémité de l'image. <b>A'</b> est le pied de la perpendiculaire depuis B' sur l'axe.";
    p4Draw();
  };

  window.p4ResetRays = function(){
    p4Rays = {1:false,2:false,3:false};
    [1,2,3].forEach(function(n){ document.getElementById('p4btn'+n).classList.remove('on'); });
    document.getElementById('p4btnAll').classList.remove('on');
    document.getElementById('p4slbl').textContent='Choisissez un rayon ou cliquez sur ▶ Tout afficher';
    document.getElementById('p4inf').innerHTML='Sélectionnez un rayon pour afficher sa description.';
    p4Draw();
  };

  window.p4Draw = function(){
    var cv = document.getElementById('lensCanvas');
    if(!cv) return;
    // Redimensionner si besoin
    var W2 = cv.parentElement.clientWidth || 860;
    if(cv.width !== W2) cv.width = W2;
    var ctx = cv.getContext('2d');
    var W = cv.width, H = cv.height;

    var fp = parseInt(document.getElementById('p4f').value);
    var oa = parseInt(document.getElementById('p4oa').value);
    document.getElementById('p4vf').textContent = fp;
    document.getElementById('p4voa').textContent = oa;

    // Calcul image — convention algébrique (OA négatif pour objet réel)
    // 1/OA' = 1/f' + 1/OA  avec OA < 0
    var oap = 1 / (1/fp + 1/oa);
    var gamma = oap / oa;

    // Affichage grandissement uniquement (relation de conjugaison hors programme Seconde)
    if(isFinite(gamma)){
      var signG = gamma < 0 ? '' : '+';
      var desc = gamma < 0 ? 'renversée' : 'droite';
      var size = Math.abs(gamma) > 1 ? 'agrandie' : (Math.abs(gamma) < 1 ? 'réduite' : 'même taille');
      var imgNat = oap > 0 ? 'réelle' : 'virtuelle';
      document.getElementById('p4gval').innerHTML =
        'γ = ' + signG + gamma.toFixed(2) +
        ' &nbsp;|&nbsp; image ' + imgNat + ', ' + size + ', ' + desc;
    }

    // Fond
    ctx.fillStyle = '#f8f7fc';
    ctx.fillRect(0,0,W,H);

    var ox = W/2, oy = H/2;
    // Échelle : f' = fp * scale pixels
    var scale = Math.min(W * 0.20 / fp, 1.8);
    var fpx = fp * scale;
    var oax = oa * scale;
    var oapx = oap * scale;

    // Axe optique
    ctx.strokeStyle = 'rgba(80,80,120,0.22)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0,oy); ctx.lineTo(W,oy); ctx.stroke();

    // Lentille convergente : ligne + flèches vers l'EXTÉRIEUR
    ctx.strokeStyle = 'rgba(58,77,181,0.85)';
    ctx.fillStyle   = 'rgba(58,77,181,0.85)';
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(ox, oy-105); ctx.lineTo(ox, oy+105); ctx.stroke();
    // Flèches vers l'extérieur : pointe EN HAUT pour la flèche du haut, EN BAS pour celle du bas
    function lArrow(x,y,dir){
      var d = dir==='up' ? -1 : 1; // d=-1 → pointe vers le haut
      ctx.beginPath();
      ctx.moveTo(x, y);           // pointe de la flèche
      ctx.lineTo(x-8, y-d*16);   // aile gauche (vers l'intérieur)
      ctx.lineTo(x+8, y-d*16);   // aile droite (vers l'intérieur)
      ctx.closePath(); ctx.fill();
    }
    lArrow(ox, oy-105, 'up');   // flèche du haut pointe VERS LE HAUT
    lArrow(ox, oy+105, 'down'); // flèche du bas pointe VERS LE BAS

    // Foyers
    var fobj = ox + oax/Math.abs(oax)*fpx*(-1);  // F à gauche
    fobj = ox - fpx;
    var fimg = ox + fpx;

    function cross(x,y,c){
      ctx.strokeStyle=c; ctx.lineWidth=2.5;
      ctx.beginPath(); ctx.moveTo(x-8,y); ctx.lineTo(x+8,y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x,y-8); ctx.lineTo(x,y+8); ctx.stroke();
    }
    cross(fobj, oy, 'rgba(180,0,0,0.7)');
    cross(fimg, oy, 'rgba(180,0,0,0.7)');
    ctx.fillStyle = 'rgba(180,0,0,0.9)';
    ctx.font = 'bold 13px "DM Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('F',  fobj, oy+22);
    ctx.fillText("F'", fimg, oy+22);
    ctx.fillStyle = 'rgba(58,77,181,0.9)';
    ctx.fillText('O', ox, oy+22);

    // Objet AB
    var ax2 = ox + oax;
    var objH = 58;
    ctx.strokeStyle = '#1a7a40';
    ctx.fillStyle   = '#1a7a40';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(ax2, oy); ctx.lineTo(ax2, oy-objH); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ax2-5,oy-objH+9); ctx.lineTo(ax2,oy-objH); ctx.lineTo(ax2+5,oy-objH+9); ctx.closePath(); ctx.fill();
    ctx.font = 'bold 12px "DM Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('A', ax2+4, oy+16);
    ctx.fillText('B', ax2+4, oy-objH-5);

    var bx = ax2, by = oy - objH;

    // Point image B' (pour arrêter les rayons dessus si image dans le canvas)
    var imgBx = ox + oapx;
    var imgBy = oy - objH * gamma;

    // ── Rayon R₁ : par O (non dévié) — de B à O puis jusqu'au bord ──
    if(p4Rays[1]){
      ctx.strokeStyle = '#1a7ad4';
      ctx.lineWidth = 2;
      var s1 = (oy - by)/(ox - bx);
      // Incident : B → O
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(ox, oy); ctx.stroke();
      arrowMid(ctx, bx, by, ox, oy, '#1a7ad4');
      // Émergent : O → bord droit (toujours jusqu'au bord, B' est un point de passage)
      var ey1 = oy + s1*(W - ox);
      ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(W, ey1); ctx.stroke();
      arrowMid(ctx, ox, oy, Math.min(ox + (W-ox)*0.55, W-10), oy + s1*((W-ox)*0.55), '#1a7ad4');
    }

    // ── Rayon R₂ : passe par F objet → sort parallèle à l'axe ──
    if(p4Rays[2]){
      ctx.strokeStyle = '#d42020';
      ctx.lineWidth = 2;
      // Pente de B vers F objet
      var s2 = (oy - by)/(fobj - bx);
      var yL2 = by + s2*(ox - bx);   // hauteur à la lentille
      // Incident : de B jusqu'à la lentille
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(ox, yL2); ctx.stroke();
      arrowMid(ctx, bx, by, ox, yL2, '#d42020');
      // Émergent : parallèle à l'axe
      ctx.beginPath(); ctx.moveTo(ox, yL2); ctx.lineTo(W, yL2); ctx.stroke();
      arrowMid(ctx, ox, yL2, W, yL2, '#d42020');
    }

    // ── Rayon R₃ : parallèle à l'axe → converge vers F' ──
    if(p4Rays[3]){
      ctx.strokeStyle = '#1a9a40';
      ctx.lineWidth = 2;
      // Incident : de B horizontalement jusqu'à la lentille
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(ox, by); ctx.stroke();
      arrowMid(ctx, bx, by, ox, by, '#1a9a40');
      // Émergent : de la lentille vers F' et au-delà jusqu'au bord (B' est un point de passage)
      var s3 = (oy - by)/(fimg - ox);
      var ey3 = by + s3*(W - ox);
      ctx.beginPath(); ctx.moveTo(ox, by); ctx.lineTo(W, ey3); ctx.stroke();
      var mx3 = ox + (W - ox)*0.45;
      arrowMid(ctx, ox, by, mx3, by + s3*(mx3-ox), '#1a9a40');
    }

    // ── Image A'B' ──
    if(isFinite(oap) && isFinite(gamma)){
      var imgX = ox + oapx;
      var imgH = objH * gamma;   // gamma<0 → image renversée (imgH<0 → oy-imgH > oy, vers le bas)
      var isVirt = oap < 0;
      ctx.strokeStyle = '#cc7700';
      ctx.fillStyle   = '#cc7700';
      ctx.lineWidth = isVirt ? 1.5 : 2;
      if(isVirt) ctx.setLineDash([5,4]);
      if(imgX > 5 && imgX < W-5){
        ctx.beginPath(); ctx.moveTo(imgX, oy); ctx.lineTo(imgX, oy-imgH); ctx.stroke();
        ctx.setLineDash([]);
        if(!isVirt && imgH !== 0){
          // imgH<0 → B' en dessous de l'axe (image renversée) → pointe vers le bas
          var d2 = imgH < 0 ? 1 : -1;
          ctx.beginPath(); ctx.moveTo(imgX-5, oy-imgH+d2*10); ctx.lineTo(imgX, oy-imgH); ctx.lineTo(imgX+5, oy-imgH+d2*10); ctx.closePath(); ctx.fill();
        }
        ctx.font = 'bold 12px "DM Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText("A'", imgX+4, oy+16);
        ctx.fillText("B'", imgX+4, oy-imgH+(imgH>0?-7:16));
        if(isVirt){ ctx.font='11px "DM Mono"'; ctx.fillText('(virtuelle)', imgX+4, oy-imgH+(imgH>0?-20:30)); }
      }
      ctx.setLineDash([]);
    }

    // Ré-écrire les étiquettes et les croix par-dessus les rayons
    cross(fobj, oy, 'rgba(180,0,0,0.85)');
    cross(fimg, oy, 'rgba(180,0,0,0.85)');
    ctx.fillStyle = 'rgba(180,0,0,0.9)';
    ctx.font = 'bold 13px "DM Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('F',  fobj, oy+22);
    ctx.fillText("F'", fimg, oy+22);
    ctx.fillStyle = 'rgba(58,77,181,0.9)';
    ctx.fillText('O', ox, oy+22);
  };

  function arrowMid(ctx, x1,y1, x2,y2, color){
    var mx=(x1+x2)/2, my=(y1+y2)/2;
    var a=Math.atan2(y2-y1,x2-x1), len=9;
    ctx.strokeStyle=color; ctx.fillStyle=color; ctx.lineWidth=1.5;
    ctx.beginPath();
    ctx.moveTo(mx-Math.cos(a-0.42)*len, my-Math.sin(a-0.42)*len);
    ctx.lineTo(mx, my);
    ctx.lineTo(mx-Math.cos(a+0.42)*len, my-Math.sin(a+0.42)*len);
    ctx.stroke();
  }

  // Dessin initial + resize
  setTimeout(function(){ p4Draw(); }, 100);
  window.addEventListener('resize', function(){ p4Draw(); });
})();

/* ─── Quiz ─── */
const questions = [
  {
    q: "Quelle est la valeur de la vitesse de la lumière dans le vide ?",
    opts: ["3,00 × 10⁶ m·s⁻¹", "3,00 × 10⁸ m·s⁻¹", "3,00 × 10¹⁰ m·s⁻¹", "300 m·s⁻¹"],
    ans: 1,
    expl: "c = 3,00 × 10⁸ m·s⁻¹ dans le vide. C'est la vitesse maximale possible."
  },
  {
    q: "L'indice de réfraction de l'eau est n = 1,33. Quelle est la vitesse de la lumière dans l'eau ?",
    opts: ["3,00 × 10⁸ m·s⁻¹", "4,00 × 10⁸ m·s⁻¹", "≈ 2,26 × 10⁸ m·s⁻¹", "1,33 × 10⁸ m·s⁻¹"],
    ans: 2,
    expl: "v = c/n = 3,00×10⁸ / 1,33 ≈ 2,26×10⁸ m·s⁻¹"
  },
  {
    q: "Un rayon passe de l'air (n=1) dans l'eau (n=1,33) avec i₁=30°. Quel est l'angle de réfraction i₂ ?",
    opts: ["30°", "≈ 22°", "≈ 41°", "90°"],
    ans: 1,
    expl: "sin i₂ = (n₁/n₂)×sin i₁ = (1/1,33)×0,5 ≈ 0,376 → i₂ ≈ 22°. Le rayon se rapproche de la normale en passant dans un milieu plus dense."
  },
  {
    q: "Quelle propriété est vraie pour un spectre de raies ?",
    opts: ["Il est produit par un corps chaud solide", "Il est continu sur toutes les longueurs d'onde", "Il est caractéristique du gaz émetteur", "Il ne peut pas être observé en laboratoire"],
    ans: 2,
    expl: "Un spectre de raies est la signature spectrale du gaz. Chaque gaz a ses propres raies caractéristiques."
  },
  {
    q: "Pour une lentille mince convergente, le rayon passant par le foyer objet F ressort de la lentille :",
    opts: ["En passant par le foyer image F'", "Parallèlement à l'axe optique", "Dévié vers le haut", "En sens inverse"],
    ans: 1,
    expl: "C'est le 3ème rayon caractéristique : tout rayon passant par F sort parallèlement à l'axe optique."
  },
  {
    q: "Dans le modèle réduit de l'œil, quel élément joue le rôle de la rétine ?",
    opts: ["La lentille convergente", "Le diaphragme", "L'écran", "Le foyer image"],
    ans: 2,
    expl: "L'écran situé dans le plan focal image joue le rôle de la rétine, sur laquelle se forme l'image."
  }
];

let current = 0, score = 0, answered = false;

function renderQuestion() {
  const q = questions[current];
  const pct = (current/questions.length*100).toFixed(0);
  document.getElementById('quizBar').style.width = pct+'%';
  document.getElementById('quizScore').textContent = current > 0 ? `Score : ${score}/${current}` : '';

  let html = `<div class="quiz-question">
    <div class="quiz-q-text"><strong>Q${current+1}/${questions.length}</strong> · ${q.q}</div>
    <div class="quiz-options">`;
  q.opts.forEach((opt,i) => {
    html += `<button class="quiz-opt" onclick="answer(${i})">${opt}</button>`;
  });
  html += `</div><div class="quiz-feedback" id="qfb"></div></div>`;
  document.getElementById('quizContent').innerHTML = html;
  document.getElementById('quizNext').disabled = true;
  answered = false;
}

function answer(i) {
  if(answered) return;
  answered = true;
  const q = questions[current];
  const opts = document.querySelectorAll('.quiz-opt');
  opts.forEach((o,j) => {
    o.disabled = true;
    if(j === q.ans) o.classList.add('correct');
    else if(j === i && i !== q.ans) o.classList.add('wrong');
  });
  const fb = document.getElementById('qfb');
  fb.style.display = 'block';
  if(i === q.ans) {
    score++;
    fb.textContent = '✓ Correct ! ' + q.expl;
    fb.style.color = '#90ffb0';
  } else {
    fb.textContent = '✗ ' + q.expl;
    fb.style.color = '#ffa0a0';
  }
  document.getElementById('quizNext').disabled = false;
}

document.getElementById('quizNext').addEventListener('click', () => {
  current++;
  if(current < questions.length) {
    renderQuestion();
  } else {
    document.getElementById('quizBar').style.width = '100%';
    document.getElementById('quizContent').innerHTML = `
      <div style="text-align:center; padding:20px 0">
        <div style="font-family:var(--ff-serif); font-size:2.5rem; color:#f5c842; margin-bottom:8px">${score} / ${questions.length}</div>
        <div style="color:rgba(255,255,255,0.6); font-size:0.9rem">${score===questions.length ? '🎉 Parfait ! Toutes les réponses sont correctes.' : score >= questions.length/2 ? '👍 Bien joué ! Quelques points à revoir.' : '📖 Relisez le cours et retentez le quiz.'}</div>
        <button class="quiz-btn" style="margin-top:20px" onclick="current=0;score=0;renderQuestion()">Recommencer</button>
      </div>`;
    document.getElementById('quizNext').disabled = true;
    document.getElementById('quizScore').textContent = '';
  }
});

renderQuestion();
/* ════════════════════════════════════════════
   PRISME — Animation dynamique v3
   • Snell-Descartes vectoriel exact
   • Indice de Cauchy n(λ)
   • Angle sommet réglable 30–80°
   • Angle incidence réglable 15–70°
   • Mode poly (6 rayons) / mono (couleur choisie)
   • Rayons animés (dash offset)
   • Écran avec taches et spectre
   • Normales + angles affichés en mode mono
════════════════════════════════════════════ */
window.P = (function() {
  const cv  = document.getElementById('prismeCanvas');
  if (!cv) return {};
  const ctx = cv.getContext('2d');

  /* ── Données spectrales ── */
  const RAYS = [
    { nm:410, hex:'#8800ee', css:'rgba(136,0,238,', label:'Violet' },
    { nm:460, hex:'#2255ff', css:'rgba(34,85,255,',  label:'Bleu'   },
    { nm:530, hex:'#00bb44', css:'rgba(0,187,68,',   label:'Vert'   },
    { nm:580, hex:'#cccc00', css:'rgba(204,204,0,',  label:'Jaune'  },
    { nm:610, hex:'#ff6600', css:'rgba(255,102,0,',  label:'Orange' },
    { nm:660, hex:'#dd0000', css:'rgba(221,0,0,',    label:'Rouge'  },
  ];

  // Indice de Cauchy (verre crown)
  function nLambda(nm) { return 1.500 + 5200/(nm*nm); }

  /* ── État ── */
  let mode       = 'poly';
  let monoIdx    = 2;          // Vert par défaut
  let prismDeg   = 60;         // angle sommet A
  let incDeg     = 40;         // angle incidence i1
  let dashOffset = 0;          // animation des tirets
  let raf = null, active = false;

  /* ── Géométrie ── */
  function getPrism(W, H) {
    const A_rad = (prismDeg / 2) * Math.PI / 180;
    const cx = W * 0.40, cy = H * 0.50;
    const halfH = H * 0.30;
    const halfBase = halfH * Math.tan(A_rad);
    return {
      A: { x: cx,           y: cy - halfH },
      B: { x: cx - halfBase, y: cy + halfH },
      C: { x: cx + halfBase, y: cy + halfH },
    };
  }

  // Normale unitaire extérieure d'une face (p1→p2), side = côté "extérieur" attendu
  function extNormal(p1, p2, hint) {
    const dx = p2.x-p1.x, dy = p2.y-p1.y, l = Math.hypot(dx,dy);
    let nx = -dy/l, ny = dx/l;
    if (nx*hint.x + ny*hint.y < 0) { nx=-nx; ny=-ny; }
    return {x:nx, y:ny};
  }

  // Intersection rayon (ox,oy)+(t*dx,t*dy) avec segment p1→p2
  function hitSeg(ox,oy,dx,dy,p1,p2) {
    const ex=p2.x-p1.x, ey=p2.y-p1.y;
    const d = dx*ey - dy*ex;
    if (Math.abs(d)<1e-9) return null;
    const t = ((p1.x-ox)*ey-(p1.y-oy)*ex)/d;
    const u = ((p1.x-ox)*dy-(p1.y-oy)*dx)/d;
    if (t<1e-6||u<-1e-6||u>1+1e-6) return null;
    return {t, x:ox+t*dx, y:oy+t*dy};
  }

  // Réfraction vectorielle de Snell (retourne null si réflexion totale interne)
  function refract(d, n_hat, n1, n2) {
    // d = direction incidente (normalisée, sens de propagation)
    // n_hat = normale côté entrée (opposée au rayon : pointe vers la source)
    const cosI = -(d.x*n_hat.x + d.y*n_hat.y);
    const sinI2 = 1 - cosI*cosI;
    const sinT2 = (n1/n2)*(n1/n2)*sinI2;
    if (sinT2 > 1) return null; // réflexion totale
    const cosT = Math.sqrt(1-sinT2);
    const r = n1/n2;
    return {
      x: r*d.x + (r*cosI - cosT)*(-n_hat.x),
      y: r*d.y + (r*cosI - cosT)*(-n_hat.y),
      thetaI: Math.acos(Math.min(1,cosI))*180/Math.PI,
      thetaT: Math.acos(Math.min(1,cosT))*180/Math.PI,
    };
  }

  /* ── Tracé d'un rayon pour λ donné ── */
  function traceOne(W, H, nm) {
    const n = nLambda(nm);
    const { A, B, C } = getPrism(W, H);

    // Normale extérieure face AB (source à gauche)
    const nAB = extNormal(A, B, {x:-1,y:0});
    // Normale extérieure face AC (sortie à droite)
    const nAC = extNormal(A, C, {x:1,y:0});

    // Point d'entrée sur AB (55% depuis A)
    const t0 = 0.52;
    const entry = { x: A.x+(B.x-A.x)*t0, y: A.y+(B.y-A.y)*t0 };

    // Direction incidente : angle incDeg par rapport à la normale AB (vers l'intérieur)
    const a = incDeg * Math.PI / 180;
    // Normale intérieure AB = -nAB
    const nIn = {x:-nAB.x, y:-nAB.y};
    // Perpendiculaire à nIn dans le plan (sens vers le bas du prisme)
    const tang = {x:-nIn.y, y:nIn.x};
    const dirInc = {
      x: nIn.x*Math.cos(a) + tang.x*Math.sin(a),
      y: nIn.y*Math.cos(a) + tang.y*Math.sin(a),
    };
    const liInc = Math.hypot(dirInc.x,dirInc.y);
    dirInc.x/=liInc; dirInc.y/=liInc;

    // Source : en arrière du point d'entrée
    const dist = W*0.28;
    const src = { x: entry.x-dirInc.x*dist, y: entry.y-dirInc.y*dist };

    // Réfraction entrée (air→verre)
    const r1 = refract(dirInc, nAB, 1.0, n);
    if (!r1) return null;
    const l1 = Math.hypot(r1.x,r1.y);
    const dirIn = {x:r1.x/l1, y:r1.y/l1};

    // Intersection avec face AC
    const hit2 = hitSeg(entry.x,entry.y,dirIn.x,dirIn.y,A,C);
    if (!hit2) return null;
    const exit = {x:hit2.x, y:hit2.y};

    // Réfraction sortie (verre→air)
    const r2 = refract(dirIn, nAC, n, 1.0);
    if (!r2) return null;
    const l2 = Math.hypot(r2.x,r2.y);
    const dirOut = {x:r2.x/l2, y:r2.y/l2};

    return {
      src, entry, exit, dirInc, dirIn, dirOut,
      nAB, nAC,
      i1: r1.thetaI.toFixed(1), r1: r1.thetaT.toFixed(1),
      i2: r2.thetaI.toFixed(1), r2: r2.thetaT.toFixed(1),
    };
  }

  /* ── Dessin ── */
  function draw() {
    const W = cv.width, H = cv.height;
    ctx.clearRect(0,0,W,H);

    // Fond légèrement teinté
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0,0,W,H);

    const { A, B, C } = getPrism(W, H);
    const scX = W * 0.92;      // x de l'écran

    /* ─── ÉCRAN ─── */
    // Trait épais
    ctx.save();
    ctx.strokeStyle = '#8888a0';
    ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(scX, H*0.04); ctx.lineTo(scX, H*0.96); ctx.stroke();
    // Hachures
    ctx.lineWidth = 1;
    for (let y=H*0.05; y<H*0.95; y+=9) {
      ctx.strokeStyle = 'rgba(120,120,150,0.15)';
      ctx.beginPath(); ctx.moveTo(scX,y); ctx.lineTo(scX+8,y+6); ctx.stroke();
    }
    ctx.font = "10px 'Outfit',sans-serif";
    ctx.fillStyle = 'rgba(80,80,110,0.45)';
    ctx.textAlign = 'left';
    ctx.fillText('Écran', scX+12, H*0.04+4);
    ctx.restore();

    /* ─── PRISME ─── */
    // Corps
    const pg = ctx.createLinearGradient(B.x, A.y, C.x, B.y);
    pg.addColorStop(0,   'rgba(200,228,255,0.88)');
    pg.addColorStop(0.45,'rgba(238,252,255,0.94)');
    pg.addColorStop(1,   'rgba(195,222,255,0.82)');
    ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(B.x,B.y); ctx.lineTo(C.x,C.y); ctx.closePath();
    ctx.fillStyle = pg; ctx.fill();
    // Reflet
    const gl = ctx.createLinearGradient(A.x,A.y,(B.x+C.x)/2,B.y);
    gl.addColorStop(0,'rgba(255,255,255,0.32)'); gl.addColorStop(1,'rgba(255,255,255,0)');
    ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(B.x,B.y); ctx.lineTo(C.x,C.y); ctx.closePath();
    ctx.fillStyle = gl; ctx.fill();
    // Contour
    ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(B.x,B.y); ctx.lineTo(C.x,C.y); ctx.closePath();
    ctx.strokeStyle = 'rgba(50,90,200,0.55)'; ctx.lineWidth = 1.8; ctx.stroke();

    // Labels prisme
    ctx.save();
    ctx.font = "italic 12px 'Crimson Pro',Georgia,serif";
    ctx.fillStyle = 'rgba(40,55,160,0.60)';
    ctx.textAlign = 'center';
    ctx.fillText(`A = ${prismDeg}°`, A.x, A.y-12);
    const cx3=(A.x+B.x+C.x)/3, cy3=(A.y+B.y+C.y)/3+5;
    ctx.fillText('n(λ) > 1', cx3, cy3);
    ctx.restore();

    // Labels faces
    const ang_ab = Math.atan2(B.y-A.y, B.x-A.x);
    const ang_ac = Math.atan2(C.y-A.y, C.x-A.x);
    const mAB = {x:(A.x+B.x)/2, y:(A.y+B.y)/2};
    const mAC = {x:(A.x+C.x)/2, y:(A.y+C.y)/2};
    ctx.save();
    ctx.font = "9px 'Outfit',sans-serif";
    ctx.fillStyle = 'rgba(50,70,160,0.40)';
    ctx.save(); ctx.translate(mAB.x-26,mAB.y); ctx.rotate(ang_ab-Math.PI/2);
    ctx.textAlign='center'; ctx.fillText("entrée",0,0); ctx.restore();
    ctx.save(); ctx.translate(mAC.x+26,mAC.y); ctx.rotate(ang_ac+Math.PI/2);
    ctx.textAlign='center'; ctx.fillText("sortie",0,0); ctx.restore();
    ctx.restore();

    /* ─── RAYONS ─── */
    const raysToTrace = mode==='poly' ? RAYS : [RAYS[monoIdx]];
    const impacts = [];

    raysToTrace.forEach((r, ri) => {
      const res = traceOne(W, H, r.nm);
      if (!res) return;
      const {src, entry, exit, dirInc, dirIn, dirOut} = res;

      const tScr = (scX - exit.x) / dirOut.x;
      if (tScr < 0) return;
      const impY = exit.y + tScr * dirOut.y;
      if (impY < 0 || impY > H) return;
      impacts.push({y:impY, r, exit, dirOut, res});

      const lw = mode==='poly' ? 1.8 : 2.5;

      // ── Glow ──
      ctx.save();
      ctx.globalAlpha = 0.10;
      ctx.strokeStyle = r.hex; ctx.lineWidth = 12;
      ctx.shadowColor = r.hex; ctx.shadowBlur = 14;
      ctx.beginPath(); ctx.moveTo(src.x,src.y); ctx.lineTo(entry.x,entry.y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(entry.x,entry.y); ctx.lineTo(exit.x,exit.y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(exit.x,exit.y); ctx.lineTo(scX,impY); ctx.stroke();
      ctx.restore();

      // ── Rayon incident (tirets animés) ──
      ctx.save();
      ctx.strokeStyle = r.hex; ctx.lineWidth = lw; ctx.globalAlpha = 0.82;
      ctx.setLineDash([10,6]); ctx.lineDashOffset = -dashOffset;
      ctx.beginPath(); ctx.moveTo(src.x,src.y); ctx.lineTo(entry.x,entry.y); ctx.stroke();
      ctx.setLineDash([]); ctx.restore();

      // ── Rayon interne (pointillé animé) ──
      ctx.save();
      ctx.strokeStyle = r.hex; ctx.lineWidth = lw*0.8; ctx.globalAlpha = 0.65;
      ctx.setLineDash([5,4]); ctx.lineDashOffset = -dashOffset*0.6;
      ctx.beginPath(); ctx.moveTo(entry.x,entry.y); ctx.lineTo(exit.x,exit.y); ctx.stroke();
      ctx.setLineDash([]); ctx.restore();

      // ── Rayon émergent (plein animé) ──
      ctx.save();
      ctx.strokeStyle = r.hex; ctx.lineWidth = lw; ctx.globalAlpha = 0.90;
      ctx.beginPath(); ctx.moveTo(exit.x,exit.y); ctx.lineTo(scX,impY); ctx.stroke();
      ctx.restore();

      // Flèche sur rayon émergent
      const fx = exit.x+(scX-exit.x)*0.50, fy = exit.y+(impY-exit.y)*0.50;
      drawArrow(fx, fy, dirOut.x, dirOut.y, r.hex, 9, 4.5);
    });

    /* ─── SOURCE ─── */
    const refRes = traceOne(W, H, mode==='poly' ? 550 : RAYS[monoIdx].nm);
    if (refRes) {
      const sx = refRes.src.x-16, sy = refRes.src.y;
      if (mode==='poly') {
        // Halo blanc
        const sg = ctx.createRadialGradient(sx,sy,1,sx,sy,22);
        sg.addColorStop(0,'rgba(255,255,220,0.95)'); sg.addColorStop(1,'rgba(255,255,200,0)');
        ctx.beginPath(); ctx.arc(sx,sy,22,0,2*Math.PI); ctx.fillStyle=sg; ctx.fill();
        ctx.save();
        ctx.font="bold 11px 'Outfit',sans-serif"; ctx.fillStyle='rgba(80,65,10,0.78)';
        ctx.textAlign='right'; ctx.fillText('Lumière blanche', sx-6, sy-18); ctx.restore();
      } else {
        const col = RAYS[monoIdx];
        const sg = ctx.createRadialGradient(sx,sy,1,sx,sy,17);
        sg.addColorStop(0,col.css+'0.90)'); sg.addColorStop(1,col.css+'0)');
        ctx.beginPath(); ctx.arc(sx,sy,17,0,2*Math.PI); ctx.fillStyle=sg; ctx.fill();
        ctx.save();
        ctx.font="11px 'Outfit',sans-serif"; ctx.fillStyle=col.hex;
        ctx.textAlign='right'; ctx.fillText(`λ = ${col.nm} nm  (${col.label})`, sx-6, sy-15);
        ctx.restore();
      }
    }

    /* ─── IMPACTS ÉCRAN ─── */
    impacts.forEach(({y,r}) => {
      const spot = ctx.createRadialGradient(scX-5,y,0,scX-5,y,15);
      spot.addColorStop(0,r.css+'0.88)'); spot.addColorStop(1,r.css+'0)');
      ctx.beginPath(); ctx.arc(scX-5,y,15,0,2*Math.PI); ctx.fillStyle=spot; ctx.fill();
      if (mode==='poly') {
        ctx.save(); ctx.font="9px 'DM Mono',monospace";
        ctx.fillStyle=r.hex; ctx.globalAlpha=0.82; ctx.textAlign='left';
        ctx.fillText(r.nm+' nm', scX+12, y+3); ctx.restore();
      }
    });

    // Bande spectrale sur l'écran (mode poly)
    if (mode==='poly' && impacts.length>=2) {
      const ys = impacts.map(i=>i.y).sort((a,b)=>a-b);
      const sg = ctx.createLinearGradient(scX-8,ys[0],scX-8,ys[ys.length-1]);
      sg.addColorStop(0,'rgba(136,0,238,0.55)');
      sg.addColorStop(0.2,'rgba(34,85,255,0.55)');
      sg.addColorStop(0.4,'rgba(0,187,68,0.55)');
      sg.addColorStop(0.6,'rgba(204,204,0,0.55)');
      sg.addColorStop(0.8,'rgba(255,102,0,0.55)');
      sg.addColorStop(1,'rgba(221,0,0,0.55)');
      ctx.fillStyle=sg; ctx.fillRect(scX-10,ys[0],7,ys[ys.length-1]-ys[0]);
    }

    /* ─── MODE MONO : normales + angles ─── */
    if (mode==='mono' && refRes) {
      const {entry, exit, nAB, nAC, i1, r1: rv1, i2, r2: rv2} = refRes;
      const NL = 46;
      // Normales pointillées
      drawDash(entry.x-nAB.x*NL, entry.y-nAB.y*NL, entry.x+nAB.x*NL, entry.y+nAB.y*NL);
      drawDash(exit.x-nAC.x*NL,  exit.y-nAC.y*NL,  exit.x+nAC.x*NL,  exit.y+nAC.y*NL);
      // Angles
      ctx.save();
      ctx.font="italic 11px 'Crimson Pro',Georgia,serif";
      ctx.fillStyle='rgba(40,60,185,0.78)'; ctx.textAlign='center';
      ctx.fillText(`i₁=${i1}°`,  entry.x-48, entry.y-22);
      ctx.fillText(`r₁=${rv1}°`, entry.x+26, entry.y-22);
      ctx.fillText(`i₂=${i2}°`,  exit.x-40,  exit.y-24);
      ctx.fillText(`r₂=${rv2}°`, exit.x+44,  exit.y-22);
      ctx.restore();
      // Loi de Snell
      ctx.save();
      ctx.font="italic 10.5px 'Crimson Pro',Georgia,serif";
      ctx.fillStyle='rgba(40,60,170,0.52)'; ctx.textAlign='left';
      ctx.fillText('sin(i₁) = n·sin(r₁)   (Snell-Descartes)', B.x+8, B.y+18);
      ctx.restore();
    }

    // Note pédagogique mode poly
    if (mode==='poly') {
      ctx.save();
      ctx.font="italic 10.5px 'Crimson Pro',Georgia,serif";
      ctx.fillStyle='rgba(60,45,10,0.38)'; ctx.textAlign='left';
      ctx.fillText('Violet → plus dévié   Rouge → moins dévié   (n dépend de λ)', B.x+6, B.y+18);
      ctx.restore();
    }
  }

  /* ─── Helpers dessin ─── */
  function drawArrow(x,y,dx,dy,col,al,aw) {
    ctx.save(); ctx.fillStyle=col; ctx.globalAlpha=0.85;
    ctx.beginPath();
    ctx.moveTo(x+dx*al, y+dy*al);
    ctx.lineTo(x-dy*aw, y+dx*aw);
    ctx.lineTo(x+dy*aw, y-dx*aw);
    ctx.closePath(); ctx.fill(); ctx.restore();
  }
  function drawDash(x1,y1,x2,y2) {
    ctx.save(); ctx.strokeStyle='rgba(70,90,200,0.58)';
    ctx.lineWidth=1.3; ctx.setLineDash([5,4]); ctx.globalAlpha=0.7;
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
    ctx.setLineDash([]); ctx.restore();
  }

  /* ─── Boucle ─── */
  function loop() {
    dashOffset = (dashOffset + 0.35) % 200;
    draw();
    raf = requestAnimationFrame(loop);
  }
  function start() { if (!active) { active=true; loop(); } }
  function stop()  { if (raf) { cancelAnimationFrame(raf); raf=null; active=false; } }

  /* ─── Init boutons couleur ─── */
  function initColorBtns() {
    const row = document.getElementById('monoColors');
    if (!row) return;
    RAYS.forEach((r,i) => {
      const btn = document.createElement('button');
      btn.className = 'mono-color-btn' + (i===monoIdx?' active':'');
      btn.style.background = r.hex;
      btn.title = `${r.label} — ${r.nm} nm`;
      btn.innerHTML = `<span>${r.label}<br>${r.nm} nm</span>`;
      btn.onclick = () => {
        monoIdx = i;
        document.querySelectorAll('.mono-color-btn').forEach((b,j)=>b.classList.toggle('active',j===i));
        draw();
      };
      row.appendChild(btn);
    });
  }

  /* ─── API publique ─── */
  function setMode(m) {
    mode = m;
    document.getElementById('btnPoly').classList.toggle('active', m==='poly');
    document.getElementById('btnMono').classList.toggle('active', m==='mono');
    const mr = document.getElementById('monoRow');
    if (mr) mr.style.display = m==='mono' ? 'flex' : 'none';
    const leg = document.getElementById('prismeLegend');
    if (leg) leg.style.display = m==='poly' ? 'flex' : 'none';
    draw();
  }
  function setPrismAngle(v) {
    prismDeg = parseInt(v);
    const el = document.getElementById('valPrism'); if (el) el.textContent=prismDeg+'°';
    draw();
  }
  function setInc(v) {
    incDeg = parseInt(v);
    const el = document.getElementById('valInc'); if (el) el.textContent=incDeg+'°';
    draw();
  }

  /* ─── Démarrage selon onglet ─── */
  initColorBtns();
  const t3 = document.getElementById('t3');
  if (t3) {
    new MutationObserver(()=>{ t3.classList.contains('active') ? start() : stop(); })
      .observe(t3, {attributes:true, attributeFilter:['class']});
    if (t3.classList.contains('active')) start();
  }
  draw(); // dessin initial

  return { setMode, setPrismAngle, setInc };
})();

</script>