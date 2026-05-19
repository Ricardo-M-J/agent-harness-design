---
name: brand-design
description: 品牌设计 Skill：品牌形象设计、吉祥物设计、色彩系统、字体配对、反套路清单
---

# Brand Design Skill

品牌设计的核心方法论，包含品牌形象设计、吉祥物设计、色彩系统和反套路清单。

---

## 1. 品牌形象设计原则

### 1.1 品牌设计系统声明

创建 `design_paradigm.md` 时，必须包含以下内容：

```markdown
# 设计范式 - 第{N}轮

## 品牌基础
- 品牌名称：[名称]
- 品牌定位：[一句话定位]
- 品牌个性：[3-5 个形容词]
- 目标受众：[描述]
- 差异化方向：[与竞品的区分]

## 色彩系统 (oklch)

### 主色 (Primary)
- 色值: oklch(L% C h) / #HEX
- 用途: [主要视觉元素，如 Logo、核心按钮]
- 占比: 60%
- 色彩心理: [传达的情感]

### 辅助主色 (Secondary)
- 色值: oklch(L% C h) / #HEX
- 用途: [辅助元素，如图标、背景]
- 占比: 30%

### 点缀色 (Accent)
- 色值: oklch(L% C h) / #HEX
- 用途: [强调元素，如提示、亮点]
- 占比: 10%

## 字体

### 中文字体
- 主字体: [字体名] — [用途层级]
- 备选: [备选字体]

### 英文字体
- 主字体: [字体名] — [用途层级]
- 备选: [备选字体]

### 字号层级
- 标题: 24/30/36/48
- 正文: 14/16/18
- 说明: 12

## 风格关键词
- [3-5 个核心风格词]

## 反套路检查清单
- ✅ 无紫粉渐变
- ✅ 无 Emoji
- ✅ 无 Tailwind 默认蓝 (#3B82F6)
- ✅ 无 Inter 作为唯一字体
- ✅ 无虚假数据
- ✅ 色彩来自设计范式
- ✅ 提示词中标注 NO TEXT
```

---

## 2. 吉祥物设计原则（Mascot Design）

### 2.1 角色设计五原则

**原则 1：剪影辨识度**
- 远距离观看时，轮廓可识别
- 使用独特的轮廓形状
- 避免通用圆形或椭圆

**原则 2：比例控制**
- 头身比：1:1（可爱）到 1:3（成熟）
- 元素协调：身体各部分比例合理
- 避免极端比例

**原则 3：表情设计**
- 情绪传达清晰
- 亲和力与专业感平衡
- 避免过于复杂的面部细节

**原则 4：姿态动态**
- 故事感：有行为意图
- 动态感：不是静止站立
- 避免僵硬的正面站立

**原则 5：配色策略**
- 主色 60%：占据主导地位
- 辅色 30%：增加层次
- 点缀色 10%：突出重点

### 2.2 吉祥物风格方向

| 风格 | 特点 | 适用场景 | Prompt 关键词 |
|------|------|----------|---------------|
| **2D卡通科技风** | 2D扁平、简洁几何、科技感 | 科技品牌、SaaS（推荐） | 2D cartoon, flat illustration, simple geometric, tech elements |
| **2D卡通可爱风** | 圆润、友好、卡哇伊 | 儿童品牌、消费品 | 2D cartoon, kawaii flat, rounded simple shapes, friendly |
| **2D卡通高端风** | 精致、专业、品质感 | 高端品牌、企业 | 2D cartoon, elegant flat, refined simple shapes, sophisticated |
| **2D扁平风** | 矢量、简约、易识别 | 互联网品牌 | 2D flat, vector illustration, bold simple shapes, minimal |
| **2D手绘风** | 有机、温暖、艺术感 | 文创品牌、艺术产品 | 2D hand-drawn, illustration style, organic shapes, artistic |

### 2.3 吉祥物设计反套路

**❌ 避免的错误**：
- 过度复杂的设计（细节太多）
- 无特征的圆脸（和其他品牌混淆）
- 不协调的比例（头大身小、腿短等）
- 过度拟人化（像真人而非角色）
- 使用品牌名作为面部特征

**✅ 正确的做法**：
- 简洁的剪影，3 秒内可描述
- 独特的特征元素（如特定的配饰、形状）
- 符合品牌调性的比例
- 有故事感的姿态
- 使用配饰或符号传达品牌信息

### 2.4 吉祥物 Prompt 模板

**基础模板**：
```
A [角色类型] mascot character, [风格方向],
primary color [HEX], secondary color [HEX], accent color [HEX],
[表情描述], [姿态描述], [背景设置],
clean design, NO TEXT, professional quality, high detail
```

**风格变体 Prompt**（推荐使用 2D 卡通风格）：

2D卡通科技风（推荐）：
```
A 2D cartoon mascot character, flat illustration style,
clean vector art, simple geometric shapes,
tech-inspired elements like circuit lines or digital patterns,
primary color #3B82F6, secondary color #10B981, accent color #F97316,
friendly and approachable expression, dynamic pose,
clean white or light gradient background,
crisp clean lines, no shading, flat colors,
NO TEXT, professional 2D illustration, high quality
```

2D卡通可爱风：
```
A 2D cartoon mascot character, kawaii flat illustration,
rounded simple shapes, cute and friendly expression,
primary color #8B5CF6, secondary color #F472B6, accent color #FBBF24,
happy smile, playful pose,
clean minimal background,
smooth vector style, flat colors, no gradients,
NO TEXT, professional 2D illustration
```

2D卡通高端风：
```
A 2D cartoon mascot character, elegant flat illustration,
refined simple shapes, sophisticated color palette,
primary color #1E293B, secondary color #64748B, accent color #D4AF37,
confident professional expression, elegant pose,
minimal clean background,
polished vector style, flat colors, clean lines,
NO TEXT, professional 2D illustration, high quality
```

---

## 3. 色彩系统 (oklch)

### 3.1 为什么使用 oklch

**oklch** 是感知均匀的色彩空间，比 HEX 和 RGB 更适合设计：

- **L (Lightness)**: 亮度，0-100%
- **C (Chroma)**: 色度，饱和度
- **H (Hue)**: 色相，0-360°

### 3.2 常用色彩参考

| 色彩名称 | HEX | oklch | 色相 | 适用场景 |
|----------|-----|-------|------|----------|
| 科技蓝 | #3B82F6 | 62% 0.19 255 | 蓝色 | 科技、金融、企业 |
| 深空蓝 | #1E40AF | 35% 0.20 255 | 深蓝 | 高端、科技 |
| 活力橙 | #F97316 | 70% 0.17 50 | 橙色 | 活力、创意、电商 |
| 日落橙 | #EA580C | 55% 0.18 45 | 深橙 | 警示、强调 |
| 翡翠绿 | #10B981 | 70% 0.15 165 | 绿色 | 成长、自然、教育 |
| 深空灰 | #1E293B | 20% 0.05 255 | 蓝灰 | 高端、稳重 |
| 中性灰 | #64748B | 55% 0.05 255 | 灰蓝 | 文字、辅助 |
| 活力紫 | #8B5CF6 | 65% 0.22 290 | 紫色 | 创意、个性 |
| 中国红 | #DC2626 | 50% 0.22 25 | 红色 | 传统、热情 |
| 玫瑰粉 | #EC4899 | 65% 0.20 350 | 粉红 | 女性、可爱 |

### 3.3 配色原则

**主色选择**：
- 根据品牌调性选择主色相
- 确保主色在不同背景下可读

**辅色选择**：
- 与主色形成对比但协调
- 使用色相环上相邻 30-60° 的颜色

**点缀色选择**：
- 使用主色或辅色的互补色
- 面积控制在 10% 以内

---

## 4. 字体配对原则

### 4.1 推荐的字体组合

| 场景 | 中文字体 | 英文字体 | 风格 |
|------|----------|----------|------|
| 科技感 | 思源黑体 | Outfit | 现代、几何 |
| 专业感 | 思源宋体 | Playfair Display | 传统、品质 |
| 活泼感 | OPPO Sans | Poppins | 年轻、活力 |
| 简约感 | 苹方 | SF Pro | 简洁、干净 |
| 品质感 | 鸿蒙黑体 | Inter | 高端、平衡 |

### 4.2 字体使用规则

- **不要**只使用 Inter 作为唯一英文字体
- **不要**混用超过 3 种字体
- **中文优先**：中文和英文使用不同的字体家族

---

## 5. 反套路清单（Anti-AI-Cliché Blocklist）

### 5.1 禁止使用的设计元素

| 类别 | 禁止元素 | 替代方案 |
|------|----------|----------|
| **渐变** | 紫粉渐变 (#A855F7 → #EC4899) | 单色渐变或双色搭配 |
| **配色** | Tailwind 默认蓝 (#3B82F6) | 自定义品牌色 |
| **图标** | Emoji | 矢量图标 |
| **字体** | Inter (唯一英文) | Outfit/Poppins/Space Grotesk |
| **阴影** | Tailwind 默认阴影 | 自定义柔和阴影 |
| **数据** | 虚假 Lorem ipsum | 真实内容或占位符 |

### 5.2 图像生成禁止清单

**吉祥物**：
- ❌ 文字、字母、数字
- ❌ 水印、签名
- ❌ 模糊、过曝
- ❌ 变形、失真

**产品图**：
- ❌ 非品牌色背景
- ❌ 低质量渲染
- ❌ 不真实的光影

---

## 6. 设计系统文件模板

### 6.1 design_paradigm.md 完整模板

```markdown
# 设计范式 - 第{N}轮

## 品牌基础
- 品牌名称：[名称]
- 品牌定位：[一句话定位]
- 品牌个性：[3-5 个形容词]
- 目标受众：[描述]
- 差异化方向：[与竞品的区分]

## 色彩系统 (oklch)

### 主色 (Primary)
- 色值: oklch(L% C h) / #HEX
- 用途: [主要视觉元素]
- 占比: 60%
- 色彩心理: [传达的情感]

### 辅助主色 (Secondary)
- 色值: oklch(L% C h) / #HEX
- 用途: [辅助元素]
- 占比: 30%

### 点缀色 (Accent)
- 色值: oklch(L% C h) / #HEX
- 用途: [强调元素]
- 占比: 10%

## 字体

- 中文主字体: [字体名]
- 英文主字体: [字体名]
- 字号层级: 12/14/16/18/20/24/30/36/48

## 吉祥物设计方向
- 风格: [科技风/可爱风/高端风/扁平风/3D风]
- 角色类型: [动物/人物/抽象/机器人等]
- 核心特征: [3 个核心特征]
- 配色比例: 主色60% + 辅色30% + 点缀色10%

## 风格关键词
- [3-5 个核心风格词]

## 反套路检查
- ✅ 无紫粉渐变
- ✅ 无 Emoji
- ✅ 无 Tailwind 默认蓝
- ✅ 无 Inter 作为唯一字体
- ✅ 无虚假数据
- ✅ 色彩来自设计范式
- ✅ 提示词中标注 NO TEXT
```

---

## 7. 使用指南

### 7.1 Designer 使用流程

1. **读取任务清单** (`task_list.md`)
2. **读取品牌设计 Skill** (本文件)
3. **创建设计范式** (`design_paradigm.md`)
   - 按照模板填写品牌基础
   - 选择合适的色彩系统
   - 确定吉祥物设计方向
4. **生成提示词** (`prompts.md`)
   - 根据吉祥物风格选择 Prompt 模板
   - 填充具体内容
5. **调用图像生成工具**
