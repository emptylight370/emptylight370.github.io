---
title: 在本地调试GitHub Actions
date: '2025-08-20 11:19:22'
updated: '2026-01-20 22:03:50'
tags:
  - Windows
  - GitHub
  - VSCode
  - Linux
  - macOS
permalink: /post/2025/08/debug-github-actions-locally-9tzrs.html
comments: true
toc: true
---



# 前置条件

这些部分请自行配置好：

1. Windows Subsystem for Linux(WSL2)
2. Docker Desktop for Windows
3. VSCode

# 了解相关工具

本次涉及的工具介绍相当复杂，本文不进行详细介绍或讲解，仅保证能够正常运行。并且本文要求读者具有相当程度的英语阅读与使用能力，能够自行理解使用工具时所显示的英文文本。

## WSL2

用于运行 Docker

## Docker

用于运行所需的服务镜像

## act

在本地运行的镜像，介绍为：[Introduction - act - User Guide | Manual | Docs | Documentation](https://nektosact.com/introduction.html)

可以在本地使用类似于 GitHub Actions 的环境，并且支持各种 actions 事件。

## GitHub Local Actions

在 VSCode 中运行工作流的前端扩展。地址为：[GitHub Local Actions - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=SanjulaGanepola.github-local-actions)

使用后端的 act 服务运行 GitHub Actions，并在前端直观显示运行结果。

![GitHub Local Actions 扩展界面](https://res.emptylight.cn/share/img/2025/2ffdb64087624ab890291f09156ba71f.png "GitHub")

# 安装所需工具

## 安装 GitHub Local Actions 扩展

在 VSCode 中搜索扩展“GitHub Local Actions”，然后点击安装。安装过程中可能需要信任发布者并安装扩展，按要求点击按钮即可。

安装完成后会出现上图所示的界面，在未安装 act 之前第一个组件显示未安装并且打 ❌，未启用 Docker Desktop 之前第二个组件显示 Docker 版本、未运行并且打 ❌，未安装 Docker Desktop 之前第二个组件显示未安装并且打 ❌。

将鼠标悬浮在两个组件上可以显示详细信息。在组件那里有按钮可以启动 Docker Desktop，手动启动 Docker Desktop 后可以点击组件一行的刷新按钮重新获取运行状态。启动 Docker Desktop 之后第二个组件显示运行中并且打 ✅。

组件相关介绍看此处：[Components | GitHub Local Actions Docs](https://sanjulaganepola.github.io/github-local-actions-docs/usage/components/)。

![Docker 已启动](https://res.emptylight.cn/share/img/2025/633539647877822657932a55e85d6d07.png "Docker已启动")

## 安装 act

### 拉取 act 镜像（可选）

根据 [Runners - act - User Guide | Manual | Docs | Documentation](https://nektosact.com/usage/runners.html)，可以找到 GitHub Actions 中使用的镜像与将要拉取的镜像的对应关系。这里查看镜像的详细介绍需要在 [catthehacker/docker_images: Docker images](https://github.com/catthehacker/docker_images) 查看。

此处为了尽量轻量化地运行功能尽量完整的镜像，此处选用 medium 镜像。根据仓库名，在 Docker Desktop 中搜索 `catthehacker/ubuntu`，之后在详情页中选用自己需要的镜像。这里需要的镜像取决于你在 Workflow 文件中指定使用什么镜像运行。

![在 Docker Desktop 中搜索](https://res.emptylight.cn/share/img/2025/82d5f5db0da5dba2362da171f1452190.png "在")

![镜像的详情页](https://res.emptylight.cn/share/img/2025/53c43e94b2c33e9522f1354919c23a7a.png "镜像的详情页")

![拉取合适的镜像](https://res.emptylight.cn/share/img/2025/019f39516c0cfb768fb49c7fb1f92010.png "拉取合适的镜像")

这边不同的架构旁边的拉取有什么区别还不确定，有可能并不影响实际拉取的镜像。问了 AI 说是只有命令行能指定拉取什么架构的镜像。

花了很多很多时间拉取镜像之后（可能需要若干时间），可以在镜像页签中看到所拉取的镜像。这里所拉取的镜像实际上就是 act 初始化时会自动拉取的镜像，只是此处提前进行了拉取，并且告诉 act 不需要每次都拉取镜像进行更新之类的。并且这里镜像是否更新以及什么时候更新都可以自行决定。

### 安装 act 应用

通过安装页 [Installation - act - User Guide | Manual | Docs | Documentation](https://nektosact.com/installation/index.html)，你可以自行选择一个喜欢的方式安装 act。如果选择手动安装的方式，需要将 act 所在目录添加到环境变量中。

安装完成后，需要刷新 VSCode 扩展中的组件部分。如果刷新之后这里的 act 仍然显示未安装，是 VSCode 所使用的环境变量仍未刷新，需要手动重启 VSCode 来刷新 VSCode 所使用的环境变量。现在，组件部分应该显示 act 已正确安装。act 和 docker 右侧应当都显示 ✅。

现在，需要在 VSCode 的设置中配置所使用的 act 命令，如果你没有在环境变量中配置 act 就需要使用完整路径，如果你前面拉取了本地镜像就需要配置下方的命令。

#### 设置 act 命令行参数

方法 1：

这是插件的设置项，可以在设置中搜索此选项：

```
@ext:sanjulaganepola.github-local-actions githubLocalActions.actCommand
```

这个是拉取了本地镜像之后需要设置的命令：这个命令是指定不拉取镜像，使用本地的镜像。

```powershell
act --pull=false
```

可以使用以下命令切换成离线模式：在首次联网成功运行之后，可以在离线模式下运行，并且联网进行的操作会失败。

```powershell
act --action-offline-mode
```

具体命令的解释请在此页 [Runners - act - User Guide | Manual | Docs | Documentation](https://nektosact.com/usage/runners.html) 底部查看。

方法 2：

在 VSCode 左侧的 GitHub Local Actions 面板中找到 settings 部分，在 options 选项中添加 `--pull`​ 并且选择 `false`​，之后展开 options 并勾选 `pull false`​ 一行。之后运行即可看见 act 命令行中添加了 `--pull="false"` 参数。参数含义与方法 1 相同。

需要注意这个参数是跟项目或文件夹走的，适合不同项目/文件夹中需要不同参数的情况，可以将通用参数写进设置项里面，然后每个项目自行控制当前项目特定的参数。

# 使用 act 在本地运行 GitHub Actions

## 运行工作流

详细介绍请看：[Workflows | GitHub Local Actions Docs](https://sanjulaganepola.github.io/github-local-actions-docs/usage/workflows/)

在 VSCode 中打开一个具有 GitHub Actions 的仓库文件夹，就可以在左侧选择一个动作运行了。

![本地运行 GitHub Actions](https://res.emptylight.cn/share/img/2025/617cc8090dc66ef3f3bf52c5feda6b03.png "本地运行")

如果运行之后显示需要选择一个镜像并且运行失败，就需要手动在 VSCode 的终端中运行一次 `act --pull=false` ​或者 `act` ​命令（取决于你需要如何运行）。在此处选择 medium（默认选项），之后如果是不拉取镜像，会直接进入到上次失败的动作的运行，并且输出运行结果。也可以去 `%LOCALAPPDATA%` ​中设置默认使用的镜像。使用任一方法设置完成后，后续不会再提示这个选项，可以直接运行。

此处可以在图片中看到两个 1s 的失败记录，这个就是没有初始化导致的错误，初始化成功之后就可以正常运行并且输出结果。这里第三次的失败记录是因为在 GitHub 上发版的步骤因为没有 GitHub 的 token 导致发布失败，这个需要在下方的设置中进行相应的配置。如果不需要进行类似操作可直接忽略运行失败结果。

这里除了直接运行一个动作之外，还可以运行某个步骤、从某个事件触发等。

## 查看运行历史

详细介绍请看：[History | GitHub Local Actions Docs](https://sanjulaganepola.github.io/github-local-actions-docs/usage/history/)

在历史这一部分可以查看过去运行的动作记录，并且可以查看它们的输出之类的信息。每次运行都会打开一个新的终端，可以切换不同的终端查看不同的运行输出。

左侧的按钮展开可以查看每个步骤的运行成功情况。

## 设置

详细介绍请看：[Settings | GitHub Local Actions Docs](https://sanjulaganepola.github.io/github-local-actions-docs/usage/settings/)

这里的密钥部分需要自己手动填入，变量部分可以从 GitHub 导入。每个项前面的复选框应该是控制这个项是否启用。具体内容因为我不需要通过 GitHub token 发布版本之类的没有进行测试。

最下面的 options 是向 act 添加的命令行参数，打勾启用。

# 完成

在上述步骤之后，你应当能够正常在本地通过上述工具运行 GitHub Actions 并且查看相应的运行结果了。现在可以愉快地在本地调试 GitHub Actions 而不需要频繁地提交触发运行了。如果仍有地方存在疑问，请自行查看 act 和 GitHub Local Actions 的文档。
