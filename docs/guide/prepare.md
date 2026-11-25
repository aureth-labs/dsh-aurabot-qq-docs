# 准备

先把手上的东西凑齐，再往下装。**必需的只有三样**：一个设备、一个机器人账号、一份能用的模型密钥。

## 清单

| 东西 | 用来干什么 | 必需吗 |
| --- | --- | --- |
| 一个设备 | 跑 DSH 和框架，Windows / Linux / macOS 都行 | 必需 |
| 一个机器人账号 | 给 AI 用的身份，不一定是 QQ | 必需 |
| 大模型 API 与密钥 | 她的大脑，任意 OpenAI 兼容的都能接 | 必需 |
| Node.js | DSH 和本框架的语言；写插件也靠它 | 必需 |
| Python | 语音、翻唱等本地能力 | 推荐 |
| FFmpeg | 点歌抽音频、语音转码、缩图、混音 | 推荐 |

### 关于设备

一个设备就够，不用额外买服务器。**Windows 最省事**：QQ 网关和翻唱（RVC）在 Windows 上支持最好。
Linux 适合跑在服务器或 NAS 上，macOS 日常够用。

手机能跑——Termux 里装 Docker 再跑 DSH 是可行的，但**不推荐**：常驻进程会被系统杀、
语音和翻唱依赖不齐、网关在移动网络下容易掉线。手机只适合临时试一下。

### 关于机器人账号

不一定是 QQ。接哪个平台就用哪个平台的账号，QQ 用小号即可，别拿主号当机器人。

### 关于模型密钥

不一定是 DeepSeek。只要对方提供 OpenAI 兼容接口就行；想同时挂多家、做路由和故障转移，
用独立网关，具体见[配置模型](/guide/models)。

## 装 Node.js

DSH 本身是 Node 程序，框架和插件也是。要求 **Node.js 22 以上**，本机实测在 24 上跑。

```powershell
# Windows
winget install OpenJS.NodeJS.LTS
```

```bash
# macOS
brew install node

# Debian / Ubuntu
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

```bash
node -v   # v22 以上
npm -v
```

想同时维护多个版本，用 `fnm` 或 `nvm`，别手工改 PATH。

## 装 Python（推荐）

语音合成、翻唱、部分识别功能要 Python。版本 **3.10 以上**，建议装在虚拟环境里，
不要往系统 Python 里 `pip install`。

```powershell
# Windows
winget install Python.Python.3.12
```

```bash
# macOS
brew install python@3.12

# Debian / Ubuntu
sudo apt install -y python3 python3-venv python3-pip
```

```bash
python3 -V
```

Linux 上装完记得有 `venv` 模块，否则框架里的语音功能会报缺依赖。

## 装 FFmpeg（推荐）

它不参与对话，但一半的「多媒体」功能靠它：点歌要把音源抽成 mp3、语音要转码、
图片要缩放、翻唱要混音。**装一次，全框架共用。**

```powershell
# Windows（任选一条）
winget install Gyan.FFmpeg
scoop install ffmpeg
choco install ffmpeg
```

```bash
# macOS
brew install ffmpeg

# Debian / Ubuntu
sudo apt install -y ffmpeg

# Fedora
sudo dnf install -y ffmpeg
```

验证：

```bash
ffmpeg -version
```

Windows 上 `winget` 装完要**重开终端**才认得 `ffmpeg`。如果框架报「找不到 ffmpeg」，
把 `ffmpeg.exe` 所在目录加进系统 PATH，或者在插件配置里直接填绝对路径。

## 磁盘和权限

给数据目录留几百 MB：人格、记忆、表情包、日志、下载的音源都写在这里，位置见[认识面板](/guide/configure#数据在哪)。

Linux / Docker 部署时，用普通用户跑，别用 root——插件会起外部进程（ffmpeg、python），
root 身份跑等于把整台机器交出去。
