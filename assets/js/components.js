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
    <header class="bg-white shadow-sm border-b border-sky-100 relative">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <a href="${basePath}index.html" class="flex items-center gap-2 sm:gap-3 font-bold text-sm sm:text-xl text-sky-600">
          <img src="./assets/img/buncho_logo.svg" />
          <span>bunchoniki Store</span>
        </a>
        <ul class="hidden md:flex gap-8">
          <li><a href="${basePath}index.html" class="text-gray-700 hover:text-sky-600 transition">ホーム</a></li>
          <li><a href="${basePath}apps.html" class="text-gray-700 hover:text-sky-600 transition">アプリ</a></li>
          <li><a href="${basePath}articles/" class="text-gray-700 hover:text-sky-600 transition">記事</a></li>
          <li><a href="${basePath}articles/faq.html" class="text-gray-700 hover:text-sky-600 transition">FAQ</a></li>
        </ul>
        <button id="menu-toggle" class="md:hidden text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </nav>
      <nav id="mobile-menu" class="hidden md:hidden bg-white border-t border-sky-100 absolute top-full left-0 right-0 shadow-lg z-50">
        <ul class="flex flex-col gap-4 p-4">
          <li><a href="${basePath}index.html" class="text-gray-700 hover:text-sky-600 transition">ホーム</a></li>
          <li><a href="${basePath}apps.html" class="text-gray-700 hover:text-sky-600 transition">アプリ</a></li>
          <li><a href="${basePath}articles/" class="text-gray-700 hover:text-sky-600 transition">記事</a></li>
          <li><a href="${basePath}articles/faq.html" class="text-gray-700 hover:text-sky-600 transition">FAQ</a></li>
        </ul>
      </nav>
    </header>
  `;
}

function createFooter() {
  const basePath = getBasePath();
  return `
    <footer class="bg-gray-50 border-t border-gray-200 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 class="font-bold text-gray-900 mb-4">bunchoniki Store</h3>
            <p class="text-gray-600 text-sm">開発元が明確な厳選サイドロードアプリをご紹介します。</p>
          </div>
          <div>
            <h3 class="font-bold text-gray-900 mb-4">リンク</h3>
            <ul class="space-y-2 text-sm">
              <li><a href="${basePath}our-policy.html" class="text-gray-600 hover:text-sky-600">運営方針・お問い合わせ</a></li>
              <li><a href="${basePath}privacy-policy.html" class="text-gray-600 hover:text-sky-600">プライバシーポリシー</a></li>
              <li><a href="${basePath}terms.html" class="text-gray-600 hover:text-sky-600">利用規約</a></li>
              <li><a href="https://altstore.io" class="text-gray-600 hover:text-sky-600">AltStore 公式</a></li>
            </ul>
          </div>
          <div>
            <h3 class="font-bold text-gray-900 mb-4">免責事項</h3>
            <p class="text-gray-600 text-sm">このサイトはAppleとは関係ありません。情報は最新のものを心がけていますが、変わることもあります。</p>
          </div>
        </div>
        <div class="border-t border-gray-200 pt-8 text-center">
          <p class="text-gray-600 text-sm">&copy; 2026 bunchoniki Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `;
}

function createAdSenseHorizontal() {
  return `
    <div class="bg-gray-100 rounded border-2 border-dashed border-gray-300 p-8 text-center mb-8">
      <p class="text-gray-600 text-sm">
        <span class="font-mono bg-white px-2 py-1 rounded">
          &lt;ins class="adsbygoogle"&gt;
        </span>
        <br/>
        <span class="text-xs text-gray-500">AdSense広告（728x90）</span>
      </p>
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

