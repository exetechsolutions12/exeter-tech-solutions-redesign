// Exeter Tech Solutions - Google Analytics 4 consent bootstrap
// Keep analytics denied until the visitor opts in.
window.dataLayer = window.dataLayer || [];
window.gtag = function(){ window.dataLayer.push(arguments); };

window.gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500
});

try {
  if (localStorage.getItem('ets-analytics-consent') === 'accepted') {
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
  }
} catch (error) {
  // If storage is unavailable, analytics remains denied.
}

window.gtag('js', new Date());
window.gtag('config', 'G-NR43GB654G');


// Track contact intent in GA4 without changing visible website behaviour.
document.addEventListener('click', function (event) {
  var link = event.target.closest('a[href]');
  if (!link) return;

  var href = (link.getAttribute('href') || '').trim();

  if (href.toLowerCase().startsWith('tel:')) {
    window.gtag('event', 'phone_click', {
      link_url: href,
      link_text: (link.textContent || '').trim()
    });
  } else if (href.toLowerCase().startsWith('mailto:')) {
    window.gtag('event', 'email_click', {
      link_url: href,
      link_text: (link.textContent || '').trim()
    });
  }
});
