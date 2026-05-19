# OpenCode 开发调试指南

## 一、常用命令速查

### 1. 基础测试
```bash
# 简单测试
opencode run "hello" -m opencode/deepseek-v4-flash-free

# 指定模型
opencode run "your prompt" -m opencode/deepseek-v4-flash-free
opencode run "your prompt" -m deepseek-chat
```

### 2. 文件管理
```bash
# 查看目录结构
Get-ChildItem | Select-Object Name
Get-ChildItem ".opencode" -Recurse

# 检查文件是否存在
Test-Path "opencode.json"
Test-Path ".opencode/agents/planner.txt"

# 删除文件/目录
Remove-Item "filename" -Force
Remove-Item ".opencode" -Recurse -Force
```

### 3. Git 操作
```bash
# 检查状态
git status

# 重置项目（危险！会丢失未提交更改）
git reset --hard HEAD

# 清理未追踪文件
git clean -fd
```

### 4. 缓存清理
```bash
# 清理项目缓存
Remove-Item ".opencode" -Recurse -Force

# 清理全局缓存
Remove-Item "C:\Users\<your_username>\.cache\opencode" -Recurse -Force
```

### 5. Web 服务
```bash
# 启动 Web 服务
opencode serve --port 4094

# 访问地址
# http://localhost:4094
```

## 二、调试流程图

```
┌──────────────────────────────────────────────┐
│          1. 运行基础测试                     │
│  opencode run "hello" -m model              │
└──────────────────┬─────────────────────────┘
                   │
         ┌─────────▼─────────┐
         │     成功？        │
         └─────────┬─────────┘
                   │
      ┌────────────┴────────────┐
      │ NO                     │ YES
      ▼                        ▼
┌───────────────┐      ┌───────────────┐
│ 2. 检查配置   │      │ 3. 测试完整   │
│ 文件是否存在  │      │ 设计流程      │
└───────┬───────┘      └───────┬───────┘
        │                      │
        ▼                      ▼
┌───────────────┐      ┌───────────────┐
│ 3. 检查文件   │      │ 4. 检查输出   │
│ 内容格式      │      │ 目录          │
└───────┬───────┘      └───────┬───────┘
        │                      │
        ▼                      ▼
┌───────────────┐      ┌───────────────┐
│ 4. 清理缓存   │      │ 5. 验证结果   │
│ 重新测试      │      │              │
└───────────────┘      └───────────────┘
```

## 三、常见问题及解决方案

### 问题1：Unexpected server error
**现象**：运行任何命令都返回 "Unexpected server error"

**原因**：
- 配置文件引用了不存在的文件
- `.opencode` 目录下有 `node_modules`
- 配置文件格式错误

**解决方案**：
```bash
# 清理所有配置
Remove-Item ".opencode" -Recurse -Force
Remove-Item "opencode.json" -Force

# 重新创建配置
# 使用最简配置文件
```

### 问题2：配置文件无效
**现象**：提示 "Configuration is invalid"

**原因**：
- JSON 格式错误
- 使用了不支持的配置键（如 `skill`）

**解决方案**：
```bash
# 验证 JSON 格式
# 检查是否使用了无效的配置键
# 参考官方 schema：https://opencode.ai/config.json
```

### 问题3：智能体不响应
**现象**：调用 `@planner` 等智能体无响应

**原因**：
- 外部文件引用路径错误
- 文件内容为空或格式错误

**解决方案**：
```bash
# 检查文件是否存在
Test-Path ".opencode/agents/planner.txt"

# 检查文件内容
Get-Content ".opencode/agents/planner.txt"
```

## 四、配置文件最佳实践

### 1. 外置配置文件
```json
{
  "agent": {
    "planner": {
      "description": "规划智能体",
      "mode": "subagent",
      "prompt": "{file:.opencode/agents/planner.txt}",
      "temperature": 0.3,
      "steps": 5
    }
  }
}
```

### 2. 文件命名规范
- 使用 `.txt` 格式避免 Markdown 解析问题
- 路径使用相对路径 `{file:.opencode/...}`（不要加 `./`）
- 保持文件内容简洁

### 3. 目录结构
```
.opencode/
├── agents/           # 智能体配置
│   ├── planner.txt
│   ├── designer.txt
│   └── critic.txt
└── skills/           # 技能配置（作为subagent）
    ├── brand-design/SKILL.txt
    ├── copywriting/SKILL.txt
    ├── design-review/SKILL.txt
    └── design-spec/SKILL.txt
```

## 五、测试验证清单

### ✅ 基础功能测试
- [ ] 运行 `opencode run "hello"` 返回响应
- [ ] 调用 `@planner` 智能体
- [ ] 调用 `@designer` 智能体
- [ ] 调用 `@critic` 智能体

### ✅ 完整流程测试
- [ ] 规划阶段正常执行
- [ ] 设计阶段正常执行
- [ ] 评审阶段正常执行
- [ ] 生成输出文件

### ✅ 输出验证
- [ ] `outputs/planner_result.md` 存在
- [ ] `outputs/critic_result_round1.md` 存在
- [ ] 评审评分 ≥ 80 分

## 六、调试经验总结

1. **保持配置简洁**：从最简配置开始，逐步添加功能
2. **分步测试**：先测试基础功能，再测试完整流程
3. **及时清理**：遇到问题时清理缓存和配置目录
4. **检查日志**：查看 OpenCode 日志定位问题
5. **版本控制**：定期提交配置文件，便于回滚

---

**文档版本**：v1.0  
**创建日期**：2026年5月15日  
**适用项目**：Agent Harness for Design
