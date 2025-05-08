---
title: AdGuard HTTP内容过滤器
date: '2025-05-08 20:55:27'
updated: '2025-05-09 00:06:26'
tags:
  - Android
  - Windows
  - AdGuard
  - macOS
  - Browser
permalink: /post/2025/05/adguard-http-content-filter-z26qmgr.html
comments: true
toc: true
---



本文根据 [How to create your own ad filters | AdGuard Knowledge Base](https://adguard.com/kb/zh-CN/general/ad-filtering/create-own-filters/) 知识库写成。基本上是对知识库文章的翻译。不过因为目前（2025 年 05 月 08 日）还没将 Crowdin 的翻译应用到知识库中，所以是直接看着英文文本翻译的，部分地方的用语可能和翻译版本不同。如有出入请自行理解。



为了描述过滤规则的语法，AdGuard 使用了扩展的巴科斯范式（Augmented BNF）进行语法规范说明，但并不总是严格遵循这一规范。以下的代码块使用 `adblock` ​作为语言标识，但是基本上无法获得正确的语法高亮，只有少数编辑器支持显示这个语法高亮。

本文的目的是介绍如何编写自定义规则，如果想要编写订阅规则则请参阅相关文档（例如 AdGuard 基础过滤器、xingsf 过滤器等）。

本文中的表格会使用一些合并单元格，这是特定笔记软件的用法，可能无法在导出 md 中体现，如出现大量空白单元格等。表格中若含有排版错误请自行理解或反馈。

# 规则语法

## 注释

```adblock
! 这是注释
```

以 `!`​ 开头的行会被视为注释，效果与编程语言中一致。

## 规则的几个部分

### 基本组成部分

```adblock
||example.org^
|http://example.org/
@@||example.org/banner
```

其中，`||` ​是协议通配符，会匹配 `http://` ​和 `https://` ​协议，而 `|http://` ​只会匹配 `http://` ​协议，不对 `https://` ​协议生效。如果在规则前加上 `@@` ​则表明放行该规则（不屏蔽）。

后面的 `example.org` ​是匹配的域名，会对域名本身和子域名生效。（表格含有合并单元格）

|域名|匹配|不匹配|
| --------------------------------------| -----------------------------| --------------------------------------------|
|example.org<br />|example.org/ads.png|example.org.us/ads.png|
||subdomain.example.org/ads.png|example.com/redirect/http://ads.example.org/|

⚠️ **需要注意的是**：`|http://example.org` ​是一个**确切的**规则，==只会匹配== `http://example.org`​，而不会匹配 `http://example.org/ads.png`​。使用时务必注意。

​`^`​ 是分隔符字符。用于匹配符号或域名结尾。

### 过滤修饰符

```adblock
||example.org^$script,third-party,domain=example.com
```

后面的 `$` ​是修饰符分隔符，用于分隔地址和修饰符。

1. ​`script` ​匹配该域名中脚本请求
2. ​`third-party` ​匹配第三方请求
3. ​`domain` ​匹配来自 `example.com` ​的请求

个人理解：此规则会匹配来自 `example.com` ​的 `example.org/**/*.js` ​请求。

```adblock
@@||example.org^$document
```

​`document` ​是指对文档的请求。整个网页实际上是一个文档，如果想要屏蔽或取消屏蔽整个网页加载（`<html>` ​级别），需要使用 `document` ​修饰符。

上述规则用于取消对 `example.org` ​网页（文档）的屏蔽。这会使装饰规则（元素选择器）失效。

### 装饰规则（Cosmetic rule，元素选择器）

```adblock
example.org##.banner
```

如果想要屏蔽某个网页里面的某个特定元素，可以使用装饰规则（元素选择器）来进行精确的屏蔽。

1. 域名前面不能使用协议通配符（`||` ​或 `|`​）
2. 域名与装饰规则中间使用 `##` ​进行分隔
3. 元素选择器使用 CSS 语法

上述规则用于在 `example.org` ​中匹配含有 `.banner` ​类的元素。

常见的 CSS 选择器：（表格含有合并单元格）

|名称|CSS 选择器|表现|
| -------------------------------| -------------------------------| --------------|
|id|#theID|​`<div id="theID" />`​|
|class（类）|.class|​`<div class="class" />`​|
|属性<br />|div[class="banner"]|​`<div class="banner" />`​（全匹配）|
||a[href^="https://example.com/"]|​`<a href="https://example.com/ads.html">link text</a>`​（在开头）|
||div[at$="doc"]|​`<div at="xxxdoc" />`​（在结尾）|

# 基础规则

## 基础规则语法

```abnf
rule = ["@@"] pattern [ "$" modifiers ]
modifiers = [modifier0,modifier1...]
```

规则由 pattern 和 modifiers 组成，pattern 就是[⌈基本组成部分⌋](#20250508215328-epdwpao)，modifiers 就是[⌈过滤修饰符⌋](#20250508215347-7zf88up)。

## 特殊字符

|特殊字符|含义|用法|
| --------| ------------------| ----------------------------------------------------------------------------|
|​`*`​|通配符|可用于匹配任何字符，包括空字符|
|​`\|\|`​|协议通配符|可用于匹配 `http`​、`https`​、`ws`​、`wss` ​协议|
|​`^`​|分隔符标志|可以是任意符号，除 `_`​、`-`​、`.`​、`%`​，也可匹配地址结尾|
|​`\|`​|地址起始或结束标志|放在最前即为地址起始（类似正则中 `^`​），放在最后即为地址结束（类似正则中 `$`​）|

> ℹ️ 也可参阅 [the Adblock Plus filter cheatsheet](https://adblockplus.org/filter-cheatsheet#blocking) 了解更多内容。

## 正则表达式支持

> ⚠️ 使用正则表达式可能会 **极大拖慢运行速度** ！

```adblock
/banner\d+/$third-party
@@/banner\d+/$third-party
```

上述第一行规则会匹配所有第三方请求的 `banner\d+` ​内容，包括 `banner0`​、`banner134` ​等。

## 通配符使用

```adblock
example.*##.banner
```

上述规则会匹配所有含 `example` ​的域名中的 `.banner` ​元素，如 `example.com`​、`example.org`​、`example.com.cn` ​等。

```adblock
example.com/ads/*
```

上述规则会匹配所有 `example.com/ads` ​路径下的文件，包括 `example.com/ads/ad.jpg` ​和 `example.com/ads/showAD.js` ​等。

## 基础规则修饰符

以下表格含有合并单元格。具体说明请查看 [adguard.com/kb/zh-CN/general/ad-filtering/create-own-filters/#ba...](https://adguard.com/kb/zh-CN/general/ad-filtering/create-own-filters/#basic-rules-basic-modifiers)

|修饰符|含义|用法|
| -------------------------------| -----------------------------------------------| --------------------------------------------------------------|
|`$app`​<br />|匹配应用包名或进程名<br />|​`app=com.tencent.mm`​（安卓微信）`app=chrome.exe`​（Windows Chrome）|
|||​`app=~com.tencent.mm`​（除安卓微信以外所有应用）|
|||​`app=com.tencent.mm\|tv.danmaku.bili`​（安卓微信和安卓哔哩哔哩）|
|||​`app=~com.tencent.mm\|~tv.danmaku.bili`​（除安卓微信和哔哩哔哩）|
|​`$denyallow`​|反向匹配目标域|​`*$script,domain=a.com,denyallow=b.com` ​屏蔽 `a.com` ​的脚本，但是放行 `b.com` ​的脚本<br />与此相等：<br />`*$script,domain=a.com`​<br />`@@\|\|b.com$script,domain=a.com`​|
|`$domain`​<br />|匹配来自某域名<br />|​`\|\|block.com^domain=example.org` ​屏蔽 `example.org` ​对 `block.com` ​的访问|
|||​`\|\|block.com^domain=~example.org` ​屏蔽除 `example.org` ​对 `block.com` ​的访问|
|​`$header`​|匹配响应头|​`\|\|example.com^header=set-cookie:foo` ​匹配 `example.com` ​中含有 `Set-Cookie=foo` ​的响应|
|​`$important`​|提高规则重要性|​`\|\|example.com^$important`​（与 CSS 中含义一致）|
|​`$match-case`​|匹配大小写|​`*/BannerAd.gif$match-case` ​可匹配 `BannerAd.gif`​，但不能匹配 `bannerad.gif`​|
|`$method`​<br />|匹配请求方法<br />|​`\|\|evil.com^method=get\|head` ​可匹配对 `evil.com` ​的 `Get` ​和 `Head` ​请求|
|||可用值（可能不完整）：`get`​、`~get`​、`post`​、`~post`​、`head`​、`~head`​|
|​`$popup`​|关闭标签页|​`\|\|domain.com^$popup` ​将尝试关闭浏览器中 `domain.com` ​域名的标签页|
|​`$strict-first-party`​|限制第一方请求|​`\|\|domain.com^$strict-first-party` ​仅限制 `domain.com` ​的请求<br />访问 `domain.com/icon.ico` ​时：<br />`domain.com` ​会被阻止，而 `sub.domain.com` ​会被放行|
|​`$strict-third-party`​|限制第三方请求|​`\|\|domain.com^$strict-third-party` ​仅限制非 `domain.com` ​的请求<br />访问 `domain.com/icon.ico` ​时：<br />`domain.com` ​会被放行，而 `sub.domain.com` ​会被阻止<br />|
|​`$third-party`​|限制第三方和自定义请求|​`\|\|domain.com^$third-party` ​和浏览器中跨域访问范围一致，子域名可访问|
|​`$to`​<br />|限制目标域名<br />|​`\|\|ads$evil.com` ​匹配任何发往 `evil.com` ​的路径含 `/ads` ​的请求|
|||​`\|\|ads$evil.com\|~not.evil.com` ​匹配任何发往 `evil.com` ​的路径含 `/ads` ​的请求，但是 `not.evil.com` ​会不匹配|

## 内容类型修饰符

|修饰符|含义|用法|
| ------| ----------------------| -----------------------------------------------------------------------|
|​`$document`​|文档|​`\|\|a.com^$document` ​完全阻止对 `a.com` ​的访问，会显示一个阻止访问（AdGuard）页面，不匹配 `iframe`​|
|​`$font`​|字体|​`\|\|a.com^$font` ​阻止 `a.com` ​中字体请求|
|​`$image`​|图像|​`\|\|a.com^$image` ​阻止 `a.com` ​中图像请求|
|​`$media`​|媒体（音乐、视频等）|​`\|\|a.com^$media` ​阻止 `a.com` ​中媒体请求|
|​`$object`​|浏览器插件资源|​`\|\|a.com^$object` ​阻止 Java 或 Flash 等资源请求|
|​`$other`​|上面未列出的内容|​`\|\|a.com^$other` ​阻止以上未列出的内容|
|​`$ping`​|阻止浏览器中 ping 请求|​`\|\|a.com^$ping` ​阻止 `navigator.sendBeacon()` ​或 `<a ping>` ​中的 `ping` ​属性|
|​`$script`​|阻止脚本|​`\|\|a.com^$script` ​阻止 JavaScript、VBScript 等|
|​`$stylesheet`​|阻止样式表|​`\|\|a.com^$stylesheet` ​阻止 CSS 文件请求|
|​`$subdocument`​|阻止子文档的请求|​`\|\|a.com^$subdocument` ​阻止 `frame` ​和 `iframe` ​中对 `a.com` ​的请求|
|​`$websocket`​|阻止 WebSocket 请求|​`\|\|a.com^$websocket` ​仅应用于 WebSocket 连接|
|​`$xmlhttprequest`​|阻止 AJAX 请求|​`\|\|a.com^$xmlhttprequest` ​仅应用于 JavaScript 中 `XMLHttpRequest` ​元素|

## 例外规则修饰符

例外规则会禁用对应的基础规则，它们以 `@@`​ 开头。以下表格含有合并单元格。

|修饰符|内容|用法|
| -----------------------------| -------------------------------------------| ---------------------------------------------------|
|​`$content`​|禁用 HTML 过滤等|​`@@\|\|a.com^$content` ​禁用 `a.com` ​的所有内容类型修饰符|
|​`$elemhide`​|禁用装饰规则|​`@@\|\|a.com^$elemhide` ​禁用 `a.com` ​的所有装饰规则修饰符|
|`$extension`​<br />|禁用用户脚本<br />|​`@@\|\|a.com^$extension` ​禁用 `a.com` ​的所有用户脚本，可指定脚本名|
|||​`@@\|\|a.com^$extension="AdGuard Assistant"` ​在 `a.com` ​上禁用 AdGuard 助手扩展|
|​`$jsinject`​|阻止 JavaScript 注入|​`@@\|\|a.com^$jsinject` ​阻止 `a.com` ​上的 JavaScript 功能（MV3 中存在问题）|
|​`$stealth`​|禁用跟踪保护|​`@@\|\|a.com^$stealth=...` ​可在 `a.com` ​上禁用特定跟踪保护功能，具体见下表|
|​`$urlblock`​|禁用域名限制|​`@@\|\|a.com^$urlblock` ​可放行所有来自 `a.com` ​的请求|
|​`$genericblock`​|有点复杂，不写了|有点复杂，不写了|
|​`$generichide`​|||
|​`$specifichide`​|||

|​`$stealth` ​参数|AdGuard 跟踪保护选项|
| ---------| -----------------------|
|​`$stealth=searchqueries`​|隐藏搜索查询|
|​`$stealth=donottrack`​|发送 DNT 信号|
|​`$stealth=3p-cookie`​|删除第三方 cookie|
|​`$stealth=1p-cookie`​|删除第一方 cookie|
|​`$stealth=3p-cache`​|删除第三方缓存|
|​`$stealth=3p-auth`​|拦截第三方授权头|
|​`$stealth=webrtc`​|拦截 WebRTC|
|​`$stealth=push`​|拦截推送 API|
|​`$stealth=location`​|拦截定位 API|
|​`$stealth=flash`​|拦截 Flash|
|​`$stealth=java`​|拦截 Java|
|​`$stealth=referrer`​|对第三方隐藏 referrer|
|​`$stealth=useragent`​|隐藏 User-Agent|
|​`$stealth=ip`​|隐藏 IP 地址|
|​`$stealth=xclientdata`​|移除 X-Client-Data 头部|
|​`$stealth=dpi`​|保护免受 DPI 影响|

# 实际使用

现在以浏览器中 `www.bilibili.com/video/BV*`​ 为例，拦截视频下方的横幅广告和右侧的小广告。最近应该是B站在页面加载后插入广告，通过选择器屏蔽元素不能生效了，以下是浏览器扩展选择到的广告元素选择器。不过现在无法生效。

```adblock
! bilibili 视频播放页面广告
bilibili.com##.ad-floor-cover
bilibili.com##.slide-ad-exp
bilibili.com##.video-card-ad-small
```

‍
