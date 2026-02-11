---
title: "AltStore完全ガイド：セットアップから運用まで徹底解説"
description: "AltStoreの基本、7日署名の仕組み、初期セットアップ、アプリのインストール方法、トラブルシューティングまで完全網羅。初心者でも安心して使えるガイド。"
icon: "download"
iconColor: "text-blue-500"
---

セットアップから運用、トラブル対応まで全て解説

## AltStoreを使いこなすための完全ガイド

「AltStoreって何？」「難しそう...」「PCが必要なの？」そんな疑問をお持ちの方へ。

このガイドでは、AltStoreの基礎知識から実際のセットアップ手順、日常的なメンテナンス方法、
          そしてトラブルが起きた時の対処法まで、全てをまとめて解説します。

初心者の方でも安心して読み進められるよう、画像付きで丁寧に説明していきます。

### より詳しく学ぶための関連記事

このページは、AltStoreに関する全ての情報を1つにまとめた統合ガイド・リファレンス編です。
              より詳しく学びたい方は、以下の記事もご覧ください。

AltStoreの使い方

7日署名の仕組みやAltServerの役割など、理論・仕組み編として詳しく解説

アプリをインストールする方法

実際のセットアップ手順に特化した実践・セットアップ編

## AltStoreとは

AltStoreは、App Storeの代わりとなるアプリストアで、PCやMacから簡単にサイドローディングできるツールです。
          サイドローディング初心者にとって、最も使いやすく安全な選択肢として知られています。

### 主な特徴

App Storeに登録されていないアプリをインストール可能

PC/Mac上のAltServerと連携して動作

Wi-Fi経由での自動更新に対応

無料のApple IDで利用可能

## AltStoreの仕組み：なぜ7日で署名が切れるのか

AltStoreには「7日ごとに署名が切れる」という独特の制限があります。

### App Storeとの配信の違い

App Storeを通じて配信されるアプリは、Appleが永続的に署名（デジタル認証）を提供します。
          これにより、ユーザーは何年でも同じアプリを使い続けることができます。

しかしAltStoreでは、開発者がApple IDを使ってアプリを署名しています。
          無料のApple IDで署名したアプリの有効期限は、著作権法の保護期間の関係から7日間と決められています。

### 署名（Signature）とは何か

「署名」とは、Appleが「このアプリは信頼できる開発者から提供されたものだ」と保証するデジタルスタンプのようなものです。
          iOSは、署名の有効期限をチェックして、期限切れのアプリの実行を許可しません。

7日ごとに署名を更新することで、iOSに「このアプリはまだ信頼できる」と認識させ直すわけです。

### 有料開発者アカウントなら制限なし

Apple Developer Program（年額99ドル）に登録している開発者は、永続的な署名を行うことができます。
          つまり、有料開発者アカウントを使えば、7日ごとの更新は不要になります。

## 事前準備：必要な環境

AltStoreをインストールする前に、以下を用意してください。

<table class="w-full border-collapse border border-gray-300">
            <thead>
              <tr class="bg-gray-100">
                <th class="border border-gray-300 px-4 py-2 text-left">項目</th>
                <th class="border border-gray-300 px-4 py-2 text-left">要件</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border border-gray-300 px-4 py-2 font-semibold">iOS</td>
                <td class="border border-gray-300 px-4 py-2">iOS 14.4以上</td>
              </tr>
              <tr class="bg-gray-50">
                <td class="border border-gray-300 px-4 py-2 font-semibold">PC/Mac</td>
                <td class="border border-gray-300 px-4 py-2">Windows 10以上、またはmacOS 10.14以上</td>
              </tr>
              <tr>
                <td class="border border-gray-300 px-4 py-2 font-semibold">Apple ID</td>
                <td class="border border-gray-300 px-4 py-2">無料アカウントでOK（2段階認証推奨）</td>
              </tr>
              <tr class="bg-gray-50">
                <td class="border border-gray-300 px-4 py-2 font-semibold">USBケーブル</td>
                <td class="border border-gray-300 px-4 py-2">データ転送対応のケーブル（初回のみ）</td>
              </tr>
            </tbody>
          </table>

重要：Developer Accountは不要

有料のDeveloper Accountは必要ありません。無料のApple IDで大丈夫です。

USBケーブルについて

初回セットアップ時のみ、iPhoneをPC/MacにUSBで接続します。その後はWi-Fi経由での操作になるため、毎回USB接続は不要です。

接続トラブルの9割はケーブルが原因です。
            100均の「充電専用」ケーブルではAltServerは認識しません。必ずデータ転送対応のケーブルを使ってください。

## 初期セットアップ手順

### ステップ1: AltServerをダウンロード＆インストール

#### AltServerとは

AltServerは、PC/Mac上で動作するツールで、AltStoreにアプリをインストール・更新するために必要なアプリケーションです。
          いわば「App Storeの配信役」のような存在です。

#### ダウンロード手順

AltServer 公式サイト（Mac）

AltServer 公式サイト（Windows）

お手持ちのOS（Windows / Mac）に合わせてダウンロードボタンをクリック

ダウンロードしたインストーラーを実行

### ステップ2: AltServerにApple IDでログイン

AltServerを起動（メニューバーまたはシステムトレイに表示）

AltServerのメニューから「Sign In」または「ログイン」を選択

iPhoneで使用しているApple ID（メールアドレスとパスワード）を入力

2段階認証が有効な場合、確認コードを入力

### ステップ3: iPhoneを接続して初回セットアップ

iPhoneをUSBケーブルでPC/Macに接続

「このコンピューターを信頼しますか？」→「信頼」をタップ

AltServerのメニューから「Install AltStore」を選択

数秒～数十秒でインストール完了

iPhoneのホーム画面に「AltStore」アプリが追加される

iPhone上のAltStoreアプリを起動し、Apple IDでサインイン

### ステップ4: Wi-Fi経由での自動更新設定（推奨）

自動更新で手間いらず

AltStoreのアプリは7日ごとに署名を更新する必要があります。
            毎回USBで接続する代わりに、Wi-Fi経由で自動更新するように設定すると、手動操作がほぼ不要になります。

PC/MacのAltServerメニューから、インストール済みのiPhoneを選択

「Sync with [iPhone name] over Wi-Fi」オプションをオンにする

PC/MacとiPhoneが同じWi-Fiネットワークに接続していることを確認

AltServerをバックグラウンドで起動したままにする

自動更新の仕組みについて

AltServerによる自動更新では、7日ごとに再署名が行われます。
            この再署名プロセスでは、Apple公証ステータスが毎回失われます。

つまり：

初回インストール時は公証済みの状態

7日後の自動更新以降は、公証なしの状態で動作

ただし、iOSのサンドボックス構造により基本的な安全性は維持されます

## アプリのインストール方法

### 方法1: AltStore内でアプリを探す

iPhone上のAltStoreアプリを開く

複数のアプリが表示される（Tweaked Apps、Emulatorsなど）

インストールしたいアプリを探してタップ

アプリの詳細ページから「Get」をタップ

ダウンロード完了を待つ

「Open」ボタンに変わったらタップして起動

数秒待つと、App StoreのアイコンのようにiPhoneのホーム画面に追加されます。

### 方法2: bunchoniki Storeサイトからダウンロードしてインストール

当サイト（bunchoniki Store）のアプリカタログから、厳選されたIPAファイルをダウンロードしてインストールできます。

#### ステップ1: アプリを探してダウンロード

トップページから「アプリを探す」をタップ

検索バーでアプリ名を入力、またはカテゴリーでフィルタ

目的のアプリカードをタップして詳細を確認

「入手」ボタンをタップ

モーダルが表示されたら「ダウンロード」をタップ

iPhoneの「ファイル」アプリに.ipaファイルが保存されます

#### ステップ2: AltStoreでIPAをインストール

iPhone単体でインストールする場合:

AltStoreアプリを起動

下部タブの「My Apps」をタップ

左上の「+」アイコンをタップ

「ファイル」からダウンロードしたIPAファイルを選択

インストールが始まります（数秒～数分）

完了すると、ホーム画面にアプリアイコンが表示されます

配布方法の確認

アプリカタログでは各アプリに「App Store配信」または「IPA配布」のバッジが表示されます。

「App Store配信」のアプリは、App Storeから直接ダウンロードしてください（7日署名不要）

「IPA配布」のアプリのみ、この手順でインストールします

アプリスロットの制限

無料Apple IDでは、AltStore自体を含めて最大3つのアプリまで同時にインストール可能です。
            新しいアプリをインストールする前に、不要なアプリを削除してスロットを空ける必要がある場合があります。

### 方法3: 外部サイトからIPAファイルを入手

AltStore内のアプリ一覧や当サイト以外にも、他のWebサイトやGitHubからIPAファイルをダウンロードして、
          AltServerからインストールする方法もあります。

これは、カスタムアプリや個人開発アプリをインストールしたい場合に便利ですが、
          信頼できるソースからのみダウンロードしてください。
          野良サイトからのIPAファイルにはマルウェアが含まれている可能性があります。

## 署名の更新とメンテナンス

### 手動更新（Wi-Fi同期なし）

AltStoreアプリを開く

署名を更新したいアプリの横に表示されている更新ボタン（↻）をタップ

数分で完了

### Wi-Fi経由の自動更新（推奨）

前述の「ステップ4」の設定を完了していれば、何もしなくても自動的に更新されます。
          PCを起動してAltServerを実行しているだけで大丈夫です。

### 更新の頻度

重要：7日ごとの署名更新を忘れずに

AltStoreのアプリは7日ごとに署名が切れます。

Wi-Fi同期が有効な場合: 期限切れの2～3日前に自動更新される

手動更新の場合: 7日以内なら随時更新できる。期限を過ぎるとアプリが起動しなくなるので注意

## トラブルシューティング

### Q. インストールが失敗する

基本的なチェック項目

Apple IDのパスワードが正しく入力されているか

iOSが14.4以上か

iPhoneの容量は十分か（アプリサイズ以上の空きが必要）

AltServerを再起動してみる

### Q. インストール後、アプリが起動しない

原因: 署名が切れている可能性があります

解決法:

AltStoreアプリを開く

該当アプリの横に表示されている更新ボタン（↻）をタップ

署名を更新

通常、数分で起動可能になります

### Q. Wi-Fi自動更新がうまくいかない

Wi-Fi同期のチェックポイント

PC/MacとiPhoneが同じWi-Fiネットワークに接続しているか

AltServerがPC上でバックグラウンド実行中か（メニューバーに表示されているか）

Wi-FiルーターのファイアウォールがAltServerの通信をブロックしていないか

PCを再起動して、再度Wi-Fi同期をオンにしてみる

### Q. 署名が切れたアプリはどうなる？

A. アプリが起動しなくなります。削除されたわけではなく、iPhone上には残っていますが、
          iOSがセキュリティ上の理由で実行を許可しません。署名を更新すれば、すぐに使えるようになります。

### Q. 複数のiPhoneで使える？

A. 可能です。同じApple IDで複数の端末を登録すれば、複数のiPhone/iPadでAltStoreを使用できます。
          ただし、無料Apple IDには「App ID」という制限があり、同時に署名できるアプリ数には上限があります。

### Q. PCがない場合はどうする？

A. 家族や友人のPC/Macを借りて初回セットアップを完了させれば、
          その後はiPhone上で手動で署名を更新できます。毎回USB接続は不要です。

### Q. Apple IDが複数ある場合は？

A. AltServerとAltStoreに同じApple IDでサインインしてください。複数のApple IDは対応していません。

## SideStoreとの比較

SideStoreは、AltStoreをベースに開発されたコミュニティ主導のサイドローディングアプリです。

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

AltStoreを選ぶ場合: PCに定期的にアクセスでき、シンプルなセットアップを好む方。初心者にもおすすめ。

SideStoreを選ぶ場合: PCへのアクセスが限られており、完全にオンデバイスでアプリ管理をしたい方。一度セットアップすれば独立して運用可能。

SideStoreについて詳しく知りたい方は：
            「SideStoreガイド」

## まとめ

### AltStoreの基本

AltStoreは7日ごとに署名を更新する必要があります（著作権法の保護期間の制約）

AltServerを使えば、PC/MacからWi-Fi経由で自動更新が可能

AltServerをバックグラウンド起動しておけば、ほぼ手放しで署名管理ができます

PCがない場合でも手動更新で対応可能

有料開発者アカウントなら、7日制限を回避できます

### セットアップの流れ

事前準備: iOS 14.4以上、PC/Mac、有効なApple IDを用意

セットアップ: AltServerをインストール → Apple IDでサインイン → 初回はUSB接続でAltStoreをインストール（その後はWi-Fiで操作可能）

アプリのインストール: iPhone上のAltStoreアプリから好きなアプリを選んで「Get」をタップするだけ（App Storeと同じくらい簡単）

メンテナンス: Wi-Fi自動更新を設定すれば、ほぼ手放しで署名管理ができる（PCを常に起動する必要はない）

トラブル時: ほとんどの問題はApple IDの確認やPCの再起動で解決

次に読むべき記事：
            「サイドローディングとは」、
            「安全ガイド」、
            「神アプリ3選」

### 次に読むべきおすすめ記事

#### 安全ガイド

ウイルスから身を守る3つの鉄則。サイドローディングを安全に使うための必読ガイド。

#### 神アプリ3選【2026最新】

Delta エミュレータ、UTM SE、SideStore の3大アプリを徹底解説。
