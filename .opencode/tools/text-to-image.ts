/**
 * Text-to-Image Custom Tool for OpenCode Design System
 *
 * 使用 Gemini API (gemini-3-pro-image-preview 模型) 生成设计图像。
 * API: https://apicz.boyuerichdata.com/v1/chat/completions
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
const MODEL = "gemini-2.5-flash-image";

// 风格预设
const STYLE_PRESETS: Record<string, string> = {
  // 基础设计风格
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

  // 文创产品风格（写实产品实拍）
  tote_bag: "realistic product photography of a canvas tote bag with mascot print, studio lighting, white background, professional product shot, mockup style, high detail, clean edges",
  mug: "realistic product photography of a ceramic mug with mascot design, studio lighting, white background, professional product shot, mockup style, high detail",
  notebook: "realistic product photography of a hardcover notebook with mascot cover, studio lighting, white background, professional product shot, mockup style, high detail",
  sticker: "realistic product photography of sticker sheet with mascot designs, white background, professional product shot, mockup style, high detail, die-cut effect",
  t_shirt: "realistic product photography of a white t-shirt with mascot print, studio lighting, professional product shot, mockup style, high detail, fabric texture visible",
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
    "使用 AI 生成设计图像。支持基础设计（logo/吉祥物/海报）和文创产品（帆布袋/马克杯/笔记本/贴纸/T恤）。基于 Gemini API (gemini-3-pro-image-preview 模型)。参数: prompt(描述), style(logo/mascot/poster/tote_bag/mug/notebook/sticker/t_shirt等), width(默认1024), height(默认1024), output_path(保存路径)",
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
        "tote_bag",
        "mug",
        "notebook",
        "sticker",
        "t_shirt",
      ] as const)
      .default("logo")
      .describe("设计风格：基础(logo/mascot/poster等) 或 文创产品(tote_bag/mug/notebook/sticker/t_shirt)"),
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
    console.log(`[text-to-image] 模型: ${MODEL}`);

    try {
      // Gemini 使用 chat/completions 接口
      const response = await fetch(`${API_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            {
              role: "user",
              content: `Generate an image: ${fullPrompt}. The image should be ${width}x${height} pixels.`,
            },
          ],
        }),
        signal: AbortSignal.timeout(120000), // 2分钟 timeout
      });

      if (!response.ok) {
        const errorText = await response.text();
        return `图像生成失败: HTTP ${response.status} ${response.statusText}\n${errorText}`;
      }

      const data = await response.json();

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        return `图像生成失败: API 返回数据格式错误\n${JSON.stringify(data)}`;
      }

      const messageContent = data.choices[0].message.content;
      const fs = await import("fs/promises");
      const path = await import("path");
      const outputFile = path.resolve(ctx.worktree, output_path);
      await fs.mkdir(path.dirname(outputFile), { recursive: true });

      let savedBytes = 0;

      // Gemini 返回的图片在 content 中，可能是 base64 或 markdown 格式
      // 尝试提取 base64 图片数据
      const base64Match = messageContent.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)/);

      if (base64Match && base64Match[1]) {
        console.log(`[text-to-image] 收到 base64 图像数据`);
        const buffer = Buffer.from(base64Match[1], "base64");
        await fs.writeFile(outputFile, buffer);
        savedBytes = buffer.length;
      } else if (messageContent.includes("http")) {
        // 尝试提取 URL
        const urlMatch = messageContent.match(/https?:\/\/[^\s"]+\.(?:png|jpg|jpeg|gif|webp)/i);
        if (urlMatch) {
          console.log(`[text-to-image] 图像URL: ${urlMatch[0]}`);
          const imageResponse = await fetch(urlMatch[0], {
            signal: AbortSignal.timeout(60000),
          });
          if (!imageResponse.ok) {
            return `图像下载失败: HTTP ${imageResponse.status}`;
          }
          const buffer = Buffer.from(await imageResponse.arrayBuffer());
          await fs.writeFile(outputFile, buffer);
          savedBytes = buffer.length;
        } else {
          return `图像生成失败: 无法从响应中提取图像数据\n响应内容: ${messageContent.slice(0, 200)}`;
        }
      } else {
        return `图像生成失败: 无可用图像数据\n响应内容: ${messageContent.slice(0, 200)}`;
      }

      return `✅ 图像已生成并保存到: ${output_path}
📐 尺寸: ${width}x${height}
🎨 风格: ${style}
📁 文件大小: ${(savedBytes / 1024).toFixed(1)} KB
📝 提示词: ${fullPrompt}`;
    } catch (error: any) {
      return `图像生成失败: ${error.message}`;
    }
  },
});
