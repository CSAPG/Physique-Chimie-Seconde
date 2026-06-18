/* ════════════════════════════════════════════════════════════
   Jeux et activités interactives — toutes sources confondues
   ──────────────────────────────────────────────────────────────
   Ce fichier centralise tous les jeux, simulations et activités
   interactives (Hatier, Genially, PCCL, etc.) et les injecte
   automatiquement dans la section "🎮 Jeux interactifs" du
   panneau de chaque séquence.

   Pour ajouter un jeu : ajouter une entrée dans le tableau
   GAMES_RESOURCES de la séquence concernée (ou créer une
   nouvelle clé si la séquence n'en a pas encore).

   Champs :
   - url    : lien de l'activité
   - icon   : emoji affiché (par défaut 🎮)
   - label  : titre affiché
   - source : nom de la source affiché dans le sous-titre
   - desc   : description courte affichée dans le sous-titre
═══════════════════════════════════════════════════════════════ */

const GAMES_RESOURCES = {

  "0": [
    {
      url: "https://www.hatier-clic.fr/miniliens/mie/2018/9782401049611/pc2_activites_interactives/ai_notationscientifique/index.htm",
      icon: "🔢",
      label: "Activité interactive — Notation scientifique",
      source: "Hatier",
      desc: "Activité numérique"
    }
  ],

  "1": [
    {
      url: "https://www.hatier-clic.fr/miniliens/mie/9782401020658/C01_SI/index.html",
      icon: "🧪",
      label: "Légender le schéma — Chromatographie sur couche mince",
      source: "Hatier",
      desc: "Glisser-déposer · CCM"
    }
  ],

  "2": [
    {
      url: "https://www.hatier-clic.fr/miniliens/mie/9782401020658/AI_2019_concentrationenmasse/index.html",
      icon: "🎮",
      label: "Activité interactive — Concentration en masse",
      source: "Hatier",
      desc: "Activité numérique"
    }
  ],

  "3": [
    {
      url: "https://view.genially.com/6075ac403291850dd60c3f64",
      icon: "🔐",
      label: "Escape game — Atome",
      source: "Genially · Hatier",
      desc: "Noyau, configuration électronique, ions, schémas de Lewis"
    },
    {
      url: "https://lewis.web-labosims.org/",
      icon: "🧬",
      label: "Application — Construire des structures de Lewis",
      source: "LABOSIMS",
      desc: "Placer atomes et doublets, tracer les liaisons et vérifier son schéma de Lewis"
    }
  ],

  "4": [
    {
      url: "https://www.hatier-clic.fr/2019/01/9782401020658/Newton_seconde/index.htm",
      icon: "🎮",
      label: "Simulation — Lancer d'une balle de tennis",
      source: "Hatier",
      desc: "Mouvement et vitesse initiale"
    }
  ],

  "5": [
    {
      url: "https://www.hatier-clic.fr/miniliens/mie/9782401020658/21PC2_C10_C11_eg02.pdf",
      icon: "🗺️",
      label: "Escape game — Tous à Londres !",
      source: "Hatier · PDF",
      desc: "Énigmes : vitesse, forces, poids et loi de gravitation"
    }
  ],

  "7": [
    {
      url: "https://www.hatier-clic.fr/miniliens/mie/9782401020658/AI_reactiflimitant/index.html",
      icon: "🎮",
      label: "Activité interactive — Réactif limitant",
      source: "Hatier",
      desc: "Activité numérique"
    },
    {
      url: "https://view.genially.com/6075b12d701ac40d376a89c7",
      icon: "🔐",
      label: "Escape game — Transformations chimiques",
      source: "Genially · Hatier",
      desc: "Réactif limitant, ajustement d'équations, transformation chimique"
    },
    {
      url: "https://www.hatier-clic.fr/miniliens/mie/9782401020658/C08_SI/index.html",
      icon: "🧪",
      label: "Légender le montage à reflux",
      source: "Hatier",
      desc: "Glisser-déposer · Schéma du montage à reflux"
    },
    {
      url: "https://phet.colorado.edu/sims/html/balancing-chemical-equations/latest/balancing-chemical-equations_all.html",
      icon: "⚖️",
      label: "Simulation — Équilibrage d'équations chimiques",
      source: "PhET · University of Colorado",
      desc: "Ajuster les coefficients stœchiométriques pour équilibrer les équations"
    },
    {
      url: "https://physique-chimie.ac-normandie.fr/spip.php?article222",
      icon: "🧬",
      label: "Construire des formules de Lewis",
      source: "Académie de Normandie",
      desc: "Activité numérique"
    }
  ],

  "9": [
    {
      url: "https://phet.colorado.edu/sims/html/isotopes-and-atomic-mass/latest/isotopes-and-atomic-mass_all.html",
      icon: "⚛️",
      label: "Simulation — Isotopes et masse atomique",
      source: "PhET · University of Colorado",
      desc: "Explorer les isotopes, leur composition et leur masse atomique moyenne"
    }
  ],

  "10": [
    {
      url: "https://www.hatier-clic.fr/miniliens/mie/9782401020658/C16_SI/index.html",
      icon: "👁️",
      label: "Légender le schéma — Anatomie de l'œil",
      source: "Hatier",
      desc: "Glisser-déposer · Schéma de l'œil"
    },
    {
      url: "https://www.hatier-clic.fr/miniliens/mie/9782401020658/C16_2_SI/index.html",
      icon: "👁️",
      label: "Légender le schéma — Modèle réduit de l'œil",
      source: "Hatier",
      desc: "Glisser-déposer · Œil et lentille convergente"
    }
  ],

  "11": [
    {
      url: "https://view.genially.com/6075b34700532f0dcf17c1b5",
      icon: "🎵",
      label: "Escape game — La partition",
      source: "Genially · Hatier",
      desc: "Signaux sonores : propagation, période, fréquence, timbre"
    }
  ],

  "12": [
    {
      url: "https://www.hatier-clic.fr/miniliens/mie/9782401020658/AI_2019_loisdescircuits/index.html",
      icon: "🎮",
      label: "Activité interactive — Lois des circuits",
      source: "Hatier",
      desc: "Activité numérique"
    }
  ]

};

/* Génère le HTML d'un lien "resource-link" pour un jeu interactif */
function gameLinkHTML(item) {
  const icon = item.icon || "🎮";
  return `
        <a class="resource-link" data-type="jeu" href="${item.url}" target="_blank">
          <span class="icon">${icon}</span>
          <div>
            <div class="label">${item.label}</div>
            <div class="sub">${item.source} · ${item.desc}</div>
          </div>
          <span style="margin-left:auto;font-size:0.85rem;color:#0e7490;">Ouvrir →</span>
          <span class="type-dot"></span>
        </a>`;
}

/* ────────────────────────────────────────────────────────────
   Injection automatique dans le DOM
   Pour chaque panneau #seq-panel-N, on cherche la section
   "🎮 Jeux interactifs" et on y ajoute les jeux correspondants
   (sans doublon). Si la section n'existe pas encore, elle est
   créée juste avant la section "Flashcards" si elle existe,
   sinon à la fin du panneau.
──────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  Object.keys(GAMES_RESOURCES).forEach(function (seqNum) {
    const panel = document.getElementById('seq-panel-' + seqNum);
    if (!panel) return;

    const sections = panel.querySelectorAll('div[style*="margin-bottom:18px"]');
    let targetSection = null;
    let flashcardsSection = null;

    sections.forEach(function (sec) {
      const header = sec.querySelector('div[style*="text-transform:uppercase"]');
      if (!header) return;
      if (header.textContent.includes('Jeux interactifs') || header.textContent.includes('Jeux et exercices')) {
        targetSection = sec;
      }
      if (header.textContent.includes('Flashcards')) {
        flashcardsSection = sec;
      }
    });

    // Si la section "Jeux interactifs" n'existe pas, la créer
    if (!targetSection) {
      targetSection = document.createElement('div');
      targetSection.style.marginBottom = '18px';
      targetSection.innerHTML = '<div style="font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#64748b;margin-bottom:10px;padding-left:4px;">🎮 Jeux interactifs</div>';

      if (flashcardsSection) {
        // Insérer avant la section Flashcards pour respecter l'ordre habituel
        flashcardsSection.parentNode.insertBefore(targetSection, flashcardsSection);
      } else {
        panel.appendChild(targetSection);
      }
    }

    // Retirer un éventuel placeholder "À venir"
    const placeholder = targetSection.querySelector('div.resource-link[style*="opacity:0.5"]');
    if (placeholder) placeholder.remove();

    GAMES_RESOURCES[seqNum].forEach(function (item) {
      // Éviter les doublons si le lien est déjà présent en dur dans le HTML
      if (panel.querySelector('a[href="' + item.url + '"]')) return;

      targetSection.insertAdjacentHTML('beforeend', gameLinkHTML(item));
    });
  });
});
