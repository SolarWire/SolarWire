# Introduction

## What is SolarWire?

SolarWire is a lightweight, Markdown-style Domain Specific Language (DSL) for creating UI wireframes. It's designed to be:

- **Simple** - Write wireframes using intuitive syntax similar to Markdown
- **AI-Ready** - Perfect for AI-assisted wireframe generation
- **Developer-Friendly** - Version control, integrate with docs, and automate
- **Portable** - Output clean SVG files that work everywhere

## Why SolarWire?

### The Problem

Traditional wireframing tools have limitations:
- **Figma/Sketch** - Great for design, but not for documentation or AI integration
- **ASCII Art** - Too limited, hard to maintain
- **HTML/CSS** - Too verbose, not suitable for quick wireframes
- **Mermaid/PlantUML** - Focused on diagrams, not UI wireframes

### The Solution

SolarWire bridges the gap between:
- **Documentation** - Write wireframes directly in Markdown files
- **AI Integration** - Structured format that AI can understand and generate
- **Version Control** - Text-based, diff-friendly, Git-compatible
- **Prototyping** - Quick visualization without design tools

## Use Cases

### 1. PRD Documentation
Write wireframes directly in your Product Requirements Documents:

```markdown
## Login Page

\`\`\`solarwire
!title="Login Page"

[] @(0,0) w=400 h=500 bg=#fff
["Login"] @(150,200) w=100 h=40 bg=#3498db c=white
\`\`\`
```

### 2. AI-Assisted Design
Ask AI to generate wireframes:

```
User: Create a login page with email, password, and remember me checkbox

AI: Here's the SolarWire code:
\`\`\`solarwire
!title="Login Page"
...
\`\`\`
```

### 3. Design System Documentation
Document your design system components:

```solarwire
!title="Button Components"

["Primary"] @(0,0) w=120 h=40 bg=#3498db c=white
["Secondary"] @(140,0) w=120 h=40 bg=#95a5a6 c=white
["Outline"] @(280,0) w=120 h=40 bg=#fff b=#3498db c=#3498db
```

### 4. Rapid Prototyping
Quickly visualize ideas during brainstorming sessions.

## Key Features

| Feature | Description |
|---------|-------------|
| **Elements** | Rectangle, Rounded, Circle, Text, Image, Line, Table |
| **Attributes** | Size, color, background, border, font, alignment |
| **Coordinates** | Absolute, relative, edge-based positioning |
| **Tables** | Built-in table syntax with row/column support |
| **Notes** | Functional descriptions for AI understanding |
| **SVG Export** | Clean, scalable vector graphics output |

## Comparison

| Feature | SolarWire | Mermaid | PlantUML | ASCII Art |
|---------|-----------|---------|----------|-----------|
| UI Wireframes | ✅ | ❌ | ❌ | ⚠️ Limited |
| AI Integration | ✅ | ⚠️ | ⚠️ | ❌ |
| Markdown Embed | ✅ | ✅ | ✅ | ✅ |
| SVG Output | ✅ | ✅ | ✅ | ❌ |
| Learning Curve | Low | Medium | Medium | Low |
| Version Control | ✅ | ✅ | ✅ | ✅ |

## Next Steps

- [Quick Start](/getting-started/quick-start) - Create your first wireframe
- [Elements](/reference/elements) - Explore all available elements
