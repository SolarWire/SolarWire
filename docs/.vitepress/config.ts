import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'SolarWire',
  description: 'A lightweight, Markdown-style DSL for UI wireframes',
  lang: 'en-US',
  
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
  ],
  
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'SolarWire',
    
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started/quick-start' },
      { text: 'Reference', link: '/reference/elements' },
      { text: 'Examples', link: '/examples/login-form' },
      { text: 'GitHub', link: 'https://github.com/SolarWire/SolarWire' }
    ],
    
    sidebar: {
      '/getting-started/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/getting-started/introduction' },
            { text: 'Quick Start', link: '/getting-started/quick-start' },
            { text: 'Installation', link: '/getting-started/installation' },
            { text: 'Basic Syntax', link: '/getting-started/basic-syntax' }
          ]
        }
      ],
      '/reference/': [
        {
          text: 'Reference',
          items: [
            { text: 'Elements', link: '/reference/elements' },
            { text: 'Attributes', link: '/reference/attributes' },
            { text: 'Coordinates', link: '/reference/coordinates' },
            { text: 'Tables', link: '/reference/tables' },
            { text: 'Notes', link: '/reference/notes' }
          ]
        }
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Login Form', link: '/examples/login-form' },
            { text: 'Dashboard', link: '/examples/dashboard' },
            { text: 'Mobile App', link: '/examples/mobile-app' },
            { text: 'Data Table', link: '/examples/data-table' }
          ]
        }
      ],
      '/guides/': [
        {
          text: 'Guides',
          items: [
            { text: 'Best Practices', link: '/guides/best-practices' },
            { text: 'AI Integration', link: '/guides/ai-integration' },
            { text: 'VSCode Extension', link: '/guides/vscode-extension' },
            { text: 'Markdown Integration', link: '/guides/markdown-integration' }
          ]
        }
      ]
    },
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/SolarWire/SolarWire' }
    ],
    
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present SolarWire Team'
    },
    
    search: {
      provider: 'local'
    },
    
    editLink: {
      pattern: 'https://github.com/SolarWire/SolarWire/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },
    
    lastUpdated: {
      text: 'Last updated',
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'short'
      }
    }
  }
})
