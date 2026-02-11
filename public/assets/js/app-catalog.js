let allApps = [];
let filteredApps = [];

const searchInput = document.getElementById('search-input');
const categorySelect = document.getElementById('category-select');
const distributionFilter = document.getElementById('distribution-filter');
const notarizedFilter = document.getElementById('notarized-filter');
const resetFilter = document.getElementById('reset-filter');
const appGrid = document.getElementById('app-grid');

async function loadApps() {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbxcaYOnyNaovd0ERTnVKKRxZP0x4eWSftKk-mMVCXZrbuQDw8e-aPN9sj4dSDPoGYeBsg/exec');
    const data = await response.json();
    allApps = data.apps || [];
    filteredApps = [...allApps];

    populateCategories();
    renderApps();
    setupEventListeners();
  } catch (error) {
    console.error('Failed to load apps:', error);
    appGrid.innerHTML = '<div class="col-span-full text-center py-8"><p class="text-red-600">アプリが読み込めませんでした<br><span class="text-sm text-gray-500">しばらく待ってから試してみてください</span></p></div>';
  }
}

function populateCategories() {
  // データから重複なくカテゴリを抽出
  const categories = [...new Set(allApps.map(app => app.category).filter(Boolean))];
  categories.sort();

  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

function setupEventListeners() {
  searchInput.addEventListener('input', filterApps);
  categorySelect.addEventListener('change', filterApps);
  distributionFilter.addEventListener('change', filterApps);
  notarizedFilter.addEventListener('click', () => {
    notarizedFilter.classList.toggle('bg-green-100');
    notarizedFilter.classList.toggle('text-green-800');
    filterApps();
  });
  resetFilter.addEventListener('click', () => {
    searchInput.value = '';
    categorySelect.value = '';
    distributionFilter.value = '';
    notarizedFilter.classList.remove('bg-green-100', 'text-green-800');
    filteredApps = [...allApps];
    renderApps();
  });
}

function filterApps() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCategory = categorySelect.value;
  const selectedDistribution = distributionFilter.value;
  const onlyNotarized = notarizedFilter.classList.contains('bg-green-100');

  filteredApps = allApps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm) ||
                         app.developerName.toLowerCase().includes(searchTerm);
    const matchesCategory = !selectedCategory || app.category === selectedCategory;

    // 配布方法のフィルタリング（デフォルトは 'sideload'）
    const distributionCategory = app.distributionInfo?.category || 'sideload';
    const matchesDistribution = !selectedDistribution || distributionCategory === selectedDistribution;

    const matchesNotarized = !onlyNotarized; // 公証情報がない場合は常に表示

    return matchesSearch && matchesCategory && matchesDistribution && matchesNotarized;
  });

  renderApps();
}

function renderApps() {
  if (filteredApps.length === 0) {
    appGrid.innerHTML = '<div class="col-span-full text-center py-8"><p class="text-gray-500">ぴったりなアプリが見つかりませんでした<br><span class="text-sm">別の条件で試してみてください</span></p></div>';
    return;
  }

  appGrid.innerHTML = '';
  filteredApps.forEach(app => {
    const card = createAppCard(app);
    appGrid.appendChild(card);
  });
}

function createAppCard(app) {
  const card = document.createElement('div');
  card.className = 'relative bg-white rounded-3xl shadow-sm p-6 text-left transition hover:shadow-md cursor-pointer';

  // 配布方法のデフォルト値を設定
  const distributionCategory = app.distributionInfo?.category || 'sideload';
  card.setAttribute('data-distribution', distributionCategory);

  card.addEventListener('click', (e) => {
    if (!e.target.closest('button')) {
      showAppDetailModal(app.bundleIdentifier);
    }
  });

  // 配布方法バッジの設定
  let distributionBadge = '';
  if (distributionCategory === 'official') {
    distributionBadge = '<span class="inline-block bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-md ml-1">App Store配信</span>';
  } else {
    distributionBadge = '<span class="inline-block bg-yellow-100 text-yellow-700 text-[10px] px-2 py-0.5 rounded-md ml-1">IPA配布</span>';
  }

  card.innerHTML = `
    <button class="absolute top-6 right-6 bg-[#007AFF] text-white font-bold text-sm px-5 py-1.5 rounded-full hover:bg-blue-600 transition" onclick="showImportModal(event, '${app.bundleIdentifier}')">
      入手
    </button>

    <div class="flex items-start gap-4">
      <img src="${app.iconURL}" alt="${app.name}" class="w-20 h-20 rounded-[22%] border border-gray-100 shadow-sm flex-shrink-0">

      <div class="flex-1 pt-1">
        <h3 class="font-bold text-lg text-gray-900 leading-tight line-clamp-1 w-2/3">${app.name}</h3>
        <p class="text-sm text-gray-500 mb-2">${app.developerName}</p>
        <div class="flex flex-wrap items-center gap-1">
          <span class="inline-block bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-md">${app.category}</span>
          ${distributionBadge}
        </div>
      </div>
    </div>

    <p class="mt-4 text-sm text-gray-600 leading-relaxed line-clamp-2">
      ${app.localizedDescription || '説明はありません'}
    </p>
  `;
  return card;
}

function showAppDetail(bundleIdentifier) {
  const app = allApps.find(a => a.bundleIdentifier === bundleIdentifier);
  if (app) {
    window.location.href = `./app-detail.html?id=${encodeURIComponent(bundleIdentifier)}`;
  }
}

function showAppDetailModal(bundleIdentifier) {
  const app = allApps.find(a => a.bundleIdentifier === bundleIdentifier);
  if (!app) return;

  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto';

  // 背景クリックでモーダルを閉じる
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  // スクリーンショットのHTML
  const screenshots = app.screenshots || app.screenshotURLs || [];
  const screenshotsHtml = screenshots.length > 0 ? `
    <div class="mt-6 pt-6 border-t border-gray-200">
      <h3 class="font-bold text-lg text-gray-900 mb-3">スクリーンショット</h3>
      <div class="flex gap-3 overflow-x-auto pb-2">
        ${screenshots.map(url => `<img src="${url}" alt="Screenshot" class="rounded border border-gray-200 h-64 flex-shrink-0">`).join('')}
      </div>
    </div>
  ` : '';

  // 主な機能のHTML
  const features = app.versionDescription ? app.versionDescription.split('\n').filter(f => f.trim()) : [];
  const featuresHtml = features.length > 0 ? `
    <div class="mt-6 pt-6 border-t border-gray-200">
      <h3 class="font-bold text-lg text-gray-900 mb-3">主な機能</h3>
      <ul class="list-disc list-inside space-y-1 text-sm text-gray-600">
        ${features.slice(0, 3).map(f => `<li>${f.trim()}</li>`).join('')}
      </ul>
    </div>
  ` : '';

  const minOSVersion = app.versions && app.versions[0] && app.versions[0].minOSVersion
    ? `iOS ${app.versions[0].minOSVersion}以上`
    : 'iOS 14以上';

  modal.innerHTML = `
    <div class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] shadow-lg flex flex-col">
      <button class="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onclick="this.closest('.fixed').remove()">
        <span class="material-symbols-outlined">close</span>
      </button>

      <div class="p-6 pb-0 flex-shrink-0 bg-white">
        <div class="flex items-start gap-4 mb-6">
          <img src="${app.iconURL}" alt="${app.name}" class="w-20 h-20 rounded-[22%] border border-gray-100 shadow-sm flex-shrink-0">
          <div class="flex-1">
            <h2 class="text-2xl font-bold text-gray-900">${app.name}</h2>
            <p class="text-sm text-gray-600 mb-2">${app.developerName}</p>
            <span class="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">${app.category}</span>
          </div>
        </div>

        <div class="bg-gray-50 rounded-lg p-4 mb-6 text-sm">
          <div class="grid grid-cols-3 gap-4">
            <div>
              <p class="text-xs text-gray-500 mb-1">バージョン</p>
              <p class="font-bold text-gray-900">${app.version || 'N/A'}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">サイズ</p>
              <p class="font-bold text-gray-900">${formatBytes(app.size)}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">必須iOS</p>
              <p class="font-bold text-gray-900">${minOSVersion}</p>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <h3 class="font-bold text-gray-900 mb-2">説明</h3>
          <p class="text-sm text-gray-600 leading-relaxed">${app.localizedDescription || '説明はありません'}</p>
        </div>

        ${featuresHtml}
        ${screenshotsHtml}
      </div>

      <div class="flex gap-3 p-6 border-t border-gray-200 bg-white rounded-b-3xl flex-shrink-0">
        <button class="flex-1 bg-[#007AFF] text-white font-bold text-sm px-4 py-2.5 rounded-full hover:bg-blue-600 transition" onclick="window.location.href = '${app.downloadURL}'">入手</button>
        <button class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium text-sm px-4 py-2.5 rounded-full transition" onclick="showAppDetail('${app.bundleIdentifier}')">詳細を見る</button>
        <button class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium text-sm px-4 py-2.5 rounded-full transition" onclick="this.closest('.fixed').remove()">閉じる</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

function showImportModal(event, bundleIdentifier) {
  event.stopPropagation();

  const app = allApps.find(a => a.bundleIdentifier === bundleIdentifier);
  if (!app) return;

  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';

  const description = app.localizedDescription ?
    app.localizedDescription.substring(0, 150) + (app.localizedDescription.length > 150 ? '...' : '') :
    '';

  modal.innerHTML = `
    <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-lg">
      <h2 class="text-2xl font-bold mb-4 text-gray-900">アプリをダウンロード</h2>

      <div class="flex items-start gap-4 mb-4">
        <img src="${app.iconURL}" alt="${app.name}" class="w-20 h-20 rounded-[22%] border border-gray-100 shadow-sm flex-shrink-0">
        <div class="flex-1 pt-1">
          <h3 class="font-bold text-lg text-gray-900 leading-tight">${app.name}</h3>
          <p class="text-sm text-gray-500">${app.developerName}</p>
        </div>
      </div>

      <p class="text-sm text-gray-600 mb-4 leading-relaxed">${description}</p>

      <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm">
        <p class="text-gray-700 leading-relaxed">
          <strong>バージョン:</strong> ${app.version || 'N/A'}<br>
          <strong>サイズ:</strong> ${formatBytes(app.size)}<br>
          ${app.versionDate ? `<strong>公開日:</strong> ${new Date(app.versionDate).toLocaleDateString('ja-JP')}<br>` : ''}
        </p>
      </div>

      <div class="space-y-2">
        <a href="${app.downloadURL}" class="block w-full bg-[#007AFF] text-white font-bold text-sm px-5 py-2 rounded-full text-center hover:bg-blue-600 transition shadow-sm" download>ダウンロード</a>
        <button class="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium text-sm px-5 py-2 rounded-full transition" onclick="this.closest('.fixed').remove()">キャンセル</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function formatBytes(bytes) {
  if (!bytes) return 'N/A';
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

document.addEventListener('DOMContentLoaded', loadApps);
