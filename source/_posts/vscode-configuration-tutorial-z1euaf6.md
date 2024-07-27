---
title: VSCode配置教程
date: '2024-07-07 11:24:43'
updated: '2024-07-08 00:01:50'
permalink: /post/vscode-configuration-tutorial-z1euaf6.html
comments: true
toc: true
tags:
---



# VSCode配置教程

# 扩展篇

## 主题篇

搜索theme，快捷切换主题

搜索图标icon theme，

设置》主题》颜色主题、图标主题

## 汉化篇

扩展搜索chinese，安装重启

## 使用体验

快捷键：搜索keymap可下载不同软件的快捷键

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

Code Runner支持多种语言运行

代码编译运行、调试可能需要特殊支持，或者在launch.json或tasks.json中配置，不讲解。

### C/C++

安装C++ Extension Pack扩展，支持代码编译、调试、自动补全、代码高亮。需要本地安装mingw等编译器。

### Java/Kotlin

安装Extension Pack for Java(by Microsoft)扩展，支持编译、调试、自动补全、代码高亮、项目管理，支持多Java配置，不需要JAVA HOME也可以在设置中设置多个Java版本。

Kotlin可以通过安装扩展支持，体验不算好。

### Python

安装Python扩展，Jupyter扩展，支持本地使用Python，anaconda，pyenv等环境，可以使用Python、Jupyter Notebook，使用笔记本时可以自动为没有安装Jupyter核心的Python安装对应的库。

### HTML

HTML无需过多配置，本身有一定的支持。安装一些别的扩展能够提升使用体验。

Colorize(by YuTengjing)：颜色高亮显示。

Image preview(by Kiss Tamas)：在行号左边显示图片。

HTML CSS Support(by ecmel)：CSS的自动补全。

IntellSense for CSS class names in HTML(by Styleguide Intellisense)：HTML的自动补全。

Tailwind CSS IntelliSense(by Tailwind Labs)：Tailwind CSS支持。

XML(by Red Hat)：XML的语法高亮、格式化等。

# 设置篇

## 设置（UI）

### 常用设置

#### 自动保存：

Files: Auto Save根据需要设置，建议使用自动保存（可在文件>自动保存中开启）

搜索save，可见：

Files: Auto Save When No Errors启用后只保存无错误的文件

Editor: Format On Save Mode支持通过版本管理确认格式化范围，如果文件相当大可以减少格式化时间

#### 自动换行：

Editor: Word Wrap支持在屏幕最右边或者超过特定行数时自动换行，不出现水平滚动条

#### 括号高亮：

Guides: Bracket Pairs垂直方向括号高亮

Guides: Bracket Paris orizontal水平方向括号高亮

Bracket Pair Colorization: Independent Color Pool Per Bracket Type为不同种类括号对使用不同的颜色序列，对不同的括号按不同层次依次显示颜色

Bracket Pari Colorization: Enabled对成对括号

#### 自动折叠导入语句：

Folding Imports By Default启用后自动折叠导入范围

#### 平滑滚动：

Smooth Scrolling启用后使用平滑滚动

List: Smooth Scrolling控制列表和树是否具有平滑滚动效果

Intergrated: Smooth Scrolling在终端中启用平滑滚动

#### 空格自动补全至制表符位置：

Sticky Tab Stops使用空格时也自动填充到tab位置

#### 自动格式化：

Format On Paste自动格式化粘贴内容

Format On Save保存时自动格式化

Format On save Mode可根据版本管理格式化修改内容

Format On Type输入换行符后格式化这一行

### 缩略图（右边滚动条边的小地图）：

MaxColumn缩略图最大显示宽度

Render Characters启用后渲染实际字符，关闭后只渲染颜色块

### 代码建议（自动补全）：

Suggest: Snippets Prevent Quick Suggestions有时没法应用自动补全把这个关掉就好

Suggest: Preview在编辑器内光标位置显示将要填充的内容

### 文件设置：

Auto Guess Encoding打开文件时自动猜测文件编码，不必手动调整编码

Trim Final Newlines删除文件最后一行空行后面的所有空行

Trim Trailing Whitespace删除文件每一行后面的空格，**Markdown必须关闭**

### 编辑器：

Limit: Enable限制编辑器（标签页）打开数目

Limit: Exclude Dirty排除脏编辑器

Limit: Value限制编辑器最大数目

Notebooks: Line Numbers笔记本中显示行号

### 窗口：

Auto Detect Color Scheme根据系统主题切换VSCode颜色主题

Auto Detect High Contrast根据系统高对比度主题切换VSCode高对比度主题

Double Click Icon To Close双击VSC图标关闭VSCode窗口

Restore Fullscreen重新打开后保持全屏（或不全屏）

Restore Windows重新打开后显示多少个编辑器

### 功能：

Din Unfocused: Enabled将不具有焦点的编辑器变暗

Confirm Delete在删除文件时显示确认

Confirm Drag And Drop在拖放和移动文件时显示确认

Confirm Paste Native在系统文件管理器复制文件到VSCode的文件管理器中时显示确认

Terminal: Clear Before Reusing在终端中启动调试之前清空终端

Experimental: Show History Graph在源代码管理（版本管理）视图中显示历史记录图（提交记录树）而不是传入/传出更改（实验功能，或可代替Git Graph扩展）

Integrated: Enable Images在终端中支持图像

## 配置文件

配置文件是VSCode新正式提供支持的一种配置方式，可以在不同配置文件中使用不同的扩展、设置、键盘快捷方式等。

创建快捷方式时可选择需要独立设置什么内容，个人喜欢只单独配置扩展，将配置文件名称改为不同的语言，这样就将不同语言的插件隔离开了，启动不同的项目文件夹可以记住不同的配置文件，启动速度也能一定程度加快。也可以使用独立的快捷方式，这样Java环境就使用eclipse或idea的快捷键，C/C++环境就使用VS的快捷键。

## 命令面板

可以快速访问和搜索VSCode或插件提供的功能，除了`win+shift+p`​之外，还可以使用`F1`​拉起命令面板。

此处搜索滚动可以开启“切换编辑器粘滞滚动”，可以在滚动时显示当前代码所属代码块的方法名或类名等。也可以快速重启VSCode或扩展等。

## 键盘快捷方式

可以手动设置一些快捷键，或者手动编写一些新的快捷键实现一些功能。比如“在下面插入行”（在当前行下插入一个新的行并将光标移至下一行）——我设置了Shift+Enter（和Android Studio一样），“删除行”（删除当前行，光标移动到右边）——Shift+Delete（不手动配置也能删除当前行，光标移动到左边）。

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

这里就在输入`str`​时可以自动补全成`String`​并将光标放置在后面（可以没有），在输入`sysin`​时补全成Scanner并可选调整变量名（不会自动引入Scanner）。这里还可以写好自动生成块注释，然后自动移动光标填充信息。

# 快捷操作篇

## 切换文件编码格式

右下角有一个UTF-8或GBK按钮，取决于当前的文件格式，点击可以显示重新打开或保存文件选项，可以按照目标格式打开或保存文件。但是请注意，如果当前无法正确显示文件字符，那么必须先以正确的编码显示文件才能重新保存文件，否则会出现问题。

## 选择语言模式

右下角在编码按钮旁边有一个语言按钮，显示取决于当前的文件使用的编程语言。点击可以手动选择以什么语言加载当前文件，适用于自动检测语言错误的情况。
