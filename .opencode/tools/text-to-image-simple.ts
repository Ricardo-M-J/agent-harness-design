/**
 * Text-to-Image CLI Tool - 创智 API (gpt-image-2)
 * 独立运行，供 Designer Agent 通过 shell 调用
 */
const API_BASE_URL = "https://apicz.boyuerichdata.com/v1";
const API_KEY = "sk-KQRts8IEJesfFj06YYsPXuleWodDxIlZ2t5g2A3DJDk0XRvJ";

const STYLE_PRESETS: Record<string, string> = {
  logo: "abstract minimalist logo mark, clean geometric shapes, flat design, scalable, NO TEXT NO LETTERS, pure visual symbol only, white background",
  mascot: "cute mascot character, friendly expression, clean design, NO TEXT",
  product: "product photography, clean background, professional lighting, high quality",
  illustration: "abstract editorial illustration, modern geometric style, brand colors, NO TEXT",
  brand_image: "abstract brand texture, geometric pattern, studio lighting, NO TEXT",
};

function buildPrompt(userPrompt: string, style: string, colorScheme?: string): string {
  const styleSuffix = STYLE_PRESETS[style] || STYLE_PRESETS.logo;
  let fullPrompt = `${userPrompt}, ${styleSuffix}`;
  if (colorScheme) fullPrompt += `, ${colorScheme} color scheme`;
  fullPrompt += ", no purple-pink gradient, no emoji, professional design, high quality";
  return fullPrompt;
}

async function main() {
  const args = process.argv.slice(2);
  const getArg = (name: string) => { const idx = args.indexOf(`--${name}`); return idx >= 0 ? args[idx + 1] : undefined; };

  const prompt = getArg("prompt") || "modern minimalist logo";
  const style = getArg("style") || "logo";
  const width = parseInt(getArg("width") || "1024");
  const height = parseInt(getArg("height") || "1024");
  const colorScheme = getArg("color_scheme");
  const outputPath = getArg("output") || `outputs/generated_${Date.now()}.png`;
  const fullPrompt = buildPrompt(prompt, style, colorScheme);

  console.log(`[text-to-image] 提示词: ${fullPrompt.substring(0, 200)}...`);
  console.log(`[text-to-image] 模型: gpt-image-2, 尺寸: ${width}x${height}`);

  try {
    const response = await fetch(`${API_BASE_URL}/images/generations`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
      body: JSON.stringify({ model: "gpt-image-2", prompt: fullPrompt, n: 1, size: `${width}x${height}` }),
    });

    if (!response.ok) { const t = await response.text(); console.error(`HTTP ${response.status}: ${t}`); process.exit(1); }

    const data = await response.json();
    if (!data.data || !data.data[0]) { console.error("无数据:", JSON.stringify(data)); process.exit(1); }

    const img = data.data[0];
    const fs = await import("fs/promises");
    const path = await import("path");
    const outputFile = path.resolve(outputPath);
    await fs.mkdir(path.dirname(outputFile), { recursive: true });

    if (img.b64_json) {
      const buffer = Buffer.from(img.b64_json, "base64");
      await fs.writeFile(outputFile, buffer);
      console.log(`✅ 已保存: ${outputPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
    } else if (img.url) {
      const imgResp = await fetch(img.url);
      const buffer = Buffer.from(await imgResp.arrayBuffer());
      await fs.writeFile(outputFile, buffer);
      console.log(`✅ 已保存: ${outputPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
    }
  } catch (e: any) { console.error(`❌ ${e.message}`); process.exit(1); }
}

main();
