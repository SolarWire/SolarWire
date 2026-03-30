# SolarWire PRD to Test Case Generator

从 SolarWire PRD 文档生成测试用例 Excel 文件。

## 概述

这个 skill 指导 AI 阅读和理解 SolarWire PRD 文档，然后生成全面的测试用例文档。

**重点**: 仅黑盒功能测试（不包含性能、安全或自动化脚本测试）

## 使用方法

1. 提供 PRD 文件路径：`.solarwire/[requirement-name]/solarwire-prd.md`
2. AI 将根据 SKILL.md 中的指南解析 PRD
3. 生成测试用例 Excel 文件

## 测试用例来源

从 PRD 文档的以下部分提取测试点：

1. **用户故事** - Given-When-Then 验收标准
2. **功能列表** - 功能覆盖测试
3. **业务流程图** - Mermaid 流程图路径测试
4. **SolarWire Notes** - UI交互、输入规则、业务逻辑（最重要）

## Note Section 与测试类型映射

| Note Section | 测试类型 |
|--------------|---------|
| Click action / 点击 | 功能测试 |
| Success handling / 成功 | 功能测试 |
| Failure handling / 失败 | 异常测试 |
| Input rules / 输入 | 表单验证 + 边界测试 |
| Validation / 校验 | 表单验证 |
| Disabled conditions / 禁用 | UI测试 |
| Visibility conditions / 显示条件 | UI测试 |
| Data source / 数据 | 功能测试 |
| Options / 选项 | 功能测试 |
| Tooltip / 提示 | UI测试 |
| i18n / 多语言 | 国际化测试 |

## 输出格式

生成的 Excel 文件包含三个工作表：

1. **测试用例汇总** - 所有测试用例的完整列表
2. **按模块分组** - 按 SolarWire 页面/模块分组的测试用例
3. **测试统计** - 测试用例数量统计

## 测试用例字段

| 字段 | 说明 |
|------|------|
| 用例编号 | TC-XXX 格式 |
| 所属模块 | 按页面划分（来自 !title） |
| 用例名称 | 测试场景描述 |
| 测试类型 | 功能测试/UI测试/边界测试/异常测试 |
| 前置条件 | 执行前需满足的条件 |
| 测试步骤 | 操作步骤 |
| 测试数据 | 输入数据 |
| 预期结果 | 期望输出 |
| 优先级 | P0/P1/P2 |
| 关联需求 | 用户故事ID |
| 边界值 | 边界测试数据 |
| 异常场景 | 异常测试场景 |
| 备注 | 补充说明 |

## 注意事项

- 仅生成黑盒测试用例
- 测试用例按 SolarWire 页面组织模块
- 每个 note 中的每个行为点生成独立测试用例
- 优先级从用户故事和功能列表继承
