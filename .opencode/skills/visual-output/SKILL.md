---
name: visual-output
description: 视觉资产生成：Logo(SVG) + 吉祥物(PNG) + 文创周边(PNG) + HTML品牌页面
---

# Visual Output Skill — 视觉资产生成

> 生成品牌视觉资产：Logo(SVG)、吉祥物(PNG)、文创周边(PNG)、HTML品牌页面

---

## 功能概览

| 输出类型 | 格式 | 工具 |
|----------|------|------|
| **Logo** | SVG | 直接输出代码 |
| **吉祥物** | PNG | text-to-image 工具 |
| **文创周边** | PNG | text-to-image 工具 |
| **品牌页面** | HTML | 直接输出代码 |

---

## 设计范式（参考创智学院风格）

### 色彩系统
```
主色: 极光蓝 #3B82F6 (oklch 55% 0.22 250) — 科技感
辅色: 能量橙 #F97316 (oklch 72% 0.18 70) — 活力点缀
深色: 深空蓝 #0F172A (oklch 18% 0.01 250) — 背景/文字
中性: 星尘灰 #F0F2F8 (oklch 92% 0.01 270) — 浅色背景

使用比例: 主色60% / 辅色30% / 深色10%
```

### 字体系统
```
中文: 思源黑体 (Noto Sans SC) — 现代几何感
英文: Outfit / Inter — 年轻现代
```

### 风格特征
- 深色背景 + 蓝色主调 + 橙色点缀
- 几何化、简洁线条
- 科技感但不冰冷，有活力但不幼稚
- 圆角: 卡片12px / 按钮8px

---

## 工作流

### Step 1: 声明设计系统
输出简洁的设计系统声明（颜色/字体/风格），保存到 `outputs/{项目}/design_system.md`

### Step 2: 生成 Logo（SVG）

**Logo 文字方案铁律**：
> AI 图像生成模型无法正确渲染文字（尤其中文汉字）。Logo 必须用 SVG。

**生成内容**：
- 2-3 个 Logo 概念方案
- 每个方案包含：全彩版本、单色版本、反白版本
- 保存到 `outputs/{项目}/logo/` 目录

**Logo 设计原则**：
- 简洁几何图形，易于识别
- 可单色使用（黑白稿）
- 小尺寸（16px）仍可辨认
- 避免复杂渐变
- 文字用 `<text>` 标签，不用 AI 生成

### Step 3: 生成吉祥物（PNG）

使用 text-to-image 工具生成：
```
风格: 扁平插画 / 3D卡通 / 几何抽象（根据品牌调性选择）
色彩: 严格使用设计系统的颜色
背景: 透明或纯色
尺寸: 1024x1024
```

**提示词模板**：
```
[角色描述], [风格关键词], [色彩方案], [表情/姿态], 
clean design, NO TEXT NO LETTERS, professional quality
```

保存到 `outputs/{项目}/mascot.png`

### Step 4: 生成文创周边（PNG）

使用 text-to-image 生成以下场景：

| 品类 | 提示词要点 |
|------|-----------|
| **T恤** | 产品摄影，胸前 Logo 展示，面料质感 |
| **徽章** | 金属珐琅工艺，圆形，安全别针 |
| **笔记本** | 精装封面，烫金 Logo，桌面场景 |
| **帆布袋** | 单面图案，自然褶皱，生活场景 |
| **贴纸套装** | 多元素组合，透明背景，矢量风格 |

保存到 `outputs/{项目}/merch/` 目录

### Step 5: 生成 HTML 品牌页面

将所有设计整合为可展示的 HTML 页面。

**必含模块**：
1. Hero 区域（Logo + 标语）
2. 品牌故事/理念
3. 色彩系统展示
4. 字体层级展示
5. Logo 多版本展示
6. 吉祥物展示
7. 文创应用 mockup
8. Footer

保存到 `outputs/{项目}/brand_page.html`

---

## Anti-AI-Cliché 强制约束

| 禁止 | 替代 |
|------|------|
| 紫粉渐变 `#7C3AED → #EC4899` | 品牌色 subtle 纹理/几何图案 |
| Emoji 作为图标 🚀⚡✨ | SVG 几何图形 |
| Inter 作为唯一字体 | 品牌字体配对 |
| 大圆角卡片 24px | 差异化圆角策略 |
| 虚假推荐语/数据 | 真实品牌宣言或 `[待填充]` |
| 居中三列 feature 卡片 | Bento grid 或交错布局 |

---

## 输出清单

```
outputs/{项目名}/
├── design_system.md           # 设计系统声明
├── logo/
│   ├── logo_full.svg          # 全彩Logo
│   ├── logo_mono.svg          # 单色Logo
│   └── logo_inverse.svg       # 反白Logo
├── mascot.png                 # 吉祥物
├── merch/
│   ├── tshirt.png             # T恤
│   ├── badge.png              # 徽章
│   └── notebook.png           # 笔记本
└── brand_page.html            # 品牌展示页面
```

---

## 图像生成工具调用

### 创智 API 配置
```typescript
const API_BASE_URL = "https://apicz.boyuerichdata.com/v1";
const MODEL = "gpt-image-2";
```

### 调用示例
```bash
npx tsx .opencode/tools/text-to-image-simple.ts \
  --prompt "cute mascot character, cloud-like starry creature" \
  --style mascot \
  --color_scheme "purple and gold" \
  --output "outputs/{项目}/mascot.png"
```

### 可用 style 预设
- `logo` — Logo 标志
- `mascot` — 吉祥物
- `product` — 产品摄影（文创）
- `illustration` — 插画
- `brand_image` — 品牌纹理

---

## 质量标准

1. **图片质量**：1024x1024，清晰无噪点
2. **色彩一致**：所有图片使用同一套设计系统颜色
3. **Logo 可用**：SVG 可直接用于生产环境
4. **页面展示级**：HTML 可在面试中投影展示
