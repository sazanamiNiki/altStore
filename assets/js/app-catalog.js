let allApps = [];
let filteredApps = [];

const searchInput = document.getElementById('search-input');
const categorySelect = document.getElementById('category-select');
const notarizedFilter = document.getElementById('notarized-filter');
const resetFilter = document.getElementById('reset-filter');
const appGrid = document.getElementById('app-grid');

async function loadApps() {
  try {
    const response = await fetch('./assets/data/apps.json');
    const data = await response.json();
    allApps = data.apps;
    filteredApps = [...allApps];

    populateCategories(data.categories);
    renderApps();
    setupEventListeners();
  } catch (error) {
    console.error('Failed to load apps:', error);
    appGrid.innerHTML = '<div class="col-span-full text-center py-8"><p class="text-red-600">アプリの読み込みに失敗しました</p></div>';
  }
}

function populateCategories(categories) {
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
  notarizedFilter.addEventListener('click', () => {
    notarizedFilter.classList.toggle('bg-green-100');
    notarizedFilter.classList.toggle('text-green-800');
    filterApps();
  });
  resetFilter.addEventListener('click', () => {
    searchInput.value = '';
    categorySelect.value = '';
    notarizedFilter.classList.remove('bg-green-100', 'text-green-800');
    filteredApps = [...allApps];
    renderApps();
  });
}

function filterApps() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCategory = categorySelect.value;
  const onlyNotarized = notarizedFilter.classList.contains('bg-green-100');

  filteredApps = allApps.filter(app => {
    const matchesSearch = app.nameJa.toLowerCase().includes(searchTerm) ||
                         app.name.toLowerCase().includes(searchTerm) ||
                         app.developer.toLowerCase().includes(searchTerm);
    const matchesCategory = !selectedCategory || app.category === selectedCategory;
    const matchesNotarized = !onlyNotarized || app.isNotarized;

    return matchesSearch && matchesCategory && matchesNotarized;
  });

  renderApps();
}

function renderApps() {
  if (filteredApps.length === 0) {
    appGrid.innerHTML = '<div class="col-span-full text-center py-8"><p class="text-gray-500">該当するアプリが見つかりません</p></div>';
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
  card.className = 'app-card';
  card.innerHTML = `
    <img src="${app.iconURL}" alt="${app.name}" class="app-card-image">
    <div>
      <h3 class="font-bold text-lg">${app.nameJa}</h3>
      <p class="text-xs text-gray-500">${app.developer}</p>
      ${app.isNotarized ? '<span class="notarized-badge">公証済み</span>' : ''}
    </div>
    <p class="text-sm text-gray-600 text-truncate-2 my-2">${app.shortDescription}</p>
    <div class="flex flex-wrap gap-1 mb-3">
      ${app.tags.map(tag => `<span class="text-xs bg-sky-100 text-sky-800 px-2 py-1 rounded">${tag}</span>`).join('')}
    </div>
    <div class="flex items-center justify-between">
      <div>
        <span class="text-sm icon-with-text">
          <span class="material-symbols-outlined rating-icon">star</span>
          <span>${app.rating}</span>
        </span>
        <span class="text-xs text-gray-500">(${app.reviewCount})</span>
      </div>
    </div>
    <div class="mt-4 space-y-2">
      <button class="w-full btn-primary text-sm" onclick="showAppDetail('${app.id}')">詳細を見る</button>
      <button class="w-full btn-secondary text-sm" onclick="showImportModal('${app.id}')">インポート</button>
    </div>
  `;
  return card;
}

function showAppDetail(appId) {
  const app = allApps.find(a => a.id === appId);
  if (app) {
    window.location.href = `/altStore-jp/app-detail.html?id=${appId}`;
  }
}

function showImportModal(appId) {
  const app = allApps.find(a => a.id === appId);
  if (!app) return;

  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
  modal.innerHTML = `
    <div class="bg-white rounded-lg max-w-md w-full p-6 border-2 border-gray-300">
      <h2 class="text-2xl font-bold mb-4">アプリをインポート</h2>
      <img src="${app.iconURL}" alt="${app.name}" class="w-20 h-20 rounded-lg mb-4">
      <h3 class="font-bold text-lg">${app.nameJa}</h3>
      <p class="text-sm text-gray-600 mb-4">${app.shortDescription}</p>
      <div class="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4 text-sm">
        <p class="font-medium mb-1 icon-with-text">
          <span class="material-symbols-outlined warning-icon">warning</span>
          <span>確認してください</span>
        </p>
        <p class="text-gray-700">${app.legalNotice}</p>
      </div>
      <div class="space-y-2">
        <button class="w-full btn-primary" onclick="importApp('${app.altStoreURL}')">インポートする</button>
        <button class="w-full btn-secondary" onclick="this.closest('.fixed').remove()">キャンセル</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function importApp(altStoreURL) {
  window.location.href = altStoreURL;
}

document.addEventListener('DOMContentLoaded', loadApps);
