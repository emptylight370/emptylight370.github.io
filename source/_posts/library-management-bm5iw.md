---
title: 库管理
date: '2023-08-22 20:50:55'
updated: '2023-12-09 11:59:20'
permalink: /post/library-management-bm5iw.html
comments: true
toc: true
tags:
---




# 安装

安装时使用 `pip` ​命令完成。

​`pip install`​+ 库名即可安装对应的库。相应的依赖库会自动下载安装。

添加参数 `-i` ​或 `--index-url` ​即可临时指定下载源，可以指定国内镜像源下载，比官网源快多了。也可以设置 `config` ​文件来永久设置下载源。

添加参数 `-U` ​或 `--upgrade` ​即可更新对应的库。

添加参数 `--src` ​即可指定安装的目录。

添加参数 `-r` ​即可从给定的 `requirements.txt` ​中获取需要安装的库并批量安装。

添加参数 `-V` ​或 `--version` ​即可指定安装的版本。

# 管理

使用 `pip list`​​ 即可查看当前安装的所有库。显示效果为平铺，显示当前版本号。  
​![image](https://cdn-res.emptylight.cn/share/img/image-20230822210807-219e2zz.png "pip")​

在安装了 `pipdeptree`​​​ 库后可以通过命令 `pipdeptree`​​​ 查看当前安装的库的依赖关系。显示效果为分层嵌套，显示当前版本号。  
​![image](https://cdn-res.emptylight.cn/share/img/image-20230822210901-vh7ipbs.png "pipdeptree")​

# 更新

检查更新可以使用pip中的`pip list -o`​命令。

更新可以使用 pip 中的`pip install -U`​命令。

在安装了`pip-review`​库之后可以使用`pip-review`​命令更新。

参数`-i`​为询问是否安装。

参数`-C`​为在一个库安装失败后继续安装。

参数`--freeze-outdated-packages`​为将需要更新的库导出为`requirements.txt`​存档。

# 卸载

卸载使用pip自带的指令`pip remove`​即可卸载，但是只会卸载指定的库，不会卸载依赖项。

安装了`python3-pip-autoremove`​库之后可以使用指令`pip3-autoremove`​后加库名卸载库。这个方法可以一并卸载掉不使用的依赖库。

使用`pip3-autoremove`​库也可以。

参数`-l`​可以列出当前不使用的库并选择卸载。

# 导出已安装的软件包

pip提供了导出已安装包的方法，使用`pip freeze > requirements.txt`​即可导出为文本文件。

> <span style="font-weight: bold;" data-type="strong">特别注意：</span> 更新python版本需要<span style="font-weight: bold;" data-type="strong">首先备份</span>pip安装的软件包，在更新后的python<span style="font-weight: bold;" data-type="strong">再次安装！！！</span>
