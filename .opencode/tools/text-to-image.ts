/**
 * Text-to-Image Custom Tool for OpenCode Design System
 *
 * 使用 Pollinations.ai 免费 API 生成设计图像。
 * 完全免费，无需 API Key，无需注册。
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
    "使用 AI 生成设计图像（Logo、海报、横幅等）。基于 Pollinations.ai 免费 API。支持多种设计风格预设。参数: prompt(描述), style(logo/poster/banner/card/social/icon/brand_image/illustration), width(默认512), height(默认512), output_path(保存路径)",
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
      ] as const)
      .default("logo")
      .describe("设计风格预设"),
    width: tool.schema.number().default(512).describe("图像宽度（像素）"),
    height: tool.schema.number().default(512).describe("图像高度（像素）"),
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
    const encodedPrompt = encodeURIComponent(fullPrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=flux&nologo=true`;

    console.log(`[text-to-image] 正在生成图像...`);
    console.log(`[text-to-image] 风格: ${style}`);
    console.log(`[text-to-image] 尺寸: ${width}x${height}`);
    console.log(`[text-to-image] 提示词: ${fullPrompt.substring(0, 200)}...`);

    try {
      const response = await fetch(imageUrl, {
        signal: AbortSignal.timeout(60000),
      });

      if (!response.ok) {
        return `图像生成失败: HTTP ${response.status} ${response.statusText}`;
      }

      const buffer = Buffer.from(await response.arrayBuffer());

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
🔗 在线URL: ${imageUrl}
📝 完整提示词: ${fullPrompt}`,
        metadata: {
          image_url: imageUrl,
          output_path: output_path,
          style: style,
          width: width,
          height: height,
          prompt: fullPrompt,
        },
      };

      return JSON.stringify(result, null, 2);
    } catch (error: any) {
      return `图像生成失败: ${error.message}\n\n回退方案：你可以直接在浏览器中打开此 URL 查看生成结果：\n${imageUrl}`;
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
  const width = parseInt(getArg("width") || "512");
  const height = parseInt(getArg("height") || "512");
  const colorScheme = getArg("color_scheme");
  const outputPath = getArg("output") || `outputs/generated_${Date.now()}.png`;

  const fullPrompt = buildPrompt(prompt, style, colorScheme);
  const encodedPrompt = encodeURIComponent(fullPrompt);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=flux&nologo=true`;

  console.log(`[text-to-image] 提示词: ${fullPrompt.substring(0, 300)}...`);
  console.log(`[text-to-image] 生成URL: ${imageUrl}`);
  console.log(`[text-to-image] 正在下载...`);

  try {
    const response = await fetch(imageUrl, { signal: AbortSignal.timeout(60000) });
    if (!response.ok) {
      console.error(`HTTP ${response.status}: ${response.statusText}`);
      process.exit(1);
    }

    const fs = await import("fs/promises");
    const path = await import("path");
    const outputFile = path.resolve(outputPath);
    await fs.mkdir(path.dirname(outputFile), { recursive: true });

    const buffer = Buffer.from(await response.arrayBuffer());
    await fs.writeFile(outputFile, buffer);

    console.log(`✅ 图像已保存: ${outputPath}`);
    console.log(`🔗 在线URL: ${imageUrl}`);
  } catch (error: any) {
    console.error(`❌ 失败: ${error.message}`);
    console.log(`🔗 在线URL（手动打开）: ${imageUrl}`);
    process.exit(1);
  }
}

// 如果直接运行此脚本（非 import），执行 main
const isMain = process.argv[1]?.includes("text-to-image");
if (isMain) {
  main();
}
