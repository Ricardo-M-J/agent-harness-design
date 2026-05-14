# Agent Harness for Design

> 基于OpenCode的多智能体创意设计系统，实现轻量版Open Design，支持自迭代优化。

## 核心特性

- **多智能体协同**：Planner（规划）→ Designer（设计）→ Critic（评估）三Agent协作
- **自迭代优化**：基于结构化评分和差异化反馈的收敛迭代机制
- **Vibe Design**：用户输入自然语言设计需求，系统自主完成设计全流程

## 系统架构

```
用户输入 → @planner(方案) → @designer(设计v1) → @critic(评审)
  → 收敛判断 → 未收敛 → @designer(增量修改v2) → @critic(评审) → ...
  → 收敛 → 输出最终结果
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

然后在OpenCode中输入设计需求，例如：
```
请为创智学院做一套品牌形象设计
```

## 项目结构

```
agent-harness-design/
├── opencode.json              # OpenCode配置（Agent定义）
├── AGENTS.md                  # 编排逻辑（自迭代工作流）
├── .opencode/
│   ├── agents/                # Agent定义
│   │   ├── planner.md
│   │   ├── designer.md
│   │   └── critic.md
│   ├── skills/                # 设计技能
│   │   ├── brand-design/
│   │   ├── copywriting/
│   │   ├── design-spec/
│   │   └── design-review/
│   └── tools/                 # 自定义工具
│       └── text-to-image.ts
├── outputs/                   # 设计结果输出
├── ARCHITECTURE.md            # 架构说明
└── DEVLOG.md                  # 开发日志
```

## 自迭代机制

与普通单次pipeline不同，本系统的核心创新是**有效自迭代**：

1. **结构化评分**：Critic对五个维度打分（0-100）
2. **差异化反馈**：只针对低于70分的维度给出改进指令
3. **增量修改**：Designer只修改需要改进的部分
4. **收敛检测**：评分>=80或增量<5时停止迭代

详见 [ARCHITECTURE.md](./ARCHITECTURE.md)

## 技术栈

| 组件 | 技术 |
|------|------|
| Harness | OpenCode |
| Agent定义 | Markdown |
| 技能 | SKILL.md |
| 工具 | TypeScript Custom Tools |
| LLM | MiniMax（免费）/ Claude / GPT-4o |
| 文生图 | Mock（可替换为真实API） |

## 许可证

MIT