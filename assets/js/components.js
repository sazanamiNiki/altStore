const BUNCHO_LOGO = `<svg class="w-8 h-8 inline" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="20" cy="20" r="18" stroke="#0ea5e9" stroke-width="2"/>
  <path d="M20 8C18 8 16.5 9.5 16.5 11.5C16.5 13 17.5 14.2 18.8 14.7C17.8 15.8 17 17.3 17 19C17 22 19 24.5 21.5 24.5C24 24.5 26 22 26 19C26 17.3 25.2 15.8 24.2 14.7C25.5 14.2 26.5 13 26.5 11.5C26.5 9.5 25 8 23 8C21.8 8 20.8 8.6 20.2 9.5C20.1 9.5 20 9.5 20 9.5C19.9 9.5 19.9 9.5 19.8 9.5C19.2 8.6 18.2 8 17 8L20 8Z" fill="#0ea5e9"/>
  <circle cx="19" cy="12" r="1" fill="white"/>
  <circle cx="21" cy="12" r="1" fill="white"/>
</svg>`;

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
    <header class="bg-white shadow-sm border-b border-sky-100">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <a href="${basePath}index.html" class="flex items-center gap-3 font-bold text-xl text-sky-600">
          ${BUNCHO_LOGO}
          <span class="hidden sm:inline">bunchoniki Store</span>
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
      <nav id="mobile-menu" class="hidden md:flex flex-col gap-4 p-4 bg-white border-t border-sky-100">
        <ul class="flex flex-col gap-4">
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
            <p class="text-gray-600 text-sm">Apple Silicon対応デバイス向けの公証済みアプリをご紹介します。</p>
          </div>
          <div>
            <h3 class="font-bold text-gray-900 mb-4">リンク</h3>
            <ul class="space-y-2 text-sm">
              <li><a href="${basePath}privacy-policy.html" class="text-gray-600 hover:text-sky-600">プライバシーポリシー</a></li>
              <li><a href="${basePath}terms.html" class="text-gray-600 hover:text-sky-600">利用規約</a></li>
              <li><a href="https://altstore.io" class="text-gray-600 hover:text-sky-600">AltStore 公式</a></li>
            </ul>
          </div>
          <div>
            <h3 class="font-bold text-gray-900 mb-4">免責事項</h3>
            <p class="text-gray-600 text-sm">本サイトは非公式です。掲載情報は最善の努力で確認しておりますが、正確性を保証しません。</p>
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

  if (!toggle || !menu) {
    console.error('Menu elements not found:', { toggle: !!toggle, menu: !!menu });
    return;
  }

  toggle.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });

  // メニューのリンクをクリックすると自動的にメニューを閉じる
  const menuLinks = menu.querySelectorAll('a');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
    });
  });
}
