---
title: rime输入法配置
date: '2024-12-26 14:56:52'
updated: '2024-12-27 19:55:29'
tags:
  - Android
  - Windows
  - macOS
  - Rime
permalink: /post/rime-input-method-configuration-z1snn.html
comments: true
toc: true
---



rime输入法的配置过程真是难以理解，并且其中充斥着许多数不胜数的坑。要一点点细品之后才能理解到底如何配置。



安装输入法的过程就是下载前端界面然后安装的过程。在[RIME | 中州韻輸入法引擎](https://rime.im/ "RIME | 中州韻輸入法引擎")下载当前系统可用的前端界面，然后安装。

在Windows的输入法叫做小狼毫，安卓的输入法我选用了小企鹅输入法。小企鹅输入法额外要求下载rime插件。

安装好之后就可以开始配置。

# 输入法配置

[Rime 配置：雾凇拼音](https://github.com/iDvel/rime-ice)

[oh-my-rime薄荷输入法](https://github.com/Mintimate/oh-my-rime)

## 电脑配置

根据上述的两个仓库可以了解配置输入法的基本内容，并且结合两个仓库的内容就可以得到一个很好的配置。这里的配置基底是薄荷输入法，结合前面从雾凇拼音了解到的知识，可以很快地获得这样一个default.custom.yaml文件。

```yml
customization:
  distribution_code_name: Weasel
  distribution_version: 0.16.3
  generator: "Rime::SwitcherSettings"
  modified_time: "Thu Dec 26 14:04:54 2024"
  rime_version: 1.11.2
patch:
  schema_list:
    - {schema: double_pinyin_flypy}
    - {schema: rime_mint_flypy}
  menu/page_size: 9
  ascii_composer/switch_key/Caps_Lock: clear
  ascii_composer/switch_key/Shift_L: noop
  ascii_composer/switch_key/Shift_R: noop
  ascii_composer/switch_key/Control_L: commit_code
  ascii_composer/switch_key/Control_R: commit_code
  key_binder/select_first_character: "minus"
  key_binder/select_last_character: "equal"
  key_binder/bindings:
    # Tab / Shift+Tab 切换光标至下/上一个拼音
    - { when: composing, accept: Shift+Tab, send: Shift+Left }
    - { when: composing, accept: Tab, send: Shift+Right }
    # Option/Alt + ←/→ 切换光标至下/上一个拼音
    - { when: composing, accept: Alt+Left, send: Shift+Left }
    - { when: composing, accept: Alt+Right, send: Shift+Right }
    # 翻页 , .
    - { when: paging, accept: comma, send: Page_Up }
    - { when: has_menu, accept: period, send: Page_Down }
    # 翻页 [ ]  ⚠️ 开启时请修改上面以词定字的快捷键
    - { when: paging, accept: bracketleft, send: Page_Up }
    - { when: has_menu, accept: bracketright, send: Page_Down }
    - { when: always, toggle: ascii_punct, accept: Control+period }     # 切换中英标点
    # 将小键盘 0~9 . 映射到主键盘，数字金额大写的 Lua 如 R1234.5678 可使用小键盘输入
    - {accept: KP_0, send: 0, when: composing}
    - {accept: KP_1, send: 1, when: composing}
    - {accept: KP_2, send: 2, when: composing}
    - {accept: KP_3, send: 3, when: composing}
    - {accept: KP_4, send: 4, when: composing}
    - {accept: KP_5, send: 5, when: composing}
    - {accept: KP_6, send: 6, when: composing}
    - {accept: KP_7, send: 7, when: composing}
    - {accept: KP_8, send: 8, when: composing}
    - {accept: KP_9, send: 9, when: composing}
    - {accept: KP_Decimal, send: period, when: composing}
    # 将小键盘 + - * / 映射到主键盘，使计算器 如 1+2-3*4 可使用小键盘输入
    - {accept: KP_Multiply, send: asterisk, when: composing}
    - {accept: KP_Add,      send: plus,     when: composing}
    - {accept: KP_Subtract, send: minus,    when: composing}
    - {accept: KP_Divide,   send: slash,    when: composing}
```

这里将输入法的切换改成了习惯的Ctrl，并且结合了雾凇拼音的一些快捷键映射，现在更像是微软输入法了。

之后是weasel的自定义文件。这里用到的`app_options/+`​是在列表后面附加内容。

```yml
customization:
  distribution_code_name: Weasel
  distribution_version: 0.16.3
  generator: "Weasel::UIStyleSettings"
  modified_time: "Thu Dec 26 14:05:06 2024"
  rime_version: 1.11.2
patch:
  show_notifications: false
  style/candidate_list_layout: linear
  style/horizontal: true
  style/inline_preedit: true
  app_options/+:
    cmd.exe:
      ascii_mode: true
    conhost.exe:
      ascii_mode: true
    windowsterminal.exe:
      ascii_mode: true
    wt.exe:
      ascii_mode: true
    pwsh.exe:
      ascii_mode: true
    powershell.exe:
      ascii_mode: true
    starward.exe:
      ascii_mode: true
    bh3.exe:
      ascii_mode: true
    code.exe:
      ascii_mode: true
```

这里只是关掉了切换时的通知显示，因为已经有inputtip了。之后将输入切换成横排，添加了雾凇拼音的几个默认英文的应用，自己补充了一点。

但是需要注意的是，在薄荷输入法的配置中，如果想要调整候选框的选项个数，还需要对使用的输入法进行设置，例如：

```yml
patch:
  menu/page_size: 9
  # 语言模型
  "grammar/language": amz-v3n2m1-zh-hans
  "grammar/collocation_max_length": 5
  "grammar/collocation_min_length": 2
  # translator 内加载
  "translator/contextual_suggestions": true
  "translator/max_homophones": 7
  "translator/max_homographs": 7
```

这里同样将候选项设置成9。

## 手机配置

在手机上配置倒是简单了，只需要将电脑的配置文件复制过去，然后重新构建一下就可以使用了。这里因为安卓的限制，推荐使用可以访问Android/data的文件管理器。

之后只需要通过应用里的设置调一下外观，默认输入方法之类的，就可以了。

同时手机上还有一个雨燕输入法可以选用。

# 输入法同步

基于rime的输入法都可以生成一个sync文件夹，在里面可以自行同步不同设备的配置，还能同步各设备的输入短语。这里因为安卓的权限设置，建议使用能够访问到data目录的同步软件。这里使用可用root的FolderSync Pro。电脑端使用的是GoodSync。只要将两边都连上同样的目录就可以将双方同步。

输入法会读取sync文件夹中的数据作为自己的词库的补充。

# 注意事项

## 符号表

输入法有一个`punctuator:`​属性这里会引入一个符号表，这里定义的符号是键盘上的符号实际打出来的符号，有些会直接上屏，有些会给出选择可以选中一个符号上屏。

我这里选择使用雾凇的符号表来配合薄荷自带的输入法符号表，这样子对输入符号造成的困扰比较小。也就是把雾凇的大写V符号表复制过来配合原有的全角和半角字符表。

这里为了让雾凇的方案生效需要覆写一下属性（在双拼的补丁中写入）：

```yml
patch:
  punctuator:
    full_shape:
      __include: default:/punctuator/full_shape  # 从 default.yaml 导入配置
    half_shape:
      __include: default:/punctuator/half_shape  # 从 default.yaml 导入配置
    symbols:
      __include: symbols_caps_v:/symbols         # 从 symbols_caps_v.yaml 导入配置
  recognizer/patterns/punct: "^V([0-9]|10|[A-Za-z]+)$"    # 响应 symbols_caps_v.yaml 的 symbols
```

上面是双拼的V方案，如果是全拼需要覆写的就是不大写的方案了。即：

```yml
patch:
  punctuator:
    full_shape:
      __include: default:/punctuator/full_shape  # 从 default.yaml 导入配置
    half_shape:
      __include: default:/punctuator/half_shape  # 从 default.yaml 导入配置
    symbols:
      __include: symbols_v:/symbols              # 从 symbols_v.yaml 导入配置
  recognizer/patterns/punct: "^v([0-9]|10|[A-Za-z]+)$"    # 响应 symbols_v.yaml 的 symbols
```

‍
