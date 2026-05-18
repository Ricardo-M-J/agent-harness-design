/**
 * Text-to-Image Tool - 上海创智 API 版本
 * 使用 gpt-image-2 模型
 * 独立运行，不依赖 OpenCode plugin
 */

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
  console.log(`[text-to-image] 模型: gpt-image-2`);
  console.log(`[text-to-image] 尺寸: ${width}x${height}`);

  try {
    const response = await fetch(`${API_BASE_URL}/images/generations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-image-2",
        prompt: fullPrompt,
        n: 1,
        size: `${width}x${height}`,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP ${response.status}: ${response.statusText}`);
      console.error(errorText);
      process.exit(1);
    }

    const data = await response.json();
    
    if (!data.data || !data.data[0]) {
      console.error("API 返回数据格式错误:", JSON.stringify(data, null, 2));
      process.exit(1);
    }

    const imageData = data.data[0];
    
    // 检查是否有 base64 数据
    if (imageData.b64_json) {
      console.log(`[text-to-image] 收到 base64 图像数据`);
      
      const fs = await import("fs/promises");
      const path = await import("path");
      const outputFile = path.resolve(outputPath);
      await fs.mkdir(path.dirname(outputFile), { recursive: true });

      // 解码 base64 并保存
      const buffer = Buffer.from(imageData.b64_json, 'base64');
      await fs.writeFile(outputFile, buffer);

      console.log(`✅ 图像已保存: ${outputPath}`);
      console.log(`📁 文件大小: ${(buffer.length / 1024).toFixed(1)} KB`);
      console.log(`📝 修订提示词: ${imageData.revised_prompt || fullPrompt}`);
    } else if (imageData.url) {
      // 如果有 URL，下载图像
      console.log(`[text-to-image] 图像URL: ${imageData.url}`);
      console.log(`[text-to-image] 正在下载...`);

      const imageResponse = await fetch(imageData.url);

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
      console.log(`🔗 图像URL: ${imageData.url}`);
      console.log(`📁 文件大小: ${(buffer.length / 1024).toFixed(1)} KB`);
    } else {
      console.error("API 返回的数据中没有图像:", JSON.stringify(imageData, null, 2));
      process.exit(1);
    }
  } catch (error: any) {
    console.error(`❌ 失败: ${error.message}`);
    process.exit(1);
  }
}

main();
