---
title: WSL2安装及使用
date: '2025-07-17 13:25:32'
updated: '2025-07-17 20:16:38'
tags:
  - Windows
  - Linux
permalink: /post/2025/07/installation-and-use-of-wsl2-wfjlg.html
comments: true
toc: true
---



因为电脑出问题需要重装，一些环境也需要相应的重装。以下是 WSL2 的安装部分。

## 安装

通过[安装 WSL | Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/wsl/install) 文章，可以明确了解到：在 PowerShell 中支持直接通过 `wsl` ​命令访问相关的应用，即便**还未安装 WSL2**。

这里使用的系统版本为 Windows 11 24h2，如果版本过低可能需要参阅[适用于旧版本的 WSL 手动安装步骤](https://learn.microsoft.com/zh-cn/windows/wsl/install-manual)一文。

推荐的做法是：

1. 通过管理员权限运行一个终端
2. 在终端中运行如下命令

    ```powershell
    wsl --install
    # 或者使用 wsl.exe
    ```
3. 等待安装完成

这里我进行的步骤为：

1. 运行一个终端
2. 在终端中输入如下命令：`wsl --list`​
3. 随后终端提示：

    ```powershell
    未安装适用于 Linux 的 Windows 子系统。可通过运行 “wsl.exe --install” 进行安装。
    有关详细信息，请访问 https://aka.ms/wslinstall

    按任意键安装适用于 Linux 的 Windows 子系统。
    按 CTRL-C 或关闭此窗口以取消。
    ```
4. 此时按下任意键开始安装 WSL2,注意需要管理员权限。
5. 等待安装完成

## 使用

在安装完成之后，默认的 WSL2 是没有可用发行版的。一般需要自己安装几个。以下的命令行一般均可以使用 `wsl.exe` ​代替 `wsl`​。

可以通过以下命令列出可用的发行版：

```powershell
wsl --list --online
```

可以通过以下命令安装发行版：

```powershell
wsl --install <Distro>


```

可以通过以下命令导入现有发行版：

```powershell
# 导入指定tar文件
wsl --import <Distro> <InstallLocation> <FileName> [options]

# 导入指定vhdx文件
wsl --import-in-place <Distro> <FileName>
```

相关说明可以通过以下命令查看：

```powershell
wsl --help
```

## 问题排查

### 不支持特性

问题描述：

```powershell
由于未安装所需的特性，无法启动操作。
错误代码: Wsl/Service/RegisterDistro/CreateVm/HCS/HCS_E_SERVICE_NOT_AVAILABLE
```

解决方案：

可以通过

```powershell
wsl --status
```

查看命令行，根据所提示的信息，一般启用 WSL2 所需特性（虚拟机平台）后重启电脑完成安装即可。启用过程可以通过提示所说命令进行或者前往系统中的 Windows 功能进行启用。名称一般为“虚拟机平台”或者“Virtual Machine Platform”。确认相关功能启用后可重启电脑重试。

### 拒绝访问

问题描述：

在导入现有系统磁盘或压缩文件时出现权限问题

```powershell
错误代码: Wsl/Service/RegisterDistro/MountDisk/HCS/E_ACCESSDENIED
```

解决方案：

查看对应的文件，打开文件属性，切换到“安全”选项卡，点击下方“高级”按钮进行详细设置界面。将所有者更改为当前用户，或在下方的权限条目中添加当前用户。使用微软账号登录可通过邮箱查询到当前账号，或者选择“高级”按钮进入用户查找界面，直接点击“立即查找”按钮可列出当前所有用户。在列表中找到当前账号选中即可。

注意这个过程需要使用管理员权限。
