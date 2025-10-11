---
title: WSL2安装及使用
date: '2025-07-17 13:25:32'
updated: '2025-10-11 13:12:59'
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
2. 在终端中输入如下命令：`wsl --list`
3. 随后终端提示：

    ```powershell
    未安装适用于 Linux 的 Windows 子系统。可通过运行 “wsl.exe --install” 进行安装。
    有关详细信息，请访问 https://aka.ms/wslinstall

    按任意键安装适用于 Linux 的 Windows 子系统。
    按 CTRL-C 或关闭此窗口以取消。
    ```
4. 此时按下任意键开始安装 WSL2，注意需要管理员权限。
5. 等待安装完成

## 使用

在安装完成之后，默认的 WSL2 是没有可用分发版的。一般需要自己安装几个。以下的命令行一般均可以使用 `wsl.exe`​ 代替 `wsl`。

可以通过以下命令列出可用的分发版：

```powershell
wsl --list --online
```

可以通过以下命令安装分发版：

```powershell
wsl --install <Distro> # <Distro>: 分发版名称
```

可以通过以下命令导入现有分发版：

```powershell

wsl --import <Distro> <InstallLocation> <FileName> [options]

# 导入指定vhdx文件
wsl --import-in-place <Distro> <FileName>
```

相关说明可以通过以下命令查看：

```powershell
wsl --help
```

## 卸载

可以通过以下命令取消注册分发版：

```powershell
wsl --unregister <Distro> # <Distro>: 分发版名称
```

可以通过以下命令停止正在运行的分发版的 WSL2 虚拟机：

```powershell
wsl --shutdown
# 如果需要强行停止可以使用 --force 参数
wsl --shutdown --force
```

可以通过以下命令卸载 WSL2 虚拟机：

```powershell
wsl --uninstall
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

### 远程调用失败

问题描述：

在系统在线重置（在线获取完整系统安装包覆盖安装，系统设置里的选项，可保留设置和应用）后，尝试安装新分发版时出现远程调用失败。具体是电脑重装、放数据的硬盘文件丢失，需要全部重装。在运行完前面的下载流程之后，安装时出现此错误提示。

```powershell
远程过程调用失败。
错误代码: Wsl/InstallDistro/Service/RPC_S_CALL_FAILED
```

解决方案：

实际上**这个问题我并没有解决**，有可能只是暂时避免了这个问题。

1. 根据网上找到的方法，先尝试了卸载 WSL2 之后重新安装，不过问题没有解决。可能是下载分发版时候断网了，重新运行了安装命令。
2. 想起来前面把所有分发版都取消注册了，打开 Docker Desktop 看看能不能用。于是启动了 Docker Desktop，发现正常启动。
3. 回到 WSL2 发现 Docker Desktop 把 Docker 装上了，尝试再次安装想要安装的 Ubuntu 分发版，发现安装成功。

这个流程在没有运行 Docker Desktop 的时候能不能正常运行我还不确定，但目前是解决了我的问题。如果已安装有 Docker Desktop 可以试试，没有就不用尝试了。
