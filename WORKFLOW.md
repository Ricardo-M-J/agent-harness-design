# Agent Harness for Design - 工作流文档

> 本文档记录项目的完整测试、调试、Git 闭环流程
> 更新日期：2026-05-18

---

## 🔐 重要凭证

### GitHub Personal Access Token
```
ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**注意**：此 Token 用于 GitHub CLI 登录，Git 推送需使用 Classic Token。

**获取方式**：
1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 勾选 `repo` 权限
4. 生成后复制 token

### GitHub Classic Token（用于 Git 推送）
```
ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**权限**：repo（完整仓库访问）

**获取方式**：同上

---

## 🧪 测试流程

### 1. 环境检查

```bash
cd /workspace/agent-harness-design

# 检查 Node.js 和 OpenCode
node --version
opencode --version

# 检查 Git 状态
git status
git log --oneline -3
```

### 2. 运行完整设计流程

```bash
# 使用免费模型运行完整闭环
timeout 600 opencode run "请为'品牌名'生成品牌视觉资产" \
  -m opencode/deepseek-v4-flash-free 2>&1

# 或使用 minimax 模型
timeout 600 opencode run "请为'品牌名'生成品牌视觉资产" \
  -m opencode/minimax-m2.5-free 2>&1
```

### 3. 单独测试图像生成（创智 API）

```bash
# 生成吉祥物
npx tsx .opencode/tools/text-to-image-simple.ts \
  --prompt "cute mascot character, soft cloud-like starry creature" \
  --style mascot \
  --color_scheme "purple and gold" \
  --output "outputs/test/mascot.png"

# 生成 Logo
npx tsx .opencode/tools/text-to-image-simple.ts \
  --prompt "abstract geometric logo mark" \
  --style logo \
  --output "outputs/test/logo.png"

# 生成文创（T恤）
npx tsx .opencode/tools/text-to-image-simple.ts \
  --prompt "premium t-shirt with brand logo" \
  --style product \
  --output "outputs/test/tshirt.png"
```

### 4. 查看输出结果

```bash
# 查看生成的文件
find outputs/ -type f -name "*.png" -o -name "*.svg" -o -name "*.md" | sort

# 查看文件大小
ls -lh outputs/品牌名/
```

---

## 🐛 调试流程

### 常见问题及解决方案

#### 问题1：OpenCode 命令超时
**现象**：`timeout` 命令终止进程
**解决**：增加 timeout 时间或使用 `timeout 600`（10分钟）

```bash
timeout 600 opencode run "..." -m opencode/deepseek-v4-flash-free
```

#### 问题2：API 模型不存在
**现象**：`The model 'image2' does not exist`
**解决**：使用正确的模型名称 `gpt-image-2`

```bash
# 查询可用模型
curl -s -H "Authorization: Bearer sk-..." \
  https://apicz.boyuerichdata.com/v1/models | grep id
```

**可用图像模型**：
- `gpt-image-2` ✅（已测试）
- `gemini-2.5-flash-image`
- `gemini-2.5-pro-image`

#### 问题3：Git 推送失败
**现象**：`Authentication failed`
**解决**：使用 Classic Token 配置远程 URL

```bash
# 设置带 Token 的远程 URL（将 TOKEN 替换为你的 Classic Token）
git remote set-url origin \
  https://TOKEN@github.com/Ricardo-M-J/agent-harness-design.git

# 推送
git push origin main

# 安全：推送后移除 Token
git remote set-url origin https://github.com/Ricardo-M-J/agent-harness-design.git
```

#### 问题4：Git 身份未配置
**现象**：`Author identity unknown`
**解决**：

```bash
git config user.email "developer@example.com"
git config user.name "Developer"
```

---

## 🔄 Git 闭环流程

### 完整提交流程

```bash
cd /workspace/agent-harness-design

# 1. 查看变更
git status

# 2. 添加所有变更
git add -A

# 3. 提交（使用详细提交信息）
git commit -m "feat: 功能描述

- 变更点1
- 变更点2
- 变更点3

测试结果：描述测试结果"

# 4. 配置 Token（将 TOKEN 替换为你的 Classic Token）
git remote set-url origin \
  https://TOKEN@github.com/Ricardo-M-J/agent-harness-design.git

# 5. 推送到 GitHub
git push origin main

# 6. 安全：移除 URL 中的 Token
git remote set-url origin https://github.com/Ricardo-M-J/agent-harness-design.git

# 7. 验证推送
git log --oneline -3
git status
```

### 使用 GitHub CLI（推荐）

```bash
# 安装 gh（如未安装）
apt-get install -y gh

# 登录（使用 PAT，将 PAT 替换为你的 Personal Access Token）
echo "PAT" | gh auth login --with-token

# 验证登录
gh auth status

# 推送
git push origin main
```

---

## 📁 项目结构

```
agent-harness-design/
├── .opencode/
│   ├── agents/
│   │   ├── planner.txt          # 规划智能体
│   │   ├── designer.txt         # 设计智能体（全功能）
│   │   ├── designer-visual.txt  # 视觉设计智能体（图片生成）
│   │   └── critic.txt           # 评审智能体
│   ├── skills/
│   │   ├── brand-design/SKILL.md
│   │   ├── design-spec/SKILL.md
│   │   ├── design-review/SKILL.md
│   │   ├── copywriting/SKILL.md
│   │   └── visual-output/SKILL.md
│   └── tools/
│       ├── text-to-image.ts         # OpenCode Tool 格式
│       └── text-to-image-simple.ts  # 独立 CLI 工具
├── outputs/                     # 输出目录
│   └── {项目名}/
│       ├── planner_result.md
│       ├── design_system.md
│       ├── logo/
│       ├── mascot.png
│       └── merch/
├── opencode.json               # OpenCode 配置
├── AGENTS.md                   # 编排逻辑
├── ARCHITECTURE.md             # 架构说明
├── DEVLOG.md                   # 开发日志
└── WORKFLOW.md                 # 本文档
```

---

## 🎨 设计范式参考

### 创智学院风格

```yaml
色彩系统:
  主色: 极光蓝 #3B82F6 (oklch 55% 0.22 250)
  辅色: 能量橙 #F97316 (oklch 72% 0.18 70)
  深色: 深空蓝 #0F172A (oklch 18% 0.01 250)
  中性: 星尘灰 #F0F2F8 (oklch 92% 0.01 270)
  比例: 主色60% / 辅色30% / 深色10%

字体系统:
  中文: 思源黑体 (Noto Sans SC)
  英文: Outfit / Inter

风格特征:
  - 深色背景 + 蓝色主调 + 橙色点缀
  - 几何化、简洁线条
  - 科技感但不冰冷
  - 圆角: 卡片12px / 按钮8px
```

### 星云AI风格（差异化示例）

```yaml
色彩系统:
  主色: 星云紫 #6C3BD2
  辅色: 星辉金 #F5C842
  深色: 深空紫 #0F0A1E
  
调性: 从"竞技活力"转向"探索诗意"
```

---

## 🔧 配置参考

### OpenCode 免费模型

```json
{
  "model": "opencode/minimax-m2.5-free",
  "small_model": "opencode/deepseek-v4-flash-free"
}
```

### 创智 API 配置

```typescript
const API_BASE_URL = "https://apicz.boyuerichdata.com/v1";
const API_KEY = "sk-KQRts8IEJesfFj06YYsPXuleWodDxIlZ2t5g2A3DJDk0XRvJ";
const MODEL = "gpt-image-2";
```

---

## 📝 更新记录

| 日期 | 版本 | 内容 |
|------|------|------|
| 2026-05-15 | v0.1.0 | 初始版本，基础多智能体系统 |
| 2026-05-15 | v0.2.0 | 外联配置，Skill 实现 |
| 2026-05-18 | v0.3.0 | Visual Designer + 创智API集成 |

---

## ⚠️ 注意事项

1. **Token 安全**：推送完成后务必移除 URL 中的 Token
2. **超时设置**：Designer 阶段耗时较长，建议 timeout ≥ 600 秒
3. **API 限制**：创智 API 返回 base64 编码图像，需解码保存
4. **模型选择**：图像生成使用 `gpt-image-2`，非 `image2`
5. **输出检查**：定期清理 `outputs/` 目录，避免占用过多空间

---

*本文档由 AI 助手生成，用于项目维护和团队协作*
