---
title: 使用Volta管理Node.js
date: '2025-08-18 23:13:36'
updated: '2025-10-27 23:32:11'
tags:
  - Windows
  - JavaScript
permalink: /post/2025/08/manage-nodejs-with-volta-1258nc.html
comments: true
toc: true
---



因为 nvm-windows 没有 `nvm use` ​命令，不能使用 `.nvmrc` ​调整 Node.js 版本，所以想要换用别的工具管理本地的 Node.js 版本。正好某项目使用了 Volta 管理版本，我就查看了一下各种在 Windows 上提供 Node.js 版本管理工具的介绍，然后决定换用 Volta 试试。

在切换到 Volta 之前，最好清理干净之前的 Node.js 安装或者版本管理器。



Volta 的中文文档官网为：[Volta - 无痛的 JavaScript 工具管理器 | Volta](https://zh.voltajs.com/)

在这里可以看到 Volta 的介绍以及如何安装 Volta。Volta 主要面向的是项目，可以根据项目自动切换 Node.js 版本；同时也支持切换 npm、pnpm 和 yarn 版本。

Volta 在安装之后，会自动根据项目的 `package.json` ​文件中定义的版本切换当前的 Node.js 版本，如果没有这个版本，就会自动下载那个版本到本地。可以在终端中输入 `node --version` ​检测当前的 Node.js 版本，如果本地还没有这个版本，就会自动下载。

Volta 同时也支持全局的 Node.js 和 npm、pnpm，而这里的 npm、pnpm 可以不跟随 Node.js 内置的版本，而是单独指定某个版本。

# 安装 Volta

在安装之前，首先要了解：Volta 的数据存储位置不是在安装时指定的，而是通过环境变量指定的。因此，在安装之前，应该首先在环境变量中创建一个变量 [VOLTA_HOME](https://zh.voltajs.com/config/env.html#volta-home)，并且在里面填上希望存储数据的位置。这个文件夹可以不事先创建。

之后，就可以通过[快速开始](https://zh.voltajs.com/guide/getting-started.html)页面的介绍进行安装 Volta。如果不想使用 winget 安装，可以从下方的手动安装部分获取安装包。这里的安装位置不可更改。在安装程序运行完之后，应该就可以从终端运行 Volta 命令了。

```powershell
volta --version # 让Volta输出版本号检查是否安装成功
volta ls # 是list的缩写，让Volta显示本地已安装的内容
```

两条命令可以选择一条使用，前者会输出 Volta 的版本号，后者会显示本地已安装的内容，比如 Node.js、npm 等。安装之后默认是没有内容的，会提示你安装一个 Node.js。

```powershell
volta help # 查看帮助
volta help install # 查看安装命令的帮助
volta install node # 安装最新版Node.js
volta install node@22 # 安装22版本的Node.js
```

使用 `volta install` ​安装的内容会成为全局默认的内容，比如 `volta install node@22` ​会安装最新的 22 版本的 Node.js 并且作为全局默认的 Node.js 版本使用。如果想要更换全局 Node.js 版本，可以再次运行安装命令更新新的 Node.js 替代。

Volta 的版本号是和 npm、pnpm 一样的，通过 `@1.2.3` ​这种方式指定版本号，所以在使用 Volta 命令安装任何东西的时候都可以这样指定版本号。

## 设置镜像源

为 Volta 设置镜像源的方法见此处：[Volta Hooks 钩子配置 | Volta](https://zh.voltajs.com/advanced/hooks.html)。

在 [nodejs-release | 镜像站使用帮助 | 清华大学开源软件镜像站 | Tsinghua Open Source Mirror](https://mirrors.tuna.tsinghua.edu.cn/help/nodejs-release/) 可以直接复制 Node.js 镜像源部分，而 npm 和 yarn 此处不进行配置。但是在 Node.js 镜像这方面，还是推荐使用 [npmmirror 镜像站](https://npmmirror.com/)，因此需要将前面复制的地址切换到 npmmirror。此处通过拼接得到的配置文件如下：

```json
{
  "node": {
    "index": {
      "template": "https://npmmirror.com/mirrors/node/index.json"
    },
    "distro": {
      "template": "https://npmmirror.com/mirrors/node/v{{version}}/{{filename}}"
    }
  }
}
```

# 使用 Volta

在安装了首个 Node.js 版本之后，你已经可以正常使用 Volta 了。以下是其他方面的使用介绍。

## 使用 npm

在默认情况下，如果没有手动安装 npm，Volta 会使用 Node.js 版本内置的 npm；一旦手动安装了 npm（`volta install npm`），Volta 就只会使用全局默认的 npm。这种时候，如果还想要使用当前 Node.js 内置的 npm，需要通过以下命令进行调用：

```powershell
volta run --bundled-npm npm --version
```

这样才可以调用当前 Node.js 内置的 npm 运行命令，否则就会使用全局默认的 npm 运行。

## 使用 pnpm

相关信息参阅：[Volta pnpm 配置指南 | Volta](https://zh.voltajs.com/advanced/pnpm.html)

Volta 对 pnpm 的支持是实验性的，主要表现在无法全局安装 pnpm 包。但是对我而言没有明显影响，我之前也不全局安装 pnpm 包的。

在安装 pnpm 之前，需要在环境变量中加入 [VOLTA_FEATURE_PNPM](https://zh.voltajs.com/config/env.html#volta-feature-pnpm) 并且设置值为 `1`​。相关操作说明见[此处](https://zh.voltajs.com/advanced/pnpm.html#%E5%9C%A8-windows-%E4%B8%8A)。如果在添加这个环境变量之前就在 Volta 中安装了 pnpm，则需要在添加环境变量前先移除原先安装的 pnpm，再在添加环境变量后重新安装 pnpm。

在添加环境变量之后，可以通过以下命令安装 pnpm：

```powershell
volta install pnpm
```

同样，也可以指定安装的 pnpm 版本号。

## 安装 npm 全局包

Volta 在设计上是希望减小全局包对用户的负担。因此很多地方和 npm 安装全局包不同。以下是一些简单的介绍。

Volta 通过 `install` ​命令安装 npm 全局包。以下为示例：

```powershell
volta install prettier
```

此命令会使用当前的全局默认 Node.js 安装一个全局的 Prettier。从 0.9.0 版本开始，如果通过 `npm i prettier -g` ​安装全局的 Prettier，Volta 会拦截这个安装请求并且安装到自己的位置中。不管什么安装方式，使用 `npm ls -g` ​都无法查看到全局安装的包。

Volta 调用包的顺序为：项目本地包-> 全局包。如果项目本地有这个包就会使用项目自己的，如果项目没有就会使用全局的，全局没有安装对应包才会说找不到这个包。

由于这种方式，Volta 安装的全局包和安装时使用的全局默认版本是强相关的，在什么 Node.js 版本安装的全局包就会调用什么版本运行。因此，如果你更换了全局默认的 Node.js 版本，需要重新安装全局包才能更换它依赖的 Node.js 版本。[详见此处](https://zh.voltajs.com/advanced/packages.html#%E5%85%A8%E5%B1%80%E5%8C%85%E7%AE%A1%E7%90%86)。

示例：

1. 使用 Node.js 22.16.0 版本安装了 Prettier
2. 将全局默认的 Node.js 版本更换为 22.18.0
3. 调用 Prettier，此时它是在 22.16.0 版本下运行的
4. 重新安装 Prettier，将运行环境切换到 22.18.0

如果想要调用不同于当前全局默认的 Node.js 版本安装全局包，可以尝试 `volta run` ​命令，它可以指定使用的 Node.js 版本。具体能否通过此方式使用其他 Node.js 安装全局包请自行尝试，相关说明请通过 `volta help run` ​命令自行查看。

如果要查看当前本地的包都是依赖什么 Node.js 版本，可以通过以下命令查看：

```powershell
volta ls all
volta ls prettier
```

以上的 `ls` ​还是 `list` ​的缩写。前一个命令会打印本地所有内容的详细信息，其中的 packages 部分会打印每个包对应的运行环境，后一个命令会打印特定包的详细信息。

## 在项目中使用 Volta

在项目中可以指定此项目使用的 Node.js 版本和其他内容的版本。具体说明参见：[Volta 项目级工具版本控制 | Volta](https://zh.voltajs.com/guide/managing-project.html)。

一种做法是，在项目的 `package.json` ​中添加 `volta` ​字段，并且在其中指定要使用的版本。

```json
{
    "name": "",
    "version": "",
    "volta": {
        "node": "22.18.0",
        "npm": "11.5.2"
    }
}
```

另一种方法是，在命令行中通过 `pin` ​命令指定要使用的版本。

```powershell
volta pin npm@11.5.2
```

根据文档，这里输入的版本号支持多种格式，具体参考安装 npm 包时的版本号。在安装好之后会在 `package.json`​ 写入具体的版本号。`pin`​ 命令会将对应版本写入最近的 `package.json` 文件。实际测试中不输入完整版本号会出现报错，无法写入文件。

如果项目中嵌套文件夹中含有多个 `package.json` ​文件，可以通过引用的方式指定使用的版本号。例如，项目根目录含有一个 `package.json` ​文件指定了 Volta 使用的版本号，可以在下一层文件夹的 `package.json` ​中引用这个文件来定义版本。

```json
{
  "volta": {
    "extends": "../package.json"
  }
}
```

# 一些常用的 Volta 命令

## 安装

```powershell
volta install
```

这里可以安装 Node.js、npm、pnpm 以及一些全局包。这样安装的内容会成为全局默认，在列出时会带有 `(default)` ​标记，代表全局调用默认调用这个版本。

## 卸载

```powershell
volta uninstall
```

需要注意，目前 Node.js 和 npm 不支持通过这个命令卸载，如果你完全去掉了对某个 Node.js 版本和 npm 版本的依赖，可以在数据目录中找到 `/tools/image/yarn/1.22.10` ​和 `/tools/inventory/yarn/yarn-v1.22.10.tar.gz`​（请自行替换为对应的文件）进行删除，具体参见此链接：[Support ](https://github.com/volta-cli/volta/issues/327#issuecomment-920336408)​[`volta uninstall`](https://github.com/volta-cli/volta/issues/327#issuecomment-920336408)​[ for node and yarn · 议题 #327 · volta-cli/volta](https://github.com/volta-cli/volta/issues/327#issuecomment-920336408)。如果是删除某个不使用的 Node.js 版本，则是找到 `node/yourversion` ​进行删除。如果你没有设置数据目录，则可在 `%LOCALAPPDATA/Volta` ​下找到这些数据。

其他可以使用此命令卸载的内容请使用这个命令删除。

## 查看本地安装的内容

```powershell
volta list
volta ls
volta ls all
volta ls node
volta ls npm
volta ls prettier
```

可以通过 `list` ​查看本地安装的内容，其中，直接使用会打印目前激活的版本，使用 `all` ​会打印本地所有可用版本，使用特定名称可以打印特定内容版本。

## 查看帮助

```powershell
volta help
volta help install
volta help list
```

通过 `help` ​命令可以查看这些命令的使用说明。具体不多介绍。
