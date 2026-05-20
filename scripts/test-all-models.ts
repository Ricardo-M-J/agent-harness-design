/**
 * 图片生成模型穷举测试脚本
 */

import * as fs from 'fs';
import * as path from 'path';

const TEST_PROMPT = "A cute robot, blue and orange colors";
const OUTPUT_DIR = path.join(process.cwd(), "outputs", "model_test");
const API_URL = "https://apicz.boyuerichdata.com/v1/chat/completions";
const API_KEY = "sk-KQRts8IEJesfFj06YYsPXuleWodDxIlZ2t5g2A3DJDk0XRvJ";

// 各种可能的模型名
const MODELS = [
  // Gemini 2.5
  "gemini-2.5-flash-image-preview",
  "gemini-2.5-flash-image",
  "gemini-2.5-flash",
  "gemini-2.5",
  // Gemini 3
  "gemini-3-pro-image-preview",
  "gemini-3-pro",
  "gemini-3",
  // 其他可能的
  "gemini-pro-image",
  "gemini-image",
  "gemini-flash-image",
  // OpenAI DALL-E
  "dall-e-3",
  "dall-e-2",
  "gpt-image-2",
  "gpt-image",
  // 可能的o1-image或其他
  "o1-image",
];

async function testModel(model: string): Promise<{ success: boolean; error?: string; size?: number }> {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${API_KEY}` },
      body: JSON.stringify({ model, messages: [{ role: "user", content: `Generate: ${TEST_PROMPT}` }] }),
      signal: AbortSignal.timeout(60000),
    });

    if (!res.ok) {
      const err = await res.text();
      return { success: false, error: `${res.status}: ${err.slice(0, 100)}` };
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    const base64 = content.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)/);
    if (base64) {
      const buf = Buffer.from(base64[1], "base64");
      const outPath = path.join(OUTPUT_DIR, `${model.replace(/[^a-z0-9]/gi, "_")}.png`);
      await fs.promises.writeFile(outPath, buf);
      return { success: true, size: buf.length };
    }
    
    return { success: false, error: "No image in response" };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

async function main() {
  await fs.promises.mkdir(OUTPUT_DIR, { recursive: true });
  console.log("🔍 Testing all possible model names...\n");

  const results = [];
  for (const model of MODELS) {
    process.stdout.write(`Testing ${model}... `);
    const result = await testModel(model);
    if (result.success) {
      console.log(`✅ ${(result.size! / 1024).toFixed(0)} KB`);
    } else {
      console.log(`❌ ${result.error?.slice(0, 60)}`);
    }
    results.push({ model, ...result });
    await new Promise(r => setTimeout(r, 500));
  }

  console.log("\n📊 Available Models:");
  results.filter(r => r.success).forEach(r => {
    console.log(`✅ ${r.model} (${(r.size! / 1024).toFixed(0)} KB)`);
  });
}

main().catch(console.error);
