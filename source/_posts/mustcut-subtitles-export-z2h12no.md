---
title: 必剪字幕导出
date: '2025-02-23 19:39:46'
updated: '2025-02-23 19:56:23'
tags:
  - Windows
permalink: /post/2025/02/mustcut-subtitles-export-z2h12no.html
comments: true
toc: true
---



印象里一直有必剪字幕导出工具，今天花时间找了一下，写点东西备忘。

必剪的字幕保存在设置的草稿保存位置里面，文件夹名称是 UUID，在 2.0 之后更新成了 JSON 文件。

下面是几个工具和简单的描述，还没有把字幕拖进去导出，所以不确定描述是否有误。

[B 站必剪字幕导出 - 字幕工具箱](https://zm.i8k.tv/bcut)：可以简单预览字幕，并且支持去除、替换部分内容。

[u2sb/Bcut2Srt: Bcut export subtitle as srt 必剪导出 srt 字幕工具](https://github.com/u2sb/Bcut2Srt)：用 Visual Studio 写的.NET 程序，已经打包成了 exe 文件，需要.NET 6.0 运行环境。只需要将 JSON 文件拖到 exe 文件上就可以导出。

[必剪字幕导出 srt ass vtt 字幕 - 猫叔星球](https://maoshu.fun/bcut)：就是简单的导出功能，格式可选比较多，不支持预编辑。

[ganlvtech/bcut-srt-ass: 必剪字幕导出 srt ass 字幕](https://github.com/ganlvtech/bcut-srt-ass)：就是很简单的导出功能，看起来似乎因为开源成了许多站点使用的方案，好一点的会写个 CSS，随便一点的就直接放上来。GitHub Pages 托管地址为：[必剪字幕导出 srt ass 字幕](https://ganlvtech.github.io/bcut-srt-ass/)。
