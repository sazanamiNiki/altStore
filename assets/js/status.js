/**
 * status.js - サイト全体のステータスバー管理
 *
 * 使い方:
 *   SITE_STATUS.alerts の各項目を編集し、active: true にすると表示されます。
 *   type は 'info'（青）/ 'warning'（黄橙）/ 'error'（赤）の3種類。
 */

const SITE_STATUS = {
  // 現在の対応iOSバージョン
  ios: {
    min: '17.0',
    max: '18.3',
  },

  // お知らせ一覧（active: true のものだけ表示されます）
  alerts: [
    {
      id: 'ios-support',
      type: 'info',
      icon: 'smartphone',
      message: '対応iOS: 17.0〜18.3 ｜ AltStore PAL / AltStore Classic 最新版対応',
      active: true,
    },
    // 警告の例 — 必要に応じて active: true にしてください
    // {
    //   id: 'ios-update-warning',
    //   type: 'warning',
    //   icon: 'warning',
    //   message: 'iOS 18.4 の対応状況を確認中です。アップデートはしばらくお待ちください。',
    //   active: false,
    // },
    // 障害・緊急情報の例
    // {
    //   id: 'altstore-outage',
    //   type: 'error',
    //   icon: 'error',
    //   message: '現在 AltStore のサーバーで障害が発生しています。復旧まで今しばらくお待ちください。',
    //   active: false,
    // },
  ],
};

// ---------------------------------------------------------------------------
// 内部実装
// ---------------------------------------------------------------------------

const _STATUS_STYLES = {
  info: {
    bar:  'bg-sky-50 border-sky-200',
    text: 'text-sky-800',
    icon: 'text-sky-500',
  },
  warning: {
    bar:  'bg-amber-50 border-amber-300',
    text: 'text-amber-900',
    icon: 'text-amber-500',
  },
  error: {
    bar:  'bg-red-50 border-red-300',
    text: 'text-red-900',
    icon: 'text-red-500',
  },
};

function createStatusBar() {
  const activeAlerts = SITE_STATUS.alerts.filter(function(a) { return a.active; });
  if (activeAlerts.length === 0) return '';

  var items = activeAlerts.map(function(alert) {
    var s = _STATUS_STYLES[alert.type] || _STATUS_STYLES.info;
    return (
      '<div class="' + s.bar + ' border-b last:border-b-0">' +
        '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-2">' +
          '<span class="material-symbols-outlined ' + s.icon + '" style="font-size:18px;line-height:1">' + alert.icon + '</span>' +
          '<span class="text-sm font-medium ' + s.text + '">' + alert.message + '</span>' +
        '</div>' +
      '</div>'
    );
  }).join('');

  return '<div id="site-status-bar" class="border-b border-gray-100">' + items + '</div>';
}

function renderStatusBar() {
  var headerContainer = document.getElementById('header-container');
  if (!headerContainer) return;

  // 二重挿入を防止
  if (document.getElementById('site-status-bar')) return;

  var html = createStatusBar();
  if (!html) return;

  headerContainer.insertAdjacentHTML('afterend', html);
}

document.addEventListener('DOMContentLoaded', renderStatusBar);
