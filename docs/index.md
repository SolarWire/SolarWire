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

| Challenge | Traditional Tools | SolarWire |
|-----------|------------------|-----------|
| Version Control | Binary files, hard to diff | Plain text, Git-friendly |
| AI Integration | No native support | Designed for AI |
| Documentation | Separate from specs | Embedded in Markdown |
| Learning Curve | Complex UI | Learn in minutes |

### 🎯 For Product Managers

Write wireframes directly in your PRD. Update requirements and wireframes together. No more switching between tools.

### 💻 For Developers

Document UI specs in code. Visualize API responses. Keep docs in sync with implementation.

### 🤖 For AI Assistants

Structured DSL that AI can generate and understand. Add semantic notes for context.

## Key Features

::: tip Text-Based
Everything is plain text. Version control, code review, and collaborate just like code.
:::

::: tip AI-Native
Designed for LLMs. Generate wireframes from natural language, parse and modify programmatically.
:::

::: tip Developer-Friendly
VSCode extension with syntax highlighting, preview, and auto-completion.
:::

## Comparison

### Wireframing Tools

| Feature | SolarWire | Figma | Sketch | Axure | Balsamiq | Pencil | 墨刀 |
|---------|-----------|-------|--------|-------|----------|--------|------|
| Text-based | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| AI-Native | ✅ | ⚠️ Plugin | ⚠️ Plugin | ❌ | ❌ | ❌ | ⚠️ |
| Wireframes | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Git-friendly | ✅ | ⚠️ | ⚠️ | ❌ | ❌ | ✅ | ❌ |
| Markdown Embed | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Version Control | ✅ Native | ⚠️ Cloud | ⚠️ Cloud | ❌ | ❌ | ✅ Files | ⚠️ Cloud |
| Learning Curve | Low | High | Medium | High | Low | Low | Medium |
| Offline Support | ✅ | ⚠️ Partial | ✅ | ✅ | ✅ | ✅ | ❌ |
| Price | Free | Freemium | Paid | Paid | Paid | Free | Freemium |
| PRD Integration | ✅ Native | ❌ | ❌ | ⚠️ | ❌ | ❌ | ❌ |

### Diagram & Code Tools

| Feature | SolarWire | Mermaid | PlantUML | Draw.io |
|---------|-----------|---------|----------|---------|
| UI Wireframes | ✅ | ❌ | ❌ | ⚠️ Basic |
| Text-based | ✅ | ✅ | ✅ | ❌ |
| AI-Native | ✅ | ⚠️ | ⚠️ | ❌ |
| Markdown Embed | ✅ | ✅ | ✅ | ❌ |
| Git-friendly | ✅ | ✅ | ✅ | ⚠️ |
| Learning Curve | Low | Medium | Medium | Low |
| Interactive | ❌ | ❌ | ❌ | ✅ |

### Key Differentiators

| Tool | Best For | Limitation |
|------|----------|------------|
| **SolarWire** | AI-assisted wireframes, PRD documentation | Not for high-fidelity design |
| Figma | High-fidelity design, collaboration | Binary files, steep learning curve |
| Sketch | macOS design workflow | macOS only, paid |
| Axure | Complex prototypes, interactions | Steep learning curve, expensive |
| Balsamiq | Low-fidelity sketches | No text-based, no AI support |
| Pencil | Free, offline wireframing | No collaboration, limited features |
| 墨刀 | Chinese market, team collaboration | Cloud-only, no text-based |
| Mermaid | Diagrams, flowcharts | No UI wireframes |

## Get Started in 30 Seconds

1. Install "SolarWire Support" VSCode extension
2. Create a `.solarwire` file
3. Write `["Hello"] @(0,0) w=100 h=40`
4. See your first wireframe!

[Get Started →](/getting-started/quick-start)
