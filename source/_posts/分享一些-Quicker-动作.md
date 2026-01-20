---
title: 分享一些Quicker动作
date: '2025-08-07 10:52:07'
updated: '2026-01-20 21:42:04'
tags:
  - Windows
  - 思源笔记
  - Browser
  - VSCode
  - Quicker
permalink: /post/2025/08/share-some-quicker-actions-zulhol.html
comments: true
toc: true
---



以下是部分自制的 Quicker 动作，分享倒是次要的，主要目的是想赚积分了。如果能够帮上你们当然很好。



## 打开链接

动作地址：[打开链接 - by Emptylight - 动作信息 - Quicker](https://getquicker.net/Sharedaction?code=83e4eac5-91d6-412d-e392-08dcf5ac8d55&fromMyShare=true)

可以通过选中若干链接的方式在默认浏览器中打开这些链接。这个动作最开始是微信（不记得是 3.0 版本还是 4.0 内测版）不能通过右键链接在默认浏览器中打开时写的，当时因为一些链接需要通过微信内置浏览器鉴权，另一些链接在默认浏览器中打开更舒适，所以写了这个动作。现在因为微信已经支持对链接右键之后选择在默认浏览器中打开，脚本的主要使用场景只剩下在没有对网址链接文本自动生成链接的地方快速打开网页了。

## 复制链接

动作地址：[复制链接 - by Emptylight - 动作信息 - Quicker](https://getquicker.net/Sharedaction?code=6b1fd060-c133-4198-8601-08dd7678ed04&fromMyShare=true)

可以复制前台浏览器的当前标签页的链接，并以多种格式输出。可以单纯获取链接，也可以获取图标。不过对于链接，只能输出 Markdown 或者 HTML 格式，图标倒是可以复制纯文本的地址。不过要复制纯文本的网址，直接浏览器复制就完事了。

本文中的动作地址都是通过脚本复制得到的 Markdown 链接。

## 左键计数

动作地址：[左键计数 - by Emptylight - 动作信息 - Quicker](https://getquicker.net/Sharedaction?code=a3d1c272-8578-4dc8-8384-08dd3791bd3b&fromMyShare=true)

因为在不支持通过自动化方式处理的地方有统计需求，所以写了这个动作。通过左键进行计数，可以统计左键按下的次数。除了鼠标左键之外还可以通过键盘的 <kbd>+</kbd> ​键进行计数。这个我也不知道你们有什么使用场景，不过脚本支持自己修改，需要什么按键自己自定义吧。

# 特定应用

以下的动作必须和对应的应用一起使用。

## VSCode

### 在 VSCode 中打开

动作地址：[在 VSCode 中打开 - by Emptylight - 动作信息 - Quicker](https://getquicker.net/Sharedaction?code=4a2f5662-f17c-4eb4-fad0-08dcf4b7eea3&fromMyShare=true)

模仿 PowerToys，在 Quicker 中实现了搜索 VSCode 工作区并打开的功能。动作主要是搜索了本地的文件夹历史，所以并不需要保存工作区或是其他的东西。但是这个搜索必须运行本动作后才能进行，并不是全局的。要在 Quicker 的搜索框中快速打开本动作，需要设置一个搜索关键词。

动作内可以对搜索到的文件夹历史进行修改，如果某些地址不想出现在 Quicker 动作的搜索结果中，可以在动作右键菜单中编辑并删除。也可以自行打开 VSCode 的缓存路径自行排查删除。VSCode 里面能不能删除文件夹历史我还没试过。

## Pot 翻译

### 划词翻译

动作地址：[POT 划词翻译 - by Emptylight - 动作信息 - Quicker](https://getquicker.net/Sharedaction?code=3fffafc4-5347-4600-85e4-08dcf8c7ad5e&fromMyShare=true)

在划选内容之后，弹出一个翻译按钮。点击即可触发 Pot 的划词翻译。这个动作内置了 API 触发和快捷键触发方式。默认情况下是通过 Pot 的默认端口触发划词翻译。

## 思源笔记

### 灵感

动作地址：[灵感 - by Emptylight - 动作信息 - Quicker](https://getquicker.net/Sharedaction?code=32d4e10a-e395-4f0c-9acc-08dd5c97ad3b&fromMyShare=true)

改自 [utools 一键添加灵感到思源笔记 - 链滴](https://ld246.com/article/1741314053776)，在配置好后可以通过文本框将记录的灵感发送到特定文档。

### 思源工具箱

动作地址：[思源工具箱 - by Emptylight - 动作信息 - Quicker](https://getquicker.net/Sharedaction?code=da24bc48-a6c3-4b53-eb24-08ddcb62c590&fromMyShare=true)

虽然叫这个名字，但其实还没写什么功能。之后如果有功能更新不会再修改这里的列表。

现在有的功能为：

1. 粘贴

    1. 粘贴为数据库
    2. 粘贴为链接
    3. 粘贴着重号
    4. 粘贴上划线
2. 修改标题层级

粘贴为数据库：通过[这个方法](https://ld246.com/article/1736255616534/comment/1753178849535?r=EmptyLight#comments)，输入数据库 id 之后可以粘贴出一个数据库。适合把未引用的数据库添加到文档中进行显示。

粘贴为链接：可以对纯文本链接或浏览器地址栏复制的 HTML 链接获取标题，然后以 Markdown 的链接格式粘贴到思源中。

修改标题层级：模拟思源默认的修改标题层级快捷键，即 <kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>1</kbd> ​之类，可以修改光标所在行的标题层级。除了每次触发动作时可以选择一次，还做了单独的菜单可以手动关闭。
