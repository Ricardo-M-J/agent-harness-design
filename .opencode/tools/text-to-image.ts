/**
 * Text-to-Image Custom Tool for OpenCode Design System
 *
 * 支持多个图片生成后端：
 * - GPT Image 2 (gpt-image-2): /v1/images/generations 端点, 高质量, 支持中英文文字
 * - Gemini 2.5 Flash (gemini-2.5-flash-image): /v1/chat/completions 端点, 速度快
 * - Gemini 3 Pro (gemini-3-pro-image-preview): /v1/chat/completions 端点, 高质量
 *
 * ⚠️ GPT Image 2 能力更强，支持中英文文字渲染！
 */

import { tool } from "@opencode-ai/plugin";

// ============================================================
// API 后端配置
// ============================================================

interface ImageBackend {
  name: string;
  model: string;
  type: "images_api" | "chat_api";
  baseUrl: string;
  apiKey: string;
  timeout: number;
  supportsText: boolean; // 是否支持文字渲染
}

const BACKENDS: ImageBackend[] = [
  {
    name: "GPT Image 2",
    model: "gpt-image-2",
    type: "images_api",
    baseUrl: "https://api.linapi.net/v1",
    apiKey: "sk-YdaDWBHBSyEcUT5Ks5gnxS70TFthX0X8nZtIzkY2UnHwpCbl",
    timeout: 180000,
    supportsText: true, // GPT Image 2 支持中英文！
  },
  {
    name: "Gemini 2.5 Flash",
    model: "gemini-2.5-flash-image",
    type: "chat_api",
    baseUrl: "https://apicz.boyuerichdata.com/v1",
    apiKey: "sk-KQRts8IEJesfFj06YYsPXuleWodDxIlZ2t5g2A3DJDk0XRvJ",
    timeout: 120000,
    supportsText: false,
  },
  {
    name: "Gemini 3 Pro",
    model: "gemini-3-pro-image-preview",
    type: "chat_api",
    baseUrl: "https://apicz.boyuerichdata.com/v1",
    apiKey: "sk-KQRts8IEJesfFj06YYsPXuleWodDxIlZ2t5g2A3DJDk0XRvJ",
    timeout: 120000,
    supportsText: false,
  },
];

// 默认使用 GPT Image 2
const DEFAULT_BACKEND_INDEX = 0;

// ============================================================
// 风格预设 - 针对 GPT Image 2 优化（支持文字）
// ============================================================

const STYLE_PRESETS: Record<string, string> = {
  // 吉祥物风格
  mascot_tech: "2D cartoon mascot character, flat illustration style, clean vector art, simple geometric shapes, tech-inspired elements, friendly and approachable, vibrant brand colors, clean white background, crisp lines, professional 2D illustration, high quality",
  mascot_cute: "2D cartoon mascot character, kawaii flat illustration, rounded simple shapes, cute and friendly expression, pastel or vibrant colors, clean minimal background, smooth vector style, professional 2D illustration",
  mascot_premium: "2D cartoon mascot character, elegant flat illustration, refined simple shapes, sophisticated color palette, minimal clean background, polished vector style, professional 2D illustration, high quality",
  mascot_flat: "2D flat mascot character, vector illustration, bold simple shapes, minimal details, solid colors, no gradients, clean background, icon-style design",
  mascot_handdrawn: "2D hand-drawn mascot character, illustration style, organic shapes, sketchy friendly feel, warm colors, textured or clean background, artistic illustration quality",
  mascot: "2D cartoon mascot character, flat illustration style, clean design, friendly appearance, professional 2D illustration",

  // 文创产品风格 - 高对比度和谐版
  product_studio: "premium product photography with strong visual contrast, single product hero shot 40-50% of frame, rich purple #7E3FF2 brand elements on product, deep navy #1E3A5F or pure white background, ONE vibrant orange #F97316 accent detail, extremely blurred background serving as contrast only, dramatic directional lighting with rim light, shallow depth of field, Apple product photography aesthetic, bold contrast, sophisticated minimalism, 4K resolution",
  product_lifestyle: "premium lifestyle product photography, single product focus with strong color contrast, rich purple #7E3FF2 brand elements, deep navy or white background with heavy blur, ONE orange #F97316 accent as visual anchor, natural lighting with defined shadows, shallow depth of field, harmonious visual hierarchy, 4K resolution",
  product_premium: "luxury product photography with dramatic contrast, single product dominant in frame, rich purple #7E3FF2 against deep dark background, ONE vibrant orange #F97316 highlight, cinematic lighting, magazine editorial quality, bold color contrast, sophisticated minimalism, 8K resolution",
  product: "product photography with strong visual contrast, clean background, single focal point, bold color hierarchy, professional lighting, high quality",

  // 文创单品 - 对标朱家角品质
  tote_bag: "professional product photography of a premium canvas tote bag, heavy cotton canvas with visible natural fiber weave and matte texture, brand logo prominently displayed on front, pure white seamless background, professional soft box lighting with gentle key light and subtle fill, soft shadows defining form, hero shot centered with slight angle, shallow depth of field, commercial photography quality, ultra high detail in fabric weave, 4K resolution, warm professional color grading",
  mug: "professional product photography of a ceramic mug, glossy ceramic glaze with subtle reflections and smooth premium finish, brand logo clearly printed, pure white seamless background, professional soft box lighting with gentle rim light, soft shadow grounding the product, hero shot centered, shallow depth of field, commercial photography quality, ultra high detail in ceramic texture, 4K resolution, warm professional color grading",
  notebook: "professional product photography of a hardcover notebook, textured cardstock with visible paper grain and premium matte finish, brand logo embossed on cover, placed on light wooden desk surface with soft natural shadow, professional soft box lighting, hero shot centered with slight overhead angle, shallow depth of field, commercial photography quality, ultra high detail in paper texture, 4K resolution, warm professional color grading",
  sticker: "professional product photography of premium sticker sheet, die-cut designs with clean edges, brand elements visible, white background, professional studio lighting, macro detail showing print quality, commercial photography quality, 4K resolution",
  t_shirt: "professional product photography of a premium cotton t-shirt, soft fabric texture visible, brand design printed on front, white studio background, professional soft box lighting, hero shot centered, commercial photography quality, ultra high detail in fabric weave, 4K resolution",

  // Logo 风格 - 高对比度和谐版 (70-20-10 法则)
  logo_tech: "professional brand logo design with strong visual hierarchy, 70-20-10 color rule: 70% rich purple #7E3FF2 dominant, 20% deep navy #1E3A5F or white contrast background, 10% ONE vibrant orange #F97316 accent only, large bold brand text as single focal point 40% of composition, clean modern sans-serif typography, minimal tech elements, generous negative space, Apple/Tesla minimalist aesthetic, bold contrast, sophisticated restraint, all text clearly legible, 4K resolution",
  logo_vibrant: "modern brand logo design with strong color contrast, dominant purple #7E3FF2 brand text, deep navy or white background for maximum contrast, ONE small orange #F97316 accent as visual anchor, single focal point composition, clean typography hierarchy, no competing elements, bold minimalist style, 4K resolution",

  // 基础设计
  logo: "professional logo design, clean geometric shapes, flat design, scalable, white background, high quality",
  poster: "professional poster design, high quality, balanced composition",
  banner: "professional web banner, modern geometric, brand colors",
  card: "professional card design, subtle geometric pattern",
  social: "professional social media graphic, engaging visual",
  icon: "minimalist app icon, flat design, recognizable silhouette, simple geometric shapes",
  brand_image: "professional brand visual, geometric pattern, studio lighting, clean composition",
  illustration: "professional editorial illustration, modern geometric style, conceptual shapes, brand colors",
};

// ============================================================
// Prompt 构建 - 后端自适应
// ============================================================

function buildPrompt(userPrompt: string, style: string, colorScheme?: string, supportsText: boolean = false): string {
  const styleSuffix = STYLE_PRESETS[style] || STYLE_PRESETS.logo;
  let fullPrompt = `${userPrompt}, ${styleSuffix}`;
  
  if (colorScheme) {
    fullPrompt += `, ${colorScheme} color scheme`;
  }
  
  // GPT Image 2: 支持文字，不需要 "NO TEXT" 限制
  // Gemini: 需要 "NO TEXT" 避免乱码
  if (supportsText) {
    fullPrompt += ", no purple-pink gradient, no emoji, professional design, high quality";
  } else {
    fullPrompt += ", no purple-pink gradient, no emoji, professional design, high quality, NO TEXT NO LETTERS NO CHINESE CHARACTERS";
  }
  
  // 追加对比度和视觉焦点指导（最小改动，最大效果）
  fullPrompt += ", strong color contrast between subject and background, single clear visual focal point, accent color is the brightest element, harmonious color balance with one dominant color";
  
  return fullPrompt;
}

// ============================================================
// 图片生成函数
// ============================================================

async function generateWithImagesApi(backend: ImageBackend, prompt: string, width: number, height: number): Promise<{ imageData: Buffer; raw: any }> {
  const response = await fetch(`${backend.baseUrl}/images/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${backend.apiKey}`,
    },
    body: JSON.stringify({
      model: backend.model,
      prompt: prompt,
      size: `${width}x${height}`,
      output_format: "png",
      quality: "auto",
    }),
    signal: AbortSignal.timeout(backend.timeout),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();

  if (data.data?.[0]?.b64_json) {
    const buffer = Buffer.from(data.data[0].b64_json, "base64");
    return { imageData: buffer, raw: data };
  }

  if (data.data?.[0]?.url) {
    const imgResponse = await fetch(data.data[0].url, {
      signal: AbortSignal.timeout(60000),
    });
    if (!imgResponse.ok) throw new Error(`Image download failed: ${imgResponse.status}`);
    const buffer = Buffer.from(await imgResponse.arrayBuffer());
    return { imageData: buffer, raw: data };
  }

  throw new Error("No image data in response");
}

async function generateWithChatApi(backend: ImageBackend, prompt: string, width: number, height: number): Promise<{ imageData: Buffer; raw: any }> {
  const response = await fetch(`${backend.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${backend.apiKey}`,
    },
    body: JSON.stringify({
      model: backend.model,
      messages: [
        {
          role: "user",
          content: `Generate an image: ${prompt}. The image should be ${width}x${height} pixels.`,
        },
      ],
    }),
    signal: AbortSignal.timeout(backend.timeout),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const messageContent = data.choices?.[0]?.message?.content;

  if (!messageContent) {
    throw new Error("No content in chat response");
  }

  const base64Match = messageContent.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)/);

  if (base64Match && base64Match[1]) {
    const buffer = Buffer.from(base64Match[1], "base64");
    return { imageData: buffer, raw: data };
  }

  const urlMatch = messageContent.match(/https?:\/\/[^\s"]+\.(?:png|jpg|jpeg|gif|webp)/i);
  if (urlMatch) {
    const imgResponse = await fetch(urlMatch[0], {
      signal: AbortSignal.timeout(60000),
    });
    if (!imgResponse.ok) throw new Error(`Image download failed: ${imgResponse.status}`);
    const buffer = Buffer.from(await imgResponse.arrayBuffer());
    return { imageData: buffer, raw: data };
  }

  throw new Error(`No image data found in chat response. Content: ${messageContent.slice(0, 200)}`);
}

// ============================================================
// 主工具入口
// ============================================================

export default tool({
  description:
    "使用 AI 生成设计图像。GPT Image 2 支持中英文文字！参数: prompt(描述), style(风格), width(默认1024), height(默认1024), output_path(保存路径)",
  args: {
    prompt: tool.schema.string().describe("图像生成提示词，描述你想要的设计。GPT Image 2 支持中英文文字！"),
    style: tool.schema
      .enum([
        "logo_tech",
        "logo_vibrant",
        "product_lifestyle",
        "product_studio",
        "mascot_tech",
        "mascot_cute",
        "mascot_premium",
        "mascot_flat",
        "mascot_handdrawn",
        "mascot",
        "product",
        "tote_bag",
        "mug",
        "notebook",
        "sticker",
        "t_shirt",
        "logo",
        "poster",
        "banner",
        "card",
        "social",
        "icon",
        "brand_image",
        "illustration",
      ] as const)
      .default("mascot")
      .describe("设计风格"),
    width: tool.schema.number().default(1024).describe("图像宽度（像素）"),
    height: tool.schema.number().default(1024).describe("图像高度（像素）"),
    color_scheme: tool.schema.string().optional().describe("色彩方案描述"),
    output_path: tool.schema.string().describe("图像保存路径"),
  },
  async execute(args, ctx) {
    const { prompt, style, width, height, color_scheme, output_path } = args;

    const fs = await import("fs/promises");
    const path = await import("path");
    const outputFile = path.resolve(ctx.worktree, output_path);
    await fs.mkdir(path.dirname(outputFile), { recursive: true });

    const errors: string[] = [];

    for (let i = 0; i < BACKENDS.length; i++) {
      const backend = BACKENDS[i];
      
      // 根据后端能力构建不同的 prompt
      const fullPrompt = buildPrompt(prompt, style, color_scheme, backend.supportsText);
      
      console.log(`[text-to-image] 尝试后端: ${backend.name} (${backend.model})`);
      console.log(`[text-to-image] 支持文字: ${backend.supportsText ? "是" : "否"}`);

      try {
        const generateFn = backend.type === "images_api" ? generateWithImagesApi : generateWithChatApi;
        const { imageData } = await generateFn(backend, fullPrompt, width, height);

        await fs.writeFile(outputFile, imageData);

        console.log(`[text-to-image] ✅ 成功! 后端: ${backend.name}`);
        return `✅ 图像已生成并保存到: ${output_path}
📐 尺寸: ${width}x${height}
🎨 风格: ${style}
🤖 模型: ${backend.name} (${backend.model})
📝 支持文字: ${backend.supportsText ? "是" : "否"}
📁 文件大小: ${(imageData.length / 1024).toFixed(1)} KB`;
      } catch (error: any) {
        const errMsg = error.message?.slice(0, 150) || String(error);
        console.log(`[text-to-image] ❌ ${backend.name} 失败: ${errMsg}`);
        errors.push(`${backend.name}: ${errMsg}`);
      }
    }

    return `图像生成失败，所有后端均已尝试：\n\n${errors.map((e, i) => `${i + 1}. ${e}`).join("\n")}`;
  },
});
