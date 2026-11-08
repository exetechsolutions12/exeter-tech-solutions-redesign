// Mobile nav toggle
const toggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');
if (toggle && navLinks) {
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('open');
    const isOpen = navLinks.classList.contains('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-inner') && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
    }
  });
  navLinks.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
    });
  });
}

// Sticky nav shadow
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// Add the site search consistently without repeating the same markup on every page.
const mainMenu = document.querySelector('#main-menu');
if (mainMenu && !mainMenu.querySelector('a[href="/search"]')) {
  const searchLink = document.createElement('a');
  searchLink.href = '/search';
  searchLink.textContent = 'Search';
  const currentPath = window.location.pathname.replace(/\/+$/, '');
  if (currentPath.endsWith('/search') || currentPath.endsWith('/search.html')) {
    searchLink.classList.add('active');
    searchLink.setAttribute('aria-current', 'page');
  }
  const contactLink = mainMenu.querySelector('.btn');
  mainMenu.insertBefore(searchLink, contactLink || null);
}

// Year
document.querySelectorAll('.year').forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// Simple, privacy-friendly accessibility controls available on every page.
const accessibilityTools = document.createElement('div');
accessibilityTools.className = 'accessibility-tools';
accessibilityTools.innerHTML = `
  <button class="accessibility-toggle" type="button" aria-expanded="false" aria-controls="accessibility-panel">Accessibility</button>
  <div class="accessibility-panel" id="accessibility-panel" hidden>
    <p><strong>Display options</strong></p>
    <button type="button" data-accessibility="text">Larger text</button>
    <button type="button" data-accessibility="contrast">High contrast</button>
    <button type="button" data-accessibility="spacing">Extra text spacing</button>
    <button type="button" data-accessibility="links">Underline links</button>
    <button type="button" data-accessibility="reset">Reset</button>
    <a href="accessibility.html">Accessibility statement</a>
  </div>`;
document.body.appendChild(accessibilityTools);

const accessibilityToggle = accessibilityTools.querySelector('.accessibility-toggle');
const accessibilityPanel = accessibilityTools.querySelector('.accessibility-panel');
function readPreference(key) {
  try { return localStorage.getItem(key) === 'true'; } catch (error) { return false; }
}
function savePreference(key, value) {
  try { localStorage.setItem(key, String(value)); } catch (error) { /* Preferences remain active for this page. */ }
}
const savedText = readPreference('ets-large-text');
const savedContrast = readPreference('ets-high-contrast');
const savedSpacing = readPreference('ets-text-spacing');
const savedLinks = readPreference('ets-underline-links');
document.documentElement.classList.toggle('large-text', savedText);
document.documentElement.classList.toggle('high-contrast', savedContrast);
document.documentElement.classList.toggle('comfortable-spacing', savedSpacing);
document.documentElement.classList.toggle('underline-links', savedLinks);

function updateAccessibilityButtons() {
  accessibilityTools.querySelector('[data-accessibility="text"]').setAttribute('aria-pressed', String(document.documentElement.classList.contains('large-text')));
  accessibilityTools.querySelector('[data-accessibility="contrast"]').setAttribute('aria-pressed', String(document.documentElement.classList.contains('high-contrast')));
  accessibilityTools.querySelector('[data-accessibility="spacing"]').setAttribute('aria-pressed', String(document.documentElement.classList.contains('comfortable-spacing')));
  accessibilityTools.querySelector('[data-accessibility="links"]').setAttribute('aria-pressed', String(document.documentElement.classList.contains('underline-links')));
}
updateAccessibilityButtons();

accessibilityToggle.addEventListener('click', () => {
  const willOpen = accessibilityPanel.hidden;
  accessibilityPanel.hidden = !willOpen;
  accessibilityToggle.setAttribute('aria-expanded', String(willOpen));
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !accessibilityPanel.hidden) {
    accessibilityPanel.hidden = true;
    accessibilityToggle.setAttribute('aria-expanded', 'false');
    accessibilityToggle.focus();
  }
});

accessibilityTools.addEventListener('click', (event) => {
  const action = event.target.dataset.accessibility;
  if (!action) return;
  if (action === 'text') document.documentElement.classList.toggle('large-text');
  if (action === 'contrast') document.documentElement.classList.toggle('high-contrast');
  if (action === 'spacing') document.documentElement.classList.toggle('comfortable-spacing');
  if (action === 'links') document.documentElement.classList.toggle('underline-links');
  if (action === 'reset') {
    document.documentElement.classList.remove('large-text', 'high-contrast', 'comfortable-spacing', 'underline-links');
  }
  savePreference('ets-large-text', document.documentElement.classList.contains('large-text'));
  savePreference('ets-high-contrast', document.documentElement.classList.contains('high-contrast'));
  savePreference('ets-text-spacing', document.documentElement.classList.contains('comfortable-spacing'));
  savePreference('ets-underline-links', document.documentElement.classList.contains('underline-links'));
  updateAccessibilityButtons();
});

// Optional Google Analytics consent. Analytics is off unless the visitor opts in.
(function setupAnalyticsConsent() {
  const consentKey = 'ets-analytics-consent';

  function getConsent() {
    try { return localStorage.getItem(consentKey); } catch (error) { return null; }
  }

  function setConsent(value) {
    try { localStorage.setItem(consentKey, value); } catch (error) { /* Keep analytics off if storage is unavailable. */ }
  }

  function removeBanner() {
    document.querySelector('.cookie-banner')?.remove();
  }

  function saveChoice(value) {
    setConsent(value);
    removeBanner();
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        'analytics_storage': value === 'accepted' ? 'granted' : 'denied',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
      });
      if (value === 'accepted') {
        window.gtag('event', 'page_view', {
          page_location: window.location.href,
          page_title: document.title
        });
      }
    }
  }

  function showBanner() {
    if (document.querySelector('.cookie-banner')) return;
    const banner = document.createElement('section');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-modal', 'false');
    banner.setAttribute('aria-labelledby', 'cookie-banner-title');
    banner.innerHTML = `
      <h2 id="cookie-banner-title">Optional analytics cookies</h2>
      <p>I use Google Analytics only if you choose to allow it. It helps me understand how people use this website so I can improve it. You can accept or reject analytics cookies, and change your choice later. <a href="privacy.html#cookies">Read the privacy notice</a>.</p>
      <div class="cookie-actions">
        <button class="cookie-accept" type="button">Accept analytics</button>
        <button class="cookie-reject" type="button">Reject analytics</button>
      </div>`;
    document.body.appendChild(banner);
    banner.querySelector('.cookie-accept').addEventListener('click', () => saveChoice('accepted'));
    banner.querySelector('.cookie-reject').addEventListener('click', () => saveChoice('rejected'));
  }

  if (!getConsent()) showBanner();

  const subfooter = document.querySelector('.subfooter');
  if (subfooter && !subfooter.querySelector('.cookie-settings-button')) {
    const separator = document.createTextNode(' · ');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cookie-settings-button';
    button.textContent = 'Cookie settings';
    button.addEventListener('click', () => {
      removeBanner();
      showBanner();
    });
    subfooter.appendChild(separator);
    subfooter.appendChild(button);
  }
})();


// Add the homepage background footage to every page intro, reusing the same video asset.
(() => {
  const existingVideo = document.querySelector('.hero-background-video');
  if (existingVideo) return; // The homepage already contains its own hero video.

  const intro = document.querySelector(
    'main .page-hero, main .about-hero, main .services-options-section, main .review-archive, main.confirmation, main .not-found'
  );
  if (!intro) return;

  intro.classList.add('site-video-hero');
  const video = document.createElement('video');
  video.className = 'site-page-background-video';
  video.autoplay = true;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = 'metadata';
  video.setAttribute('aria-hidden', 'true');
  video.setAttribute('tabindex', '-1');
  video.innerHTML = '<source src="/assets/videos/welcome-to-my-channel.mp4?v=1" type="video/mp4">';
  intro.prepend(video);
  const playAttempt = video.play();
  if (playAttempt && typeof playAttempt.catch === 'function') {
    playAttempt.catch(() => { /* Keep the poster-colour fallback if autoplay is blocked. */ });
  }
})();
