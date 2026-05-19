---
name: visual-output
description: 视觉输出 Skill：吉祥物、文创产品图像生成的分层 Prompt 框架和模板
---

# Visual Output Skill

视觉资产生成的核心方法论，包含分层 Prompt 框架、吉祥物模板、文创产品模板和专业摄影术语。

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

### 2.2 风格变体模板

#### 科技风（Tech Style）
```
A [角色类型] mascot character, tech-inspired design,
geometric shapes, circuit patterns, holographic accents,
primary color [HEX], secondary color [HEX], accent color [HEX],
[表情: confident/focused/curious],
[姿态: dynamic pose with tech elements/pointing forward/holding device],
clean white background,
[构图: 3/4 view / hero shot],
soft studio lighting with blue rim light,
professional quality, NO TEXT, high detail, 4K resolution
```

#### 可爱风（Cute Style）
```
A cute [角色类型] mascot character, kawaii style,
rounded forms, soft edges, friendly appearance,
primary color [HEX], secondary color [HEX], accent color [HEX],
[表情: happy smile/bright eyes/warm gaze],
[姿态: playful pose/bouncy stance/waving hand],
clean pastel gradient background,
[构图: close-up / full body centered],
warm natural lighting, soft shadows,
professional quality, NO TEXT, high detail, 4K resolution
```

#### 高端风（Premium Style）
```
A premium [角色类型] mascot character, sophisticated design,
refined details, luxury feel, editorial quality,
primary color [HEX], secondary color [HEX], accent color [HEX],
[表情: confident smirk/stoic expression/noble bearing],
[姿态: elegant pose/standing tall/confident stance],
minimal dark background,
[构图: portrait / asymmetric],
dramatic lighting, rich shadows, rim light,
professional quality, NO TEXT, ultra high detail, 8K resolution
```

#### 扁平风（Flat Style）
```
A flat illustration [角色类型] mascot character,
vector art style, bold colors, clean shapes,
primary color [HEX], secondary color [HEX], accent color [HEX],
[表情: simple geometric expression],
[姿态: iconic pose with clear silhouette],
solid color background,
[构图: full body / iconic hero shot],
no shading, clean outlines,
professional quality, NO TEXT, vector-style
```

#### 3D风（3D Style）
```
A 3D rendered [角色类型] mascot character,
Pixar-style, volumetric, soft lighting,
primary color [HEX], secondary color [HEX], accent color [HEX],
[表情: expressive/friendly/detailed face],
[姿态: dynamic action pose/full body],
environment background or studio setting,
[构图: 3/4 view / cinematic],
 subsurface scattering, soft shadows, depth of field,
professional quality, NO TEXT, 3D render, 4K resolution
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
