/**
 * Text-to-Image CLI Tool - 创智 API (gpt-image-2)
 * 独立运行，供 Designer Agent 通过 shell 调用
 */
const API_BASE_URL = "https://apicz.boyuerichdata.com/v1";
const API_KEY = "sk-KQRts8IEJesfFj06YYsPXuleWodDxIlZ2t5g2A3DJDk0XRvJ";

const STYLE_PRESETS: Record<string, string> = {
  logo:
    "Abstract minimalist brand symbol in premium flat vector style. " +
    "Clean geometric shapes with precise mathematical proportions — " +
    "a pure visual mark that works at 16px and 16m. " +
    "No gradients, no shadows, no embellishments — just essential form. " +
    "Pure white background, centered composition, scalable. " +
    "NO TEXT NO LETTERS NO CHINESE CHARACTERS — pure visual symbol only.",

  mascot:
    "Premium minimal vector illustration of a brand mascot character. " +
    "Soft cel-shading with translucent gradients, elegant refined outlines — " +
    "not cartoonishly thick, not photorealistic. " +
    "The character has personality and presence — expressive bright eyes, " +
    "a warm approachable expression, a dynamic yet composed pose. " +
    "Clean edges, studio-quality rendering, full body centered composition. " +
    "Pure white or transparent background. " +
    "NO TEXT, NO LETTERS, NO NUMBERS, NO WATERMARKS, NO UI ELEMENTS.",

  product:
    "Premium product photography with clean minimal presentation. " +
    "The product is the hero — centered, well-lit, every detail visible. " +
    "Professional studio lighting: soft key light, gentle fill, subtle rim highlight. " +
    "Pure white seamless background, commercial e-commerce grade. " +
    "Macro detail visible — material texture, surface finish, build quality. " +
    "NO WATERMARKS, NO UI ELEMENTS, NO DISTRACTING PROPS.",

  illustration:
    "Premium editorial illustration with conceptual depth. " +
    "Modern geometric style, abstract shapes suggesting meaning without literal representation. " +
    "Refined color palette, balanced composition, generous negative space. " +
    "New Yorker magazine quality — sophisticated, intelligent, visually distinctive. " +
    "NO TEXT NO LETTERS NO TYPOGRAPHY.",

  brand_image:
    "Abstract brand texture with premium material quality. " +
    "Geometric pattern expressing brand identity through rhythm and proportion. " +
    "Studio lighting revealing subtle surface detail — micro-texture, gentle emboss. " +
    "Clean refined composition, generous margins, editorial quality. " +
    "NO TEXT NO LETTERS NO WATERMARKS.",
};

function buildPrompt(userPrompt: string, style: string, colorScheme?: string): string {
  const styleSuffix = STYLE_PRESETS[style] || STYLE_PRESETS.logo;

  const parts = [userPrompt, styleSuffix];

  if (colorScheme) {
    parts.push(`Color palette: ${colorScheme}.`);
  }

  parts.push(
    "No purple-pink gradient, no emoji, no cartoonish cliches. " +
    "Professional studio-level quality, clean rendered edges. " +
    "No text rendering artifacts, no garbled typography, no hallucinated letters."
  );

  return parts.join("\n");
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
  console.log(`[text-to-image] 模型: gemini-2.5-flash-image, 尺寸: ${width}x${height}`);

  try {
    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
      body: JSON.stringify({
        model: "gemini-2.5-flash-image",
        messages: [{ role: "user", content: `Generate an image: ${fullPrompt}. The image should be ${width}x${height} pixels.` }],
      }),
      signal: AbortSignal.timeout(120000),
    });

    if (!response.ok) { const t = await response.text(); console.error(`HTTP ${response.status}: ${t}`); process.exit(1); }

    const data = await response.json();
    const messageContent = data.choices?.[0]?.message?.content;
    if (!messageContent) { console.error("无数据:", JSON.stringify(data)); process.exit(1); }

    const fs = await import("fs/promises");
    const path = await import("path");
    const outputFile = path.resolve(outputPath);
    await fs.mkdir(path.dirname(outputFile), { recursive: true });

    let savedBytes = 0;
    const base64Match = messageContent.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)/);
    if (base64Match && base64Match[1]) {
      const buffer = Buffer.from(base64Match[1], "base64");
      await fs.writeFile(outputFile, buffer);
      savedBytes = buffer.length;
    } else if (messageContent.includes("http")) {
      const urlMatch = messageContent.match(/https?:\/\/[^\s"]+\.(?:png|jpg|jpeg|gif|webp)/i);
      if (urlMatch) {
        const imgResp = await fetch(urlMatch[0], { signal: AbortSignal.timeout(60000) });
        const buffer = Buffer.from(await imgResp.arrayBuffer());
        await fs.writeFile(outputFile, buffer);
        savedBytes = buffer.length;
      }
    }
    console.log(`✅ 已保存: ${outputPath} (${(savedBytes / 1024).toFixed(1)} KB)`);
  } catch (e: any) { console.error(`❌ ${e.message}`); process.exit(1); }
}

main();
