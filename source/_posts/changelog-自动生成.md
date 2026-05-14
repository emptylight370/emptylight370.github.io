---
title: changelog自动生成
date: '2025-10-20 22:36:39'
updated: '2026-05-14 16:49:16'
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



## conventional-changelog (depercated)

因为一直很想研究这个所以花了时间找各种工具各种文档，最后确定下这个流程……

### 选用工具

用的是 [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog)，~~全局安装 conventional-changelog-cli 工具代替每项目单独安装，~~ 全局安装 conventional-changelog 工具代替项目中单独安装，缺点是通过项目的 package.json 不会自动安装这个包，不过鉴于目前没人协作不管这种问题，反正文件里写着调用 conventional-changelog，到时候调用不了会有解决方案从地里长出来的。

全局安装的目的是直接通过命令行直接调用工具，如果只是在项目中自动化调用，也可以在项目中安装，然后通过 `npm run` ​或者 `pnpm run` ​自动化调用。因为现在的环境由 mise 管理，此处使用 mise 安装。

下文会将 conventional-changelog 简写为 cc。

选用 cc 的原因是使用的 Git 管理工具 [SourceGit](https://sourcegit-scm.github.io/) 默认支持生成格式化的提交信息，符合 cc 要求的格式。在测试中至少 `angular` ​模板和 `conventionalchangelog` ​模板支持这个格式。

### 配置过程

#### 安装

安装 cc-cli。通过 npm 命令全局安装，我本地有 Volta，就用 Volta 安装了。具体的安装命令如下：

```powershell
npm i -g conventional-changelog
```

换用 mise 之后，命令变为如下：

```powershell
mise use npm:conventional-changelog
```

#### 配置

查看相关配置文档（真的很难找），最后确定下来使用预设的 `conventionalchangelog` ​模板。

但是这个模板我又想自己自定义，不想用默认的格式，那这就难办了。在网上找了很多文章、仓库，都没有我想要的定义方法，要么安装另一个工具代替 Git 提交流程，要么就是那个工具的第三方扩展，找了半天终于从 cc 自己的仓库里看出点门道来。

1. 首先，在 [conventional-changelog/packages/conventional-changelog-conventionalcommits](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-conventionalcommits) 文件夹里面有个 README.md 文件，写了这么一个标题：直接使用（作为基础预设以便你能自定义它）。这里给了两个代码，第一个好像是仓库里要安装有 cc 才能用，果断选第二个。第二个可以作为参数传给 cc-cli 使用。
2. 在要使用 cc 的仓库里新建一个 JSON 文件，名称自定，这里用 `conventional-changelog.config.json` ​标识用途，实际项目中不一定要这么复杂。往 JSON 里面填入说明文件的 JSON 内容。
3. 对填入的 JSON 进行自定义，首先删掉 `issuePrefixes` ​和 `issueUrlFormat`​，这个还用不上。然后根据文档给出的超链接跳转到配置文件说明：[conventional-changelog/conventional-changelog-config-spec: a spec describing the config options supported by conventional-config for upstream tooling](https://github.com/conventional-changelog/conventional-changelog-config-spec)。

   1. ⚠️ 特别注意：`name` ​不要删掉，那个是标识你在哪个预设上修改的，如果想要基于别的预设修改可以改动里面的值
4. 在新的仓库里面选中最新版的版本号文档，进入文档去看对应的配置项。
5. 这里想要自定义的只有提交的类型，默认配置中写入 changelog 的提交种类和生成的标题都想改，就把 `types` ​的数组复制到先前的 JSON 文件中，粘贴到原本 `issuePrefixes` ​那个层级。（在 `name` ​下面）

   1. 这里需要明确，`type` ​指的是提交信息 `feat: Update code` ​前面的 `feat` ​那部分，修改这里可以匹配不同的提交信息
   2. 后面的 `section` ​是指这个提交信息放在什么部分，代表生成的 changelog 这部分提交的标题。
   3. `hidden: true` ​指的是在 changelog 中隐藏这类型提交，不会在 changelog 中写出来
   4. `scope` ​指的是提交信息 `feat(core): commit` ​中 `core` ​这部分，如果一个项目文件夹中有许多实际的项目，可以通过这个部分说明提交到哪个部分，并且生成日志也可以通过 `scope` ​区分，在一个 `type` ​里也能分出不同的 `section`
6. 根据说明对 `types` ​数组进行自定义修改。到此，我的自定义基本做完了

配置文件：

```json
{
  "options": {
    "preset": {
      "name": "conventionalcommits",
      "types": [
        { "type": "feat", "section": "✨ Features | 功能" },
        { "type": "fix", "section": "🐛 Bug Fixes | 问题修复" },
        { "type": "docs", "section": "📄 Documentation | 文档" },
        { "type": "perf", "section": "⚡ Performance | 性能优化" },
        { "type": "revert", "section": "⏪ Reverts | 回退" },
        { "type": "refactor", "section": "🔨 Refactor | 重构" },
        { "type": "build", "section": "🛠️ Build system | 构建系统" },
        { "type": "ci", "section": "🛠️ Build system | 构建系统" },
        { "type": "style", "hidden": true },
        { "type": "chore", "hidden": true },
        { "type": "test", "hidden": true },
        { "type": "wip", "hidden": true }
      ]
    }
  }
}
```

#### 使用（旧）

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

这时应该会重新生成一份当前版本的更新日志到最前方，如果更新正常应当就是配置完成了。接下来不管是将 temp 转为 changelog 还是什么还请自行决定。

在配置完成后，最好在 package.json 里面写入这个命令方便调用。

```json
{
    "scripts": {
        "changelog": "conventional-changelog -i changelog.md -s -n conventional-changelog.config.json"
    }
}
```

以后只需要 `npm run changelog` ​就可以生成更新日志了。

##### 特殊场景

我研究这个使用的场景是在思源主题的开发环境里面测试的，我的 package.json 里面版本号固定到 `0.0.0` ​不更新了，版本号要在 theme.json 里面查。好在 cc 提供了命令行参数指定 package.json 路径，只要文件里面的 `version` ​和 package.json 里面的 `version` ​层级一致就不报错，我额外添加了命令行参数适应项目环境。

```powershell
conventional-changelog -i changelog.md -s -n conventional-changelog.config.json -k theme.json -c theme.json
```

这样就能获取到 theme.json 里面的 version 了（`-k`​）。将 theme.json 作为参数传入也能将目前的版本号作为标题（`-c`​），不会生成一个单独的日期标题。目前最好的实现方案是修改版本号之后先在本地不要上传，运行 changelog 之后使用 `git --amend` 补充进提交里面，完事之后再上传云端。

> [!NOTE] ✏️ 
> 此处的三个参数：`-n`​、`-k`​ 和 `-c`​，可以按需组合，检查什么组合下能够正常工作。我这里是需要同时使用三个参数才能正常生成，后续也见到项目需要去掉 `-c` ​参数才能正常生成的，这部分需要自行多加测试。

#### 使用（新）

上述版本是在 `conventional-changelog-cli` ​的基础上生成的，换用 `conventional-changelog` ​之后有点变化，目前（7.2.0）版本的命令行参数为：

```powershell
PS > conventional-changelog --help

  Generate a changelog from git metadata.

  Usage
    conventional-changelog

  Example
    conventional-changelog -i changelog -o CHANGELOG.md

  Options
    -i, --infile              Read the CHANGELOG from this file (default: CHANGELOG.md)
    -o, --outfile             Write the CHANGELOG to this file (default: infile)
    --stdout                  Output the result to stdout
    -p, --preset              Name of the preset you want to use
    -k, --pkg                 A filepath of where your package.json is located (default: closest package.json)
    -a, --append              Should the newer release be appended to the older release (default: false)
    -f, --first-release       Generate the CHANGELOG for the first time
    -r, --release-count       How many releases to be generated from the latest (default: 1)
                              If 0, the whole changelog will be regenerated and the outfile will be overwritten
    --skip-unstable           If given, unstable tags will be skipped, e.g., x.x.x-alpha.1, x.x.x-rc.2
    -u, --output-unreleased   Output unreleased changelog
    -v, --verbose             Verbose output. Use this for debugging (default: false)
    -n, --config              A filepath of your config script
    -c, --context             A filepath of a json that is used to define template variables
    -l, --lerna-package       Generate a changelog for a specific lerna package (:pkg-name@1.0.0)
    -t, --tag-prefix          Tag prefix to consider when reading the tags
    --commit-path             Generate a changelog scoped to a specific directory
```

可以看到，命令行参数有些变化，目前会默认将输出追加到输入文件的顶部，移除了输出到相同文件的参数。目前使用的命令行为：

```powershell
conventional-changelog -i changelog.md -n conventional-changelog.config.json
```

##### 特殊场景

对于我自己的项目，可以使用 `-c` ​指定一个 JSON 文件读取版本号，命令行为：

```powershell
conventional-changelog -i changelog.md -n conventional-changelog.config.json -c theme.json
```

如果使用 `-k` ​把 `package.json` ​指向自己的配置文件，需要所有的键值对的类型和 package.json 一致，比如 `description` ​是字符串而不是别的什么东西。因为我这里这个 `description` ​的格式是 `object`​，所以不能使用 `-k`。

现在不知道是哪里出错了，之前的配置文件失效了，生成的变更日志只是单纯把所有提交排列出来，原因不明，现在还在排查中。

### 总结

不想总结。这东西太折腾人了，每个环节之间都是以小时计的，上面基本上就是这么多个小时的碰壁下来得到的所有经验了。

## git-cliff

在 conventional-changelog 莫名失效后，我发现实在搞不定，于是决定换一个工作流。现在经过一天的调试，确定下使用 git-cliff 进行生成。

### 选用工具

用 [git-cliff](https://git-cliff.org/)，可以自行配置生成的更新日志格式。

### 配置过程

#### 安装

因为直接使用 mise 进行安装，官方的安装过程我就不看了。不过，这个好像也是官方的安装方式：[Mise | git-cliff](https://git-cliff.org/docs/installation/mise)

```powershell
mise use git-cliff
```

#### 配置

git-cliff 可以有两种调用方式：

```powershell
git-cliff
git cliff
```

第一种是调用工具，第二种是调用 git 插件。git-cliff 的命名方式符合 git 插件，可以注册为 git 子命令。

初始化配置文件：

```powershell
git cliff --init
# 或者
git cliff -i
```

可以直接初始化一个 `cliff.toml`，里面是官方的默认配置。

因为之前使用的是 conventional-changelog，那个日志格式我还挺喜欢的，内容也全面，这里花了一点时间配置成那个样子，配置文件如下：

```toml
# git-cliff ~ configuration file
# https://git-cliff.org/docs/configuration

[changelog]
# A Tera template to be rendered for each release in the changelog.
# See https://keats.github.io/tera/docs/#introduction
body = """
{% if version %}\
    {% if previous.version %}\
        ## [{{ version | trim_start_matches(pat="v") }}](<REPO>/compare/{{ previous.version }}...{{ version }}) ({{ timestamp | date(format="%Y-%m-%d") }})
    {% else %}\
        ## [{{ version | trim_start_matches(pat="v") }}](<REPO>/compare/{{ commit_range.from }}...{{ version }}) ({{ timestamp | date(format="%Y-%m-%d") }})
    {% endif %}\
{% else %}\
    ## [unreleased]
{% endif %}\
{% set breaking_commits = commits | filter(attribute="breaking", value=true) %}\
{% if breaking_commits | length > 0 %}\
    ### ⚠ BREAKING CHANGES
    {% for commit in breaking_commits %}
        - {{ commit.breaking_description }}
    {% endfor %}
{% endif %}\
{% for group, commits in commits | group_by(attribute="group") %}
    ### {{ group | striptags | trim }}
    {% for commit in commits %}
        - {% if commit.scope %}**({{ commit.scope }})** {% endif %}\
            {{ commit.message }} \
            ([{{ commit.id | truncate(length=7, end="") }}](<REPO>/commit/{{ commit.id }}))\
    {% endfor %}
{% endfor %}
"""
# Remove leading and trailing whitespaces from the changelog's body.
trim = true
# Render body even when there are no releases to process.
render_always = true
# An array of regex based postprocessors to modify the changelog.
postprocessors = [
  # Replace the placeholder <REPO> with a URL.
  { pattern = "<REPO>", replace = "https://github.com/emptylight370/sy-vsce-typewriter" },
]
# output file path
output = "changelog.md"

[git]
# Parse commits according to the conventional commits specification.
# See https://www.conventionalcommits.org
conventional_commits = true
# Exclude commits that do not match the conventional commits specification.
filter_unconventional = true
# Require all commits to be conventional.
# Takes precedence over filter_unconventional.
require_conventional = false
# Split commits on newlines, treating each line as an individual commit.
split_commits = false
# An array of regex based parsers to modify commit messages prior to further processing.
commit_preprocessors = [
  # Replace issue numbers with link templates to be updated in `changelog.postprocessors`.
  { pattern = '\((\w+\s)?#([0-9]+)\)', replace = "([#${2}](<REPO>/issues/${2}))" },
  # Check spelling of the commit message using https://github.com/crate-ci/typos.
  # If the spelling is incorrect, it will be fixed automatically.
  # { pattern = '.*', replace_command = 'typos --write-changes -' },
]
# Prevent commits that are breaking from being excluded by commit parsers.
protect_breaking_commits = true
# An array of regex based parsers for extracting data from the commit message.
# Assigns commits to groups.
# Optionally sets the commit's scope and can decide to exclude commits from further processing.
commit_parsers = [
  { message = "^feat", group = "<!-- 0 -->✨ Features | 功能" },
  { message = "^fix", group = "<!-- 1 -->🐛 Bug Fixes | 问题修复" },
  { message = "^doc", group = "<!-- 2 -->📄 Documentation | 文档" },
  { message = "^perf", group = "<!-- 3 -->⚡ Performance | 性能优化" },
  { message = "^revert", group = "<!-- 4 -->⏪ Reverts | 回退" },
  { message = "^refactor", group = "<!-- 5 -->🔨 Refactor | 重构" },
  { message = "^build", group = "<!-- 6 -->🛠️ Build system | 构建系统" },
  { message = "^ci", group = "<!-- 6 -->🛠️ Build system | 构建系统" },
  { message = "^style", skip = true },
  { message = "^chore", skip = true },
  { message = "^test", skip = true },
  { message = "^wip", skip = true },
]
# Exclude commits that are not matched by any commit parser.
filter_commits = true
# Fail on a commit that is not matched by any commit parser.
fail_on_unmatched_commit = false
# An array of link parsers for extracting external references, and turning them into URLs, using regex.
link_parsers = []
# Include only the tags that belong to the current branch.
use_branch_tags = false
# Order releases topologically instead of chronologically.
topo_order = false
# Order commits topologically instead of chronologically.
topo_order_commits = true
# Order of commits in each group/release within the changelog.
# Allowed values: newest, oldest
sort_commits = "oldest"
# Process submodules commits
recurse_submodules = false
```

这里对上述配置的特殊部分进行简单讲解。

body 使用的是 trea 模板，版本号会附上跟上一个版本的比较链接，时间用括号框住。BREAKING CHANGES 单独拿出来处理，将 BREAKING CHANGE 一行的消息单独显示出来。后面显示 commit 的时候就不显示 BREAKING CHANGE 的提交，跟 conventional changelog 保持一致。在每一个 commit 的消息后面显示 hash 还有在线链接。

后处理器的 `<REPO>` ​是官方自带的，取消注释之后填入自己的 repo 地址。`output` ​填 changelog 的文件名（或者相对路径）。

在 `[git]` ​部分，把官方自带的 GitHub issues 取消注释了。在 `commit_parsers` ​部分，根据原有的配置文件填写。这里的 `<!-- 0 -->` ​注释必须保留，用于排序不同的类别。

#### 使用

在配置好之后，可以直接生成变更日志。git-cliff 是使用 tag 进行生成的，没办法从特定文件中读取版本号，所以这里需要多处理一下。

```powershell
git cliff
```

直接运行就可以生成变更日志。默认会包含未发布的提交。

```powershell
git cliff -l
git cliff --latest
```

可以生成最新的 tag 的日志。

```powershell
git cliff --current
```

可以生成当前 tag 的日志。

```powershell
git cliff -u
git cliff --unreleased
```

可以生成未发布的提交日志。

在切换到 git-cliff 之后，首先使用 `git cliff` ​重新生成一次提交日志，并且把未发布的部分删掉。因为自动化配置是在提交新版本的时候会触发提交日志更新，所以这里还是没有 tag 的状态，需要手动指定最新版本为新版本号。这里通过 PowerShell 脚本获取 JSON 的 version 版本号，保存备用。之后通过 `-t` ​传入版本号，现在会将未发布的提交放到这个版本号下面。

```powershell
git cliff -t $version
```

现在可以将提交日志格式化后提交到 git，结束 git hook 环节。

在 GitHub Actions 中，在提交新版本的时候会触发构建和发布环节。这个时候还没有 tag，所以还是需要获取当前版本号并传入。这里获取到版本号之后通过以下命令生成发布描述。

```powershell
git cliff -u -o release.md -t ${{ version }}
```

这里的版本号是占位符，具体根据自己获取的方法替换。现在可以将 release.md 作为发布描述使用。

### 总结

还要总结？不干了
