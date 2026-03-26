# SolarWire PRD - Web Client

This is the specific configuration for web client scenarios.

## 1. Scenario Characteristics

Web client applications typically have the following characteristics:
- Wide canvas (1200-1440px)
- Primarily horizontal layout
- Common top navigation bar
- Content area centered or left-aligned
- Moderate button and input field sizes

## 2. Size Specifications

### Canvas Size
- Recommended width: 1200-1440px
- Height adjusts automatically based on content

### Element Sizes
- Button height: 36-48px
- Button width: Based on content, minimum 80px
- Input field height: 36-44px
- Input field width: 200-400px (depending on usage)
- Text size: 12-16px
- Title text size: 18-24px

### Spacing Specifications
- Element spacing: 12-24px
- Page margins: 24-48px

## 3. Layout Best Practices

### 1. Common Layout Structure

```solarwire
!title="Web Client"
!size=14
!gap=16

// Container Rectangle - Web Client
[] @(0,0) w=1440 h=900 bg=#fff

// Top navigation bar
["Logo"] @(50,0) w=120 h=60 note="[Icon] Click to return to homepage"
["Home"] @(200,18) note="[Link] Switch to homepage"
["Products"] @(280,18) note="[Link] Switch to products page"
["About"] @(360,18) note="[Link] Switch to about page"

// Main content area
"Page Title" @(50,100) size=20 bold note="Page title"
("Welcome") @(50,140) w=1300 h=200 note="[Card] Welcome area card"

// Sidebar (optional)
["Menu Item 1"] @(50,360) w=200 h=40 note="[Link] Click to switch to menu item 1"
["Menu Item 2"] @(50,412) w=200 h=40 note="[Link] Click to switch to menu item 2"

// Main content
["Content..."] @(274,360) w=1000 h=400 note="[Card] Main content area"
```

### 2. Navigation Bar
- Usually placed at the top of the page
- Logo on the left `@(50,0)`, navigation items in the center or right
- Height: 56-64px

### 3. Form Layout
- Label + input field combination
- Buttons placed at the bottom, right-aligned or centered

### 4. Card Layout
- Use rounded rectangle `()` as cards
- Elements inside cards positioned with absolute coordinates
- Maintain appropriate spacing between cards

## 4. Common Patterns

### Login Page
- Centered layout
- Logo + Title + Form + Button

### List Page
- Top search/filter bar
- Data table
- Pagination controls

### Detail Page
- Breadcrumb navigation
- Title area
- Detail content (possibly divided into multiple cards)
- Action buttons

### Form Page
- Title
- Form items (vertically arranged)
- Submit/Cancel buttons

## 5. Page Organization Rules

**Each SolarWire code block handles only one independent view:**

| Situation | Handling Method |
|-----------|-----------------|
| Modals/Dialogs | Separate SolarWire fragment |
| Different Page States | Separate fragment for each state |
| Tab Switching | Separate fragment for each tab |

## 6. Note Writing Guidelines

**Core Principle: All element descriptions integrated into wireframe notes for "what you see is what you read"**

### Element-level Note

Every UI element should have detailed note description, use 【】 tags to identify element types:

- [Primary Button], [Secondary Button]: Action buttons
- [Input Field], [Dropdown]: Input elements
- [Link]: Text links
- [Icon]: Icon buttons
- [Card]: Card containers

### Content Forbidden in Notes

- ❌ Visual details: Colors, fonts, border-radius, shadows, animation effects
- ❌ Technical implementation: API names, database fields, encryption methods
- ❌ Size values: Width, height, spacing

## 7. PRD Specific Requirements

### Web-specific Field Definitions

```markdown
### Web Adaptation Fields

| Field Name | Type | Description |
|------------|------|-------------|
| sessionId | string | Session ID |
| userAgent | string | Browser information |
| screenSize | string | Screen resolution |
| referrer | string | Referrer page |
```

### Web-specific Business Rules

```markdown
### Web Business Rules

1. **Login Rules**
   - Support username/password login
   - Support QR code login
   - Support third-party login (WeChat, QQ, Weibo)
   - Session validity: 30 minutes of inactivity auto-expire

2. **Browser Compatibility**
   - Chrome 90+
   - Safari 14+
   - Firefox 88+
   - Edge 90+
```
