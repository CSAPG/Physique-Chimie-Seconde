/**
 * seq-icons.js — Icônes animées des séquences (Physique-Chimie Seconde)
 * Usage : SEQ_ICONS['lava']  →  innerHTML à injecter dans un conteneur
 */

const SEQ_ICONS = {

  /* Séq. 00 — Ampoule Eureka */
  bulb: `
    <div class="bulb-icon">
      <div class="bulb-glow"></div>
      <svg class="bulb-svg" viewBox="0 0 60 90" xmlns="http://www.w3.org/2000/svg">
        <g class="bulb-rays">
          <line x1="30" y1="2"  x2="30" y2="8"  />
          <line x1="6"  y1="10" x2="13" y2="16" />
          <line x1="54" y1="10" x2="47" y2="16" />
          <line x1="0"  y1="32" x2="8"  y2="32" />
          <line x1="60" y1="32" x2="52" y2="32" />
        </g>
        <ellipse class="bulb-glass" cx="30" cy="32" rx="19" ry="25"/>
        <text class="bulb-filament-text" x="30" y="35">eureka</text>
        <rect class="bulb-base-cap"  x="24" y="54" width="12" height="6"/>
        <rect class="bulb-base-ring" x="23" y="60" width="14" height="4"/>
        <rect class="bulb-base-ring" x="23" y="65" width="14" height="4"/>
        <rect class="bulb-base-tip"  x="24" y="70" width="12" height="6" rx="2"/>
      </svg>
    </div>`,

  /* Séq. 01 — Lampe à lave */
  lava: `
    <div class="lava-icon">
      <div class="li-cap"></div>
      <div class="li-body">
        <div class="li-liquid"></div>
        <div class="li-blob li-b1"></div>
        <div class="li-blob li-b2"></div>
        <div class="li-blob li-b3"></div>
        <div class="li-blob li-b4"></div>
        <div class="li-glare"></div>
      </div>
      <div class="li-base"></div>
      <div class="li-glow"></div>
    </div>`,

  /* Séq. 02 — Tube à essai */
  tube: `
    <div class="tube-icon">
      <div class="tube-tilted">
        <div class="tube-rim"></div>
        <div class="tube-glass">
          <div class="tube-liquid"></div>
          <div class="tube-bubble tb-1"></div>
          <div class="tube-bubble tb-2"></div>
          <div class="tube-bubble tb-3"></div>
        </div>
      </div>
    </div>`,

  /* Séq. 03 — Atome */
  atom: `
    <div class="atom-icon">
      <div class="atom-orbit atom-orbit-1"></div>
      <div class="atom-orbit atom-orbit-2"></div>
      <div class="atom-orbit atom-orbit-3"></div>
      <div class="atom-electron atom-e1"></div>
      <div class="atom-electron atom-e2"></div>
      <div class="atom-nucleus"></div>
    </div>`,

  /* Séq. 04 — Coureur */
  runner: `
    <div class="runner-icon">
      <div class="runner-clouds">
        <div class="runner-cloud"></div><div class="runner-cloud"></div>
        <div class="runner-cloud"></div><div class="runner-cloud"></div>
        <div class="runner-cloud"></div><div class="runner-cloud"></div>
      </div>
      <div class="runner-hills">
        <div class="runner-hill"></div><div class="runner-hill"></div>
        <div class="runner-hill"></div><div class="runner-hill"></div>
        <div class="runner-hill"></div><div class="runner-hill"></div>
      </div>
      <div class="runner-ground"></div>
      <svg class="runner-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="#0e7490">
        <circle cx="58" cy="16" r="9"/>
        <path class="runner-arm-back"  d="M48,36 L40,30 L36,42 L44,48 Z"/>
        <path d="M44,32 Q56,28 64,38 L58,52 L46,50 Z"/>
        <path class="runner-arm-front" d="M58,40 L70,36 L74,46 L62,52 Z"/>
        <path class="runner-leg-back"  d="M50,50 L40,50 L34,72 L42,74 L52,54 Z"/>
        <path class="runner-leg-front" d="M56,50 L66,50 L72,72 L64,74 L54,54 Z"/>
      </svg>
    </div>`,

  /* Séq. 05 — Pommier */
  apple: `
    <div class="apple-icon">
      <div class="apple-canopy"></div>
      <div class="apple-trunk"></div>
      <div class="apple-fruit"></div>
    </div>`,

  /* Séq. 06 — Sablier (clipPath unique par instance via suffix) */
  hourglass: (suffix = 'hg') => `
    <div class="hourglass-icon">
      <svg class="hourglass-svg" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
        <rect class="hourglass-cap" x="22" y="6"   width="56" height="8" rx="2"/>
        <rect class="hourglass-cap" x="22" y="106" width="56" height="8" rx="2"/>
        <path class="hourglass-frame" d="M28,14 L72,14 L72,30 Q72,50 50,60 Q28,50 28,30 Z"/>
        <path class="hourglass-frame" d="M28,106 L72,106 L72,90 Q72,70 50,60 Q28,70 28,90 Z"/>
        <defs>
          <clipPath id="topClip-${suffix}">
            <path d="M30,16 L70,16 L70,30 Q70,48 50,58 Q30,48 30,30 Z"/>
          </clipPath>
          <clipPath id="bottomClip-${suffix}">
            <path d="M30,104 L70,104 L70,90 Q70,72 50,62 Q30,72 30,90 Z"/>
          </clipPath>
        </defs>
        <rect class="sand-top"    clip-path="url(#topClip-${suffix})"    x="30" y="16" width="40" height="42" fill="#FAC775"/>
        <rect class="sand-bottom" clip-path="url(#bottomClip-${suffix})" x="30" y="62" width="40" height="42" fill="#FAC775"/>
        <rect class="sand-stream" x="49" y="58" width="2" height="6" fill="#FAC775"/>
      </svg>
    </div>`,

  /* Séq. 07 — Reflux (clipPath unique via suffix) */
  reflux: (suffix = 'rf') => `
    <div class="reflux-icon">
      <svg class="reflux-svg" viewBox="0 0 100 135" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="ballonClip-${suffix}"><circle cx="50" cy="94" r="25"/></clipPath>
        </defs>
        <line x1="50" y1="4" x2="50" y2="58" stroke="#7dd3fc" stroke-width="3"/>
        <circle class="reflux-glass" cx="50" cy="14" r="9"/>
        <circle class="reflux-glass" cx="50" cy="32" r="9"/>
        <circle class="reflux-glass" cx="50" cy="50" r="9"/>
        <circle class="reflux-vapor reflux-vapor-1" cx="50" cy="60" r="3.5"/>
        <circle class="reflux-vapor reflux-vapor-2" cx="50" cy="60" r="3"/>
        <circle class="reflux-drop" cx="50" cy="54" r="3"/>
        <path class="reflux-glass" d="M42,60 L42,72 L58,72 L58,60"/>
        <circle class="reflux-glass" cx="50" cy="94" r="26"/>
        <rect class="reflux-liquid" clip-path="url(#ballonClip-${suffix})" x="24" y="86" width="52" height="34"/>
        <circle class="reflux-bubble reflux-bubble-1" cx="42" cy="110" r="3"/>
        <circle class="reflux-bubble reflux-bubble-2" cx="54" cy="113" r="2.5"/>
        <circle class="reflux-bubble reflux-bubble-3" cx="62" cy="108" r="3"/>
        <rect x="14" y="124" width="72" height="7" rx="2" fill="#94a3b8"/>
      </svg>
    </div>`,

  /* Séq. 08 — Glaçons qui fondent */
  melt: `
    <div class="melt-icon">
      <svg class="melt-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <ellipse class="melt-puddle" cx="50" cy="78" rx="34" ry="8"/>
        <rect class="ice-cube ice-1" x="14" y="44" width="26" height="26" rx="4"/>
        <rect class="ice-cube ice-2" x="42" y="50" width="20" height="20" rx="4"/>
        <rect class="ice-cube ice-3" x="64" y="56" width="16" height="16" rx="3"/>
      </svg>
    </div>`,

  /* Séq. 09 — Noyau radioactif (animation α, IDs uniques via suffix) */
  nuclear: (suffix = 'nuc') => `
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" width="64" height="64" style="overflow:visible;">
      <defs>
        <radialGradient id="ng1-${suffix}" cx="40%" cy="35%">
          <stop offset="0%"   stop-color="#e8a07a"/>
          <stop offset="100%" stop-color="#c9622a"/>
        </radialGradient>
        <radialGradient id="ng2-${suffix}" cx="40%" cy="35%">
          <stop offset="0%"   stop-color="#9dc8f0"/>
          <stop offset="100%" stop-color="#2D5F8A"/>
        </radialGradient>
        <style>
          @keyframes nuc-pulse-${suffix}{0%,100%{transform:scale(1);}50%{transform:scale(0.92);}}
          @keyframes alpha-out-${suffix}{0%{transform:translate(0,0) scale(1);opacity:1;}70%{transform:translate(22px,-18px) scale(0.9);opacity:0.8;}100%{transform:translate(34px,-28px) scale(0.7);opacity:0;}}
          .nuc-core-${suffix}{animation:nuc-pulse-${suffix} 2.4s ease-in-out infinite;transform-origin:28px 38px;}
          .alpha-${suffix}{animation:alpha-out-${suffix} 2.4s ease-in infinite;transform-origin:50px 14px;}
          @media(prefers-reduced-motion:reduce){.nuc-core-${suffix},.alpha-${suffix}{animation:none;}}
        </style>
      </defs>
      <g class="nuc-core-${suffix}">
        <circle cx="28" cy="38" r="14" fill="url(#ng1-${suffix})" opacity="0.9"/>
        <circle cx="24" cy="34" r="4.5" fill="#d1495b" opacity="0.85"/>
        <circle cx="32" cy="34" r="4.5" fill="#8d99ae" opacity="0.85"/>
        <circle cx="24" cy="42" r="4.5" fill="#8d99ae" opacity="0.85"/>
        <circle cx="32" cy="42" r="4.5" fill="#d1495b" opacity="0.85"/>
        <circle cx="20" cy="38" r="4"   fill="#d1495b" opacity="0.75"/>
        <circle cx="36" cy="38" r="4"   fill="#8d99ae" opacity="0.75"/>
      </g>
      <g class="alpha-${suffix}">
        <circle cx="50" cy="14" r="7"   fill="url(#ng2-${suffix})" opacity="0.92"/>
        <circle cx="47.5" cy="12"   r="2.8" fill="#d1495b" opacity="0.9"/>
        <circle cx="52.5" cy="12"   r="2.8" fill="#8d99ae" opacity="0.9"/>
        <circle cx="47.5" cy="16.5" r="2.8" fill="#8d99ae" opacity="0.9"/>
        <circle cx="52.5" cy="16.5" r="2.8" fill="#d1495b" opacity="0.9"/>
      </g>
      <g opacity="0.5">
        <line x1="10" y1="20" x2="6"  y2="16" stroke="#f4c430" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="6"  y1="20" x2="10" y2="16" stroke="#f4c430" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="14" y1="22" x2="10" y2="18" stroke="#f4c430" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="10" y1="22" x2="14" y2="18" stroke="#f4c430" stroke-width="1.5" stroke-linecap="round"/>
      </g>
    </svg>`,

  /* Séq. 10 — Œil */
  eye: `
    <div class="eye-icon">
      <svg class="eye-svg" viewBox="0 0 100 70" xmlns="http://www.w3.org/2000/svg">
        <path class="eye-white" d="M5,35 Q50,2 95,35 Q50,68 5,35 Z"/>
        <g class="eye-iris-group">
          <circle class="eye-iris"  cx="50" cy="35" r="15"/>
          <circle class="eye-pupil" cx="50" cy="35" r="6"/>
        </g>
      </svg>
    </div>`,

  /* Séq. 11 — Ondes sonores */
  wave: `
    <div class="wave-icon">
      <svg class="wave-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle class="wave-ring wave-ring-3" cx="50" cy="50" r="40"/>
        <circle class="wave-ring wave-ring-2" cx="50" cy="50" r="40"/>
        <circle class="wave-ring wave-ring-1" cx="50" cy="50" r="40"/>
        <circle class="wave-source"   cx="50" cy="50" r="6"/>
        <circle class="wave-receiver" cx="85" cy="50" r="5"/>
      </svg>
    </div>`,

  /* Séq. 12 — Satellite */
  satellite: `
    <div class="sat-icon">
      <svg class="sat-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g>
          <rect class="sat-body"  x="58" y="10" width="16" height="16" rx="2"/>
          <rect class="sat-panel" x="38" y="14" width="16" height="8"  rx="1"/>
          <rect class="sat-panel" x="78" y="14" width="16" height="8"  rx="1"/>
          <line class="sat-antenna-line" x1="54" y1="18" x2="58" y2="18"/>
          <line class="sat-antenna-line" x1="74" y1="18" x2="78" y2="18"/>
          <line class="sat-antenna-line" x1="66" y1="10" x2="66" y2="4"/>
          <circle class="sat-body" cx="66" cy="3" r="2"/>
        </g>
        <circle class="sat-signal sat-signal-1" cx="62" cy="30" r="3"/>
        <circle class="sat-signal sat-signal-2" cx="62" cy="30" r="3"/>
        <circle class="sat-signal sat-signal-3" cx="62" cy="30" r="3"/>
        <rect class="sat-ground" x="0" y="92" width="100" height="8"/>
        <g>
          <path class="sat-antenna-line" d="M22,92 L32,68"/>
          <path class="sat-antenna-line" d="M20,92 Q32,76 44,92 Z"/>
          <circle class="sat-body" cx="32" cy="68" r="2.5"/>
        </g>
      </svg>
    </div>`,
};

/**
 * Retourne le HTML d'une icône.
 * Pour les icônes avec clipPath/gradients (hourglass, reflux, nuclear),
 * passer un suffix unique pour éviter les conflits d'ID dans la page.
 *
 * Exemples :
 *   getIcon('lava')
 *   getIcon('hourglass', 'seq06')
 *   getIcon('nuclear',   'hero')
 */
function getIcon(name, suffix) {
  const icon = SEQ_ICONS[name];
  if (!icon) return '';
  return (typeof icon === 'function') ? icon(suffix || name) : icon;
}
