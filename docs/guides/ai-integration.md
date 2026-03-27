# AI Integration - solarwire-prd Skill

The `solarwire-prd` skill is an AI-powered tool that generates complete Product Requirements Documents (PRD) with SolarWire wireframes.

## Overview

This skill generates:

1. **Complete PRD Document** (.md format)
2. **Mermaid Flowcharts/Sequence Diagrams**
3. **SolarWire Wireframes** (each page with complete information)
4. **SVG Rendered Images** (with notes and without notes versions)

---

## Installation

The skill is located at `packages/ai/skill/solarwire-prd/` in the SolarWire repository.

### Directory Structure

```
solarwire-prd/
├── SKILL.md              # Skill definition and instructions
├── README.md             # Documentation
├── generate-svg.js       # SVG generation script
├── lib/                  # Bundled dependencies
│   ├── parser/           # @solarwire/parser
│   └── renderer-svg/     # @solarwire/renderer-svg
└── package.json
```

---

## Usage

### Step 1: Invoke the Skill

Ask your AI assistant to create a PRD:

```
Help me create a PRD for a user login system
```

### Step 2: Requirements Collection

The AI will guide you through:

1. **Product Type** - Mobile App, Web Client, Admin Dashboard, etc.
2. **Core Features** - Login, Register, Profile, etc.
3. **Detailed Requirements** - Confirm understanding

### Step 3: Generate Output

The skill generates:

```
.solarwire/
├── user-login-system/
│   ├── solarwire-prd.md           # PRD document
│   ├── login-page-with-notes.svg  # Wireframe with notes
│   ├── login-page-without-notes.svg
│   ├── register-page-with-notes.svg
│   └── register-page-without-notes.svg
```

---

## SVG Generation

After the PRD is generated, run the SVG generation script:

```bash
node generate-svg.js .solarwire/[requirement-name]/solarwire-prd.md
```

**The script will:**
- Extract all `solarwire` code blocks from the markdown file
- Generate two SVG files for each block:
  - `[page-name]-with-notes.svg` - Includes note annotations
  - `[page-name]-without-notes.svg` - Clean wireframe only

---

## PRD Document Structure

The generated PRD includes:

### 1. Product Overview
- Product Background
- Target Users
- Core Value
- User Stories (with acceptance criteria)

### 2. Feature Scope
- Feature List (with priorities)
- Feature Boundary (included/excluded)

### 3. Functional Requirements
- Detailed feature descriptions
- User flows with Mermaid diagrams

### 4. Non-Functional Requirements
- Performance
- Security
- Compatibility

### 5. Wireframes
- SolarWire code blocks for each page
- Element descriptions with `note` attributes

---

## SolarWire Wireframe Specifications

### Core Principles

#### 1. Syntax Rules

```
1. All elements must have coordinates @(x,y)
2. Write attributes directly without brackets: w=100 h=40 (not [w=100 h=40])
3. Text content MUST use double quotes: "Login" (not Login)
4. Attribute order: Content → Coordinates → Size → Other attributes → note
```

**Correct Example:**
```solarwire
["Login"] @(100,50) w=100 h=40 bg=#3498db c=white note="Submit login form"
"Username" @(100,100)
(("Avatar")) @(100,150) w=40
```

**Incorrect Example:**
```solarwire
["Login"]                    // ❌ No coordinates
["Login"] [w=100 h=40]       // ❌ Attributes in brackets
["Login"] @(100,50) w=100    // ❌ Missing height
((Avatar)) @(100,50) w=40    // ❌ Text without double quotes
```

#### 2. Element Selection Principles

**Goal: Wireframes should be clean, clear, and close to actual page display**

| Scenario | Recommended Element | Example |
|----------|---------------------|---------|
| Primary Buttons | Rectangle `[]` with background color | `["Login"] @(100,50) w=100 h=40 bg=#1890FF c=#FFFFFF` |
| Secondary Buttons | Rectangle `[]` with border | `["Cancel"] @(220,50) w=80 h=40 bg=#FFFFFF b=#F2F2F2` |
| Cards/Containers | Rounded Rectangle `()` | `("User Info Card") @(100,50) w=300 h=200` |
| Avatars | Circle with placeholder | `(("A")) @(100,50) w=40 bg=#F2F2F2 c=#AAAAAA` |
| Icon Buttons | Circle with icon text | `(("?")) @(100,50) w=32 h=32 bg=#F2F2F2` |
| Labels/Text | Plain Text `""` | `"Username" @(100,50)` |
| Input Fields | Rectangle with placeholder | `["Enter username..."] @(100,50) w=280 h=40 bg=#FFFFFF b=#F2F2F2 c=#AAAAAA` |
| Dividers | Line `--` | `-- @(0,100)->(400,100) b=#F2F2F2` |
| Data Tables | Table `##` | `## @(100,50) w=500 border=1` |

**Common Mistakes to Avoid:**
- ❌ Using placeholder `[?]` for buttons (use `["Button Text"]` instead)
- ❌ Using rectangle `[]` for plain labels (use `"Label"` instead)
- ❌ Overcrowding elements - leave proper spacing

#### 3. Container Rectangle Requirements

**Every page must have a container rectangle:**

```solarwire
!title="Page Name"
!c=#333333
!size=13
!bg=#F2F2F2
!r=0

// Container Rectangle - Represents screen/device boundary
[] @(0,0) w=375 h=812 bg=#FFFFFF

// Page content...
```

**Container Size by Platform:**
- Mobile: `w=375 h=812` (iPhone X) or `w=390 h=844` (iPhone 12+)
- Web: `w=1440 h=900`
- Admin Dashboard: `w=1920 h=1080`

---

## Note Writing Guidelines

### Core Principle

**Notes describe functional behavior and business logic, not visual details or technical implementation.**

### When to Write Notes

**Write notes for:**
- Interactive elements (buttons, links, etc.)
- Input elements with validation or logic
- Data display elements with complex rules (tables, lists)
- Elements with business logic (calculations, conditions)
- Complex concepts requiring additional explanation

**Skip notes for:**
- Pure visual elements (dividers, containers, decorative icons)
- Static labels and titles

**Common Sense Exemption (no note needed unless special behavior):**
- Back button (standard behavior: return to previous page)
- Close button
- Page selector
- Number stepper/incrementer

### Note Structure Format

**Format Rules:**
```
First line: Element definition (what this element is, NOT element type)
First level: Numbered (1. 2. 3.)
Second level: - or # (if third level exists)
Third level: -- or -
```

**Example:**
```solarwire
["Enter password"] @(100,100) w=280 h=40 note="Password input
1. Input rules
   - Password displayed as dots
   - Minimum 6 characters, maximum 32 characters
   - Must contain both letters and numbers
2. Interaction
   - Show/hide toggle icon on the right
   - Validate format on blur
   - Display error on format failure: 'Invalid password format'
3. Special notes
   - Lock account for 15 minutes after 5 consecutive errors"
```

### First Line: Element Definition

**The first line of a note MUST define what this element is (functional description, NOT element type).**

| Correct | Incorrect |
|---------|-----------|
| `Password input` | `[Password Field]` |
| `Username input` | `[Input Field]` |
| `User data table` | `[Data Table]` |
| `Submit form button` | `[Primary Button]` |

### Content Requirements by Element Type

**Interactive/Operational Elements:**

Must include:
- What happens on click/operation
- Success/failure handling
- Disabled conditions
- Special handling (debounce, throttle, etc.)

**Example:**
```solarwire
["Login"] @(100,50) w=100 h=40 note="Login button
1. Click action
   - Validate username and password
   - Submit login request if validation passes
2. Success handling
   - Save login state
   - Redirect to homepage
3. Failure handling
   - Display error: 'Invalid username or password'
   - Clear password field
4. Disabled conditions
   - Disabled when username or password is empty"
```

**Elements with Logic:**

Must include:
- Show/hide conditions
- Calculation rules
- Validation rules
- State transitions

**Data Display Elements:**

Must include:
- **Data source**: Module, page, or operation (NOT API/technical details)
- **Display fields and rules**: Field meanings, formats, special handling
- **Sorting rules**: Default sort, sortable fields

**Example:**
```solarwire
## @(100,50) w=500 border=1 note="User list table
1. Data source
   - User list data from User Management module
   - Default sort: creation time descending
2. Field descriptions
   - ID: Unique user identifier
   - Username: Display nickname, show 'Not set' if empty
   - Status: 1='Active', 0='Disabled', disabled shown in red
   - Created: Format as YYYY-MM-DD HH:mm
3. Sorting rules
   - Support sorting by username and created time"
```

### Content Forbidden in Notes

**NEVER include:**

| Forbidden | Example (Don't Write) |
|-----------|----------------------|
| Colors | "Button is blue", "Text color #333" |
| Fonts | "Font size 14px", "Bold text" |
| Sizes | "Width 100px", "Height 40px" |
| Spacing | "Margin 16px", "Padding 8px" |
| Border | "Border radius 8px" |
| Shadows | "Box shadow 0 2px 4px" |
| Animations | "Fade in 0.3s" |
| Technical details | "API: /api/login", "Database: user_id" |

**Why?** These are:
- Already shown visually in wireframe
- Design decisions to be made later
- Subject to change during implementation

### Examples: Good vs Bad Notes

**❌ Bad Note (Visual details + element type label):**
```solarwire
["Login"] @(100,50) w=100 h=40 note="[Primary Button]
- Blue background, white text
- Border radius 8px
- API: POST /api/auth/login"
```

**✅ Good Note (Functional behavior):**
```solarwire
["Login"] @(100,50) w=100 h=40 note="Login button
1. Click action
   - Validate username and password
2. Success handling
   - Save login state
   - Redirect to homepage
3. Failure handling
   - Display error: 'Invalid credentials'
4. Disabled conditions
   - Disabled when username or password is empty"
```

**✅ No Note Needed (Visual element):**
```solarwire
-- @(0,100)->(400,100) b=#F2F2F2
```

---

## Modal Presentation Rules

**All modals MUST have a separate SolarWire wireframe, not just a simple description in a note.**

### Modal Types

| Type | Description |
|------|-------------|
| Confirmation modal | Delete confirmation, operation confirmation, etc. |
| Form modal | Create, edit, etc. |
| Information modal | Detail view, etc. |
| Alert modal | Success, failure, warning, etc. |

### Modal vs Tooltip/Toast

| Type | Handling | Description |
|------|----------|-------------|
| Modal | Separate SolarWire wireframe | Complete UI, interactions, action buttons |
| Tooltip | Describe directly in note | Simple text hint, no interaction |
| Toast | Describe directly in note | Simple message, auto-dismiss |

### Example: Modal Reference in Page Note

```solarwire
["Delete"] @(100,50) w=80 h=36 note="Delete button
1. Click action
   - Show delete confirmation modal (see 'Delete Confirmation Modal' wireframe)
   - Execute delete on confirmation
2. Success handling
   - Display Toast: 'Deleted successfully'
   - Refresh list data"
```

---

## Scenario Specifications

### Mobile App

**Characteristics:**
- Narrow canvas (375-430px)
- Vertical layout, bottom navigation
- Touch-friendly large buttons (min 44x44px)

**Container Size:** `w=375 h=812` (iPhone X) or `w=390 h=844` (iPhone 12+)

**Element Sizes:**
- Button height: 44-56px
- Input field height: 44-52px
- Text size: 13px (default), 18-22px (titles)
- Element spacing: 10px (unified), Page margins: 16-24px

**Common Patterns:**
- Login: Logo + Title + Form + Button (full width)
- List: Search bar + List items + Pull to refresh
- Detail: Back button + Title + Content + Bottom action

### Web Client

**Characteristics:**
- Wide canvas (1200-1440px)
- Horizontal layout, top navigation
- Moderate button/input sizes

**Container Size:** `w=1440 h=900`

**Element Sizes:**
- Button height: 36-48px, width: min 80px
- Input field height: 36-44px, width: 200-400px
- Text size: 13px (default), 18-24px (titles)
- Element spacing: 10px (unified), Page margins: 24-48px

**Common Patterns:**
- Login: Centered layout, Logo + Form + Button
- List: Search/filter bar + Data table + Pagination
- Detail: Breadcrumb + Title + Content cards + Actions

### Admin Dashboard

**Characteristics:**
- Very wide canvas (1440-1920px)
- Fixed left sidebar (200-280px)
- Data-intensive (tables, charts, cards)
- Many action buttons

**Container Size:** `w=1920 h=1080`

**Element Sizes:**
- Button height: 32-40px
- Input field height: 32-36px
- Table row height: 40-48px
- Sidebar width: 200-280px
- Text size: 13px (default), 16-20px (titles)
- Element spacing: 10px (unified), Page margins: 24-32px

**Common Patterns:**
- List: Search/filter + Batch actions + Table + Pagination
- Statistics: Multiple stat cards + Charts + Time selector
- Form: Breadcrumb + Multi-column form + Save/Cancel

---

## Color Standards

| Purpose | Color | Usage |
|---------|-------|-------|
| Normal text | `#333333` | Labels, content text |
| Secondary text | `#AAAAAA` | Placeholder, descriptions |
| Borders/Lines | `#F2F2F2` | Dividers, borders |
| Background | `#FFFFFF` | Page background |
| Primary elements | `#1890FF` | Primary buttons, links, selected state |
| Warning/Error | `#D9001B` | Error messages, warnings |

---

## Spacing Standards

| Rule | Value |
|------|-------|
| Element spacing | 10px (unified) |
| Font size | 13px |
| Line height | 22px |

---

## Updating Dependencies

If you need to update the bundled dependencies:

```bash
# Build the latest parser and renderer
cd SolarWire/packages/core/parser && npm run build
cd SolarWire/packages/core/renderer-svg && npm run build

# Copy to skill lib directory
cp -r SolarWire/packages/core/parser/dist/* solarwire-prd/lib/parser/
cp -r SolarWire/packages/core/renderer-svg/dist/* solarwire-prd/lib/renderer-svg/
```

---

## Best Practices Summary

1. **Confirm Requirements Step by Step** - Don't rush to generate
2. **Notes Describe Function, Not Visuals** - Focus on behavior
3. **Not Every Element Needs a Note** - Skip decorative elements
4. **First Line Defines Element** - Note first line must describe what the element is
5. **Note Structure Required** - Use numbered first level, dash for second level
6. **Coordinates Must Be Complete** - Every element must have `@(x,y)`
7. **No Brackets for Attributes** - Write directly `w=100 h=40`
8. **Choose Elements Reasonably** - Buttons use rectangles, labels use text
9. **Layout Close to Reality** - Wireframes should reflect actual page structure
10. **Separate Modals/States/Tabs** - Each independent view in separate code block
11. **Container Rectangle Required** - First element of each page
12. **Generate Dual SVG Versions** - With notes and without notes
13. **Use Standard Colors** - #333333 (text), #AAAAAA (secondary), #F2F2F2 (border), #FFFFFF (bg), #1890FF (primary)
14. **Font Standards** - Font size 13px, line height 22px

---

## Troubleshooting

### SVG Not Generated

Make sure you have Node.js installed:

```bash
node --version  # Should be 18+
```

### Parser Error

Check your SolarWire syntax:
- All elements have coordinates `@(x,y)`
- Text is wrapped in quotes `["Button"]`
- Tables use proper indentation (2 spaces for rows, 4 for cells)

### Note Not Showing

Notes are only rendered in the `-with-notes.svg` version. Check the `-without-notes.svg` for clean wireframes.
