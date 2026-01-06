---
title: 使用 mise 管理运行时
date: '2025-12-28 13:54:31'
updated: '2026-01-06 14:11:55'
tags:
  - Windows
  - macOS
  - Linux
permalink: /post/2025/12/using-mise-to-manage-the-runtime-z21mtgf.html
comments: true
toc: true
---





因为 [Volta](https://github.com/volta-cli/volta) 上次发版还是 24 年 2 月的事情，最近又宣布停更，在 README 里面写了建议更换到 [mise](https://github.com/jdx/mise)；电脑上安装有多个版本的 Java，但是没有靠谱的 Java 版本管理器，干脆不设置 `JAVA_HOME` ​环境变量，直接在 VSCode 配置多个 Java 包的位置，但仍有局限；目前使用 miniconda 管理 Python 环境，但是不知道哪里有问题，`conda activate` ​之后永远无法通过 `conda deactivate` ​返回 `base`，怎么都是报错；以上种种原因导致我想要找到一个靠谱的运行时管理器，但是怎么对比都没有觉得能够完美满足需求的运行时，之前的想法都是为每个语言找到自己的运行时管理器，现在来试试一个管理器管理多语言。

# mise 和现有管理器的比较

根据 AI 总结的结果，我大致比较了 mise 和现用的管理器的差别

1. mise 和 Volta 比较

   1. mise 可以管理 Node.js 版本，对 npm 的全局支持未知，说是可以将 npm 安装的包在配置文件中确定版本，但 npm 自身的版本未说明；实际测试中可以将 npm 包全局安装，npm 包使用的是安装时的 Node.js 还是全局 Node.js 版本未说明，但是 npm 自身应该是随全局 Node.js 切换
   2. Volta 能够管理 Node.js 版本，可以单独管理 npm、pnpm 版本，能够接管全局安装的 npm 包并且固定包版本和运行时版本
2. mise 和 miniconda 比较

   1. mise 建议直接管理 Python 版本自身，pip 的全局支持未知，同一个 Python 版本在不同项目中的环境靠 `venv` 控制；实际测试中发现对 pip 支持存在问题，Python 支持不够完整，期待后续修复
   2. miniconda 可以创建不同环境，在不同环境中可以安装相同、不同的 Python 版本，不同环境是相互独立的，可以在不同项目中切换不同环境

# 配置 mise

## 安装 mise

根据[入门 | mise-en-place](https://mise.jdx.dev/getting-started.html) 文档，进行安装操作。

1. 首先配置环境变量 `MISE_DATA_DIR`，配置到预期存储 mise 数据的地方
2. 根据使用的系统包管理器安装 mise，比如通过 winget 安装 mise

   ```powershell
   winget install jdx.mise
   ```

   此处安装 mise 的路径应为 winget 默认安装软件位置，后续 mise 数据会存储到先前配置的地方
3. 安装完成之后，重启终端运行以下任意命令，应能正确输出 mise 版本

   ```powershell
   mise --version
   mise version
   mise v
   ```
4. 运行 `mise doctor`，检查是否存在问题，并修复
5. 通过以下命令安装 Node.js，并输出 Node.js 版本

   ```powershell
   mise x node@24 -- node -v
   mise exec node@24 -- node -v
   ```
6. 现在应能在 mise 中看到安装的 Node.js 版本，并且如未安装其他 Node.js 版本管理器，直接运行 `node -v` ​是无结果的

   ```powershell
   mise ls
   mise list
   ```
7. 如需安装其他内容，可以通过以下命令运行

   ```powershell
   mise i node@24
   mise install node@24
   ```

## 使用 mise 配置 Node.js

文档：[Node | mise-en-place](https://mise.jdx.dev/lang/node.html)，[Node.JS 设置 | mise | VSCode](https://hverlin.github.io/mise-vscode/guides/node/)

前面已经安装好了 Node.js 24 版本，后续进行其他配置。

1. 设置一个全局版本，为免版本变动，指定刚才安装的确切版本

   ```powershell
   mise use -g node@24.12.0
   # 在Windows下不需要加 -g 参数也能全局启用，详见文档
   ```
2. 现在可以直接通过 `node` 运行这个版本
3. 对于 npm 包，可以通过以下方法进行安装或直接运行

   ```powershell
   mise x npm:prettier -- prettier --version
   mise i npm:prettier
   ```
4. 设置 Prettier 全局启用，这里没有设置版本，默认的版本号为 `latest`，如果不事先安装，直接运行这个命令也能自动安装

   ```powershell
   mise use -g npm:prettier
   ```

根据 [npm 后端 | mise-en-place](https://mise.jdx.dev/dev-tools/backends/npm.html) 文档，如需安装或使用 pnpm 可以通过以下命令进行：

```powershell
mise use -g pnpm
mise i pnpm
mise x pnpm -- pnpm --version

mise use -g npm:pnpm
mise i npm:pnpm
mise x npm:pnpm -- pnpm --version
```

这会自动通过 npm 安装 pnpm。也可自行决定使用需要设置为全局可用。但是需要特别注意，两种方法安装的 pnpm 使用的安装源不一样，前者是通过 aqua 安装的，后者是通过 npm 安装的，需要自行决定。

## 使用 mise 配置 GoLang

文档：[Go | mise-en-place](https://mise.jdx.dev/lang/go.html)，[Go 设置 | mise | VSCode](https://hverlin.github.io/mise-vscode/guides/golang/)

使用 mise 配置 Go 非常简单，直接使用以下命令就能在本地获取 Go：

```powershell
mise use -g go
mise x go -- go version
mise i go
```

但是，mise 默认使用的是 Google 的下载地址，在国内无法正常访问，因此需要寻找镜像源。此处选用阿里的镜像源进行配置。按照以下命令设置全局的设置项：

```powershell
mise settings set go_download_mirror https://mirrors.aliyun.com/golang/
mise settings set go_skip_checksum true
```

以上第一条是设置阿里镜像源，第二条是禁用校验。因为下载之后还要下载对应的校验文件，而阿里镜像源没有提供这个文件，所以安装会失败，因此禁用校验这个步骤就能安装成功。如果使用能够提供校验文件的镜像源可以不禁用校验这个步骤。

如果在项目中设置，可以使用以下的命令：

```powershell
mise config set settings.go_download_mirror https://mirrors.aliyun.com/golang/
mise config set settings.go_skip_checksum true
```

## 使用 mise 配置 Python

### core:python

文档：[Python | mise-en-place](https://mise.jdx.dev/lang/python.html)，[Python 设置 | mise | VSCode](https://hverlin.github.io/mise-vscode/guides/python/)

需要注意，默认情况下 mise 安装的是预编译的 Python 包，如果想要本地编译 Python 包，可以添加以下设置：

```powershell
mise settings python.compile=1
```

通过以下命令可以安装 Python：

```powershell
mise use -g python@3.13
mise x python@3.13 -- python --version
mise i python@3.13
```

但是需要注意，安装的 Python 在部分情况下默认是没有 pip 的，因为 pip 在某版本之后变成了可选组件，因此需要手动安装，或者配置预安装的 pip 包让 mise 自动安装。

手动安装命令如下：

```powershell
python -m ensurepip --upgrade --default-pip
```

配置预安装的 pip 包，需要在 `$HOME/.default-python-packages` ​文件中写入需要安装的包，详见 [Python | mise-en-place](https://mise.jdx.dev/lang/python.html#default-python-packages) 文档。或者通过环境变量设置这个文件的路径。

> [!IMPORTANT] ❗ 
> 需要注意的是，在 mise 版本 2025.12.12 中，存在无法在 Python 安装完成之后自动安装 pip 包的问题，并且同时也存在未创建 python3 别名、pip 别名、pip3 别名等问题。详见[在 Windows 11 上通过 mise 安装 Python 后无法运行 pip · jdx/mise · 讨论 #3821](https://github.com/jdx/mise/discussions/3821)。对于在命令行中输入 python、python3 会打开应用商店的问题，可以在 Windows 设置 > 应用 > 应用执行别名里面关掉 Python 解决。对于无法使用 pip 问题，可以将 Scripts 添加到 PATH 解决。
>
> 目前没搞明白到底怎么折腾 Python，还是用 Miniconda 解决。用 `mise i python@anaconda` 也没能安装到 Anaconda 那边的 Python。或许应该搭配 uv 使用，但是我实在没这方面经验，从其他地方看了点参考写了点东西，具体见下文，没实际测试过，不知道可不可行。

因为 mise 直接管理的 Python 版本，所以需要为不同项目创建虚拟环境。一般来说，可以使用以下命令：

```powershell
python -m venv .venv
```

也可以考虑创建任务以快速执行操作，如 [z23cc/mise-py-guide](https://github.com/z23cc/mise-py-guide) 所说：

```toml
[tools]
python = "3.10"  # Specify the Python version you want to use

[env]
VIRTUAL_ENV = "$MISE_PROJECT_ROOT/.venv"
# Windows path separator
PATH = "$MISE_PROJECT_ROOT/.venv/Scripts;$PATH"
# macOS/Linux path separator
# PATH = "$MISE_PROJECT_ROOT/.venv/bin:$PATH"

[tasks]
# Create virtual environment
venv = "python -m venv .venv"
# Install dependencies
install = ".venv\\Scripts\\pip install -r requirements.txt"  # Windows
# install = ".venv/bin/pip install -r requirements.txt"  # macOS/Linux
# Run Python script
run = ".venv\\Scripts\\python demo.py"  # Windows
# run = ".venv/bin/python demo.py"  # macOS/Linux
# Update pip
update-pip = ".venv\\Scripts\\python -m pip install --upgrade pip"  # Windows
# update-pip = ".venv/bin/python -m pip install --upgrade pip"  # macOS/Linux
# Generate dependency list
freeze = ".venv\\Scripts\\pip freeze > requirements.txt"  # Windows
# freeze = ".venv/bin/pip freeze > requirements.txt"  # macOS/Linux
```

在定义好之后就可以直接通过以下命令运行任务：

```powershell
mise run venv
mise run install
```

### uv:python

这个方案并不是使用 uv 作为后端安装 Python，而是使用 mise 安装 uv 之后通过 uv 安装 Python。具体的区别请注意。直接通过 mise 运行此命令是无效的。

文档：[uv 中文文档](https://uv.doczh.com/)，[rft: devcontainer 从 conda 迁移至 mise/uv · 拉取请求 #15251](https://github.com/MaaAssistantArknights/MaaAssistantArknights/pull/15251)，[新一代 Python 管理 UV 完全使用指南 ｜ 附实际体验与效果对比 - 知乎](https://zhuanlan.zhihu.com/p/1897568987136640818)，[Python uv 简明教程 - thxis0 - 博客园](https://www.cnblogs.com/thxiso/p/19412801)

首先通过 mise 安装 uv：

```powershell
mise use -g uv
```

然后在项目文件夹中使用 uv 初始化环境：（具体命令未经测试，仅模仿有效命令结构，请结合文档了解详情）

```powershell
uv init # 初始化？

uv venv --python 3.12 # 创建特定Python版本的虚拟环境

uv python install python3.12 # 安装特定版本Python？
```

后续的命令还请自行探索，没用过实在是不知道怎么回事，但是看起来比直接用 mise 管理 Python 要好，实际上孰优孰劣还请自行测试。

## 使用 mise 配置 Java

文档：[Java | mise-en-place](https://mise.jdx.dev/lang/java.html)，[Java 设置 | mise | VSCode](https://hverlin.github.io/mise-vscode/guides/java/)

默认情况下版本号的简写指向 OpenJDK，可以通过前缀指向其他供应商。具体可以安装的 Java 版本可通过 `mise ls-remote java` ​查看。通过以下命令可以获取或安装 Java：

```powershell
mise use -g java@25
mise x java@25 -- java -version
mise i java@25

mise i java@dragonwell-8
mise i java@zulu-8
```

但是需要注意，mise 仅提供较为近期的 Java 包，并且提供的版本也较少，因此我探索了一下手动安装 Java 的过程：

1. 从网站下载 Java 压缩包，以 Oracle Java SE 8 为例，下载 windows-x64.zip 文件
2. 在 mise 数据目录的 Java 下根据 Java 版本号创建文件夹，这里创建的是一个 8.0.461 文件夹（在 release 文件中的 `java_version` ​为 `1.8.0_461`​，参考自动安装的其他版本，使用 8 作为大版本号，`_461` ​作为补丁号，自行确定这个版本的版本号），将压缩包解压到这个文件夹（具体文件结构参考其他自动安装版本）
3. 运行 `mise ls` ​或 `mise ls java`，查看是否显示这个版本，能够正常显示这个版本应该是安装成功
4. 在 Java 目录下创建一个文件 `8`​，在里面填入 `.\8.0.461`​（和前面创建的文件夹名一致），然后创建一个文件 `8.0`，同样填入文件夹名字
5. 运行 `mise reshim`，重新创建垫片。虽然不知道具体 mise 是操作 path 还是创建垫片，但是刷新一下总是没问题的
6. 现在运行 `mise x java@8 -- java -version`​，如果正常，应能看到 Java 版本与刚安装的版本一致（`java version "1.8.0_461"`）

虽然手动安装没问题，但是出于通过 mise 更新的角度考虑，我更推荐使用第三方维护的 1.8 版本，这些版本能够通过 mise 安装，也能通过 mise 更新，比起手动安装好好一点

对于 `JAVA_HOME`​，没有进行过实际测试，通过 `mise use -g java@25`​ 设置的 Java 25 版本可以在命令行中直接调用，但是无法被 EXE4J 编译的应用直接调用，需要设置 `EXE4J_JAVA_HOME`。在 VSCode 中使用 mise 安装的 Java 请见下方标题。

经测试 PCL2 不能识别 mise 安装的 Java，但是可以手动添加。看起来 `mise use`​ 设定 Java 版本对非命令行程序有一定的问题，但是可以通过手动指定其他环境变量以避免设置 `JAVA_HOME`​，例如可以设置 `EXE4J_JAVA_HOME`​ 或 `HMCL_JAVA_HOME`​ 这些。Windows 下环境变量似乎不能运行某些程序，但是在 Linux 等系统下应该可以指定 `JAVA_HOME`​ 为 mise 输出的全局 Java 地址，如 `mise where java`。

## 确认可用的后端

可以通过 `mise doctor` ​打印出信息，然后从中找到 `backends` ​这部分，确认可用的后端。

比如说 Node.js 就可以用 npm，Python 就可以用 pipx、conda，安装 Node.js、Python 等是内置的 core，安装 GitHub 包可以用 GitHub 等。详见[后端架构 | mise-en-place](https://mise.jdx.dev/dev-tools/backend_architecture.html)、[后端 | mise-en-place](https://mise.jdx.dev/dev-tools/backends/) 文档。

## 可视化配置

可以通过 mise 的 VSCode 扩展可视化修改配置，并且能够选择配置保存到哪个文件，见 [IDE Integration | mise-en-place](https://mise.jdx.dev/ide-integration.html#vscode-plugin) 文档。

在 VSCode 中，通过插件添加的按钮、命令打开设置面板，之后点击右边的编辑按钮，输入、选择要设置的值，然后保存配置到项目的配置文件中，就能修改项目设置。

## 配置 VSCode 环境

文档：[mise VS Code | mise | VSCode](https://hverlin.github.io/mise-vscode/)

对于 VSCode，在 Java 扩展包里面有个设置：`java.configuration.runtimes`​，可以在不设置 `JAVA_HOME` ​的情况下指定 Java 版本的位置，在使用 mise 之前我是通过这个设置指定各个 Java 版本的路径，在换用 mise 之后我从 settings.json 里面删掉了这个设置，VSCode 和 Java 扩展（在 Project Settings 查看）能够加载到全局启用的 Java 25 还有内置的 Java 21，使用 `mise use java@21` ​指定一个 21 版本再重启 VSCode 也不能看到这个版本。

在这个时候，我想起来 mise 的 VSCode 扩展可以配置其他扩展的 SDK 路径，在命令面板中输入 `mise`​ 搜索到 `Mise: Configure extension sdk path`，点击运行，配置 Java，选择 yes，然后重启 VSCode，就在 Project Settings 里面看到了 mise 安装的 Java 21 版本并且默认选用。由此可以类推到其他需要单独配置 SDK 路径的语言上面。

使用 mise 的 VSCode 扩展配置的环境会在工作区中生成 VSCode settings 文件，可以按需添加到 git 系统中或排除。

# mise 的常用命令

这里只对前面未提及的命令进行补充。

## 查看社区支持的包的插件

文档：[注册表 | mise-en-place](https://mise.jdx.dev/registry.html)

对于官方没有提供支持，由社区提供支持的运行时，可以通过 `registry` ​查看它的插件，例如 flutter：

```powershell
mise registry flutter
```

运行之后，命令行显示以下结果：

```powershell
vfox:mise-plugins/vfox-flutter
```

这就表明 flutter 由这个插件提供支持。需要补充说明：vfox 这个插件不支持读取环境变量作为请求地址，只会固定请求 Google 地址，如果想要使用自定义的地址需要自己改源码。mise 仓库里面另一个插件支持读取环境变量，但是只支持 Linux 和 macOS，目前 Windows 仍然推荐自行安装 flutter。

直接运行 `mise regisrty` ​会输出全部可以直接安装的包，以及提供支持的后端。

## 如何安装由插件提供支持的包

首先，需要了解有什么插件，可以通过以下命令获取可用插件（前述方法也行）

```powershell
mise plugins ls-remote
```

然后，可以手动安装插件，比如

```powershell
mise plugins i flutter
mise plugins add flutter
mise plugins install flutter
```

或者交给 mise 自动处理

```powershell
mise ls-remote flutter
```

对于有插件提供支持的语言，显示远程可用版本会自动安装缺失的插件，安装好之后会打印可用的版本。之后自行安装即可。

## `settings` ​和 `config` ​的区别

在测试中，`settings` ​会自动写入全局配置文件，`config` ​可以写入项目配置文件，在 `config` ​中通过 `settings.xxx` ​可以覆写配置文件。具体区别详见：[mise settings | mise-en-place](https://mise.jdx.dev/cli/settings.html) 和 [mise config | mise-en-place](https://mise.jdx.dev/cli/config.html)。
