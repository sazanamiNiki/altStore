---
title: "よくある質問"
description: "サイドローディング、AltStoreに関するよくある質問と回答。安全性、インストール方法、7日署名、パソコン不要の方法など。"
icon: "help"
iconColor: "text-blue-500"
---

サイドローディングについて、みんなが気になること

<img src="../assets/img/buncho.png" alt="ぶんちゃん" class="w-10 h-10 flex-shrink-0 mt-1 rounded-full bg-sky-100 border border-blue-200 -translate-y-3">

### Q. サイドローディングって危なくない？

A. 大丈夫です。このサイトで紹介しているアプリは、開発元がはっきりしている公式アプリのみです。
                  エミュレータ（Delta、UTMなど）はオープンソースで透明性が確保されており、クリエイターアプリはAppleの公証を受けたものを扱います。

AltStoreはオープンソースプロジェクトで、コードが公開されており透明性があります。
                  iOSの基本的なセキュリティ保護は維持されるので、安心して使えます。

大事なこと： このサイト以外から野良アプリを入れる時は注意してください。信頼できるリポジトリからインストールすることが何より大切です。

<img src="../assets/img/buncho.png" alt="ぶんちゃん" class="w-10 h-10 flex-shrink-0 mt-1 rounded-full bg-sky-100 border border-blue-200 -translate-y-3">

### Q. iPhoneが重くなったりしない？

A. ちゃんと管理すれば大丈夫。信頼できるアプリを入れていれば、普通のApp Storeアプリと変わりません。

iOS 17以降では、JITコンパイルという技術のおかげで、エミュレータなどのアプリも前より速く動くようになりました。
                  不要なアプリは削除して、バックグラウンド更新を管理すれば、サクサク快適に使えます。

注意： 非公式版や海賊版アプリは動作が不安定で、バッテリーを余計に消費することがあります。開発者の公式リポジトリから配布されているアプリを選びましょう。

<img src="../assets/img/buncho.png" alt="ぶんちゃん" class="w-10 h-10 flex-shrink-0 mt-1 rounded-full bg-sky-100 border border-blue-200 -translate-y-3">

### Q. AltStoreでうまくインストールできない時は？

A. よくある原因をチェックしてみてください：

PCとiPhoneがちゃんと繋がってる？（同じWi-Fiに接続してる？）

Apple IDのパスワードは合ってる？

MacやiPhoneで「信頼」をタップした？

AltStoreとiOSは最新版？

Windowsの場合：ファイアウォール（セキュリティ）で遮られてない？

Microsoft Store版のiTunes使ってない？（Apple公式版を使おう）

もっと詳しく： AltStoreの公式トラブルシューティングガイドや「アプリをインストールする方法」で画像付きで説明しています。

<img src="../assets/img/buncho.png" alt="ぶんちゃん" class="w-10 h-10 flex-shrink-0 mt-1 rounded-full bg-sky-100 border border-blue-200 -translate-y-3">

### Q. Developer Mode（開発者モード）って何？

A. iOS 16以降で追加された、開発者向けの特別なモードです。
                  Apple公式によると、アプリ開発に必要な高度な機能を使えるようにするものです。

なぜこんなモードがあるかというと、悪い人がこの機能を悪用しないようにするため。
                  普通に使う分にはオフのままで大丈夫で、特定のアプリ（エミュレータとか）を使う時だけオンにすればOKです。

ポイント： 普通にサイドローディングするだけなら、Developer Modeはオフのままでも問題ありません。アプリ側で必要な場合は、説明が出るので、その時にオンにしましょう。

<img src="../assets/img/buncho.png" alt="ぶんちゃん" class="w-10 h-10 flex-shrink-0 mt-1 rounded-full bg-sky-100 border border-blue-200 -translate-y-3">

### Q. Apple Certificateって必要なの？

A. いいえ、特別な証明書は必要ありません。普通のApple IDがあれば大丈夫です。

よく聞く「Developer ID Certificate」とか「公証」っていうのは、主にMac向けアプリの話。
                  iPhoneでサイドローディングする時は、AltStoreが自動で署名してくれるので、あなたが何か準備する必要はありません。

つまり： bunchoniki Storeで紹介しているアプリをインストールする時は、普通のApple IDだけでOK。有料のApple Developer Programに入る必要はありません。

<img src="../assets/img/buncho.png" alt="ぶんちゃん" class="w-10 h-10 flex-shrink-0 mt-1 rounded-full bg-sky-100 border border-blue-200 -translate-y-3">

### Q. iOSアップデートしたら消えちゃう？

A. 消えません。アプリ自体は残ります。

ただし、7日ごとの署名期限が切れていると起動できなくなります。
                  その場合は、AltStoreやSideStoreで再度署名すればまた使えるようになります。

SideStoreを使っていれば、バックグラウンドで自動的に署名を更新してくれるので、あなたが何もしなくても大丈夫。

ポイント： iOSアップデートでアプリが消えることはないけど、署名が切れた時は再署名が必要。SideStoreなら自動でやってくれます。

<img src="../assets/img/buncho.png" alt="ぶんちゃん" class="w-10 h-10 flex-shrink-0 mt-1 rounded-full bg-sky-100 border border-blue-200 -translate-y-3">

### Q. 複数のiPhoneやiPadで使える？

A. はい、使えます。同じApple IDで複数デバイスにインストールできます。

ただし、新しいデバイスにインストールすると、古い証明書が無効になって、他のデバイスのアプリが起動できなくなることがあります。
                  その時は、他のデバイスでも再署名すればOK。

AltStore 2.2.1以降なら、証明書を共有できる機能があるので、複数デバイスの管理がもっと楽になります。

制限： 無料のApple IDだと、一度に最大3つのアプリ（AltStore/SideStore含む）までインストールできます。1週間で最大10個の異なるアプリをインストール可能です。

<img src="../assets/img/buncho.png" alt="ぶんちゃん" class="w-10 h-10 flex-shrink-0 mt-1 rounded-full bg-sky-100 border border-blue-200 -translate-y-3">

### Q. パソコンって毎回必要？

A. SideStoreなら最初だけでOK。

普通のAltStoreは毎回パソコンにiPhoneを繋ぐ必要があるけど、SideStoreは最初にインストールした後は、Wi-Fiがあればパソコンなしでアプリを入れたり更新したりできます。

SideStoreはバックグラウンドで自動的に署名を更新してくれるから、7日ごとの署名切れも気にしなくて大丈夫。

おすすめ： SideStoreはiOS 14以降のすべてのiPhoneとiPadで動作します。パソコンレスで快適にサイドローディングしたいなら、SideStoreが一番です。

<img src="../assets/img/buncho.png" alt="ぶんちゃん" class="w-10 h-10 flex-shrink-0 mt-1 rounded-full bg-sky-100 border border-blue-200 -translate-y-3">

### Q. セキュリティは大丈夫？

A. 信頼できるソースから入手すれば大丈夫です。でも、どこからダウンロードするかが大事。

AltStoreやSideStoreはオープンソースで、コードが公開されているから安心。
                  iOSの基本セキュリティはそのまま保たれるし、怪しい動きをしていないか誰でも確認できます。

ただし、海賊版や非公式版のアプリを入れると、iPhoneがクラッシュしたり、バッテリーを余計に消費したりする可能性があります。
                  信頼できるソースからだけダウンロードしましょう。

警告： このサイト以外から野良アプリを入れる時は、そのアプリが本当に安全か、よく確認してください。開発者の公式リポジトリから入手することが一番の安全策です。

<img src="../assets/img/buncho.png" alt="ぶんちゃん" class="w-10 h-10 flex-shrink-0 mt-1 rounded-full bg-sky-100 border border-blue-200 -translate-y-3">

### Q. サイドローディングって違法じゃない？

A. 違法ではありません。自分のiPhoneにアプリを入れることは、どの国でも合法です。

EUではDigital Markets Act（DMA）という法律で、むしろサイドローディングを推奨しています。
                  日本でも2025年末に施行予定のスマホ新法で、サイドローディングが正式に認められる見込みです。

問題になるのは、著作権侵害アプリを配布したり、知的財産権を侵害したりすること。
                  個人で使う分には全く問題ありません。

安心してください： bunchoniki Storeで紹介しているアプリは、すべて合法的に配布されている公式アプリです。安心してご利用ください。

## まとめ

サイドローディングは安全で合法的な選択肢です

### 公式ソースから入手する

開発者の公式リポジトリや信頼できるストアからアプリを入手しましょう

### 自動更新が便利

SideStoreなら7日署名も自動で更新。パソコンも最初だけでOK

### 合法的な選択肢

サイドローディングは合法。日本でも新法で正式に認められる予定です

このFAQは2026年2月現在の情報に基づいています。法律やプラットフォーム仕様は変更される可能性があります。
