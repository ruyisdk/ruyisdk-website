---
title: About
linkTitle: About
menu: {main: {weight: 10}}
---

{{% blocks/cover title="RuyiSDKについて" image_anchor="bottom" height="auto" %}}

RUYISDKは、統合開発環境を提供することを目的とした製品計画です。2023年から準備を始め、3年間でRISC-V開発者に対して完全で包括的な開発環境を提供することを計画しています。
{.mt-5}

{{% /blocks/cover %}}

{{% blocks/section %}}

## RUYISDKの目標

1. 開発者が（ほぼ）どのようなRISC-V開発ボードやモジュールを購入しても、RUYISDKシステムを通じてハードウェアの資料説明、ファームウェア/ソフトウェアの更新、デバッグサポートなどを得ることができます。
2. 開発者は、一般的なRISC-V拡張命令セットアーキテクチャの任意の組み合わせを指定でき、RUYISDKシステムを通じて、顧客が必要とするオペレーティングシステム、ツールチェーン、言語実行環境（ランタイムまたは仮想マシン）、計算ライブラリ、アプリケーションフレームワークなどを生成できます。特に、RUYISDKはVector 0.7.1やRVP 0.5.2など、既に大規模にシリコン化されているドラフト標準（またはメーカー固有の拡張）を完全にサポートすることを強調しています。
3. 活発で包括的な開発者コミュニティの育成と運営を行います。

{{% /blocks/section %}}
{{% blocks/section color="white" %}}

## RUYISDKアーキテクチャ図

<img src=./1703147196780.png width=100% >
{{% /blocks/section %}}

{{% blocks/section color="primary" %}}

## RuyiSDKの構成

RuyiSDKは、コンポーネントマネージャー（Ruyiパッケージマネージャーとも呼ばれる）、統合開発環境（Ruyi IDE）、開発者交流コミュニティを主に含んでいます: 

- Ruyiコンポーネントマネージャーには、オンラインソフトウェアリポジトリ（Ruyi repo）とパッケージ管理ツール（ruyi）が含まれます。オンラインソフトウェアリポジトリ、すなわちRuyiRepoは、RISC-V統合開発環境に必要なコンパイルツールチェーン、デバッグツール、エミュレータ、ランタイム、文書、コード、ツール、ターゲットシステムのイメージなどを集中的に保存しています。パッケージ管理ツールは、オンラインソフトウェアリポジトリとのやり取りを行うツールで、コマンドラインインターフェース（ruyi）またはグラフィカルユーザーインターフェース（将来的に提供される可能性があります）を提供し、開発者がソフトウェアパッケージを検索、インストール、更新、管理できるようにします。パッケージ管理ツールは、オンラインソフトウェアリポジトリからソフトウェアパッケージの情報を取得し、ソフトウェアパッケージの依存関係を解析し、依存関係のダウンロードとインストールを自動的に処理します。
- Ruyi統合開発環境（Ruyi IDE）は、RISC-Vアーキテクチャデバイス上で動作するソフトウェアやアプリケーションを開発するためのツールボックスです。開発者が自分のプログラムを作成しテストするのを助けます。

    想像してみてください。RISC-Vデバイス上で動作するアプリケーションを開発したいとします。たとえば、CまたはC++言語で画像認識プログラムを開発する場合、Ruyi IDEはあなたのスタジオのようなもので、様々なツールがこのタスクを完了するのに役立ちます。まず、プロジェクトを作成し、RuyiSDKパッケージマネージャーから必要なコンパイルツールチェーン、デバッグツール、シミュレーターなどのツールをダウンロードしてインストールします。次に、テキストエディターでコードの編集を行い、プロジェクトをコンパイルしてRISC-Vアーキテクチャの実行可能プログラムを生成し、最後にシミュレーターやRISC-V開発ボード上で実行とテストを行います。コードのデバッグが必要な場合は、デバッグツールを使用してデバッグを行うことができます。このプロセスは、x86の開発、コンパイル、デバッグ、実行の流れと一致していますが、現在の開発言語とターゲット実行デバイスであるRISC-Vに適したコンパイルツールチェーン、シミュレーターなどのソフトウェアとツールはすべてRuyiパッケージマネージャーから入手でき、インストールとIDEの初期設定はRuyi統合開発環境に統合されているため、ユーザーは環境構築に労力を費やす必要がありません。
- Ruyi開発者コミュニティは、ドキュメントとチュートリアル、フォーラムと技術ディスカッションエリア、ブログとドキュメントなどの機能を提供しており、目的はRISC-V開発者に開かれた交流プラットフォームを提供し、相互支援型の技術サポートとリソース共有を提供し、RISC-V開発者を集め、RISC-Vエコシステムの発展を推進することです。
<!-- {.text-center} -->

{{% /blocks/section %}}

