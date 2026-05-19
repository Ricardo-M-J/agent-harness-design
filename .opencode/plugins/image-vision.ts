import { tool } from "@opencode-ai/plugin";
import { z } from "zod";
import { readFile } from "fs/promises";
import { resolve, extname } from "path";

const API = "https://api.moonshot.cn/v1/chat/completions";
const KEY = "sk-95rL38krsPttv8x96dnuaRqI44T0g3BQ911K9HPB6xAqGbbU";

export const server = async () => {
  return {
    tool: {
      "image-vision": tool({
        description:
          "使用多模态模型分析图片视觉内容。传入图片路径和分析指令，返回颜色、构图、元素等详细描述。" +
          "用法: image-vision(image='outputs/project/design.png', prompt='描述图片的颜色和布局')",
        args: {
          image: z.string().describe("图片文件路径"),
          prompt: z.string().describe("对图片的分析指令，如'描述颜色、构图、元素'"),
        },
        async execute(args, ctx) {
          const imagePath = resolve(ctx.directory, args.image);

          let buf: Buffer;
          try {
            buf = await readFile(imagePath);
          } catch (e: any) {
            return `[image-vision] 无法读取: ${imagePath} — ${e.message}`;
          }

          const ext = extname(imagePath).toLowerCase();
          const mime = ext === ".jpg" || ext === ".jpeg" ? "image/jpeg"
            : ext === ".webp" ? "image/webp" : ext === ".gif" ? "image/gif" : "image/png";
          const b64 = buf.toString("base64");

          try {
            const resp = await fetch(API, {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
              body: JSON.stringify({
                model: "kimi-k2.5",
                messages: [{
                  role: "user",
                  content: [
                    { type: "image_url", image_url: { url: `data:${mime};base64,${b64}` } },
                    { type: "text", text: args.prompt },
                  ],
                }],
                max_tokens: 2000,
              }),
              signal: ctx.abort,
            });

            if (!resp.ok) {
              return `[image-vision] API ${resp.status}: ${(await resp.text()).slice(0, 200)}`;
            }

            const data = await resp.json();
            const content = data.choices?.[0]?.message?.content;
            return content || "[image-vision] 无内容";
          } catch (e: any) {
            return `[image-vision] 网络错误: ${e.message}`;
          }
        },
      }),
    },
  };
};
