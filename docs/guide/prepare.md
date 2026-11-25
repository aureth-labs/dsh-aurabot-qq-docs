# 安装准备

开始前准备运行环境、机器人账号和模型服务。Node.js 是必需项，Python 与 FFmpeg 按所用功能安装。

## 环境清单

| 项目 | 要求 | 用途 |
| --- | --- | --- |
| 运行设备 | 推荐 Windows；也可使用 Linux 或 macOS | 运行 DSH、AuraBot 和平台连接程序 |
| 机器人账号 | 按目标平台准备 | 作为机器人身份登录 |
| 模型 API | 可配置的 API 地址、模型 ID 和密钥 | 生成回复与调用工具 |
| Node.js | 22 或更高版本 | 运行 DSH、AuraBot 和插件构建工具 |
| Python | 推荐 3.10 或更高版本 | 语音合成、翻唱等本地功能 |
| FFmpeg | 推荐安装 | 音频转换、抽帧、缩图和混音 |

手机上的 Termux 和 Docker 可以用于实验，但不适合作为长期运行环境。后台限制、存储权限和多媒体依赖都会增加维护成本。

## Node.js

Windows：

```powershell
winget install OpenJS.NodeJS.LTS
```

macOS：

```bash
brew install node
```

Debian 或 Ubuntu：

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

安装后重新打开终端并检查版本：

```bash
node --version
npm --version
```

## Python

Windows：

```powershell
winget install Python.Python.3.12
```

macOS：

```bash
brew install python@3.12
```

Debian 或 Ubuntu：

```bash
sudo apt install -y python3 python3-venv python3-pip
```

```bash
python3 --version
```

语音功能需要虚拟环境支持。Linux 上若缺少 `venv`，安装对应的 `python3-venv` 软件包。

## FFmpeg

Windows 可任选一种包管理器：

```powershell
winget install Gyan.FFmpeg
```

```powershell
scoop install ffmpeg
```

```powershell
choco install ffmpeg
```

macOS 与常见 Linux 发行版：

```bash
brew install ffmpeg
```

```bash
sudo apt install -y ffmpeg
```

```bash
sudo dnf install -y ffmpeg
```

验证安装：

```bash
ffmpeg -version
```

Windows 安装后需要重新打开终端。如果程序仍找不到 FFmpeg，请将包含 `ffmpeg.exe` 的目录加入 `PATH`，或在对应插件配置中填写完整路径。

## 数据与权限

为配置、日志、语音和缓存预留磁盘空间。Linux 或 Docker 环境应使用普通用户运行，避免插件启动的外部进程获得过高的系统权限。
