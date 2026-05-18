---
name: design-spec
description: 设计规范文档：Token系统（色彩/字体/间距/圆角/阴影/动效）+ 多格式导出
---

# Design Spec Skill — 设计规范文档

> 生成专业、完整、工程可用的设计规范文档。灵感：Open Design DESIGN.md / 各大品牌 VI 手册

---

## 功能

将设计方案转化为结构化的设计规范文档（Design Specification），确保设计从"创意"到"落地"的一致性。

---

## 设计 Token 系统

### 色彩 Token

```css
/* 主色系 */
--color-primary-50 ~ 900: 基于 oklch 的 9 级色阶
/* 辅助色系 */
--color-secondary-50 ~ 900
/* 中性色 */
--color-gray-50 ~ 950
/* 语义色 */
--color-success / --color-warning / --color-error / --color-info
/* 品牌点缀 */
--color-accent
```

**规范要求**：
- 每个色值同时提供 HEX + RGB + oklch + CMYK (印刷)
- 标注 WCAG 对比度等级（AA/AAA）
- 明确各色的使用比例：主色 60% / 辅助色 30% / 点缀色 10%

### 字体 Token

```css
/* 字体族 */
--font-display: 标题字体 (h1-h3)
--font-heading: 副标题字体 (h4-h6)
--font-body: 正文字体
--font-mono: 代码/数字字体
--font-caption: 标注字体

/* 字号层级 */
--text-scale: 12/14/16/18/20/24/30/36/48/60/72
/* 行高 */
--leading-tight: 1.2 (标题)
--leading-normal: 1.5 (正文)
--leading-relaxed: 1.75 (长文本)
/* 字距 */
--tracking-tight: -0.02em (大标题)
--tracking-normal: 0
--tracking-wide: 0.05em (小写标注)
```

**规范要求**：
- 中英文字体分别指定，含 fallback 栈
- 响应式字号：移动端缩小 20%
- 字体加载策略：`font-display: swap`

### 间距 Token

```
基准: 4px

xs:  4px   (0.25rem)  — 图标间距、内边距微调
sm:  8px   (0.5rem)   — 紧密元素间距
md:  16px  (1rem)     — 标准间距
lg:  24px  (1.5rem)   — 段落间距、卡片内边距
xl:  40px  (2.5rem)   — Section 内间距
2xl: 64px  (4rem)     — Section 间间距
3xl: 96px  (6rem)     — 页面级间距
```

### 圆角 Token

```
卡片:     12px  — 品牌容器
按钮:     8px   — 交互元素
输入框:   4px   — 表单元素
标签/徽章: 9999px — 全圆角
模态框:   16px  — 浮层
图标容器: 8px   — 小元素
```

### 阴影 Token

```css
--shadow-none:     none;
--shadow-subtle:   0 1px 3px  rgba(0,0,0,0.08);  /* 微妙层级 */
--shadow-card:     0 4px 12px rgba(0,0,0,0.10);  /* 卡片 */
--shadow-elevated: 0 8px 24px rgba(0,0,0,0.12);  /* 悬浮/下拉 */
--shadow-modal:    0 16px 48px rgba(0,0,0,0.18); /* 模态框 */
--shadow-glow:     0 0 20px  rgba({brand}, 0.3);  /* 品牌发光 */
```

### 动效 Token

| Token | 时长 | 缓动 | 用途 |
|-------|------|------|------|
| `--motion-micro` | 150ms | ease-out | 按钮 hover、图标切换 |
| `--motion-standard` | 250ms | ease-in-out | 卡片 hover、菜单展开 |
| `--motion-emphasis` | 400ms | cubic-bezier(.34,1.56,.64,1) | 元素进入、弹窗 |
| `--motion-page` | 500ms | ease-in-out | 页面过渡、路由切换 |

---

## 输出格式

### 1. CSS 变量文件 (`design-tokens.css`)

```css
:root {
  /* === Colors === */
  --color-primary: #1A1A2E;
  --color-primary-oklch: oklch(20% 0.04 260);
  /* ... 完整 Token */
}
```

### 2. Tailwind Config (`tailwind.config.js` 片段)

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: { 50: '...', 500: '#1A1A2E', 900: '...' },
          accent: '#E94560',
        }
      },
      fontFamily: {
        display: ['Space Grotesk', 'Noto Sans SC', 'sans-serif'],
        body: ['Inter', 'Noto Sans SC', 'sans-serif'],
      }
    }
  }
}
```

### 3. Figma Tokens JSON (`design-tokens.json`)

```json
{
  "color": {
    "primary": {
      "500": {
        "value": "#1A1A2E",
        "type": "color",
        "description": "品牌主色"
      }
    }
  }
}
```

---

## 规范文档模板

保存到 `outputs/{项目名}/design_spec.md`：

```markdown
# {品牌名称} 设计规范

## 1. 品牌概述
- 品牌定位、核心价值、品牌个性

## 2. 色彩规范
- 主色板（含色阶）
- 辅助色板
- 中性色板
- 语义色
- WCAG 对比度合规矩阵
- 色彩使用比例规则

## 3. 字体规范
- 中英文字体族 + fallback
- 字号层级系统
- 行高/字距规范
- 响应式缩放规则

## 4. Logo 使用规范
- 最小尺寸
- 安全间距（clear space）
- 禁止使用方式（误用示例）
- 多版本选用指南

## 5. 间距与栅格
- 4px 基准系统
- 响应式断点
- 内容最大宽度

## 6. 图标系统
- 风格规范（线条粗细/圆角/填充规则）
- 核心图标列表
- 图标网格规范

## 7. 辅助图形
- 图形/纹理/图案系统
- 使用规则和场景

## 8. 摄影/插画风格
- 摄影风格方向
- 插画风格方向
- 图文搭配规则

## 9. 动效规范
- 微交互动效
- 页面过渡
- 加载状态

## 10. 应用示例
- 名片规范
- PPT 模板
- 社交媒体素材
```

---

## 质量检查清单

- [ ] 所有色值同时提供 HEX + oklch
- [ ] 字体栈含中英文 fallback
- [ ] 字号层级至少 6 级
- [ ] 间距基于 4px 基准
- [ ] 提供了至少一种工程格式（CSS/Tailwind/JSON）
- [ ] 无 AI 套路色值（紫粉渐变等）
- [ ] 有 Logo 安全间距和使用禁忌
