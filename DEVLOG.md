# 开发日志 (DEVLOG)

## 项目信息
- **项目名称**：Agent Harness for Design
- **赛题**：赛题17 - 让AI像团队一样设计
- **框架**：OpenCode (opencode.ai)
- **GitHub**：https://github.com/Ricardo-M-J/agent-harness-design

---

## 环境配置

### API Keys

API Keys 和 Token 请查看本地 `WORKFLOW.md` 或联系项目管理员获取。

**创智 API 端点**: `https://apicz.boyuerichdata.com/v1`
**可用模型**: `gpt-image-2`, `gemini-2.5-flash-image`, `gemini-2.5-pro-image`

---

## 迭代记录

### v0.1.0 - 初始版本（进行中）

**日期**：2026-05-15

**完成内容**：
- [x] 环境搭建（Bun + OpenCode CLI + GitHub）
- [x] 项目配置（opencode.json + .gitignore）
- [x] 三个Agent定义（planner/designer/critic）
- [x] 四个Skill定义（brand-design/copywriting/design-spec/design-review）
- [x] Custom Tool（text-to-image Mock）
- [x] AGENTS.md（自迭代编排逻辑）
- [x] 文档（README + ARCHITECTURE + DEVLOG）

**技术决策**：
1. 使用OpenCode的Subagent机制实现多Agent，而非Plugin
2. AGENTS.md作为Primary Agent的系统提示来编排工作流
3. 文生图使用Mock模式（SVG占位图），后续可替换为真实API
4. 自迭代通过Critic的结构化评分+收敛检测实现

**遇到的问题**：
1. Write工具无法直接写入E盘 → 改用PowerShell命令写入
2. gh CLI token过期 → 通过代理重新认证
3. npm包名错误（@opencode-ai/opencode → opencode-ai）
4. **配置文件引用问题**（严重）→ 外部文件引用导致OpenCode加载失败，改为内联配置

**解决方案**：
- 将所有Agent的prompt直接内联到`opencode.json`中
- 删除`.opencode`目录，避免自动安装依赖导致的冲突

**已验证**：
- [x] OpenCode正确识别自定义Agent（Planner/Designer/Critic）
- [x] Agent间正确传递上下文
- [x] 自迭代循环正常运行
- [x] 收敛检测有效（评分≥80分自动结束）

**测试结果**：
- 成功为创智学院生成品牌设计方案（评分 82.10/100）
- 成功为科技初创公司 Neuronic 生成品牌设计方案（评分 80.5/100）
- 完整交付物：品牌方案、设计成果、评审报告、最终报告

**v0.2.0 - 外联配置版本**

**完成内容**：
- [x] 外联配置文件（.txt格式替代.md）
- [x] 4个自定义Skill实现（作为subagent）
- [x] 完整闭环测试通过

**技术决策**：
1. 使用 `.txt` 文件格式避免 Markdown 解析问题
2. Skill 通过 subagent 方式实现（OpenCode 不支持顶级 skill 配置）
3. 所有配置文件存放在 `.opencode/` 目录下

**验证结果**：
- 外联文件引用 `{file:.opencode/agents/planner.txt}` 正常工作
- 自定义 Skill（brand-design/copywriting/design-review/design-spec）可调用
- 完整工作流程：规划→设计→评审→输出，全部正常运行

---

### v0.3.0 - 视觉设计优化 + 创智API集成

**日期**：2026-05-18

**完成内容**：
- [x] 新增 Visual Designer Agent，专注图片生成（Logo/吉祥物/文创）
- [x] 提取创智学院设计范式（极光蓝+能量橙配色、字体系统、风格特征）
- [x] 集成上海创智 API（gpt-image-2 模型）用于图像生成
- [x] 配置免费 OpenCode 模型（minimax-m2.5-free / deepseek-v4-flash-free）
- [x] 测试验证完整闭环：Planner → Visual Designer → 图像输出

**技术决策**：
1. **设计重心转移**：从"大量文案"转向"图片生成为主"
2. **设计范式复用**：基于创智学院风格做差异化变体，而非每次都重新制定
3. **API 选择**：使用创智提供的 `gpt-image-2` 模型（支持 base64 返回）
4. **工具架构**：保留原有 text-to-image.ts（OpenCode Tool 格式），新增 text-to-image-simple.ts（独立 CLI 工具）

**遇到的问题**：
1. **API 模型名称错误** → 实际可用模型为 `gpt-image-2`，而非 `image2`
2. **API 返回格式** → 创智 API 返回 base64 编码图像，需解码保存
3. **OpenCode run 命令超时** → Designer 阶段耗时较长，需设置足够长的 timeout

**解决方案**：
- 查询可用模型列表，确认 `gpt-image-2` 为有效图像模型
- 更新工具代码，支持 base64 解码和 URL 下载两种模式
- 使用 `timeout 300` 或更长时间运行完整设计流程

**已验证**：
- [x] 创智 API 图像生成成功（1024x1024 PNG）
- [x] Visual Designer Agent 正确生成：Logo(SVG) + 吉祥物(PNG) + 文创(PNG)
- [x] 设计范式提取准确，可用于后续项目参考
- [x] 免费模型配置正确，无需 API Key 即可运行

**测试结果**：
- **星云AI品牌设计**：生成完整视觉资产包
  - 设计系统声明（星云紫 #6C3BD2 + 星辉金 #F5C842）
  - Logo 9个版本（螺旋方案+星座方案，全彩/单色/反白）
  - 吉祥物 Nebby（紫色云朵生物，1088KB PNG）
  - 文创周边：T恤、徽章、笔记本（产品摄影风格）
- **创智 API 测试**：成功生成测试吉祥物，质量符合预期

**交付物清单**：
```
outputs/{项目名}/
├── planner_result.md              # 品牌规划
├── design_system.md               # 设计系统（简洁版）
├── logo/
│   ├── logo_spiral_full.svg       # Logo方案A-全彩
│   ├── logo_spiral_mono.svg       # Logo方案A-单色
│   ├── logo_spiral_inverse.svg    # Logo方案A-反白
│   ├── logo_constellation_*.svg   # Logo方案B
│   └── logo_*.svg                 # 组合Logo
├── mascot.png                     # 吉祥物
└── merch/
    ├── tshirt.png                 # T恤
    ├── badge.png                  # 徽章
    └── notebook.png               # 笔记本
```

**下一步计划**：
- [ ] 优化提示词模板，提升图像生成质量
- [ ] 添加更多文创品类（帆布袋、贴纸、手机壳等）
- [ ] 实现批量生成和风格一致性控制
- [ ] 集成 Critic Agent 对视觉设计进行评审
