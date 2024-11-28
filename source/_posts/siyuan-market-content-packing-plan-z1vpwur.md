---
title: 思源集市内容打包方案
date: '2024-11-15 17:52:03'
updated: '2024-11-15 19:21:47'
permalink: /post/siyuan-market-content-packing-plan-z1vpwur.html
comments: true
toc: true
tags:
  - 思源笔记
  - GitHub
---



想要给集市上架一个插件/主题/模板等内容，就不可避免地面临发布前的一个重要动作：打包。

集市从你的仓库里拉取文件的**必要条件**就是一个以版本号命名的tag和这个tag对应的发布（Release），并且必须有一个名为**package.zip**的文件。

要打包这个`package.zip`​文件可以有多种途径。



官方插件给的打包方法就是

```bash
pnpm run build
```

在本地运行命令之后就会生成一个`package.zip`​文件，随后由你自行创建一个tag并推送到GitHub上，或者在GitHub Release页面新建一个发布并tag为当前版本号。

这个过程短时间不会造成多少困扰，并且好处是你可以完全控制发版的时间，甚至可以在发现出了bug之后先修bug再打包发版。不过如果你的主题/模板/挂件等不需要经过什么编译环节，而是直接就有`plugin/theme/template.json`​、`icon.png`​、`preview.png`​这些文件的话，你要做的就是每次修改`*.json`​的版本号并且手动选择所有需要的文件压缩并上传。

手动打包的流程显然不至于造成多少困扰，不过如果你厌倦了这种手动发版的流程，就需要寻找替代品。以下列出本地方案和云端方案共计2种。

# 批处理脚本

对于固定的任务，在本地使用批处理脚本当然可以显著减少工作量。你可以使用自己的经验编写`.bat`​、`.sh`​、`.ps1`​等脚本来完成编译文件、打包压缩包的操作。

编译环节可以自行按照使用的技术来编写脚本，比如pnpm编译、typescript编译等，如果没有也可干脆略过。

打包环节可以选用支持命令行处理的压缩软件，比如7-zip就挺好的，如果你不用7z作为平时使用的压缩软件，它也不会贸然出现打扰到你，完全可以只在脚本里调用到它。

不过可惜我没有使用批处理脚本打压缩包的经验，所以这部分没办法给出合适的代码示例，不过这个可以去问AI，让AI生一个批处理脚本还是很快且较准确的。

# GitHub Actions

既然你的代码是托管在GitHub上的，并且还是开源的（显然应该如此，特殊情况例外），那么你的仓库就有很长的GitHub Actions时长。我记得GitHub对开源仓库提供不限时长的GitHub Actions调用，如果不是如此，你每个月也有2000小时的时长可用。用来打包一个压缩包多半连零头都用不到。

不过使用GitHub Actions的方法我又分为两种类型，主要是推送触发器的不同。下面我先简要介绍GitHub Actions文件的结构，再放出具体代码。

GitHub Actions（GitHub工作流）是由yaml文件定义的，并且会在声明的触发器被触发时自动运行。所有GitHub Actions文件放在你仓库根目录下的`.github/workflows/`​目录下，这里的`workflows`​大小写不限。在创建这个目录之后，在里面新建一个`.yml`​格式的文件，文件名任意，我个人推荐`package.yml`​或`release.yml`​。

yaml的格式定义如下，注意需要有合适的缩进，缩进距离不限，大多为2空格或4空格：

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

这里我大致介绍了以下GitHub Actions的结构，不继续展开写，请看下面的实例进行理解。

## 推送tag触发

和上面的示例一样，在向仓库中推送带有tag的提交时触发。这里采用的示例是[社区维护插件示例(Vite)](https://github.com/siyuan-note/plugin-sample-vite-svelte/blob/main/.github/workflows/release.yml)的`release.yml`​。原文如下：

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
2. 安装Node.js。
3. 安装pnpm。
4. 读取pnpm缓存地址。
5. 创建pnpm缓存。
6. 安装依赖项。
7. 打包构建`package.zip`​文件。
8. 发布tag对应的Release。

其中有些东西需要特别解释一下，比如

​`echo "" >> $GITHUB_OUTPUT`​是将内容放进输出中暂存，

​`${{ steps.pnpm-cache.output.STORE_PATH }}`​就是从指定步骤的输出读取`STORE_PATH`​变量，

其中`${{ }}`​是GitHub Actions的变量形式，一些地方出现的`|`​用于声明多行文本内容，这里去掉后将下面单行内容移上来效果不变。

​`${{ secrets }}`​是你这个仓库设置的机密信息，通常只有仓库管理员可设置和查看。用到的账号密码可以往里面放，基本不会意外泄漏。`token: ${{ secrets.GITHUB_TOKEN }}`​用于为需要权限操作仓库的步骤赋予权限。

## 推送`plugin.json`​文件触发

上面介绍了通过推送带有tag的提交触发打包流程，下面我介绍一下通过推送`plugin.json`​、`theme.json`​、`widget.json`​等配置文件来触发打包流程的过程。

在看具体代码之前，先了解一些信息。思源的插件配置文件（json）可以通过`jq`​这个工具来读取里面的版本号`version`​这个字段，合理使用这个字段就能省去打标签的过程，通过调用现成的actions可以把打标签这个工作也交给GitHub Actions进行，你要做的就是修改你的插件/主题/模板等的版本号，然后推送到GitHub，等着GitHub发版就可以了。（不会出现更新了内容之后发现忘记改版本号的情况，因为发布新版本的动作就由更改版本号触发）

下面给出的代码是我的[siyuan-vscodelite-edit](https://github.com/lingfengyu-dreaming/siyuan-vscodelite-edit/blob/main/.github/workflows/package.yml)主题的打包工作流，这个工作流会在推送`theme.json`​文件时触发，并且用当前的版本号作为tag发布一次Release。内容如下：

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
      - uses: actions/checkout@v4

      - name: package
        run: find ./ -name 'theme.json' -o -name 'icon.png' -o -name 'preview.png' -o -name 'README.md' -o -name 'README_zh_CN.md' -o -name 'theme.css' -o -name 'theme.js' -o -path './resources/*' -o -path './sub/*' | xargs zip package.zip

      - name: install
        run: sudo apt-get install jq
  
      - name: create tag # 用jq读取主题版本号并且输出到环境中待用
        run: echo "VERSION=$(jq -r ".version" theme.json)" >> $GITHUB_ENV

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
2. 将列出的所有文件打包进`package.zip`​，请注意路径和文件的不同。
3. 安装`jq`​工具。
4. 读取当前主题的版本号并发到运行环境中。
5. 使用现成的发布actions，创建一个tag为前面读取的版本号、附加文件为`package.zip`​的Release。

这一个工作流文件和前面的文件大有不同，因为这个仓库并没有任何需要编译的环节，所有工作只是机械地打包文件并创建发布。所以只需要最原始的方式来完成就好。

## 补充内容

对于数目众多的GitHub Actions，GitHub提供了一个搜索面板来查找所有的可用动作。你可在[Actions市场](https://github.com/marketplace?type=actions)查找你要的动作，比如搜索`release`​来查找创建发布版的动作。它们的README通常也会详细介绍如何使用这个操作。你完全可以像拼积木一样搭起你想要的actions。

GitHub Actions的步骤是可以混搭的，完全可以用第二个方案的触发器和获取版本号的方法配上第一个方案的打包过程，又或者第一个方案的触发器和第二个方案的打包过程。又或者你有找到更适合自己需求的动作可以替换上面示例的步骤，都是可以的。只要最终能产生一个版本号tag和一个`package.zip`​就可以用于发布集市。

显然可以观察到，在`run:`​这行运行的代码可以单独拿出来在Linux上运行。于是你可以凭借自己的经验和理解自行完成一些步骤，或者问AI如何写一个GitHub工作流文件，不过本人亲测AI生成的工作流实际上效果不好，通义千问和GitHub copilot都无法满足我提出的需求，还是建议看集市里其他仓库用的工作流照抄可用的部分。

# 尾记

我仔细想了可能用到的打包方式，分成了3种情况，或许是覆盖了所有可能用到的打包方式了，如果有补充或纠正欢迎留言。如果你看到可作参考的工作流文件也欢迎分享。
