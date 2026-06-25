/* ════════════════════════════════════════════════════════════
   Ressources Hatier — Manuel Physique-Chimie 2de (éd. 2021/2023)
   ISBN 9782401020658
   ──────────────────────────────────────────────────────────────
   Ce fichier centralise TOUTES les ressources hatier-clic.fr
   (flashcards de révision + QCM "Faire le point") et les injecte
   automatiquement dans la section "✏️ Flashcards, exercices et
   quiz" du panneau de chaque séquence.

   Pour ajouter une ressource : ajouter une entrée dans le
   tableau HATIER_RESOURCES de la séquence concernée (ou créer
   une nouvelle clé si la séquence n'en a pas encore).
═══════════════════════════════════════════════════════════════ */

const HATIER_RESOURCES = {

  "1": [
    { type: "flashcards" },
    { type: "qcm", chap: 1, label: "QCM en ligne — Faire le point", titre: "Chapitre 1 · Corps purs et mélanges" }
  ],

  "2": [
    { type: "flashcards" },
    { type: "qcm", chap: 2, titre: "Solutions aqueuses : un exemple de mélanges" }
  ],

  "3": [
    { type: "qcm", chap: 3, label: "Quiz — Atomes : noyau et cortège électronique", noSub: true },
    { type: "qcm", chap: 4, label: "Quiz — Entités chimiques stables", noSub: true }
  ],

  "4": [
    { type: "qcm", chap: 10, titre: "Décrire un mouvement" }
  ],

  "5": [
    { type: "qcm", chap: 11, titre: "Actions et forces" },
    { type: "qcm", chap: 12, titre: "Le principe d'inertie" }
  ],

  "6": [
    { type: "qcm", chap: 5, titre: "Quantité de matière" }
  ],

  "7": [
    { type: "qcm", chap: 7, titre: "D'une espèce chimique à l'autre : la transformation chimique" },
    { type: "qcm", chap: 8, titre: "Synthèse d'une espèce chimique naturelle" }
  ],

  "8": [
    { type: "qcm", chap: 6, titre: "D'un état à l'autre : la transformation physique" }
  ],

  "9": [
    { type: "qcm", chap: 9, titre: "D'un élément à l'autre : la transformation nucléaire" }
  ],

  "10": [
    { type: "qcm", chap: 14, titre: "Propagation de la lumière" },
    { type: "qcm", chap: 15, titre: "Les spectres lumineux" },
    { type: "qcm", chap: 16, titre: "Lentilles et modèle de l'œil" }
  ],

  "11": [
    { type: "qcm", chap: 13, titre: "Signaux sonores" }
  ],

  "12": [
    { type: "qcm", chap: 17, titre: "Les circuits électriques" }
  ]

};

/* Construit l'URL d'un QCM "Faire le point" à partir du numéro de chapitre */
function hatierQcmUrl(chap) {
  const num = String(chap).padStart(2, '0');
  return `https://www.hatier-clic.fr/miniliens/mie/9782401020658/pc-2_faire-le-point_chap_${num}/index.html`;
}

/* URL des flashcards génériques de révision */
const HATIER_FLASHCARDS_URL = "https://www.hatier-clic.fr/miniliens/mie/9782401020658/flashcards_pc2de/index.html";

/* Génère le HTML d'un lien "resource-link" pour une ressource Hatier */
function hatierLinkHTML(item) {
  if (item.type === "flashcards") {
    return `
        <a class="resource-link" data-type="jeu" href="${HATIER_FLASHCARDS_URL}" target="_blank">
          <span class="icon">🃏</span>
          <div>
            <div class="label">Flashcards de révision</div>
            <div class="sub">Hatier · Vocabulaire et notions clés</div>
          </div>
          <span style="margin-left:auto;font-size:0.85rem;color:#0e7490;">Ouvrir →</span>
          <span class="type-dot"></span>
        </a>`;
  }

  // type === "qcm"
  const label = item.label || ("Faire le point — QCM Chapitre " + item.chap);
  const subHTML = item.noSub ? '' : ('\n            <div class="sub">Hatier · ' + item.titre + '</div>');

  return `
        <a class="resource-link" data-type="jeu" href="${hatierQcmUrl(item.chap)}" target="_blank">
          <span class="icon">📝</span>
          <div>
            <div class="label">${label}</div>${subHTML}
          </div>
          <span style="margin-left:auto;font-size:0.85rem;color:#0e7490;">Ouvrir →</span>
          <span class="type-dot"></span>
        </a>`;
}

/* Renvoie l'URL utilisée pour la déduplication */
function hatierResourceUrl(item) {
  return item.type === "flashcards" ? HATIER_FLASHCARDS_URL : hatierQcmUrl(item.chap);
}

/* ────────────────────────────────────────────────────────────
   Injection automatique dans le DOM
   Pour chaque panneau #seq-panel-N, on cherche la section
   "✏️ Flashcards, exercices et quiz" et on y ajoute les
   ressources Hatier correspondantes (sans doublon).
   Si la section n'existe pas encore, elle est créée.
──────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  Object.keys(HATIER_RESOURCES).forEach(function (seqNum) {
    const panel = document.getElementById('seq-panel-' + seqNum);
    if (!panel) return;

    // Trouver la div de section "Flashcards, exercices et quiz"
    const sections = panel.querySelectorAll('div[style*="margin-bottom:18px"]');
    let targetSection = null;
    sections.forEach(function (sec) {
      const header = sec.querySelector('.section-label');
      if (header && header.textContent.includes('Flashcards')) {
        targetSection = sec;
      }
    });

    // Si la section n'existe pas, la créer à la fin du panneau
    if (!targetSection) {
      targetSection = document.createElement('div');
      targetSection.style.marginBottom = '18px';
      targetSection.innerHTML = '<div class="section-label">✏️ Flashcards, exercices et quiz</div>';
      panel.appendChild(targetSection);
    }

    HATIER_RESOURCES[seqNum].forEach(function (item) {
      const url = hatierResourceUrl(item);
      // Éviter les doublons si le lien est déjà présent en dur dans le HTML
      if (panel.querySelector('a[href="' + url + '"]')) return;

      targetSection.insertAdjacentHTML('beforeend', hatierLinkHTML(item));
    });
  });
});
