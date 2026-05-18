/**
 * Text-to-Image Custom Tool for OpenCode Design System
 *
 * 使用上海创智 API (gpt-image-2 模型) 生成设计图像。
 * API: https://apicz.boyuerichdata.com/v1
 *
 * ⚠️ 重要限制：AI 图像生成模型无法正确渲染文字（尤其是中文汉字）。
 * Logo、名片、海报等含文字的图像 → 必须使用 SVG。
 * 本工具仅适用于：纯视觉元素（吉祥物/文创/纹理/抽象图形）。
 *
 * Designer 直接调用此 Tool，无需通过 shell。
 */

import { tool } from "@opencode-ai/plugin";

// API 配置
const API_BASE_URL = "https://apicz.boyuerichdata.com/v1";
const API_KEY = "sk-KQRts8IEJesfFj06YYsPXuleWodDxIlZ2t5g2A3DJDk0XRvJ";

// 文生图风格预设
const STYLE_PRESETS: Record<string, string> = {
  logo: "abstract minimalist logo mark, clean geometric shapes, flat design, scalable, NO TEXT NO LETTERS NO CHINESE CHARACTERS, pure visual symbol only, white background",
  poster: "abstract poster background, high quality, balanced composition, NO TEXT NO TYPOGRAPHY, pure visual atmosphere",
  banner: "abstract web banner background, modern geometric, brand colors, NO TEXT, pure visual texture",
  card: "abstract card background, subtle geometric pattern, NO TEXT",
  social: "abstract social media background, engaging visual texture, NO TEXT NO LETTERS",
  icon: "minimalist app icon, flat design, recognizable silhouette, simple geometric shapes, NO TEXT",
  brand_image: "abstract brand texture, geometric pattern, studio lighting, clean composition, NO TEXT NO LETTERS",
  illustration: "abstract editorial illustration, modern geometric style, conceptual shapes, brand colors, NO TEXT NO LETTERS",
  mascot: "cute mascot character, friendly expression, clean design, NO TEXT",
  product: "product photography, clean background, professional lighting, high quality",
};

function buildPrompt(userPrompt: string, style: string, colorScheme?: string): string {
  const styleSuffix = STYLE_PRESETS[style] || STYLE_PRESETS.logo;
  let fullPrompt = `${userPrompt}, ${styleSuffix}`;
  if (colorScheme) {
    fullPrompt += `, ${colorScheme} color scheme`;
  }
  fullPrompt += ", no purple-pink gradient, no emoji, professional design, high quality, no text rendering artifacts";
  return fullPrompt;
}

export default tool({
  description:
    "使用 AI 生成设计图像（Logo、海报、吉祥物、文创等）。基于上海创智 API (gpt-image-2 模型)。参数: prompt(描述), style(logo/poster/banner/card/social/icon/brand_image/illustration/mascot/product), width(默认1024), height(默认1024), output_path(保存路径)",
  args: {
    prompt: tool.schema.string().describe("图像生成提示词，描述你想要的设计"),
    style: tool.schema
      .enum([
        "logo",
        "poster",
        "banner",
        "card",
        "social",
        "icon",
        "brand_image",
        "illustration",
        "mascot",
        "product",
      ] as const)
      .default("logo")
      .describe("设计风格预设"),
    width: tool.schema.number().default(1024).describe("图像宽度（像素，最低1024）"),
    height: tool.schema.number().default(1024).describe("图像高度（像素，最低1024）"),
    color_scheme: tool.schema
      .string()
      .optional()
      .describe("色彩方案描述，如 'deep blue with red accent'"),
    output_path: tool.schema
      .string()
      .describe("图像保存路径，如 'outputs/project/logo.png'"),
  },
  async execute(args, ctx) {
    const { prompt, style, width, height, color_scheme, output_path } = args;
    const fullPrompt = buildPrompt(prompt, style, color_scheme);

    console.log(`[text-to-image] 正在生成图像...`);
    console.log(`[text-to-image] 风格: ${style}`);
    console.log(`[text-to-image] 尺寸: ${width}x${height}`);
    console.log(`[text-to-image] 模型: gpt-image-2`);

    try {
      const response = await fetch(`${API_BASE_URL}/images/generations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-image-2",
          prompt: fullPrompt,
          n: 1,
          size: `${width}x${height}`,
        }),
        signal: AbortSignal.timeout(360000),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return `图像生成失败: HTTP ${response.status} ${response.statusText}\n${errorText}`;
      }

      const data = await response.json();

      if (!data.data || !data.data[0]) {
        return `图像生成失败: API 返回数据格式错误\n${JSON.stringify(data)}`;
      }

      const imageData = data.data[0];
      const fs = await import("fs/promises");
      const path = await import("path");
      const outputFile = path.resolve(ctx.worktree, output_path);
      await fs.mkdir(path.dirname(outputFile), { recursive: true });

      let savedBytes = 0;

      // 处理 base64 返回
      if (imageData.b64_json) {
        console.log(`[text-to-image] 收到 base64 图像数据`);
        const buffer = Buffer.from(imageData.b64_json, "base64");
        await fs.writeFile(outputFile, buffer);
        savedBytes = buffer.length;
      }
      // 处理 URL 返回
      else if (imageData.url) {
        console.log(`[text-to-image] 图像URL: ${imageData.url}`);
        const imageResponse = await fetch(imageData.url, {
          signal: AbortSignal.timeout(60000),
        });
        if (!imageResponse.ok) {
          return `图像下载失败: HTTP ${imageResponse.status}`;
        }
        const buffer = Buffer.from(await imageResponse.arrayBuffer());
        await fs.writeFile(outputFile, buffer);
        savedBytes = buffer.length;
      } else {
        return `图像生成失败: 无可用图像数据\n${JSON.stringify(imageData)}`;
      }

      const revisedPrompt = imageData.revised_prompt || fullPrompt;
      return `✅ 图像已生成并保存到: ${output_path}
📐 尺寸: ${width}x${height}
🎨 风格: ${style}
📁 文件大小: ${(savedBytes / 1024).toFixed(1)} KB
📝 修订提示词: ${revisedPrompt}`;
    } catch (error: any) {
      return `图像生成失败: ${error.message}`;
    }
  },
});
