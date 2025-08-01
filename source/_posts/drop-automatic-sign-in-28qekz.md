---
title: 链滴自动签到
date: '2024-10-10 13:03:27'
updated: '2025-07-30 00:50:48'
tags:
  - 思源笔记
  - Windows
permalink: /post/2024/10/drop-automatic-sign-in-28qekz.html
comments: true
toc: true
---



基于[分享链滴自动签到 puppeteer 脚本 - 链滴 (ld246.com)](https://ld246.com/article/1724548513173)脚本实现。具体为自己添加了一点totp验证代码。

请先看原版文章了解使用方式。更新脚本只需要修改脚本内容。



- 2024-10-10 首次修改实现2fa验证
- 2024-10-10 修改log日志地址
- 2025-07-30 因为服务器开启了安全防护，添加了一种无法签到的情况

# 环境依赖

- node 18+
- puppeteer-core
- otpauth

# 代码实现

```javascript
// 用户名和密码，必须
const username = "";
const password = "";
const otpcode = "";

// 设置浏览器安装路径，必须，如果填空，则使用puppeteer模式而不是puppeteer-core
// Windows用户可能是 "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"，注意这里的路径要用\转义
const chromePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

// 通知脚本路径，可选，如果没有，填空即可，空则不通知
const notifyShellPath = "";

// 警告脚本路径，可选，如果没有，填空即可，空则不警告
//（和通知的区别是，警告只会在发生错误时弹出，而通知则是普通的异常，比如签到失败）
const alertShellPath = "";

// 用户代理，必须，否则无头模式下被反爬虫阻止访问，请使用真实浏览器代理，如果你不清楚就使用默认的即可
const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36 Edg/92.0.902.84";

/////////////////////// 以下代码通常不需要修改 //////////////////////////////////

// 是否调试模式，true为调试模式，正式环境别忘了设置为false
const DEBUG = process.argv.includes("--debug") || false;

// 登录的URL
const loginUrl = "https://ld246.com/login";

// 登录按钮选择器
const usernameFieldSelector = "#nameOrEmail";
const passwordFieldSelector = "#loginPassword";
const loginButtonSelector = "#loginBtn";
const totpButtonSelector = "#verify2faInput";
const totpConfirmButtonSelector = "#verify2faBtn";
const totpErrorAlertSelector = ".dialog__content";
const logoutButtonSelector = "#signOut";
const loginErrorTipSelector = "#loginTip.error";

// 签到URL
const signInUrl = "https://ld246.com/activity/checkin";

// 签到按钮选择器
const signInSelector = "a.btn.green";
const hasSignInSelector = "a.btn[href$='points']";

// 引入文件系统模块
const fs = require('fs');
const puppeteer = require(chromePath ? 'puppeteer-core' : 'puppeteer');

// 获取临时文件夹路径
//const os = require('os');
//const tempDir = os.tmpdir();
const path = require('path');
const tempDir = path.join(__dirname, "ldtmp");
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
// 创建一个写入流对象，用于向日志文件写入数据
const logPath = path.join(tempDir, "ldlogin.log");
const logStream = fs.createWriteStream(logPath, { flags: 'a' });
const lockFilePath = path.join(tempDir, '~~ld246' + username + new Date().toLocaleDateString().replace(/\//g, '') + '~~signin.lock');
if (DEBUG) console.log("lockFilePath: ", lockFilePath);
const cookieFilePath = path.join(tempDir, `~~ld246${username}~~cookies.json`);
if (DEBUG) console.log("cookieFilePath: ", cookieFilePath);
let yesterday = new Date(new Date());
yesterday.setDate(yesterday.getDate() - 1);
yesterday = yesterday.toLocaleDateString().replace(/\//g, '');
const lastLockFilePath = path.join(tempDir, '~~ld246' + username + yesterday + '~~signin.lock');
if (DEBUG) console.log("lastLockFilePath: ", lastLockFilePath);

// 检测用户名和密码是否正确
if (!username || !password) {
    console.error('用户名和密码必填');
    logStream.end();
    process.exit(1);
}
// 检测chromePath是否正确
if (chromePath) {
    if (!fs.existsSync(chromePath)) {
        console.error('chromePath错误，请检查chromePath是否正确');
        logStream.end();
        process.exit(1);
    }
}

// 如果已签到则退出
if (fs.existsSync(lockFilePath)) {
    if (!DEBUG && !process.argv.includes('--force')) {
        console.log("今日已签到");
        //console.log(lockFilePath);
        logStream.end();
        process.exit(0);
    }
}

// 清除昨日的锁文件
if (fs.existsSync(lastLockFilePath)) {
    try {
        fs.unlinkSync(lastLockFilePath);
    } catch (e) {
        console.log("clear lastLockFilePath failed");
    }
}

(async () => {
    // 启动浏览器
    const options = {
        headless: process.argv.includes('--headless') || !DEBUG,
    };
    if (chromePath) options.executablePath = chromePath;
    const browser = await puppeteer.launch(options);
    // 创建一个新页面
    const page = await browser.newPage();
    await page.setUserAgent(userAgent || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36");
    try {
        // 获取cookie信息
        let cookies = getCookies();
        if (cookies) {
            // 添加 cookies 到 page
            console.log('setCookies success');
            await page.setCookie(...cookies);
        }

        // 跳转签到页面
        console.log("打开签到页面", signInUrl);
        await page.goto(signInUrl, { timeout: 30000 });

        // 判断是否已登录
        const hasLogin = await page.$(logoutButtonSelector);
        if (!hasLogin) {
            // 判断是否有安全验证
            let title = await page.$("div.title");
            let titleText = title ? await page.evaluate(el => el.textContent, title) : null;
            if (titleText === "请完成以下操作，验证您是真人") {
                console.log("需要安全认证，脚本无法签到");
                logStream.write("[" + (new Date().toLocaleString()) + "] " + username + " 签到失败，网站开启了安全验证。\n");
                alert(username + " 签到失败，网站开启了安全验证。");
                await exit(1);
            }
            // 模拟登录
            console.log("检测到未登录，正在打开登录页面", loginUrl);
            await page.goto(loginUrl, { timeout: 30000 });
            await page.locator(usernameFieldSelector).fill(username);
            await page.locator(passwordFieldSelector).fill(password);
            await page.locator(loginButtonSelector).click();
            // 等待登录完成
            try {
                await page.waitForNavigation({ timeout: 30000 });
            } catch (e) {
                // 登录发生错误时，获取页面错误信息
                try {
                    // 获取网站返回错误信息
                    await page.waitForSelector(loginErrorTipSelector, { timeout: 5000 });
                    const errorMessage = await page.$eval(loginErrorTipSelector, el => el.textContent.trim());
                    console.log('登录失败，网站返回错误信息：', errorMessage);
                    logStream.write("[" + (new Date().toLocaleString()) + "] " + username + " 登录失败，网站返回错误信息：" + errorMessage + "\n");
                    alert(username + " 登录失败，网站返回错误信息：" + errorMessage);
                    await exit(1);
                } catch (e) {
                    // 获取网站错误信息失败
                    console.log('登录失败，错误信息：' + e.message);
                    logStream.write("[" + (new Date().toLocaleString()) + "] " + username + " 登录失败，错误信息：" + e.message + "\n");
                    alert(username + " 登录失败，错误信息：" + e.message);
                    await exit(1);
                }
            }
            // 登录完成后，尝试获取登录信息
            const hasLogin = await page.$(logoutButtonSelector);
            if (!hasLogin) {
                const totpInput = await page.$(totpButtonSelector);
                if (totpInput) {
                    console.log("检测到2FA安全验证，正在进行totp生成和填写");
                    const otpAuth = require("otpauth");
                    var totpCode = new otpAuth.TOTP({ secret: otpcode });
                    var totptoken = totpCode.generate();
                    console.log("当前totp验证码为", totptoken);
                    await page.locator(totpButtonSelector).fill(totptoken);
                    await page.locator(totpConfirmButtonSelector).click();
                    // 等待登录完成
                    try {
                        await page.waitForNavigation({ timeout: 30000 });
                    } catch (e) {
                        // 登录发生错误时，获取页面错误信息
                        try {
                            // 获取网站返回错误信息
                            await page.waitForSelector(totpErrorAlertSelector, { timeout: 5000 });
                            const errorMessage = await page.$eval(totpErrorAlertSelector, el => el.textContent.trim());
                            console.log('登录失败，网站返回错误信息：', errorMessage);
                            logStream.write("[" + (new Date().toLocaleString()) + "] " + username + " 登录失败，网站返回错误信息：" + errorMessage + "\n");
                            alert(username + " 登录失败，网站返回错误信息：" + errorMessage);
                            await exit(1);
                        } catch (e) {
                            // 获取网站错误信息失败
                            console.log('登录失败，错误信息：' + e.message);
                            logStream.write("[" + (new Date().toLocaleString()) + "] " + username + " 登录失败，错误信息：" + e.message + "\n");
                            alert(username + " 登录失败，错误信息：" + e.message);
                            await exit(1);
                        }
                    }
                } else {
                    // 未获取到登录信息，无totp验证
                    console.log("登录失败，无法获取登录信息");
                    logStream.write("[" + (new Date().toLocaleString()) + "] " + username + " 登录失败，无法获取登录信息\n");
                    alert("登录失败，无法获取登录信息");
                    await exit(1);
                }
            }
            // 登录成功
            console.log("登录已完成");
            // 保存 cookies
            cookies = await page.cookies();
            fs.writeFileSync(cookieFilePath, JSON.stringify(cookies, null, 2), 'utf8');
            console.log("已保存cookies");

            // 检查当前页面是否签到页面，不是则跳转到签到页面
            if (page.url() !== signInUrl) {
                // 跳转到签到页面
                console.log("检测到当前不在签到页，正跳转到签到页面");
                await page.goto(signInUrl, { timeout: 30000 });
            }
        }

        // 检查是否有已签到元素
        const hasSignInElement = await page.$(hasSignInSelector);
        if (hasSignInElement) {
            console.log('今日已签到');
            fs.writeFileSync(lockFilePath, '');
        } else {
            // 模拟签到
            await page.locator(signInSelector).click();

            // 等待签到完成
            await page.waitForNavigation({ timeout: 30000 });
            const hasSingIn = await page.$(hasSignInSelector);
            if (!hasSingIn) {
                // 签到失败退出
                console.log("签到失败，未获取到已签信息");
                logStream.write("[" + (new Date().toLocaleString()) + "] " + username + " 签到失败，未获取到已签信息\n");
                notice("签到失败，未获取到已签信息");
                await exit(1);
            }
            // 签到完成锁定签到
            console.log("签到已完成");
            fs.writeFileSync(lockFilePath, '');

            // 获取积分
            console.log("获取积分中...");
            const scoreElement = await page.$("code");
            if (scoreElement) {
                // 获取积分成功
                const score = await page.evaluate((el) => el.textContent, scoreElement);
                console.log("积分:", parseInt(score));
                logStream.write("[" + (new Date().toLocaleString()) + "] " + username + " 签到成功，积分: " + parseInt(score) + "\n");
            } else {
                // 获取积分失败
                console.log("未找到积分元素");
                logStream.write("[" + (new Date().toLocaleString()) + "] " + username + " 签到成功，但未找到积分元素\n");
            }
        }
    } catch (error) {
        // 发生错误处理
        console.error("发生错误:", error.message);
        logStream.write("[" + (new Date().toLocaleString()) + "] 发生错误: " + error.message + "\n");
        alert("发生错误:" + error.message);
        exit(1);
    } finally {
        exit(0);
    }

    // 退出进程
    async function exit(code, delay) {
        // 退出码
        code = code || 0;
        // 延迟关闭
        if (delay && typeof delay === 'number') await sleep(delay);
        // 关闭写入流
        logStream.end();
        // 删除临时目录
        // 关闭浏览器
        if (!DEBUG) {
            console.log("已关闭浏览器");
            await browser.close();
            process.exit(code);
        }
    }
})();

// 获取已保存的cookies
function getCookies() {
    // 尝试加载 cookies
    let cookies;
    if (!fs.existsSync(cookieFilePath)) {
        return cookies;
    }
    try {
        cookies = JSON.parse(fs.readFileSync(cookieFilePath, 'utf8'));
        console.log("加载cookies成功");
    } catch (error) {
        console.log("没有找到cookies文件，将重新登录");
    }
    return cookies;
}

// 显示通知
function notice(message, title) {
    if (!notifyShellPath) return;
    if (fs.existsSync(notifyShellPath)) {
        console.log("发送通知", message, title);
        const { exec } = require('child_process');
        // 假设我们要执行 `ls` 命令，‌并传递 `-l` 和 `-a` 作为参数
        const command = `${notifyShellPath} "${message || "未知错误"}" "${title || "签到异常"}"`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            if (stderr) {
                console.error(`stderr: ${stderr}`);
            }
        });
    }
}

// 显示警告弹窗
function alert(message) {
    if (!alertShellPath) return;
    if (fs.existsSync(alertShellPath)) {
        console.log("发送警告", message);
        const { exec } = require('child_process');
        // 假设我们要执行 `ls` 命令，‌并传递 `-l` 和 `-a` 作为参数
        const command = `${alertShellPath} "${message || "未知错误"}"`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            if (stderr) {
                console.error(`stderr: ${stderr}`);
            }
        });
    }
}

// 延迟执行
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
```

# 使用方式

1. 填写你的用户名，密码，2fa安全密钥（没有2fa验证请用原版代码）
2. 使用node测试你的代码能不能运行
3. 使用Windows计划任务添加定时任务

# 计划任务

1. 打开“任务计划程序”（控制面板）
2. 将左侧的任务计划程序库展开，进入Users分类

    这一步主要是为了方便管理
3. 点击右侧“操作”的创建任务
4. 填写任务名称（例如链滴自动登录）
5. 设置触发器（切换到触发器面板，点击新建）
6. 新建操作，程序或脚本就写`node`，添加参数写你的文件全地址，起始于写你的文件路径（或许可以不用？）
7. 后面的条件和设置可视情况而定
