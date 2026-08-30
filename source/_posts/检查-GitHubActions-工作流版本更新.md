---
title: 检查GitHub Actions工作流版本更新
date: '2026-04-12 15:01:08'
updated: '2026-08-30 16:08:51'
tags:
  - GitHub
permalink: /post/2026/04/check-for-github-actions-workflow-version-updates-z1udlzv.html
comments: true
toc: true
---



## 工具选用

以下工具列出并不是要你全部使用的意思，只是可以从中选用一个（或者两个），如果偏好本地操作就用本地工具，偏好 GitHub 集成就用 GitHub 自动化。如果使用的是 mise 的任务，建议将任务名称简化一下，例如 `[tasks.github_actions_update]` ​或者 `[tasks.gh_actions_up]`，总之怎么顺手怎么来。

## ghacu

> 用于检查 semver 更新，即 tag。默认使用最新 release 版本，会出现 `v1->v1.0.2` ​情况
>
> 工具本身已经 Public Archived，但是还能用，推荐换用 [dependabot/cli](https://github.com/dependabot/cli)，但是 cli 要 docker

因为手动检查 GitHub Actions 使用的工作流版本更新太过繁琐，~~dependent bot 又不提供 GitHub Actions 的工作流版本检查~~（是有的，详见下文），所以我一直想要找到某种方式自动检查工作流的版本更新。在问了 AI 之后找到了几个工具，从中找到了这个工具（[fabasoad/ghacu: GitHub Actions Check Updates - CLI tool to check whether all your actions are up-to-date or not.](https://github.com/fabasoad/ghacu)），并且结合到 mise 中。

首先，打开 mise 的全局配置文件（`~./config/mise.toml`），往里面加入下列任务配置：

```toml
[tasks.github_actions_detect]
alias = "ghad"
description = "Detect GitHub Actions versions updates"
dir = "{{ cwd }}"
run = "ghacu"
tools."github:fabasoad/ghacu" = "latest"
```

任务的名称与别名可以自行配置，不过因为直接使用 `mise run`​ 运行任务更快，这里的任务叫什么、用什么别名都无关紧要了。在任务中定义需要使用的工具，使用 mise 的 GitHub 后端（[GitHub Backend | mise-en-place](https://mise.en.dev/dev-tools/backends/github.html)）直接进行工具安装，不需要在具体项目中添加依赖项。不过仅在任务中使用的工具会被列为可清理的工具，在运行 `mise prune` 时会显示，如果不想遇到这种情况可以添加到全局的工具列表中。

ghacu 工具在没有提供 GitHub token 时会以未认证用户身份请求，可能遇到访问限制，可以设置环境变量 `GHACU_GITHUB_TOKEN`​ 提供 token 以避开限制。这里可以直接填写具体的 token，也可以引用 mise 的 token，下面就是引用 mise 的 token，具体见 [GitHub Tokens | mise-en-place](https://mise.en.dev/dev-tools/github-tokens.html)。

```toml
[tasks.github_actions_detect]
alias = "ghad"
description = "Detect GitHub Actions versions updates"
dir = "{{ cwd }}"
env.GHACU_GITHUB_TOKEN = "{{ env.MISE_GITHUB_TOKEN }}"
run = "ghacu"
tools."github:fabasoad/ghacu" = "latest"
```

这里使用的 `{{}}`​ 语法是 tera 模板，详见 [Task Templates | mise-en-place](https://mise.en.dev/tasks/templates.html#tera-templating)、[Templates | mise-en-place](https://mise.en.dev/templates.html) 与 [Task Configuration | mise-en-place](https://mise.en.dev/tasks/task-configuration.html#env)。在定义了 `MISE_GITHUB_TOKEN` 环境变量之后，就能直接使用这个环境变量，例如：

```toml
[env]
MISE_GITHUB_TOKEN = ""
```

如果在 mise 中通过 gh 命令行工具获取 token，则可以调用命令行工具获取 token，例如：

```toml
[tasks.github_actions_detect]
env.GHACU_GITHUB_TOKEN = "{{ exec(command='gh auth token') }}"
```

上述方法~~未经测试，但是应该~~可行。具体执行的命令可以按需替换。

因为 ghacu 工具在更新工作流版本时默认指向最新的确定版本，而不是保持大版本不变，会出现类似 `v1 -> v1.0.2` 的情况，所以我个人选择手动更新版本号。这里对于使用 hash 固定工作流版本的情况未经测试，README 也没有说明，可以自行测试。如果想要直接更新工作流的版本号，可以添加下述任务：

```toml
[tasks.github_actions_update]
alias = "ghau"
description = "Update GitHub Actions versions"
dir = "{{ cwd }}"
env.GHACU_GITHUB_TOKEN = "{{ env.MISE_GITHUB_TOKEN }}"
run = "ghacu --upgrade"
tools."github:fabasoad/ghacu" = "latest"
```

## pinact

> 检查 sha256 更新。会将 tag 更新为 sha。
>
> 工具知名度较高，至少我感觉如此

不管出于何种安全原因，想要锁定 GitHub Actions 的编译代码，只能使用 sha256 固定 actions 版本，因为任何 tag 都是可以重新创建的，引用 tag 会导致不同 GitHub Actions 运行中使用的 actions 代码不一样。相关安全说明见：[安全使用指南 - GitHub 文档](https://docs.github.com/zh/actions/reference/security/secure-use#using-third-party-actions)

对于固定 actions 版本到固定的 sha，有许多工具可选，我选用的是 [suzuki-shunsuke/pinact: pinact is a CLI to edit GitHub Workflow and Composite action files and pin versions of Actions and Reusable Workflows. pinact can also update their versions and verify version annotations.](https://github.com/suzuki-shunsuke/pinact)，并且结合到 mise 中。

打开 mise 的全局配置文件，将以下任务加入配置中。

```toml
[tasks.github_actions_pin]
description = "Pin GitHub Actions versions to sha"
dir = "{{ cwd }}"
env.PINACT_GITHUB_TOKEN = "{{ env.MISE_GITHUB_TOKEN }}"
run = "pinact run -u"
tools.pinact = "latest"
```

之后通过 `mise run`​ 运行命令，就能看到命令行里面将 actions 都固定到最新 tag 的 sha，并且标记 sha 对应的版本号。后续再运行这个任务，就能将 actions 更新到最新版本。这里注意，调用 `pinact run`​ 是将 tag 改写成 sha，调用 `pinact run --update`​ 或 `pinact run -u` 是更新到最新标签的 sha。

pinact 支持配置文件，能够全局配置以及项目配置，相关文档见：[pinact/docs/config.md 在分支 main · suzuki-shunsuke/pinact](https://github.com/suzuki-shunsuke/pinact/blob/main/docs/config.md)，能够通过配置文件忽略某些 actions，或者调整更新前的等待时间。具体的配置项详见官方说明。

并且，pinact 提供了 GitHub Actions 版本（[suzuki-shunsuke/pinact-action: GitHub Actions to pin GitHub Actions by pinact](https://github.com/suzuki-shunsuke/pinact-action)），能够在 GitHub Actions 中定期检查版本更新，并且发起 Pull Request，但是需要单独的 access token，并且授予进行修改的权限。

## GitHub Dependabot

> GitHub 官方工具，在定期运行后提交 pr 更新工具链。

GitHub 官方提供一个 Dependabot 工具，可以检查各种包管理器的依赖更新，其中就包括 GitHub Actions。如何创建 Dependabot 见 [Dependabot 快速入门指南 - GitHub 文档](https://docs.github.com/zh/code-security/tutorials/secure-your-dependencies/dependabot-quickstart)。

配置文档见 [Dependabot 支持的生态系统和存储库 - GitHub 文档](https://docs.github.com/zh/code-security/reference/supply-chain-security/supported-ecosystems-and-repositories#github-actions)、[使用 Dependabot 保持操作的最新状态 - GitHub 文档](https://docs.github.com/zh/code-security/how-tos/secure-your-supply-chain/secure-your-dependencies/auto-update-actions)

在 `.github/dependabot.yml` ​中填入以下内容：

```yaml
# Set update schedule for GitHub Actions

version: 2
updates:

  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      # Check for updates to GitHub Actions every week
      interval: "weekly"

```

之后 Dependabot 就会每周检查 actions 的版本更新，并且发起 Pull Request。

## actions-up

> 终端交互式更新。默认会将 tag 更新为 sha，但是可以保留原格式。
>
> 工具较新，用量与反馈较 pinact 要少。具体用不用自行审查

在最新的搜索中，我注意到一个很新的工具：[azat-io/actions-up: 🌊 Interactive CLI tool to update GitHub Actions to latest versions with SHA pinning](https://github.com/azat-io/actions-up)。这个工具是 25 年 8 月出现的，运行后在终端选择要更新的 actions，然后将选定的 actions 更新为 sha 格式。也可以指定保留当前的格式。

打开 mise 的全局配置文件，将以下任务加入到配置中。

```toml
[tasks.github_actions_up_interactive]
description = "Detect and update GitHub Actions interactively"
dir = "{{ cwd }}"
env.GITHUB_TOKEN = "{{ env.MISE_GITHUB_TOKEN }}"
run = "actions-up --style preserve"
tools."npm:actions-up" = "latest"
```

之后在项目中运行这个任务，就能检查 GitHub Actions 更新。这里用了参数指定保留原本的版本格式，原本用的 tag 就更新到 tag，原本用的 sha 就更新到 sha。

对于部分 actions，在更新时只打标签而不发布版本，则需要用上 `--prefer-tags` ​符号参数；另外，在使用 tag 指定版本时标签可能存在多种情况，详见工具 README（[https://github.com/azat-io/actions-up#update-style](https://github.com/azat-io/actions-up#update-style)）。
