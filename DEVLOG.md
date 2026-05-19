# 开发日志 (DEVLOG)

## 项目信息
- **项目名称**：Agent Harness for Design
- **赛题**：赛题17 - 让AI像团队一样设计
- **框架**：OpenCode (opencode.ai)
- **GitHub**：https://github.com/Ricardo-M-J/agent-harness-design

---

## 项目定位

本项目是基于 OpenCode 的多智能体品牌设计系统，目标是让 AI 像团队一样完成品牌设计任务。

**可灵活调整**：
- Agent prompt
- Skill 定义
- 工具配置
- 模型选择
- 存储和上下文

**核心目标**：生成高质量的品牌视觉资产（Logo、吉祥物、文创周边、品牌页面），而非追求框架通用性。

---

## 环境配置

### API Keys

API Keys 和 Token 请查看本地 `WORKFLOW.md` 或联系项目管理员获取。

**创智 API 端点**: `https://apicz.boyuerichdata.com/v1`
**可用模型**: `gpt-image-2`, `gemini-2.5-flash-image`, `gpt-4o`, `o3-mini` 等

---

## 迭代记录

### v0.1.0 - 初始版本

**日期**：2026-05-15

**完成内容**：
- [x] 环境搭建（Bun + OpenCode CLI + GitHub）
- [x] 项目配置（opencode.json + .gitignore）
- [x] 三个 Agent 定义（planner/designer/critic）
- [x] 四个 Skill 定义（brand-design/copywriting/design-spec/design-review）
- [x] Custom Tool（text-to-image Mock）
- [x] AGENTS.md（自迭代编排逻辑）
- [x] 文档（README + ARCHITECTURE + DEVLOG）

**技术决策**：
1. 使用 OpenCode 的 Subagent 机制实现多 Agent
2. AGENTS.md 作为 Primary Agent 的系统提示来编排工作流
3. 文生图使用 Mock 模式（SVG 占位图），后续可替换为真实 API
4. 自迭代通过 Critic 的结构化评分 + 收敛检测实现

---

### v0.2.0 - 外联配置版本

**日期**：2026-05-15

**完成内容**：
- [x] 外联配置文件（.txt 格式替代 .md）
- [x] 4 个自定义 Skill 实现（作为 subagent）
- [x] 完整闭环测试通过

**技术决策**：
1. 使用 `.txt` 文件格式避免 Markdown 解析问题
2. Skill 通过 subagent 方式实现
3. 所有配置文件存放在 `.opencode/` 目录下

**验证结果**：
- 外联文件引用 `{file:.opencode/agents/planner.txt}` 正常工作
- 完整工作流程：规划→设计→评审→输出，全部正常运行

---

### v0.3.0 - 视觉设计优化 + 创智API集成

**日期**：2026-05-18

**完成内容**：
- [x] 集成上海创智 API（gpt-image-2 模型）用于图像生成
- [x] 提取创智学院设计范式（极光蓝+能量橙配色、字体系统、风格特征）
- [x] 配置创智 API 模型（gpt-4o, o3-mini, gpt-4.1-mini 等）
- [x] 测试验证完整闭环：Planner → Designer → 图像输出

**测试结果**：
- 成功生成星云AI品牌视觉资产包（Logo/SVG + 吉祥物/PNG + 文创/PNG）
- 图像生成耗时：约 20-35 秒/张

---

### v0.4.0 - 架构优化：Skill 化

**日期**：2026-05-18

**完成内容**：
- [x] 将 Visual Designer 合并到 Designer + Skill 方案
- [x] 更新 `visual-output/SKILL.md`，包含完整的视觉资产生成流程
- [x] 更新 Designer prompt，根据任务类型动态加载 Skill
- [x] 简化 opencode.json，移除独立的 visual-designer Agent
- [x] 移除"薄 Harness + 厚 Skill"理念，明确项目定位

**架构调整**：

| 之前 | 现在 |
|------|------|
| 独立 visual-designer Agent | Designer + visual-output Skill |
| 4 个 Agent | 3 个 Agent（planner/designer/critic） |
| prompt 内嵌设计知识 | Skill 存放设计知识 |

**理由**：
1. 更简洁的架构
2. Designer 可根据任务灵活加载不同 Skill
3. Skill 可独立更新，不影响 Agent 配置

**当前 Agent 配置**：

| Agent | 模型 | 职责 |
|-------|------|------|
| **Primary** | gpt-4o | 编排协调 |
| **Planner** | gpt-4.1-mini | 规划分析 |
| **Designer** | gpt-4o | 创意执行（加载 visual-output/copywriting 等 Skill） |
| **Critic** | o3-mini | 评审推理 |

**下一步计划**：
- [ ] 测试新架构是否正常工作
- [ ] 优化提示词模板
- [ ] 添加更多文创品类

---

### v0.5.0 - 闭环调试 + 多Agent编排修复

**日期**：2026-05-18

**完成内容**：
- [x] 诊断并修复 Primary Agent 不调用 Critic 的根因
- [x] 配置 subagent 权限（edit/bash allow）
- [x] 配置 build agent 权限（deny text-to-image/bash/edit）
- [x] 设置 build agent steps: 20
- [x] 重写 AGENTS.md 为强制步骤式编排
- [x] 重写 Planner prompt（移除 websearch 依赖，使用内置知识）
- [x] 重写 Designer prompt（明确 output_path 和 width/height）
- [x] 重写 Critic prompt（强制看图 + 至少一张图 3/5 分）
- [x] 增加 text-to-image Tool timeout 到 360 秒
- [x] **完整闭环测试通过**：Planner → Designer → Critic → 迭代Designer

**关键问题修复记录**：

| 问题 | 根因 | 修复 |
|------|------|------|
| Primary Agent 不调用 Critic | 1. build agent 无 steps 限制 2. Primary 直接调 text-to-image Tool | 1. build.steps=20 2. permission deny text-to-image/bash/edit |
| Subagent 无法写文件 | 默认权限 deny edit | 显式 permission: edit allow |
| Planner 卡在 websearch | gpt-4.1-mini 通过创智 API 不支持 websearch | 改用内置知识 |
| Designer 传 undefined width/height | prompt 不够明确 | 明确要求 width=1024 height=1024 |
| Critic 不看图只看文档 | prompt 未强调看图 | 强制"直接读取图片文件" |
| Critic 全给高分不触发迭代 | 评审标准太宽松 | 要求"至少一张图 3/5 分" |

**测试结果**：
- ✅ Planner → task_list.md 生成
- ✅ Designer → design_paradigm.md + prompts.md + mascot.png 生成
- ✅ Critic → review_round1.md 生成（67/100，触发迭代）
- ✅ 迭代 Designer → 根据评审建议重新生成图片
- ✅ 完整闭环：Planner → Designer → Critic → 迭代Designer

**已知问题**：
- API 响应时间不稳定（2-5 分钟/张），有时会 timeout
- Designer 偶尔传 undefined 的 width/height
- 图片保存路径偶尔不在指定目录
- Critic 评审格式不完全符合模板（但内容有效）

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
                               │                               │
                               ▼                               ▼
                        ┌─────────────┐                 ┌─────────────┐
                        │   未收敛    │                 │    收敛    │
                        │ 返回@designer│                │  输出结果  │
                        │  (迭代优化) │                 │             │
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

1. **平均分 ≥ 4/5**（即 80% 以上）→ 结束
2. **轮次 ≥ 3** → 结束（避免无限循环）
3. **否则** → 回到 Designer 进行迭代

### 迭代机制

- Critic 必须指出至少 1 张图的问题（评分 ≤ 3/5）
- Critic 给出完整的新提示词，Designer 直接复制使用
- Designer 只重新生成需要修改的图片，保留不变的图片
- 每轮迭代更新 `review_round{N}.md`

---

## 当前架构

```
.opencode/
├── agents/
│   ├── planner.txt          # 规划智能体
│   ├── designer.txt         # 设计智能体（根据任务加载 Skill）
│   └── critic.txt           # 评审智能体
├── skills/
│   ├── brand-design/SKILL.md    # 品牌设计知识
│   ├── visual-output/SKILL.md   # 视觉资产生成（Logo/吉祥物/文创/HTML）
│   ├── copywriting/SKILL.md     # 文案知识
│   ├── design-spec/SKILL.md     # 设计规范
│   └── design-review/SKILL.md   # 评审知识
└── tools/
    ├── text-to-image.ts         # OpenCode Tool 格式
    └── text-to-image-simple.ts  # 独立 CLI 工具
```

---

## 交付物清单

```
outputs/{项目名}/
├── planner_result.md          # 品牌规划
├── design_system.md           # 设计系统声明
├── logo/
│   ├── logo_full.svg          # Logo 方案
│   ├── logo_mono.svg
│   └── logo_inverse.svg
├── mascot.png                 # 吉祥物
├── merch/
│   ├── tshirt.png             # T恤
│   ├── badge.png              # 徽章
│   └── notebook.png           # 笔记本
└── brand_page.html            # 品牌展示页面
```
