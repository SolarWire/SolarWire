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

## Wireframe Guidelines

### Container Pattern

Always start with a white background container:

```solarwire
[] @(0,0) w=1440 h=900 bg=#fff
```

### Note Best Practices

Notes should describe **function**, not visuals:

```solarwire
["Login"] @(100,50) w=100 h=40 note="[Primary Button]
- Validates email and password
- Success: Redirect to dashboard
- Failure: Show error toast
- Disabled when: email or password is empty"
```

### What NOT to Write in Notes

- ❌ Visual details (colors, sizes, fonts)
- ❌ Element type labels only ("[Button]", "[Table]")
- ❌ Information already visible in wireframe

### What to Write in Notes

- ✅ Functional behavior
- ✅ Validation rules
- ✅ Success/failure scenarios
- ✅ Disabled states
- ✅ Data sources

---

## Note Category Tags

Use `[]` tags to identify element types:

| Tag | Usage | Needs Note? |
|-----|-------|-------------|
| `[Primary Button]` | Primary action button | Yes |
| `[Secondary Button]` | Secondary action button | Yes |
| `[Input Field]` | Text input field | Yes |
| `[Dropdown]` | Dropdown select | Yes |
| `[Checkbox]` | Checkbox | Yes |
| `[Link]` | Text link | Yes |
| `[Icon]` | Icon button | If interactive |
| `[Card]` | Card container | If has behavior |
| `[Table]` | Data table | Yes |

---

## Examples

### Login Page

```solarwire
!title="Login Page"

[] @(0,0) w=400 h=500 bg=#fff

"Welcome Back" @(150,80) size=24 bold

"Email" @(50,180)
["Enter your email"] @(50,205) w=300 h=44 bg=#fff b=#ddd note="[Input Field]
- Email format validation
- Max length: 50 characters
- Error: 'Please enter a valid email'"

"Password" @(50,280)
["Enter password"] @(50,305) w=300 h=44 bg=#fff b=#ddd note="[Password Field]
- Min 6 characters
- Show/hide toggle
- Error: 'Password must be at least 6 characters'"

["Remember Me"] @(50,370) w=16 h=16 note="[Checkbox] Stay logged in for 7 days"
"Remember me" @(74,372)

["Sign In"] @(50,420) w=300 h=48 bg=#3498db c=white note="[Primary Button]
- Validates credentials
- Success: Redirect to dashboard
- Failure: Show 'Invalid credentials' error
- Disabled when: fields are empty"

"Don't have an account?" @(100,480) c=#666
"Sign up" @(260,480) c=#3498db note="[Link] Navigate to registration"
```

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

## Best Practices

1. **Confirm Requirements Step by Step** - Don't rush to generate
2. **Notes Describe Function, Not Visuals** - Focus on behavior
3. **Not Every Element Needs a Note** - Skip decorative elements
4. **Use Category Tags** - `[Primary Button]`, `[Input Field]`, etc.
5. **Container Rectangle Required** - First element of each page
6. **Generate Dual SVG Versions** - With notes and without notes

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
