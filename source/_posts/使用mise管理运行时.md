---
title: 使用 mise 管理运行时
date: '2025-12-28 13:54:31'
updated: '2026-02-09 00:12:16'
tags:
  - Windows
  - macOS
  - Linux
permalink: /post/2025/12/using-mise-to-manage-the-runtime-z21mtgf.html
comments: true
toc: true
---



# 切换到 mise 的原因

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

文档：[uv - Astral 文档](https://docs.astral.org.cn/uv/)，[uv 中文文档](https://uv.doczh.com/)，[rft: devcontainer 从 conda 迁移至 mise/uv · 拉取请求 #15251](https://github.com/MaaAssistantArknights/MaaAssistantArknights/pull/15251)，[Mise + Python Cookbook | mise-en-place](https://mise.jdx.dev/mise-cookbook/python.html)

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

可以在全局的配置文件中添加以下任务，来为当前项目创建 venv 环境，使用时只需在项目根目录运行 `mise run venv` ​即可。

```toml
[tasks.venv]
confirm = "确认要在当前项目文件夹创建虚拟环境吗？"
description = "在当前项目创建venv环境"
dir = "{{cwd}}"
run = [
  "mise use uv",
  "mise settings set -l python.uv_venv_auto true",
  "mise set _.python.venv=\"{path=\".venv\"}\"",
  "uv venv .venv"
]
```

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

> [!NOTE] ✏️ 方法1
> 1. 从网站下载 Java 压缩包，以 Oracle Java SE 8 为例，下载 windows-x64.zip 文件
> 2. 在 mise 数据目录的 Java 下根据 Java 版本号创建文件夹，这里创建的是一个 8.0.461 文件夹（在 release 文件中的 `java_version`​ 为 `1.8.0_461`​，参考自动安装的其他版本，使用 8 作为大版本号，`_461` 作为补丁号，自行确定这个版本的版本号），将压缩包解压到这个文件夹（具体文件结构参考其他自动安装版本）
> 3. 运行 `mise ls`​ 或 `mise ls java`，查看是否显示这个版本，能够正常显示这个版本应该是安装成功
> 4. 在 Java 目录下创建一个文件 `8`​，在里面填入 `.\8.0.461`​（和前面创建的文件夹名一致），然后创建一个文件 `8.0`，同样填入文件夹名字
> 5. 运行 `mise reshim`，重新创建垫片。虽然不知道具体 mise 是操作 path 还是创建垫片，但是刷新一下总是没问题的
> 6. 现在运行 `mise x java@8 -- java -version`​，如果正常，应能看到 Java 版本与刚安装的版本一致（`java version "1.8.0_461"`）
>
> 虽然手动安装没问题，但是出于通过 mise 更新的角度考虑，我更推荐使用第三方维护的 1.8 版本，这些版本能够通过 mise 安装，也能通过 mise 更新，比起手动安装好一点

> [!NOTE] ✏️ 方法2
> 1. 从网站下载 Java 压缩包，以 Oracle Java SE 8 为例，下载 windows-x64.zip 文件
> 2. 解压到特定的文件夹
> 3. 使用 `mise link` ​链接该版本
>
> 这个方法使用 mise 提供的功能添加本地安装，详见后文介绍

使用 `java@25` ​安装的 Java 默认是 OpenJDK 的，我自己喜欢用 Oracle 和 Dragonwell 的，就自行安装了几个版本并且设置了别名，将 25 对应到 Oracle-25，21 对应到 Oracle-21，8 对应到 Dragonwell-8，如此使用 `java@25` ​就能使用 Oracle 的 25 版本。设置别名的方法详见后文介绍。

对于 `JAVA_HOME`​，没有进行过实际测试，通过 `mise use -g java@25`​ 设置的 Java 25 版本可以在命令行中直接调用，但是无法被 EXE4J 编译的应用直接调用，需要设置 `EXE4J_JAVA_HOME`。在 VSCode 中使用 mise 安装的 Java 请见下方标题。

经测试 PCL2 不能识别 mise 安装的 Java，但是可以手动添加。看起来 `mise use`​ 设定 Java 版本对非命令行程序有一定的问题，但是可以通过手动指定其他环境变量以避免设置 `JAVA_HOME`​，例如可以设置 `EXE4J_JAVA_HOME`​ 或 `HMCL_JAVA_HOME`​ 这些。Windows 下环境变量似乎不能运行某些程序，但是在 Linux 等系统下应该可以指定 `JAVA_HOME`​ 为 mise 输出的全局 Java 地址，如 `mise where java`。

## 使用 mise 配置 Flutter

文档：[flutter | mise versions](https://mise-versions.jdx.dev/tools/flutter)

在刚写这份文档的时候，在 macOS 和 Linux 上安装 Flutter 可以用一个支持 `FLUTTER_STORAGE_BASE_URL` ​的后端进行安装，而 Windows 上只有 vfox 后端。vfox 后端的请求地址是写死的谷歌的地址，国内用不了。因此在 Windows 上想要通过 mise 安装 Flutter 只能用这两种方式：

1. 在 `/mise/plugins/flutter` ​里面找到地址然后修改为国内镜像站的网址
2. 自行安装改为国内镜像站的 vfox 插件用作后端：[chen3/vfox-flutter-cn: Flutter plugin for vfox](https://github.com/chen3/vfox-flutter-cn)

   ```powershell
   mise p i flutter https://github.com/chen3/vfox-flutter-cn
   mise i flutter
   mise use flutter -g
   ```

操作相当繁琐，并且当时失败了好多次，没能成功安装，所以就没写。现在成功了就写上来。

## 确认可用的后端

可以通过 `mise doctor`​ 打印出信息，然后从中找到 `backends`​ 这部分，确认可用的后端。或者直接使用 `mise backends` ​命令打印所有后端。

详见[后端架构 | mise-en-place](https://mise.jdx.dev/dev-tools/backend_architecture.html)、[后端 | mise-en-place](https://mise.jdx.dev/dev-tools/backends/) 文档。

可以通过 `mise registry TOOL_NAME`​ 查看工具所支持的后端，比如 `mise registry node`​ 可以看到后端为 core，`mise registry prettier`​ 可以看到后端为 `npm`​。对于存在多个后端的工具，比如 pnpm，最靠前的后端是默认使用的后端，其他后端可以通过指定的方式使用。例如 `mise i pnpm`​ 是直接安装 pnpm 程序，`mise i npm:pnpm`​ 是通过 npm 安装 pnpm 包。但是 mise 做了防止不同后端重复安装工具的限制，如果是团队合作，我推荐项目的工具只写工具不写后端，具体通过什么后端安装由本地通过 tool_alias 指定。详见 [Tool Aliases | mise-en-place](https://mise.jdx.dev/dev-tools/aliases.html)。

在测试了几天下来，发现 tool_alias 或许还存在一些局限，平时指定工具别名或许就够用了，但是 lockfile（`mise lock`​）会锁定工具使用的版本和后端，比如 Java 就可能出现 `21.0.0` ​和 `oracle-21.0.0` ​这些版本，如果遵守锁定文件就会出现版本冲突，但是 tool-alias 确实将 `mise.toml` ​里使用的 `java@21` ​指向了 `oracle-21`​，这时候这种冲突怎么办？或许就需要通过 `mise.local.toml` ​指定使用 `java@oracle-21`​（如果直接使用 `java@21` ​无效的话），后续再生成锁文件（`mise lock --local`​）就能得到 `mise.local.lock`，这时候遵照本地配置覆盖的原则就能确定使用的版本。

例如项目的 mise.toml：

```toml
[tools]
pnpm = "latest"
```

在全局的配置文件中（可通过命令行设置）：

```toml
[tool_alias]
pnpm = "npm:pnpm"
```

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

## `settings`​ 和 `config`

在测试中，`settings`​ 会自动写入全局配置文件，`config`​ 可以写入项目配置文件，在 `config`​ 中通过 `settings.xxx`​ 可以覆写配置文件。具体区别详见：[mise settings | mise-en-place](https://mise.jdx.dev/cli/settings.html) 和 [mise config | mise-en-place](https://mise.jdx.dev/cli/config.html)。

在 config 中覆写 settings 的语法如下：

```toml
[settings]
xxx = "xxx"
xxx.xxx = "xxx"
```

## 常用设置

目前在 Windows 上，在 `mise.toml` ​的 `[tasks]` ​中定义的 `run` ​命令一般是用 `cmd` ​执行的，见 [Settings | mise-en-place](https://mise.jdx.dev/configuration/settings.html#windows_default_inline_shell_args)。在实际使用中遇到过一些问题，因此最好覆写为 PowerShell，根据设备上使用的是 PowerShell 5.1 还是 PowerShell 7 来运行下方的命令。

```powershell
# PowerShell 5.1
mise settings set windows_default_inline_shell_args "powershell -c"
mise settings set windows_default_file_shell_args "powershell -f"
# PowerShell 7
mise settings set windows_default_inline_shell_args "pwsh -c"
mise settings set windows_default_file_shell_args "pwsh -f"
```

---

在 Windows 上无法直接通过 mise 安装 pipx，手动安装需要使用 scoop，如果不使用 scoop 就无法安装 pipx。因此可以使用 uvx 作为后端代替 pipx，详见 [Settings | mise-en-place](https://mise.jdx.dev/configuration/settings.html#pipx.uvx "Settings | mise-en-place")。可以通过以下命令在 Windows 上使用 uvx 安装全局 pip 包，例如：

```powershell
mise use -g uv
mise settings set pipx.uvx true
mise use -g pipx:yapf
```

首先安装 uv，然后开启后端替换，之后就能使用 uvx 安装 pipx 包，并且在 Linux、macOS 上正常使用 `mise i pipx:yapf` 也不会有问题。

## 添加本地工具版本到 mise

文档：[mise link | mise-en-place](https://mise.jdx.dev/cli/link.html)

根据文档，可以使用 `mise link` ​将外部工具添加到 mise 中，比如 Java 的 Oracle 8 版本，mise 不提供下载，但是可以手动下载到本地并链接到 mise 中，比如 `mise link java@8 /path/to/java`，具体的版本号可能写详细一点比较好，在示例中 Node.js 的版本号精确到了 20.0.0，但是 Java 的版本号比较难确定。

## 设置别名

文档：[Tool Aliases | mise-en-place](https://mise.jdx.dev/dev-tools/aliases.html)，[mise tool-alias | mise-en-place](https://mise.jdx.dev/cli/tool-alias.html)

根据文档，使用 `mise tool-alias java 25 oracle-25` ​可以将 25 指向 oracle-25，使用这个方法可以设置全局的别名。在设置了别名之后查看全局设置，观察到以下设置项：

```toml
[tool_alias]

[tool_alias.java]

[tool_alias.java.versions]
17 = "dragonwell-17"
21 = "oracle-21"
25 = "oracle-25"
8 = "dragonwell-8"
11 = "dragonwell-11"
```

因此可以手动往 `mise.local.toml` ​添加这个格式以指定别名，这样可以实现在项目中指定 tools 为 java@25，本地使用 Oracle、OpenJDK 或 Dragonwell 之类的不同架构。使用 `mise.local.toml` ​也可以为不同的项目使用不同的 Java，比如项目 A 使用 Oracle，项目 B 使用 OpenJDK 这样的。详见 [Make ](https://github.com/jdx/mise/discussions/6266)​[`mise use java@21`](https://github.com/jdx/mise/discussions/6266)​[ use _any_ version 21 that is installed · jdx/mise · Discussion #6266](https://github.com/jdx/mise/discussions/6266)。

## 创建垫片（shims）

文档：[Shims | mise-en-place](https://mise.jdx.dev/dev-tools/shims.html)，[Settings | mise-en-place](https://mise.jdx.dev/configuration/settings.html#windows_shim_mode)

默认情况下，在 Windows 中使用 mise 需要使用 shim。在首次安装 mise 之后，立即运行 `mise doctor` ​会看到一条报错信息，是说 shim 目录没有在 path 中，需要添加到 path。操作方法就是在系统变量或者用户变量的 path 里加上 `%MISE_DATA_DIR%/shims` ​目录。之后重启终端再运行 `mise doctor` ​就不会报这个错误了。

原先，mise 在 Windows 上提供的 shims 是文件模式（即 `windows_shim_mode` ​的默认值为 `file`​），它的描述为：为 Git Bash/Cygwin 创建一个 `.cmd`​ 批处理文件 shim 和一个无扩展名的 bash 脚本。后来，在 mise v2026.2.7 版本中，新增了一个 exe 模式（即 `windows_shim_mode` ​的默认值切换到了 `exe`​），它的描述为：将原生可执行 shim（`mise-shim.exe`​）复制为 `<tool>.exe`​。推荐。适用于所有 shell、包管理器和 `where.exe`​。需要 `mise-shim.exe`​ 与 `mise.exe` 配合使用。

这一修改主要是在 shims 目录下的 exe 文件里实现了通过文件名调用 mise 对应工具，这样就能实现与 Volta、Chocolate 等管理器一样的逻辑，并且适配需要在 path 里找到 exe 可执行文件的程序，如 bun、npm 等。得益于此，可以通过命令将 Cherry Studio 目录下的 uv 和 bun 指向 mise 全局安装的版本，而无需单独为 Cherry Studio 安装或复制程序文件。（详见相关引入 Pull Request）

在更新到 v2026.2.7 版本之后，默认情况下应该能正常切换到 exe 模式，可打开文件夹确认。如果 shims 下的文件不是 exe，可以尝试使用 `mise reshim -f` ​或 `mise reshim --force` ​强制重建 shims。

此处给出 PowerShell 创建软链接的方法，参考运行环境为 PowerShell 7，参考文档为 [New-Item (Microsoft.PowerShell.Management) - PowerShell | Microsoft Learn](https://learn.microsoft.com/zh-cn/powershell/module/microsoft.powershell.management/new-item?view=powershell-7.5&amp;WT.mc_id=ps-gethelp#7)、[MCP 环境安装 | Cherry Studio](https://docs.cherry-ai.com/advanced-basic/mcp/install)

```powershell
New-Item -ItemType SymbolicLink -Path $env:USERPROFILE\.cherrystudio\bin\uv.exe -Target $MISE_DATA_DIR\shims\uv.exe
New-Item -ItemType SymbolicLink -Path $env:USERPROFILE\.cherrystudio\bin\uvx.exe -Target $MISE_DATA_DIR\shims\uvx.exe
New-Item -ItemType SymbolicLink -Path $env:USERPROFILE\.cherrystudio\bin\uvw.exe -Target $MISE_DATA_DIR\shims\uvw.exe
New-Item -ItemType SymbolicLink -Path $env:USERPROFILE\.cherrystudio\bin\bun.exe -Target $MISE_DATA_DIR\shims\bun.exe
```

运行命令之前需要先删除或重命名原有的文件，并且退出 Cherry Studio。推荐将原有的文件重命名为 xx.bak，等操作完成后启动 Cherry Studio 确认可用后再删除。
