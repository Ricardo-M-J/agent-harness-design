---
name: brand-design
description: 品牌形象设计：反套路清单 + oklch色彩系统 + 6组色彩x字体配对 + 6步工作流
---

# Brand Design Skill — 品牌形象设计

> 将设计品味编码为可执行规则。灵感来源：Claude Design / Open Design / web-design-skill

---

## 一、Anti-AI-Cliché Blocklist（反套路禁止清单）

在设计任何品牌视觉时，**严禁**使用以下 AI 生成内容中泛滥的模式：

### 色彩禁令
| 禁止 | 原因 | 替代方案 |
|------|------|----------|
| 紫-粉-蓝渐变 (`#7C3AED` → `#EC4899` → `#3B82F6`) | 90% AI 生成网页使用此渐变 | 使用 oklch 感知均匀色彩系统 |
| 纯蓝 `#3B82F6` 作为主色 | Tailwind 默认蓝，无差异化 | 从 6 组精选配色中选择 |
| 霓虹绿+深黑 (`#00FF00` + `#000000`) | 矩阵风套路，缺乏品牌感 | 用 oklch 创建有温度的暗色方案 |
| 白色背景 + 蓝色按钮的 SaaS 标配 | 千篇一律 | 探索深色/暖色/大地色背景 |

### 字体禁令
| 禁止 | 原因 | 替代方案 |
|------|------|----------|
| Inter 作为唯一字体 | 最泛滥的 AI 生成字体 | 作为辅助字体，搭配有特色的主字体 |
| Roboto | Material Design 默认，无个性 | Space Grotesk / Outfit / 思源黑体 |
| Arial | 默认回退字体，缺乏设计感 | 从字体配对方案中选择 |
| system-ui / -apple-system | 懒惰的系统回退 | 明确指定品牌字体栈 |

### 视觉元素禁令
| 禁止 | 原因 | 替代方案 |
|------|------|----------|
| 🚀⚡✨💡🔥 等 Emoji 替代图标 | 传达出不专业感 | 使用 `[icon]` 占位符或 SVG 几何图形 |
| 大圆角卡片堆叠 (24px+ border-radius) | Cookie-cutter SaaS 外观 | 差异化圆角策略（卡片 12px/按钮 8px/输入框 4px） |
| 彩色左边框 accent card | AI 生成的签名套路 | 通过阴影层级/排版对比/留白划分层级 |
| 虚假数据 ("10,000+ 用户" "99.9% 满意度") | 不可信，降低品牌可信度 | 询问真实数据或使用 `[数据待填充]` |
| 虚假客户 Logo 墙 (一排灰色方块) | 一眼假的 AI 生成 | 使用 `[合作伙伴 logo]` 占位符 |
| 虚假推荐语 + 圆形头像 | AI 内容农场既视感 | 使用 `[客户引言]` 占位符 |

### 布局禁令
| 禁止 | 原因 | 替代方案 |
|------|------|----------|
| 居中大标题 + 居中副标题 + 居中 CTA | 缺乏视觉张力 | 非对称布局、轴向构图、留白节奏 |
| 三列 feature 卡片 (icon + title + desc) | 最泛滥的 SaaS 布局 | 交错布局、bento grid、瀑布流 |
| Hero 区域巨大的紫色渐变模糊背景 | AI 生成网页的标志 | 使用品牌色的微妙纹理/几何图案 |

---

## 二、oklch 感知均匀色彩系统

### 为什么是 oklch 而非 HSL？

HSL 的明度（L）在不同色相下感知不一致。黄色的 `hsl(60, 100%, 50%)` 和蓝色的 `hsl(240, 100%, 50%)` 在 HSL 中明度相同，但人眼感知的亮度差异巨大。

oklch 使用 **L** (感知明度) + **C** (色度/饱和度) + **h** (色相)：
- 相同的 L 值 = 相同的感知亮度
- 锁定 C 和 h，仅变化 L → 视觉一致的色阶
- 更适合无障碍设计（WCAG 对比度计算）

### oklch 色阶生成法

```
主色：
  --color-primary-50:  oklch(97% 0.02 <hue>)
  --color-primary-100: oklch(92% 0.04 <hue>)
  --color-primary-200: oklch(85% 0.06 <hue>)
  --color-primary-300: oklch(75% 0.10 <hue>)
  --color-primary-400: oklch(65% 0.15 <hue>)
  --color-primary-500: oklch(55% 0.20 <hue>)  ← 基准
  --color-primary-600: oklch(45% 0.18 <hue>)
  --color-primary-700: oklch(35% 0.14 <hue>)
  --color-primary-800: oklch(25% 0.08 <hue>)
  --color-primary-900: oklch(15% 0.04 <hue>)

中性灰阶（锁定 hue=260, chroma≈0.01）：
  --color-gray-50:  oklch(98% 0.01 260)
  --color-gray-100: oklch(93% 0.01 260)
  --color-gray-500: oklch(55% 0.01 260)
  --color-gray-900: oklch(15% 0.01 260)
```

---

## 三、6 组精选色彩×字体配对

### 1. 现代科技 (Modern Tech)
- **主色**: Blue-Violet `oklch(55% 0.25 260)` — 冷静、专业、创新
- **辅助色**: Cool Gray `oklch(90% 0.01 250)` + Accent Cyan `oklch(70% 0.15 200)`
- **中文字体**: 思源黑体 (Noto Sans SC) — 现代几何感
- **英文主字体**: Space Grotesk — 几何无衬线，科技感
- **英文字体**: Inter — 高可读性 UI 字体
- **适用**: SaaS、开发者工具、AI 产品、科技教育

### 2. 优雅人文 (Elegant Editorial)
- **主色**: Warm Brown `oklch(35% 0.08 30)` — 温暖、知性、经典
- **辅助色**: Cream `oklch(97% 0.02 80)` + Accent Gold `oklch(75% 0.12 85)`
- **中文字体**: 思源宋体 (Noto Serif SC) — 人文气质
- **英文主字体**: Newsreader — 现代衬线，编辑感
- **英文辅助字体**: Outfit — 几何无衬线，现代平衡
- **适用**: 内容平台、教育机构、出版社、博客

### 3. 高级品牌 (Premium Brand)
- **主色**: Near-Black `oklch(18% 0.01 260)` — 克制、高端、永恒
- **辅助色**: Warm White `oklch(98% 0.01 100)` + Accent Gold `oklch(80% 0.12 90)`
- **中文字体**: 阿里巴巴普惠体 (Alibaba PuHuiTi) — 现代、专业
- **英文主字体**: Sora — 几何现代，高端感
- **英文辅助字体**: Plus Jakarta Sans — 温暖的人文无衬线
- **适用**: 奢侈品牌、金融机构、高端服务、商学院

### 4. 活力消费 (Lively Consumer)
- **主色**: Coral `oklch(68% 0.18 20)` — 温暖、活力、亲和
- **辅助色**: Soft Cream `oklch(96% 0.02 70)` + Accent Teal `oklch(55% 0.12 190)`
- **中文字体**: 得意黑 (Smiley Sans) — 圆润、友好
- **英文主字体**: Plus Jakarta Sans — 温暖圆润
- **英文辅助字体**: Outfit — 几何现代
- **适用**: 电商、社交平台、消费品牌、儿童教育

### 5. 极简专业 (Minimal Professional)
- **主色**: Teal-Blue `oklch(50% 0.12 200)` — 理性、可信、高效
- **辅助色**: Cool White `oklch(99% 0.005 240)` + Accent Slate `oklch(30% 0.02 250)`
- **中文字体**: 霞鹜文楷 (LXGW WenKai) — 简洁、现代中文
- **英文主字体**: Outfit — 几何无衬线
- **英文辅助字体**: Space Grotesk — 技术感平衡
- **适用**: 仪表盘、B2B 平台、数据产品、政务系统

### 6. 手工温暖 (Artisan Warmth)
- **主色**: Caramel `oklch(55% 0.12 80)` — 自然、手工、温度
- **辅助色**: Parchment `oklch(95% 0.03 90)` + Accent Olive `oklch(45% 0.10 140)`
- **中文字体**: 小赖体 (XiaoLai) — 手写感
- **英文主字体**: Caveat — 手写风格
- **英文辅助字体**: Newsreader — 衬线平衡
- **适用**: 餐饮、手工艺、自然教育、生活方式品牌

---

## 四、设计系统声明模板（Design Tokens First）

在开始任何具体设计之前，必须**先声明设计 Token**。使用以下模板：

```markdown
## 设计系统声明

### 品牌基础
- 品牌名称：[名称]
- 品牌定位：[一句话]
- 品牌个性：[3-5 个形容词]
- 目标受众：[描述]

### 色彩 (oklch)
- 主色 (Primary): oklch(L% C h) — [用途]
- 辅助主色 (Secondary): oklch(L% C h) — [用途]
- 点缀色 (Accent): oklch(L% C h) — [用途]
- 背景色 (Background): oklch(L% C h)
- 文字色 (Foreground): oklch(L% C h)
- 中性灰阶 (Gray Scale): oklch(L% 0.01 hue) 50→900
- 语义色 (Semantic): Success/Warning/Error/Info

### 字体
- 中文主字体: [字体名] — [用途层级]
- 中文辅助字体: [字体名]
- 英文主字体: [字体名] — [用途层级]
- 英文辅助字体: [字体名]
- 代码字体: JetBrains Mono / Fira Code
- 字号层级: 12/14/16/18/20/24/30/36/48/60/72

### 间距 (4px 基准)
- xs: 4px / sm: 8px / md: 16px / lg: 24px / xl: 40px / 2xl: 64px
- 内容最大宽度: 1200px (桌面) / 100% (移动)

### 圆角策略
- 卡片: 12px / 按钮: 8px / 输入框: 4px / 标签: 9999px (全圆角)
- 模态框: 16px / 图标容器: 8px

### 阴影层级
- elevation-1 (微妙): 0 1px 3px rgba(0,0,0,0.08)
- elevation-2 (卡片): 0 4px 12px rgba(0,0,0,0.10)
- elevation-3 (悬浮): 0 8px 24px rgba(0,0,0,0.12)
- elevation-4 (模态): 0 16px 48px rgba(0,0,0,0.18)

### 动效规范
- micro (微交互): 150ms ease-out
- standard (过渡): 250ms ease-in-out
- emphasis (进入): 400ms ease-out [cubic-bezier(0.34,1.56,0.64,1)]
- page (页面): 500ms ease-in-out
```

---

## 五、6 步品牌设计工作流

### Step 0: ⚠️ 文字渲染铁律（必读）

**AI 图像生成模型无法正确渲染文字（尤其中文）。** 任何含品牌名称、标语、中文文字的 Logo/海报/名片，必须使用 SVG（`<text>` 标签）或 HTML/CSS，**绝对不要**用 AI 文生图工具生成含文字的最终交付物。

| Logo 类型 | 正确方式 | 错误方式 |
|-----------|----------|----------|
| 图形 Logo（纯符号） | ✅ SVG `<path>` 或 AI 图像（作为灵感） | — |
| 文字 Logo（含品牌名） | ✅ SVG `<text>` 标签 | ❌ AI 图像生成 |
| 组合 Logo（图形+文字） | ✅ SVG（图形路径 + text 标签） | ❌ AI 图像生成 |

### Step 1: 理解需求 (Understand)
- 提取品牌名称、行业、定位、目标受众
- 理解设计偏好（风格/色彩倾向/禁忌）
- 信息不足时主动询问，不猜测
- **决策表**：
  - "做个 Logo"（无任何上下文） → 充分询问
  - "为 XX 教育品牌设计 VI"（有名称+行业） → 询问定位和受众
  - "按照这个 PRD 设计品牌"（有完整文档） → 直接开始

### Step 2: 收集上下文 (Gather Context)
- 搜索品牌/行业相关信息（websearch）
- 了解竞品视觉风格（webfetch）
- 理解目标受众的审美偏好
- **不要从零开始**：总有可以参考的行业案例

### Step 3: 声明设计系统 (Declare Design System)
- 使用上面的设计 Token 模板
- 提供 2-3 个差异化色彩方向
- 明确字体配对和层级
- **在写任何具体设计之前完成此步骤**

### Step 4: v0 草稿 (v0 Draft)
- Logo 概念草图（用 SVG 或文字描述）
- 色彩方案可视化展示
- 品牌关键词 moodboard
- **这是便宜的 pivot 点**——方向不对可以低成本调整

### Step 5: 完整设计 (Full Build)
- Logo 设计（主标志 + 文字标志 + 单色版本 + 最小尺寸规范）
- 品牌色彩完整规范（含 oklch + HEX + RGB + CMYK）
- 字体层级系统
- 辅助图形/图案系统
- 品牌应用示例（名片/信纸/PPT/社交媒体）
- 图标风格规范

### Step 6: 自检验证 (Self-Check)
- [ ] 所有色值来自声明的设计 Token，无 rogue 色值
- [ ] 无 AI 套路（紫色渐变、Emoji 图标、Inter-only 等）
- [ ] 字体层级清晰（h1 到 caption 至少 6 级）
- [ ] 品牌一致性——所有交付物遵循同一个设计系统
- [ ] 无障碍——关键文本 WCAG AA 对比度 (4.5:1+)
- [ ] 中英文双语呈现
- [ ] 无虚假数据/推荐语/数据

---

## 六、占位符哲学

> **一个占位符传达"这里需要真实素材"。一个造假传达"我偷工减料"。**

| 缺失内容 | 使用占位符 | 禁止做法 |
|----------|-----------|----------|
| 图标 | `[icon: 课程]` SVG 方形占位 | 🎓 Emoji 替代 |
| 图片 | `[image: 校园全景, 16:9]` 比例占位卡 | AI 生成的虚假照片 |
| Logo | `[logo: 合作伙伴]` 文字占位 | 灰色方块/随机字母 |
| 数据 | `[数据: 2025 年毕业生薪资]` | "10,000+ 学员" |
| 推荐语 | `[引言: 学员姓名, 职位]` | "非常棒的课程！—— 张同学" |

---

## 七、输出规范

### 文件命名
- `{项目名}_brand_strategy.md` — 品牌策略
- `{项目名}_design_tokens.md` — 设计 Token
- `{项目名}_logo_design.md` — Logo 设计
- `{项目名}_color_spec.md` — 色彩规范
- `{项目名}_typography.md` — 字体规范
- `{项目名}_applications.md` — 品牌应用
- `{项目名}_brand_page.html` — 品牌展示页

### 输出目录
所有输出保存到 `outputs/{项目名}/` 目录下。
