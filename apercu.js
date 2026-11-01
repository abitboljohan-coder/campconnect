// « Recevoir l'aperçu de mon camping » : le gérant tape le nom de son camping, il
// apparaît en direct dans un téléphone, puis il laisse son email.
// La demande part dans la table `candidatures` (comme le formulaire pilote), ce qui
// envoie l'alerte email habituelle. S'affiche dans chaque <section data-apercu>.
(function () {
  var SUPABASE = 'https://tswpintevokeasteyjno.supabase.co/rest/v1/candidatures';
  var CLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzd3BpbnRldm9rZWFzdGV5am5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwNDM2OTksImV4cCI6MjA5OTYxOTY5OX0.cepTJDe0IlEoevZCDiAsDKLo9BNqqdwWF9O5D9LKRE0';
  var COULEURS = [
    { nom: 'Lagon', a: '#1b7f93', b: '#7fb7a4' },
    { nom: 'Forêt', a: '#23423A', b: '#6f9a72' },
    { nom: 'Corail', a: '#d9604a', b: '#f2a65a' },
    { nom: 'Marine', a: '#2d4a8a', b: '#6f8fd1' }
  ];
  var EXEMPLES = ['Les Pins Dorés', 'La Plage Blanche', 'Le Moulin du Lac', 'Les Dunes'];

  var css = `
.ap-sect{background:#1a332b;position:relative;overflow:hidden;padding:clamp(64px,9vw,112px) 16px}
.ap-sect:before{content:'';position:absolute;inset:-20% -10% auto auto;width:620px;height:620px;border-radius:50%;
  background:radial-gradient(circle,rgba(121,219,220,.16),transparent 65%);pointer-events:none}
.ap-sect:after{content:'';position:absolute;inset:auto auto -30% -15%;width:560px;height:560px;border-radius:50%;
  background:radial-gradient(circle,rgba(250,128,114,.14),transparent 65%);pointer-events:none}
.ap-wrap{max-width:1060px;margin:0 auto;display:grid;grid-template-columns:1.05fr .95fr;column-gap:clamp(32px,6vw,80px);
  grid-template-areas:'intro stage' 'form stage';grid-template-rows:auto 1fr;
  align-items:center;position:relative;z-index:1;font-family:'DM Sans',system-ui,sans-serif}
.ap-intro{grid-area:intro;align-self:end}.ap-fz{grid-area:form;align-self:start}
.ap-tag{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:700;letter-spacing:.4px;
  color:#79DBDC;background:rgba(121,219,220,.1);border:1px solid rgba(121,219,220,.25);border-radius:30px;padding:6px 14px}
.ap-tag i{width:7px;height:7px;border-radius:50%;background:#79DBDC;box-shadow:0 0 0 0 rgba(121,219,220,.6);animation:apPulse 2s infinite}
.ap-h{font-family:'Playfair Display',Georgia,serif;font-weight:700;color:#fff;font-size:clamp(30px,4.4vw,48px);
  line-height:1.1;margin:18px 0 14px;letter-spacing:-.5px}
.ap-h em{font-style:italic;color:#FA8072}
.ap-p{color:rgba(234,245,240,.72);font-size:16px;line-height:1.6;max-width:470px;margin:0 0 28px}
.ap-form{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:22px;padding:22px;
  backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);max-width:480px}
.ap-l{display:block;font-size:12px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;color:rgba(234,245,240,.6);margin:0 0 7px}
.ap-in{width:100%;box-sizing:border-box;font:500 16px 'DM Sans',system-ui,sans-serif;color:#fff;background:rgba(0,0,0,.18);
  border:1.5px solid rgba(255,255,255,.14);border-radius:14px;padding:14px 16px;outline:none;transition:border-color .2s,box-shadow .2s,background .2s}
.ap-in::placeholder{color:rgba(234,245,240,.35)}
.ap-in:focus{border-color:#79DBDC;box-shadow:0 0 0 4px rgba(121,219,220,.15);background:rgba(0,0,0,.25)}
.ap-row{margin-bottom:16px}
.ap-sw{display:flex;align-items:center;gap:10px;margin:2px 0 20px;flex-wrap:wrap}
.ap-sw span{font-size:13px;color:rgba(234,245,240,.6);margin-right:4px}
.ap-dot{width:30px;height:30px;border-radius:50%;border:0;cursor:pointer;padding:0;position:relative;
  box-shadow:0 0 0 2px rgba(255,255,255,.12);transition:transform .2s,box-shadow .2s}
.ap-dot:hover{transform:scale(1.1)}
.ap-dot[aria-pressed=true]{box-shadow:0 0 0 2px #1a332b,0 0 0 4px #fff}
.ap-btn{width:100%;border:0;cursor:pointer;font:700 16px 'DM Sans',system-ui,sans-serif;color:#fff;
  background:linear-gradient(135deg,#FA8072,#e8664f);border-radius:40px;padding:16px 22px;
  box-shadow:0 12px 30px -8px rgba(250,128,114,.6);transition:transform .2s,box-shadow .2s,opacity .2s}
.ap-btn:hover{transform:translateY(-2px);box-shadow:0 16px 36px -8px rgba(250,128,114,.7)}
.ap-btn:disabled{opacity:.7;cursor:wait;transform:none}
.ap-fine{font-size:12.5px;color:rgba(234,245,240,.5);margin:12px 0 0;line-height:1.5;text-align:center}
.ap-err{font-size:13px;color:#ffb4a6;margin:8px 0 0;min-height:0}
.ap-hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}
.ap-ok{display:none;max-width:480px;background:rgba(255,255,255,.06);border:1px solid rgba(121,219,220,.3);border-radius:22px;padding:26px}
.ap-ok b{display:block;font-family:'Playfair Display',Georgia,serif;font-size:24px;color:#fff;margin-bottom:8px}
.ap-ok p{color:rgba(234,245,240,.75);font-size:15px;line-height:1.6;margin:0}
.ap-fb{margin-top:12px;padding:12px 14px;border-radius:12px;background:rgba(250,128,114,.12);border:1px solid rgba(250,128,114,.35);
  font-size:14px;line-height:1.55;color:#ffd9d1}
.ap-fb a{color:#fff;font-weight:700}

/* Téléphone */
.ap-stage{grid-area:stage;display:flex;justify-content:center}
.ap-ph{width:300px;height:610px;border-radius:48px;background:#0d1512;padding:11px;position:relative;
  box-shadow:0 50px 100px -30px rgba(0,0,0,.65),0 0 0 1.5px rgba(255,255,255,.12) inset;
  animation:apFloat 7s ease-in-out infinite}
.ap-sc{width:100%;height:100%;border-radius:38px;overflow:hidden;background:#f8f6ef;position:relative;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#1d2a26}
.ap-isl{position:absolute;top:9px;left:50%;transform:translateX(-50%);width:92px;height:26px;border-radius:20px;background:#0d1512;z-index:3}
.ap-sb{display:flex;justify-content:space-between;align-items:center;padding:13px 26px 0;font-size:12px;font-weight:700;height:30px}
.ap-bat{width:22px;height:11px;border:1.5px solid currentColor;border-radius:3px;position:relative;opacity:.85}.ap-bat:after{content:"";position:absolute;inset:1.5px 5px 1.5px 1.5px;background:currentColor;border-radius:1px}
.ap-hd{display:flex;align-items:center;gap:10px;padding:10px 16px 12px;border-bottom:1px solid rgba(0,0,0,.06)}
.ap-ic{width:32px;height:32px;border-radius:9px;display:grid;place-items:center;font-size:17px;flex:none;transition:background .5s}
.ap-nm{font-weight:800;font-size:14.5px;line-height:1.2;flex:1;min-width:0;overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow-wrap:anywhere}
.ap-cur{display:inline-block;width:2px;height:15px;background:currentColor;vertical-align:-2px;margin-left:1px;animation:apBlink 1s steps(1) infinite}
.ap-av{width:30px;height:30px;border-radius:50%;border:2px solid rgba(0,0,0,.12);display:grid;place-items:center;font-size:14px;flex:none}
.ap-hero{margin:14px 14px 0;border-radius:22px;padding:16px;color:#fff;position:relative;overflow:hidden;transition:background .6s}
.ap-hero:after{content:'⛺';position:absolute;right:-6px;bottom:-14px;font-size:80px;opacity:.13}
.ap-hero small{font-size:12px;font-weight:700;opacity:.92}
.ap-hero strong{display:block;font-size:22px;margin:4px 0 12px}
.ap-chips{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}
.ap-chips span{font-size:10.5px;font-weight:700;background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.3);border-radius:20px;padding:5px 9px}
.ap-hb{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.ap-hb span{font-size:11px;font-weight:800;white-space:nowrap;text-align:center;border-radius:14px;padding:9px 4px;border:1px solid rgba(255,255,255,.45)}
.ap-hb span:first-child{background:#fff;transition:color .6s}
.ap-tiles{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 14px 0}
.ap-tiles div{background:#fff;border-radius:14px;padding:10px;font-size:12px;font-weight:800;display:flex;align-items:center;gap:7px;box-shadow:0 1px 0 rgba(0,0,0,.04)}
.ap-tiles i{font-style:normal;width:24px;height:24px;border-radius:7px;display:grid;place-items:center;background:#f1efe8;font-size:13px}
.ap-gt{font-size:13.5px;font-weight:800;margin:14px 16px 8px}
.ap-gc{background:#fff;border-radius:16px;margin:0 14px 8px;padding:10px;display:flex;gap:10px;align-items:center}
.ap-gc>i{font-style:normal;width:38px;height:38px;border-radius:11px;background:#e6f0ef;display:grid;place-items:center;font-size:19px;flex:none}
.ap-gc b{display:block;font-size:12.5px}
.ap-gc small{font-size:10.5px;color:#6b7772}
.ap-gc em{margin-left:auto;font-style:normal;font-size:10.5px;font-weight:800;color:#fff;border-radius:20px;padding:6px 10px;transition:background .6s}
.ap-tab{position:absolute;left:8px;right:8px;bottom:8px;height:54px;background:rgba(255,255,255,.96);border-radius:22px;
  box-shadow:0 -2px 20px rgba(0,0,0,.08);display:grid;grid-template-columns:repeat(5,1fr);align-items:center;text-align:center;font-size:9px;color:#8a948f;font-weight:600}
.ap-tab span:before{content:attr(data-i);display:block;font-size:16px;margin-bottom:2px;filter:grayscale(1);opacity:.6}
.ap-tab span.on{font-weight:800}
.ap-tab span.on:before{filter:none;opacity:1}
.ap-notif{position:absolute;left:10px;right:10px;top:10px;z-index:4;background:rgba(255,255,255,.97);border-radius:18px;padding:11px 12px;
  display:flex;gap:10px;align-items:center;box-shadow:0 12px 30px rgba(0,0,0,.2);transform:translateY(-130%);transition:transform .6s cubic-bezier(.2,.9,.25,1.2)}
.ap-notif.on{transform:translateY(0)}
.ap-notif i{font-style:normal;width:30px;height:30px;border-radius:9px;background:#23423A;display:grid;place-items:center;font-size:15px;flex:none}
.ap-notif b{display:block;font-size:12px}
.ap-notif small{font-size:11px;color:#55605b}
.ap-glow{position:absolute;inset:auto 10% -40px;height:80px;background:radial-gradient(ellipse,rgba(121,219,220,.35),transparent 70%);filter:blur(10px);z-index:-1}

@keyframes apFloat{0%,100%{translate:0 0}50%{translate:0 -10px}}
@keyframes apBlink{50%{opacity:0}}
@keyframes apPulse{0%{box-shadow:0 0 0 0 rgba(121,219,220,.55)}70%{box-shadow:0 0 0 9px rgba(121,219,220,0)}100%{box-shadow:0 0 0 0 rgba(121,219,220,0)}}
@keyframes apPop{0%{transform:scale(1)}40%{transform:scale(1.035)}100%{transform:scale(1)}}
.ap-pop{animation:apPop .35s ease}

@media (max-width:860px){
  .ap-wrap{grid-template-columns:1fr;grid-template-areas:'intro' 'stage' 'form';grid-template-rows:auto}
  .ap-p{margin-bottom:24px}
  .ap-ph{width:280px;height:390px;border-radius:44px 44px 0 0;padding-bottom:0;animation:none;
    -webkit-mask-image:linear-gradient(#000 78%,transparent);mask-image:linear-gradient(#000 78%,transparent)}
  .ap-sc{border-radius:36px 36px 0 0}
  .ap-tab,.ap-glow{display:none}
  .ap-stage{margin-bottom:8px}
  .ap-p,.ap-form,.ap-ok{max-width:none}
}
@media (max-width:380px){.ap-ph{width:260px}.ap-hero strong{font-size:19px}.ap-form{padding:18px}.ap-tiles div{font-size:11px}}
@media (prefers-reduced-motion:reduce){.ap-ph,.ap-tag i,.ap-cur{animation:none}}
`;

  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }

  function salut() {
    var h = new Date().getHours();
    return h < 12 ? 'Bonjour ☀️' : h < 18 ? 'Bon après-midi ☀️' : 'Bonsoir 🌙';
  }

  function monter(sect) {
    sect.classList.add('ap-sect');
    sect.innerHTML = `
<div class="ap-wrap">
  <div class="ap-intro">
    <span class="ap-tag"><i></i>Aperçu gratuit, sans engagement</span>
    <h2 class="ap-h">Voyez <em>votre camping</em> dans l'app.</h2>
    <p class="ap-p">Tapez son nom : il apparaît dans le téléphone. Laissez votre email, et nous vous envoyons l'aperçu complet de votre camping dans CampConnect, prêt à montrer à votre équipe.</p>
  </div>
  <div class="ap-fz">
    <form class="ap-form" novalidate>
      <div class="ap-row">
        <label class="ap-l" for="apNom">Nom du camping</label>
        <input class="ap-in" id="apNom" name="camping" type="text" maxlength="80" autocomplete="organization" placeholder="Camping Les Pins Dorés" required>
      </div>
      <div class="ap-sw" role="group" aria-label="Couleur de votre camping"><span>Votre couleur</span></div>
      <div class="ap-row">
        <label class="ap-l" for="apMail">Votre email</label>
        <input class="ap-in" id="apMail" name="email" type="email" maxlength="120" autocomplete="email" inputmode="email" placeholder="vous@votre-camping.fr" required>
      </div>
      <input class="ap-hp" name="site_web" tabindex="-1" autocomplete="off" aria-hidden="true">
      <button class="ap-btn" type="submit">Recevoir l'aperçu de mon camping →</button>
      <p class="ap-err" role="alert"></p>
      <p class="ap-fine">Réponse sous 48 h. Votre email sert uniquement à vous envoyer l'aperçu.</p>
    </form>
    <div class="ap-ok" role="status"><b></b><p></p></div>
  </div>
  <div class="ap-stage" aria-hidden="true">
    <div class="ap-ph"><div class="ap-glow"></div><div class="ap-sc">
      <div class="ap-isl"></div>
      <div class="ap-notif"><i>⛺</i><div><b>CampConnect</b><small></small></div></div>
      <div class="ap-sb"><span>9:41</span><span class="ap-bat"></span></div>
      <div class="ap-hd"><div class="ap-ic">⛺</div><div class="ap-nm"></div><div class="ap-av">👤</div></div>
      <div class="ap-hero"><small></small><strong>🏄‍♀️ Julie</strong>
        <div class="ap-chips"><span>Groupes actifs</span><span>Animations du jour</span></div>
        <div class="ap-hb"><span>🗺️ La carte</span><span>📅 Programme</span></div>
      </div>
      <div class="ap-tiles"><div><i>🛠️</i>Signaler</div><div><i>📣</i>Annonces</div></div>
      <div class="ap-gt">Groupes actifs maintenant</div>
      <div class="ap-gc"><i>🍹</i><div><b>Apéro pétanque</b><small>Terrain de pétanque · 18:30</small></div><em>Ouvert</em></div>
      <div class="ap-gc"><i>🥾</i><div><b>Rando au lever du soleil</b><small>Entrée principale · 7:00</small></div><em>Ouvert</em></div>
      <div class="ap-tab"><span class="on" data-i="⛺">Accueil</span><span data-i="👥">Groupes</span><span data-i="🗺️">Carte</span><span data-i="📅">Agenda</span><span data-i="ℹ️">Infos</span></div>
    </div></div>
  </div>
</div>`;

    var form = sect.querySelector('form'), nom = sect.querySelector('#apNom'), mail = sect.querySelector('#apMail');
    var btn = sect.querySelector('.ap-btn'), err = sect.querySelector('.ap-err'), ok = sect.querySelector('.ap-ok');
    var ecran = sect.querySelector('.ap-nm'), hero = sect.querySelector('.ap-hero'), ic = sect.querySelector('.ap-ic');
    var b1 = sect.querySelector('.ap-hb span'), pills = sect.querySelectorAll('.ap-gc em'), tab = sect.querySelector('.ap-tab .on');
    var notif = sect.querySelector('.ap-notif'), sw = sect.querySelector('.ap-sw');
    sect.querySelector('.ap-hero small').textContent = salut();

    var couleur = COULEURS[0];
    function peindre() {
      hero.style.background = 'linear-gradient(140deg,' + couleur.a + ',' + couleur.b + ')';
      ic.style.background = couleur.a + '22';
      b1.style.color = couleur.a;
      tab.style.color = couleur.a;
      pills.forEach(function (p) { p.style.background = couleur.a; });
    }
    COULEURS.forEach(function (c, i) {
      var d = el('button', 'ap-dot');
      d.type = 'button';
      d.style.background = 'linear-gradient(140deg,' + c.a + ',' + c.b + ')';
      d.setAttribute('aria-label', c.nom);
      d.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
      d.addEventListener('click', function () {
        couleur = c;
        sw.querySelectorAll('.ap-dot').forEach(function (x) { x.setAttribute('aria-pressed', x === d ? 'true' : 'false'); });
        peindre();
        hero.classList.remove('ap-pop'); void hero.offsetWidth; hero.classList.add('ap-pop');
      });
      sw.appendChild(d);
    });
    peindre();

    // Le nom s'écrit dans le téléphone (textContent : jamais de HTML injecté).
    var curseur = el('span', 'ap-cur');
    function afficher(txt, avecCurseur) {
      ecran.textContent = 'Camping ' + txt;
      if (avecCurseur) ecran.appendChild(curseur);
    }
    function nettoyer(v) { return v.replace(/^\s*camping\s+/i, '').trim(); }

    // Démo : des noms d'exemple s'écrivent seuls jusqu'à ce que le gérant tape le sien.
    var auto = !window.matchMedia('(prefers-reduced-motion: reduce)').matches, minuteur;
    function demo(i, n, efface) {
      if (!auto) return;
      var mot = EXEMPLES[i % EXEMPLES.length];
      afficher(mot.slice(0, n), true);
      if (!efface && n < mot.length) minuteur = setTimeout(function () { demo(i, n + 1); }, 85);
      else if (!efface) minuteur = setTimeout(function () { demo(i, n, true); }, 1800);
      else if (n > 0) minuteur = setTimeout(function () { demo(i, n - 1, true); }, 35);
      else minuteur = setTimeout(function () { demo(i + 1, 0); }, 300);
    }
    afficher(EXEMPLES[0], false);
    if (auto && 'IntersectionObserver' in window) {
      var vu = false;
      new IntersectionObserver(function (e) { if (e[0].isIntersecting && !vu) { vu = true; demo(0, 0); } }, { threshold: 0.3 }).observe(sect);
    }
    function stopDemo() { auto = false; clearTimeout(minuteur); }
    nom.addEventListener('focus', function () { stopDemo(); afficher(nettoyer(nom.value), true); });
    nom.addEventListener('input', function () { stopDemo(); afficher(nettoyer(nom.value), true); });
    nom.addEventListener('blur', function () { afficher(nettoyer(nom.value) || EXEMPLES[0], false); });

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      err.textContent = '';
      var camping = nettoyer(nom.value), email = mail.value.trim();
      if (camping.length < 2) { err.textContent = 'Indiquez le nom de votre camping.'; nom.focus(); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { err.textContent = 'Cet email ne semble pas valide.'; mail.focus(); return; }
      if (form.site_web.value) { return reussi(camping); } // robot : on ne garde rien

      btn.disabled = true;
      btn.textContent = 'Envoi en cours…';
      var donnees = {
        camping: camping,
        email: email,
        message: "Demande d'aperçu (formulaire express, " + location.pathname + '). Couleur choisie : ' + couleur.nom + ' (' + couleur.a + ').'
      };
      try {
        var res = await fetch(SUPABASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', apikey: CLE, Authorization: 'Bearer ' + CLE, Prefer: 'return=minimal' },
          body: JSON.stringify(donnees)
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        if (typeof gtag === 'function') gtag('event', 'generate_lead', { formulaire: 'apercu', page: location.pathname });
        reussi(camping);
      } catch (x) {
        console.error('Aperçu :', x);
        echec(donnees);
      }
    });

    function reussi(camping) {
      afficher(camping, false);
      notif.querySelector('small').textContent = 'Aperçu de « ' + camping + ' » en préparation';
      notif.classList.add('on');
      form.style.display = 'none';
      ok.querySelector('b').textContent = 'C’est noté !';
      ok.querySelector('p').textContent = 'Nous préparons l’aperçu du camping ' + camping + ' et vous l’envoyons sous 48 h. Regardez aussi vos courriers indésirables, au cas où.';
      ok.style.display = 'block';
    }

    function echec(d) {
      btn.disabled = false;
      btn.textContent = 'Réessayer';
      if (sect.querySelector('.ap-fb')) return;
      var fb = el('div', 'ap-fb', 'L’envoi n’a pas abouti. Écrivez-nous directement, votre demande est déjà pré-remplie : ');
      var a = el('a', '', 'contact@campconnect.fr');
      a.href = 'mailto:contact@campconnect.fr?subject=' + encodeURIComponent('Aperçu de mon camping : ' + d.camping) +
        '&body=' + encodeURIComponent('Camping : ' + d.camping + '\nEmail : ' + d.email + '\n' + d.message);
      fb.appendChild(a);
      form.appendChild(fb);
    }
  }

  function demarrer() {
    var sects = document.querySelectorAll('[data-apercu]');
    if (!sects.length) return;
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);
    sects.forEach(monter);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer);
  else demarrer();
})();
