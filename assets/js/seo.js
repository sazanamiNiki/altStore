function addStructuredData(data) {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

function addWebsiteStructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "bunchoniki Store",
    "description": "Apple Silicon対応デバイス向けの公証済みアプリをご紹介",
    "url": "https://bunchoniki.github.io/altStore-jp/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://bunchoniki.github.io/altStore-jp/apps.html?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };
  addStructuredData(schema);
}

function addSoftwareApplicationSchema(app) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": app.nameJa,
    "applicationCategory": "Productivity",
    "description": app.longDescription,
    "author": {
      "@type": "Person",
      "name": app.developer
    },
    "version": app.version,
    "image": app.iconURL,
    "url": `https://bunchoniki.github.io/altStore-jp/app-detail.html?id=${app.id}`,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": app.rating,
      "ratingCount": app.reviewCount
    },
    "operatingSystem": "iOS",
    "datePublished": app.releaseDate,
    "dateModified": app.lastUpdated,
    "downloadUrl": app.altStoreURL
  };
  addStructuredData(schema);
}

function addArticleSchema(article) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "url": article.url,
    "datePublished": article.publishDate,
    "author": {
      "@type": "Organization",
      "name": "bunchoniki Store"
    }
  };
  addStructuredData(schema);
}

function addBreadcrumbSchema(items) {
  const itemListElement = items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": itemListElement
  };
  addStructuredData(schema);
}

if (document.location.pathname.includes('app-detail')) {
  const params = new URLSearchParams(window.location.search);
  const appId = params.get('id');
  if (appId) {
    fetch('./assets/data/apps.json')
      .then(r => r.json())
      .then(data => {
        const app = data.apps.find(a => a.id === appId);
        if (app) addSoftwareApplicationSchema(app);
      });
  }
} else if (document.location.pathname === '/' || document.location.pathname.endsWith('index.html')) {
  addWebsiteStructuredData();
}
