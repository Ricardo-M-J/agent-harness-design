/**
 * 图像生成 API 时延测试脚本
 * 
 * 用法：npx tsx test-image-latency.ts [次数]
 * 默认测试 3 次，可传入次数参数
 * 
 * 支持两种模式：
 * - gpt-image-2: 走 /v1/images/generations（OpenAI 原生图像 API）
 * - gemini-*: 走 /v1/chat/completions（多模态对话生成图片）
 */

const API_BASE = "https://apicz.boyuerichdata.com/v1";
const API_KEY = "sk-KQRts8IEJesfFj06YYsPXuleWodDxIlZ2t5g2A3DJDk0XRvJ";
const MODEL = "gemini-2.5-flash-image";

// Gemini 模型走 chat completions
const isGemini = MODEL.toLowerCase().includes("gemini");

interface TestResult {
  round: number;
  startTime: string;
  endTime: string;
  durationMs: number;
  durationSec: number;
  success: boolean;
  imageSize?: number;
  hasImage?: boolean;
  error?: string;
}

async function generateImage(round: number): Promise<TestResult> {
  const startTime = Date.now();
  const startTimeStr = new Date().toISOString();
  
  console.log(`\n🔄 第 ${round} 轮测试开始: ${startTimeStr}`);
  
  try {
    let response: Response;
    
    if (isGemini) {
      // Gemini: 走 chat completions，通过多模态对话生成图片
      response = await fetch(`${API_BASE}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            {
              role: "user",
              content: `Generate a simple test image: a cute blue robot owl mascot, clean vector style, NO TEXT. This is round ${round}.`,
            },
          ],
        }),
      });
    } else {
      // OpenAI: 走 images/generations
      response = await fetch(`${API_BASE}/images/generations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          prompt: `simple test image, round ${round}, minimal design, NO TEXT`,
          n: 1,
          size: "1024x1024",
        }),
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText.slice(0, 200)}`);
    }

    const data = await response.json();
    const endTime = Date.now();
    const endTimeStr = new Date().toISOString();
    const durationMs = endTime - startTime;
    const durationSec = durationMs / 1000;

    // 检查是否包含图片
    let hasImage = false;
    let imageSize: number | undefined;
    
    if (isGemini) {
      // Gemini: 图片在 choices[0].message.content 中，可能是 base64 内联或 URL
      const content = data.choices?.[0]?.message?.content || "";
      const hasBase64 = content.includes("data:image") || content.includes("base64");
      const hasUrl = content.includes("http") && content.includes(".png");
      hasImage = hasBase64 || hasUrl;
      
      if (hasBase64) {
        // 粗略估算 base64 图片大小
        const match = content.match(/base64,([A-Za-z0-9+/=]+)/);
        if (match) {
          imageSize = Math.round(match[1].length * 0.75 / 1024);
        }
      }
    } else {
      // OpenAI: 图片在 data[0]
      if (data.data?.[0]?.b64_json) {
        hasImage = true;
        imageSize = Math.round(data.data[0].b64_json.length * 0.75 / 1024);
      } else if (data.data?.[0]?.url) {
        hasImage = true;
        imageSize = -1;
      }
    }

    const sizeStr = imageSize ? (imageSize > 0 ? `${imageSize}KB` : "URL模式") : "-";
    const imgStatus = hasImage ? "📷" : "⚠️无图";
    console.log(`${imgStatus} 第 ${round} 轮成功! 耗时: ${durationSec.toFixed(1)}秒${imageSize ? `, 图片: ${sizeStr}` : ''}`);

    return {
      round,
      startTime: startTimeStr,
      endTime: endTimeStr,
      durationMs,
      durationSec,
      success: true,
      imageSize,
      hasImage,
    };
  } catch (error) {
    const endTime = Date.now();
    const endTimeStr = new Date().toISOString();
    const durationMs = endTime - startTime;
    const durationSec = durationMs / 1000;
    const errorMsg = error instanceof Error ? error.message : String(error);

    console.log(`❌ 第 ${round} 轮失败: ${errorMsg}`);

    return {
      round,
      startTime: startTimeStr,
      endTime: endTimeStr,
      durationMs,
      durationSec,
      success: false,
      error: errorMsg,
    };
  }
}

async function main() {
  const testCount = parseInt(process.argv[2]) || 3;
  const apiMode = isGemini ? "chat/completions (多模态)" : "images/generations";
  
  console.log("========================================");
  console.log("📊 图像生成 API 时延测试");
  console.log("========================================");
  console.log(`API: ${API_BASE}`);
  console.log(`模型: ${MODEL}`);
  console.log(`模式: ${apiMode}`);
  console.log(`测试次数: ${testCount}`);
  console.log(`开始时间: ${new Date().toISOString()}`);
  console.log("========================================");

  const results: TestResult[] = [];

  for (let i = 1; i <= testCount; i++) {
    const result = await generateImage(i);
    results.push(result);
    
    if (i < testCount) {
      console.log("⏳ 等待 2 秒后开始下一轮...");
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // 统计结果
  console.log("\n========================================");
  console.log("📈 测试结果统计");
  console.log("========================================");

  const successResults = results.filter(r => r.success);
  const failedResults = results.filter(r => !r.success);

  console.log(`\n总测试次数: ${results.length}`);
  console.log(`成功: ${successResults.length}`);
  console.log(`失败: ${failedResults.length}`);

  if (successResults.length > 0) {
    const durations = successResults.map(r => r.durationSec);
    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    const minDuration = Math.min(...durations);
    const maxDuration = Math.max(...durations);

    console.log("\n⏱️  成功请求时延统计:");
    console.log(`  平均: ${avgDuration.toFixed(1)} 秒`);
    console.log(`  最短: ${minDuration.toFixed(1)} 秒`);
    console.log(`  最长: ${maxDuration.toFixed(1)} 秒`);

    const OPENCODE_TOOL_TIMEOUT = 120;
    const overTimeout = successResults.filter(r => r.durationSec > OPENCODE_TOOL_TIMEOUT);
    console.log(`\n⚠️  超过 ${OPENCODE_TOOL_TIMEOUT}s (OpenCode Tool timeout): ${overTimeout.length}/${successResults.length}`);
    if (overTimeout.length > 0) {
      console.log("   ⛔ 这些请求在 OpenCode Tool 中会被 timeout 终止！");
    } else {
      console.log("   ✅ 所有请求都在 OpenCode Tool timeout 内完成！");
    }

    const withImage = successResults.filter(r => r.hasImage);
    console.log(`\n📷 包含图片的响应: ${withImage.length}/${successResults.length}`);
  }

  // 详细结果表格
  console.log("\n📋 详细结果:");
  console.log("轮次 | 状态    | 耗时(秒) | 图片");
  console.log("-".repeat(50));
  for (const r of results) {
    const status = r.success ? (r.hasImage ? "✅ 有图" : "⚠️ 无图") : "❌ 失败";
    const size = r.imageSize ? (r.imageSize > 0 ? `${r.imageSize}KB` : "URL") : "-";
    console.log(`  ${r.round}  | ${status.padEnd(8)} | ${r.durationSec.toFixed(1).padStart(6)} | ${size}`);
  }

  console.log("\n========================================");
  console.log(`测试结束时间: ${new Date().toISOString()}`);
  console.log("========================================");
}

main().catch(console.error);
