---
title: 使用KeepassXC接管ssh密钥
date: '2026-05-23 14:41:17'
updated: '2026-05-23 15:28:08'
tags:
  - Windows
  - GitHub
  - macOS
  - Linux
permalink: /post/2026/05/using-keepassxc-to-take-over-ssh-keys-z1hbaxh.html
comments: true
toc: true
---



KeepassXC 提供 ssh agent 集成功能，可以将 ssh 的私钥保存到密码库中保管。文档见 [https://keepassxc.org/docs/KeePassXC_UserGuide#_ssh_agent_integration](https://keepassxc.org/docs/KeePassXC_UserGuide#_ssh_agent_integration)。

下文仅对 Windows 的配置做讲解，Windows 版本为 Windows 11 25h2，最低需要 Windows 的 1809 更新。

## 启用 ssh agent

1. 按下 <kbd>CTRL</kbd>​+<kbd>SHIFT</kbd>​+<kbd>ESC</kbd> ​打开任务管理器
2. 切换到服务
3. 点击打开服务按钮
4. 找到 OpenSSH Authentication Agent(ssh-agent)服务
5. 右键点击属性
6. 将启动类型切换到自动
7. 并且启动服务

如果自行使用命令行启动服务，此服务的名称为 ssh-agent。

## 配置 KeepassXC

1. 打开 KeepassXC
2. 点击设置按钮
3. 切换到 SSH 代理页签
4. 选中启用 SSH 代理集成
5. 选择使用 OpenSSH
6. 点击确定保存

重新打开设置页之后，应能看到 SSH 代理连接工作正常。如显示连接失败，则自行检查并重复上述操作。

现在将 ssh 密钥添加到密码库中。

1. 解锁 KeepassXC 数据库
2. 新建条目
3. 切换到高级页签，将私钥文件作为附件添加到数据库中，如有密码，将密码填入此条目的密码中
4. 切换到 SSH 代理页签，在私钥部分使用附件，选中刚才上传的私钥文件
5. 点击确定保存

现在成功将私钥添加到 KeepassXC 中保存，并且能够将私钥添加到系统中使用。目前处于未自动配置状态，需要手动右键此条目向 SSH 代理添加密钥以及移除密钥。如果想要打开数据库时自动添加密钥，则选中“在打开或解锁数据库时，向代理添加密钥”选项；如果想要在关闭数据库时自动移除密钥，则选中“数据库管理或锁定时，从代理中删除密钥”选项。这两个选项可以单独开关。

在 Windows 上，**不要**选中请求用户确认选项，会报错。

## 配置 Git for Windows

Git for Windows 默认使用内置的 OpenSSH，不支持 Windows 预装的 ssh-agent，需要在安装时选择“Use External OpenSSH”选项。可以直接下载最新版的安装包更新或覆盖安装。更新设置后应能正确使用 Windows 的 ssh-agent 服务。需要注意，至少需要将 ssh 密钥添加到 ssh agent 中一次，不然 ssh agent 中不存在任何密钥，也就无法连接远程服务器。

## 配置完成后的注意事项

在确认 ssh-agent 工作正常后，可以从磁盘上删除私钥文件与公钥文件。之后在使用 ssh 时只需要确保 ssh agent 中存在密钥即可。至于怎么存在密钥则根据先前的设置决定，可能是手动添加，也可能是解锁数据库自动添加。如果设置了自动移除密钥，则注意使用前先添加一下密钥，Windows 的 ssh agent 不会请求 KeepassXC 添加密钥。

如果需要使用公钥，可以在条目的 SSH 代理部分将公钥复制到剪贴板。
