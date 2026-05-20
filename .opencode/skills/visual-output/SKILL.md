---
name: visual-output
description: 视觉输出 Skill：吉祥物、文创产品图像生成的分层 Prompt 框架和模板
---

# Visual Output Skill

视觉资产生成的核心方法论，包含分层 Prompt 框架、吉祥物模板、文创产品模板和专业摄影术语。

---

## ⚠️ 品牌核心规则（必须遵守）

> 所有设计必须以 **{BRAND_NAME}** 为品牌核心！

### 品牌色彩（必须使用）

| 角色 | HEX | 用途 |
|------|-----|------|
| **主色** | {PRIMARY_COLOR} | Logo、{BRAND_NAME}文字、核心图形 |
| **辅色** | {SECONDARY_COLOR} | 辅助图形、渐变 |
| **点缀色** | {ACCENT_COLOR} | 强调元素 |

### 文字标志规则

**品牌名称（如有）必须作为 Logo 的第一视觉焦点！**

- ✅ 正确：`A logo featuring "{BRAND_NAME}" letters as primary visual element`
- ❌ 错误：只有图形没有品牌文字

### Prompt 必须包含

```
✓ 品牌名称（如有）
✓ 品牌色
✓ 专业光线/材质/环境描述
✓ 质量参数
```

---

## 1. 分层 Prompt 构建框架

### 1.1 Prompt 层次结构

构建高质量图像 Prompt 时，必须包含以下六个层次：

```
[主体层] + [风格层] + [光影层] + [构图层] + [质量层] + [技术层]
```

| 层次 | 内容 | 示例 |
|------|------|------|
| **主体层** | 角色/产品描述 | A cute robot mascot character |
| **风格层** | 风格关键词 | kawaii style, rounded forms |
| **光影层** | 光影氛围 | soft studio lighting, dramatic shadows |
| **构图层** | 视角和布局 | 3/4 view, centered composition |
| **质量层** | 质量参数 | professional quality, high detail |
| **技术层** | 技术约束 | NO TEXT, clean design |

### 1.2 分层构建示例

**吉祥物 Prompt**：
```
A geometric mascot character (主体),
futuristic design with tech elements (风格),
soft studio lighting with subtle reflections (光影),
3/4 view, dynamic pose (构图),
professional quality, ultra high detail (质量),
NO TEXT, clean white background (技术)
```

**产品摄影 Prompt**：
```
A canvas tote bag with printed design (主体),
realistic product photography style (风格),
professional studio lighting, soft shadows (光影),
hero shot, centered composition (构图),
commercial photography quality, high resolution (质量),
clean background, no distractions (技术)
```

---

## 2. 吉祥物 Prompt 模板

### 2.1 基础模板

```
A [角色类型] mascot character, [风格方向],
primary color [HEX], secondary color [HEX], accent color [HEX],
[表情描述], [姿态描述], [背景设置],
[构图], [光影],
professional quality, NO TEXT, high detail
```

### 2.2 风格变体模板（{BRAND_NAME} 品牌配色）

> ⚠️ 必须使用品牌色：主色 {PRIMARY_COLOR}，辅色 {SECONDARY_COLOR}，点缀色 {ACCENT_COLOR}

#### 2D卡通科技风（推荐）

```
A 2D cartoon mascot character representing AI innovation, flat illustration style,
clean vector art, simple geometric shapes,
tech-inspired elements like circuit lines, data streams, or chip patterns,
{PRIMARY_COLOR} as dominant color, {SECONDARY_COLOR} as secondary, {ACCENT_COLOR} as accent,
friendly and approachable expression with simple features,
dynamic pose suggesting innovation and growth,
clean white or light gradient background,
crisp clean lines, no shading, flat colors,
NO TEXT, professional 2D illustration, high quality
```

#### 2D卡通可爱风
```
A 2D cartoon [角色类型] mascot character, kawaii flat illustration,
rounded simple shapes, cute and friendly expression,
primary color [HEX], secondary color [HEX], accent color [HEX],
[表情: happy smile/simple bright eyes],
[姿态: playful pose / waving / bouncy stance],
clean minimal background,
[构图: centered / full body],
smooth vector style, flat colors, no gradients,
NO TEXT, professional 2D illustration
```

#### 2D卡通高端风
```
A 2D cartoon [角色类型] mascot character, elegant flat illustration,
refined simple shapes, sophisticated color palette,
primary color [HEX], secondary color [HEX], accent color [HEX],
[表情: confident / elegant / professional],
[姿态: standing tall / confident stance],
minimal clean background,
[构图: centered / simple],
polished vector style, flat colors, clean lines,
NO TEXT, professional 2D illustration, high quality
```

#### 2D扁平风
```
A 2D flat [角色类型] mascot character, vector illustration,
bold simple shapes, minimal details,
primary color [HEX], secondary color [HEX], accent color [HEX],
[表情: simple friendly expression],
[姿态: iconic pose with clear silhouette],
solid color background, no gradients,
no shading, clean outlines,
NO TEXT, icon-style design
```

#### 2D手绘风
```
A 2D hand-drawn [角色类型] mascot character, illustration style,
organic shapes, sketchy friendly feel,
primary color [HEX], secondary color [HEX], accent color [HEX],
[表情: warm / friendly / approachable],
[姿态: casual pose / natural stance],
textured or clean background,
artistic illustration quality, warm colors,
NO TEXT, artistic 2D illustration
```

### 2.3 吉祥物 Prompt 参考词汇

**角色类型**：
- 动物：fox, owl, rabbit, cat, dog, bear, panda, dragon
- 抽象：geometric creature, crystal being, energy form
- 机器人：android, cyborg, AI assistant, droid
- 人物：student, developer, explorer, mentor
- 物体：rocket, lightbulb, book, computer

**表情描述**：
- 正面：happy, smiling, cheerful, excited, confident
- 中性：curious, thoughtful, focused, calm, serene
- 动态：surprised, laughing, winking, determined

**姿态描述**：
- 站立：standing tall, heroic stance, casual pose
- 动态：running, jumping, flying, pointing
- 手部：holding object, waving, thumbs up, gesturing

---

## 3. Logo 设计模板（通用）

> ⚠️ 品牌名称必须作为第一视觉焦点！

### 3.1 科技感 Logo

```
A minimalist brand logo featuring "{BRAND_NAME}" letters as the primary visual element,
futuristic tech-inspired design, clean geometric shapes,
{PRIMARY_COLOR} as dominant, {SECONDARY_COLOR} as secondary, {ACCENT_COLOR} as accent,
subtle circuit board patterns or data stream elements integrated into letters,
white or dark background,
professional logo design, vector quality, NO TEXT except {BRAND_NAME},
crisp typography, modern corporate identity style,
ultra high detail, 4K resolution
```

### 3.2 活力 Logo

```
A modern brand logo with "{BRAND_NAME}" letters prominently displayed,
bold typography, dynamic angular shapes suggesting innovation and growth,
{PRIMARY_COLOR}, {SECONDARY_COLOR}, {ACCENT_COLOR},
clean minimalist style, suitable for both light and dark backgrounds,
professional corporate identity design, NO TEXT except {BRAND_NAME},
vibrant yet professional, youthful energy,
ultra high detail, 4K resolution
```

### 3.3 图形融合 Logo

```
A creative brand logo combining "{BRAND_NAME}" letters with abstract geometric shapes,
tech-inspired elements: circuit paths, neural networks, data streams,
{PRIMARY_COLOR} as dominant, {SECONDARY_COLOR} as secondary, {ACCENT_COLOR} as accent,
white or dark background,
professional logo design, NO TEXT except {BRAND_NAME},
premium feel, versatile application,
ultra high detail, 4K resolution
```

---

## 4. 文创产品模板（高质量）

> ⚠️ 必须包含品牌标识！参考专业摄影的光线/材质/环境描述。

### 4.1 文创帆布袋（生活场景）

```
Professional lifestyle product photography of a premium canvas tote bag,
featuring "{BRAND_NAME}" brand logo printed on front,
clean modern design with subtle tech-inspired patterns,
placed on a modern minimalist desk, next to laptop and coffee,
natural soft daylight from window, gentle warm tones,
shallow depth of field with soft bokeh background,
realistic canvas fabric texture with visible weave,
premium matte finish, professional commercial photography,
clean minimal composition, 4K resolution
```

### 4.2 文创马克杯（棚拍）

```
Professional studio product photography of a ceramic mug,
featuring "{BRAND_NAME}" brand logo printed around,
clean minimalist design with subtle geometric patterns,
white seamless background,
professional soft box lighting with subtle rim light,
realistic glossy ceramic material with subtle reflections,
soft shadow on white base for grounding,
depth of field, product in sharp focus,
clean commercial product shot, high detail, 4K resolution
```

### 4.3 文创笔记本（场景）

```
Professional product photography of a hardcover notebook,
featuring "{BRAND_NAME}" brand logo embossed on cover,
placed on a wooden desk with plants and coffee nearby,
warm natural lighting, soft shadows,
slight overhead angle, shallow depth of field,
realistic paper grain and premium cover texture visible,
editorial style product photography, 4K resolution
```

---

## 5. 专业摄影光线术语

| 中文 | 英文 |
|------|------|
| 柔和自然光 | soft natural daylight |
| 黄金时段 | golden hour lighting |
| 阴天柔光 | overcast soft light |
| 窗口柔光 | window light with soft diffusion |
| 边缘光 | rim light / edge lighting |
| 电影感布光 | cinematic lighting |
| 戏剧性侧光 | dramatic side lighting |

## 6. 专业材质术语

| 中文 | 英文 |
|------|------|
| 帆布纹理 | canvas texture / woven fabric |
| 陶瓷光泽 | ceramic gloss / glossy finish |
| 纸张质感 | paper grain / matte paper |
| 布料编织 | fabric weave texture |

## 7. Prompt 质量检查清单

### Designer 必须自检

```
- [ ] Prompt 中是否包含品牌名称（如有）？
- [ ] 是否使用品牌色？
- [ ] 光线描述是否具体（不只是 "studio lighting"）？
- [ ] 材质描述是否具体（canvas/ceramic/paper）？
- [ ] 环境描述是否存在（不只是白底）？
- [ ] 构图视角是否指定（eye-level/overhead/low angle）？
- [ ] 景深描述是否存在（shallow DoF/bokeh）？
- [ ] 质量参数是否完整（professional quality, 4K）？
```

---

## 3. 文创产品 Prompt 模板

### 3.1 棚拍风格（Studio Photography）

```
Realistic product photography of [产品类型],
featuring [设计元素/吉祥物],
professional studio setup,
white background with subtle gradient,
soft box lighting, even illumination,
soft shadows on white,
depth of field, sharp focus on product,
clean edges, no distractions,
commercial photography quality, high resolution
```

**示例 - 帆布袋**：
```
Realistic product photography of a premium canvas tote bag,
featuring a geometric mascot character print on front,
premium fabric texture, realistic shadows,
white studio background,
professional soft box lighting, even illumination,
soft shadow underneath for grounding,
depth of field, sharp focus on bag,
clean presentation, no distractions,
commercial photography quality, 4K resolution
```

**示例 - 马克杯**：
```
Realistic product photography of a ceramic mug,
featuring a cute mascot design printed around,
glossy ceramic material, realistic reflections,
white studio background,
professional lighting, subtle rim light,
soft shadow underneath,
depth of field, product in sharp focus,
clean and minimal, commercial quality, 4K resolution
```

### 3.2 生活场景风格（Lifestyle Photography）

```
Realistic lifestyle product photography of [产品类型],
featuring [设计元素/吉祥物],
[场景描述: cozy coffee shop / modern desk / outdoor picnic / lifestyle setting],
natural daylight, warm tones,
authentic atmosphere, lifestyle context,
shallow depth of field, product in focus,
professional photography quality, high resolution
```

**示例 - 帆布袋**：
```
Realistic lifestyle product photography of a canvas tote bag,
featuring a geometric mascot character print,
placed on a wooden table in a cozy coffee shop,
natural window light, warm afternoon atmosphere,
next to a laptop and coffee cup,
shallow depth of field, bag in sharp focus, soft bokeh background,
authentic lifestyle scene, editorial quality, 4K resolution
```

**示例 - T恤**：
```
Realistic lifestyle product photography of a premium t-shirt,
featuring a mascot character design printed on front,
worn by a person or displayed on a mannequin,
modern minimalist interior, natural lighting,
casual lifestyle setting,
shallow depth of field, shirt in focus,
authentic and natural, editorial quality, 4K resolution
```

### 3.3 高端质感风格（Premium/Luxury）

```
Luxury product photography of [产品类型],
featuring [设计元素/吉祥物],
dramatic lighting, rich shadows,
[材质描述: premium leather / glossy ceramic / metallic finish],
magazine editorial style,
[角度描述: hero shot / dramatic angle / overhead],
ultra high detail, texture visible,
professional finish, commercial quality, 8K resolution
```

**示例 - 马克杯**：
```
Luxury product photography of a premium ceramic mug,
featuring an elegant mascot character design,
glossy black ceramic with gold accents,
dramatic studio lighting, rich shadows,
gold rim detail, premium material texture visible,
hero shot, slight angle,
magazine editorial quality,
ultra high detail, 8K resolution
```

### 3.4 文创产品专业术语

**材质描述**：
| 材质 | 英文描述 |
|------|----------|
| 帆布 | canvas texture, woven fabric, cotton material |
| 陶瓷 | ceramic, porcelain, glossy finish, matte glaze |
| 金属 | metallic finish, brushed metal, chrome accents |
| 纸张 | paper stock, cardstock, matte paper |
| 布料 | fabric texture, cotton blend, soft material |

**布光术语**：
| 类型 | 英文描述 |
|------|----------|
| 柔光箱 | soft box lighting, diffused light |
| 伦勃朗 | Rembrandt lighting, dramatic side light |
| 蝴蝶光 | butterfly lighting, paramount light |
| 边缘光 | rim light, edge lighting, separation light |
| 补光 | fill light, bounce light |

---

## 4. prompts.md 模板

创建提示词记录文件：

```markdown
# 提示词记录 - 第{N}轮

## 品牌色彩
- 主色: [HEX] — [描述]
- 辅色: [HEX] — [描述]
- 点缀色: [HEX] — [描述]

## [图片名称].png

### 风格预设
- 预设类型: [mascot_tech / mascot_cute / product_studio / etc.]
- 风格方向: [具体风格]

### Prompt（完整英文提示词）
```
[完整的英文 Prompt，按照分层框架构建]
```

### Prompt 分层解析
| 层次 | 内容 |
|------|------|
| 主体层 | [描述] |
| 风格层 | [描述] |
| 光影层 | [描述] |
| 构图层 | [描述] |
| 质量层 | [描述] |
| 技术层 | [描述] |

### 色彩映射
- 主色应用: [在图像中的具体应用位置]
- 辅色应用: [在图像中的具体应用位置]
- 点缀色应用: [在图像中的具体应用位置]

## [另一图片名称].png
[同上格式]
```

---

## 5. 图像质量参数

### 5.1 分辨率和比例

| 类型 | 推荐尺寸 | 比例 |
|------|----------|------|
| 社交媒体 | 1080x1080 | 1:1 |
| 海报 | 1920x1080 | 16:9 |
| 头像/Logo | 1024x1024 | 1:1 |
| 故事/Stories | 1080x1920 | 9:16 |

### 5.2 质量参数

```
professional quality,
ultra high detail,
high resolution,
4K resolution,
sharp focus,
clean edges,
no artifacts,
no distortion
```

### 5.3 负面提示词

```
blurry, low quality, distorted, pixelated,
text, letters, words, watermark, signature,
cropped, out of frame,
deformed, disfigured, bad anatomy,
oversaturated, undersaturated,
amateur, stock photo look
```

---

## 6. 使用指南

### 6.1 Designer 使用流程

1. **读取任务清单** (`task_list.md`)
2. **读取设计范式** (`design_paradigm.md`)
3. **读取视觉输出 Skill** (本文件)
4. **构建分层 Prompt**
   - 根据风格预设选择模板
   - 按照六层框架填充内容
   - 使用色彩心理学指导配色描述
5. **生成 prompts.md**
   - 记录完整 Prompt
   - 标注分层解析
6. **调用图像生成工具**

### 6.2 Prompt 自检清单

构建 Prompt 后，检查：

- [ ] 主体描述是否具体？（不是笼统的"吉祥物"）
- [ ] 风格关键词是否准确？（匹配品牌调性）
- [ ] 光影氛围是否合适？（棚拍/自然/戏剧性）
- [ ] 构图是否有指定？（视角、布局）
- [ ] 是否包含质量参数？（professional quality）
- [ ] 是否标注技术约束？（NO TEXT, clean design）
- [ ] 色彩是否来自设计范式？（不是随机颜色）

---

## 7. 完整示例

### 任务
为"上海创智"教育科技品牌设计吉祥物（科技风）和帆布袋（棚拍风格）

### 色彩
- 主色：#3B82F6（科技蓝）
- 辅色：#10B981（翡翠绿）
- 点缀色：#F97316（活力橙）

### 吉祥物 Prompt
```
A geometric robot mascot character, futuristic tech-inspired design,
angular shapes, circuit board patterns, glowing energy core,
primary color #3B82F6, secondary color #10B981, accent color #F97316,
friendly but advanced expression, curious eyes with light-up effect,
dynamic pose with one arm pointing forward, tech energy emanating,
clean white background with subtle tech grid,
3/4 view, hero composition centered,
professional soft studio lighting, subtle blue rim light, clean shadows,
professional quality, ultra high detail, NO TEXT, 4K resolution
```

### 帆布袋 Prompt
```
Realistic product photography of a premium canvas tote bag,
featuring a geometric robot mascot character print on front,
tech-inspired design in blue and green colors,
realistic canvas fabric texture, visible weave,
white studio background with subtle gradient,
professional soft box lighting, even illumination,
soft shadow underneath for grounding,
depth of field, sharp focus on bag front,
clean presentation, no distractions,
commercial photography quality, 4K resolution
```
