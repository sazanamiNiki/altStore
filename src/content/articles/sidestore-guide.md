---
title: "SideStore完全ガイド：PC不要でアプリを管理"
description: "PC不要でアプリを管理する日本語ガイド。SideStoreのインストールから使い方まで解説。"
icon: "smartphone"
iconColor: "text-purple-500"
---

PC不要でアプリを管理する方法 - AltStoreとの違いも徹底解説

## はじめに

SideStoreは、AltStoreをベースに開発されたコミュニティ主導のサイドローディングアプリです。最大の特徴は、初回セットアップ後はPCなしでアプリのインストールや更新が可能な点です。VPN技術を活用することで、iOSの制限を回避し、完全にデバイス上でサイドローディングを完結させることができます。

本ガイドでは、SideStoreの仕組み、AltStoreとの違い、セットアップ手順、そしてトラブルシューティングまで詳しく解説します。iOS 14からiOS 18.4まで対応しており、2026年現在も活発に開発が続けられています。

SideStoreとAltStoreの違い

### 基本的な違い

SideStoreはAltStoreのフォーク（派生版）として開発され、コミュニティから最も要望の多かった機能を実装しています。主な違いは以下の通りです：

<table class="w-full border-collapse border border-gray-300">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="border border-gray-300 px-4 py-2 text-left">項目</th>
                    <th class="border border-gray-300 px-4 py-2 text-left">AltStore</th>
                    <th class="border border-gray-300 px-4 py-2 text-left">SideStore</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2 font-semibold">PC接続</td>
                    <td class="border border-gray-300 px-4 py-2">毎週必要（7日ごとの更新時）</td>
                    <td class="border border-gray-300 px-4 py-2">初回セットアップのみ</td>
                  </tr>
                  <tr class="bg-gray-50">
                    <td class="border border-gray-300 px-4 py-2 font-semibold">アプリ更新方式</td>
                    <td class="border border-gray-300 px-4 py-2">AltServer経由（Wi-Fi/USB）</td>
                    <td class="border border-gray-300 px-4 py-2">VPN経由（完全オンデバイス）</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2 font-semibold">開発体制</td>
                    <td class="border border-gray-300 px-4 py-2">Riley Testut氏主導</td>
                    <td class="border border-gray-300 px-4 py-2">コミュニティ主導</td>
                  </tr>
                  <tr class="bg-gray-50">
                    <td class="border border-gray-300 px-4 py-2 font-semibold">VPN必要性</td>
                    <td class="border border-gray-300 px-4 py-2">不要</td>
                    <td class="border border-gray-300 px-4 py-2">必要（LocalDevVPNまたはStosVPN）</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2 font-semibold">セットアップ難易度</td>
                    <td class="border border-gray-300 px-4 py-2">比較的簡単</td>
                    <td class="border border-gray-300 px-4 py-2">やや複雑（VPN設定が必要）</td>
                  </tr>
                </tbody>
              </table>

### どちらを選ぶべきか？

AltStoreを選ぶ場合

PCに定期的にアクセスでき、シンプルなセットアップを好む方。初心者にもおすすめ。

SideStoreを選ぶ場合

PCへのアクセスが限られており、完全にオンデバイスでアプリ管理をしたい方。一度セットアップすれば独立して運用可能。

VPN（EM Proxy）を使用した仕組み

### なぜVPNが必要なのか

通常、iOSアプリのサイドローディングには開発者証明書による署名が必要で、これにはPC上のツール（AltServerなど）が必要です。SideStoreはこの制限を回避するため、「EM Proxy」という技術を使用しています。

EM Proxyとは

EM Proxyは、SideStoreの最も重要な機能である「アンテザード（PC不要）インストール」を実現する技術です。特別なエンタイトルメント（権限）を持つApp Store公開アプリ「LocalDevVPN」を使用してVPNトンネルを作成し、「Jitterbug」のループバック方式を活用することで、有料の開発者アカウントなしでもアプリのインストールが可能になります。

### LocalDevVPNとStosVPN

#### LocalDevVPN

LocalDevVPNはApp Storeから無料でダウンロード可能なVPNアプリです。SideStoreと連携して動作し、アプリのインストール、更新、リフレッシュ時にVPN接続が必要です。

App Store またはAltStore PALソースから入手可能

ローカル接続のみを使用（外部サーバーへの接続なし）

バッテリー消費はほぼゼロ（自分のデバイスへの接続のみ）

#### StosVPN（推奨）

StosVPNは2025年4月にApp Storeでリリースされた、SideStoreチームが開発した専用VPNクライアントです。LocalDevVPNの代替として使用でき、いくつかの利点があります：

オフライン対応

オフライン状態でもJIT有効化が可能

高い安定性

WireGuardベースのソリューションより安定

モバイルデータ対応

iOSの制限を受けずセルラー回線でも正常動作

省電力

SideStoreのトラフィックのみをルーティングするため電力消費が極めて少ない

### VPNの動作原理

VPNは「仮想プライベートネットワーク」の略ですが、SideStoreで使用するVPNは一般的なVPNとは異なり、外部への接続は行いません。代わりに、デバイス内部でのループバック接続を確立し、iOSにアプリが正規にインストールされたと認識させる役割を果たします。

重要

VPNはアプリのインストール、更新、リフレッシュ時のみ有効にする必要があります。常時接続している必要はありません。作業完了後はVPNを切断しても、インストールされたアプリは正常に動作します。

初期セットアップ手順

### 必要な環境

対応iOS

iOS 14.0 - iOS 18.4

PC

Windows 10以降、またはmacOS（初回セットアップ時のみ）

Apple ID

無料アカウントでOK（ただし制限あり）

USBケーブル

iPhoneとPCを接続するため

1
                  Developer Modeの有効化

iOS 16以降を使用している場合、Developer Mode（開発者モード）を有効にする必要があります：

1

「設定」アプリを開く

2

「プライバシーとセキュリティ」をタップ

3

画面下部までスクロールし「デベロッパモード」をタップ

4

スイッチをオンにする

5

デバイスが再起動を要求したら「再起動」をタップ

6

再起動後、確認ダイアログで「オンにする」をタップ

2
                  SideStoreのインストール（iLoader使用）

SideStoreの初回インストールには「iLoader」またはAltServerを使用します：

1

PCにiLoaderまたはAltServerをダウンロード・インストール

2

iPhoneをUSBケーブルでPCに接続

3

iPhoneで「このコンピュータを信頼」を選択

4

SideStoreのIPAファイルをダウンロード

公式GitHubから最新版を取得

5

iLoaderまたはAltServerを使用してIPAをインストール

6

Apple IDでサインイン

新規アカウントの作成を推奨

3
                  VPNの設定

1

App StoreからLocalDevVPNまたはStosVPNをダウンロード

2

VPNアプリを開き「接続」をタップ

3

「VPN構成の追加を許可」の確認が表示されたら「許可」をタップ

4

パスコードを入力してVPN構成を追加

4
                  証明書の信頼設定

1

「設定」アプリを開く

2

「一般」→「VPNとデバイス管理」を選択

3

「デベロッパApp」セクションに表示されている自分のApple IDをタップ

4

「[Apple ID名]を信頼」をタップし、確認画面で「信頼」を選択

5
                  SideStoreの初回リフレッシュ

1

VPNアプリで「接続」を確認

2

SideStoreを起動

3

iLoaderで使用したApple IDでサインイン

4

「My Apps」タブに移動

5

SideStoreの横にある「7 DAYS」カウンターをタップして手動リフレッシュ

6

リフレッシュ完了後、SideStoreのセットアップが完了

アプリの追加・更新・管理

### アプリの追加方法

#### 方法1: ソースからインストール

1

VPNを接続

2

SideStoreを起動し「Browse」タブをタップ

3

利用可能なアプリ一覧から目的のアプリを探す

4

「GET」をタップしてインストール

5

インストール完了後、VPNを切断可能

#### 方法2: カスタムソースの追加

1

SideStoreで「Browse」→「Sources」をタップ

2

右上の「+」ボタンをタップ

3

ソースのURLを入力して「Add Source」をタップ

4

追加したソースからアプリをブラウズ・インストール

#### 方法3: IPAファイルから直接インストール

1

IPAファイルを「ファイル」アプリに保存

2

VPNを接続

3

SideStoreで「My Apps」タブ→左上の「+」ボタンをタップ

4

「ファイル」からIPAを選択

5

インストール完了を待つ

### アプリの更新方法

アプリの更新が利用可能な場合、SideStoreの「My Apps」タブにバッジが表示されます：

1

VPNを接続

2

SideStoreで「My Apps」タブを開く

3

更新が必要なアプリの横にある「UPDATE」をタップ

4

または上部の「Update All」で一括更新

### 7日間のリフレッシュについて

無料のApple IDで署名されたアプリは7日間で有効期限が切れます。SideStoreはバックグラウンドで自動的にアプリをリフレッシュしますが、以下の点に注意してください：

バックグラウンドリフレッシュにはVPN接続が必要

7日以内に少なくとも1回はSideStoreを開いてリフレッシュを確認

「My Apps」の各アプリ横に残り日数が表示される

有効期限が切れるとアプリが起動できなくなる（再リフレッシュで復活）

### アプリ数の制限

無料Apple IDの制限

SideStore自体を含めて同時に3つのアプリまでしかインストールできません。また、1週間に10個までの異なるアプリしかインストールできません。

この制限を回避する方法：

有料開発者アカウント

$99/年。365日の有効期限とアプリ数制限なし

LiveContainer

1つのアプリスロット内で複数のアプリを切り替えて使用

SparseRestore

iOS 18 db5/18.0.1以下で使用可能な3アプリ制限回避方法

トラブルシューティング

### よくある問題と解決方法

「Unable to Install」エラー

原因

VPNが接続されていない、または証明書が信頼されていない

解決策：

1

VPNアプリで接続状態を確認

2

「設定」→「一般」→「VPNとデバイス管理」で証明書を信頼

3

SideStoreとVPNアプリを再起動

アプリが7日後に開けなくなった

原因

証明書の有効期限切れ

解決策：

1

VPNを接続してSideStoreを起動

2

「My Apps」でアプリをリフレッシュ

3

SideStore自体が開けない場合はiLoaderで再インストール

VPNが接続できない

原因

VPN構成の問題、またはネットワークの問題

解決策：

1

「設定」→「一般」→「VPNとデバイス管理」→「VPN」でプロファイルを削除し再設定

2

LocalDevVPNの代わりにStosVPNを試す

3

デバイスを再起動

「Maximum App ID Limit Reached」エラー

原因

週間アプリ制限（10個）に達した

解決策：

1

7日間待ってから再試行

2

不要なアプリを削除してスロットを空ける

3

LiveContainerの使用を検討

Developer Modeが表示されない

原因

iOS 15以前を使用、またはまだ一度もサイドロードを試みていない

解決策：

1

iOS 15以前では Developer Mode は不要

2

iOS 16以降では、まずiLoaderでアプリをインストールしようとすると表示される

3

Xcodeをインストールしたmacに接続すると表示される場合あり

### その他のヒント

SideStoreの最新Nightlyビルド（2026年1月時点でv0.6.3）を使用することで最新の修正が適用される

問題が解決しない場合は、SideStore公式Discordサーバーでサポートを求める

公式ドキュメント（docs.sidestore.io）で最新の情報を確認

## まとめ

SideStoreは、AltStoreの利便性を継承しながら、PC依存を最小限に抑えた革新的なサイドローディングソリューションです。VPN技術を活用することで、初回セットアップ後は完全にiPhone単体でアプリの管理が可能になります。

セットアップはAltStoreより複雑ですが、一度完了すれば自由度の高いアプリ管理が実現します。無料Apple IDの制限（3アプリ、7日間）はありますが、定期的なリフレッシュを忘れなければ問題なく使用できます。

PCへのアクセスが限られている方や、完全にモバイルでの運用を希望する方には、SideStoreは最適な選択肢です。コミュニティ主導の活発な開発により、継続的な改善と新機能の追加が期待できます。

#### 関連リンク

SideStore公式サイト

SideStore公式ドキュメント

SideStore GitHub

StosVPN GitHub
