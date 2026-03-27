# SolarWire PRD Generator Skill

This is a complete, ready-to-use SolarWire PRD Generator Skill package.

## Portability

**This skill is fully self-contained and portable.** You can copy the entire `solarwire-prd` folder to any AI tool or project and it will work immediately.

All dependencies are bundled in the `lib` directory:
- `lib/parser/` - SolarWire parser
- `lib/renderer-svg/` - SVG renderer

## Directory Structure

```
solarwire-prd/
├── SKILL.md             # Main skill definition file (all-in-one)
├── README.md            # Documentation (this file)
├── package.json         # Package metadata
├── generate-svg.js      # SVG generation script (portable)
└── lib/                 # Bundled dependencies (portable)
    ├── parser/          # SolarWire parser
    └── renderer-svg/    # SVG renderer
```

## Features

- **Multi-turn Dialogue, Step-by-step Confirmation**: Don't rush to generate, fully understand requirements first
- **Complete PRD Document**: Output .md format product requirements document
- **Mermaid Diagram Support**: Includes business flowcharts and interaction sequence diagrams
- **SolarWire Wireframes**: Each page includes complete information and element descriptions
- **What You See Is What You Read**: All element descriptions integrated into wireframe notes for intuitive reading
- **Dual SVG Output**: With notes and without notes versions
- **Fully Portable**: Copy the folder anywhere and it works
- **Three Scenarios**: Mobile App, Web Client, Admin Dashboard

## Usage

### 1. Copy to Your AI Tool

Simply copy the entire `solarwire-prd` folder to your AI tool's skill directory.

### 2. Generate PRD

Use the skill with your AI assistant to generate PRD documents.

### 3. Generate SVG Files

After generating the PRD markdown file, run the SVG generation script:

```bash
node generate-svg.js .solarwire/[requirement-name]/solarwire-prd.md
```

**Output Structure:**
```
.solarwire/                                 # Root directory for all PRD outputs
├── [requirement-name-1]/                   # Folder for requirement 1
│   ├── solarwire-prd.md                    # PRD document
│   ├── [page-name]-with-notes.svg          # Wireframe with note annotations
│   ├── [page-name]-without-notes.svg       # Clean wireframe without notes
│   └── ...                                 # More SVGs for this requirement
│
├── [requirement-name-2]/                   # Folder for requirement 2
│   ├── solarwire-prd.md
│   └── ...
│
└── ...                                     # More requirement folders
```

**Naming Convention:**
- Root directory: `.solarwire` (at project root)
- Requirement folder: Based on the requirement/project name
- PRD file: Always named `solarwire-prd.md`
- SVG files: Based on the `!title` attribute in each solarwire code block

## Scenario Specifications

All scenario-specific settings are integrated into SKILL.md:

| Scenario | Canvas Size | Key Features |
|----------|-------------|--------------|
| Mobile App | 375-430px | Touch-friendly, bottom nav, vertical layout |
| Web Client | 1200-1440px | Top nav, horizontal layout, moderate sizes |
| Admin Dashboard | 1440-1920px | Sidebar, data tables, many action buttons |

## Note Writing Guidelines

**Core Principle: Notes describe functional behavior, not visual details**

### When to Write Notes

**Write notes for elements with functional behavior:**
- Buttons, input fields, links, checkboxes, dropdowns

**Skip notes for purely visual elements:**
- Divider lines, containers, static labels, decorative icons
- Table headers, column titles (unless they have sorting/filtering)

### ⚠️ IMPORTANT: Notes Must Contain Functional Information

**❌ Bad Notes (Just element type labels - AVOID):**
```solarwire
["Login"] note="[Primary Button]"              // ❌ Just says "Button" - no behavior info
## @(260,460) w=1600 border=1 note="[Table]"   // ❌ Just says "Table" - no data info
"ID" note="[Column Title]"                     // ❌ Just says "Column" - no useful info
```

**✅ Good Notes (Contain functional information):**
```solarwire
["Login"] note="[Primary Button]
- Validates username and password on click
- Success: Redirect to homepage
- Failure: Display error message"

## @(260,460) w=1600 border=1 note="[Table] User list.
- Data source: User management API
- Default sort: Created time descending
- Pagination: 20 items per page"
```

**✅ No Note Needed (No functional behavior):**
```solarwire
"Page Title" @(100,50) size=24 bold          // Static text - no note needed
-- @(0,100)->(400,100) b=#eee                 // Divider - no note needed
"ID"                                          // Column title - no note needed
```

### NEVER Include in Notes

- ❌ Colors: "Button is blue", "Text color #333"
- ❌ Fonts: "Font size 14px", "Bold text"
- ❌ Sizes: "Width 100px", "Height 40px"
- ❌ Spacing: "Margin 16px", "Padding 8px"
- ❌ Border: "Border radius 8px"
- ❌ Shadows, animations
- ❌ Technical: API names, database fields
- ❌ Just element type: "[Button]", "[Input]", "[Table]", "[Header Row]"

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

## Important Principles

1. **User Initiative**: Always ask the user when uncertain, give suggestions for user to choose
2. **Progressive Confirmation**: Multi-turn dialogue, step-by-step confirmation, don't generate too much at once
3. **Flexible Output**: Decide which sections to include in the document based on actual needs
4. **Clear Feedback**: Let the user know what's being done at each step
5. **Development Ready**: PRD can directly enter development phase after generation

## License

Uses the same license as the SolarWire project.
