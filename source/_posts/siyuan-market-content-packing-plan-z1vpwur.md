---
title: 思源集市内容打包方案
date: '2024-11-15 17:52:03'
updated: '2026-01-20 21:50:35'
tags:
  - 思源笔记
  - GitHub
permalink: /post/2024/11/siyuan-market-content-packing-plan-z1vpwur.html
comments: true
toc: true
---



想要给集市上架一个插件/主题/模板等内容，就不可避免地面临发布前的一个重要动作：打包。

集市从你的仓库里拉取文件的**必要条件**就是一个以版本号命名的 tag 和这个 tag 对应的发布（Release），并且必须有一个名为 **package.zip** 的文件。

要打包这个 `package.zip` ​文件可以有多种途径。

# 手动打包

官方插件给的打包方法就是

```bash
pnpm run build
```

在本地运行命令之后就会生成一个 `package.zip` ​文件，随后由你自行创建一个 tag 并推送到 GitHub 上，或者在 GitHub Release 页面新建一个发布并 tag 为当前版本号。

这个过程短时间不会造成多少困扰，并且好处是你可以完全控制发版的时间，甚至可以在发现出了 bug 之后先修 bug 再打包发版。不过如果你的主题/模板/挂件等不需要经过什么编译环节，而是直接就有 `plugin/theme/template.json`​、`icon.png`​、`preview.png` ​这些文件的话，你要做的就是每次修改 `*.json` ​的版本号并且手动选择所有需要的文件压缩并上传。

手动打包的流程显然不至于造成多少困扰，不过如果你厌倦了这种手动发版的流程，就需要寻找替代品。以下列出本地方案和云端方案共计 2 种。

# 批处理脚本

对于固定的任务，在本地使用批处理脚本当然可以显著减少工作量。你可以使用自己的经验编写 `.bat`​、`.sh`​、`.ps1` ​等脚本来完成编译文件、打包压缩包的操作。

编译环节可以自行按照使用的技术来编写脚本，比如 pnpm 编译、typescript 编译等，如果没有也可干脆略过。

打包环节可以选用支持命令行处理的压缩软件，比如 7-zip 就挺好的，如果你不用 7z 作为平时使用的压缩软件，它也不会贸然出现打扰到你，完全可以只在脚本里调用到它。

不过可惜我没有使用批处理脚本打压缩包的经验，所以这部分没办法给出合适的代码示例，不过这个可以去问 AI，让 AI 生一个批处理脚本还是很快且较准确的。

# GitHub Actions

既然你的代码是托管在 GitHub 上的，并且还是开源的（显然应该如此，特殊情况例外），那么你的仓库就有很长的 GitHub Actions 时长。我记得 GitHub 对开源仓库提供不限时长的 GitHub Actions 调用，如果不是如此，你每个月也有 2000 小时的时长可用。用来打包一个压缩包多半连零头都用不到。

不过使用 GitHub Actions 的方法我又分为两种类型，主要是推送触发器的不同。下面我先简要介绍 GitHub Actions 文件的结构，再放出具体代码。

GitHub Actions（GitHub 工作流）是由 yaml 文件定义的，并且会在声明的触发器被触发时自动运行。所有 GitHub Actions 文件放在你仓库根目录下的 `.github/workflows/` ​目录下，这里的 `workflows` ​大小写不限。在创建这个目录之后，在里面新建一个 `.yml` ​格式的文件，文件名任意，我个人推荐 `package.yml` ​或 `release.yml`。

yaml 的格式定义如下，注意需要有合适的缩进，缩进距离不限，大多为 2 空格或 4 空格：

```yaml
name: 你的工作流名称，可不与文件名相同

on: # 这里是触发器
  push: # 这个触发器是推送，会在推送仓库时触发
    tags: # 这个触发器是tag，会在推送标签时触发
      - "v*" # 推送任何名称为 v 开头的tag时触发

jobs: # 你的工作流要完成的任务放在这里
  build: # 你的工作流的第一个任务
    runs-on: ubuntu-latest # 工作流的运行环境，一般都是最新的Ubuntu
      steps: # 你的这个任务的步骤放在这里
        - name: checkout # 步骤的名称，这个步骤是标准的切换到仓库的步骤
          uses: actions/checkout@v3 # 步骤使用的actions，通过调用他人写好的actions帮助完成自己的目的，这个是切换到仓库
```

这里我大致介绍了以下 GitHub Actions 的结构，不继续展开写，请看下面的实例进行理解。

## 推送 tag 触发

和上面的示例一样，在向仓库中推送带有 tag 的提交时触发。这里采用的示例是[社区维护插件示例(Vite)](https://github.com/siyuan-note/plugin-sample-vite-svelte/blob/main/.github/workflows/release.yml)的 `release.yml`。原文如下：

```yaml
name: Create Release on Tag Push

on:
  push:
    tags:
      - "v*"

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      # Checkout
      - name: Checkout
        uses: actions/checkout@v3

      # Install Node.js
      - name: Install Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 20
          registry-url: "https://registry.npmjs.org"

        # Install pnpm
      - name: Install pnpm
        uses: pnpm/action-setup@v4
        id: pnpm-install
        with:
          version: 8
          run_install: false

      # Get pnpm store directory
      - name: Get pnpm store directory
        id: pnpm-cache
        shell: bash
        run: |
          echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT

      # Setup pnpm cache
      - name: Setup pnpm cache
        uses: actions/cache@v3
        with:
          path: ${{ steps.pnpm-cache.outputs.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-

      # Install dependencies
      - name: Install dependencies
        run: pnpm install

      # Build for production, 这一步会生成一个 package.zip
      - name: Build for production
        run: pnpm build

      - name: Release
        uses: ncipollo/release-action@v1
        with:
          allowUpdates: true
          artifactErrorsFailBuild: true
          artifacts: "package.zip"
          token: ${{ secrets.GITHUB_TOKEN }}
          prerelease: false
```

每一步的注释都很明确，很适合学习。

1. 切换到当前仓库。
2. 安装 Node.js。
3. 安装 pnpm。
4. 读取 pnpm 缓存地址。
5. 创建 pnpm 缓存。
6. 安装依赖项。
7. 打包构建 `package.zip` ​文件。
8. 发布 tag 对应的 Release。

其中有些东西需要特别解释一下，比如

​`echo "" >> $GITHUB_OUTPUT` ​是将内容放进输出中暂存，

​`${{ steps.pnpm-cache.output.STORE_PATH }}` ​就是从指定步骤的输出读取 `STORE_PATH` ​变量，

其中 `${{ }}` ​是 GitHub Actions 的变量形式，一些地方出现的 `|` ​用于声明多行文本内容，这里去掉后将下面单行内容移上来效果不变。

​`${{ secrets }}` ​是你这个仓库设置的机密信息，通常只有仓库管理员可设置和查看。用到的账号密码可以往里面放，基本不会意外泄漏。`token: ${{ secrets.GITHUB_TOKEN }}` ​用于为需要权限操作仓库的步骤赋予权限。

## 推送 `theme.json` ​文件触发

上面介绍了通过推送带有 tag 的提交触发打包流程，下面我介绍一下通过推送 `plugin.json`​、`theme.json`​、`widget.json` ​等配置文件来触发打包流程的过程。

在看具体代码之前，先了解一些信息。思源的插件配置文件（json）可以通过 `jq` ​这个工具来读取里面的版本号 `version` ​这个字段，合理使用这个字段就能省去打标签的过程，通过调用现成的 actions 可以把打标签这个工作也交给 GitHub Actions 进行，你要做的就是修改你的插件/主题/模板等的版本号，然后推送到 GitHub，等着 GitHub 发版就可以了。（不会出现更新了内容之后发现忘记改版本号的情况，因为发布新版本的动作就由更改版本号触发）

下面给出的代码是我的 [siyuan-vscodelite-edit](https://github.com/emptylight370/siyuan-vscodelite-edit/blob/scss/.github/workflows/package.yml) 主题的打包工作流，这个工作流会在推送 `theme.json` ​文件时触发，并且用当前的版本号作为 tag 发布一次 Release。内容如下：

```yaml
name: package

on:
  push: # 推送时触发
    paths: 'theme.json' # 推送根目录下的theme.json文件时触发
  workflow_dispatch: # 手动触发

jobs:
  package:
    runs-on: ubuntu-20.04

    permissions: # 权限声明，GitHub比较新的方式，可用于替代token并更细致地管理权限，生效范围是这个任务
      contents: write # 可读写内容
      packages: write # 可读写包

    steps:
      - uses: actions/checkout@v5

      - name: package
        run: zip -r package.zip . -i 'theme.*' 'icon.png' 'preview.png' 'README*.md' 'resources/*' 'sub/*' -x '**/*.css.map' 'theme.css.map' 'theme.scss'

      - name: Get current version # 用jq读取主题版本号并且输出到环境中待用
        uses: sergeysova/jq-action@v2
        id: version
        with:
          cmd: 'jq -r ".version" theme.json'

      - name: Release
        uses: softprops/action-gh-release@v2 # 现成的发布操作
        with:
          files: package.zip # 附加的文件
          name: Release ${{ env.VERSION }} # 发版的名称
          tag_name: ${{ env.VERSION }} # 发版的tag名称
          make_latest: true # 声明为最新发布版
```

请原谅我没有写注释（如果你在看仓库源码的话），这里我简要补充注释并列出每一步进行的操作。

1. 切换到仓库。
2. 将列出的所有文件打包进 `package.zip`，请注意路径和文件的不同。
3. 使用 `jq` ​工具读取当前主题的版本号并发到运行环境中。
4. 使用现成的发布 actions，创建一个 tag 为前面读取的版本号、附加文件为 `package.zip` ​的 Release。

这一个工作流文件和前面的文件大有不同，因为当时这个仓库并没有任何需要编译的环节，所有工作只是机械地打包文件并创建发布。所以只需要最原始的方式来完成就好。现在这个仓库已经有 npm 依赖安装、打包环节，详情请自行访问最新文件。

## 推送 `plugin.json` ​文件触发

在实际上手之后才发现原来还能简化。上面给出的方法是建立在主题不需要什么打包的基础上的。这里用我自己的方法写了一个打包工作流。

下面给出的代码是我的 [format-helper](https://github.com/emptylight370/sy-format-helper/blob/main/.github/workflows/package.yml) 插件的打包工作流，这次是用的官方插件示例，打包流程也是官方的流程，于是我拿上来介绍一下。

```yml
name: Package

on: 
  push:
    paths: 
      - 'plugin.json' # 在推送plugin.json时触发工作流
  workflow_dispatch: # 手动触发工作流

jobs:
  package:
    runs-on: ubuntu-latest

    permissions:
      contents: write
      packages: write

    steps:
      - uses: actions/checkout@v5 # 检出仓库

      - uses: pnpm/action-setup@v4 # 配置pnpm，不需要自己安装
        with:
          version: 9 # 印象里这个是只有pnpm，因为不需要配套的那个什么东西，也没有npm
                     # 如果需要npm就添加另一个uses

      - name: install deps # 用pnpm安装依赖
        run: pnpm i

      - name: Get current version # 获取当前的版本号
        uses: sergeysova/jq-action@v2
        id: version
        with:
          cmd: 'jq -r ".version" plugin.json'

      - name: package # 用pnpm打包，这个命令就是官方插件的打包命令
        run: pnpm build

      - name: Release # 用tag创建一个发布版，上传package.zip作为附件
        uses: softprops/action-gh-release@v2
        with:
          files: package.zip
          name: Release ${{ env.VERSION }}
          tag_name: ${{ env.VERSION }}
          make_latest: true
```

原谅我再次没有给仓库文件写注释，这里我补上了一点注释。

1. 切换到仓库。
2. 加载 pnpm 环境（不需要自己安装）。
3. 安装 pnpm 依赖。
4. 使用 `jq` ​工具读取当前的版本号。
5. 使用 pnpm 打包。
6. 使用现成的发布 actions，创建一个 tag 为前面读取的版本号、附加文件为 `package.zip` ​的 Release。

这次的流程因为需要打包，所以比单纯的主题要麻烦一点。不过官方的示例有 pnpm 打包的代码，这里只需要调用一下就好。在 actions 里用 pnpm 和 npm 环境并不需要自己安装，可以用 uses 来引入这个环境，就像用 uses 来引入仓库一样。后面的其他步骤基本上都和前面的主题打包一样，我就不多分析。

## 补充内容

对于数目众多的 GitHub Actions，GitHub 提供了一个搜索面板来查找所有的可用动作。你可在 [Actions 市场](https://github.com/marketplace?type=actions)查找你要的动作，比如搜索 `release` ​来查找创建发布版的动作。它们的 README 通常也会详细介绍如何使用这个操作。你完全可以像拼积木一样搭起你想要的 actions。

GitHub Actions 的步骤是可以混搭的，完全可以用第二个方案的触发器和获取版本号的方法配上第一个方案的打包过程，又或者第一个方案的触发器和第二个方案的打包过程。又或者你有找到更适合自己需求的动作可以替换上面示例的步骤，都是可以的。只要最终能产生一个版本号 tag 和一个 `package.zip` ​就可以用于发布集市。

显然可以观察到，在 `run:` ​这行运行的代码可以单独拿出来在 Linux 上运行。于是你可以凭借自己的经验和理解自行完成一些步骤，或者问 AI 如何写一个 GitHub 工作流文件，不过本人亲测 AI 生成的工作流实际上效果不好，通义千问和 GitHub copilot 都无法满足我提出的需求，还是建议看集市里其他仓库用的工作流照抄可用的部分。

# 尾记

我仔细想了可能用到的打包方式，分成了 3 种情况，或许是覆盖了所有可能用到的打包方式了，如果有补充或纠正欢迎留言。如果你看到可作参考的工作流文件也欢迎分享。
