(() => {
  'use strict';

  const config = window.DOCORA_CONFIG;
  const dictionary = window.DOCORA_COPY;
  const page = document.body.dataset.page || 'home';
  const allowed = ['tr', 'en', 'de'];

  // Language resolution
  const params = new URLSearchParams(window.location.search);
  const queryLang = params.get('lang');
  const preferredLang = (() => { try { return localStorage.getItem('docora-lang'); } catch { return null; } })();
  let lang = allowed.includes(queryLang) ? queryLang : (allowed.includes(preferredLang) ? preferredLang : 'tr');

  // Dark mode resolution with <meta name="color-scheme"> synchronization (Modern Web Guidance dark-mode-toggle)
  const metaColorScheme = document.querySelector('meta[name="color-scheme"]') || (() => {
    const el = document.createElement('meta');
    el.name = 'color-scheme';
    el.content = 'light dark';
    document.head.appendChild(el);
    return el;
  })();

  const storedTheme = (() => { try { return localStorage.getItem('docora-theme'); } catch { return null; } })();
  let theme = storedTheme === 'light' || storedTheme === 'dark'
    ? storedTheme
    : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  // Interactive mockup active screen state ('view' | 'scan' | 'sign')
  let currentPreviewScreen = 'view';

  const root = document.getElementById('app');
  const esc = value => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

  const link = filename => `${filename}?lang=${lang}`;
  const emailLink = () => `<a href="mailto:${esc(config.supportEmail)}">${esc(config.supportEmail)}</a>`;
  const interpolate = value => esc(value)
    .replaceAll('{developer}', esc(config.developerName))
    .replaceAll('{email}', emailLink());

  const svg = (name, size = 22) => {
    const paths = {
      file: '<path d="M7 3.5h7l5 5V20a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Z"/><path d="M14 3.5V9h5"/><path d="M9 13h6M9 17h6"/>',
      scan: '<path d="M4 9V5a1 1 0 0 1 1-1h4M15 4h4a1 1 0 0 1 1 1v4M20 15v4a1 1 0 0 1-1 1h-4M9 20H5a1 1 0 0 1-1-1v-4"/><path d="M7 12h10M9 9h6M9 15h6"/>',
      signature: '<path d="M3 17c2-4 3-5 4-5 2 0-1 7 1 7 1 0 3-4 4-4 1 0 0 4 2 4 1 0 2-3 3-3 1 0 2 2 4 0"/><path d="M4 6h16"/>',
      layers: '<rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M8.5 8h7M8.5 12h7M8.5 16h4"/><path d="M2.5 7v11a4 4 0 0 0 4 4"/>',
      arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
      external: '<path d="M13 5h6v6M11 13l8-8"/><path d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>',
      sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/>',
      moon: '<path d="M20.1 15.2A8.4 8.4 0 0 1 8.8 3.9 8.5 8.5 0 1 0 20.1 15.2Z"/>',
      check: '<path d="m5 12 4 4L19 6"/>',
      shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
      chevron: '<path d="m6 9 6 6 6-6"/>',
      menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
      mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>'
    };
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.file}</svg>`;
  };

  const logo = (size = 38) => `<img src="assets/logo.png" alt="Docora Logo" class="brand-logo" width="${size}" height="${size}" fetchpriority="high" decoding="async">`;

  // Top navigation bar adhering to Modern Web Guidance (navbar & popover)
  const topbar = t => `<header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="${link('index.html')}" aria-label="Docora — ${esc(t.nav.home)}">
        ${logo(38)}<span>docora<span class="brand-dot">.</span></span>
      </a>
      <nav id="primary-nav" class="site-nav" aria-label="${esc(t.nav.menu)}" popover="auto">
        <a ${page==='home'?'aria-current="page"':''} href="${link('index.html')}#features">${esc(t.nav.features)}</a>
        <a ${page==='support'?'aria-current="page"':''} href="${link('support.html')}">${esc(t.nav.support)}</a>
        <a ${page==='privacy'?'aria-current="page"':''} href="${link('privacy.html')}">${esc(t.nav.privacy)}</a>
        <a ${page==='terms'?'aria-current="page"':''} href="${link('terms.html')}">${esc(t.nav.terms)}</a>
      </nav>
      <div class="header-actions">
        <div class="lang-switch" role="group" aria-label="Language / Dil / Sprache">
          ${allowed.map(l => `<button type="button" data-lang="${l}" aria-pressed="${lang===l}" class="lang-button ${lang===l?'selected':''}" lang="${l}">${l.toUpperCase()}</button>`).join('')}
        </div>
        <button type="button" class="icon-button theme-toggle" aria-label="${esc(theme === 'dark' ? t.nav.themeLight : t.nav.themeDark)}" title="${esc(theme === 'dark' ? t.nav.themeLight : t.nav.themeDark)}">
          ${svg(theme === 'dark' ? 'sun' : 'moon', 19)}
        </button>
        <button type="button" class="icon-button menu-toggle" aria-label="${esc(t.nav.menu)}" aria-expanded="false" popovertarget="primary-nav" popovertargetaction="toggle" aria-controls="primary-nav">
          ${svg('menu', 22)}
        </button>
      </div>
    </div>
  </header>`;

  const footer = t => `<footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <a href="${link('index.html')}" class="footer-brand-name">
          ${logo(30)} <strong>docora<span class="brand-dot">.</span></strong>
        </a>
        <span>${esc(t.common.built)}</span>
      </div>
      <div class="footer-right">
        <div class="footer-links">
          <a href="${link('privacy.html')}">${esc(t.common.privacy)}</a>
          <a href="${link('terms.html')}">${esc(t.common.terms)}</a>
          <a href="${link('support.html')}">${esc(t.common.support)}</a>
        </div>
        <span class="copyright">© ${esc(config.year)} ${esc(config.developerName)}. ${esc(t.common.allRights)}</span>
      </div>
    </div>
  </footer>`;

  // Dynamic interactive workspace mockup showcasing Docora's 3 core screens
  const visual = t => {
    const isScan = currentPreviewScreen === 'scan';
    const isSign = currentPreviewScreen === 'sign';

    const filename = isScan ? t.home.scanFilename : isSign ? t.home.signFilename : t.home.previewFilename;
    const badge = isScan ? t.home.scanBadge : isSign ? t.home.signBadge : t.home.previewBadge;

    return `<div class="workspace" aria-label="Docora App Showcase">
      <div class="workspace-top">
        <span class="workspace-mini-logo">${logo(28)}</span>
        <div class="workspace-tabs" role="tablist" aria-label="Ekran Önizlemeleri">
          <button type="button" role="tab" aria-selected="${currentPreviewScreen==='view'}" class="workspace-tab ${currentPreviewScreen==='view'?'active':''}" data-screen="view">${esc(t.home.previewTabs.view)}</button>
          <button type="button" role="tab" aria-selected="${currentPreviewScreen==='scan'}" class="workspace-tab ${currentPreviewScreen==='scan'?'active':''}" data-screen="scan">${esc(t.home.previewTabs.scan)}</button>
          <button type="button" role="tab" aria-selected="${currentPreviewScreen==='sign'}" class="workspace-tab ${currentPreviewScreen==='sign'?'active':''}" data-screen="sign">${esc(t.home.previewTabs.sign)}</button>
        </div>
        <span class="status-pill"><i></i>${esc(badge)}</span>
      </div>

      <div class="workspace-canvas">
        <button type="button" class="floating-chip chip-scan" data-screen="scan" aria-label="Tarama Modu">
          ${svg('scan', 16)} <span>SCAN</span>
        </button>

        <div class="paper-shadow"></div>

        <div class="paper ${isScan ? 'paper-scan-mode' : isSign ? 'paper-sign-mode' : ''}">
          <div class="paper-header">
            <img src="assets/logo.png" class="paper-doc-logo" alt="" width="17" height="17">
            <span>${esc(filename)}</span>
            <span class="paper-menu">•••</span>
          </div>

          <div class="paper-main">
            ${isScan ? `
              <div class="scan-viewfinder">
                <div class="scan-corners"></div>
                <div class="scan-laser"></div>
                <div class="paper-accent"></div>
                <div class="paper-title-line"></div>
                <div class="paper-lines"><i></i><i></i><i></i></div>
              </div>
            ` : isSign ? `
              <div class="paper-accent"></div>
              <div class="paper-title-line"></div>
              <div class="paper-title-line short"></div>
              <div class="paper-lines"><i></i><i></i><i></i><i></i></div>
              <div class="paper-signature signed-stamp">
                <svg viewBox="0 0 140 42" width="130" height="40" fill="none">
                  <path d="M4 31C20 10 24 9 21 23c-2 11-7 15 1 11 9-6 16-24 18-21 2 4-10 27 0 19 6-4 15-18 19-13 3 3-5 14 0 13 12-3 17-12 27-11 7 1 13 3 23-6" stroke="#c80d25" stroke-width="2.2" stroke-linecap="round"/>
                </svg>
                <span class="cert-pill">${svg('shield', 13)} ${esc(t.home.signCert)}</span>
              </div>
            ` : `
              <div class="paper-accent"></div>
              <div class="paper-title-line"></div>
              <div class="paper-title-line short"></div>
              <div class="paper-lines"><i></i><i></i><i></i><i></i></div>
              <div class="paper-signature">
                <svg viewBox="0 0 140 42" width="130" height="40" fill="none">
                  <path d="M4 31C20 10 24 9 21 23c-2 11-7 15 1 11 9-6 16-24 18-21 2 4-10 27 0 19 6-4 15-18 19-13 3 3-5 14 0 13 12-3 17-12 27-11 7 1 13 3 23-6" stroke="#c80d25" stroke-width="1.8" stroke-linecap="round" opacity="0.6"/>
                </svg>
              </div>
            `}
          </div>

          <div class="paper-footer">
            <span>${esc(t.home.previewPage)}</span>
            <span class="paper-footer-brand"><img src="assets/logo.png" alt="" width="13" height="13"> DOCORA</span>
          </div>
        </div>

        <button type="button" class="floating-chip chip-sign" data-screen="sign" aria-label="İmza Modu">
          ${svg('signature', 16)} <span>PDF</span>
        </button>
      </div>

      <div class="workspace-bottom">
        <span>${svg('check', 16)} ${esc(t.home.previewNote)}</span>
        <div class="workspace-dots"><i></i><i></i><i></i></div>
      </div>
    </div>`;
  };

  const home = t => `<main id="main-content">
    <section class="hero">
      <div class="container hero-grid">
        <div class="hero-copy">
          <span class="eyebrow"><span class="eyebrow-line"></span>${esc(t.home.eyebrow)}</span>
          <h1>${esc(t.home.titleA)}<br><em>${esc(t.home.titleB)}</em></h1>
          <p class="hero-description">${esc(t.home.description)}</p>
          <div class="hero-actions">
            <a href="#features" class="button button-primary">${esc(t.home.primary)} ${svg('arrow', 18)}</a>
            <a href="${link('support.html')}" class="button button-ghost">${esc(t.home.secondary)} ${svg('arrow', 18)}</a>
          </div>
          <div class="hero-tags">
            <span>${svg('check', 15)} ${esc(t.home.trust1)}</span>
            <span>${svg('check', 15)} ${esc(t.home.trust2)}</span>
            <span>${svg('check', 15)} ${esc(t.home.trust3)}</span>
          </div>
        </div>
        <div class="hero-visual">${visual(t)}</div>
      </div>
    </section>

    <section id="features" class="section features-section">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="eyebrow">${esc(t.home.sectionEyebrow)}</span>
            <h2>${esc(t.home.sectionTitle)}</h2>
          </div>
          <p>${esc(t.home.sectionLead)}</p>
        </div>
        <div class="feature-grid">
          ${t.home.features.map((f, i) => `<article class="feature-card">
            <span class="feature-number">0${i + 1}</span>
            <div class="feature-icon">${svg(f.icon, 29)}</div>
            <h3>${esc(f.title)}</h3>
            <p>${esc(f.text)}</p>
          </article>`).join('')}
        </div>
      </div>
    </section>

    <section class="section premium-section">
      <div class="container">
        <div class="premium-panel">
          <div class="premium-glow"></div>
          <div class="premium-copy">
            <span class="eyebrow">${esc(t.home.proEyebrow)}</span>
            <h2>${esc(t.home.proTitle)}</h2>
            <p>${esc(t.home.proText)}</p>
            <a href="${link('terms.html')}#iap" class="premium-link">${esc(t.home.proLink)} ${svg('arrow', 18)}</a>
          </div>
          <div class="premium-graphic" aria-hidden="true">
            <div class="premium-shape shape-one"></div>
            <div class="premium-shape shape-two"></div>
            <div class="premium-shape shape-three"></div>
            <div class="premium-spark">✳</div>
          </div>
        </div>
      </div>
    </section>

    <section class="section trust-section">
      <div class="container">
        <div class="section-head trust-head">
          <div>
            <span class="eyebrow">${esc(t.home.legalEyebrow)}</span>
            <h2>${esc(t.home.legalTitle)}</h2>
          </div>
          <p>${esc(t.home.legalText)}</p>
        </div>
        <div class="legal-grid">
          ${[[t.home.privacyCard, t.home.privacyCardText, 'privacy.html', 'shield'],
             [t.home.termsCard, t.home.termsCardText, 'terms.html', 'file'],
             [t.home.supportCard, t.home.supportCardText, 'support.html', 'mail']].map(([title, body, path, icon]) => `
            <a class="legal-card" href="${link(path)}">
              <div class="legal-card-icon">${svg(icon, 24)}</div>
              <h3>${esc(title)}</h3>
              <p>${esc(body)}</p>
              <span class="legal-card-arrow">${svg('arrow', 20)}</span>
            </a>`).join('')}
        </div>
      </div>
    </section>
  </main>`;

  const legal = t => {
    const p = t[page];
    return `<main id="main-content">
      <section class="legal-hero">
        <div class="container legal-hero-inner">
          <a href="${link('index.html')}" class="back-link">${svg('arrow', 16)} ${esc(t.common.back)}</a>
          <span class="eyebrow">${esc(p.eyebrow)}</span>
          <h1>${esc(p.title)}</h1>
          <p>${esc(p.intro)}</p>
          <div class="legal-meta">
            <span class="meta-dot"></span>${esc(t.common.updated)}: <time datetime="${config.effectiveDateISO}">
              ${new Intl.DateTimeFormat(lang==='tr'?'tr-TR':lang==='de'?'de-DE':'en-GB', {day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(config.effectiveDateISO+'T00:00:00Z'))}
            </time>
            <span class="meta-spacer">/</span>${esc(config.appName)}
          </div>
        </div>
      </section>
      <section class="legal-body-section">
        <div class="container legal-layout">
          <aside class="toc">
            <div class="toc-content">
              <p class="toc-label">${esc(t.common.toc)}</p>
              <nav aria-label="${esc(t.common.toc)}">
                ${p.sections.map(item => `<a href="#${item.id}">${esc(item.title)}</a>`).join('')}
              </nav>
            </div>
          </aside>
          <article class="policy-article">
            <div class="policy-summary">
              ${svg('shield', 23)}
              <p>${esc(p.summary)}</p>
            </div>
            ${p.sections.map(item => `
              <section class="policy-section" id="${item.id}">
                <h2>${esc(item.title)}</h2>
                ${item.p.map(par => `<p>${interpolate(par)}</p>`).join('')}
                ${item.bullets ? `<ul>${item.bullets.map(b => `<li>${interpolate(b)}</li>`).join('')}</ul>` : ''}
              </section>`).join('')}
            <div class="policy-contact">
              <div>
                <h3>${esc(t.common.contact)}</h3>
                <p>${esc(t.common.emailLabel)}: ${emailLink()}</p>
              </div>
              <a class="button button-primary" href="mailto:${esc(config.supportEmail)}">
                ${svg('mail', 17)} ${esc(t.common.openEmail)}
              </a>
            </div>
          </article>
        </div>
      </section>
    </main>`;
  };

  // Support page with modern accessible accordion (Modern Web Guidance accordion)
  const support = t => `<main id="main-content">
    <section class="support-hero">
      <div class="container support-hero-grid">
        <div>
          <a class="back-link" href="${link('index.html')}">${svg('arrow', 16)} ${esc(t.common.back)}</a>
          <span class="eyebrow">${esc(t.support.eyebrow)}</span>
          <h1>${esc(t.support.title)}</h1>
          <p>${esc(t.support.intro)}</p>
        </div>
        <div class="support-hero-icon" aria-hidden="true">${svg('mail', 64)}<span>?</span></div>
      </div>
    </section>

    <section class="section faq-section" aria-labelledby="faq-title">
      <div class="container support-layout">
        <div class="faq-main">
          <div class="section-head">
            <h2 id="faq-title">${esc(t.support.faqTitle)}</h2>
          </div>
          <div class="faq-list">
            ${t.support.faqs.map((f, i) => `
              <details class="faq-item" ${i === 0 ? 'open' : ''}>
                <summary>
                  ${esc(f.q)}
                  <span class="faq-chevron">${svg('chevron', 20)}</span>
                </summary>
                <p>${esc(f.a)}</p>
              </details>`).join('')}
          </div>
        </div>

        <aside class="support-sidebar">
          <div class="support-contact-card">
            <div class="feature-icon">${svg('mail', 26)}</div>
            <h3>${esc(t.support.contactTitle)}</h3>
            <p>${esc(t.support.contactText)}</p>
            <a class="button button-primary contact-button" href="mailto:${esc(config.supportEmail)}?subject=${encodeURIComponent('Docora Support')}">
              ${esc(t.common.openEmail)} ${svg('arrow', 17)}
            </a>
            <span class="sidebar-email">${esc(config.supportEmail)}</span>
          </div>

          <div class="sidebar-legal">
            <h4>${esc(t.support.linksTitle)}</h4>
            <p>${esc(t.support.linksText)}</p>
            <a href="${link('privacy.html')}">${esc(t.common.privacy)} ${svg('arrow', 16)}</a>
            <a href="${link('terms.html')}">${esc(t.common.terms)} ${svg('arrow', 16)}</a>
          </div>
        </aside>
      </div>
    </section>
  </main>`;

  function render() {
    const t = dictionary[lang];
    document.documentElement.lang = lang;
    document.documentElement.dataset.theme = theme;
    metaColorScheme.content = theme;

    document.title = t.pageTitle[page];
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta[page]);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', t.pageTitle[page]);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', t.meta[page]);

    root.innerHTML = `
      <a class="skip-link" href="#main-content">${lang==='tr'?'İçeriğe geç':lang==='de'?'Zum Inhalt springen':'Skip to content'}</a>
      ${topbar(t)}
      ${page === 'home' ? home(t) : page === 'support' ? support(t) : legal(t)}
      ${footer(t)}
    `;

    // Language switcher
    document.querySelectorAll('[data-lang]').forEach(button => {
      button.addEventListener('click', () => {
        if (lang === button.dataset.lang) return;
        lang = button.dataset.lang;
        try { localStorage.setItem('docora-lang', lang); } catch (e) {}
        const url = new URL(window.location.href);
        url.searchParams.set('lang', lang);
        try { history.replaceState(null, '', url.pathname + url.search + url.hash); } catch (e) {}
        render();
      });
    });

    // Dark mode toggle (Modern Web Guidance dark-mode-toggle)
    document.querySelector('.theme-toggle')?.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('docora-theme', theme); } catch (e) {}
      metaColorScheme.content = theme;
      document.documentElement.dataset.theme = theme;
      render();
    });

    // Responsive Popover menu toggle (Modern Web Guidance navbar)
    const menuBtn = document.querySelector('.menu-toggle');
    const nav = document.getElementById('primary-nav');
    if (menuBtn && nav) {
      if (Object.hasOwn(HTMLElement.prototype, 'popover')) {
        nav.addEventListener('toggle', (e) => {
          menuBtn.setAttribute('aria-expanded', String(e.newState === 'open'));
        });
      } else {
        menuBtn.addEventListener('click', () => {
          const isOpen = nav.classList.toggle('open');
          menuBtn.setAttribute('aria-expanded', String(isOpen));
        });
      }
      nav.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          if (Object.hasOwn(HTMLElement.prototype, 'popover')) {
            try { nav.hidePopover(); } catch (e) {}
          } else {
            nav.classList.remove('open');
          }
          menuBtn.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // Interactive hero workspace tabs & chips
    document.querySelectorAll('[data-screen]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const screen = btn.dataset.screen;
        if (screen && currentPreviewScreen !== screen) {
          currentPreviewScreen = screen;
          const heroVisual = document.querySelector('.hero-visual');
          if (heroVisual) {
            heroVisual.innerHTML = visual(t);
            // Re-bind listeners for new DOM elements inside hero visual
            heroVisual.querySelectorAll('[data-screen]').forEach(subBtn => {
              subBtn.addEventListener('click', (ev) => {
                ev.preventDefault();
                currentPreviewScreen = subBtn.dataset.screen;
                heroVisual.innerHTML = visual(t);
              });
            });
          }
        }
      });
    });
  }

  // Cross-tab synchronization for theme overrides (Modern Web Guidance dark-mode-toggle)
  window.addEventListener('storage', event => {
    if (event.key === 'docora-theme') {
      const val = event.newValue;
      if (val === 'light' || val === 'dark') {
        theme = val;
        metaColorScheme.content = theme;
        document.documentElement.dataset.theme = theme;
        render();
      }
    }
  });

  render();
})();
