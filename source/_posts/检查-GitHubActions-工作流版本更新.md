---
title: 检查GitHub Actions工作流版本更新
date: '2026-04-12 15:01:08'
updated: '2026-06-16 20:03:39'
tags:
  - GitHub
permalink: /post/2026/04/check-for-github-actions-workflow-version-updates-z1udlzv.html
comments: true
toc: true
---



## 检查 semver 更新

因为手动检查 GitHub Actions 使用的工作流版本更新太过繁琐，dependent bot 又不提供 GitHub Actions 的工作流版本检查，所以我一直想要找到某种方式自动检查工作流的版本更新。在问了 AI 之后找到了几个工具，从中找到了这个工具（[fabasoad/ghacu: GitHub Actions Check Updates - CLI tool to check whether all your actions are up-to-date or not.](https://github.com/fabasoad/ghacu)），并且结合到 mise 中。

首先，打开 mise 的全局配置文件（`~./config/mise.toml`），往里面加入下列任务配置：

```toml
[tasks.github_actions_detect]
alias = "ghad"
description = "Detect GitHub Actions versions updates"
dir = "{{ cwd }}"
run = "ghacu"
tools."github:fabasoad/ghacu" = "latest"
```

任务的名称与别名可以自行配置，不过因为直接使用 `mise run` ​运行任务更快，这里的任务叫什么、用什么别名都无关紧要了。在任务中定义需要使用的工具，使用 mise 的 GitHub 后端（[GitHub Backend | mise-en-place](https://mise.jdx.dev/dev-tools/backends/github.html)）直接进行工具安装，不需要在具体项目中添加依赖项。不过仅在任务中使用的工具会被列为可清理的工具，在运行 `mise prune` ​时会显示，如果不想遇到这种情况可以添加到全局的工具列表中。

ghacu 工具在没有提供 GitHub token 时会以未认证用户身份请求，可能遇到访问限制，可以设置环境变量 `GHACU_GITHUB_TOKEN` ​提供 token 以避开限制。这里可以直接填写具体的 token，也可以引用 mise 的 token，下面就是引用 mise 的 token，具体见 [GitHub Tokens | mise-en-place](https://mise.jdx.dev/dev-tools/github-tokens.html)。

```toml
[tasks.github_actions_detect]
alias = "ghad"
description = "Detect GitHub Actions versions updates"
dir = "{{ cwd }}"
env.GHACU_GITHUB_TOKEN = "{{ env.MISE_GITHUB_TOKEN }}"
run = "ghacu"
tools."github:fabasoad/ghacu" = "latest"
```

这里使用的 `{{}}` ​语法是 tera 模板，详见 [Task Templates | mise-en-place](https://mise.jdx.dev/tasks/templates.html#tera-templating)、[Templates | mise-en-place](https://mise.jdx.dev/templates.html) 与 [Task Configuration | mise-en-place](https://mise.jdx.dev/tasks/task-configuration.html#env)。在定义了 `MISE_GITHUB_TOKEN` ​环境变量之后，就能直接使用这个环境变量，例如：

```toml
[env]
MISE_GITHUB_TOKEN = ""
```

如果在 mise 中通过 gh 命令行工具获取 token，则可以调用命令行工具获取 token，例如：

```toml
[tasks.github_actions_detect]
env.GHACU_GITHUB_TOKEN = "{{ exec(command='gh auth token') }}"
```

上述方法未经测试，但是应该可行。具体执行的命令可以按需替换。

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

## 检查 hash 更新

不管出于何种安全原因，想要锁定 GitHub Actions 的编译代码，只能使用 sha256 固定 actions 版本，因为任何 tag 都是可以重新创建的，引用 tag 会导致不同 GitHub Actions 运行中使用的 actions 代码不一样。相关安全说明见：[安全使用指南 - GitHub 文档](https://docs.github.com/zh/actions/reference/security/secure-use#using-third-party-actions)

对于固定 actions 版本到固定的 hash，有许多工具可选，我选用的是 [suzuki-shunsuke/pinact: pinact is a CLI to edit GitHub Workflow and Composite action files and pin versions of Actions and Reusable Workflows. pinact can also update their versions and verify version annotations.](https://github.com/suzuki-shunsuke/pinact)，并且结合到 mise 中。

打开 mise 的全局配置文件，将以下任务加入配置中。

```toml
[tasks.github_actions_pin]
description = "Pin GitHub Actions versions to hash"
dir = "{{ cwd }}"
env.PINACT_GITHUB_TOKEN = "{{ env.MISE_GITHUB_TOKEN }}"
run = "pinact run -u"
tools.pinact = "latest"
```

之后通过 `mise run` ​运行命令，就能看到命令行里面将 actions 都固定到最新 tag 的 hash，并且标记 hash 对应的版本号。后续再运行这个任务，就能将 actions 更新到最新版本。

pinact 支持配置文件，能够全局配置以及项目配置，相关文档见：[pinact/docs/config.md 在分支 main · suzuki-shunsuke/pinact](https://github.com/suzuki-shunsuke/pinact/blob/main/docs/config.md)，能够通过配置文件忽略某些 actions，或者调整更新前的等待时间。具体的配置项详见官方说明。

并且，pinact 提供了 GitHub Actions 版本（[suzuki-shunsuke/pinact-action: GitHub Actions to pin GitHub Actions by pinact](https://github.com/suzuki-shunsuke/pinact-action)），能够在 GitHub Actions 中定期检查版本更新，并且发起 Pull Request，但是需要单独的 access token，并且授予进行修改的权限。
