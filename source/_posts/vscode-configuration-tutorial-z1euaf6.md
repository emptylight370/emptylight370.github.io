---
title: VSCode配置教程
date: '2024-07-07 11:24:43'
updated: '2026-09-16 14:15:50'
permalink: /post/2024/07/vscode-configuration-tutorial-z1euaf6.html
comments: true
toc: true
tags:
  - VSCode
---



<iframe sandbox="allow-top-navigation-by-user-activation allow-same-origin allow-forms allow-scripts allow-popups" src="https://player.bilibili.com/player.html?bvid=BV1WLaFe1EPa&amp;page=1&amp;high_quality=1&amp;as_wide=1&amp;allowfullscreen=true&amp;autoplay=0" data-src="" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style="height: 432px; width: 810px;"></iframe>

# 扩展篇

## 主题篇

搜索 theme，快捷切换主题

搜索图标 icon theme，

设置 > 主题 > 颜色主题、图标主题

## 汉化篇

扩展搜索 chinese，安装重启，通常在启动时也会提示安装语言包

## 使用体验

快捷键：搜索 keymap 可下载不同软件的快捷键

注释高亮：Better Comments(by Aaron Bond)

代码折叠优化：Better Folding(by Mohammad Baqer)

错误高亮：Error Lens(by Alexander)

文件大小：filesize(by Matheus Kautzmann)

代码生成图片：CodeSnap(by adpyke)

单词翻译：Code Translate(by w88975)

多项目管理（不同文件夹）：Project Manager(by Alessandro Fragnani)

自动生成注释：koroFileHeader(by OBKoro1)

## 语言使用篇

### 代码运行

Code Runner 支持多种语言运行

代码编译运行、调试可能需要特殊支持，或者在 launch.json 或 tasks.json 中配置，不讲解。

### C/C++

安装 C++ Extension Pack 扩展，支持代码编译、调试、自动补全、代码高亮。需要本地安装 mingw 等编译器。

### Java/Kotlin

安装 Extension Pack for Java(by Microsoft)扩展，支持编译、调试、自动补全、代码高亮、项目管理，支持多 Java 配置，不需要 JAVA HOME 也可以在设置中设置多个 Java 版本。

Kotlin 可以通过安装扩展支持，体验不算好。

### Python

安装 Python 扩展，Jupyter 扩展，支持检测 Python、conda、pyenv、uv 等虚拟环境，可以使用 Python、Jupyter Notebook，使用笔记本时可以自动为没有安装 Jupyter 核心的 Python 安装对应的库。

### HTML

HTML 无需过多配置，本身有一定的支持。安装一些别的扩展能够提升使用体验。

Colorize(by YuTengjing)：颜色高亮显示。

Image preview(by Kiss Tamas)：在行号左边显示图片。

HTML CSS Support(by ecmel)：CSS 的自动补全。

IntellSense for CSS class names in HTML(by Styleguide Intellisense)：HTML 的自动补全。

Tailwind CSS IntelliSense(by Tailwind Labs)：Tailwind CSS 支持。

XML(by Red Hat)：XML 的语法高亮、格式化等。

# 设置篇

## 设置（UI）

### 常用设置

#### 自动保存：

[Files: Auto Save](vscode://settings/files.autoSave) 根据需要设置，建议使用自动保存（可在文件 > 自动保存中开启）

搜索 save，可见：

[Files: Auto Save When No Errors](vscode://settings/files.autoSaveWhenNoErrors) 启用后只保存无错误的文件

[Editor: Format On Save Mode](vscode://settings/editor.formatOnSaveMode) 支持通过版本管理确认格式化范围，如果文件相当大可以减少格式化时间

#### 自动换行：

[Editor: Word Wrap](vscode://settings/editor.wordWrap) 支持在屏幕最右边或者超过特定行数时自动换行，不出现水平滚动条

[Editor: Word Wrap Column](vscode://settings/editor.wordWrapColumn) 在上面选择固定位置换行时，配置换行的位置

#### 括号高亮：

[Guides: Bracket Pairs](vscode://settings/editor.guides.bracketPairs) 垂直方向括号高亮

[Guides: Bracket Paris orizontal](vscode://settings/editor.guides.bracketPairsHorizontal) 水平方向括号高亮

[Bracket Pair Colorization: Independent Color Pool Per Bracket Type](vscode://settings/editor.bracketPairColorization.independentColorPoolPerBracketType) 为不同种类括号对使用不同的颜色序列，对不同的括号按不同层次依次显示颜色

[Bracket Pari Colorization: Enabled](vscode://settings/editor.bracketPairColorization.enabled) 对成对括号着色

#### 自动折叠导入语句：

[Folding Imports By Default](vscode://settings/editor.foldingImportsByDefault) 启用后自动折叠导入范围，将函数的导入自动折叠

#### 平滑滚动：

[Editor: Smooth Scrolling](vscode://settings/editor.smoothScrolling) 启用后使用平滑滚动

[Workbench > List: Smooth Scrolling](vscode://settings/workbench.list.smoothScrolling) 控制列表和树是否具有平滑滚动效果

[Terminal > Intergrated: Smooth Scrolling](vscode://settings/terminal.integrated.smoothScrolling) 在终端中启用平滑滚动

#### 空格自动补全至制表符位置：

[Editor: Sticky Tab Stops](vscode://settings/editor.stickyTabStops) 使用空格时也自动填充到 tab 位置

#### 自动格式化：

[Editor: Format On Paste](vscode://settings/editor.formatOnPaste) 自动格式化粘贴内容

[Editor: Format On Save](vscode://settings/editor.formatOnSave) 保存时自动格式化

[Editor: Format On save Mode](vscode://settings/editor.formatOnSaveMode) 可根据版本管理格式化修改内容

[Editor: Format On Type](vscode://settings/editor.formatOnType) 输入换行符后格式化这一行

### 缩略图（右边滚动条边的小地图）：

[Editor > Minimap: MaxColumn](vscode://settings/editor.minimap.maxColumn) 缩略图最大显示宽度

[Editor > Minimap: Render Characters](vscode://settings/editor.minimap.renderCharacters) 启用后渲染实际字符，关闭后只渲染颜色块

### 代码建议（自动补全）：

[Editor > Suggest: Snippets Prevent Quick Suggestions](vscode://settings/editor.suggest.snippetsPreventQuickSuggestions) 有时没法应用自动补全把这个关掉就好

[Editor > Suggest: Preview](vscode://settings/editor.suggest.preview) 在编辑器内光标位置显示将要填充的内容

### 文件设置：

[Files: Auto Guess Encoding](vscode://settings/files.autoGuessEncoding) 打开文件时自动猜测文件编码，不必手动调整编码

[Files: Trim Final Newlines](vscode://settings/files.trimFinalNewlines) 删除文件最后一行空行后面的所有空行

[Files: Trim Trailing Whitespace](vscode://settings/files.trimTrailingWhitespace) 删除文件每一行后面的空格，**Markdown 必须关闭（在搜索框里输入**​`@lang:markdown`​ **）**

### 编辑器：

[Workbench > Editor > Limit: Enable](vscode://settings/workbench.editor.limit.enabled) 限制编辑器（标签页）打开数目

[Workbench > Editor > Limit: Exclude Dirty](vscode://settings/workbench.editor.limit.excludeDirty) 排除脏编辑器

[Workbench > Editor > Limit: Value](vscode://settings/workbench.editor.limit.value) 限制编辑器最大数目

[Notebooks: Line Numbers](vscode://settings/notebook.lineNumbers) 单元格编辑器中显示行号，好像是 Jupyter 什么的

### 窗口：

[Window: Auto Detect Color Scheme](vscode://settings/window.autoDetectColorScheme) 根据系统主题切换 VSCode 颜色主题

[Window: Auto Detect High Contrast](vscode://settings/window.autoDetectHighContrast) 根据系统高对比度主题切换 VSCode 高对比度主题

[Window: Double Click Icon To Close](vscode://settings/window.doubleClickIconToClose) 双击 VSC 图标关闭 VSCode 窗口

[Window: Restore Fullscreen](vscode://settings/window.restoreFullscreen) 重新打开后保持全屏（或不全屏）

[Window: Restore Windows](vscode://settings/window.restoreWindows) 控制打开 VSCode 时恢复窗口和编辑器的方法

### 功能：

[Accessibility > Din Unfocused: Enabled](vscode://settings/accessibility.dimUnfocused.enabled) 将不具有焦点的编辑器变暗

[Explorer: Confirm Delete](vscode://settings/explorer.confirmDelete) 在删除文件时显示确认

[Explorer: Confirm Drag And Drop](vscode://settings/explorer.confirmDragAndDrop) 在拖放和移动文件时显示确认

[Explorer: Confirm Paste Native](vscode://settings/explorer.confirmPasteNative) 在系统文件管理器复制文件到 VSCode 的文件管理器中时显示确认

[Debug > Terminal: Clear Before Reusing](vscode://settings/debug.terminal.clearBeforeReusing) 在终端中启动调试之前清空终端

[Terminal > Integrated: Enable Images](vscode://settings/terminal.integrated.enableImages) 在终端中支持图像

[Terminal > Integrated: Auto Replies](vscode://settings/terminal.integrated.autoReplies) 自动响应终端中的消息，比如终止批处理时弹出的 ​`"Terminate batch job (Y/N)"` 提示

## 配置文件

配置文件是 VSCode 新正式提供支持的一种配置方式，可以在不同配置文件中使用不同的扩展、设置、键盘快捷方式等。

创建配置文件时可选择需要独立设置什么内容，个人喜欢只单独配置扩展，将配置文件名称改为不同的语言，这样就将不同语言的插件隔离开了，启动不同的项目文件夹可以记住不同的配置文件，启动速度也能一定程度加快。也可以使用独立的快捷方式，这样 Java 环境就使用 eclipse 或 idea 的快捷键，C/C++ 环境就使用 VS 的快捷键。

## 命令面板

可以快速访问和搜索 VSCode 或插件提供的功能，除了​ <kbd>CTRL</kbd>​+​<kbd>SHIFT</kbd>​+​<kbd>P</kbd> ​之外，还可以使用​ <kbd>F1</kbd> ​拉起命令面板。

此处搜索滚动可以开启“切换编辑器粘滞滚动”，可以在滚动时显示当前代码所属代码块的方法名或类名等。也可以快速重启 VSCode 或扩展等。

## 键盘快捷方式

可以手动设置一些快捷键，或者手动编写一些新的快捷键实现一些功能。比如“在下面插入行”（在当前行下插入一个新的行并将光标移至下一行）——我设置了​ <kbd>CTRL</kbd>​+​<kbd>ENTER</kbd>​，“删除行”（删除当前行，光标移动到右边）——​<kbd>SHIFT</kbd>​​+​<kbd>DELETE</kbd>（不手动配置也能删除当前行，光标移动到左边）。

## 用户代码片段

可以自行设置特定语言或所有语言的特殊类型的代码补全，可以一键生成块注释或者补充扩展没有的代码补全，比如：

Java:

```json
{
    "str to String": {
        "prefix": "str",
        "body": [
            "String$0"
        ],
        "description": "把str补全成String"
    },
    "Scanner(System.in)": {
        "prefix": "sysin",
        "body": [
            "Scanner ${1:sc} = new Scanner(System.in);$0",
        ],
        "descrption": "读取System.in作为输入"
    }
}
```

这里就在输入 `str` ​时可以自动补全成 `String` ​并将光标放置在后面（可以没有），在输入 `sysin` ​时补全成 Scanner 并可选调整变量名（不会自动引入 Scanner）。这里还可以写好自动生成块注释，然后自动移动光标填充信息。

# 快捷操作篇

## 切换文件编码格式

右下角有一个 UTF-8 或 GBK 按钮，取决于当前的文件格式，点击可以显示重新打开或保存文件选项，可以按照目标格式打开或保存文件。但是请注意，如果当前无法正确显示文件字符，那么必须先以正确的编码显示文件才能重新保存文件，否则会出现问题。

## 选择语言模式

右下角在编码按钮旁边有一个语言按钮，显示取决于当前的文件使用的编程语言。点击可以手动选择以什么语言加载当前文件，适用于自动检测语言错误的情况。
