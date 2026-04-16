#!/usr/bin/env node
/**
 * IndexNow ping スクリプト
 * ビルド後に実行して、Bing/Yandex等にURL更新を通知する。
 *
 * 使い方:
 *   npm run indexnow          # dist/sitemap-0.xml の全URL を送信
 *   node scripts/indexnow.mjs # 同上
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const HOST = 'altstore-jp.bunchoniki.com';
const KEY = '99bdaeff-d235-4169-9679-00a513d138a0';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

// サイトマップからURL一覧を抽出
function extractUrls(sitemapPath) {
  const xml = readFileSync(sitemapPath, 'utf-8');
  const urls = [];
  const re = /<loc>(.*?)<\/loc>/g;
  let match;
  while ((match = re.exec(xml)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

async function main() {
  const sitemapPath = resolve('dist/sitemap-0.xml');

  let urls;
  try {
    urls = extractUrls(sitemapPath);
  } catch {
    console.error('❌ dist/sitemap-0.xml が見つかりません。先に npm run build を実行してください。');
    process.exit(1);
  }

  if (urls.length === 0) {
    console.log('⚠️  サイトマップにURLがありません。');
    return;
  }

  console.log(`📡 IndexNow: ${urls.length} 件のURLを送信します...`);

  const body = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    });

    if (res.ok || res.status === 202) {
      console.log(`✅ 送信成功 (HTTP ${res.status})`);
      console.log('   送信URL:');
      for (const url of urls) {
        console.log(`   - ${url}`);
      }
    } else {
      const text = await res.text();
      console.error(`❌ 送信失敗 (HTTP ${res.status}): ${text}`);
      process.exit(1);
    }
  } catch (err) {
    console.error(`❌ 通信エラー: ${err.message}`);
    process.exit(1);
  }
}

main();
