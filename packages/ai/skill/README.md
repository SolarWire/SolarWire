# SolarWire Skills 集合

这是 SolarWire 项目的 AI Skills 集合，每个 Skill 都是一个独立的文件夹，可直接拷贝到其他 AI 工具中使用。

## 目录结构

```
skill/
├── README.md                     # 本文件
└── solarwire-wireframe-generator/  # 第一个 Skill：线框图生成器
    ├── SKILL.md                  # Skill 主定义文件
    ├── README.md                 # Skill 使用说明
    └── prompts/                  # Prompt 文件目录
        ├── common.md             # 公共逻辑
        ├── mobile-app.md         # 移动端 App 场景
        ├── web-client.md         # 客户端 Web 场景
        └── web-admin.md          # 后台管理系统场景
```

## 现有 Skills

### 1. solarwire-wireframe-generator
**线框图生成器** - 根据用户需求生成完整的 SolarWire 线框图，包含 PRD 内容、Mermaid 流程图/时序图和详细说明，支持移动端、Web 端、后台管理系统等多种场景。

## 如何添加新 Skill

1. **创建 Skill 文件夹**
   ```bash
   mkdir skill/your-skill-name
   ```

2. **创建必要文件**
   - `SKILL.md` - Skill 主定义文件（包含 frontmatter 和使用说明）
   - `README.md` - Skill 使用说明文档
   - 根据需要创建 `prompts/` 文件夹和相关 prompt 文件

3. **SKILL.md 格式示例**
   ```markdown
   ***
   
   name: "your-skill-name"
   description: "Skill 的简短描述"
   -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
   
   # Skill 名称
   
   详细的使用说明...
   ```

4. **提交 Skill**
   将完整的 Skill 文件夹提交到 `skill/` 目录下

## 使用 Skill

### 在 Trae IDE 中使用
将需要的 Skill 文件夹复制到项目的 `.trae/skills/` 目录下：
```bash
cp -r skill/your-skill-name/ .trae/skills/your-skill-name/
```

### 在其他 AI 工具中使用
根据 Skill 的 `README.md` 说明使用对应的 prompt 文件或代码。

## 许可证

与 SolarWire 项目使用相同的许可证。
