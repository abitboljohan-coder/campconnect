// Suivi GA4 des actions clés : demande de démo, email, téléphone, stores, réseaux.
(function () {
  function envoyer(nom, params) { if (typeof gtag === 'function') gtag('event', nom, params || {}); }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    var h = a.getAttribute('href') || '', texte = (a.textContent || '').trim().slice(0, 60);
    if (h.indexOf('mailto:') === 0) envoyer('contact_email', { lien: texte });
    else if (h.indexOf('tel:') === 0) envoyer('contact_telephone', { lien: texte });
    else if (/#contact$/.test(h)) envoyer('demande_demo', { lien: texte, page: location.pathname });
    else if (/apps\.apple\.com|play\.google\.com/.test(h)) envoyer('telechargement_app', { store: /apple/.test(h) ? 'app_store' : 'google_play' });
    else if (/instagram\.com|tiktok\.com|linkedin\.com/.test(h)) envoyer('reseau_social', { reseau: h.split('/')[2] });
    else if (/\/video/.test(h)) envoyer('video_presentation', { lien: texte });
  });
})();
