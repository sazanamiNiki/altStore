document.addEventListener('DOMContentLoaded', () => {
  setupGA();
  initializeComponents();
});

function setupGA() {
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    'page_path': window.location.pathname,
    'page_title': document.title
  });
}

function initializeComponents() {
  setupExternalLinks();
  trackOutboundLinks();
}

function setupExternalLinks() {
  const links = document.querySelectorAll('a[href^="http"]');
  links.forEach(link => {
    if (!link.href.includes(window.location.origin)) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
}

function trackOutboundLinks() {
  document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.href.startsWith('altstore://')) {
      if (window.gtag) {
        gtag('event', 'app_import', {
          'event_category': 'engagement',
          'app_url': e.target.href
        });
      }
    }
  });
}
