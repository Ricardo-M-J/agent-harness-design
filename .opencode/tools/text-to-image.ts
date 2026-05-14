import { tool } from "@opencode-ai/plugin"
import path from "path"
import fs from "fs"

export default tool({
  description: "根据文本描述生成设计图像（当前为Mock模式，生成SVG占位图）",
  args: {
    prompt: tool.schema.string().describe("详细的英文图像生成描述"),
    output_path: tool.schema.string().describe("输出文件路径（不含扩展名），相对于项目根目录"),
    style: tool.schema.string().optional().describe("图像风格：logo/poster/product/illustration"),
    color_scheme: tool.schema.string().optional().describe("色彩方案描述，如 warm/cool/minimal"),
  },
  async execute(args, context) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const outputPath = path.join(context.worktree, args.output_path)

    // 确保目录存在
    fs.mkdirSync(path.dirname(outputPath), { recursive: true })

    // Mock 模式：生成 SVG 占位图
    const svgContent = generateMockSVG(args.prompt, args.style || "general", args.color_scheme)
    const svgPath = $BT$BT${outputPath}.svg$BT$BT
    fs.writeFileSync(svgPath, svgContent, "utf-8")

    // 保存 prompt 记录
    const promptRecord = [
      "# Image Generation Prompt",
      "",
      "## Prompt",
      args.prompt,
      "",
      "## Style",
      args.style || "general",
      "",
      "## Color Scheme",
      args.color_scheme || "auto",
      "",
      "## Generated At",
      timestamp,
      "",
      "## Status",
      "Mock mode - SVG placeholder generated",
      "",
      "## Next Steps",
      "Replace this mock with real text-to-image API integration.",
      "Supported APIs: DALL-E 3, Stable Diffusion, Midjourney API, etc.",
    ].join("
")

    const promptPath = $BT$BT${outputPath}-prompt.md$BT$BT
    fs.writeFileSync(promptPath, promptRecord, "utf-8")

    return [
      "Mock image generated successfully!",
      $BT$BT- SVG placeholder: ${svgPath}$BT$BT
      $BT$BT- Prompt record: ${promptPath}$BT$BT
      "",
      "Note: This is a mock placeholder. To use real image generation,",
      "modify this tool to call a text-to-image API (DALL-E, SD, etc.).",
    ].join("
")
  },
})

function generateMockSVG(
  prompt: string,
  style: string,
  colorScheme?: string
): string {
  const colors = colorScheme
    ? parseColorScheme(colorScheme)
    : { primary: "#4A90D9", secondary: "#2C5F8A", accent: "#F5A623" }
  const escapedPrompt = prompt.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").substring(0, 120)

  return [
    $BT$BT<?xml version="1.0" encoding="UTF-8"?>$BT$BT
    $BT$BT<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">$BT$BT
    $BT$BT  <defs>$BT$BT
    $BT$BT    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">$BT$BT
    $BT$BT      <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:0.1" />$BT$BT
    $BT$BT      <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:0.2" />$BT$BT
    $BT$BT    </linearGradient>$BT$BT
    $BT$BT  </defs>$BT$BT
    $BT$BT  <rect width="800" height="600" fill="url(#bg)" rx="8"/>$BT$BT
    $BT$BT  <rect x="40" y="40" width="720" height="520" fill="white" rx="8" opacity="0.9"/>$BT$BT
    $BT$BT  <text x="400" y="220" font-family="Arial, sans-serif" font-size="28" fill="${colors.primary}" text-anchor="middle" font-weight="bold">Design Mock</text>$BT$BT
    $BT$BT  <text x="400" y="260" font-family="Arial, sans-serif" font-size="16" fill="#666" text-anchor="middle">Style: ${style}</text>$BT$BT
    $BT$BT  <text x="400" y="300" font-family="Arial, sans-serif" font-size="12" fill="#999" text-anchor="middle">${escapedPrompt}</text>$BT$BT
    $BT$BT  <rect x="300" y="360" width="200" height="44" fill="${colors.accent}" rx="22" opacity="0.85"/>$BT$BT
    $BT$BT  <text x="400" y="387" font-family="Arial, sans-serif" font-size="15" fill="white" text-anchor="middle">MOCK PLACEHOLDER</text>$BT$BT
    $BT$BT  <text x="400" y="440" font-family="Arial, sans-serif" font-size="11" fill="#bbb" text-anchor="middle">Replace with real text-to-image API</text>$BT$BT
    $BT$BT</svg>$BT$BT
  ].join("
")
}

function parseColorScheme(scheme: string): {
  primary: string
  secondary: string
  accent: string
} {
  if (scheme.includes("warm"))
    return { primary: "#D4A574", secondary: "#8B6914", accent: "#C0392B" }
  if (scheme.includes("cool"))
    return { primary: "#2C5F8A", secondary: "#1A365D", accent: "#4A90D9" }
  if (scheme.includes("minimal"))
    return { primary: "#333333", secondary: "#666666", accent: "#999999" }
  if (scheme.includes("vibrant"))
    return { primary: "#E74C3C", secondary: "#8E44AD", accent: "#F39C12" }
  if (scheme.includes("nature"))
    return { primary: "#27AE60", secondary: "#2ECC71", accent: "#F1C40F" }
  return { primary: "#4A90D9", secondary: "#2C5F8A", accent: "#F5A623" }
}