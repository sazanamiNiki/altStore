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
    "description": "開発元が明確な厳選サイドロードアプリをご紹介",
    "url": "https://altstore-jp.bunchoniki.com/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://altstore-jp.bunchoniki.com/apps.html?search={search_term_string}"
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
    "url": `https://altstore-jp.bunchoniki.com/app-detail.html?id=${app.id}`,
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

// 後方互換用：手動で Article スキーマを注入する関数
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

// 後方互換用：手動で BreadcrumbList スキーマを注入する関数
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

// ページのメタデータから Article スキーマを自動生成・注入する
function autoInjectArticleSchema() {
  const pathname = window.location.pathname;
  if (!pathname.includes('/articles/')) return;
  // 記事一覧ページ (articles/index.html) は対象外
  if (pathname.endsWith('/articles/') || pathname.endsWith('/articles/index.html')) return;

  const headline = document.title;
  const descMeta = document.querySelector('meta[name="description"]');
  const description = descMeta ? descMeta.getAttribute('content') : '';

  const publishedMeta = document.querySelector('meta[property="article:published_time"]');
  const datePublished = publishedMeta
    ? publishedMeta.getAttribute('content')
    : new Date(document.lastModified).toISOString();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": headline,
    "description": description,
    "url": window.location.href,
    "datePublished": datePublished,
    "author": {
      "@type": "Organization",
      "name": "bunchoniki Store"
    }
  };
  addStructuredData(schema);
}

// URLパスから BreadcrumbList スキーマを自動生成・注入する
function autoInjectBreadcrumbSchema() {
  const BASE_URL = 'https://altstore-jp.bunchoniki.com';
  const pathname = window.location.pathname;
  if (!pathname.includes('/articles/')) return;

  const breadcrumbItems = [
    { name: 'ホーム', url: BASE_URL + '/' }
  ];

  // 記事一覧ページ以外は中間ノードとして「記事一覧」を挿入
  if (!pathname.endsWith('/articles/') && !pathname.endsWith('/articles/index.html')) {
    breadcrumbItems.push({ name: '記事一覧', url: BASE_URL + '/articles/' });
  }

  breadcrumbItems.push({ name: document.title, url: window.location.href });

  addBreadcrumbSchema(breadcrumbItems);
}

// FAQPage スキーマを自動検出・生成・注入する
function autoInjectFAQSchema() {
  const faqItems = [];

  // パターン1: [data-section="faq"] 内のアコーディオン形式
  const faqSection = document.querySelector('[data-section="faq"]');
  if (faqSection) {
    const accordionItems = faqSection.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
      // material icon の span を除く最初の span が質問テキスト
      const triggerSpan = item.querySelector('.accordion-trigger span:not(.material-symbols-outlined)');
      const contentDiv = item.querySelector('.accordion-content');
      if (triggerSpan && contentDiv) {
        faqItems.push({
          question: triggerSpan.textContent.trim(),
          answer: contentDiv.textContent.trim()
        });
      }
    });
  }

  // パターン2: [data-section="faq"] 内の h3 + p 形式（Q./A.パターン）
  if (faqItems.length === 0 && faqSection) {
    const h3Elements = faqSection.querySelectorAll('h3');
    h3Elements.forEach(h3 => {
      const questionText = h3.textContent.trim();
      if (!questionText.startsWith('Q.') && !questionText.startsWith('Q．')) return;

      const next = h3.nextElementSibling;
      if (!next) return;

      let answer = '';
      if (next.tagName === 'P') {
        answer = next.textContent.trim();
      } else {
        const innerP = next.querySelector('p');
        answer = innerP ? innerP.textContent.trim() : next.textContent.trim();
      }

      if (answer) {
        faqItems.push({
          question: questionText.replace(/^Q[.．]\s*/, ''),
          answer: answer
        });
      }
    });
  }

  // パターン3: data-section="faq" がないページ（FAQ専用ページ等）向け
  // ページ全体の h3 要素から "Q." で始まるものを検索するフォールバック
  if (faqItems.length === 0) {
    const allH3 = document.querySelectorAll('h3');
    allH3.forEach(h3 => {
      const questionText = h3.textContent.trim();
      if (!questionText.startsWith('Q.') && !questionText.startsWith('Q．')) return;

      const next = h3.nextElementSibling;
      if (!next) return;

      let answer = '';
      if (next.tagName === 'P') {
        answer = next.textContent.trim();
      } else {
        const innerP = next.querySelector('p');
        answer = innerP ? innerP.textContent.trim() : next.textContent.trim();
      }

      if (answer) {
        faqItems.push({
          question: questionText.replace(/^Q[.．]\s*/, ''),
          answer: answer
        });
      }
    });
  }

  if (faqItems.length === 0) return;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };
  addStructuredData(schema);
}

document.addEventListener('DOMContentLoaded', function () {
  const pathname = window.location.pathname;

  if (pathname.includes('app-detail')) {
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
  } else if (pathname === '/' || (pathname.endsWith('index.html') && !pathname.includes('/articles/'))) {
    addWebsiteStructuredData();
  }

  // 記事ページ共通: Article・BreadcrumbList・FAQPage を自動注入
  autoInjectArticleSchema();
  autoInjectBreadcrumbSchema();
  autoInjectFAQSchema();
});
