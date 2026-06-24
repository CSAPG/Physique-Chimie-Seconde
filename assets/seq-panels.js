/**
 * seq-panels.js — Données et rendu des panneaux de séquences (Physique-Chimie Seconde)
 * Dépend de seq-icons.js (chargé avant)
 */

/* ─────────────────────────────────────────────
   DONNÉES DES SÉQUENCES
   Chaque objet : { id, num, titre, sous_titre, icone, iconSuffix?,
                    headerBg?,   ← URL image de fond optionnelle
                    ressources: [ { section, items: [{icon, label, sub?, href, cta?}] } ]
                  }
───────────────────────────────────────────── */
const SEQUENCES = [

  /* ── Séq. 00 ── */
  {
    id: 0, num: '00',
    titre: 'Les incontournables',
    sous_titre: 'Rappels de notions mathématiques utiles en physique-chimie',
    icone: 'bulb',
    ressources: [
      {
        section: '📖 Cours',
        items: [
          { icon: '📄', label: 'Fiches : Les incontournables',
            sub: 'PDF · Notation scientifique, chiffres significatifs, conversions, ordre de grandeur, arrondi, incertitudes',
            href: 'Fiches_incontournables-2nde.pdf' },
          { icon: '💡', label: 'Cours interactif — Les incontournables',
            sub: '7 fiches avec jeux et exercices auto-corrigés',
            href: 'sequence00_incontournables.html' },
        ]
      },
      { section: '🎮 Jeux et exercices', items: [] }
    ]
  },

  /* ── Séq. 01 ── */
  {
    id: 1, num: '01',
    titre: 'Corps purs et mélanges',
    sous_titre: 'Identification · Tests chimiques · Espèces chimiques · Mélanges',
    icone: 'lava',
    ressources: [
      {
        section: '📖 Cours',
        items: [
          { icon: '📄', label: 'Fiche de cours — Corps purs et mélanges',
            sub: 'PDF · Cours complet', href: 'seq01/fiche-de-cours-01.pdf' },
          { icon: '🎓', label: 'Cours interactif — Description de la matière',
            href: 'seq01/sequence01_description_matiere.html' },
        ]
      },
      {
        section: '🎮 Jeux interactifs',
        items: [
          { icon: '🧪', label: 'Tests d\'identification des espèces chimiques',
            sub: 'Jeu interactif · Corps purs et mélanges',
            href: 'seq01/seq01-jeu.html' },
        ]
      },
      {
        section: '✏️ Flashcards, exercices et quiz',
        items: [
          { icon: '📝', label: 'Quiz de révision — 3 niveaux',
            sub: '30 questions · Facile · Intermédiaire · Difficile',
            href: 'seq01/sequence01_quiz_revision.html' },
        ]
      }
    ]
  },

  /* ── Séq. 02 ── */
  {
    id: 2, num: '02',
    titre: 'Solutions aqueuses',
    sous_titre: 'Soluté · Solvant · Concentration · Dissolution · Dilution',
    icone: 'tube',
    headerBg: "seq02/echelle_teinte_permanganate.jpg",
    ressources: [
      {
        section: '📖 Cours',
        items: [
          { icon: '📄', label: 'Fiche de cours — Solutions aqueuses',
            sub: 'PDF · Cours complet', href: 'seq02/fiche-de-cours-02.pdf' },
          { icon: '🎓', label: 'Cours interactif — Solutions aqueuses',
            href: 'seq02/sequence02_solutions_aqueuses.html' },
        ]
      },
      {
        section: '🎮 Jeux interactifs',
        items: [
          { icon: '💧', label: 'Dissolution et dilution',
            sub: 'Jeu interactif · Solutions aqueuses',
            href: 'seq02/jeu/jeu-dissolution.html' },
          { icon: '🎮', label: 'Connais-tu la verrerie de Laboratoire ?',
            sub: 'Pearltrees · Activité en ligne',
            href: 'https://www.pearltrees.com/private/id104933074/item801435685?paccess=47cf8c86ecf.2fc4f025.b1ffa2bad81bf3e729b9553ed1064aef' },
        ]
      },
      {
        section: '✏️ Flashcards, exercices et quiz',
        items: [
          { icon: '📝', label: 'Quiz de révision — 3 niveaux',
            sub: 'Questions · Facile · Intermédiaire · Difficile',
            href: 'seq02/sequence02_quiz_revision.html' },
          { icon: '📝', label: 'Exercice — Qu\'est ce qu\'une solution ?',
            sub: 'Pearltrees · Activité en ligne',
            href: 'https://www.pearltrees.com/private/id104933074/item801435759?paccess=47cf8c7dc46.2fc4f06f.7f580a2486ebd34a8f702fba98ff1390' },
        ]
      }
    ]
  },

  /* ── Séq. 03 ── */
  {
    id: 3, num: '03',
    titre: 'Modélisation de la matière à l\'échelle microscopique',
    sous_titre: 'Atome · Noyau · Cortège électronique · Ions · Molécules · Schéma de Lewis',
    icone: 'atom',
    ressources: [
      {
        section: '📖 Cours',
        items: [
          { icon: '📄', label: 'Fiche de cours — Modélisation de la matière à l\'échelle microscopique',
            sub: 'PDF · Cours complet', href: 'seq03/fiche-de-cours-03.pdf' },
          { icon: '🎓', label: 'Cours interactif complet',
            href: 'seq03/sequence03_modelisation_matiere.html' },
        ]
      },
      {
        section: '🎮 Jeux interactifs',
        items: [
          { icon: '🎮', label: 'Jeu — Configurations électroniques et symboles de Lewis',
            href: 'seq03/jeu-tableau-periodique.html' },
        ]
      },
      {
        section: '✏️ Flashcards, exercices et quiz',
        items: [
          { icon: '📝', label: 'Quiz de révision',
            href: 'seq03/sequence03_quiz_revision.html' },
        ]
      }
    ]
  },

  /* ── Séq. 04 ── */
  {
    id: 4, num: '04',
    titre: 'Description du mouvement',
    sous_titre: 'Référentiel · Trajectoire · Vecteur vitesse · Mouvement rectiligne',
    icone: 'runner',
    headerBg: "seq04/Etude-saut.jpg",
    ressources: [
      {
        section: '📖 Cours',
        items: [
          { icon: '📄', label: 'Fiche de cours — Description du mouvement',
            sub: 'PDF · Cours complet', href: 'seq04/fiche-de-cours-04.pdf' },
          { icon: '🎓', label: 'Cours interactif — Description du mouvement',
            href: 'seq04/sequence04_description_mouvement.html' },
        ]
      },
      {
        section: '🎮 Jeux interactifs',
        items: [
          { icon: '🎮', label: 'Chronophotographie — Mouvement uniforme',
            sub: 'PCCL · Animation interactive',
            href: 'https://www.pccl.fr/physique_chimie_college_lycee/lycee/seconde/chronophotographie_mouvement_uniforme_flash.htm' },
          { icon: '🎮', label: 'Chronophotographie — Mouvement accéléré',
            sub: 'PCCL · Animation interactive',
            href: 'https://www.pccl.fr/physique_chimie_college_lycee/lycee/seconde/chronophotographie_mouvement_accelere_flash.htm' },
          { icon: '🎮', label: 'Tracer un vecteur vitesse (simple)',
            sub: 'PCCL · Animation interactive',
            href: 'https://www.pccl.fr/physique_chimie_college_lycee/lycee/seconde/tracer_vecteur_vitesse_simple_csp_flash.htm' },
          { icon: '🎮', label: 'Tracer et représenter un vecteur vitesse',
            sub: 'PCCL · Animation interactive',
            href: 'https://www.pccl.fr/physique_chimie_college_lycee/lycee/seconde/tracer_representer_vecteur_vitesse_flash.htm' },
        ]
      },
      {
        section: '✏️ Flashcards, exercices et quiz',
        items: [
          { icon: '📝', label: 'Quiz de révision — 3 niveaux',
            sub: '30 questions · Facile · Intermédiaire · Difficile',
            href: 'seq04/sequence04_quiz_revision.html' },
          { icon: '📝', label: 'Exercice flash — Décrire un mouvement',
            sub: 'PCCL · Exercice interactif',
            href: 'https://www.pccl.fr/physique_chimie_college_lycee/programme_rentree_2016/mouvements_et_interactions/mouvement_exercice_flash.htm' },
        ]
      }
    ]
  },

  /* ── Séq. 05 ── */
  {
    id: 5, num: '05',
    titre: 'Forces et principe d\'inertie',
    sous_titre: 'Modélisation des forces · Principe d\'inertie · Chute libre · Actions réciproques',
    icone: 'apple',
    ressources: [
      {
        section: '📖 Cours',
        items: [
          { icon: '📄', label: 'Fiche de cours — Forces et principe d\'inertie',
            sub: 'PDF · Cours complet', href: 'seq05/fiche-de-cours-05.pdf' },
          { icon: '🎓', label: 'Cours interactif — Forces et principe d\'inertie',
            href: 'seq05/sequence05_forces_principe_inertie.html' },
        ]
      },
      {
        section: '🎮 Jeux interactifs',
        items: [
          { icon: '🎮', label: 'Loi gravitationnelle — Mesure du poids avec un dynamomètre',
            sub: 'PCCL · Animation interactive',
            href: 'https://www.pccl.fr/physique_chimie_college_lycee/lycee/seconde/masse_poids_dynamometre_flash.htm' },
        ]
      },
      {
        section: '✏️ Flashcards, exercices et quiz',
        items: [
          { icon: '📝', label: 'Exercice flash — 5 situations pour s\'entraîner à représenter des forces',
            sub: 'PCCL · Exercice interactif',
            href: 'https://www.pccl.fr/physique_chimie_college_lycee/troisieme/mecanique/representation_force_flash.htm' },
          { icon: '📝', label: 'Exercice flash — Équilibre d\'un solide soumis à trois forces',
            sub: 'PCCL · Exercice interactif',
            href: 'https://www.pccl.fr/physique_chimie_college_lycee/lycee/premiere_1S/equilibre_solide_soumis_trois_forces_2_flash.htm' },
        ]
      }
    ]
  },

  /* ── Séq. 06 ── */
  {
    id: 6, num: '06',
    titre: 'Compter les entités dans un échantillon de matière',
    sous_titre: 'Masse d\'une entité · Nombre d\'entités · Quantité de matière · Mole',
    icone: 'hourglass', iconSuffix: 'seq06',
    ressources: [
      {
        section: '📖 Cours',
        items: [
          { icon: '📄', label: 'Fiche de cours — Compter les entités dans un échantillon de matière',
            sub: 'PDF · Cours complet', href: 'seq06/fiche-de-cours-06.pdf' },
          { icon: '🎓', label: 'Cours interactif — Compter les entités dans un échantillon de matière',
            href: 'seq06/sequence06_Compter-les-quantites-de-matiere.html' },
        ]
      },
      {
        section: '🎮 Jeux interactifs',
        items: [
          { icon: '🎮', label: 'Le Code d\'Avogadro — Escape game',
            href: 'seq06/jeu06_code-avogadro.html' },
        ]
      },
      {
        section: '✏️ Flashcards, exercices et quiz',
        items: [
          { icon: '📝', label: 'Quiz de révision',
            href: 'seq06/sequence06_quiz_revision.html' },
        ]
      }
    ]
  },

  /* ── Séq. 07 ── */
  {
    id: 7, num: '07',
    titre: 'Transformation chimique',
    sous_titre: 'Équation de réaction · Réactif limitant · Endothermique/exothermique · Synthèse',
    icone: 'reflux', iconSuffix: 'seq07',
    ressources: [
      {
        section: '📖 Cours',
        items: [
          { icon: '📄', label: 'Fiche de cours — Transformation chimique',
            sub: 'PDF · Cours complet', href: 'seq07/fiche-de-cours-07.pdf' },
          { icon: '🎓', label: 'Cours interactif — Transformation chimique',
            href: 'seq07/sequence07_transformation_chimique.html' },
        ]
      },
      {
        section: '🎮 Jeux interactifs',
        items: [
          { icon: '🔜', label: 'Jeu interactif — Transformation chimique',
            sub: 'À venir', href: null }
        ]
      },
      {
        section: '✏️ Flashcards, exercices et quiz',
        items: [
          { icon: '⚖️', label: 'Ajustez des équations — PCCL',
            sub: 'Exercice interactif · Stœchiométrie',
            href: 'https://www.pccl.fr/physique_chimie_college_lycee/lycee/seconde/ajuster_stoechiometrie_1_flash.htm' },
          { icon: '⚖️', label: 'Ajustez des équations — Ac. Normandie',
            sub: 'Exercice interactif · Équilibrage d\'équations',
            href: 'https://physique-chimie.ac-normandie.fr/spip.php?article222' },
        ]
      }
    ]
  },

  /* ── Séq. 08 ── */
  {
    id: 8, num: '08',
    titre: 'Transformation physique',
    sous_titre: 'Changement d\'état · Transfert thermique · Énergie massique de changement d\'état',
    icone: 'melt',
    ressources: [
      {
        section: '📖 Cours',
        items: [
          { icon: '📄', label: 'Fiche de cours — Transformation physique',
            sub: 'PDF · Cours complet', href: 'seq08/fiche-de-cours-08.pdf' },
          { icon: '🎓', label: 'Cours interactif — Transformation physique',
            href: 'seq08/sequence08-transformation-physique.html' },
        ]
      },
      {
        section: '🎮 Jeux interactifs',
        items: [
          { icon: '🎮', label: 'Escape Game — Centrale en danger',
            sub: 'Transformations physiques · Changements d\'état & énergie',
            href: 'seq08/sequence08-escape_game_centrale_thermique.html', cta: 'Jouer →' },
        ]
      },
      {
        section: '✏️ Flashcards, exercices et quiz',
        items: [
          { icon: '📝', label: 'Quiz de révision — Transformation physique',
            sub: '30 questions · 3 niveaux de difficulté',
            href: 'seq08/sequence08_quiz_revision.html' },
        ]
      }
    ]
  },

  /* ── Séq. 09 ── */
  {
    id: 9, num: '09',
    titre: 'Transformation nucléaire',
    sous_titre: 'Isotopes · Désintégration radioactive · Fission · Fusion · Lois de Soddy',
    icone: 'nuclear', iconSuffix: 'seq09p',
    ressources: [
      {
        section: '📖 Cours',
        items: [
          { icon: '📄', label: 'Fiche de cours — Transformation nucléaire',
            sub: 'PDF · Cours complet', href: 'seq09/fiche-de-cours-09.pdf' },
          { icon: '🎓', label: 'Cours interactif — Transformation nucléaire',
            sub: 'Radioactivité · Équations nucléaires · Fission · Fusion · Application Curie',
            href: 'seq09/sequence09-transformations-nucleaires.html' },
        ]
      },
      {
        section: '🎮 Jeux interactifs',
        items: [
          { icon: '🎮', label: 'Escape Game — Opération ITER : la centrale en danger !',
            sub: 'Mode Alerte 15 min · Mode Mission 50 min · Pièce secrète culture',
            href: 'seq09/seq09-escape-game.html', cta: 'Jouer →' },
        ]
      },
      {
        section: '✏️ Flashcards, exercices et quiz',
        items: [
          { icon: '📝', label: 'Quiz de révision — 3 niveaux',
            sub: 'Questions · Facile · Intermédiaire · Difficile',
            href: 'seq09/sequence09_quiz_revision.html' },
        ]
      }
    ]
  },

  /* ── Séq. 10 ── */
  {
    id: 10, num: '10',
    titre: 'Vision et Images',
    sous_titre: 'Propagation · Snell-Descartes · Spectres · Lentilles · Modèle de l\'œil',
    icone: 'eye',
    ressources: [
      {
        section: '📖 Cours',
        items: [
          { icon: '📄', label: 'Fiche de cours — Vision et image',
            sub: 'PDF · Cours complet', href: 'seq10/fiche-de-cours-10.pdf' },
          { icon: '🖼️', label: 'Cours interactif complet',
            imgSrc: 'seq10/couche%20soleil.jpg',
            href: 'seq10/sequence10_vision_image.html' },
        ]
      },
      {
        section: '🎮 Jeux interactifs',
        items: [
          { icon: '🔭', label: 'Escape Game — L\'Académie des Savants de la Lumière',
            sub: 'Mode Express 15 min · Mode Complet 50 min · Salle secrète Fresnel',
            href: 'seq10/sequence10-jeu.html', cta: 'Jouer →' },
        ]
      },
      { section: '✏️ Flashcards, exercices et quiz', items: [] }
    ]
  },

  /* ── Séq. 11 ── */
  {
    id: 11, num: '11',
    titre: 'Émission et perception d\'un son',
    sous_titre: 'Signal sonore · Période · Fréquence · Hauteur · Timbre · Intensité sonore',
    icone: 'wave',
    ressources: [
      {
        section: '📖 Cours',
        items: [
          { icon: '📄', label: 'Émission et perception d\'un son',
            sub: 'PDF · Cours complet', href: 'seq11/fiche-de-cours-11.pdf' },
          { icon: '🎓', label: 'Cours interactif — Émission et perception d\'un son',
            href: 'seq11/sequence11_emission_perception_son.html' },
        ]
      },
      {
        section: '🎮 Jeux interactifs',
        items: [
          { icon: '🎮', label: 'Escape game — Émission et perception d\'un son',
            href: 'seq11/sequence11-escape-game.html' },
        ]
      },
      {
        section: '✏️ Flashcards, exercices et quiz',
        items: [
          { icon: '📝', label: 'Quiz de révision — 3 niveaux',
            sub: 'Questions · Facile · Intermédiaire · Difficile',
            href: 'seq11/sequence11_quiz_revision.html' },
        ]
      }
    ]
  },

  /* ── Séq. 12 ── */
  {
    id: 12, num: '12',
    titre: 'Signaux et capteurs',
    sous_titre: 'Tension · Intensité · Loi des mailles · Loi des nœuds · Loi d\'Ohm · Capteurs',
    icone: 'satellite',
    ressources: [
      {
        section: '📖 Cours',
        items: [
          { icon: '📄', label: 'Fiche de cours — Signaux et capteurs',
            sub: 'PDF · Cours complet', href: 'seq12/fiche-de-cours-12.pdf' },
          { icon: '🎓', label: 'Cours interactif — Signaux et capteurs',
            href: 'seq12/sequence12_signaux_capteurs.html' },
        ]
      },
      {
        section: '🎮 Jeux interactifs',
        items: [
          { icon: '🔐', label: 'Escape game — Transmettre un signal à travers les époques',
            sub: 'Mode Flash 15 min · Mode Explorateur 50 min · Pièce secrète Edison',
            href: 'seq12/escape_seq12_signaux_capteurs.html' },
        ]
      },
      {
        section: '✏️ Flashcards, exercices et quiz',
        items: [
          { icon: '📝', label: 'Quiz de révision — 3 niveaux',
            sub: '30 questions · Facile · Intermédiaire · Difficile',
            href: 'seq12/sequence12_quiz_revision.html' },
        ]
      }
    ]
  },
];


/* ─────────────────────────────────────────────
   RENDU HTML
───────────────────────────────────────────── */

/** Génère un lien ressource */
function renderItem(item) {
  if (!item.href) {
    // Item désactivé (à venir)
    return `
      <div class="resource-link" data-type="jeu" style="opacity:0.5;cursor:default;">
        <span class="icon">${item.icon}</span>
        <div>
          <div class="label">${item.label}</div>
          ${item.sub ? `<div class="sub">${item.sub}</div>` : ''}
        </div>
      </div>`;
  }
  const iconHtml = item.imgSrc
    ? `<img src="${item.imgSrc}" alt="" style="width:32px;height:32px;border-radius:6px;object-fit:cover;flex-shrink:0;">`
    : `<span class="icon">${item.icon}</span>`;
  const cta = item.cta || 'Ouvrir →';
  return `
    <a class="resource-link" href="${item.href}" target="_blank">
      ${iconHtml}
      <div>
        <div class="label">${item.label}</div>
        ${item.sub ? `<div class="sub">${item.sub}</div>` : ''}
      </div>
      <span style="margin-left:auto;font-size:0.85rem;color:#0e7490;">${cta}</span>
      <span class="type-dot"></span>
    </a>`;
}

/** Génère une sous-section (📖 / 🎮 / ✏️) */
function renderSection(section) {
  return `
    <div style="margin-bottom:18px;">
      <div class="section-label">${section.section}</div>
      ${section.items.map(renderItem).join('')}
    </div>`;
}

/** Génère le header d'un panneau avec image de fond optionnelle */
function renderPanelHeader(seq) {
  const bgStyle = seq.headerBg
    ? `style="background:linear-gradient(rgba(255,255,255,0.85),rgba(255,255,255,0.85)),url('${seq.headerBg}');background-size:cover;background-position:center;border-radius:10px;padding:16px;"`
    : '';
  const iconHtml = getIcon(seq.icone, seq.iconSuffix);
  return `
    <div class="seq-panel-header" ${bgStyle}>
      <div class="big-num">${seq.num}</div>
      <div style="flex:1;">
        <h3>${seq.titre}</h3>
        <p>${seq.sous_titre}</p>
      </div>
      <div style="flex-shrink:0;">${iconHtml}</div>
    </div>`;
}

/** Génère un panneau complet et l'injecte dans le DOM */
function renderPanel(seq) {
  const el = document.getElementById('seq-panel-' + seq.id);
  if (!el) return;
  el.innerHTML =
    renderPanelHeader(seq) +
    seq.ressources.map(renderSection).join('');
}

/** Point d'entrée : génère tous les panneaux au chargement */
document.addEventListener('DOMContentLoaded', () => {
  SEQUENCES.forEach(renderPanel);
});
