---
title: changelog自动生成
date: '2025-10-20 22:36:39'
updated: '2026-01-20 21:47:42'
tags:
  - JavaScript
  - Node.js
  - Windows
  - macOS
  - Linux
permalink: /post/2025/10/changelog-automatically-generated-lpisq.html
comments: true
toc: true
---



因为一直很想研究这个所以花了时间找各种工具各种文档，最后确定下这个流程……

## 选用工具

用的是 [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog)，全局安装 conventional-changelog-cli 工具代替每项目单独安装，缺点是通过项目的 package.json 不会自动安装这个包，不过鉴于目前没人协作不管这种问题，反正文件里写着调用 conventional-changelog，到时候调用不了会有解决方案从地里长出来的。

下文会将 conventional-changelog 简写为 cc。

选用 cc 的原因是使用的 Git 管理工具 [SourceGit](https://sourcegit-scm.github.io/) 默认支持生成格式化的提交信息，符合 cc 要求的格式。在测试中至少 `angular` ​模板和 `conventionalchangelog` ​模板支持这个格式。

## 配置过程

### 安装

安装 cc-cli。通过 npm 命令全局安装，我本地有 Volta，就用 Volta 安装了。具体的安装命令如下：

```powershell
npm i -g conventional-changelog-cli
```

### 配置

查看相关配置文档（真的很难找），最后确定下来使用预设的 `conventionalchangelog` ​模板。

但是这个模板我又想自己自定义，不想用默认的格式，那这就难办了。在网上找了很多文章、仓库，都没有我想要的定义方法，要么安装另一个工具代替 Git 提交流程，要么就是那个工具的第三方扩展，找了半天终于从 cc 自己的仓库里看出点门道来。

1. 首先，在 [conventional-changelog/packages/conventional-changelog-conventionalcommits at master · conventional-changelog/conventional-changelog](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-conventionalcommits) 文件夹里面有个 README.md 文件，写了这么一个标题：直接使用（作为基础预设以便你能自定义它）。这里给了两个代码，第一个好像是仓库里要安装有 cc 才能用，果断选第二个。第二个可以作为参数传给 cc-cli 使用。
2. 在要使用 cc 的仓库里新建一个 JSON 文件，名称自定，这里用 `conventional-changelog.config.json` ​标识用途，实际项目中不一定要这么复杂。往 JSON 里面填入说明文件的 JSON 内容。
3. 对填入的 JSON 进行自定义，首先删掉 `issuePrefixes` ​和 `issueUrlFormat`​，这个还用不上。然后根据文档给出的超链接跳转到配置文件说明：[conventional-changelog/conventional-changelog-config-spec: a spec describing the config options supported by conventional-config for upstream tooling](https://github.com/conventional-changelog/conventional-changelog-config-spec)。

    1. ⚠️ 特别注意：`name` ​不要删掉，那个是标识你在哪个预设上修改的，如果想要基于别的预设修改可以改动里面的值
4. 在新的仓库里面选中最新版的版本号文档，进入文档去看对应的配置项。
5. 这里想要自定义的只有提交的类型，默认配置中写入 changelog 的提交种类和生成的标题都想改，就把 `types` ​的数组复制到先前的 JSON 文件中，粘贴到原本 `issuePrefixes` ​那个层级。（在 `name` ​下面）

    1. 这里需要明确，`type` ​指的是提交信息 `feat: Update code` ​前面的 `feat` ​那部分，修改这里可以匹配不同的提交信息
    2. 后面的 `section` ​是指这个提交信息放在什么部分，代表生成的 changelog 这部分提交的标题。
    3. ​`hidden: true` ​指的是在 changelog 中隐藏这类型提交，不会在 changelog 中写出来
    4. ​`scope` ​指的是提交信息 `feat(core): commit` ​中 `core` ​这部分，如果一个项目文件夹中有许多实际的项目，可以通过这个部分说明提交到哪个部分，并且生成日志也可以通过 `scope` ​区分，在一个 `type` ​里也能分出不同的 `section`
6. 根据说明对 `types` ​数组进行自定义修改。到此，我的自定义基本做完了

### 使用

通过命令行可以得到以下信息：

```powershell
PS > conventional-changelog --help

  Generate a changelog from git metadata.

  Usage
    conventional-changelog

  Example
    conventional-changelog -i CHANGELOG.md --same-file

  Options
    -i, --infile              Read the CHANGELOG from this file

    -o, --outfile             Write the CHANGELOG to this file
                              If unspecified, it prints to stdout

    -s, --same-file           Outputting to the infile so you don't need to specify the same file as outfile

    -p, --preset              Name of the preset you want to use. Must be one of the following:
                              angular, atom, codemirror, conventionalcommits, ember, eslint, express, jquery or jshint

    -k, --pkg                 A filepath of where your package.json is located
                              Default is the closest package.json from cwd

    -r, --release-count       How many releases to be generated from the latest
                              If 0, the whole changelog will be regenerated and the outfile will be overwritten
                              Default: 1

    -n, --config              A filepath of your config script
                              Example of a config script: https://github.com/conventional-changelog/conventional-changelog/blob/master/packages/conventional-changelog-cli/test/fixtures/config.cjs
```

首先，测试性质地生成一个 changelog 文件，不要直接覆盖原有的文件了。

```powershell
conventional-changelog -o temp.md -r 0 -n conventional-changelog.config.json
```

这个命令的意思是：使用前面的配置生成全部版本的变更日志到 temp 文件中，如果配置正常可以看到在 temp 文件中正确应用了设置的效果。这里有一个巨大的误区就是不要在命令行里面指定预设，自定义设置会不生效。

如果工作正常，可以试下生成当前版本的更新日志。

```powershell
conventional-changelog -i temp.md -s -n conventional-changelog.config.json
```

这时应该会更新或者重新生成一份当前版本的更新日志到最前方（具体的我不是很确定，我的环境不是标准的 Node.js 项目），如果更新正常应当就是配置完成了。接下来不管是将 temp 转为 changelog 还是什么还请自行决定。

在配置完成后，最好在 package.json 里面写入这个命令方便调用。

```json
{
    "scripts": {
        "changelog": "conventional-changelog -i changelog.md -s -n conventional-changelog.config.json"
    }
}
```

以后只需要 `npm run changelog` ​就可以生成更新日志了。

### 特殊场景

我研究这个使用的场景是在思源主题的开发环境里面测试的，我的 package.json 里面版本号固定到 `0.0.0` ​不更新了，版本号要在 theme.json 里面查。好在 cc 提供了命令行参数指定 package.json 路径，只要文件里面的 `version` ​和 package.json 里面的 `version` ​层级一致就不报错，我额外添加了命令行参数适应项目环境。

```powershell
conventional-changelog -i changelog.md -s -n conventional-changelog.config.json -k theme.json -c theme.json
```

这样就能获取到 theme.json 里面的 version 了（`-k`​）。将 theme.json 作为参数传入也能将目前的版本号作为标题（`-c`​），不会生成一个单独的日期标题。目前最好的实现方案是修改版本号之后先在本地不要上传，运行 changelog 之后使用 `git --amend` ​补充进提交里面，完事之后再上传云端。

## 总结

不想总结。这东西太折腾人了，每个环节之间都是以小时计的，上面基本上就是这么多个小时的碰壁下来得到的所有经验了。
