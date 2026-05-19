import { tool } from "@opencode-ai/plugin";
import { z } from "zod";

const MOONSHOT_URL = "https://api.moonshot.cn/v1/chat/completions";
const MOONSHOT_KEY = "sk-95rL38krsPttv8x96dnuaRqI44T0g3BQ911K9HPB6xAqGbbU";

export const server = async () => {
  return {
    tool: {
      "websearch-cn": tool({
        description:
          "中文联网搜索工具（基于Kimi k2.5原生搜索能力）。搜索关键词，返回带引用链接的结构化搜索结果。" +
          "适用于品牌调研、行业信息查询。用法: websearch-cn(query='搜索关键词')",
        args: {
          query: z.string().describe("搜索关键词或问题，支持中文。例如：'上海创智学院 吉祥物 品牌色'"),
        },
        async execute(args, ctx) {
          try {
            const resp = await fetch(MOONSHOT_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${MOONSHOT_KEY}`,
              },
              body: JSON.stringify({
                model: "kimi-k2.5",
                messages: [
                  {
                    role: "user",
                    content: `请搜索以下内容，并给出详细的搜索结果（包含标题、链接、摘要）。如果找到具体的品牌信息（如吉祥物、Logo、品牌色等），请重点列出。\n\n搜索内容：${args.query}`,
                  },
                ],
                max_tokens: 3000,
                // kimi-k2.5 只支持 temperature=1
                temperature: 1,
                // 开启 Kimi 内置联网搜索
                tools: [
                  {
                    type: "builtin_function",
                    function: { name: "$web_search" },
                  },
                ],
                tool_choice: "auto",
              }),
              signal: ctx.abort,
            });

            if (!resp.ok) {
              const errText = await resp.text().catch(() => "");
              return `[websearch-cn] API错误 HTTP ${resp.status}: ${errText.slice(0, 500)}`;
            }

            const data = await resp.json();
            const msg = data.choices?.[0]?.message;

            // Kimi $web_search 可能返回 tool_calls 或 content
            const content = msg?.content;
            const toolCalls = msg?.tool_calls;

            // 如果有 web_search 的 tool call 结果
            if (toolCalls && toolCalls.length > 0) {
              const searchResults = toolCalls
                .filter((tc: { type?: string; function?: { name?: string; arguments?: string } }) =>
                  tc.type === "builtin_function" || tc.function?.name === "$web_search"
                )
                .map((tc: { function?: { arguments?: string } }) => {
                  try {
                    const args = JSON.parse(tc.function?.arguments || "{}");
                    return args.results || args.output || JSON.stringify(args);
                  } catch {
                    return tc.function?.arguments || "";
                  }
                })
                .join("\n\n");
              if (searchResults) {
                return `## 搜索: ${args.query}\n\n${searchResults}`;
              }
            }

            if (content) {
              return `## 搜索: ${args.query}\n\n${content}`;
            }

            // 调试：返回完整响应结构
            return `[websearch-cn] 搜索完成但无内容。响应结构: ${JSON.stringify(data.choices?.[0]).slice(0, 500)}`;
          } catch (e: any) {
            return `[websearch-cn] 网络错误: ${e.message}`;
          }
        },
      }),
    },
  };
};
