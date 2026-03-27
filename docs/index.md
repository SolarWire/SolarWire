---
layout: home

hero:
  name: "SolarWire"
  text: "UI Wireframes in Markdown"
  tagline: A lightweight, Markdown-style DSL for creating UI wireframes with AI integration
  image:
    src: /hero-image.svg
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

### For Product Managers
- Write wireframes directly in PRD documents
- AI can understand and generate wireframes
- Version control with Git

### For Developers
- Quick prototype visualization
- Document UI specifications
- Integrate with existing Markdown docs

### For AI Assistants
- Structured format for wireframe generation
- Clear semantic meaning
- Easy to parse and render
