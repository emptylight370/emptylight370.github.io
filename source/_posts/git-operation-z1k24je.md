---
title: git操作
date: '2023-10-25 18:39:54'
updated: '2026-01-20 21:48:26'
permalink: /post/2023/11/git-operation-z1k24je.html
comments: true
toc: true
tags:
  - Windows
  - Git
  - macOS
  - Linux
---




# 删除文件

```bash
# 删除文件
git rm files_name
# 删除文件夹
git rm -r dirs_name
# 仅从索引中删除文件(本地不删除)
git rm --cached files_name
# 仅从索引中删除文件夹(本地不删除)
git rm --cached -r dirs_name
```

# 从所有历史记录中删除文件

```bash
# 从历史记录中删除文件并不删除本地文件
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch files_name' --prune-empty --tag-name-filter cat -- --all
# 从历史记录中删除文件夹并不删除本地文件
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch -r dirs_name' --prune-empty --tagname-filter cat -- --all
```

值得注意的是，因为需要先行提交才能删除文件，所以在删除时也会修改最新一次提交导致本地文件被删除。所以在运行命令前建议先备份工作区文件夹。

# 移动

```java
# 在git中移动文件
git mv file new_file
```

# 变基

```bash
git rebase
```

# 合并

```bash
# 将分支branch_name合并入当前分支
git merge branch_name
# 退出合并
git merge --abort
# 合并时完全忽略空格
git merge -Xignore-all-space
# 合并时将一个或多个空格视为等价的
git merge -Xignore-space-change
```

# 拣选

```bash
git cherry-pick sha-1
```

拉取 sha-1 提交到当前分支，并且提供一个新的 sha-1 给这次提交

# 标签

```bash
# 显示所有标签
git tag
# 显示匹配的标签
git tag -l "1.*"
# 添加附注标签
git tag -a tag_name -m "tag_message"
# 显示附注标签
git tag show tag_name
# 添加轻量标签(不需要任何选项)
git tag tag_name
# 为历史提交sha-1添加标签
git tag -a tag_name sha-1
# 将标签推送到远程origin
git push origin --tags
# 删除标签tag_name
git tag -d tag_name
# 在远程origin删除标签tag_name
git push origin :refs/tags/tag_name
git push --delete tag_name
```

# Rerere

Rerere 允许 git 记住解决冲突的方法，并在下一次出现同样情况时自动解决

但是不能乱改，git 会记住你每一次修改的变更

```bash
git config --global rerere.enable true
```

# 设置别名

```bash
# 为checkout设置co别名
git config --global alias.co checkout
```

# 获取远端提交情况

```bash
# 一般情况下适用
git fetch
# 需要刷新远程配置时
# 远程已有新提交
git fetch -f/--force
# 远程没有新提交
git fetch --refetch
```

# 临时禁用 SSL

适用于 watt toolkit 的 hosts 代理模式，出现 SSL 报错情况

```bash
# 通过添加env对本条命令禁用SSL校验
env GIT_SSL_NO_VERIFY=true git push origin
env GIT_SSL_NO_VERIFY=true git pull
env GIT_SSL_NO_VERIFY=true git fetch
```

# 切换远程 URL

使用 HTTPS 总是会遇到一些奇奇怪怪的问题，这时可以将远程 URL 更改成 SSH 连接来避免这些奇奇怪怪的问题

```bash
# 在git bash里面的命令长这样
git remote set-url <name> <new-url>
# 写上参数之后要长这样
git remote set-url origin git@github.com:user_name/repo.git
git remote set-url origin git@gitee.com:user_name/repo.git
```
