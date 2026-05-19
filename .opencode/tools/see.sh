#!/bin/bash
# see.sh — 用 kimi-k2.5 多模态分析图片
# 用法: bash .opencode/tools/see.sh <图片路径> "<分析指令>"

IMAGE="$1"
PROMPT="${2:-请详细描述这张图片的内容、颜色、构图和风格}"

if [ -z "$IMAGE" ]; then
  echo "[see.sh] 未指定图片路径，跳过。用法: bash .opencode/tools/see.sh <图片路径> [分析指令]"
  exit 0
fi

npx tsx ".opencode/tools/image-vision.ts" --image "$IMAGE" --prompt "$PROMPT" 2>&1
