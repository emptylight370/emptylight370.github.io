---
title: 博客中使用沉浸式翻译
date: '2025-01-20 21:07:07'
updated: '2026-01-20 22:08:32'
tags:
  - JavaScript
  - Browser
permalink: /post/2025/01/use-immersive-translation-in-blogs-z1m6lf2.html
comments: true
toc: true
---



之前在最开始的时候，申报的是双语站点。也考虑过使用 [Docusaurus](https://docusaurus.io/zh-CN/)，这个可以按不同语言显示不同的文章。不过后来选用 [Hexo](https://hexo.io/) 建立博客之后，因为只有一个页面，再显示双语有点不合适了。此外，要我把文章统统翻译成英文显然有点为难我了。现在不上课不考四六级，再干这种活真的很累。我连[思源主题](https://github.com/emptylight370/siyuan-vscodelite-edit)的多语种翻译大多都是直接用工具翻译，再一点点逐字翻译不是我的风格了。

正好折腾沉浸式翻译呢，看到文档里面有个 [JS SDK](https://immersivetranslate.com/zh-Hans/docs/js-sdk/)，就考虑将沉浸式翻译直接整个作为插件引入到博客里面，让读者自己翻译网页。沉浸式翻译给出的翻译器选项和翻译语言都非常丰富，正好省了我的事。注意，沉浸式翻译最近更新了 js SDK，最新地址需要联系客服接入，目前网站已经弃用沉浸式翻译。

# 引入插件

我使用的是 Hexo 的主题 [ikeq/hexo-theme-inside](https://github.com/ikeq/hexo-theme-inside)，里面有一个插件功能，可以在多个位置插入插件，语法支持 `<scripts>`。这样，我通过在 header 底部加入沉浸式翻译的 js 引用，成功导入了沉浸式翻译。目前最新地址需要联系沉浸式翻译客服接入，文档中地址已无法访问。

```js
<script
  async
  src="https://download.immersivetranslate.com/immersive-translate-sdk-latest.js"
></script>
```

# 配置沉浸式翻译

导入沉浸式翻译之后，我尝试了默认的翻译选项，翻译的范围不如我意，正好前面有过配置沉浸式翻译的经验，就着文档直接开写。

```js
<script>
  window.immersiveTranslateConfig = {
    pageRule: {},
  };
</script>
```

这个是默认的配置，在引入 js 前需要先定义好。

1. 首先使用 `selectors` ​定义翻译范围，这里选定了文章标题、文章正文和分类的名称。

    1. 这里发现 inside 主题的元素类名真是奇奇怪怪的，居然在里面包含了一个 $\phi$，不过都是直接复制的，不管了
2. 接着用 `translationClasses` ​为翻译文本添加类名，这里选用一个简单不重复的类名就好了。
3. 之后通过 `injectedCss` ​添加样式，就是为翻译文本添加一个下划线，简单的 CSS 不在此叙述。
4. 后面测试发现这个翻译会把图片也翻译一遍，因为懒得调整正文的选择器，于是就地选用 `excludeSelectors` ​排除了图片。后面调整的时候附加了 `excludeTags`。

定义翻译规则就是如此，整个过程非常简单。需要的工作量也很小。不过有值得注意的地方：排除的选择器可能默认有一个 `.notranslate` ​排除了声明不翻译的类，如果直接整体覆盖的话需要注意加上。这里建议排除选择器都选用附加而不是覆盖。

# 使用沉浸式翻译

要使用沉浸式翻译非常简单，只需要一个未启用沉浸式翻译插件的浏览器即可。正常打开网页之后就能在页面中看到沉浸式翻译的小按钮，打开设置调整选项即可。这下就能非常简单地将博客从中文翻译成多种语言了，还不需要担心翻译之后的效果。

‍
