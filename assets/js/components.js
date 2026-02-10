// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', loadAdSense);

function getBasePath() {
  const pathname = window.location.pathname;
  const depth = (pathname.match(/\//g) || []).length - 1;
  // articlesフォルダ内のページは1段階上に上る必要がある
  if (pathname.includes('/articles/')) {
    return '../';
  }
  return './';
}

function createHeader() {
  const basePath = getBasePath();
  return `
    <header class="bg-white border-b border-gray-100 relative">
      <nav class="max-w-xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="${basePath}index.html" class="flex items-center gap-2 font-semibold text-gray-900">
          <img src="/assets/img/buncho_logo.svg" />
          <span>bunchoniki Store</span>
        </a>
        <ul class="hidden md:flex gap-8">
          <li><a href="${basePath}index.html" class="text-sm text-gray-600 hover:text-gray-900 transition">ホーム</a></li>
          <li><a href="${basePath}apps.html" class="text-sm text-gray-600 hover:text-gray-900 transition">アプリ</a></li>
          <li><a href="${basePath}articles/" class="text-sm text-gray-600 hover:text-gray-900 transition">記事</a></li>
          <li><a href="${basePath}articles/faq.html" class="text-sm text-gray-600 hover:text-gray-900 transition">FAQ</a></li>
        </ul>
        <button id="menu-toggle" class="md:hidden text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </nav>
      <nav id="mobile-menu" class="hidden md:hidden bg-white border-t border-gray-100 absolute top-full left-0 right-0 shadow-sm z-50">
        <ul class="max-w-xl mx-auto px-6 flex flex-col gap-4 py-4">
          <li><a href="${basePath}index.html" class="text-sm text-gray-600 hover:text-gray-900 transition">ホーム</a></li>
          <li><a href="${basePath}apps.html" class="text-sm text-gray-600 hover:text-gray-900 transition">アプリ</a></li>
          <li><a href="${basePath}articles/" class="text-sm text-gray-600 hover:text-gray-900 transition">記事</a></li>
          <li><a href="${basePath}articles/faq.html" class="text-sm text-gray-600 hover:text-gray-900 transition">FAQ</a></li>
        </ul>
      </nav>
    </header>
  `;
}

function createFooter() {
  const basePath = getBasePath();
  return `
    <footer class="bg-white border-t border-gray-100 py-16">
      <div class="max-w-xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 class="text-sm font-semibold text-gray-900 mb-4">bunchoniki Store</h3>
            <p class="text-sm text-gray-600 leading-7">開発元が明確な厳選サイドロードアプリをご紹介します。</p>
          </div>
          <div>
            <h3 class="text-sm font-semibold text-gray-900 mb-4">リンク</h3>
            <ul class="space-y-2">
              <li><a href="${basePath}our-policy.html" class="text-sm text-gray-600 hover:text-gray-900">運営方針・お問い合わせ</a></li>
              <li><a href="${basePath}privacy-policy.html" class="text-sm text-gray-600 hover:text-gray-900">プライバシーポリシー</a></li>
              <li><a href="${basePath}terms.html" class="text-sm text-gray-600 hover:text-gray-900">利用規約</a></li>
              <li><a href="https://altstore.io" class="text-sm text-gray-600 hover:text-gray-900">AltStore 公式</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-sm font-semibold text-gray-900 mb-4">免責事項</h3>
            <p class="text-sm text-gray-600 leading-7">このサイトはAppleとは関係ありません。情報は最新のものを心がけていますが、変わることもあります。</p>
          </div>
        </div>
        <div class="border-t border-gray-100 pt-8 text-center">
          <p class="text-sm text-gray-500">&copy; 2026 bunchoniki Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `;
}

function createAdSenseHorizontal() {
  return `
    <div class="bg-gray-50 rounded-2xl p-8 text-center mb-8">
      <p class="text-sm text-gray-500">
        <span class="font-mono bg-white px-2 py-1 rounded">
          &lt;ins class="adsbygoogle"&gt;
        </span>
        <br/>
        <span class="text-xs text-gray-400">AdSense広告（728x90）</span>
      </p>
    </div>
  `;
}

function createArticleBackLink() {
  return `
    <div class="mb-6">
      <a href="./index.html" class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm transition-colors">
        <span class="material-symbols-outlined">arrow_back</span>
        記事一覧に戻る
      </a>
    </div>
  `;
}

function setupMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });
  }
}

function loadAdSense() {
  const existingScript = document.querySelector('script[src*="client=ca-pub-3579213602196152"]');
  if (existingScript) return;

  const script = document.createElement('script');
  script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3579213602196152";
  script.async = true;
  script.crossOrigin = "anonymous";

  document.head.appendChild(script);
}

document.addEventListener('DOMContentLoaded', () => {
  loadAdSense();
});

