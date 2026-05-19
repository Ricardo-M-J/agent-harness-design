# 开发日志 (DEVLOG)

## 项目信息
- **项目名称**：Agent Harness for Design
- **赛题**：赛题17 - 让AI像团队一样设计
- **框架**：OpenCode (opencode.ai)
- **GitHub**：https://github.com/Ricardo-M-J/agent-harness-design

---

## 项目定位

本项目是基于 OpenCode 的多智能体品牌设计系统，目标是让 AI 像团队一样完成品牌设计任务。

**可灵活调整**：Agent prompt、Skill 定义、工具配置、模型选择、存储和上下文

**核心目标**：生成高质量的品牌视觉资产（Logo、吉祥物、文创周边、品牌页面），而非追求框架通用性。

---

## 环境配置

### API Keys

API Keys 和 Token 请查看本地 `WORKFLOW.md` 或联系项目管理员获取。

**创智 API 端点**: `https://apicz.boyuerichdata.com/v1`

### 可用图像生成模型

| 模型 | API 端点 | 平均时延 | 备注 |
|------|---------|---------|------|
| **gemini-2.5-flash-image** | `/v1/chat/completions` | **~10.7 秒** | ✅ 推荐，快且稳定 |
| gpt-image-2 | `/v1/images/generations` | ~4-5 分钟 | ❌ 太慢，经常 timeout |
| gemini-3-pro-image-preview | `/v1/chat/completions` | 未测试 | |
| gemini-3.1-flash-image-preview | `/v1/chat/completions` | 未测试 | |

> **重要**：Gemini 图像生成走的是 chat/completions（多模态对话），不是 images/generations。

### 可用文本模型

gpt-4o, gpt-4o-mini, gpt-4.1-mini, o3-mini 等

---

## 目标编排架构

### 多智能体协作流程

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   用户输入   │────▶│  @planner   │────▶│  @designer  │────▶│   @critic   │
│  品牌需求   │     │  规划智能体  │     │  设计智能体  │     │  评审智能体  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                           │                   │                   │
                           ▼                   ▼                   ▼
                    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
                    │ task_list.md│    │design_paradigm│   │review_roundN│
                    │             │    │  prompts.md │    │    .md      │
                    │             │    │  *.png      │    │             │
                    └─────────────┘    └─────────────┘    └─────────────┘
                           │                   │                   │
                           └───────────────────┴───────────────────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │  收敛判断   │
                                        │ 平均分≥4/5 │
                                        │ 或轮次≥3  │
                                        └─────────────┘
                                               │
                               ┌───────────────┴───────────────┐
                               ▼                               ▼
                        ┌─────────────┐                 ┌─────────────┐
                        │   未收敛    │                 │    收敛    │
                        │ 返回@designer│                │  输出结果  │
                        └─────────────┘                 └─────────────┘
```

### 智能体职责

| 智能体 | 模式 | 模型 | 职责 | 输出文件 |
|--------|------|------|------|----------|
| **Primary** (build) | primary | gpt-4o | 编排协调，按顺序调用子智能体 | - |
| **@planner** | subagent | gpt-4.1-mini | 风格调研、任务拆解 | `task_list.md`, `style_reference.md` |
| **@designer** | subagent | gpt-4o | 范式分析、提示词编写、图像生成 | `design_paradigm.md`, `prompts.md`, `*.png` |
| **@critic** | subagent | gpt-4o | 看图评审、结构化改进建议 | `review_round{N}.md` |

### 收敛条件

1. **平均分 ≥ 4/5** → 结束
2. **轮次 ≥ 3** → 结束（避免无限循环）
3. **否则** → 回到 Designer 进行迭代

### 迭代机制

- Critic 必须指出至少 1 张图的问题（评分 ≤ 3/5）
- Critic 给出完整的新提示词，Designer 直接复制使用
- Designer 只重新生成需要修改的图片，保留不变的图片

---

## 当前架构

```
.opencode/
├── agents/
│   ├── planner.txt          # 规划智能体
│   ├── designer.txt         # 设计智能体
│   └── critic.txt           # 评审智能体
├── skills/
│   ├── brand-design/SKILL.md    # 品牌设计知识
│   ├── visual-output/SKILL.md   # 视觉资产生成
│   ├── copywriting/SKILL.md     # 文案知识
│   ├── design-spec/SKILL.md     # 设计规范
│   └── design-review/SKILL.md   # 评审知识
└── tools/
    ├── text-to-image.ts         # OpenCode Tool（gpt-image-2）
    └── text-to-image-simple.ts  # 独立 CLI 工具（备用）
```

---

## 迭代记录

### v0.1.0 - 初始版本

**日期**：2026-05-15

- [x] 环境搭建（Bun + OpenCode CLI + GitHub）
- [x] 三个 Agent 定义（planner/designer/critic）
- [x] 四个 Skill 定义
- [x] Custom Tool（text-to-image Mock）
- [x] AGENTS.md 编排逻辑

---

### v0.2.0 - 外联配置版本

**日期**：2026-05-15

- [x] 外联配置文件（.txt 格式）
- [x] 4 个自定义 Skill 实现
- [x] 完整闭环测试通过

---

### v0.3.0 - 创智 API 集成

**日期**：2026-05-18

- [x] 集成创智 API（gpt-image-2）
- [x] 提取创智学院设计范式
- [x] 成功生成星云AI品牌视觉资产（Logo + 吉祥物 + 文创）

---

### v0.4.0 - 架构优化：Skill 化

**日期**：2026-05-18

- [x] Visual Designer 合并到 Designer + Skill
- [x] 3 个 Agent（planner/designer/critic）
- [x] 移除"薄 Harness + 厚 Skill"理念

---

### v0.5.0 - 闭环调试 + 多 Agent 编排修复

**日期**：2026-05-18

- [x] 修复 Primary Agent 不调用 Critic（权限 + steps + AGENTS.md）
- [x] 完整闭环测试通过：Planner → Designer → Critic → 迭代Designer

**关键问题修复**：

| 问题 | 根因 | 修复 |
|------|------|------|
| Primary 不调用 Critic | 无 steps 限制 + 直接调 Tool | build.steps=20 + permission deny |
| Subagent 无法写文件 | 默认 deny edit | 显式 permission: edit allow |
| Planner 卡在 websearch | API 不支持 websearch | 改用内置知识 |
| Critic 不看图 | prompt 未强调 | 强制"直接读取图片文件" |
| Critic 全给高分 | 评审太宽松 | 要求至少一张图 3/5 分 |

---

### v0.6.0 - 图像生成模型调研 + 时延测试

**日期**：2026-05-19

#### 调研背景

gpt-image-2 响应时间 2-5 分钟/张，远超 OpenCode Tool 内部 timeout（~120 秒），导致 Designer 频繁超时失败。需要找到更快的替代方案。

#### 为什么自己写 text-to-image Tool？

OpenCode **没有原生图像生成 Tool**。内置 Tool 只有 bash/edit/read/grep/glob/webfetch/websearch 等。图像生成必须通过 Custom Tool 或 MCP Server 封装 API。

#### 为什么考虑过 shell 脚本替代 Custom Tool？

OpenCode Custom Tool 有内部 timeout 限制（~120 秒），gpt-image-2 需要 2-5 分钟，经常被强制终止。所以备了 `text-to-image-simple.ts` 作为独立 CLI 工具，通过 bash 调用绕过 Tool timeout。但 bash 也有 timeout，且 Designer 经常忘记用 bash 而直接调 Tool。

#### 时延测试结果

编写了 `test-image-latency.ts` 脚本，对多个模型进行时延测试：

| 模型 | API 端点 | 平均时延 | 成功率 | 超过 120s |
|------|---------|---------|--------|-----------|
| **gemini-2.5-flash-image** | chat/completions | **10.7 秒** | **5/5** | **0/5** ✅ |
| gpt-image-2 | images/generations | ~4-5 分钟 | 不稳定 | 经常超时 ❌ |
| doubao-seedream-4.0 | images/generations | - | 403 无权限 | - |
| gpt-image-2-flash | images/generations | - | 403 无权限 | - |

**结论**：gemini-2.5-flash-image 比 gpt-image-2 快约 **25 倍**，且 100% 在 OpenCode Tool timeout 内完成。

#### Gemini 与 gpt-image-2 的 API 差异

| | gpt-image-2 | gemini-2.5-flash-image |
|--|------------|----------------------|
| API 端点 | `/v1/images/generations` | `/v1/chat/completions` |
| 请求格式 | `{ model, prompt, n, size }` | `{ model, messages: [{ role, content }] }` |
| 响应格式 | `{ data: [{ b64_json / url }] }` | `{ choices: [{ message: { content } }] }` |
| 图片位置 | `data[0].b64_json` | `choices[0].message.content`（内联 base64） |

#### OpenCode Agent Mode 调研

| 豆包说法 | 事实 |
|----------|------|
| "OpenCode 有 Agent Team 对等模式" | ❌ 不存在，mode 只有 `subagent`/`primary`/`all` |
| "Subagent 不能自主读文件" | ❌ Subagent 可以自主用工具，只要有权限 |
| "Claude Code 同款对等模式" | ❌ OpenCode 没有对等模式，有实验性提案未合并 |

**Subagent 的实际限制**：
- ✅ 可以自主调用 read/grep/glob/bash 等工具
- ❌ 看不到 Primary 的对话历史
- ❌ 不能主动与其他 Subagent 通信
- 上下文只有 Primary 传入的 prompt + 自主工具调用的结果

---

## 交付物清单

```
outputs/{项目名}/
├── task_list.md              # 设计任务清单
├── style_reference.md        # 风格参考模板
├── design_paradigm.md        # 设计范式（色彩/字体/风格）
├── prompts.md                # 提示词记录
├── mascot.png                # 吉祥物
├── logo.png                  # Logo
├── review_round1.md          # 第1轮评审
├── review_round2.md          # 第2轮评审（如迭代）
└── ...
```

---

## 下一步计划

- [ ] 将 text-to-image Tool 切换为 gemini-2.5-flash-image（解决 timeout 问题）
- [ ] 更新 Designer prompt 适配 Gemini 的 chat/completions 格式
- [ ] 扩展图片类型（Logo → 文创 → 品牌页面）
- [ ] 优化 Critic 评审格式的一致性
- [ ] 修复 Designer 偶尔传 undefined width/height 的问题
