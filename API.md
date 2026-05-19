# API 与外部服务清单

> 本项目依赖的外部服务非常集中，只有一个核心 API 网关。

---

## 1. 核心 API：创智 API（Boyuerich API）

唯一的外部 API，承担所有 LLM 推理和图像生成任务。

| 属性 | 值 |
|------|-----|
| **Base URL** | `https://apicz.boyuerichdata.com/v1` |
| **API Key** | `sk-KQRts8IEJesfFj06YYsPXuleWodDxIlZ2t5g2A3DJDk0XRvJ` |
| **协议** | OpenAI 兼容（`/v1/chat/completions`、`/v1/images/generations`） |
| **SDK** | `@ai-sdk/openai-compatible` |
| **认证** | `Authorization: Bearer sk-...` |

---

## 2. 使用的模型

### 文本/对话模型（Agent 推理）

| 模型 | 用途 | 使用者 | 配置位置 |
|------|------|--------|----------|
| `boyuerich/gpt-4o` | 主模型，编排 + 设计 + 评审 | Primary, Designer, Critic | opencode.json |
| `boyuerich/gpt-4o-mini` | 小模型（备用） | 全局 small_model | opencode.json |
| `boyuerich/gpt-4.1-mini` | 规划任务（轻量快速） | Planner | opencode.json |

### 图像生成模型

| 模型 | 端点 | 状态 | 用途 |
|------|------|------|------|
| `gemini-2.5-flash-image` | `/v1/chat/completions` | ✅ **当前主力** (~10s/张) | 吉祥物、文创产品 |
| `gpt-image-2` | `/v1/images/generations` | ⚠️ 备用，太慢 (~4-5min/张) | 备用图像生成 |
| `gemini-3-pro-image-preview` | `/v1/chat/completions` | ❌ 暂不可用 (503) | 预留 |

---

## 3. API 调用方式

### 方式 1：OpenCode 框架内置（文本对话）

```
协议: OpenAI Chat Completions API
端点: https://apicz.boyuerichdata.com/v1/chat/completions
调用者: OpenCode 框架自动调用
用途: 所有 Agent 的文本推理
```

### 方式 2：Custom Tool — Gemini 图像生成（当前主力）

```
协议: OpenAI Chat Completions API（多模态）
端点: POST https://apicz.boyuerichdata.com/v1/chat/completions
请求: { model: "gemini-2.5-flash-image", messages: [...] }
响应: choices[0].message.content 中包含 base64 图片
实现: .opencode/tools/text-to-image.ts
调用者: Designer Agent 通过 OpenCode Tool 机制
```

### 方式 3：独立 CLI — gpt-image-2 图像生成（备用）

```
协议: OpenAI Images API
端点: POST https://apicz.boyuerichdata.com/v1/images/generations
请求: { model: "gpt-image-2", prompt: "...", size: "1024x1024" }
响应: data[0].b64_json
实现: .opencode/tools/text-to-image-simple.ts
调用: npx tsx .opencode/tools/text-to-image-simple.ts --prompt "..."
```

---

## 4. GitHub

| 属性 | 值 |
|------|-----|
| **仓库地址** | `https://github.com/Ricardo-M-J/agent-harness-design` |
| **认证** | GitHub Personal Access Token (Classic) |
| **权限** | `repo`（完整仓库访问） |
| **CLI** | `gh` (GitHub CLI) |

---

## 5. OpenCode 框架

| 属性 | 值 |
|------|-----|
| **官网** | `https://opencode.ai` |
| **用途** | 多智能体编排平台 |
| **SDK** | `@opencode-ai/plugin` (v1.15.5) |
| **配置** | `opencode.json` |
| **CLI** | `opencode run "指令" -m boyuerich/gpt-4o` |

---

## 6. NPM 依赖

| 包名 | 用途 |
|------|------|
| `@opencode-ai/plugin` | OpenCode Custom Tool 开发 SDK |
| `@ai-sdk/openai-compatible` | OpenAI 兼容 API 适配器 |

---

## 7. API Key 出现位置

| 文件 | 说明 |
|------|------|
| `opencode.json` | 主配置 |
| `.opencode/tools/text-to-image.ts` | 图像生成工具 |
| `.opencode/tools/text-to-image-simple.ts` | 独立 CLI 工具 |
| `test-image-latency.ts` | 时延测试 |
| `test-merch.ts` | 文创产品测试 |

> ⚠️ **安全提示**: API Key 在多个文件中硬编码，建议使用环境变量管理。

---

## 8. 架构总结

```
用户指令
    │
    ▼
OpenCode 框架 (opencode.ai)
    │
    ├── @ai-sdk/openai-compatible
    │       │
    │       ▼
    │   创智 API (apicz.boyuerichdata.com/v1)
    │       │
    │       ├── gpt-4o ──→ Primary / Designer / Critic
    │       ├── gpt-4.1-mini ──→ Planner
    │       └── gemini-2.5-flash-image ──→ 图像生成
    │
    └── @opencode-ai/plugin
            │
            ▼
        text-to-image.ts (Custom Tool)
            │
            ▼
        创智 API ──→ gemini-2.5-flash-image ──→ PNG 图片
```

**没有使用其他外部服务**（无数据库、无云存储、无部署平台、无 CDN）。
