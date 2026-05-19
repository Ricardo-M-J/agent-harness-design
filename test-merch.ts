/**
 * 测试新模型和文创产品生成
 */

const API_BASE = "https://apicz.boyuerichdata.com/v1";
const API_KEY = "sk-KQRts8IEJesfFj06YYsPXuleWodDxIlZ2t5g2A3DJDk0XRvJ";

async function testModel() {
  console.log("========================================");
  console.log("测试 gemini-3-pro-image-preview 模型");
  console.log("========================================\n");

  // 测试1: 新模型生成吉祥物
  console.log("🔄 测试1: 新模型生成吉祥物...");
  const mascotResult = await testImage("cute tech mascot robot owl", "mascot", "outputs/test_mascot.png");
  console.log(mascotResult ? `✅ 成功: ${mascotResult}` : "❌ 失败");
  console.log();

  // 测试2: 文创产品 - 帆布袋
  console.log("🔄 测试2: 文创产品 - 帆布袋...");
  const toteResult = await testImage("cute tech mascot robot owl with blue colors", "tote_bag", "outputs/test_tote_bag.png");
  console.log(toteResult ? `✅ 成功: ${toteResult}` : "❌ 失败");
  console.log();

  // 测试3: 文创产品 - T恤
  console.log("🔄 测试3: 文创产品 - T恤...");
  const tshirtResult = await testImage("cute tech mascot robot owl with blue colors", "t_shirt", "outputs/test_tshirt.png");
  console.log(tshirtResult ? `✅ 成功: ${tshirtResult}` : "❌ 失败");
  console.log();

  // 测试4: 文创产品 - 马克杯
  console.log("🔄 测试4: 文创产品 - 马克杯...");
  const mugResult = await testImage("cute tech mascot robot owl with blue colors", "mug", "outputs/test_mug.png");
  console.log(mugResult ? `✅ 成功: ${mugResult}` : "❌ 失败");
  console.log();

  console.log("========================================");
  console.log("测试完成！");
  console.log("========================================");
}

async function testImage(prompt: string, style: string, output: string): Promise<string | null> {
  const startTime = Date.now();
  
  const stylePresets: Record<string, string> = {
    mascot: "cute mascot character, friendly expression, clean design, NO TEXT",
    tote_bag: "realistic product photography of a canvas tote bag with mascot print, studio lighting, white background, professional product shot, mockup style",
    t_shirt: "realistic product photography of a white t-shirt with mascot print, studio lighting, professional product shot, mockup style, fabric texture visible",
    mug: "realistic product photography of a ceramic mug with mascot design, studio lighting, white background, professional product shot, mockup style",
  };

  const fullPrompt = `${prompt}, ${stylePresets[style] || stylePresets.mascot}`;

  try {
    const response = await fetch(`${API_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gemini-3-pro-image-preview",
        messages: [
          {
            role: "user",
            content: `Generate an image: ${fullPrompt}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.log(`  HTTP ${response.status}: ${error.slice(0, 100)}`);
      return null;
    }

    const data = await response.json();
    const messageContent = data.choices?.[0]?.message?.content;

    if (!messageContent) {
      console.log("  无图片数据");
      return null;
    }

    // 提取 base64
    const base64Match = messageContent.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)/);
    
    if (base64Match) {
      const fs = await import("fs/promises");
      const path = await import("path");
      const buffer = Buffer.from(base64Match[1], "base64");
      const outputFile = path.resolve("/workspace/agent-harness-design", output);
      await fs.mkdir(path.dirname(outputFile), { recursive: true });
      await fs.writeFile(outputFile, buffer);
      
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      return `${buffer.length / 1024} KB (${duration}s)`;
    }

    // 尝试 URL
    const urlMatch = messageContent.match(/https?:\/\/[^\s"]+\.(?:png|jpg|jpeg)/i);
    if (urlMatch) {
      const imgResponse = await fetch(urlMatch[0]);
      if (imgResponse.ok) {
        const fs = await import("fs/promises");
        const path = await import("path");
        const buffer = Buffer.from(await imgResponse.arrayBuffer());
        const outputFile = path.resolve("/workspace/agent-harness-design", output);
        await fs.mkdir(path.dirname(outputFile), { recursive: true });
        await fs.writeFile(outputFile, buffer);
        const duration = ((Date.now() - startTime) / 1000).toFixed(1);
        return `${buffer.length / 1024} KB (${duration}s)`;
      }
    }

    console.log("  无法提取图片");
    return null;
  } catch (error: any) {
    console.log(`  错误: ${error.message}`);
    return null;
  }
}

testModel().catch(console.error);
