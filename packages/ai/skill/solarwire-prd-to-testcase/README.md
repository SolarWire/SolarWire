# SolarWire PRD to Test Case Generator

从 SolarWire PRD 文档生成测试用例 Excel 文件。

## 安装

```bash
npm install
```

## 使用方法

```bash
node generate-testcases.js <prd-file-path>
```

示例：
```bash
node generate-testcases.js .solarwire/my-project/solarwire-prd.md
```

## 输出

生成的 Excel 文件包含三个工作表：

1. **测试用例汇总** - 所有测试用例的完整列表
2. **按模块分组** - 按 SolarWire 页面/模块分组的测试用例
3. **测试统计** - 测试用例数量统计

## 测试用例字段

| 字段 | 说明 |
|------|------|
| 用例编号 | TC-XXX 格式 |
| 所属模块 | 按页面划分 |
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

## 数据来源

从 PRD 文档的以下部分提取测试点：

1. **SolarWire Note** - UI交互、输入规则、业务逻辑
2. **用户故事** - Given-When-Then 验收标准
3. **业务流程图** - Mermaid 流程图
4. **功能列表** - 功能覆盖测试

## 测试类型

- 功能测试
- 表单验证
- 边界测试
- 异常测试
- UI测试

## 注意事项

- 仅生成黑盒测试用例
- 不包含性能测试、安全测试、自动化脚本测试
- 测试用例按 SolarWire 页面组织模块
