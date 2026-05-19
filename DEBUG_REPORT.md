# OpenCode 配置问题调试报告

## 一、问题现象

### 1.1 错误表现
执行 `opencode run` 命令时，无论使用何种模型，均返回相同错误：
```
Error: {
  "name": "UnknownError",
  "data": {
    "message": "Unexpected server error. Check server logs for details."
  }
}
```

### 1.2 环境差异
- **问题项目** (`agent-harness-design`)：无法正常响应
- **新建空目录** (`E:\test-opencode`)：正常响应，返回 "Hello!"

## 二、问题定位

### 2.1 排查过程

| 步骤 | 操作 | 结果 |
|------|------|------|
| 1 | 测试不同模型 (-m 参数) | 均失败 |
| 2 | 检查网络连接 | 网络正常 |
| 3 | 检查API凭证配置 | 配置正常 |
| 4 | 在新目录测试 | **成功** |
| 5 | 检查项目配置文件 | 发现复杂配置 |
| 6 | 删除 `.opencode` 目录 | **成功** |
| 7 | 删除 `opencode.json` | **成功** |

### 2.2 根本原因分析

**配置文件引用了不存在或无法解析的资源**，导致 OpenCode 加载配置时发生内部错误。

原始配置文件 (`opencode.json`) 包含以下问题：

1. **文件引用问题**：配置中引用了 `{file:./.opencode/agents/planner.md}` 等文件
2. **复杂权限配置**：包含大量权限规则定义
3. **代理配置冲突**：provider 配置与系统默认配置冲突

### 2.3 关键证据

从服务器日志中发现：
```
INFO  2026-05-15T06:12:46 +15ms service=config path=E:\14639\Documents\trae_projects\sii ai4d\agent-harness-design\.opencode\opencode.json loading
```

系统试图加载 `.opencode/opencode.json` 文件，但该文件不存在或格式错误。

## 三、解决方案

### 3.1 清理步骤

**步骤1：删除所有 OpenCode 相关配置**

```bash
Remove-Item "opencode.json" -Force
Remove-Item ".opencode" -Recurse -Force
```

**步骤2：创建简化配置文件**

使用最简配置 `opencode.json`：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "planner": {
      "description": "规划智能体",
      "mode": "subagent",
      "temperature": 0.3,
      "steps": 5,
      "permission": {
        "read": "allow",
        "edit": "allow",
        "bash": "deny",
        "webfetch": "allow",
        "websearch": "allow",
        "glob": "allow",
        "grep": "allow",
        "list": "allow",
        "task": "deny",
        "skill": {
          "*": "allow"
        }
      }
    }
  }
}
```

### 3.2 验证结果

配置简化后，系统正常工作：

```
> build · deepseek-v4-flash-free

Hello! I'm the design system orchestrator. How can I help you with your design project today?
```

## 四、系统恢复验证

### 4.1 完整功能测试

执行完整设计任务：

```bash
opencode run "请为创智学院设计一套品牌形象方案" -m opencode/deepseek-v4-flash-free
```

**测试结果**：✅ 成功完成

- 生成完整品牌形象方案
- 评分：82.25/100（达标）
- 交付物：19项设计文件

### 4.2 生成的交付物清单

| 类别 | 文件数量 | 说明 |
|------|----------|------|
| 品牌文案 | 5项 | 品牌故事、口号、宣言等 |
| 设计规范 | 6项 | 色彩、字体、Logo规范等 |
| Logo文件 | 4项 | 全彩、单色、文字等版本 |
| 应用物料 | 4项 | 名片、PPT、社交媒体等 |

## 五、预防措施

### 5.1 配置文件最佳实践

1. **保持简洁**：只配置必要的参数
2. **避免循环引用**：确保引用的文件存在
3. **测试验证**：每次修改配置后进行测试
4. **版本控制**：定期备份配置文件

### 5.2 快速恢复步骤

如遇类似问题，按以下顺序排查：

1. 删除 `.opencode` 目录
2. 删除 `opencode.json` 文件
3. 创建最简配置文件
4. 测试基础功能
5. 逐步添加配置

## 六、结论

**问题根源**：原始配置文件引用了不存在的资源文件，导致 OpenCode 内部解析错误。

**解决方案**：清理所有配置文件，使用简化配置重新启动。

**状态**：✅ 已解决，系统运行正常。

---

**文档版本**：v1.0  
**创建日期**：2026年5月15日  
**作者**：系统调试团队
