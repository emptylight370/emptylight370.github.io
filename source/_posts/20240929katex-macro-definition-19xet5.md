---
title: 思源KaTex宏定义
date: '2024-09-29 21:10:57'
updated: '2024-09-29 22:00:40'
permalink: /post/20240929katex-macro-definition-19xet5.html
comments: true
toc: true
---



# 2024-09-29KaTex宏定义

今天知道了怎么定义KaTex宏定义，可以通过js定义所需的替代名和转换的公式内容。

使用`#1`​、`#2`​可以替换掉对应位置的参数，比如`\f:\frac{#1}{#2}`​就是`\f{1}{2}`​，显示为$\frac{1}{2}$。

具体的配置方式是用json函数配置，表现为

```json
{
    "\\array": "\\begin{array}{lr}#1\\end{array}"
}
```

就可以使用一个`\array{....}`​来编写一个数组，里面写

```latex
\array{
x+y&=&8\\
2x-y&=&4
}
```

会自动展开为

```latex
\begin{array}{lr}
x+y&=&8\\
2x-y&=&4
\end{array}
```

搭配上`\left\right`​使用效果为

$\left\{\array{x+y&=&8\\2x-y&=&4}\right.$  

思源内显示效果为

$\left\{ \begin{array}{lr} x+y&=&8\\ 2x-y&=&4 \end{array} \right.$  

目前需要注意的问题：

不会将宏定义替换原有内容，之前就有反馈过类似问题[用 KaTex 宏定义输入的公式在导出 Markdown 或 PDF 时都出错 - 链滴 (ld246.com)](https://ld246.com/article/1662167096777)，但是后来发现实现不如预期[v3.0.15 KaTeX 宏展开仍然存在问题 - 链滴 (ld246.com)](https://ld246.com/article/1716267029070)，又暂时移除了这个功能。现在导出是不能显示宏定义的。

所以现在导出会红色报错。
