---
title: AdGuard Android出站代理
date: '2025-05-07 21:55:52'
updated: '2026-01-20 22:05:11'
tags:
  - Android
  - AdGuard
  - DNS
permalink: /post/2025/05/adguard-android-outbound-proxy-1ad1jn.html
comments: true
toc: true
---



# 前言

通过 AdGuard 可以过滤广告，但是在未设置的情况下无法与代理应用共存。经过合适的设置之后，可以让 AdGuard 过滤广告，同时代理应用路由流量。

# 设置方法

以下列出的配置项名称和路径依应用、应用版本、操作界面等改变，请自行查找对应的设置项并进行相应设置。

以下配图为 AdGuard v4.10 Nightly 4 与 FlClash 0.8.84。也可选用 ClashMetaForAndroid，不过设置界面不会那么好看。如果想要稳定共存建议选择 ClashMetaForAndroid，FlClash 会遇到一些奇怪的问题。

## 无 root 模式

在没有 root 的情况下，AdGuard 只能使用 VPN 模式，与代理的 VPN 模式冲突。这部分操作是通用的。

这种情况下，根据 AdGuard 知识库所说，应该在 AdGuard 设置中启用代理（过滤-网络-代理），并且在其中新建一个代理，填入本地的代理地址（请注意端口）。

![过滤-网络-代理](https://res.emptylight.cn/share/img/2025/0a867892a68e31bb55ded1b65c1f6ecc.jpg "过滤-网络-代理")

之后在代理应用中关闭 VpnService（不占用系统 VPN 服务），并且检查是否能通过代理端口访问到代理（通过 AdGuard 代理设置检查），如有需要可启用代理应用中的局域网代理选项（通过局域网访问代理，本地访问应该不需要）。

![VpnService 关](https://res.emptylight.cn/share/img/2025/a8dfd4f5bfe9bda5f414e5ee2c861c36.jpg "VpnService关")

在需要通过代理访问网络时，确保目标应用在 AdGuard 设置中通过代理访问网络，随后启用代理应用和 AdGuard 过滤，在 AdGuard 设置或通知栏中启用代理。等待通知栏中 AdGuard 通知更新成『正在通过代理服务器访问网络』即可正常使用 AdGuard 和代理应用。

## 有 root 模式

在有 root 的情况下，AdGuard 可以不使用 VPN 过滤网络，因此可以不占用 VPN 服务，让代理应用使用手机 VPN 服务。

这种情况下，应当在 AdGuard 设置中将路由模式设置为自动代理（过滤-网络-路由模式，通过 HTTP 代理网络）。

![AdGuard 路由模式](https://res.emptylight.cn/share/img/2025/33950c3004179c40f8b3550b2d481698.jpg "过滤-网络-路由模式")

之后在 FlClash 中关闭 VPN 服务的系统代理（HTTP 代理），让 HTTP 代理由 AdGuard 处理，否则 AdGuard 过滤不会生效。ClashMetaForAndroid 只需要设置好 AdGuard 即可使用。

> 在 FlClash 中启用系统代理，AdGuard 中仍能看到访问记录，不过都是 tcp 连接，并且没有域名，不确定是否正常过滤。启用系统代理后 FlClash 性能提高，关闭系统代理后 FlClash 对连接的管理可能出现问题。感觉是 FlClash 对 Meta 内核进行的修改导致了一些问题。

![VPN 系统代理关闭](https://res.emptylight.cn/share/img/2025/05476454e8171d756e59fc52550390d2.jpg "VPN系统代理")

与无 root 模式不同，AdGuard 使用自动代理模式无需添加代理设置，可直接同时启用 AdGuard 过滤和代理应用，出站流量会自动通过 AdGuard 和代理应用。

> 仅 FlClash：但是如果启用了代理应用的访问控制，又无法在日志中看到 AdGuard 之外的连接日志，可以尝试为 AdGuard 开启代理功能，这样可以在代理应用中看到其他应用的请求日志。不开启 AdGuard 的代理功能不影响正常使用代理，但是可能导致访问控制不显示其他应用。不过实际用起来感觉没差。

## DNS 设置

如果在 AdGuard 中启用了 DNS 过滤，并且配置了 DNS 服务器，则可以启用代理应用中的 DNS 覆写，但是关闭 DNS 设置，交由 AdGuard 处理相关的 DNS 连接。这样可以避免在代理应用中重复配置相关设置项并导致潜在问题。

![VPN 覆写 DNS 开，使用系统 DNS](https://res.emptylight.cn/share/img/2025/ef0d453560fbe3f4ed2a0750efcd8f77.jpg "VPN覆写DNS")

以下列出两边的名词比较。

|代理应用名词|AdGuard DNS 设置名词|名词解释|
| ----------------------| -----------------------| ------------------------------------------------|
|默认域名服务器|低级设置-Bootstrap 上游|用于解析域名服务器地址的前置域名服务器|
|域名服务器|DNS 保护功能-DNS 服务器|解析域名所用的 DNS 服务器|
|回退服务器（Fallback）|低级设置-后备上游|在设置的 DNS 服务器不可用时使用的后备 DNS 服务器|

# 参考文献

[如何设置出站代理 | AdGuard Knowledge Base](https://adguard.com/kb/zh-CN/adguard-for-android/solving-problems/outbound-proxy/)

[设置 | AdGuard Knowledge Base](https://adguard.com/kb/zh-CN/adguard-for-android/features/settings/#routing-mode)
