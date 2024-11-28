---
title: JS的高级操作
date: 2023-08-20T23:21:13Z
lastmod: 2023-08-21T14:25:20Z
tags:
  - JavaScript
  - Browser
---


## 复制文本或其他内容到剪切板

对剪切板的操作使用 `navigator` ​进行，这个操作不会立即执行，而是会生成一个 `promise` ​对象，具体的操作由浏览器异步执行，返回结果到 `promise` ​对象中。

```js
// 写入文本到剪切板
navigator.clipboard.writeText(text);
// 写入其他内容到剪切板
navigator.clipboard.write(object);
// 读取剪切板的文本
var text = navigator.clipboard.readText();
// 读取剪切板的内容
var object = navigator.clipboard.read();
```

如果想要根据结果做出相应的操作，就需要使用 `.then()` ​来获取返回的结果。结构为 `.then(successed funtion, failed function)`​，内部放置的是 `function` ​块，最好使用 `function() {}` ​包裹代码块。

```js
navigator.clipboard.writeText(text).then(function() {alert("success");}, function() {alert("failed");});

// 对这个结构进行展开则是
navigator.clipboard.writeText(text).then(
    function() {alert("success");}, //success
    function() {alert("failed");} //failed
);
```

在浏览器执行操作之前最好使用 `premission` ​获取权限，但是文档讲的不明不白的，不会。

## 在页面内通过 JS 设置一个通知

```js
// 设置通知的函数，其中的参数分别是：显示的消息，通知状态(success/fail)，持续时间(ms)
function notification(message, state, duration)
{
    // 创建一个div来显示消息
    var notification = document.createElement('div');
    // 内部显示的文字内容
    notification.textContent = message;
    // 通过style属性进行显示位置设定
    // 固定显示位置，方便下面调整位置
    notification.style.position = 'fixed';
    // 距离顶部距离
    notification.style.top = '10px';
    // 距离右部距离，此处的calc(49%)不能完全居中，需要调整
    notification.style.right = 'calc(49%)';
    // 忘记是什么参数了
    notification.style.padding = '10px';
    // 根据传入的状态来显示背景，达成不同通知效果
    if (state == "success")
        notification.style.backgroundColor = 'white';
    else if (state == "fail")
        notification.style.backgroundColor = 'yellow';
    // 边框
    notification.style.border = '1px solid black';
    // 曲角
    notification.style.borderRadius = '5px';
    // 显示在屏幕上，直接添加到body内，成为body的子元素
    document.body.appendChild(notification);
    // 设置一个定时器来移除子元素，持续时间为输入的时间
    setTimeout(function ()
    {
        document.body.removeChild(notification);
    }, duration);
}
```

## 通过 Base64 进行加解密

js 中内置有一个 Base64 的方法，但是只支持 AscII 字符转换，这个肯定不够用，但是还是记录如下

```js
// 加密
var inputText=document.getElementById("input").value;
var outputText=btoa(inputText);

// 解密
var inputText=document.getElementById("input").value;
var outputText=atob(inputText);
```

通过引入 [js-base64](https://www.npmjs.com/package/js-base64) 库的方法，我们可以支持任意字符的 Base64 加解密

```html
<!-- 通过网络引入所需资源 -->
<script src="https://cdn.jsdelivr.net/npm/js-base64@3.7.5/base64.min.js"></script>
```

```js
// 在js中使用js-base64
// 加密
var inputText=document.getElementById("input");
var outputText=Base64.encode(inputText);

// 解密
var inputText=document.getElementById("input");
var outputText=Base64.decode(inputText);
```
