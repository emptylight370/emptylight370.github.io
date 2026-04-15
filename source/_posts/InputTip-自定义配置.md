---
title: InputTip自定义配置
date: '2026-04-15 22:12:52'
updated: '2026-04-15 22:33:43'
tags:
  - Windows
  - VSCode
permalink: /post/2026/04/inputtip-custom-configuration-11mpmo.html
comments: true
toc: true
---



因为 [InputTip](https://inputtip.abgox.com/zh-CN/) 新增了 VSCode 插件，我也试着配置了一下，并且生成了以下配置，现在分享如下。

## InputTip 本体设置

### 输入法相关

“是否将输入法状态导出”改为【是】。

正好这里有个链接跳转到 [InputTip for VSCode](https://inputtip.abgox.com/zh-CN/faq/inputtip-for-vscode)，先在浏览器打开链接备用。

### 状态提示 - 符号方案

因为 InputTip 将默认符号切换成了三角🔻符号，我还是喜欢原先的圆形⚪符号，就自己绘制了一套圆形符号，大小是 $64\times64(pixels)$，配色是 `#EE0000`​、`#66CCFF` ​和 `#39C5BB`。这里将图片用 base64 编码分享如下：

[https://gist.github.com/emptylight370/2164b2af6314eb3fa570602b7c5a871b](https://gist.github.com/emptylight370/2164b2af6314eb3fa570602b7c5a871b)

后续如有更新会在链接里面更新编码图片。

## InputTip for VSCode

在配置的时候扩展还是 v0.0.2，相当早期了，这里还需要手动配置设置项，我就把过程记录如下。

1. 在 VSCode 中安装扩展，链接在之前打开了
2. 用 <kbd>CTRL</kbd>​+<kbd>,</kbd> ​快捷键打开设置，在搜索框搜索 `InputTip.color` ​设置项（[vscode://settings/InputTip.color](vscode://settings/InputTip.color)）（先输入 `@ext`​，再输入 `inputtip`​，每一步都有补全，得到结果 `@ext:abgox.inputtip`）
3. 点击“在 setting.json 中编辑”选项，打开对应的编辑位置
4. 将 CN 设置为 `#EE0000`​，EN 设置为 `#66CCFF`​，CAPS 设置为 `#39C5BB`，这里有编辑器和终端两个设置项，都要设置

设置结果如上方 gist 链接所示。
