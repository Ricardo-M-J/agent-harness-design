# 系统架构说明

## 设计哲学

本项目是基于 OpenCode 的多智能体品牌设计系统，目标是让 AI 像团队一样完成品牌设计任务。

**核心原则**：
- 实用优先：能跑通、能生成高质量视觉资产
- 灵活可调：Agent prompt、Skill、工具、模型、存储都可调整
- Skill 驱动：Agent 根据任务类型自动加载对应的 Skill，实现可扩展性
- 不追求通用框架：专注品牌设计场景

---

## 目标架构 vs 当前架构

### 目标架构（已实现）

**设计思路**：三个 Agent 形成完整的设计流水线，每个环节有明确的输入输出和迭代反馈机制。Designer 根据任务类型自动加载 Skill。

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
│  │ 输出：task_list.md                                               │   │
│  │   - 品牌理念定位                                                  │   │
│  │   - 具体要生成哪些图（吉祥物/Logo/文创）                          │   │
│  │   - 每张图的用途和风格方向                                        │   │
│  └────────────────────────────┬─────────────────────────────────────┘   │
│                               ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ @designer（范式分析 + 执行）                                      │   │
│  │                                                                  │   │
│  │ Step 1: 读取 task_list.md                                        │   │
│  │ Step 2: 【关键】根据任务类型加载 Skill                            │   │
│  │   - 品牌设计 → brand-design/SKILL.md                             │   │
│  │   - 视觉输出 → visual-output/SKILL.md                            │   │
│  │   - 文案需求 → copywriting/SKILL.md                              │   │
│  │   - 设计规范 → design-spec/SKILL.md                              │   │
│  │ Step 3: 使用 Skill 模板生成设计文档                               │   │
│  │   - 色彩系统（oklch + HEX）                                       │   │
│  │   - 字体选择（非 Inter/Roboto）                                   │   │
│  │   - 反套路检查清单                                                │   │
│  │ Step 4: 调用 text-to-image Tool 生图                            │   │
│  │                                                                  │   │
│  │ 输出：design_paradigm.md + prompts.md + *.png                    │   │
│  └────────────────────────────┬─────────────────────────────────────┘   │
│                               ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ @critic（评审 + 反馈）                                            │   │
│  │                                                                  │   │
│  │ 输入：范式 + 提示词 + 生成的图片                                  │   │
│  │ 动作：                                                            │   │
│  │   1. 使用 bash 读取图片（base64）                                 │   │
│  │   2. 三维度评分（品牌契合度40%/视觉冲击力30%/执行质量30%）        │   │
│  │   3. 诊断问题类型：                                               │   │
│  │      - 品牌契合度 < 4/5 → 修改 design_paradigm.md               │   │
│  │      - 视觉/执行 < 4/5 → 修改 prompts.md                        │   │
│  │   4. 输出结构化改进建议（可直接执行）                             │   │
│  │                                                                  │   │
│  │ 输出：review_roundN.md（使用 edit 工具写入文件）                 │   │
│  └────────────────────────────┬─────────────────────────────────────┘   │
│                               │                                         │
│              ┌────────────────┴────────────────┐                       │
│              ▼                                 ▼                       │
│        【未收敛】总分 < 4.0          【收敛】总分 ≥ 4.0                  │
│              │                                 │                       │
│              ▼                                 ▼                       │
│        回到 @designer                  输出最终结果                     │
│        （读取 review_roundN.md         （所有设计资产）                 │
│         修改范式/提示词 → 重新生图）                                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

关键设计：
- Skill 驱动：Designer 根据任务自动加载对应 Skill，实现可扩展
- 双向迭代：Critic 的反馈可以作用于范式层或执行层
- 结构化输出：每个环节的输出是下一环节的输入
- 可执行的改进建议：Critic 给出的是可直接替换的范式/提示词
```

---

## 当前架构（OpenCode 实现）

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
│  │        │  │【Skill驱动】│  │【已实现】│                      │
│  │调研规划 │  │范式分析 │  │看图评审 │                      │
│  │        │  │提示词   │  │结构化反馈│                      │
│  │        │  │生图     │  │        │                      │
│  └────────┘  └────────┘  └────────┘                      │
│                                                            │
│  配置：opencode.json — 模型、Agent定义、权限控制           │
└────────────────────────────────────────────────────────────┘
```

### 架构对比

| 维度 | 目标架构 | 当前架构 |
|------|---------|---------|
| **Agent 关系** | 流水线式协作，环节清晰 | Primary 编排，层级调用 |
| **Planner** | 调研风格 + 输出任务清单 | ✅ 已实现 |
| **Designer** | Skill 驱动，可扩展 | ✅ 已实现 |
| **Critic** | 三维评分 + 结构化反馈 | ✅ 已实现 |
| **迭代机制** | Critic → Designer 双向反馈 | ✅ 已实现 |
| **Skill 系统** | Designer 自动加载 Skill | ✅ 已实现 |
| **当前状态** | 概念设计 | ✅ 已跑通 |

---

## Skill 系统详解

### Skill 设计哲学

**核心思想**：将设计知识编码为可复用的 Skill 文档，Designer 根据任务类型自动加载。

```
┌─────────────────────────────────────────────────────────────┐
│                     Skill 驱动架构                           │
│                                                             │
│  用户输入                                                    │
│     │                                                       │
│     ▼                                                       │
│  @planner ──→ task_list.md（包含任务类型）                   │
│     │                                                       │
│     ▼                                                       │
│  @designer ──→ 读取 task_list.md                            │
│     │                                                       │
│     ├── 任务包含"品牌设计" → 加载 brand-design/SKILL.md      │
│     ├── 任务包含"文创" → 加载 visual-output/SKILL.md        │
│     ├── 任务包含"文案" → 加载 copywriting/SKILL.md          │
│     └── 任务包含"规范" → 加载 design-spec/SKILL.md          │
│     │                                                       │
│     ▼                                                       │
│  使用 Skill 模板生成设计文档                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 已定义的 Skills

| Skill | 路径 | 用途 | 关键内容 |
|-------|------|------|----------|
| **brand-design** | `.opencode/skills/brand-design/SKILL.md` | 品牌形象设计 | 反套路清单、oklch色彩系统、6组色彩x字体配对 |
| **visual-output** | `.opencode/skills/visual-output/SKILL.md` | 视觉资产生成 | Logo/吉祥物/文创/品牌页面生成指南 |
| **design-spec** | `.opencode/skills/design-spec/SKILL.md` | 设计规范文档 | Design Token系统（色彩/字体/间距/圆角/阴影/动效） |
| **copywriting** | `.opencode/skills/copywriting/SKILL.md` | 品牌文案 | 标语体系、品牌故事、宣言模板 |
| **design-review** | `.opencode/skills/design-review/SKILL.md` | 设计评审 | 五维评分框架（已废弃，Critic使用简化版） |

### Skill 调用机制

**Designer 的工作流**：

```
Step 1: 读取 task_list.md
Step 2: 【关键】根据任务类型加载 Skill
        - 使用 read 工具读取对应的 SKILL.md 文件
        - 解析 Skill 中的模板和方法论
Step 3: 使用 Skill 模板生成 design_paradigm.md
        - 品牌基础（名称/定位/个性/受众）
        - 色彩系统（oklch + HEX）
        - 字体选择（非 Inter/Roboto）
        - 反套路检查清单
Step 4: 使用 Skill 模板生成 prompts.md
Step 5: 调用 text-to-image Tool 生图
```

### 扩展新 Skill

要添加新的设计能力，只需：

1. 创建 `.opencode/skills/{skill-name}/SKILL.md`
2. 在 `designer.txt` 中添加 Skill 映射规则
3. 在 `task_list.md` 中使用对应的关键词触发

示例：添加"动画设计" Skill

```markdown
# .opencode/skills/animation-design/SKILL.md

---
name: animation-design
description: 品牌动画设计：动效规范、转场效果、微交互
---

## 动画原则
...
```

在 `designer.txt` 中添加：
```markdown
- 任务包含"动画"、"动效"、"micro-interaction" → 读取 `.opencode/skills/animation-design/SKILL.md`
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
- 风格预设: mascot
- 色彩: 主色#00B4D8 + 辅色#0077B6 + 点缀#F77F00
- 保存路径: outputs/上海创智/mascot.png

### 2. 文创帆布袋 (tote_bag)
- 用途: 品牌周边
- 风格预设: tote_bag
- 色彩: 与吉祥物配色一致
- 保存路径: outputs/上海创智/tote_bag.png
```

---

### @designer（范式分析 + 执行）

**模型**: gpt-4o

**输入**: task_list.md + style_reference.md

**关键改进：Skill 驱动**

**动作**:
1. **读取任务清单**，分析设计需求
2. **【关键】根据任务类型加载 Skill**：
   - 品牌设计 → `brand-design/SKILL.md`
   - 视觉输出 → `visual-output/SKILL.md`
   - 文案需求 → `copywriting/SKILL.md`
   - 设计规范 → `design-spec/SKILL.md`
3. **使用 Skill 模板生成设计范式**：
   - 品牌基础（名称/定位/个性/受众）
   - 色彩系统（oklch + HEX，非 Tailwind 默认蓝）
   - 字体选择（Outfit/思源黑体，非 Inter/Roboto）
   - 反套路检查清单
4. **使用 Skill 模板生成提示词**
5. **调用 text-to-image Tool 生图**

**输出**:
- `outputs/{项目}/design_paradigm.md` — 设计范式（使用 Skill 模板）
- `outputs/{项目}/prompts.md` — 提示词记录
- `outputs/{项目}/*.png` — 生成的图片

**迭代时**:
- 读取 Critic 的 review_roundN.md
- 品牌契合度 < 4/5 → 修改 design_paradigm.md（参考 Skill 模板）
- 视觉/执行 < 4/5 → 修改 prompts.md
- 只重新生成需要修改的图片

---

### @critic（评审 + 反馈）

**模型**: gpt-4o（多模态，能看图）

**输入**: design_paradigm.md + prompts.md + *.png

**关键改进**：
- 使用 bash 读取图片（base64）
- 简化为三维度评分
- 必须使用 edit 工具写入文件

**动作**:
1. **使用 bash 读取图片**：`base64 -w 0 outputs/{项目}/*.png`
2. **三维度评分**：
   - 品牌契合度（40%权重）
   - 视觉冲击力（30%权重）
   - 执行质量（30%权重）
3. **诊断问题类型**：
   - 品牌契合度 < 4/5 → 建议修改 design_paradigm.md
   - 视觉/执行 < 4/5 → 建议修改 prompts.md
4. **使用 edit 工具写入 review_roundN.md**

**输出**: `outputs/{项目}/review_roundN.md`

**要求格式**:
```markdown
# 评审报告 - 第{N}轮

## 总体评分
- 加权总分: X.X/5
- 是否需要迭代: 是 / 否
- 判定理由: [具体说明]

## 三维度评分

| 维度 | 权重 | 评分 | 判断依据 |
|------|------|------|----------|
| 品牌契合度 | 40% | X/5 | [对照 task_list.md 和 design_paradigm.md 的具体说明] |
| 视觉冲击力 | 30% | X/5 | [第一眼的直观感受] |
| 执行质量 | 30% | X/5 | [色彩、构图、细节的具体问题] |

## 需要修改的图片

### 图片1: mascot.png
- 评分: X/5
- 问题类型: 品牌契合度 / 视觉冲击力 / 执行质量
- 具体问题: [详细描述]
- 当前提示词: "..."
- 建议修改提示词为: "..."（完整的新提示词，Designer 可直接复制）
- 原因: [具体说明]

## 迭代建议

### 必须修复
- [具体问题1，关联到某个维度]
- [具体问题2，关联到某个维度]

### 建议优化
- [可选改进]

## 评审结论

- 最终总分: XX/100
- 判定: 🔄 需迭代 / ✅ 通过
```

---

## 迭代闭环

```
┌─────────────────────────────────────────┐
│  第1轮: @designer 生成初版               │
│       ↓                                 │
│       @critic 评审 (review_round1.md)   │
│       ↓                                 │
│       总分 < 4.0 ? ──→ 是 ──→ 迭代      │
│       ↓ no                              │
│       结束                              │
└─────────────────────────────────────────┘

迭代: @designer 读取 review_roundN.md → 修改 → 重新生成 → @critic 再评
```

---

## Custom Tools

### text-to-image.ts

**功能**: 使用 Gemini API 生成设计图像

**支持的风格预设**:
- 基础设计: logo, poster, banner, card, social, icon, brand_image, illustration, mascot, product
- 文创产品: tote_bag, mug, notebook, sticker, t_shirt

**当前模型**: gemini-2.5-flash-image（gemini-3-pro-image-preview 暂时不可用）

---

## 文件结构

```
agent-harness-design/
├── .opencode/
│   ├── agents/
│   │   ├── planner.txt      # Planner Agent 提示词
│   │   ├── designer.txt     # Designer Agent 提示词（Skill 驱动）
│   │   └── critic.txt       # Critic Agent 提示词
│   ├── skills/              # 【核心】Skill 系统
│   │   ├── brand-design/
│   │   │   └── SKILL.md     # 品牌设计方法论
│   │   ├── visual-output/
│   │   │   └── SKILL.md     # 视觉资产生成指南
│   │   ├── design-spec/
│   │   │   └── SKILL.md     # 设计规范与 Token
│   │   ├── copywriting/
│   │   │   └── SKILL.md     # 文案写作指南
│   │   └── design-review/
│   │       └── SKILL.md     # 评审标准（已废弃）
│   └── tools/
│       └── text-to-image.ts # 图像生成工具
├── AGENTS.md                # Primary Agent 编排逻辑
├── ARCHITECTURE.md          # 本文件
├── opencode.json            # OpenCode 配置
└── outputs/                 # 输出目录
    └── {项目名}/
        ├── task_list.md
        ├── design_paradigm.md
        ├── prompts.md
        ├── review_round1.md
        ├── review_round2.md
        └── *.png
```

---

## 关键改进总结

| 改进项 | 之前 | 现在 |
|--------|------|------|
| **Skill 调用** | Skill 是死文档，Agent 能力硬编码 | Designer 根据任务类型自动加载 Skill |
| **设计范式** | 简单色彩系统 | 使用 brand-design SKILL 的完整模板（oklch + 品牌基础） |
| **Critic 评分** | 五维评分 + AI套路检测 | 三维评分（品牌契合度/视觉冲击力/执行质量） |
| **Critic 读图** | 无法读取图片 | 使用 bash + base64 读取图片 |
| **文件保存** | 有时不保存文件 | 明确使用 edit 工具写入文件 |
| **字体选择** | 无明确要求 | 使用 Outfit/思源黑体（非 Inter/Roboto） |
| **色彩系统** | HEX 为主 | oklch + HEX 双系统 |
