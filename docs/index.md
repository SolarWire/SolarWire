---
layout: home

hero:
  name: "SolarWire"
  text: "UI Wireframes in Markdown"
  tagline: A lightweight, Markdown-style DSL for creating UI wireframes with AI integration
  image:
    src: /logo.svg
    alt: SolarWire
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started/quick-start
    - theme: alt
      text: View on GitHub
      link: https://github.com/SolarWire/SolarWire

features:
  - icon: 📝
    title: Markdown-style Syntax
    details: Write wireframes using a simple, intuitive syntax similar to Markdown. No complex tools required.
  - icon: 🤖
    title: AI-Ready
    details: Designed for AI integration. Generate wireframes from natural language descriptions with ease.
  - icon: 🎨
    title: SVG Output
    details: Export clean, scalable SVG files. Perfect for documentation, presentations, and collaboration.
  - icon: 🔧
    title: VSCode Extension
    details: Full IDE support with syntax highlighting, preview, and auto-completion.
  - icon: 📊
    title: Tables & Forms
    details: Built-in support for tables, forms, and complex UI components with minimal syntax.
  - icon: 📝
    title: Note Annotations
    details: Add functional descriptions to elements. Perfect for PRD documentation and AI understanding.
---

## Quick Example

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

## Why SolarWire?

### The Problem with Traditional Wireframing

Traditional wireframing tools like Figma, Sketch, or Balsamiq have significant limitations:

| Challenge | Traditional Tools | SolarWire |
|-----------|------------------|-----------|
| **Version Control** | Binary files, difficult to diff/merge | Plain text, Git-friendly |
| **AI Integration** | No native AI support, requires plugins | Designed for AI from the ground up |
| **Documentation** | Separate from PRD/specs | Embedded directly in Markdown |
| **Collaboration** | Requires design software | Anyone with a text editor can contribute |
| **Learning Curve** | Complex UI, steep learning curve | Markdown-like syntax, learn in minutes |
| **Automation** | Manual process | Scriptable, automatable |

### For Product Managers

**Pain Points:**
- Switching between PRD documents and design tools disrupts workflow
- Design files become outdated as requirements change
- Difficult to maintain consistency between specs and wireframes
- Version control is a nightmare with binary design files

**How SolarWire Helps:**
- **Single Source of Truth**: Wireframes live directly in your PRD Markdown files
- **Always in Sync**: Update requirements and wireframes together
- **Git-Native**: Track changes, review diffs, collaborate with developers seamlessly
- **AI-Powered**: Describe what you want, let AI generate the wireframe
- **Stakeholder Review**: Share Markdown files, anyone can view and comment

**Example Use Case:**
```markdown
## User Login Feature

### Requirements
- Support email and phone login
- Remember me functionality
- Third-party OAuth (Google, Apple)

### Wireframe
```solarwire
!title="Login Page"
// Your wireframe here...
```
```

### For Developers

**Pain Points:**
- Design specs are often ambiguous or outdated
- No single source of truth for UI requirements
- Difficult to integrate wireframes into technical documentation
- Manual work to keep documentation and implementation in sync

**How SolarWire Helps:**
- **Clear Specifications**: Wireframes with `note` attributes document behavior
- **Living Documentation**: Wireframes in code repos stay updated
- **Quick Prototyping**: Sketch ideas without leaving your IDE
- **API Documentation**: Visual examples for REST/GraphQL endpoints
- **Component Libraries**: Document UI patterns in code

**Example - API Response Visualization:**
```solarwire
!title="User Profile Response"

[] @(0,0) w=400 h=300 bg=#fff

(("A")) @(20,20) w=60 h=60 bg=#f0f0f0
"John Doe" @(100,30) size=18 bold
"john@example.com" @(100,55) c=#666

-- @(20,100)->(380,100) b=#eee

"Posts" @(50,120) c=#1890ff
"128" @(50,145) size=20 bold

"Followers" @(150,120) c=#1890ff
"1.2K" @(150,145) size=20 bold

"Following" @(250,120) c=#1890ff
"256" @(250,145) size=20 bold
```

### For AI Assistants

**The Challenge:**
AI assistants struggle with traditional wireframing because:
- No structured format for wireframe representation
- Design tools require GUI interaction
- Difficult to generate, modify, and reason about UI layouts
- No semantic meaning attached to visual elements

**How SolarWire Solves This:**
- **Structured DSL**: Clear syntax that AI can generate and parse
- **Semantic Notes**: `note` attributes provide functional context
- **Text-Based**: Perfect for LLM input/output
- **Deterministic Rendering**: Same input always produces same output
- **Composable**: AI can build complex UIs from simple patterns

**AI Integration Example:**
```
User: "Create a login page with email, password, and social login options"

AI generates:
```solarwire
!title="Login Page"

[] @(0,0) w=400 h=600 bg=#fff

"Welcome" @(170,80) size=24 bold

"Email" @(50,180)
["Enter email"] @(50,205) w=300 h=44 bg=#fff b=#ddd note="Email input
1. Validation: email format
2. Max length: 50 characters"

"Password" @(50,280)
["Enter password"] @(50,305) w=300 h=44 bg=#fff b=#ddd note="Password input
1. Min length: 6 characters
2. Show/hide toggle"

["Sign In"] @(50,380) w=300 h=48 bg=#1890ff c=white note="Login button
1. Validate and submit
2. Redirect to dashboard on success"

"Or continue with" @(150,460) c=#999

[?"Google"] @(100,490) w=40 h=40
[?"Apple"] @(160,490) w=40 h=40
[?"GitHub"] @(220,490) w=40 h=40
```
```

### Key Differentiators

#### 🔄 Version Control Friendly
Every change is trackable. See exactly what changed, when, and why.

```diff
- ["Login"] @(100,50) w=100 h=40
+ ["Sign In"] @(100,50) w=120 h=44 bg=#1890ff c=white
```

#### 🤝 Collaboration Ready
- **Code Review**: Review wireframe changes in pull requests
- **Comments**: Discuss specific elements inline
- **History**: Full change history with commit messages

#### ⚡ Automation Capable
- Generate wireframes from API schemas
- Create consistent UI patterns programmatically
- Batch export to SVG for presentations

#### 🎯 Focus on What Matters
No complex design tools. Just text. Focus on content and functionality, not pixels and alignment.

## Comparison with Other Tools

| Feature | SolarWire | Figma | Balsamiq | Mermaid |
|---------|-----------|-------|----------|---------|
| Text-based | ✅ | ❌ | ❌ | ✅ |
| AI-Native | ✅ | ❌ | ❌ | ⚠️ Limited |
| Wireframes | ✅ | ✅ | ✅ | ❌ |
| Version Control | ✅ Git-native | ⚠️ Limited | ⚠️ Limited | ✅ |
| Learning Curve | Low | Medium | Low | Low |
| Markdown Embed | ✅ | ❌ | ❌ | ✅ |
| SVG Export | ✅ | ✅ | ✅ | ✅ |
| IDE Support | ✅ VSCode | ❌ | ❌ | ⚠️ Plugins |

## Getting Started

Ready to try SolarWire?

1. **Install the VSCode Extension** - Get syntax highlighting and preview
2. **Read the Quick Start Guide** - Learn the basics in 5 minutes
3. **Explore Examples** - See real-world wireframe patterns
4. **Try AI Integration** - Generate wireframes with AI assistance

[Get Started →](/getting-started/quick-start)
