---
name: image-prompt-engineering
description: 图像提示词工程：7层分层构造法 + 视觉词汇库 + 风格参考框架 + 反模式清单 + 模型特异性指南
---

# Image Prompt Engineering Skill — 图像提示词工程

> 将设计意图转化为高质量图像生成 prompt 的系统方法论。
> 本 Skill 是 designer agent 和 visual-output skill 的底层知识库。

---

## 一、7 层 Prompt 分层构造法

每个图像生成 prompt 由 7 个层级按顺序拼接。不是填模板——是用自然语言逐层构建视觉场景。

```
Layer 1: 审美框架 (Aesthetic Framing)
Layer 2: 主体与概念 (Subject & Concept)
Layer 3: 情绪与人格 (Emotion & Character)
Layer 4: 构图与视角 (Composition & Framing)
Layer 5: 风格与技术 (Style & Technique)
Layer 6: 色彩与材质叙事 (Color & Material Narrative)
Layer 7: 质量锚点与约束 (Quality Anchors & Constraints)
```

### Layer 1: 审美框架

用 2-3 个形容词定义这个视觉世界的基调。这决定了模型选择什么"视觉语系"。

| 方向 | 审美框架短语 |
|------|-------------|
| 科技品牌 | "Premium minimal vector illustration" |
| 儿童教育 | "Warm storybook illustration, soft and tactile" |
| 奢侈品牌 | "Editorial photography, architectural minimalism" |
| 生活方式 | "Playful flat vector, Memphis-inspired geometry" |
| 游戏/娱乐 | "Stylized cel-shaded character art, animation keyframe" |
| 内容/出版 | "Refined editorial illustration, New Yorker magazine style" |
| 工业/制造 | "Clean technical illustration, precision linework" |
| 自然/环保 | "Organic botanical illustration, scientific plate quality" |

**规则**：审美框架必须是视觉参考系，不是抽象形容词。

### Layer 2: 主体与概念

描述画面中**有什么**——它的形态、构成、物理特征。写视觉事实，不要抽象评价。

```
差: "a cute tech mascot character"
好: "a small floating translucent synthetic intelligence being —
     not a robot, not an animal — a living embodiment of AI consciousness.
     A soft glowing wisdom core at its center, visible through a
     semi-transparent body shaped like a fusion between a water droplet,
     a neuron, and flowing data."
```

**原则**：
- 说它"是什么构成的"（材质、形态、结构）
- 说它"不是什么"（排除常见套路：不是机器人、不是动物、不是拟物）
- 提供 2-3 个具体的视觉类比

### Layer 3: 情绪与人格

通过**可观察的视觉特征**传达情绪，不写抽象感受词。

| 差（抽象标签） | 好（视觉可观察特征） |
|---------------|---------------------|
| "friendly" | "warm subtle smile, eyes crinkling slightly at the corners, relaxed open posture" |
| "professional" | "composed upright stance, steady direct gaze, clean precise edges" |
| "playful" | "dynamic tilted pose, one eye slightly larger than the other, bouncing on toes, wind-swept details" |
| "mysterious" | "half-lit face, deep shadow on one side, averted gaze, still poised posture" |
| "energetic" | "mid-action pose, dynamic motion lines, hair/cloth swept backward, bright wide-open eyes" |
| "wise" | "calm half-lidded eyes, slight knowing smile, composed stillness, subtle silvering at edges" |

**核心原则**：让观众从画面中"读"出情绪，而不是被"告诉"这是什么情绪。

### Layer 4: 构图与视角

精确描述画面机位、画幅和主体位置。

```
构图句式模板:
"[Shot type], [camera angle], [subject placement], [background treatment]"

Shot type 词汇:
- full body shot / half body shot / close-up / extreme close-up
- wide establishing shot / medium shot / detail macro shot
- three-quarter view / profile view / front-facing / top-down / low angle hero shot

Subject placement 词汇:
- centered, facing forward
- positioned on left third, facing right
- anchored at lower center, looking upward
- floating centered, symmetrical composition
- dynamic diagonal placement, rule of thirds

Background 词汇:
- pure white background / transparent background
- soft gradient background, studio seamless paper
- minimalist environment with generous negative space
- contextual environment suggesting [场景] without distracting detail
```

### Layer 5: 风格与技术

定义渲染方式、线条品质、画面完成度。这是 prompt 中最重要的"质量控制器"。

```
渲染技术词汇:
- soft cel-shading with translucent gradients (插画风)
- clean flat vector with precise geometric shapes (扁平矢量)
- realistic 3D rendering with subsurface scattering (写实3D)
- watercolor wash with ink line overlay (水彩手绘)
- gouache painting with visible brush texture (不透明水彩)
- pencil sketch with selective digital color (手绘+数字上色)
- isometric vector with crisp shadows (等距矢量)
- clay-rendered 3D with soft ambient occlusion (粘土3D)

线条品质词汇:
- clean refined outlines, not cartoonishly thick
- variable weight lines, thick-to-thin expressive strokes
- no outlines — pure shape-on-shape color blocking
- fine hairlines with delicate precision

完成度锚点:
- "high-end animation studio character sheet — polished but not overrendered"
- "commercial-grade vector art ready for production"
- "editorial illustration quality suitable for print"
- "premium app icon level of polish and refinement"
- "museum-grade scientific illustration standard"
```

**风格混搭公式**：`[参考A]-meets-[参考B] aesthetic`

```
示例:
- "Apple-keynote-meets-Arc-browser aesthetic" → 极简+科技+温暖
- "Studio Ghibli-meets-Memphis design" → 手绘温暖+几何趣味
- "Bauhaus-meets-Kawaii" → 理性几何+可爱圆润
- "Saul-Bass-meets-Modern-SaaS" → 经典海报几何+当代UI精致感
```

### Layer 6: 色彩与材质叙事

不说色号，说**色彩故事**。每种颜色有名字、有情绪、有材质联想。

```
差: "blue and orange colors"
好: "luminous pearl white as the body base,
     gentle cerulean AI-blue for the glowing core and halo,
     soft jade-cyan for translucent accents,
     a whisper of lavender-purple in the light trails,
     subtle warm golden sparks at the neural nodes"

色彩描述词汇库:
- 白色系: luminous pearl white / warm cream / cool arctic white / soft ivory / crisp paper white
- 蓝色系: gentle cerulean / deep navy abyss / electric cobalt / soft sky blue / muted steel blue
- 暖色系: warm golden amber / soft coral blush / burnt terracotta / rich caramel / vibrant tangerine
- 绿色系: soft sage / deep forest emerald / fresh mint / muted olive / vibrant chartreuse
- 紫色系: soft lavender mist / deep royal violet / muted mauve / rich plum
- 暗色系: matte near-black / warm charcoal / deep obsidian / soft graphite

材质描述词汇库:
- 光滑表面: glossy polished / matte frosted / satin finish / high-gloss lacquer
- 透明/半透明: translucent frosted glass / semi-transparent polycarbonate / crystalline clear / milky opalescent
- 金属: brushed aluminum / polished chrome / warm brass / matte anodized / liquid metal sheen
- 织物: thick cotton canvas / natural linen weave / soft felt texture / premium suede
- 纸张: textured kraft paper / smooth coated cardstock / handmade washi / uncoated natural
- 有机: smooth river stone / raw terracotta clay / hand-carved wood grain / smooth bone porcelain

光照描述词汇库:
- 方向: soft front-left key light / dramatic top-down spotlight / gentle rim lighting from behind / even three-point studio lighting / warm golden hour side light
- 品质: soft diffused ambient / crisp directional with defined shadows / volumetric god rays / gentle subsurface scattering / ethereal inner glow
- 色温: warm 3200K tungsten / cool 5600K daylight / neutral 4500K studio
```

### Layer 7: 质量锚点与约束

用具体的技术参照系定义"什么是好"，用明确的否定约束排除"什么是坏"。

```
质量锚点（选1-2个）:
- "8k equivalent resolution, macro detail visible"
- "professional studio photography quality"
- "commercial print-ready vector art"
- "premium product mockup, e-commerce grade"
- "award-winning editorial illustration standard"

否定约束（始终包含）:
- "NO TEXT, NO LETTERS, NO NUMBERS, NO WATERMARKS, NO UI FRAMES"
- "No purple-pink gradient, no emoji, no cartoonish cliches"
- "No text rendering artifacts, no garbled typography"
```

---

## 二、视觉词汇快速参考库

### 角色/吉祥物
```
translucent, ethereal, celestial, luminous core, semi-transparent body, organic silhouette,
floating, weightless, biomorphic, crystalline structure, soft bioluminescent glow,
tiny dancing particles, neural geometry, fluid data stream morphology,
elegant water droplet fusion, flowing calligraphy-like light trails,
geometric neural nodes like dew drops on spiderweb
```

### 材质
```
soft cel-shading, vector flat color, subtle gradient mesh, glass-morphism surface,
frosted polycarbonate, brushed aluminum, pearlescent finish, matte ceramic,
iridescent sheen, liquid metal, holographic laminate, polished obsidian,
soft-touch rubber, anodized titanium, raw unglazed pottery
```

### 光照
```
volumetric rim lighting, soft front-left key, cinematic backlight,
gentle ambient occlusion, subsurface scattering, gradient wash,
ethereal backglow, directional studio strobe, golden hour warmth,
cool clinical top-light, diffused overcast, dramatic chiaroscuro,
soft bounce fill from below
```

### 构图
```
full body shot / centered facing forward / slight upward gaze / dynamic crouching pose /
asymmetrical frame / rule of thirds placement / generous negative space /
isometric 3/4 view / floating centered / anchored lower third /
hero shot from below / bird's eye flat lay / Dutch angle dynamic tilt
```

### 质量/工作室锚点
```
high-end animation studio character sheet / polished but not overrendered /
editorial illustration quality / commercial-grade vector art /
macro detail / clean vector edges / 8k equivalent resolution /
professional studio lighting / e-commerce product photography standard
```

---

## 三、风格参考框架

### 风格混搭公式
```
"[知名视觉系统A]-meets-[知名视觉系统B] aesthetic"

有效的视觉参考系（模型能理解）:
- Apple Keynote design language — 极简、大量留白、渐变背景
- Arc browser aesthetic — 温暖圆角、半透明毛玻璃、柔和色彩
- Studio Ghibli — 手绘背景、温暖光影、精细自然
- Pixar character design — 夸张比例、高表现力、3D卡通
- Memphis design — 几何图案、大胆撞色、波普趣味
- Bauhaus — 理性几何、原色、形式服从功能
- Saul Bass poster — 剪纸式平面、有限色板、极强图形感
- Olafur Eliasson installation — 光与空间的沉浸体验
- Dieter Rams product design — 极简功能主义、少即是多
- Japanese ukiyo-e — 平面色块、流畅线条、自然主题

无效的参考系（模型无法理解）:
- "Michelin-starred restaurant atmosphere" — 太文化抽象
- "Silicon Valley startup vibe" — 没有视觉对应物
- "Millennial aesthetic" — 代际标签没有具体视觉
```

### 艺术运动参考
```
- Minimalism: geometric purity, essential forms, restrained palette, generous negative space
- Art Deco: symmetrical geometry, gold accents, bold typographic forms, rich materials
- Pop Art: bold flat colors, halftone dots, thick outlines, comic book energy
- Constructivism: dynamic diagonals, limited red/black/white, industrial geometry
- Surrealism: dream logic juxtapositions, metamorphic forms, impossible spaces
- Vaporwave: neon cyan/magenta, glitch effects, retro-futuristic, marble statues
- Cyberpunk: neon on dark, rain-slicked surfaces, holographic overlays, dense detail
```

---

## 四、反模式与常见失败模式

### 1. 过度提示 (Over-prompting)
```
问题: 一个 prompt 塞入 6+ 个冲突方向
差: "photorealistic but also cartoon, with watercolor texture and 3D rendering and flat design"
好: 选择 1 个主导风格 + 1 个辅助技法。其余删除。
```

### 2. 抽象情感词
```
问题: "friendly", "professional", "beautiful" — 模型看不到这些
修复: 转换为视觉可观察特征（见 Layer 3）
```

### 3. 风格冲突
```
问题: "photorealistic + flat vector" — 物理上不可能共存
修复: 选择一种渲染技术作为主导，另一种仅用于纹理/质感点缀
```

### 4. 色彩模糊
```
问题: "brand colors", "blue and orange" — 太模糊
修复: 每个颜色给名字+情绪+材质联想（见 Layer 6 色彩叙事）
```

### 5. 泛化质量词
```
问题: "high quality, professional, beautiful" — 不提供任何视觉信息
修复: 用具体的质量锚点替代（见 Layer 7）
```

### 6. 缺少否定约束
```
问题: 生成的图片出现乱码文字、水印、UI 框架
修复: 始终包含 "NO TEXT, NO LETTERS, NO NUMBERS, NO WATERMARKS, NO UI FRAMES"
```

### 7. 中文 prompt 直接翻译
```
问题: 将中文设计需求直译为英文 prompt — 丢失文化细微差别
修复: 用英文母语思维重写，保留设计意图而非字面翻译
      中文"温润如玉" → 英文 "soft jade-like translucency with a warm inner glow"
      而非 "warm and smooth like jade"（失去质感描述）
```

---

## 五、模型特异性指南

本系统通过 OpenAI 兼容代理使用 Gemini 系列模型。

### Gemini 系列特征
- **优势**: 对视觉物理的详细描述响应良好（光的行为、材质属性、空间关系）
- **优势**: 擅长抽象/空灵概念——当通过具体隐喻描述时
- **优势**: 对段落结构的理解优于逗号分隔的标签列表
- **劣势**: 无法正确渲染文字（始终使用 SVG 处理文字内容）
- **劣势**: 可能在复杂多主体场景中出现解剖结构错误

### Prompt 长度指南
- **最佳范围**: 150-400 词
- **最低**: 不要低于 50 词——太短会导致模型使用训练数据中的通用模板
- **最高**: 不超过 600 词——过长会导致模型忽略后半部分
- **结构**: 用换行（非逗号）分隔各层，每个层 1-3 句

### 不同模型的行为差异
- `gemini-2.5-flash-image`: 速度最快(~10s)，适合迭代；对简洁、结构化的 prompt 响应最好
- `gemini-3-pro-image-preview`: 质量最高，对复杂材质和光照描述理解更好
- `gemini-3.1-flash-image-preview`: 速度与质量的平衡，适合最终输出

---

## 六、完整 Prompt 示例

### 示例 1: 科技品牌吉祥物

```
Premium minimal vector illustration.

A small floating translucent synthetic intelligence being —
not a robot, not an animal — a living embodiment of AI consciousness.
A soft glowing wisdom core at its center, visible through a
semi-transparent body shaped like a fusion between a water droplet,
a neuron, and flowing data. Smooth, organic, slightly ethereal,
with no hard mechanical joints.

Its expression is curious, bright, and gently eager — like a young
researcher seeing a breakthrough for the first time. Large luminous
eyes with a soft inner glow, a subtle warm smile.

Full body shot, centered, facing forward with slight upward gaze.
Pure white background, generous negative space.

Soft cel-shading with ethereal translucent gradients. Clean refined
outlines, not cartoonishly thick. High-end animation studio character
sheet quality — polished but not overrendered.

Color palette: luminous pearl white as the body base, gentle cerulean
AI-blue for the glowing core and halo, soft jade-cyan for translucent
accents, a whisper of lavender-purple in the light trails, subtle
warm golden sparks at neural nodes.

NO TEXT, NO LETTERS, NO NUMBERS, NO WATERMARKS, NO UI FRAMES.
High resolution, clean edges, professional quality.
```

### 示例 2: 文创帆布袋产品摄影

```
Premium product photography of a heavy cotton canvas tote bag,
structured rectangular form with wide sturdy shoulder straps.

The bag hangs naturally against a pure white seamless studio backdrop,
soft professional lighting creating gentle shadows that reveal
the natural canvas weave texture. The fabric has a substantial
matte finish with visible fiber detail — not cheap thin cotton.

A minimalist graphic is printed on the front in a single elegant
color — the design is sophisticated and refined, not a cartoon
or souvenir. The print has a slight matte ink texture that sits
into the fabric rather than floating on top.

Commercial e-commerce product shot, macro detail on fabric texture
and stitching. Clean edges, studio lighting, neutral color temperature.

Color palette: natural unbleached cream canvas, warm golden-amber
accent print, soft studio white background.

NO WATERMARKS, NO UI ELEMENTS. Professional product photography quality.
```

---

## 七、快速检查清单

在提交 prompt 前，过一遍这个清单：

- [ ] 包含审美框架？（定义视觉语系）
- [ ] 主体描述有形态/材质/结构？（非抽象标签）
- [ ] 情绪通过视觉可观察特征传达？（非"friendly"）
- [ ] 构图/视角/背景明确？（机位+画幅+主体位置）
- [ ] 风格参考是可视觉化的？（非文化抽象）
- [ ] 色彩有名字+情绪+材质联想？（非仅 hex 值）
- [ ] 材质有具体参照物？（matte ceramic > smooth）
- [ ] 质量锚点具体？（studio quality > beautiful）
- [ ] 否定约束完整？（NO TEXT 等）
- [ ] 总长度在 150-400 词？
- [ ] 没有冲突的风格方向？
