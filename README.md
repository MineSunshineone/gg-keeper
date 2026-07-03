# GG Keeper

<p align="center">
  <a href="https://github.com/MineSunshineone/gg-keeper/actions/workflows/build.yml"><img alt="CI" src="https://github.com/MineSunshineone/gg-keeper/actions/workflows/build.yml/badge.svg" /></a>
  <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-green.svg" /></a>
  <a href="https://linux.do"><img alt="LINUX DO" src="https://img.shields.io/badge/LINUX-DO-FFB003.svg?logo=data:image/svg%2bxml;base64,DQo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiPjxwYXRoIGQ9Ik00Ni44Mi0uMDU1aDYuMjVxMjMuOTY5IDIuMDYyIDM4IDIxLjQyNmM1LjI1OCA3LjY3NiA4LjIxNSAxNi4xNTYgOC44NzUgMjUuNDV2Ni4yNXEtMi4wNjQgMjMuOTY4LTIxLjQzIDM4LTExLjUxMiA3Ljg4NS0yNS40NDUgOC44NzRoLTYuMjVxLTIzLjk3LTIuMDY0LTM4LjAwNC0yMS40M1EuOTcxIDY3LjA1Ni0uMDU0IDUzLjE4di02LjQ3M0MxLjM2MiAzMC43ODEgOC41MDMgMTguMTQ4IDIxLjM3IDguODE3IDI5LjA0NyAzLjU2MiAzNy41MjcuNjA0IDQ2LjgyMS0uMDU2IiBzdHlsZT0ic3Ryb2tlOm5vbmU7ZmlsbC1ydWxlOmV2ZW5vZGQ7ZmlsbDojZWNlY2VjO2ZpbGwtb3BhY2l0eToxIi8+PHBhdGggZD0iTTQ3LjI2NiAyLjk1N3EyMi41My0uNjUgMzcuNzc3IDE1LjczOGE0OS43IDQ5LjcgMCAwIDEgNi44NjcgMTAuMTU3cS00MS45NjQuMjIyLTgzLjkzIDAgOS43NS0xOC42MTYgMzAuMDI0LTI0LjM4N2E2MSA2MSAwIDAgMSA5LjI2Mi0xLjUwOCIgc3R5bGU9InN0cm9rZTpub25lO2ZpbGwtcnVsZTpldmVub2RkO2ZpbGw6IzE5MTkxOTtmaWxsLW9wYWNpdHk6MSIvPjxwYXRoIGQ9Ik03Ljk4IDcwLjkyNmMyNy45NzctLjAzNSA1NS45NTQgMCA4My45My4xMTNRODMuNDI2IDg3LjQ3MyA2Ni4xMyA5NC4wODZxLTE4LjgxIDYuNTQ0LTM2LjgzMi0xLjg5OC0xNC4yMDMtNy4wOS0yMS4zMTctMjEuMjYyIiBzdHlsZT0ic3Ryb2tlOm5vbmU7ZmlsbC1ydWxlOmV2ZW5vZGQ7ZmlsbDojZjlhZjAwO2ZpbGwtb3BhY2l0eToxIi8+PC9zdmc+" /></a>
</p>

给 Giffgaff / 漫游 SIM 保号用的极简 payload 页面，当前版本面向阿里云 ESA「函数和 Pages」部署，并保留纯静态 `payload.txt` 兜底。

页面风格与 `MineSunshineone/sms_forwarding` 固件 Web UI 保持一致：浅色纸面仪器、等宽数据读数、无外部资源依赖。

## 文件结构

```text
.
├── index.html          # 保号测试网页
├── payload.txt         # 静态 payload，约 128684 bytes
├── src/index.js        # ESA Pages 边缘函数，提供 /api/payload
├── scripts/build.mjs   # 零依赖构建脚本，复制静态文件到 dist/
├── esa.jsonc           # ESA Pages 项目配置
└── package.json
```

## 阿里云 ESA Pages 部署

在阿里云 ESA「函数和 Pages」里选择「导入 Github 仓库」，仓库选择：

```text
MineSunshineone/gg-keeper
```

推荐配置：

| 配置项 | 值 |
| --- | --- |
| 项目名称 | `gg-keeper` |
| 生产分支 | `main` |
| 非生产分支构建 | 关闭 |
| 安装命令 | `npm install` |
| 构建命令 | `npm run build` |
| 根目录 | `/` |
| 静态资源目录 | `dist` |
| 函数文件路径 | `src/index.js` |
| Node.js 版本 | `22.x` |
| 环境变量 | 不填 |

仓库里已经提供 `esa.jsonc`：

```jsonc
{
  "name": "gg-keeper",
  "entry": "./src/index.js",
  "installCommand": "npm install",
  "buildCommand": "npm run build",
  "assets": {
    "directory": "./dist"
  }
}
```

如果控制台自动读取 `esa.jsonc`，保持默认即可；如果没有自动填充，就按上表手动填。

## URL 用法

部署完成后，假设域名是：

```text
https://example.aliyun-esa.com
```

网页入口：

```text
https://example.aliyun-esa.com/
```

推荐给固件使用的动态 payload：

```text
https://example.aliyun-esa.com/api/payload?size=128684
```

纯静态兜底 payload：

```text
https://example.aliyun-esa.com/payload.txt
```

网页按钮会先尝试 `/api/payload?size=128684`，这个地址由阿里云 Pages 函数动态生成 payload；如果当前部署没有启用函数，会自动改用 `/payload.txt` 这个静态文件。

## 本地验证

```bash
npm install
npm run build
```

构建结果会输出到 `dist/`。静态页面可以用任意本地 HTTP 服务预览，例如：

```bash
npx serve dist
```

边缘函数依赖 ESA Pages 运行环境，本地静态预览时 `/api/payload` 不会可用，页面会自动回退到 `payload.txt`。

## Payload 说明

- `payload.txt` 当前大小：128684 bytes。
- `/api/payload` 默认生成 128684 bytes 二进制 payload。
- `/api/payload?size=46080` 可临时指定大小，函数限制范围为 1024 bytes 到 512 KiB。
- 响应头包含 `Cache-Control: no-store`，同时网页请求会追加时间戳和随机参数，尽量避免浏览器或 CDN 缓存。

## 手机手动测试注意

1. 关闭 Wi-Fi，确保走蜂窝数据。
2. 仅给浏览器保留移动数据权限，避免其他 App 偷跑流量。
3. 网页显示完成后立刻关闭移动数据。
4. 最终是否扣费 / 是否保号，以运营商 App、USSD 或账单为准。

## 开源说明

本仓库 fork 自：

```text
https://github.com/dennischancs/gg-keeper
```

当前二次开发仓库：

```text
https://github.com/MineSunshineone/gg-keeper
```

## 致谢

感谢 [LINUX DO](https://linux.do) 社区提供交流与灵感。
