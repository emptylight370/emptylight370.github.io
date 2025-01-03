---
title: 设置SSH和GPG密钥
date: '2024-11-08 22:39:41'
updated: '2024-11-14 10:10:48'
permalink: /post/set-the-ssh-and-gpg-key-zncs5v.html
comments: true
toc: true
tags:
  - Windows
  - Linux
  - Git
---



Git提交使用SSH和GPG密钥可以很好地提高提交的安全性，同时可以标志提交的身份。配置好之后可以在GitHub和Gitee上显示对应的标签，可以一键验证提交身份之类的。目前GitHub支持SSH和GPG密钥验证的显示，Gitee支持GPG密钥验证的显示。如果提交中使用密钥验证，会显示【Verified】或【已验证】。

目前在GitHub上有详尽的文档可以参考配置SSH和GPG。GPG密钥因为配置复杂，通常是可选的，用于验证提交者身份。不过大多数组织或个人都会使用GPG签名提交或者

可见：

* [生成新的 SSH 密钥并将其添加到 ssh-agent - GitHub 文档](https://docs.github.com/zh/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
* [生成新 GPG 密钥 - GitHub 文档](https://docs.github.com/zh/authentication/managing-commit-signature-verification/generating-a-new-gpg-key)
* [新增 SSH 密钥到 GitHub 帐户 - GitHub 文档](https://docs.github.com/zh/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)
* [将 GPG 密钥添加到 GitHub 帐户 - GitHub 文档](https://docs.github.com/zh/authentication/managing-commit-signature-verification/adding-a-gpg-key-to-your-github-account)
* [将您的签名密钥告知 Git - GitHub 文档](https://docs.github.com/zh/authentication/managing-commit-signature-verification/telling-git-about-your-signing-key)

无法访问GitHub的文档也可以来看看Gitee的文档：

* [生成/添加SSH公钥 - Gitee.com](https://gitee.com/help/articles/4181#article-header0)
* [如何在 Gitee 上使用 GPG - Gitee.com](https://gitee.com/help/articles/4248#article-header0)

# 设置SSH

## 生成SSH

1. 首先需要安装好SSH客户端。
2. 在安装好之后可以通过如下命令生成SSH密钥。

    ```shell
    ssh-keygen -t ed25519 -C "xxxxx@xxxxx.com"
    ```

    其中的`-t`​是密钥使用的格式，`-C`​是密钥的名称，使用邮箱只是为了便于辨识。
3. 之后会提示你选择文件保存路径，输入密钥密码，如果不想输入可以直接回车跳过。SSH一般不改变文件保存路径，除非你已有同样格式的密钥或需要更改密钥的文件名。而大多数的教程都不教你配置密码，因为每次使用SSH都要输入密码。为了安全考虑，你可以选择添加密码。
4. 之后将生成的公钥复制到剪贴板中。

    ```shell
    clip < ~/.ssh/id_ed25519.pub
    ```

    这个命令将公钥复制到剪贴板中，也可以通过一下命令将公钥打印出来手动复制。

    ```shell
    cat ~/.ssh/id_ed25519.pub
    ```

    注意复制的范围。路径和文件名如果默认无修改即为如上地址。
5. 打开GitHub、Gitee的账号设置界面，找到写有SSH的界面，选择添加公钥，将公钥粘贴到输入框中（不要粘贴到密钥名称的输入框里啦）。之后保存新增密钥，输入平台密码。
6. 这样子就可以配置好本地和GitHub、Gitee的SSH密钥。

## 配置SSH免密连接

如果要配置其他客户端的SSH免验证连接，则需要将本机的SSH公钥复制到目标客户机的authorized_keys中。现有教程是教用`ssh-copy-id`​命令进行操作，不过我没有成功过，就手动将自己电脑的公钥打印出来发送到目标客户机，追加到authorized_keys文件的末尾。

下面是使用`ssh-copy-id`​操作的过程。

1. 本机使用`ssh-copy-id`​操作连接远程主机（假设目标机器是Linux）。

    ```shell
    ssh-copy-id user_name@remote_ip
    ```

    通过连接Linux的方法输入用户名和IP，将密钥发送过去。过程中可能需要输入用户密码。
2. 连接至远程机器，检查`.ssh`​目录下是否存在authorized_keys文件。

    ```shell
    cat ~/.ssh/authorized_keys
    ```
3. 重启远程机器的ssh重新连接测试

下面是手动复制的过程。

1. 将自己Windows电脑上的公钥复制出来
2. 发送到你要连接的目标机器，可以是任何支持ssh的机器
3. 访问对面的`.ssh/authorized_keys`​文件
4. 将公钥粘贴到文件里，独占一行，每个公钥都独占一行
5. 重启对面的ssh重新连接

# 设置GPG

## 生成GPG

要设置GPG比SSH麻烦一点，因为Windows和MacOS上没有预装GPG客户端，也没有类似OpenSSH一样的可选组件，所以需要自己安装一下GPG客户端。你可以通过[GnuPG - Download](https://www.gnupg.org/download/)找到可用的客户端。在Windows下可安装Gpg4win。

1. 安装客户端。Gpg4win客户端安装过程中可选多个组件，以下列出可移除的组件。

    1. GpgOL，适用于Outlook的组件，可以加解密邮件。
    2. GpgEX，用于Windows资源管理器的扩展，可以通过右键菜单加解密文件。
    3. GpgSM，可用于处理S/MIME证书，不使用S/MINE格式证书可以不安装。
    4. 默认不勾选的组件。
2. 安装好之后可以通过命令行或Kleopatra应用来管理GPG密钥。这里按照大多数教程介绍命令行方式。
3. 输入命令，新建GPG密钥。

    ```shell
    gpg --full-generate-key
    ```
4. 输入密钥格式、密钥长度等，可用回车指定默认值。
5. 输入有效时长，通常建议设为0，即密钥不过期。密钥过期的话需要定期生成新密钥或延长密钥有效期，挺麻烦的。
6. 输入用户信息，比如用户名和邮箱等。通常建议和平台使用的邮箱一致。
7. 输入安全密码。这里的安全密码和前面SSH的安全密码一样，不过一般建议填写安全密码，可以提高安全性，不过每次提交时都需要输入密码。输入密码也行，不输入密码也可，就是不输入密码需要多确认几次。（密码可更改，不影响公钥和私钥使用。但忘记密码必定影响私钥使用）
8. 列出公钥及私钥的ID。

    ```shell
    gpg --list-secret-keys --keyid-format=long
    # 或
    gpg -K --keyid-format=long
    ```

    这里的long是缩短ID长度的。在`4069R/xxxxxx`​这里的`4069R`​是密钥长度，后面的`xxxxxx`​部分即为ID。将ID复制备用。
9. 导出对应ID的公钥。

    ```shell
    gpg --armor --export xxxxxx
    ```

    将后面的`xxxxxx`​部分替换成前面复制的ID。之后就会在控制台打印出你的公钥。
10. 复制以 `-----BEGIN PGP PUBLIC KEY BLOCK-----`​ 开头并以 `-----END PGP PUBLIC KEY BLOCK-----`​ 结尾的 GPG 密钥。
11. 粘贴至平台中GPG密钥部分的公钥输入框中。

使用命令行新建GPG密钥对的部分到此为止，下面是使用Kleopatra新建GPG密钥对的过程。

1. 安装好Gpg4win和Kleopatra。
2. 打开Kleopatra，选择文件-新建OpenGPG密钥对（Ctrl-N）。
3. 输入用户名和邮箱。这里可选使用密码句保护生成的密钥，不勾选就不会要求你输入密码。
4. 之后等待生成密钥对，一点时间之后就生成好了，可以使用。
5. 选中刚生成的密钥，选择导出，将文件保存下来，打开文件，复制里面的公钥内容，粘贴到平台输入GPG公钥的地方。

## 为SSH配置GPG

设置好GPG密钥之后，还要对SSH配置GPG。

1. 为SSH设置使用GPG密钥。

    ```shell
    git config --global user.signingkey xxxxxx
    ```

    这里的`xxxxxx`​还是前面复制的密钥ID。或者换用子键的ID，视需求而定。可用`!`​来指明这是首选项（用于多个密钥存在时）
2. 配置自动签名。

    ```shell
    git config --global commit.gpgsign true
    ```
3. 如果尝试提交失败了，说找不到GPG密钥，那么是因为Git找不到你的Gpg4win客户端导致的。通过以下命令设置Git。

    ```shell
    git config --global gpg.program "C:\Program Files (x86)\GnuPG\bin\gpg.exe"
    ```

    请将路径更换成自己安装gpg的路径。

## 更改私钥密码

如果前面设置了密钥，后面后悔了，要更改密码，我建议通过可视化界面来更改密码。

1. 选中要修改的密钥。
2. 右键更改密码句，输入原有密码。
3. 输入新密码的地方不进行输入，直接下一步。
4. 确认不需要密码保护。
5. 回到输入密码的地方，重新点击下一步。
6. 设置完成。

## 设置密码有效期

如果设置了密钥，但是苦于每次都要输入密码，可以通过设置密码有效期来解决这个问题。

1. 打开Gpg4win的数据路径，通常在`%APPDATA%/gnupg`​路径下。
2. 打开`gpg-agent.conf`​文件，没有就新建一个。
3. 输入以下内容，数字单位是秒。

    ```conf
    default-cache-ttl 14400   # 密码有效时间
    max-cache-ttl 86400 # 密码最长有效时间
    ```

    这里设定的密码有效时间为4小时，最长有效时间为24小时。
4. 之后重启`gpg-agent`​进程。

    ```shell
    gpgconf --kill gpg-agent
    gpgconf --launch gpg-agent
    # 或
    gpgconf -R
    ```
5. 重启之后不出现报错的话，进行一次提交或做什么需要用到密码的操作，之后就进入缓存期，不需要接着输入密码了。

## 使用密码管理器输入密码

可以通过KeepassXC或类似密码管理器来自动输入密码。做法为

1. 在密码管理器中新建条目，名称任意。
2. 密码填写你私钥的密码，就是你初始化的时候填写的密码，或者干脆用密码管理器生成密码。
3. 进行一次提交或者什么操作，等待输入密码窗口出现。
4. 在自动填充中选中窗口，设置好合适的自动输入序列。
5. 由密码管理器自动输入密码。

这样能较大减少输入密码的工作量。同样适用于SSH，不过SSH好像有可用的密码管理器，KeepassXC也支持在解锁数据库时插入SSH私钥。可以通过在设置中启用SSH代理支持并新建SSH密钥条目来体验该功能。

## 导出GPG密钥

可以通过导出GPG密钥将密钥备份或迁移至WSL中。

1. 导出公钥和私钥。

    ```shell
    # 导出公钥
    gpg -a -o public.key --export xxxxxx
    # 即
    gpg --armor --output public.key --export xxxxxx
    # 导出私钥
    gpg -a -o secret.key --export-secret-keys xxxxxx
    ```

    这里的`xxxxxx`​照样是你的密钥ID。或者通过邮箱导出密钥。

    ```shell
    gpg --export-secret-key -a "your-email@example.com" > secret.key
    gpg --export -a "your-email@example.com" > public.key
    ```
2. 将文件转移到WSL或Linux中，或者干脆通过`/mnt/c`​或`/mnt/d`​这样的路径访问C盘和D盘找到文件。
3. 导入公钥和私钥。

    ```shell
    gpg --import public.key
    gpg --import secret.key
    ```

    记得改路径。
4. 确认密钥正确导入。

    ```shell
    gpg --list-keys
    gpg --list-secret-keys
    # 或
    gpg -k
    gpg -K
    ```

    小k代表公钥，大K代表私钥。与上面的参数等价。
5. 导入之后需要设置密钥的信任度。通过`--edit-key`​设置密钥信息。

    ```shell
    gpg --edit-key xxxxxx
    ```
6. 输入`trust`​进入信任度编辑。这里的0-5代表不同的信任级别。自己生成的密钥在生成端默认为5，这里也建议设置为5。毕竟是你刚才自己生成的密钥，肯定是没问题的。
7. 输入`save`​保存并退出更改。

# 结语

在各种设置完成之后就可以在代码平台上看到提交上标注着【Verified】或【已验证】字样了。不过设置GPG密钥并不是必须的，要正常通过SSH提交代码的话设置好SSH密钥就可以了。GPG密钥用于验证提交者的身份。
