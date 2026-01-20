---
title: 关于Directory Opus的一些分享
date: '2026-01-19 15:16:51'
updated: '2026-01-20 21:39:10'
tags:
  - Windows
  - Directory Opus
permalink: /post/some-sharing-about-directory-opus-29ghxa.html
comments: true
toc: true
---



下文中给出的按钮的代码，可以全选代码块复制之后到 dopus 粘贴，方法为右键工具栏 > 自定义，然后在工具栏上右键粘贴，会将按钮插入到下一个按钮处，也可以自行拖动。

# 按钮

## 工具栏按钮

### 在文件管理器中打开

![在资源管理器中打开](https://res.emptylight.cn/share/img/2026/239361afc1b4e59b4253f77a472e548d.png)

点击会在 Windows 的文件管理器中打开当前文件夹。从默认的菜单工具栏找到这个按钮，复制出来单独放着方便使用。

我自己是使用 Quicker 动作实现了从资源管理器跳转回 dopus 的方法，现在可以通过 dopus 跳转到资源管理器（使用系统分享菜单等），再通过 Quicker 跳转回 dopus（某些软件打开文件夹时固定调用 explorer.exe，需自行用 dopus 打开）。

默认工具栏里还藏着不少有用的小按钮，使用自定义工具栏的时候可以放出来到更顺手的地方。

### 在记事本中打开

![在记事本中打开](https://res.emptylight.cn/share/img/2026/b6789a89b6a63014448000a3e3eb9585.png)

默认在系统自带的记事本中打开文本文件。在卸载旧版记事本后系统无法自动调用新版记事本，故提供新版记事本打开方法。仅在选择 txt、json、yml、bat、ps1、conf 等文本文件时显示，可自行编辑修改。但是我现在几乎只用 VSCode 打开了，这个动作已经不用了。

```xml
<?xml version="1.0"?>
<button backcol="none" display="both" label_pos="right" textcol="none">
	<label>在记事本中打开</label>
	<icon1>/windows/notepad.exe,-2</icon1>
	<function type="normal">
		<instruction>@admin</instruction>
		<instruction>@filesonly</instruction>
		<instruction>@hidenosel:files,type=*.(txt|json|yml|bat|ps1|conf)</instruction>
		<instruction>notepad {filepath} </instruction>
	</function>
</button>
```

### 右键菜单

实现了两个下拉菜单分别显示非 Windows 应用添加的菜单和 Windows 应用添加的菜单。相当于是 Windows 11 默认的折叠菜单和展开菜单。因为加载完整的 Windows 右键菜单需要花较长时间，所以分开显示，一个菜单只显示自带功能，一个菜单只显示应用功能，再做成下拉菜单就能用左键触发，并且不会因为加载菜单卡住 dopus。

![PixPin_2026-01-19_23-10-48](https://res.emptylight.cn/share/img/2026/378eafc8cf478fb57afdc4127fa52669.png)

这是左边的 DOpus 菜单：

```xml
<?xml version="1.0"?>
<button backcol="none" display="both" label_pos="right" textcol="none" type="menu">
	<label>DOpus菜单</label>
	<icon1>#defaultmenu</icon1>
	<button backcol="none" display="both" label_pos="right" textcol="none">
		<label>右键菜单</label>
		<icon1>#newcommand</icon1>
		<function type="normal">
			<instruction>FileType CONTEXTMENU CONTEXTFORCE</instruction>
		</function>
	</button>
</button>
```

这是右边的 Windows 菜单：

```xml
<?xml version="1.0"?>
<button backcol="none" display="both" label_pos="right" textcol="none" type="menu">
	<label>Windows菜单</label>
	<icon1>#gostartmenu</icon1>
	<button backcol="none" display="both" label_pos="right" textcol="none">
		<label>右键菜单</label>
		<icon1>#newcommand</icon1>
		<function type="normal">
			<instruction>FileType CONTEXTMENU CONTEXTOPTIONS=windowsonly</instruction>
		</function>
	</button>
</button>
```

### 发送到菜单

![PixPin_2026-01-19_23-16-42](https://res.emptylight.cn/share/img/2026/aeb2ace729057afefba7d7479c5bd04b.png)

这个菜单哪里来的我忘了，有可能是自己写的。用途是显示系统的发送菜单，和 Windows 11 新加的分享菜单不是同一个，是旧的那个。点击展开下拉列表显示菜单。

```xml
<?xml version="1.0"?>
<button backcol="none" display="both" label_pos="right" textcol="none">
	<label>发送到</label>
	<tip>系统发送菜单</tip>
	<icon1>#shortcut</icon1>
	<function type="normal">
		<instruction>@hidenosel</instruction>
		<instruction>FileType SENDTOMENU </instruction>
	</function>
</button>
```

### 打开方式

![PixPin_2026-01-19_23-18-49](https://res.emptylight.cn/share/img/2026/02b2c98f61ebfb3bfe8251d9efab8eb2.png)

点击能够显示系统的打开方式选择菜单，也有可能是自己写的。

```xml
<?xml version="1.0"?>
<button backcol="none" display="both" label_pos="right" textcol="none">
	<label>打开方式</label>
	<tip>系统打开菜单</tip>
	<icon1>#prefs</icon1>
	<function type="normal">
		<instruction>@hidenosel:files</instruction>
		<instruction>@filesonly</instruction>
		<instruction>FileType OPENWITHMENU</instruction>
	</function>
</button>
```

## 地址栏按钮

这部分的按钮我放在地址栏，就是显示文件夹路径的那个地方。这部分只显示图标就够了，平时还要按条件隐藏。

![PixPin_2026-01-19_23-22-47](https://res.emptylight.cn/share/img/2026/823af756b317d1a0ae8d5b8d513f86eb.png)

### 选择上一个

在有选择文件、文件夹的时候将选中框上移，选中上一个文件、文件夹。不选中内容时隐藏。移动出屏幕显示范围的时候 dopus 需要等一下才会翻页过去。

```xml
<?xml version="1.0"?>
<button backcol="none" display="icon" label_pos="right" textcol="none">
	<label>选择上一个</label>
	<icon1>#copysourcedest_up</icon1>
	<function type="normal">
		<instruction>@hidenosel</instruction>
		<instruction>Select PREV</instruction>
	</function>
</button>
```

### 选择下一个

在有选择文件、文件夹的时候将选中框下移，选中下一个文件、文件夹。不选中内容时隐藏。移动出屏幕显示范围的时候 dopus 需要等一下才会翻页过去。

```xml
<?xml version="1.0"?>
<button backcol="none" display="icon" label_pos="right" textcol="none">
	<label>选择下一个</label>
	<icon1>#copysourcedest_down</icon1>
	<function type="normal">
		<instruction>@hidenosel</instruction>
		<instruction>Select NEXT</instruction>
	</function>
</button>
```

### 全选

就是全部选中。在选中全部文件、文件夹时隐藏。这个判断条件挺不好写，主要是之前不知道怎么用求值器函数，后来在某个小角落里面知道了是 `:=` ​形式，即下面的 `@hideif:=` ​后可用求值器函数，现在就能判断是否选中全部文件了。

```xml
<?xml version="1.0"?>
<button backcol="none" display="icon" label_pos="right" textcol="none">
	<label>全部选择</label>
	<icon1>#selectall</icon1>
	<function type="normal">
		<instruction>@hideif:=FileCount(&quot;*&quot;)==FileCount(true,&quot;*&quot;)</instruction>
		<instruction>Select ALL </instruction>
	</function>
</button>
```

### 反选

就是反向选中，将选择的变成没选择的，将没选择的变成选择的。未选中内容时隐藏。

```xml
<?xml version="1.0"?>
<button backcol="none" display="icon" label_pos="right" textcol="none">
	<label>反选</label>
	<icon1>#selectinvert</icon1>
	<function type="normal">
		<instruction>@hidenosel</instruction>
		<instruction>Select INVERT </instruction>
	</function>
</button>
```

### 取消选中

就是将全部选中取消。未选中内容时隐藏。

```xml
<?xml version="1.0"?>
<button backcol="none" display="icon" label_pos="right" textcol="none">
	<label>取消选择</label>
	<icon1>#selectnone</icon1>
	<function type="normal">
		<instruction>@hidenosel</instruction>
		<instruction>Select NONE </instruction>
	</function>
</button>
```

### 选择相似文件

这个按钮的功能是根据后缀名选择相同类型的文件，选中文件夹时会选择全部文件夹。dopus 内置提供这个函数可用，挺好的。选中多个文件时会根据所有后缀名选择相同类型文件。判断条件存在一点问题，我不能精细化处理各种情况，只能分为选择文件和不选择文件两种情况，所以使用时不要同时选中文件和文件夹，我也不知道会发生什么。

```xml
<?xml version="1.0"?>
<button backcol="none" display="icon" label_pos="right" textcol="none">
	<label>选择相似文件</label>
	<icon1>#advancedselect</icon1>
	<function type="normal">
		<instruction>@hidenosel </instruction>
		<instruction>@ifsel:files</instruction>
		<instruction>Select SIMILAR=trueext</instruction>
		<instruction>@ifsel:else</instruction>
		<instruction>Select ALLDIRS </instruction>
	</function>
</button>
```

## 如何查看默认工具栏按钮

在工具栏上面右键打开自定义窗口，然后切换到自定义页签。

![PixPin_2026-01-20_21-18-51](https://res.emptylight.cn/share/img/2026/0113e884c63767182f93d804785724a0.png)

![PixPin_2026-01-20_21-19-26](https://res.emptylight.cn/share/img/2026/f2a5f279a3793a1c84868d82fdf0f1e4.png)

# 文件信息列

## 显示思源标题

能够显示思源笔记本、文档的标题，直接在文件系统中知道这个文件夹、文件是什么。我使用的是这个脚本：[在 Directory Opus 中显示思源笔记数据库 json 文件的数据库名称 - 链滴](https://ld246.com/article/1754370950207?r=EmptyLight)，对正则表达式做了一些修改，详情如下。

1. 首先在首选项/文件夹/文件夹格式中，添加这两条正则表达式：

   ![PixPin_2026-01-19_23-38-22](https://res.emptylight.cn/share/img/2026/3511d085170d7dadd4aafdaa79f8e0a9.png)

   ```plaintext
   .*\\data\\\d{14}-\w{7}
   .*\\data\\storage\\av
   ```
2. 在添加过程中将脚本拖入合适的位置，保存。（在左侧的脚本那里，展开就能找到）
3. 在左侧的导航那里去到文件夹格式/自动格式化，将自动格式化的开关打开。或者不打开也行，后面讲手动添加方法。
4. 挨个打开工作空间，打开 data 文件夹，对上面的列名右键，点击编辑文件夹格式，将脚本拖入合适的位置，保存。
5. 现在能够让 dopus 自动记住这些文件夹的信息列设置，如果前面不使用自动格式化方法，就按下面的步骤来。
6. 在首选项/文件夹/文件夹格式中，添加路径格式，挨个选中所有工作空间中的 data 文件夹，添加并设置格式。
