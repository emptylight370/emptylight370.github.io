---
title: windows家庭版启用沙盒
date: '2023-10-17 23:23:19'
updated: '2023-10-17 23:49:19'
permalink: /post/2023/10/windows-family-edition-enable-sand-box-1si53v.html
comments: true
toc: true
tags:
  - Windows
---




# 沙盒

Windows家庭版没有办法在Windows功能中开启沙盒，需要采取特殊的方法。

1. 首先开启电脑的虚拟化（需要检查BIOS）
2. 复制下列内容并创建为`.bat`​文件

    ```bat
    @echo off

    echo Checking for permissions
    >nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"

    echo Permission check result: %errorlevel%

    REM --> If error flag set, we do not have admin.
    if '%errorlevel%' NEQ '0' (
    echo Requesting administrative privileges...
    goto UACPrompt
    ) else ( goto gotAdmin )

    :UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\getadmin.vbs"

    echo Running created temporary "%temp%\getadmin.vbs"
    timeout /T 2
    "%temp%\getadmin.vbs"
    exit /B

    :gotAdmin
    if exist "%temp%\getadmin.vbs" ( del "%temp%\getadmin.vbs" )
    pushd "%CD%"
    CD /D "%~dp0" 

    echo Batch was successfully started with admin privileges
    echo .
    cls
    Title Sandbox Installer

    pushd "%~dp0"

    dir /b %SystemRoot%\servicing\Packages\*Containers*.mum >sandbox.txt

    for /f %%i in ('findstr /i . sandbox.txt 2^>nul') do dism /online /norestart /add-package:"%SystemRoot%\servicing\Packages\%%i"

    del sandbox.txt

    Dism /online /enable-feature /featurename:Containers-DisposableClientVM /LimitAccess /ALL

    pause
    ```
3. 以管理员权限运行上述`.bat`​文件
4. 运行完成后启动Windows功能，打开Windows沙盒功能，安装沙盒
5. 安装完成后可以启用Windows沙盒
6. 需要删除Windows沙盒时，在CMD中粘贴下列代码并运行

    ```powershell
    Dism /online /Disable-Feature /FeatureName:"Containers-DisposableClientVM"
    ```
7. 专业版可以直接在Windows功能中启用Windows沙盒，无需进行上述步骤

# 虚拟机

在Windows11家庭版上启用hyper-v虚拟机的操作如下。

1. 将以下代码保存为cmd文件。

    ```cmd
    pushd "%~dp0"
    dir /b %SystemRoot%\servicing\Packages\*Hyper-V*.mum >hyper-v.txt
    for /f %%i in ('findstr /i . hyper-v.txt 2^>nul') do dism /online /norestart /add-package:"%SystemRoot%\servicing\Packages\%%i"
    del hyper-v.txt
    Dism /online /enable-feature /featurename:Microsoft-Hyper-V-All /LimitAccess /ALL
    ```
2. 用管理员权限运行，等待电脑从服务器下载hyper-v相关组件。
3. 重启电脑。
4. 在组件管理中查看hyper-v相关组件并开启。
5. 删除的代码未找到。自行推测是如下代码。

    ```powershell
    Dism /online /Disable-feature /featurename:Microsoft-Hyper-V-All
    ```
