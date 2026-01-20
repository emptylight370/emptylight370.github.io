---
title: 一种基于AdGuard的域名解析修改方法
date: '2025-04-14 21:05:09'
updated: '2026-01-20 22:04:18'
tags:
  - Android
  - Windows
  - AdGuard
  - DNS
  - macOS
permalink: >-
  /post/2025/04/a-domain-name-resolution-and-modification-method-based-on-adguard-1qztq.html
comments: true
toc: true
---



这个方法主要是为无法直接修改 hosts 文件的设备准备的，比如手机等设备。一般情况下无法在这类设备上直接或间接修改 hosts，但是有些东西还是写 hosts 才能生效，那么只好用 AdGuard 折中一下。

# 使用前提

1. 在设备上可以安装 AdGuard 并正常启动过滤。
2. AdGuard 的防护中可以启用 DNS 保护功能。
3. 可以自行修改 DNS 过滤器的用户过滤器。
4. 有一定的 hosts 文件编写知识。

根据 [DNS 过滤规则语法 | AdGuard DNS Knowledge Base](https://adguard-dns.io/kb/zh-CN/general/dns-filtering-syntax/) 内所提供的编写方法，可以使用 `/etc/hosts` ​语法（第二点），于是就可以使用用户规则让特定域名的 DNS 请求直接返回所写的 IP 地址。

# 编写方法

首先简单介绍一下 hosts 文件的语法，每行一个。

```plaintext
127.0.0.1 localhost # 后面是注释
```

前面是这个域名指向的 IP 地址，后面是对应的域名。而且可以将多个域名指向一个地址，只需要在域名之间使用空格隔开即可。

那么接下来就可以开始操作了。

1. 首先启用 AdGuard 过滤，并且启用 DNS 保护功能。
2. 根据 [DNS 过滤 | AdGuard DNS Knowledge Base](https://adguard-dns.io/kb/zh-CN/general/dns-filtering/#dns-%E8%BF%87%E6%BB%A4%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86%E6%98%AF%E4%BB%80%E4%B9%88) 所说的过滤原理，DNS 过滤是作用于全局的过滤规则，不需要将对应的应用添加到过滤列表中，所有 DNS 请求都会由 DNS 过滤器处理一遍。以下以 Arcaea 为例，在部分网络环境下 Cloudflare 的访问不太稳定。如果用类似 hosts 的方式固定一个访问效果好的 IP 则能大幅提升访问速度。
3. 根据 AdGuard 的过滤日志了解到 Arcaea 要访问的服务器域名，使用网络工具了解到对应域名在国内的解析地址，一般至少会有一个。如果出现多个 IP 就是使用了 CDN 或其他防护技术，可以选择一至多个 IP 写入过滤规则。一般以所在省份和所用网络运营商的解析结果优先。
4. 根据上一步选中的 IP 地址，按照 hosts 文件语法在 DNS 的用户过滤器中添加规则，注意每条规则只能有一个 IP 地址，一个域名指向多个 IP 地址需要添加多条规则。如果在 DNS 过滤器中添加多条指向同一域名的 IP 地址，则会在请求时返回所有启用规则的 IP 地址。具体的 IP 访问顺序由系统或应用程序决定，如果仍旧出现无法访问问题，可以查看过滤器日志中 DNS 请求顶部的 IP 地址，禁用对应规则后重试。
5. 按照上述方式添加规则并启用适当的规则之后，对于 AdGuard 启用过滤期间的 DNS 请求来说，这个域名就是指向写入的 IP 地址了。在过滤日志中可以看到，指向特定域名的 DNS 请求显示被拦截，所返回的 IP 地址就是启用规则中所写的 IP 地址。可以回到对应应用中再次尝试访问服务器。还是以 Arcaea 为例，现在就可以在原本无法登录的情况下登录成功，而不需要切换 WiFi/流量网络环境。

# 后续维护

根据你编写的规则不同，可能有多种情况。

1. 服务器指向一个 IP 地址，并且可以正常访问：无需检查。
2. 服务器指向一个 IP 地址，并且无法正常访问：重新查找服务器的地址，切换新的 IP。
3. 服务器指向多个 IP 地址，并且可以正常访问：定期检查所填写的 IP 地址是否仍在使用中，这一般是 CDN 服务中转的，有可能不同时段访问不同 CDN 服务器的速率不同。这种情况不建议写 hosts 指定域名解析。
4. 服务器指向多个 IP 地址，并且无法正常访问：检查是否是 CDN 服务改变了 IP 地址。这种情况不建议写 hosts 指定域名解析。
