/**
 * Text-to-Image Custom Tool for OpenCode Design System
 *
 * 使用上海创智 API (image2 模型) 生成设计图像。
 * API: https://apicz.boyuerichdata.com/v1
 *
 * ⚠️ 重要限制：AI 图像生成模型无法正确渲染文字（尤其是中文汉字）。
 * 生成的图像中的文字将是乱码/随机字形。
 * Logo、名片、海报等含文字的图像 → 必须使用 SVG（用 HTML/CSS 渲染文字）。
 * 本工具仅适用于：纯视觉元素（纹理/背景/抽象图形/风格参考图）。
 *
 * 调用方式：
 *   node .opencode/tools/text-to-image.ts --prompt "abstract geometric pattern" --style icon --output "outputs/project/pattern.png"
 */

import { tool } from "@opencode-ai/plugin/tool";

// API 配置
const API_BASE_URL = "https://apicz.boyuerichdata.com/v1";
const API_KEY = "sk-KQRts8IEJesfFj06YYsPXuleWodDxIlZ2t5g2A3DJDk0XRvJ";

// 文生图风格预设（所有预设强调：无文字，纯视觉元素）
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
  // 添加反套路约束
  fullPrompt +=
    ", no purple-pink gradient, no emoji, professional design, high quality, no text rendering artifacts";
  return fullPrompt;
}

export const textToImageTool = tool({
  description:
    "使用 AI 生成设计图像（Logo、海报、吉祥物、文创等）。基于上海创智 API (image2 模型)。支持多种设计风格预设。参数: prompt(描述), style(logo/poster/banner/card/social/icon/brand_image/illustration/mascot/product), width(默认1024), height(默认1024), output_path(保存路径)",
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
    width: tool.schema.number().default(1024).describe("图像宽度（像素）"),
    height: tool.schema.number().default(1024).describe("图像高度（像素）"),
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
    console.log(`[text-to-image] 提示词: ${fullPrompt.substring(0, 200)}...`);

    try {
      // 调用创智 API
      const response = await fetch(`${API_BASE_URL}/images/generations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "image2",
          prompt: fullPrompt,
          n: 1,
          size: `${width}x${height}`,
        }),
        signal: AbortSignal.timeout(120000),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return `图像生成失败: HTTP ${response.status} ${response.statusText}\n${errorText}`;
      }

      const data = await response.json();
      
      if (!data.data || !data.data[0] || !data.data[0].url) {
        return `图像生成失败: API 返回数据格式错误\n${JSON.stringify(data)}`;
      }

      const imageUrl = data.data[0].url;
      console.log(`[text-to-image] 图像URL: ${imageUrl}`);

      // 下载图像
      const imageResponse = await fetch(imageUrl, {
        signal: AbortSignal.timeout(60000),
      });

      if (!imageResponse.ok) {
        return `图像下载失败: HTTP ${imageResponse.status} ${imageResponse.statusText}`;
      }

      const buffer = Buffer.from(await imageResponse.arrayBuffer());

      // 写入文件
      const fs = await import("fs/promises");
      const path = await import("path");

      const outputFile = path.resolve(ctx.worktree, output_path);
      await fs.mkdir(path.dirname(outputFile), { recursive: true });
      await fs.writeFile(outputFile, buffer);

      const result = {
        title: "图像生成成功",
        output: `✅ 图像已生成并保存到: ${output_path}
📐 尺寸: ${width}x${height}
🎨 风格: ${style}
🔗 图像URL: ${imageUrl}
📝 完整提示词: ${fullPrompt}`,
        metadata: {
          image_url: imageUrl,
          output_path: output_path,
          style: style,
          width: width,
          height: height,
          prompt: fullPrompt,
          model: "image2",
        },
      };

      return JSON.stringify(result, null, 2);
    } catch (error: any) {
      return `图像生成失败: ${error.message}`;
    }
  },
});

/**
 * 独立运行模式（通过 Bash 调用时使用）
 *
 * 用法: npx tsx .opencode/tools/text-to-image.ts --prompt "..." --style logo --output "path/to/file.png"
 */
async function main() {
  const args = process.argv.slice(2);
  const getArg = (name: string) => {
    const idx = args.indexOf(`--${name}`);
    return idx >= 0 ? args[idx + 1] : undefined;
  };

  const prompt = getArg("prompt") || "modern minimalist logo";
  const style = getArg("style") || "logo";
  const width = parseInt(getArg("width") || "1024");
  const height = parseInt(getArg("height") || "1024");
  const colorScheme = getArg("color_scheme");
  const outputPath = getArg("output") || `outputs/generated_${Date.now()}.png`;

  const fullPrompt = buildPrompt(prompt, style, colorScheme);

  console.log(`[text-to-image] 提示词: ${fullPrompt.substring(0, 300)}...`);
  console.log(`[text-to-image] 正在调用创智 API...`);

  try {
    const response = await fetch(`${API_BASE_URL}/images/generations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "image2",
        prompt: fullPrompt,
        n: 1,
        size: `${width}x${height}`,
      }),
      signal: AbortSignal.timeout(120000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP ${response.status}: ${response.statusText}`);
      console.error(errorText);
      process.exit(1);
    }

    const data = await response.json();
    
    if (!data.data || !data.data[0] || !data.data[0].url) {
      console.error("API 返回数据格式错误:", JSON.stringify(data));
      process.exit(1);
    }

    const imageUrl = data.data[0].url;
    console.log(`[text-to-image] 图像URL: ${imageUrl}`);
    console.log(`[text-to-image] 正在下载...`);

    const imageResponse = await fetch(imageUrl, {
      signal: AbortSignal.timeout(60000),
    });

    if (!imageResponse.ok) {
      console.error(`下载失败: HTTP ${imageResponse.status}`);
      process.exit(1);
    }

    const fs = await import("fs/promises");
    const path = await import("path");
    const outputFile = path.resolve(outputPath);
    await fs.mkdir(path.dirname(outputFile), { recursive: true });

    const buffer = Buffer.from(await imageResponse.arrayBuffer());
    await fs.writeFile(outputFile, buffer);

    console.log(`✅ 图像已保存: ${outputPath}`);
    console.log(`🔗 图像URL: ${imageUrl}`);
  } catch (error: any) {
    console.error(`❌ 失败: ${error.message}`);
    process.exit(1);
  }
}

// 如果直接运行此脚本（非 import），执行 main
const isMain = process.argv[1]?.includes("text-to-image");
if (isMain) {
  main();
}
