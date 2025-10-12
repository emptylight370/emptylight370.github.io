---
title: VSCode扩展推荐
date: '2025-10-12 21:30:37'
updated: '2025-10-12 23:54:26'
permalink: /post/2025/10/vscode-extension-recommendation-1nv7sh.html
tags:
  - VSCode
comments: true
toc: true
---



推荐一些自己使用下来还不错的扩展，有一些需要组合使用。每一个扩展都放上了 VSCode 扩展市场的链接，可以自行跳转查看 README。这里的介绍还是很简略的，省略了很多细节。

## 通用

### VSCode 汉化

[Chinese (Simplified) (简体中文) Language Pack for Visual Studio Code - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=MS-CEINTL.vscode-language-pack-zh-hans)

就是汉化 VSCode 的扩展，在 VSCode 首次启动的时候也会问你要不要切换到中文，确定就会自动安装并且重启 VSCode。重启完就是中文界面了。真的不需要一直用英文 VSCode 折磨自己。

### 显示文件大小

[filesize - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=mkxml.vscode-filesize)

一个显示当前文件大小的小玩意，可以在状态栏显示当前文件的大小，点击还能查看详细参数，比如创建、更新时间，原大小，压缩大小之类的。

### 错误行高亮

[Error Lens - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens)

将 VSCode 检测到的问题高亮显示到所在行。默认效果就是说明文档截图的样子，根据不同的类型（hint、problem、error）显示不同的行背景色，然后在末尾显示存在的问题。可以修改到在问题所在行上方显示问题，就像 Java 扩展的 `Run | Debug` ​按钮那样，可以点击打开快速修复菜单。改成在行上方显示之后也更能完整显示问题。

### 注释高亮

[Colorful Comments Refreshed - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=AllemandInstable.colorful-comments-refreshed)

就是能够为注释提供高亮。默认提供了一些符号为注释提供不同类型的高亮，也可以自行定义。具体支持什么语言还没有细看，只记得支持很多很多语言。不管具体写什么语言的代码都可以使用试试。

### 注释锚点

[Comment Anchors - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=ExodiusStudios.comment-anchors)

能够为特定种类的注释生成锚点，可以快速跳转。这个和注释高亮的扩展可以结合使用，印象里默认的效果是只有 tag 高亮（`TODO`​、`ANCHOR`），现在的使用效果是 TODO 后面的文本也和 TODO 一个颜色，应该是注释高亮扩展调整的。

### 自动分号

[Auto Semicolon - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=myaaghubi.auto-semicolon-vscode)

在需要的地方智能添加分号，比如在行中输入 <kbd>;</kbd> ​自动向行尾添加分号之类的。在不使用分号的语言中也可使用，会自动去除分号。具体效果看扩展的说明文档。

### Tab 跳出

[TabOut - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=albert.TabOut)

通过 tab 将光标移动到括号、引号之外。相当好用，并且将光标移动到引号之外就可以直接输入分号了，和前面的自动分号扩展组合起来操作简化不少。

### 图片预览

[Image preview - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=kisstkondoros.vscode-gutter-preview)

能够在行号前面和预览窗口显示图像。行号前面就是代码测试打断点的区域（gutter），预览窗口就是鼠标悬浮在图片链接上时弹出的窗口。不过 VSCode 不知哪个版本支持了预览图片，现在会有重复，但不影响正常使用。

### 代码翻译

[Code Translate - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=w88975.code-translate)

VSCode 自己的划词翻译。在 VSCode 的预览窗口中显示翻译结果，将英文词汇翻译成中文，对于驼峰命名法能够拆分翻译，直接鼠标悬浮也能显示当前词的翻译。对于非缩写的变量命名还是挺有用的。

### 代码截图

[CodeSnap - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=adpyke.codesnap)

为你的代码生成截图。选中一段代码，然后在右键菜单中点击 Code Snap，就会打开一个预览窗口，可以点击按钮复制或保存生成的图片（具体可设置），在快速分享一段代码给别人的时候很好用，能够保留高亮和缩进。

## 特定语言

### Markdown

#### Markdown 编辑与预览

[Markdown All in One - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one)

对比过几个 md 插件，最后还是回到了 Markdown All in One。它确实满足了 All in One 的需求，能够在源文件中显示语法并且粗略预览语法的效果，能够侧边预览（有更深入的自定义），有标题编号、TOC 之类的，确实是什么需求都一站式满足了。

不过现在我是用 Prettier 格式化 md 文档的，不是用这个插件的格式化。

### GitIgnore

#### 生成 GitIgnore 文件

[.gitignore Generator - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=piotrpalarz.vscode-gitignore-generator)

可惜从 github/gitignore 获取忽略文件的那个扩展不支持 community 文件夹，我还挺喜欢它的交互的。现在退而求其次选了这个从 gitignore.io 获取忽略文件的扩展。这个扩展的交互也挺好的，可以自选添加的忽略文件，将多个文件合并到一起，还能更新忽略文件模板并且保留自己添加的忽略项目（在文件尾）。

#### GitIgnore 文件高亮

[vscode-gitignore-syntax - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=dunstontc.vscode-gitignore-syntax)

为忽略文件添加语法高亮。终于补上高亮的一环，虽然忽略文件本身没有什么语法，但是就是舒服了。

### HTML

> 包括 HTML 及其相关技术，如 JavaScript、CSS、TypeScript、SASS、XML 等。

#### 颜色高亮

[colorize - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=kamikillerto.vscode-colorize)

能够为整个颜色变量显示其代表的颜色，可为变量显示颜色，如 CSS `--color` ​等。默认是为整个颜色变量显示背景色，比 VSCode 自带的那个颜色选择器要显眼很多，还支持显示变量颜色，真好用吧。目前只在 HTML 这边用到了这个扩展，就先放在这里。

## 快捷操作

以下是一些和扩展相关的快捷操作，在此记录一二。

### 命令面板

快捷键是 <kbd>CTRL</kbd>​+<kbd>SHIFT</kbd>​+<kbd>P</kbd>​，或者 <kbd>F1</kbd>​。可以在里面输入一些命令快速调用，比如 `tasks` ​运行任务（有自动检测，可直接运行 grunt、gulp、npm 等任务）；`settings` ​打开设置面板和设置 JSON；`reload` ​重新加载界面；`restart` ​重启扩展主机之类的。有些扩展可以通过命令面板快速调用或者调整设置，有时候某些扩展卡住了没加载出来也可以快速重启扩展主机，功能相当强大。

### 切换文件

在呼出命令面板之后，删掉预输入的 `>` ​就能快速切换文件。可以在列表里查看最近打开的文件，搜索应该是搜文件名称，可以跳转到特定行或者特定变量、函数等。不使用资源管理器也能快速切换文件。

### 配置文件

VSCode 之前把配置文件转正了，并且优化了交互。具体的在另一篇介绍 VSCode 设置的文章里介绍了。它可以将 VSCode 安装的数十个数百个扩展按照不同的场景分组，比如按照语言分组就可以对 C/C++、Python、Java、HTML 等设置不同的配置文件，在写不同语言的时候切换，只启用与这语言相关的扩展，减轻运行负担加快运行速度。按照场景分组就可以为不同配置文件应用不同设置、键盘快捷键、代码片段之类的，具体的可玩性很高。

并且 VSCode 会自动记住文件夹最后使用的配置文件，我现在是按语言分配置文件，在打开不同项目文件夹的时候会自动打开对应配置文件，而除扩展以外的内容全部使用默认配置文件，这样键盘快捷键、扩展设置等都是统一的。对于那些通用的扩展，在扩展的右键菜单里面勾选“为所有配置文件启用”就能添加到所有的配置文件中，不需要重复进行多次安装。
