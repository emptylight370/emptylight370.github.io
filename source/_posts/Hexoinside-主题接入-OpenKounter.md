---
title: Hexo inside主题接入Open Kounter
date: '2026-09-05 00:26:00'
updated: '2026-10-03 15:52:26'
tags:
  - GitHub
  - EdgeOne
  - TencentCloud
  - Browser
permalink: /post/2026/09/hexo-inside-theme-connects-to-open-kounter-z1nfd8r.html
comments: true
toc: true
---



## 介绍

[Open Kounter](https://github.com/Mintimate/open-kounter) 是一个基于 EdgeOne Pages Functions 和 Blob 存储的无服务器计数器服务，旨在替代 LeanCloud 为静态网站（如 Hexo）提供 PV/UV 统计功能。其中，EdgeOne 是腾讯云提供的边缘安全加速平台 EO，提供免费与付费服务。

Inside 主题的 GitHub 页面是这个：[ikeq/hexo-theme-inside](https://github.com/ikeq/hexo-theme-inside)，作者提供了配置观看数的接口，需要自行接入：[ikeq/hexo-theme-inside#344](https://github.com/ikeq/hexo-theme-inside/issues/344)。

在下列部署过程中，你需要若干事物：一个腾讯云账号、一个域名、一个使用 Inside 主题的 Hexo 博客等。

## 部署过程

### 配置腾讯云

首先，你需要有一个腾讯云账号。然后，你需要开通 EdgeOne 以及 Makers（原 Pages）。这部分有免费版，具体限额要实时查找文档。准备完成后，你应能在腾讯云 EO Makers 中创建项目。

### 创建项目

> [!WARNING]
> 此部分由回忆组成，可能与实际操作存在部分出入。操作流程应当正确。

首先，把 Open Kounter 的仓库 fork 一份，放到自己的仓库列表里面。

然后，在 EO Makers 中导入 Git 仓库，选择 GitHub，授权 EdgeOne 访问你的 GitHub；然后在后续弹出的 GitHub 界面中，选择将应用安装到你刚才 fork 的 Open Kounter 仓库中，等待操作完成。

现在，你应回到腾讯云的 EO 界面，并进入部署的 OOBE 界面。在此处确认配置，并开始部署，等待部署完成。

现在，在你的界面上出现了一个预览按钮（或者弹窗），打开预览链接，等待 Open Kounter 界面加载完成。现在，你应能对 Open Kounter 进行配置。

### 配置 Open Kounter

在进入 Open Kounter 的网页后，你首先需要配置一个 token，用于登录。我强烈建议使用密码管理器生成并保存此 token，便于后续登录，因为密码管理器生成密码通常可以使用相当复杂的强密码，能增加安全性。Open Kounter 后台始终能通过 token 访问，如 token 较弱可能出现后台被第三者访问，部署的服务可能被盗用，造成不必要的损失（含经济损失）。

在配置好 token 后，进入管理界面，此时，在域名白名单中添加你要接入的域名。

现在，回到腾讯云，在刚创建的项目里添加自定义域名，然后，在域名部署完成后，去你的 DNS 服务商那里配置 CNAME。如果你使用的是 DNSPod，可以一站式操作。同时，如果你需要 HTTPS 访问，则应准备好可用的 SSL 证书，并配置到这里。

等待上述操作完成后，新增的自定义域名应处于已生效状态，并可正常访问。现在，通过自定义域名访问管理员后台，检查访问状态。如需要绑定 PassKey，此时可以进行绑定。后续可用 PassKey 登录。

此时，Open Kounter 服务已就绪，可在博客端进行接入。

### Hexo 博客接入 Open Kounter

请注意，[hexo-theme-inside](https://github.com/ikeq/hexo-theme-inside) 主题提供了内置的 pv 显示接口，只需要触发接口即可显示。如果你使用的不是 inside 主题，只是来寻找参考，请查阅自己主题的文档，了解如何显示 pv 数。

参考文档：

1. [open-kounter/client/adapter.js at main · Mintimate/open-kounter](https://github.com/Mintimate/open-kounter/blob/main/client/adapter.js)
2. [ikeq/hexo-theme-inside#344](https://github.com/ikeq/hexo-theme-inside/issues/344)

现在，把这两个文档交给 coding copilot，让它生成一个脚本，并在主题中配置。此处有几个坑：一是 js 脚本是适配 Fluid 主题的，Inside 主题没有全局 CONFIG 这种东西，API_SERVER 需要硬编码；二是 Inside 主题能够引用 js 文件，但是需要放置在 source 目录下，并且排除渲染用作脚本的 js 文件，因此推荐在 source 目录下新建一个文件夹用于存放脚本，并且排除此文件夹的渲染。

好的，你应该成功生成了脚本文件，现在，在本地运行一下 Hexo 服务器，看看 body 中有没有引用脚本文件，如有，则说明主题侧已经正确引用脚本。然后继续检查此​ `<script>` ​标签指向的链接是否正确访问，如正确获取脚本，则说明 hexo 侧已经正确配置排除，如脚本显示 404，则说明 Hexo 将脚本作为文章渲染，需要检查排除配置。

现在，你应该只剩下两件事，把 AI 预留的​ `API_SERVER` ​地址替换成你配置的自定义域名，以及部署博客。

如果你搞不定这个脚本，访问 [get-pv.js](https://github.com/emptylight370/emptylight370.github.io/blob/main/source/snippets/get-pv.js) 以查看示例，注意同时配置主题和 Hexo。这个是 AI 生成的，理论上你的 copilot 或者 agent 也能做到。

### 验证实际效果

在 Open Kounter 和博客都部署完成后，打开博客和后台，随便打开几个博客页面，观察后台是否出现计数。受限于主题效果，仅有文章页面会显示访问量，其余页面只会计数不会显示。

此时，你也可以回到 EO Makers 的后台，查看项目访问情况。

## 维护与更新

### Open Kounter

如果后续 Open Kounter 存在更新，你只需要上 GitHub 的仓库页面，同步上游的修改，EO Makers 就会自动触发新的构建。理论上是这样的。等待部署完成，就能看到新的后台、使用新的功能。

### GitHub 与腾讯云

这部分不是维护相关，如果你想知道，这一趟下来你具体多了什么东西，可以用这个做参考，但是可能不完整。

据不完全统计，在这全部操作结束后，你开通了腾讯云的 EdgeOne、EdgeOne Makers 业务，并在 GitHub 上授权了 EO Makers 应用，以及在选定仓库中安装了 EO Makers 应用。

理论上，授权用于 EO 获取你所有的仓库列表（用于在 EO 中显示与选择），仓库中安装的应用用于告知 EO 你的仓库有更新，并获取最新的代码内容。理论上你只应将 EO 这个应用安装到刚 fork 的 open-kounter 仓库中，如果不慎安装到全部仓库中，我也不知道会发生什么。好在你还能在 GitHub 上重新配置。
