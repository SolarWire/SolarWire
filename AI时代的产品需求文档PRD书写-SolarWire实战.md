# AI时代的产品需求文档PRD书写——SolarWire实战

> 用纯文本定义UI，让AI成为你的产品助理

---

## 一、为什么做 SolarWire？

在 AI 大模型快速发展的今天，产品经理的工作方式正在发生变化。但 PRD 编写仍然存在一些痛点：

**工具分散**：文档、原型、流程图分别使用不同工具，协作成本高

**版本管理困难**：二进制格式的原型文件难以进行版本对比和协作

**AI 难以介入**：传统原型工具的输出格式 AI 无法直接读取和修改

SolarWire 的初衷很简单：**用纯文本描述 UI，让 AI 能理解、Git 能管理、团队好协作。**

官网：https://solarwire.github.io/SolarWire

---

## 二、SolarWire 是什么？

SolarWire 是一个轻量级的 DSL（领域特定语言），用类似 Markdown 的语法描述 UI 线框图。

```solarwire
!title="Login Page"

[] @(0,0) w=400 h=500 bg=#fff

"Welcome Back" @(150,80) size=24 bold

"Email" @(50,180)
["Enter your email"] @(50,205) w=300 h=44

"Password" @(50,280)
["Enter password"] @(50,305) w=300 h=44

["Sign In"] @(50,380) w=300 h=48 bg=#3498db c=white
```

这段代码可以直接渲染为 SVG 格式的线框图。

核心语法：
- `[]` 矩形、`()` 圆角矩形、`(())` 圆形
- `@(x,y)` 坐标定位
- `note="..."` 元素功能注释

---

## 三、如何使用？

### 在线体验

访问官网 https://solarwire.github.io/SolarWire，在 Playground 中直接编写和预览。

### VS Code 插件

在扩展商店搜索 **"SolarWire Support"**，提供语法高亮、实时预览、错误诊断、导出 SVG/PNG 等功能。

### AI 辅助生成

在 Trae 中使用 solarwire-prd 技能，AI 可以：
- 通过对话收集需求
- 自动生成完整的 PRD 文档
- 为每个页面生成 SolarWire 线框图
- 导出 SVG 图片

---

## 四、版本演进

SolarWire 从最初的想法逐步完善：

**基础能力**：完整的解析器、SVG 渲染器、VS Code 插件

**功能增强**：语法高亮、实时预览、自动补全、错误诊断

**复杂场景**：表格支持合并单元格、多行文本、元素透明度

**稳定性**：更友好的错误提示，精确到行号的定位

目前 SolarWire 已形成完整的工具链，可以支撑实际的 PRD 编写工作。

---

## 五、未来规划

### solarwire-code-to-prd：代码逆向 PRD

针对接手老项目无文档的场景，AI 可以分析现有代码，逆向生成 PRD 文档和线框图。

### solarwire-prd-to-testcase：PRD 生成测试用例

基于 PRD 文档自动生成可执行的测试用例，导出 Excel 格式，提升测试效率。

---

## 六、与传统工具对比

| 特性 | SolarWire | Figma | Axure |
|------|-----------|-------|-------|
| 纯文本格式 | ✅ | ❌ | ❌ |
| AI 原生支持 | ✅ | ❌ | ❌ |
| Git 版本管理 | ✅ | ❌ | ❌ |
| 学习成本 | 低 | 高 | 中 |
| 价格 | 免费 | 免费增值 | 付费 |

SolarWire 的定位不是替代高保真设计工具，而是填补需求文档与设计稿之间的空白，帮助产品经理快速表达想法，同时让 AI 能够参与协作。

---

## 七、总结

SolarWire 从一个想法发展到现在，形成了完整的工具链：

- DSL 解析器与 SVG 渲染器
- VS Code 扩展
- AI 驱动的 PRD 生成技能
- 在线 Playground

感谢 **Trae** 提供的 AI Agent 能力支持，让 AI 辅助 PRD 编写成为现实。

欢迎试用：
- 官网：https://solarwire.github.io/SolarWire
- VS Code 插件：搜索 "SolarWire Support"

---

**让 AI 成为你的产品助理，从 SolarWire 开始。**
