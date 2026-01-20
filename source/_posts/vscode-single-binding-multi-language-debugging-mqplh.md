---
title: VSCode单键绑定多语言调试
date: '2024-11-20 13:33:24'
updated: '2026-01-20 22:10:29'
permalink: /post/2024/11/vscode-single-binding-multi-language-debugging-mqplh.html
comments: true
toc: true
tags:
  - VSCode
---



VSCode的快捷键功能十分强大，合理设置可以实现许多强大的效果。

比如本文要说的单键绑定多语言调试功能。在本文的介绍中，使用`F5`​快捷键来进行调试，使用`F6`​快捷键来运行而不调试。通过设置，可以让`F5`​根据当前使用的语言来自动匹配调试插件，比如C/C++下自动使用C/C++插件来调试，在Java下自动使用Debugger for Java进行调试。

# 安装调试插件

根据你所用的语言，自行安装所需使用的调试插件，这里选用微软提供的C/C++插件和Debugger for Java插件来分别进行C/C++和Java的调试。

# 设置快捷键

## 找到命令

首先打开快捷键设置面板（左下角设置-键盘快捷方式），或者快捷键绑定的`JSON`​文件（`F1`​或`Alt+Shift+P`​呼出命令面板，随后搜索“键盘快捷方式”或“Keyboard”，打开“首选项：打开键盘快捷方式（JSON）”选项，英文描述为“Preferences: Open Keyboard Shortcuts(JSON)”）。

这里什么设置方式都可以，但是我推荐快捷键面板进行配置，因为这里可以搜索命令名称进行配置，下文的介绍以设置面板为主。

在打开设置面板之后，在上面的搜索面板可以搜索想要调整命令的名字。这里的命令名字可在对应语言上的运行按钮查看。比如C/C++插件提供的运行命令的名字分别为`Debug C/C++ File`​和`Run C/C++ File`​。在设置面板上的搜索框输入这两个名字，就可以搜索出对应的命令。

## 设置键绑定

现在，为C/C++的调试命令双击或右键设置键绑定，输入你要使用的按键，本文里使用`F5`​。

在输入完成之后，右键命令，选择“更改When表达式”，输入以下命令：`editorTextFocus && (editorLangId == 'c' || editorLangId=='cpp') && inDebugMode == false`​。这里的`()`​是不能直接出现在表达式里的，VSCode会自动进行转码，所以显示出来的表达式会是展开之后的效果。这时候不需要再次修改它，只要你输入时没有问题就可以正常运行。而JSON文件里记录的表达式不会进行展开。

这里的When表达式的语法和C里if条件的语法一致。`&&`​表示与，`||`​表示或，需要用`()`​来包裹必要的部分来让表达式正常工作。这里的`editorTextFocus`​是聚焦编辑器，`editorLangId`​是编辑器中语言，`isDebugMode`​是是否处于调试状态。不管在设置面板里还是在JSON文件里都有自动补全，不过面板里的自动补全没有注释提示，在JSON文件里的自动补全有注释提示。

之后如法炮制，设置好C/C++的快捷键，本文使用`F6`​。之后输入When表达式，具体内容不变。设置Java的调试和运行的快捷键，设置的快捷键仍然是调试使用`F5`​，运行使用`F6`​。When表达式将语言由C改为Java，具体表达式命令为：`editorTextFocus && editorLangId == 'java' && inDebugMode == false`​。如果要设置其他语言的表达式也是将`'java'`​继续设置为其他语言。

## 设置完成后的JSON代码

在使用上述方法设置完成之后，在快捷键的JSON文件里可见完整的配置信息，我这里直接贴出这里设置好之后显示的配置，如果使用JSON文件配置方法可以参考。

```json
{
    "key": "f5",
    "command": "C_Cpp.BuildAndDebugFile",
    "when": "editorTextFocus && (editorLangId == 'c' || editorLangId=='cpp') && inDebugMode == false"
},
{
    "key": "f5",
    "command": "java.debug.debugJavaFile",
    "when": "editorTextFocus && editorLangId == 'java' && inDebugMode == false"
},
{
    "key": "f6",
    "command": "C_Cpp.BuildAndRunFile",
    "when": "editorTextFocus && (editorLangId == 'c' || editorLangId == 'cpp') && inDebugMode == false"
},
{
    "key": "f6",
    "command": "java.debug.runJavaFile",
    "when": "editorTextFocus && editorLangId == 'java' && inDebugMode == false"
},
```

# 使用快捷键

在设置完成之后，就可以使用快捷键了。这里假定你已经设置好了`launch.json`​和`tasks.json`​，能够正常启动调试。那么现在打开一个C语言文件或C++文件，写下代码，按下`F5`​进行调试。之后打开Java文件，写下代码，按下`F5`​进行调试。现在两边的调试插件应该会正确地运行。

# 调试控制台的设置

先前的配置过程中，你应该从别人那里抄到了可用的`tasks.json`​，但是现在使用中还有一点困惑。比如每次调试都有一个任务终端输出并且要求你按任意键关闭，或者手动切换到运行终端。这个终端每次运行都要弹出，显然会造成不便，这里可以通过配置`tasks.json`​来关闭这个终端。

首先，为每一个task新增一个`"presentation"`​配置，VSCode会自动补全。这里将`"reveal"`​设置为`"silent"`​，将`"close"`​设置为`"true"`​。配置好的`"presentation"`​配置如下：

```json
"presentation": {
    "echo": true,
    "reveal": "silent",
    "focus": false,
    "panel": "shared",
    "showReuseMessage": true,
    "clear": false,
    "close": true
}
```

我先前的`tasks.json`​中有两个C/C++任务，为每一个任务添加了配置项之后就可以关闭每次调试时显示的任务终端。
