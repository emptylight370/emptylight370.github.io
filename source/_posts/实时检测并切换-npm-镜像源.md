---
title: 实时检测并切换npm镜像源
date: '2026-06-29 20:47:36'
updated: '2026-06-29 21:00:42'
tags:
  - Windows
  - macOS
  - Linux
  - Node.js
permalink: /post/2026/06/detect-and-switch-npm-mirror-sources-in-real-time-z2vsdy.html
comments: true
toc: true
---



通过 [Pana/nrm](https://github.com/Pana/nrm) 工具，可以测试本地到各镜像源的连通性，并且能够一键切换镜像源。

## 安装

根据文档，nrm 支持通过各包管理器安装，比如

```bash
npm install -g nrm
pnpm add -g nrm
yarn global add nrm

mise install npm:nrm
```

## 测试连通性

在安装好之后，可以通过测试命令测试连通性

```bash
nrm test

mise x npm:nrm -- nrm test
```

运行测试后，会输出目前到各镜像源的延迟，以及镜像源的连通性。使用 `nrm list` ​能够输出目前的镜像源列表。

## 切换镜像源

通过命令可以让 nrm 切换当前使用的镜像源。

```bash
nrm use npm
nrm use yarn
nrm use taobao

mise x npm:nrm -- nrm use npm
```

## 设置镜像源

nrm 支持自定义镜像源，如果公司内部有提供镜像源，可以手动添加到列表中，具体命令详见 `--help` ​输出。
