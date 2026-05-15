# Visual Output Skill — HTML 品牌页面生成

> 基于设计 Token 生成可展示的 HTML 品牌形象页面。灵感来源：Claude Design / web-design-skill

---

## 功能

将设计师生成的设计系统（色彩/字体/Logo/文案）转化为**可直接在浏览器中展示的 HTML 品牌形象页面**。这是一个完整、美观、可演示的品牌落地页，而不是纯 Markdown 文档。

---

## 适用场景

- 品牌形象展示页（给客户/评委看的最终效果）
- 设计 Token 可视化（色彩/字体/间距的实时展示）
- Logo 多版本展示（全彩/单色/反白/文字标志）
- 品牌应用 mockup（名片/信纸/社交媒体预览）
- 夏令营面试 Demo 展示

---

## 6 步生成工作流

### Step 1: 理解需求 (Understand)
- 确认品牌名称、定位、核心信息
- 确认要展示的内容模块
- **决策表**：
  - "做个品牌页" → 使用默认模块（Hero + 色彩 + 字体 + Logo + 应用场景）
  - "只需要色彩展示" → 精简为色彩模块
  - "完整 VI 展示" → 全模块（Hero + 色彩 + 字体 + Logo + 图标 + 应用 + Footer）

### Step 2: 收集设计系统 (Gather Design System)
- 从 `designer_result_roundX.md` 或设计规范文件读取：
  - 品牌色彩（含 HEX + oklch 值）
  - 品牌字体（中文+英文）
  - Logo SVG 文件路径
  - 品牌标语和品牌故事
  - 辅助图形/图案描述

### Step 3: 声明页面设计系统 (Declare Page Design)
在设计 HTML 之前，先在 Markdown 中声明页面的设计决策：

```markdown
## 页面设计系统

- 页面基调：[科技/优雅/极简/活力/人文]
- 背景色: oklch(...)
- Hero 布局: [居中/左对齐/分栏]
- 色彩展示方式: [色块网格/渐变条/色阶卡片]
- 字体展示方式: [层级预览/字母表/段落对比]
- 应用展示方式: [卡片网格/轮播/瀑布流]
```

### Step 4: v0 草稿 (v0 Draft)
生成 HTML 骨架（仅布局，不填充细节）：

```html
<!-- v0: 布局骨架 -->
<div class="brand-page">
  <section class="hero"><!-- Logo + 标语 + CTA --></section>
  <section class="colors"><!-- 色彩展示区 --></section>
  <section class="typography"><!-- 字体展示区 --></section>
  <section class="logo-showcase"><!-- Logo 多版本 --></section>
  <section class="applications"><!-- 应用场景 --></section>
  <footer><!-- 品牌信息 --></footer>
</div>
```

**这是便宜的 pivot 点**——用户确认布局方向后再填充内容。

### Step 5: 完整构建 (Full Build)
填充所有内容，添加 CSS 样式，确保设计质量。

### Step 6: 自检验证 (Verify)
- [ ] 浏览器控制台无错误
- [ ] 所有色值来自设计系统声明，无 rogue 色值
- [ ] 无 AI 套路（紫色渐变/Emoji/Inter-only/虚假数据）
- [ ] 字体正确加载（中英文均显示）
- [ ] 响应式：桌面端和移动端均可正常显示
- [ ] Logo SVG 正确渲染
- [ ] 视觉质量达到展示级（可以在面试中投影展示）

---

## HTML 页面结构模板

### 必含模块

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{品牌名称} — 品牌形象设计</title>
  <!-- 字体加载：Google Fonts / 中文 Web 字体 -->
  <!-- 使用 CSS 自定义属性定义设计 Token -->
</head>
<body>
  <!-- 1. Hero 区域 -->
  <!-- 2. 品牌故事/理念区域 -->
  <!-- 3. 色彩系统展示 -->
  <!-- 4. 字体层级展示 -->
  <!-- 5. Logo 多版本展示 -->
  <!-- 6. 品牌应用 mockup -->
  <!-- 7. Footer -->
</body>
</html>
```

### CSS 设计 Token（必须使用）

```css
:root {
  /* 从设计系统映射 */
  --color-primary: {主色 HEX};
  --color-primary-oklch: oklch({L} {C} {h});
  --color-secondary: {辅助色 HEX};
  --color-accent: {点缀色 HEX};
  --color-bg: {背景色 HEX};
  --color-fg: {文字色 HEX};
  --color-gray-50: {浅灰};
  --color-gray-900: {深灰};

  --font-display: '{英文主字体}', '{中文字体}', sans-serif;
  --font-body: '{英文辅助字体}', '{中文字体}', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --text-h1: clamp(36px, 5vw, 72px);
  --text-h2: clamp(24px, 3.5vw, 48px);
  --text-h3: clamp(20px, 2.5vw, 30px);
  --text-body: clamp(16px, 2vw, 18px);
  --text-small: 14px;

  --space-xs: 4px; --space-sm: 8px; --space-md: 16px;
  --space-lg: 24px; --space-xl: 40px; --space-2xl: 64px;

  --radius-card: 12px; --radius-btn: 8px; --radius-input: 4px;

  --shadow-card: 0 4px 12px rgba(0,0,0,0.10);
  --shadow-hover: 0 8px 24px rgba(0,0,0,0.12);

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
}
```

---

## Anti-AI-Cliché 强制约束

在生成 HTML 时，**严禁**：

| 禁止 | 替代 |
|------|------|
| `<link href="Inter">` 作为唯一字体 | 使用品牌字体配对中的字体 |
| `background: linear-gradient(135deg, #7C3AED, #EC4899, #3B82F6)` | 使用品牌色 subtle 纹理/几何图案 |
| `border-radius: 24px` 大圆角卡片 | 差异化圆角策略 |
| 🚀⚡✨ Emoji 作为图标 | SVG 几何图形或 `[icon]` 标记 |
| `<div class="testimonial">` 虚假推荐语 | 真实的品牌宣言或理念 |
| 居中大标题 + 居中副标题 + 居中 CTA | 非对称布局或左对齐 hero |
| 三列 feature 卡片 (icon + title + desc) | Bento grid 或交错布局 |
| 彩色左边框 accent card | 阴影层级 + 留白区分 |

---

## 设计质量标准

生成的 HTML 页面应达到以下标准：

1. **字号对比度**: h1 字号至少是 body 的 4-6 倍
2. **留白节奏**: 各 section 之间间距 ≥ 64px，营造呼吸感
3. **色彩克制**: 页面中点缀色不超过总面积的 10%
4. **字体层级**: 至少展示 h1 → h6 + body + caption 共 8 级
5. **动效克制**: 最多 2-3 处微动效，不能喧宾夺主
6. **信息密度**: 每屏聚焦一个核心信息，不堆砌内容
7. **响应式**: 移动端字号自适应，不横向溢出

---

## 输出

- 品牌展示 HTML 文件保存到 `outputs/{项目名}/brand_page.html`
- 可选的独立 CSS 文件保存到 `outputs/{项目名}/brand_styles.css`
- 页面内的所有色值、字体必须引用自设计 Token

---

## 面试展示模式

当用于夏令营面试时，页面应：

1. **首屏即亮点**: Hero 区域 3 秒内传达品牌调性
2. **色彩故事**: 不要只列色块，要解释每个颜色的设计意图
3. **迭代可见**: 可在页面底部展示"Craft by AI Design System"标识
4. **投影优化**: 字号够大（最小 16px），对比度够高，适合 1920×1080 投影
