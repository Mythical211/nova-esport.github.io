/* ═══════════════════════════════════════════════════════════
    HAMDAOUI SALIM - BAH DIAWO ALPHA - 5TD 
   ───────────────────────────────────────────────────────────
   Ce fichier gère :
   1. Le header qui se condense au scroll
   2. L'ouverture/fermeture du menu hamburger (mobile)
   3. Le lien actif dans le menu (selon la page actuelle)
   4. L'animation "apparition au scroll"
   5. Le panier (stocké en local dans le navigateur)
   6. Les filtres de la boutique
   7. Le sélecteur de taille (fiche produit)

   ⚠️ Aucun appel à une base de données ou un serveur.
   Tout est purement visuel / local au navigateur.
═══════════════════════════════════════════════════════════ */

/* On attend que la page HTML soit complètement chargée avant
   de lancer le JS, sinon il essaierait de manipuler des
   éléments qui n'existent pas encore. */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── GESTION DES COOKIES ─────────────────────────────── */
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAcceptBtn = document.getElementById('cookie-accept');
  const cookieRefuseBtn = document.getElementById('cookie-refuse');
  const COOKIE_NAME = 'nova_cookies_accepted';
  const COOKIE_EXPIRY = 365 * 24 * 60 * 60 * 1000; 
  

  function setCookie(name, value, expiryMs) {
    const d = new Date();
    d.setTime(d.getTime() + expiryMs);
    const expires = 'expires=' + d.toUTCString();
    document.cookie = name + '=' + value + ';' + expires + ';path=/';
  }

  // Affiche toujours la bannière à chaque ouverture du site
  if (cookieBanner) {
    document.body.style.overflow = 'hidden';
  }

  // Clic sur "Accepter tous"
  if (cookieAcceptBtn) {
    cookieAcceptBtn.addEventListener('click', () => {
      setCookie(COOKIE_NAME, 'all', COOKIE_EXPIRY);
      cookieBanner.classList.add('hidden');
      document.body.style.overflow = '';
    });
  }

  // Clic sur "Nécessaires uniquement"
  if (cookieRefuseBtn) {
    cookieRefuseBtn.addEventListener('click', () => {
      setCookie(COOKIE_NAME, 'necessary', COOKIE_EXPIRY);
      cookieBanner.classList.add('hidden');
      document.body.style.overflow = '';
    });
  }



  /* ─── 1. HEADER QUI SE CONDENSE AU SCROLL ─────────────── */
  const header = document.querySelector('body > header');

  /* À chaque fois que l'utilisateur scrolle... */
  window.addEventListener('scroll', () => {
    /* ...si on a scrollé de plus de 60px, on ajoute la classe
       "scrolle" au header (le CSS s'occupe du reste) */
    if (window.scrollY > 60) {
      header.classList.add('scrolle');
    } else {
      header.classList.remove('scrolle');
    }
  });


  /* ─── 2. MENU HAMBURGER (MOBILE) ──────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const menuMobile = document.querySelector('body > nav');

  /* Si les deux éléments existent sur la page... */
  if (hamburger && menuMobile) {

    /* Clic sur le hamburger → on ouvre/ferme le menu */
    hamburger.addEventListener('click', () => {
      /* classList.toggle ajoute la classe si absente, l'enlève si présente.
         Il renvoie true si la classe a été AJOUTÉE. */
      const estOuvert = hamburger.classList.toggle('ouvert');
      menuMobile.classList.toggle('ouvert', estOuvert);

      /* Bloque le scroll de la page quand le menu est ouvert */
      document.body.style.overflow = estOuvert ? 'hidden' : '';
    });

    /* Quand on clique sur un lien du menu → on le ferme */
    document.querySelectorAll('body > nav a').forEach(lien => {
      lien.addEventListener('click', () => {
        hamburger.classList.remove('ouvert');
        menuMobile.classList.remove('ouvert');
        document.body.style.overflow = '';
      });
    });

    /* Si on clique en dehors du menu → on le ferme aussi */
    document.addEventListener('click', (e) => {
      /* e.target = l'élément cliqué.
         contains() vérifie si cet élément est dans le header/menu */
      if (!header.contains(e.target) && !menuMobile.contains(e.target)) {
        hamburger.classList.remove('ouvert');
        menuMobile.classList.remove('ouvert');
        document.body.style.overflow = '';
      }
    });
  }


  /* ─── 3. LIEN ACTIF DANS LE MENU ──────────────────────── */
  /* On regarde quel fichier HTML est affiché actuellement.
     window.location.pathname = chemin complet (ex: "/shop.html")
     .split('/').pop() = on prend ce qui est après le dernier "/" */
  const pageActuelle = window.location.pathname.split('/').pop() || 'index.html';

  /* On ajoute la classe "actif" au lien qui correspond */
  document.querySelectorAll('body > header nav a, body > nav a').forEach(lien => {
    if (lien.getAttribute('href') === pageActuelle) {
      lien.classList.add('actif');
    }
  });


  /* ─── 4. APPARITION AU SCROLL ─────────────────────────── */
  /* On cherche tous les éléments avec la classe "apparait" */
  const elementsApparaitre = document.querySelectorAll('.apparait');

  if (elementsApparaitre.length > 0) {
    /* IntersectionObserver = outil qui surveille quand un
       élément entre dans l'écran. */
    const observateur = new IntersectionObserver((entrees) => {
      entrees.forEach(entree => {
        /* Si l'élément est visible à l'écran */
        if (entree.isIntersecting) {
          entree.target.classList.add('visible');
          /* On arrête de l'observer une fois apparu */
          observateur.unobserve(entree.target);
        }
      });
    }, { threshold: 0.1 });  /* 0.1 = visible dès 10% à l'écran */

    elementsApparaitre.forEach(el => observateur.observe(el));
  }



  /* ─── 6. PETIT MESSAGE FLOTTANT (toast) ───────────────── */
  /* Affiche un message en bas de l'écran pendant ~3 secondes */
  function afficherMessage(texte) {
    /* On crée une <div> de toutes pièces */
    const message = document.createElement('div');
    message.textContent = texte;
    /* Styles directement en JS (plus simple qu'un fichier CSS dédié) */
    message.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: #1e1535;
      border: 1px solid rgba(168,85,247,0.5);
      color: #e8e0f5;
      padding: 12px 24px;
      border-radius: 12px;
      font-family: 'Josefin Sans', sans-serif;
      font-weight: 600;
      z-index: 9999;
      box-shadow: 0 8px 32px rgba(168,85,247,0.3);
    `;
    document.body.appendChild(message);

    /* On l'enlève au bout de 2,8 secondes */
    setTimeout(() => message.remove(), 2800);
  }


  /* ─── 7. FILTRES DE LA BOUTIQUE ───────────────────────── */
  /* (utilisé sur shop.html) */
  const boutonsFiltres = document.querySelectorAll('.filtres button');
  boutonsFiltres.forEach(bouton => {
    bouton.addEventListener('click', () => {
      /* On enlève "actif" de tous les boutons */
      boutonsFiltres.forEach(b => b.classList.remove('actif'));
      /* On l'ajoute uniquement au bouton cliqué */
      bouton.classList.add('actif');

      /* On récupère la catégorie cliquée (data-filtre dans le HTML) */
      const categorie = bouton.dataset.filtre;

      /* On affiche/cache les produits selon leur catégorie */
      document.querySelectorAll('.produit').forEach(produit => {
        if (categorie === 'tout' || produit.dataset.categorie === categorie) {
          produit.style.display = 'flex';
        } else {
          produit.style.display = 'none';
        }
      });
    });
  });


  /* ─── 8. SÉLECTEUR DE TAILLE (fiche produit) ──────────── */
  const boutonsTailles = document.querySelectorAll('.tailles button');
  boutonsTailles.forEach(bouton => {
    bouton.addEventListener('click', () => {
      boutonsTailles.forEach(b => b.classList.remove('actif'));
      bouton.classList.add('actif');
    });
  });

});
