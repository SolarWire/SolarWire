# AI时代的产品需求文档PRD书写——SolarWire实战

> 用纯文本定义UI，让AI成为你的产品助理

---

## 一、缘起：一个关于"效率"的思考

在AI大模型飞速发展的今天，我们每天都在探索如何让AI更好地辅助工作。作为产品经理，PRD（产品需求文档）是我们最核心的交付物之一。然而，传统的PRD编写方式存在几个痛点：

**痛点一：工具割裂**  
写文档用Word/Notion，画原型用Figma/Axure，流程图用ProcessOn，工具之间难以协同，版本管理更是噩梦。

**痛点二：AI难以介入**  
传统原型工具产出的文件是二进制格式，AI无法直接读取和修改。每次需求变更，都需要人工同步更新多处内容。

**痛点三：协作成本高**  
设计稿、原型图、需求文档分散在不同平台，开发同学需要来回切换，信息传递容易失真。

**于是，SolarWire诞生了。**

---

## 二、SolarWire是什么？

**SolarWire** 是一个轻量级的 Markdown 风格 DSL（领域特定语言），用于快速创建 UI 线框图。它的核心理念是：

- ✨ **极简语法** - 用几行字符就能表达常见UI元素
- 🤖 **AI原生** - 语法设计让大模型可以轻松生成和修改
- 📦 **纯文本** - Git友好，可直接嵌入技术文档
- 🎨 **完整实现** - 解析器、SVG渲染器、VS Code插件一应俱全

**官网地址**：https://solarwire.github.io/SolarWire

### 一个简单的例子

```solarwire
!title="Login Page"

[] @(0,0) w=400 h=500 bg=#fff

"Welcome Back" @(150,80) size=24 bold

"Email" @(50,180)
["Enter your email"] @(50,205) w=300 h=44 bg=#fff b=#ddd

"Password" @(50,280)
["Enter password"] @(50,305) w=300 h=44 bg=#fff b=#ddd

["Sign In"] @(50,380) w=300 h=48 bg=#3498db c=white

"Don't have an account?" @(100,450) c=#666
"Sign up" @(260,450) c=#3498db
```

这段纯文本代码，可以直接渲染成一张完整的登录页面线框图！

---

## 三、版本迭代：从想法到成熟

SolarWire 从最初的想法到现在，经历了多个版本的迭代：

### v1.1.0 - 初生
- 完整的 SolarWire DSL 解析器和渲染器
- SVG 渲染支持所有元素
- VS Code 扩展基础功能：语法高亮、代码片段、预览
- 表格支持（colspan 和 rowspan）
- Note 系统（视觉标签 + 底部卡片）
- 多行文本支持
- 文档级别全局默认值声明

### v1.2.0 - 增强
- 完善的语法高亮支持
- 预览窗口支持缩放和拖动
- 表格单元格元素缩进检查
- 多行 note 解析支持

### v1.3.0 - 重构
- 完全重写表格渲染算法，使用双 pass 方式精确计算
- Placeholder 元素显示对角线
- 支持任意复杂的 colspan 和 rowspan 组合

### v1.5.0 - 进化
- 项目结构重组（packages/ai、packages/apps、packages/core）
- 恢复表格语法（## 和 #）
- 添加 opacity 属性支持
- 改进文字换行处理
- Note 最小宽度设置

### v1.5.1 - 修复
- 修复表格行 note 属性报错功能

### v1.6.0 - 成熟（当前版本）
- **改进错误消息** - 所有错误信息现在包含上下文代码片段和精确的错误位置标记
- **统一错误格式化** - 创建统一的错误处理函数
- **源码位置追踪** - AST 元素现在包含行号位置信息
- **代码质量提升** - 修复多个计算错误，添加类型定义
- **依赖更新** - 同步更新所有包

---

## 四、实战：如何用 SolarWire 接管 PRD 编写

### 4.1 Playground 快速上手

访问官网 https://solarwire.github.io/SolarWire，你可以直接在 Playground 中试用 SolarWire：

1. 打开官网，找到 Playground 区域
2. 在左侧编辑器中输入 SolarWire 代码
3. 右侧实时预览渲染效果
4. 支持导出 SVG 文件

**30秒上手教程：**
```
1. 创建一个 .solarwire 文件
2. 写入 ["Hello"] @(0,0) w=100 h=40
3. 看到你的第一个线框图！
```

### 4.2 VS Code 插件安装

在 VS Code 中安装 **SolarWire Support** 插件，获得完整的开发体验：

**安装方式：**
1. 打开 VS Code 扩展面板
2. 搜索 "SolarWire Support"
3. 点击安装

**插件功能：**
- ✅ 语法高亮 - 彩色代码，提升可读性
- ✅ 代码片段 - 快速插入常用元素
- ✅ 实时预览 - 边写边看效果
- ✅ 错误诊断 - 红色波浪线标记语法错误
- ✅ 自动补全 - 智能提示元素和属性
- ✅ 悬停文档 - 鼠标悬停显示帮助
- ✅ 导出功能 - 导出 SVG 和 PNG

**常用命令：**
- `SolarWire: Open Preview` - 打开实时预览面板
- `SolarWire: Export SVG` - 导出 SVG 文件
- `SolarWire: Export PNG` - 导出 PNG 文件

### 4.3 solarwire-prd Skill：AI 驱动的 PRD 生成

这是 SolarWire 最核心的能力——通过 AI Skill 完全接管 PRD 编写工作！

**什么是 solarwire-prd Skill？**

这是一个专为 AI 助手设计的技能模块，让 AI 能够：
1. 通过对话收集需求
2. 自动生成完整的 PRD 文档
3. 创建 SolarWire 线框图
4. 导出 SVG 图片
5. 生成 Mermaid 流程图

**使用流程：**

**Step 1: 需求收集**
```
AI: 我来帮你创建 PRD 文档。让我们一步步确认需求：

**Step 1: 产品类型**
这是什么类型的应用？
- 📱 移动端 App
- 💻 Web 客户端
- ⚙️ 管理后台
- 📺 其他
```

**Step 2: 功能确认**
```
AI: **Step 2: 核心功能**
这个产品需要哪些核心功能/页面？

例如：
- 用户登录/注册
- 首页
- 个人中心
- 商品列表
- 订单管理
```

**Step 3: 详细需求**
```
AI: **Step 3: 详细需求确认**

我的理解如下：

**产品类型**: [类型]
**核心页面**:
1. [页面1] - [简要描述]
2. [页面2] - [简要描述]

**特殊需求**:
- [需求1]
- [需求2]

这个理解正确吗？需要调整或补充吗？
```

**Step 4: 生成 PRD**
AI 会自动生成：
- 完整的 PRD Markdown 文档
- 每个页面的 SolarWire 线框图
- 带 note 和不带 note 两个版本的 SVG
- Mermaid 业务流程图

**输出文件结构：**
```
.solarwire/
├── user-login-system/           # 需求文件夹
│   ├── solarwire-prd.md         # PRD 文档
│   ├── login-with-notes.svg     # 带 note 的线框图
│   ├── login-without-notes.svg  # 不带 note 的线框图
│   └── ...
```

---

## 五、未来规划：构建完整的 AI 产品工作流

SolarWire 的愿景是成为 AI 时代产品工作的基础设施。接下来，我们将推出更多能力：

### 5.1 solarwire-code-to-prd：代码逆向 PRD

**场景**：接手一个没有文档的老项目，如何快速了解？

**能力**：
- 分析前端代码（HTML/JSX/Vue），提取 UI 结构
- 分析后端代码，提取 API 接口和数据模型
- 自动生成完整的 PRD 文档和线框图
- 帮助新成员快速理解项目

**工作流程**：
```
1. 指定代码目录
2. AI 扫描项目结构
3. 分析前端组件和页面
4. 分析后端路由和数据模型
5. 生成 PRD + SolarWire 线框图
```

### 5.2 solarwire-prd-to-testcase：PRD 生成测试用例

**场景**：PRD 写完了，测试用例怎么写？

**能力**：
- 读取 SolarWire PRD 文档
- 从 User Story 生成验收测试用例
- 从 SolarWire note 生成详细 UI 测试用例
- 从业务流程图生成流程测试用例
- 输出 Excel 格式的测试用例文档

**测试用例质量标准**：

❌ **不好的测试用例**（太模糊）：
| 字段 | 内容 |
|------|------|
| 用例名称 | Login button-点击操作 |
| 测试步骤 | 1. 查看Login button<br>2. 点击按钮 |
| 预期结果 | 验证用户名和密码 |

✅ **好的测试用例**（可执行）：
| 字段 | 内容 |
|------|------|
| 用例名称 | 登录页面-登录按钮-正常登录成功 |
| 前置条件 | 1. 用户已注册账号：testuser@example.com / Test@123<br>2. 用户未登录<br>3. 已打开登录页面 |
| 测试步骤 | 1. 在用户名输入框输入：testuser@example.com<br>2. 在密码输入框输入：Test@123<br>3. 点击"登录"按钮 |
| 测试数据 | 用户名：testuser@example.com<br>密码：Test@123 |
| 预期结果 | 1. 登录成功，页面跳转到首页<br>2. 顶部导航栏显示用户头像<br>3. localStorage 中存在 token 字段 |
| 优先级 | P0 |

---

## 六、SolarWire vs 传统工具

| 特性 | SolarWire | Figma | Axure | Balsamiq |
|------|-----------|-------|-------|----------|
| 纯文本格式 | ✅ | ❌ | ❌ | ❌ |
| AI 原生 | ✅ | ⚠️ 插件 | ⚠️ 插件 | ❌ |
| Git 友好 | ✅ | ⚠️ 云端 | ⚠️ 云端 | ❌ |
| Markdown 嵌入 | ✅ | ❌ | ❌ | ❌ |
| 版本控制 | ✅ 原生 | ⚠️ 云端 | ⚠️ 云端 | ❌ |
| 学习曲线 | 低 | 高 | 中 | 低 |
| 离线支持 | ✅ | ⚠️ 部分 | ✅ | ✅ |
| 价格 | 免费 | 免费增值 | 付费 | 付费 |
| PRD 集成 | ✅ 原生 | ❌ | ❌ | ❌ |

**SolarWire 的定位**：不是替代高保真设计工具，而是填补"需求文档"和"设计稿"之间的空白，让产品经理可以用纯文本快速表达想法，同时让 AI 能够理解和协作。

---

## 七、总结与致谢

这段时间的更新，SolarWire 从一个想法成长为一个完整的工具链：

**核心能力**：
- ✅ 完整的 DSL 解析器和 SVG 渲染器
- ✅ VS Code 扩展，提供完整的开发体验
- ✅ solarwire-prd Skill，AI 驱动的 PRD 生成
- ✅ Playground 在线试用

**即将推出**：
- 🚧 solarwire-code-to-prd - 代码逆向 PRD
- 🚧 solarwire-prd-to-testcase - PRD 生成测试用例

**特别感谢**：

感谢 **Trae** 提供的强大支持和开发环境。Trae 的 AI Agent 能力让 SolarWire 的 Skill 开发变得简单高效，让"AI 驱动的产品工作流"从概念变成现实。

如果你也是产品经理，或者对 AI 辅助产品工作感兴趣，欢迎试用 SolarWire：

🔗 **官网**：https://solarwire.github.io/SolarWire  
📦 **VS Code 插件**：搜索 "SolarWire Support"  
💻 **GitHub**：https://github.com/solarwire/SolarWire

---

**让 AI 成为你的产品助理，从 SolarWire 开始。**
