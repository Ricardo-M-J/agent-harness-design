# Agent Harness for Design

> 基于 OpenCode 的多智能体创意设计系统，实现轻量版 Open Design。
> **"薄 Harness + 厚 Skill"** — 设计能力编码在可移植的 SKILL.md 中。

## 核心特性

- **多智能体协同**：Planner（策略）→ Designer（执行）→ Critic（评审）三 Agent 协作
- **五维自评审**：Philosophy / Hierarchy / Execution / Specificity / Restraint 结构化评分
- **反套路机制**：Anti-AI-Cliché Blocklist + oklch 感知均匀色彩系统
- **设计 Token 系统**：Spec First — 先声明设计系统，再执行设计
- **自迭代优化**：差异化反馈 + 增量修改 + 收敛检测 + P0/P1/P2 质量门禁
- **HTML 品牌页面**：生成可直接展示的品牌形象页，非纯 Markdown 文档
- **免费文生图**：集成 Pollinations.ai，无需 API Key

## 系统架构

```
用户输入 → @planner(方案) → @designer(设计v1) → @critic(五维评审)
  → 收敛判断 → 未收敛 → @designer(增量修改v2) → @critic(评审) → ...
  → 收敛 → 输出 Markdown + HTML 品牌页面
```

## 快速开始

### 前提条件
- [Node.js](https://nodejs.org/) >= 18
- [OpenCode CLI](https://opencode.ai/) >= 1.14

### 安装 OpenCode
```bash
npm install -g opencode-ai
```

### 使用
```bash
cd agent-harness-design
opencode
```

然后在 OpenCode 中输入设计需求，例如：
```
请为创智学院做一套品牌形象设计
```

## 项目结构

```
agent-harness-design/
├── opencode.json              # OpenCode 配置（薄 — 路由 + Agent参数）
├── AGENTS.md                  # 编排逻辑（薄 — 工作流 + 迭代判断）
├── .opencode/
│   ├── agents/                # Agent 定义（中等厚度）
│   │   ├── planner.txt        #   设计策略师 (80行)
│   │   ├── designer.txt       #   创意执行者 (100行)
│   │   └── critic.txt         #   设计评审专家 (100行)
│   ├── skills/                # 设计知识（厚 — 真正的护城河）
│   │   ├── brand-design/      #   品牌设计 (400行)
│   │   │   └── SKILL.md       #     反套路清单+oklch+6组配对+6步工作流
│   │   ├── design-spec/       #   设计规范 (200行)
│   │   │   └── SKILL.md       #     Token系统+多格式导出
│   │   ├── design-review/     #   设计评审 (150行)
│   │   │   └── SKILL.md       #     五维评审+AI套路检测+P0/P1/P2
│   │   ├── copywriting/       #   创意文案 (150行)
│   │   │   └── SKILL.md       #     标语体系+品牌故事+文案禁令
│   │   └── visual-output/     #   品牌页面 (200行)
│   │       └── SKILL.md       #     HTML页面6步工作流+质量标准
│   └── tools/                 # 自定义工具
│       └── text-to-image.ts   #   文生图 (Pollinations.ai 免费API)
├── outputs/                   # 设计结果输出
├── ARCHITECTURE.md            # 架构说明
└── README.md
```

## 自迭代机制

1. **五维评分**：Critic 对哲学性/层级性/执行度/特异性/克制感五个维度打分（1-5）
2. **AI 套路检测**：7 项检测（紫粉渐变/Emoji/字体懒惰/虚假数据等）+ 扣分
3. **P0/P1/P2 质量门禁**：P0 不通过 = 强制迭代
4. **差异化反馈**：只针对 < 3/5 的维度给出改进指令
5. **增量修改**：Designer 只修改需要改进的部分
6. **收敛检测**：评分 ≥ 80 或 增量 < 5 或 轮次 ≥ 5 时停止

## 技术栈

| 组件 | 技术 |
|------|------|
| Harness | OpenCode |
| Agent 定义 | Markdown / TXT |
| 技能 (Skills) | SKILL.md (跨框架可移植) |
| 工具 (Tools) | TypeScript + Pollinations.ai |
| LLM | MiniMax / Claude / GPT-4o |
| 文生图 | Pollinations.ai (免费) |
| 输出 | Markdown + HTML 品牌页面 |

## 与基线方案的对比

| 维度 | v0.2.0 基线 | v1.0 本系统 |
|------|------------|-------------|
| Agent prompt | ~15 行 | ~80-100 行 |
| Skill 深度 | ~5 行/个 | 100-400 行/个 |
| 评审体系 | 4 维简单评分 | 五维 + AI套路检测 + 质量门禁 |
| 色彩系统 | HEX | oklch + 6 组精选配对 |
| 反套路 | 无 | Anti-AI-Cliché Blocklist |
| 文生图 | Mock | 免费 API |
| 输出形式 | 纯 MD | MD + HTML 品牌页面 |

## 许可证

MIT
