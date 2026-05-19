# 系统架构说明

## 设计哲学

本项目是基于 OpenCode 的多智能体品牌设计系统，目标是让 AI 像团队一样完成品牌设计任务。

**核心原则**：
- 实用优先：能跑通、能生成高质量视觉资产
- 灵活可调：Agent prompt、Skill、工具、模型、存储都可调整
- 不追求通用框架：专注赛题17的品牌设计场景

---

## 目标架构 vs 当前架构

### 目标架构（理想设计流程）

**设计思路**：三个 Agent 形成完整的设计流水线，每个环节有明确的输入输出和迭代反馈机制

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         目标设计流程架构                                  │
│                                                                         │
│  ┌─────────────┐                                                        │
│  │   用户输入   │ 品牌名、行业、调性需求                                   │
│  └──────┬──────┘                                                        │
│         ▼                                                               │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ @planner（调研规划）                                              │   │
│  │                                                                  │   │
│  │ 输入：用户需求                                                    │   │
│  │ 动作：                                                            │   │
│  │   1. 调研创智学院风格、理念、视觉特征                              │   │
│  │   2. 分析品牌定位与创智的差异化方向                                │   │
│  │   3. 输出具体设计任务清单                                         │   │
│  │                                                                  │   │
│  │ 输出：task_list.md + style_reference.md                          │   │
│  │   - 品牌理念定位                                                  │   │
│  │   - 参考创智风格但做差异化                                        │   │
│  │   - 具体要生成哪些图（吉祥物/Logo/文创）                          │   │
│  │   - 每张图的用途和风格方向                                        │   │
│  └────────────────────────────┬─────────────────────────────────────┘   │
│                               ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ @designer（范式分析 + 执行）                                      │   │
│  │                                                                  │   │
│  │ 输入：task_list.md + style_reference.md                          │   │
│  │ 动作：                                                            │   │
│  │   1. 【范式分析】根据品牌理念分析设计范式                          │   │
│  │      - 色彩系统（主色/辅色/点缀色 + 色值）                         │   │
│  │      - 字体选择（风格/用途）                                      │   │
│  │      - 风格关键词（科技感/年轻化等）                              │   │
│  │   2. 【提示词工程】为每张图编写精准提示词                          │   │
│  │   3. 【图像生成】调用 text-to-image Tool 生图                    │   │
│  │                                                                  │   │
│  │ 输出：design_paradigm.md + prompts.md + *.png                    │   │
│  └────────────────────────────┬─────────────────────────────────────┘   │
│                               ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ @critic（评审 + 反馈）                                            │   │
│  │                                                                  │   │
│  │ 输入：范式 + 提示词 + 生成的图片                                  │   │
│  │ 动作：                                                            │   │
│  │   1. 评价每张图（1-5分）                                          │   │
│  │   2. 诊断问题类型：                                               │   │
│  │      - 范式问题（色彩不对/风格不符）→ 修改 design_paradigm.md   │   │
│  │      - 提示词问题（描述不准/细节缺失）→ 修改 prompts.md         │   │
│  │   3. 输出结构化改进建议（可直接执行）                             │   │
│  │                                                                  │   │
│  │ 输出：review_roundN.md                                           │   │
│  │   - 评分 + 问题诊断 + 具体修改建议                                │   │
│  │   - 完整的新范式 / 新提示词（Designer 可直接复制）                │   │
│  └────────────────────────────┬─────────────────────────────────────┘   │
│                               │                                         │
│              ┌────────────────┴────────────────┐                       │
│              ▼                                 ▼                       │
│        【未收敛】平均分 < 4/5          【收敛】平均分 ≥ 4/5              │
│              │                                 │                       │
│              ▼                                 ▼                       │
│        回到 @designer                  输出最终结果                     │
│        （读取 review_roundN.md         （所有设计资产）                 │
│         修改范式/提示词 → 重新生图）                                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

关键设计：
- 流水线式分工：调研 → 范式+执行 → 评审+反馈
- 双向迭代：Critic 的反馈可以作用于范式层或执行层
- 结构化输出：每个环节的输出是下一环节的输入
- 可执行的改进建议：Critic 给出的是可直接替换的范式/提示词
```

### 当前架构（OpenCode 实现）

**设计思路**：基于 OpenCode 的 Primary-Subagent 模式，通过 AGENTS.md 强制编排

```
┌────────────────────────────────────────────────────────────┐
│  OpenCode 编排层（当前实现）                                 │
│                                                            │
│  ┌─────────────────────────────────────┐                  │
│  │  Primary Agent (build)              │                  │
│  │                                     │                  │
│  │  - 读取 AGENTS.md 编排逻辑          │                  │
│  │  - 按顺序调用 Subagent              │                  │
│  │  - 传递上下文，控制流程             │                  │
│  │  - 不能自己执行设计工作             │                  │
│  └──────────────┬──────────────────────┘                  │
│                 │                                          │
│     ┌───────────┼───────────┐                             │
│     ▼           ▼           ▼                             │
│  ┌────────┐  ┌────────┐  ┌────────┐                      │
│  │@planner│  │@designer│  │@critic │                      │
│  │(sub)   │  │(sub)   │  │(sub)   │                      │
│  │        │  │【已实现】│  │【已实现】│                      │
│  │调研规划 │  │范式分析 │  │看图评审 │                      │
│  │        │  │提示词   │  │结构化反馈│                      │
│  │        │  │生图     │  │        │                      │
│  └────────┘  └────────┘  └────────┘                      │
│                                                            │
│  配置：opencode.json — 模型、Agent定义、权限控制           │
└────────────────────────────────────────────────────────────┘

当前实现与目标的差距：
✅ Planner：已实现调研规划功能
✅ Designer：已实现范式分析 + 提示词 + 生图
✅ Critic：已实现看图评审 + 结构化反馈
⚠️ 迭代机制：已实现，但 Critic 反馈格式有时不够结构化
⚠️ 上下文传递：Subagent 看不到完整历史，依赖 Primary 传递
```

### 架构对比

| 维度 | 目标架构（理想流程） | 当前架构（OpenCode 实现） |
|------|---------------------|-------------------------|
| **Agent 关系** | 流水线式协作，环节清晰 | Primary 编排，层级调用 |
| **Planner** | 调研风格 + 输出任务清单 | ✅ 已实现 |
| **Designer** | 范式分析 → 提示词 → 生图 | ✅ 已实现 |
| **Critic** | 看图评价 + 结构化反馈（改范式/改提示词） | ✅ 基本实现，格式待优化 |
| **迭代机制** | Critic → Designer 双向反馈 | ✅ 已实现，通过文件传递 |
| **上下文** | 共享文件系统，环节透明 | Subagent 隔离，Primary 中转 |
| **OpenCode 支持** | 需要 Agent Team 模式 | ✅ 正式版支持 |
| **当前状态** | 概念设计 | ✅ 已跑通，待优化 |

---

## 当前架构详解

### 编排层

```
┌──────────────────────────────────────────────────────────┐
│  OpenCode 编排层                                          │
│                                                          │
│  opencode.json — 模型配置、Agent 定义、权限控制            │
│  AGENTS.md — Primary Agent 编排逻辑（步骤式调用）          │
│                                                          │
│  ┌──────────┐   ┌───────────┐   ┌──────────┐           │
│  │ @planner │──▶│ @designer │──▶│ @critic  │──┐        │
│  │  规划    │   │   设计    │   │  评审    │  │        │
│  └──────────┘   └─────┬─────┘   └──────────┘  │        │
│                       │                       │        │
│  └────────────────────┼───────────────────────┘        │
│                       │                                 │
│  ┌────────────────────┼──────────────────────────────┐ │
│  │  Skill 层（设计知识库）                              │ │
│  │                                                    │ │
│  │  brand-design/SKILL.md    — 品牌设计方法论         │ │
│  │  visual-output/SKILL.md   — 视觉资产生成指南       │ │
│  │  design-spec/SKILL.md     — 设计规范与 Token       │ │
│  │  copywriting/SKILL.md     — 文案写作指南           │ │
│  │  design-review/SKILL.md   — 评审标准与检查清单     │ │
│  │                                                    │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Custom Tools                                       │ │
│  │  text-to-image.ts — 图像生成（Gemini/gpt-image-2）  │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### 多智能体协作流程

```
用户输入 → @planner → @designer → @critic → 收敛判断
              ↓           ↓           ↓
         task_list.md  design_paradigm.md  review_roundN.md
         style_ref.md  prompts.md
                       *.png
```

### 迭代闭环

```
┌─────────────────────────────────────────┐
│  第1轮: @designer 生成初版               │
│       ↓                                 │
│       @critic 评审 (review_round1.md)   │
│       ↓                                 │
│       平均分 < 4/5 ? ──→ 是 ──→ 迭代    │
│       ↓ no                              │
│       结束                              │
└─────────────────────────────────────────┘

迭代: @designer 读取 review_roundN.md → 修改 → 重新生成 → @critic 再评
```

---

## Agent 职责

### @planner（调研规划）

**模型**: gpt-4.1-mini

**输入**: 用户品牌设计需求（品牌名、行业、调性）

**动作**:
1. 调研创智学院风格、理念、视觉特征
2. 分析品牌定位与创智的差异化方向
3. 输出具体设计任务清单

**输出**:
- `outputs/{项目}/task_list.md` — 设计任务清单
- `outputs/style_reference.md` — 风格参考模板（首次创建，后续复用）

**内容示例**:
```markdown
# 设计任务清单

## 品牌信息
- 品牌名: 上海创智
- 行业: 教育/科技
- 调性: 科技感、创新、年轻化

## 风格方向（参考创智，差异化）
- 主色: #00B4D8（科技蓝）
- 辅色: #0077B6（深蓝）
- 点缀色: #F77F00（活力橙）
- 风格关键词: 科技感、创新、年轻化

## 需要生成的图片

### 1. 吉祥物 (mascot)
- 用途: 品牌IP形象
- 风格: 可爱科技风吉祥物
- 色彩: 主色#00B4D8 + 辅色#0077B6 + 点缀#F77F00
- 保存路径: outputs/上海创智/mascot.png
```

---

### @designer（范式分析 + 执行）

**模型**: gpt-4o

**输入**: task_list.md + style_reference.md

**动作**:
1. **范式分析**: 根据品牌理念分析设计范式
   - 色彩系统（主色/辅色/点缀色 + 精确色值）
   - 字体选择（风格/用途）
   - 风格关键词（科技感/年轻化等）
2. **提示词工程**: 为每张图编写精准提示词
3. **图像生成**: 调用 text-to-image Tool 生图

**输出**:
- `outputs/{项目}/design_paradigm.md` — 设计范式
- `outputs/{项目}/prompts.md` — 提示词记录
- `outputs/{项目}/*.png` — 生成的图片

**迭代时**:
- 读取 Critic 的 review_roundN.md
- 如果是"范式问题" → 修改 design_paradigm.md
- 如果是"提示词问题" → 修改 prompts.md
- 只重新生成需要修改的图片

---

### @critic（评审 + 反馈）

**模型**: gpt-4o（多模态，能看图）

**输入**: design_paradigm.md + prompts.md + *.png

**动作**:
1. **评价每张图**（1-5分）
2. **诊断问题类型**:
   - 范式问题（色彩不对/风格不符）→ 建议修改 design_paradigm.md
   - 提示词问题（描述不准/细节缺失）→ 建议修改 prompts.md
3. **输出结构化改进建议**（可直接执行）

**输出**: `outputs/{项目}/review_roundN.md`

**要求格式**:
```markdown
# 评审报告 - 第N轮

## 总体评分
- 平均分: X/5

## 需要修改的图片

### 图片1: mascot.png
- 评分: 3/5
- 问题类型: 范式问题（色彩偏差）
- 当前范式: 主色 #00B4D8
- 建议修改为: 主色 #0077B6（更深沉，更专业）
- 原因: 当前蓝色太亮，不够沉稳

### 图片2: logo.png
- 评分: 2/5
- 问题类型: 提示词问题
- 当前提示词: "cute robot owl..."
- 建议修改提示词为: "professional tech owl, sharp edges, metallic texture..."
- 原因: 太可爱，不够专业

## 保留不变的图片
无
```

---

## 收敛条件

满足任一即结束：

1. **平均分 ≥ 4/5**（80% 以上）
2. **轮次 ≥ 3**（成本控制）

否则回到 Designer 迭代。

---

## 图像生成方案

### 模型选择

| 模型 | 时延 | 稳定性 | 备注 |
|------|------|--------|------|
| **gemini-2.5-flash-image** | ~10秒 | ✅ 高 | 推荐，走 chat/completions |
| gpt-image-2 | ~4-5分钟 | ❌ 低 | 经常 timeout |

### 技术实现

**Gemini**（推荐）:
- API: `/v1/chat/completions`
- 请求: `{ model, messages: [{role, content}] }`
- 响应: 图片内联在 `choices[0].message.content`（base64）

**gpt-image-2**（备用）:
- API: `/v1/images/generations`
- 请求: `{ model, prompt, n, size }`
- 响应: `data[0].b64_json`

### Custom Tool

`text-to-image.ts` — OpenCode Custom Tool，封装上述两种 API 调用。

---

## 权限配置

### Primary Agent (build)

```json
{
  "steps": 20,
  "permission": {
    "text-to-image": "deny",
    "bash": { "*": "deny" },
    "edit": { "*": "deny" }
  }
}
```

Primary 只负责编排，不直接执行设计工作。

### Subagents (planner/designer/critic)

```json
{
  "permission": {
    "edit": { "*": "allow" },
    "bash": { "*": "allow" }
  }
}
```

Subagents 可以自主读写文件、执行命令。

---

## 文件结构

```
agent-harness-design/
├── opencode.json              # 主配置（模型、Agent、权限）
├── AGENTS.md                  # Primary Agent 编排逻辑
├── DEVLOG.md                  # 开发日志
├── README.md                  # 项目说明
├── WORKFLOW.md                # 工作流与调试记录
├── test-image-latency.ts      # 时延测试脚本
│
├── .opencode/
│   ├── agents/
│   │   ├── planner.txt        # Planner prompt
│   │   ├── designer.txt       # Designer prompt
│   │   └── critic.txt         # Critic prompt
│   │
│   ├── skills/
│   │   ├── brand-design/SKILL.md
│   │   ├── visual-output/SKILL.md
│   │   ├── design-spec/SKILL.md
│   │   ├── copywriting/SKILL.md
│   │   └── design-review/SKILL.md
│   │
│   └── tools/
│       ├── text-to-image.ts       # 图像生成 Tool
│       └── text-to-image-simple.ts # 独立 CLI 备用
│
└── outputs/
    └── {项目名}/
        ├── task_list.md
        ├── style_reference.md
        ├── design_paradigm.md
        ├── prompts.md
        ├── mascot.png
        ├── logo.png
        ├── review_round1.md
        └── review_round2.md
```

---

## 交付物

```
outputs/{项目名}/
├── task_list.md              # 设计任务清单（Planner 输出）
├── style_reference.md        # 风格参考（复用）
├── design_paradigm.md        # 设计范式（Designer 输出）
├── prompts.md                # 提示词记录（Designer 输出）
├── mascot.png                # 吉祥物
├── logo.png                  # Logo
├── merch_*.png               # 文创周边
├── review_round1.md          # 第1轮评审（Critic 输出）
└── review_round2.md          # 第2轮评审（如迭代）
```

---

## 历史变更

### v0.4.0 架构调整

**之前**: 4 个 Agent（planner/designer/visual-designer/critic）
**现在**: 3 个 Agent（planner/designer/critic）

Visual Designer 合并到 Designer + visual-output Skill，简化架构。

### v0.5.0 编排修复

- 增加 `build.steps: 20` 确保 Primary 能完成多步编排
- 增加 permission 控制，Primary 不能直接调 Tool
- 重写 AGENTS.md 为强制步骤式

### v0.6.0 图像模型切换

- 从 gpt-image-2 切换到 gemini-2.5-flash-image
- 时延从 4-5 分钟降到 ~10 秒
- 解决 OpenCode Tool timeout 问题

---

## 与基线方案的对比

| 维度 | 基线方案 | 本系统 |
|------|---------|--------|
| Agent 数量 | 3 个 | 3 个 |
| 图像生成 | Mock/无 | Gemini API（~10秒） |
| 迭代闭环 | 简单评分 | 结构化评审 + 强制迭代 |
| 设计知识 | 内嵌 prompt | SKILL.md 可独立维护 |
| 风格参考 | 无 | 创智风格模板 |
