/**
 * 图片生成模型测试脚本 - 支持多种API格式
 */

import * as fs from 'fs';
import * as path from 'path';

const TEST_PROMPT = "A cute robot mascot character, futuristic tech design, blue and orange colors, clean white background";
const OUTPUT_DIR = path.join(process.cwd(), "outputs", "model_test");
const API_KEY = "sk-KQRts8IEJesfFj06YYsPXuleWodDxIlZ2t5g2A3DJDk0XRvJ";

async function saveImage(base64Data: string, outputPath: string): Promise<number> {
  const buffer = Buffer.from(base64Data, "base64");
  await fs.promises.writeFile(outputPath, buffer);
  return buffer.length;
}

async function downloadImage(url: string, outputPath: string): Promise<number> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Download failed: ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.promises.writeFile(outputPath, buffer);
  return buffer.length;
}

// chat/completions 格式 (Gemini)
async function testChatCompletion(name: string, apiUrl: string, model: string): Promise<{ success: boolean; error?: string; size?: number }> {
  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${API_KEY}` },
      body: JSON.stringify({ model, messages: [{ role: "user", content: `Generate: ${TEST_PROMPT}` }] }),
      signal: AbortSignal.timeout(120000),
    });

    if (!res.ok) {
      return { success: false, error: `${res.status}: ${(await res.text()).slice(0, 100)}` };
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "";
    const base64 = content.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)/);
    
    if (base64) {
      const size = await saveImage(base64[1], path.join(OUTPUT_DIR, `${name}.png`));
      return { success: true, size };
    }
    return { success: false, error: "No image in chat response" };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// images/generations 格式 (GPT image2, DALL-E)
async function testImagesGeneration(name: string, apiUrl: string, model: string): Promise<{ success: boolean; error?: string; size?: number }> {
  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${API_KEY}` },
      body: JSON.stringify({ model, prompt: TEST_PROMPT, size: "1024x1024", n: 1 }),
      signal: AbortSignal.timeout(120000),
    });

    if (!res.ok) {
      return { success: false, error: `${res.status}: ${(await res.text()).slice(0, 100)}` };
    }

    const data = await res.json();
    
    // 可能是 URL 返回
    if (data.data?.[0]?.url) {
      const size = await downloadImage(data.data[0].url, path.join(OUTPUT_DIR, `${name}.png`));
      return { success: true, size };
    }
    
    // 可能是 base64 返回
    if (data.data?.[0]?.b64_json) {
      const size = await saveImage(data.data[0].b64_json, path.join(OUTPUT_DIR, `${name}.png`));
      return { success: true, size };
    }
    
    return { success: false, error: "No image in images response" };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

async function main() {
  await fs.promises.mkdir(OUTPUT_DIR, { recursive: true });
  console.log("🚀 Image Generation Model Test\n");

  const tests = [
    // Gemini APIs (chat/completions)
    { name: "gemini_2.5_flash_image", fn: testChatCompletion, apiUrl: "https://apicz.boyuerichdata.com/v1/chat/completions", model: "gemini-2.5-flash-image" },
    { name: "gemini_3_pro_image", fn: testChatCompletion, apiUrl: "https://apicz.boyuerichdata.com/v1/chat/completions", model: "gemini-3-pro-image-preview" },
    
    // GPT image2 (images/generations)
    { name: "gpt_image2", fn: testImagesGeneration, apiUrl: "https://apicz.boyuerichdata.com/v1/images/generations", model: "gpt-image-2" },
    { name: "dall_e_3", fn: testImagesGeneration, apiUrl: "https://apicz.boyuerichdata.com/v1/images/generations", model: "dall-e-3" },
  ];

  for (const t of tests) {
    process.stdout.write(`Testing ${t.model}... `);
    const result = await t.fn(t.name, t.apiUrl, t.model);
    if (result.success) {
      console.log(`✅ ${(result.size! / 1024).toFixed(0)} KB`);
    } else {
      console.log(`❌ ${result.error?.slice(0, 80)}`);
    }
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log("\n✅ Check outputs/model_test/ for results");
}

main().catch(console.error);
