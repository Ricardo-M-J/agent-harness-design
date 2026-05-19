/**
 * Image Vision Tool — 调用 Moonshot kimi-k2.5 读图分析
 * 用法: npx tsx .opencode/tools/image-vision.ts --image <path> --prompt "<分析指令>"
 */
const API_KEY = "sk-95rL38krsPttv8x96dnuaRqI44T0g3BQ911K9HPB6xAqGbbU";
const API_URL = "https://api.moonshot.cn/v1/chat/completions";

async function main() {
  const args = process.argv.slice(2);
  const getArg = (name: string) => {
    const idx = args.indexOf(`--${name}`);
    return idx >= 0 ? args[idx + 1] : undefined;
  };

  // 只接受 --image/--prompt 标志参数，不使用位置参数回退（防止框架初始化时误传参数）
  const imagePath = getArg("image");
  let prompt = getArg("prompt");

  if (!imagePath) {
    // 静默退出，不报错 — 框架可能在初始化时无参数调用
    console.error("[image-vision] 未指定 --image，跳过。用法: --image <path> --prompt <分析指令>");
    process.exit(0);
  }

  if (!prompt) {
    prompt = "请详细描述这张图片的内容、颜色、构图和风格。";
  }

  const fs = await import("fs/promises");
  const path = await import("path");

  const resolvedPath = path.resolve(imagePath);

  let imageBuffer: Buffer;
  let mimeType: string;
  try {
    imageBuffer = await fs.readFile(resolvedPath);
    const ext = path.extname(resolvedPath).toLowerCase();
    mimeType = ext === ".jpg" || ext === ".jpeg" ? "image/jpeg"
      : ext === ".webp" ? "image/webp"
      : ext === ".gif" ? "image/gif"
      : "image/png";
  } catch (e: any) {
    console.error(`[image-vision] 无法读取图片: ${resolvedPath} — ${e.message}`);
    process.exit(1);
  }

  const base64 = imageBuffer.toString("base64");
  const dataUrl = `data:${mimeType};base64,${base64}`;

  console.error(`[image-vision] 图片: ${resolvedPath} (${(imageBuffer.length / 1024).toFixed(1)} KB)`);
  console.error(`[image-vision] 分析中...`);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "kimi-k2.5",
        messages: [
          {
            role: "user",
            content: [
              { type: "image_url", image_url: { url: dataUrl } },
              { type: "text", text: prompt },
            ],
          },
        ],
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const t = await response.text();
      console.error(`[image-vision] API 错误 HTTP ${response.status}: ${t.substring(0, 300)}`);
      process.exit(1);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error(`[image-vision] 无内容: ${JSON.stringify(data).substring(0, 300)}`);
      process.exit(1);
    }

    const usage = data.usage;
    console.error(`[image-vision] tokens: ${usage?.total_tokens || "?"} (prompt: ${usage?.prompt_tokens || "?"}, completion: ${usage?.completion_tokens || "?"})`);

    // 输出分析结果到 stdout
    console.log(content);
  } catch (e: any) {
    console.error(`[image-vision] 网络错误: ${e.message}`);
    process.exit(1);
  }
}

// 只在作为独立脚本直接运行时执行，避免被 import 时误触发
import { fileURLToPath } from "url";
const thisFile = fileURLToPath(import.meta.url);
const isDirectRun = process.argv[1] && (
  process.argv[1] === thisFile ||
  process.argv[1].endsWith("image-vision.ts") ||
  process.argv[1].endsWith("image-vision")
);
if (isDirectRun) {
  main();
}
