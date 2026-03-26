# SolarWire PRD Generator Skill

This is a complete, ready-to-use SolarWire PRD Generator Skill package.

## Directory Structure

```
solarwire-prd/
├── SKILL.md             # Main skill definition file
├── README.md            # Documentation (this file)
└── prompts/             # Prompt files directory
    ├── mobile-app.md    # Mobile app scenario
    ├── web-client.md    # Web client scenario
    └── web-admin.md     # Admin dashboard scenario
```

## Features

- **Multi-turn Dialogue, Step-by-step Confirmation**: Don't rush to generate, fully understand requirements first
- **Complete PRD Document**: Output .md format product requirements document
- **Mermaid Diagram Support**: Includes business flowcharts and interaction sequence diagrams
- **SolarWire Wireframes**: Each page includes complete information and element descriptions
- **What You See Is What You Read**: All element descriptions integrated into wireframe notes for intuitive reading
- **Dual SVG Output**: With notes and without notes versions
- **Supports Three Scenarios**: Mobile App, Web Client, Admin Dashboard

## Output File Structure

```
.solarwire/
├── prd-[project-name].md           # Main PRD document
└── assets/
    └── [page-name]/
        ├── [page-name]-with-notes.svg    # Wireframe with notes
        └── [page-name]-without-notes.svg # Wireframe without notes
```

## Workflow

1. **Requirements Collection**: Confirm product type (Mobile/Web/Admin)
2. **Feature Confirmation**: Confirm core features and pages
3. **Detailed Requirements**: Confirm special requirements and details
4. **Generate Output**: Generate complete PRD document and wireframes

## PRD Document Structure

The generated PRD document includes the following sections:

1. **Product Overview**: Background, target users, core value
2. **Feature Scope**: Feature list, feature boundary
3. **Business Flow**: Mermaid flowcharts and sequence diagrams
4. **Page Design**: Page list
5. **Page Details**: Complete description of each page
   - **Page Overview**: One sentence describing the core functionality
   - **SolarWire Wireframe**: Contains all descriptions
     - Element notes: Detailed functional description for each UI element
6. **Non-functional Requirements**: Performance, security, compatibility
7. **Appendix**: Glossary, references

## Core Specifications

1. **Confirm Requirements Step by Step**: Don't rush to generate, fully understand requirements first
2. **What You See Is What You Read**: All element descriptions integrated into wireframe notes
3. **Note Category Tags**: Use 【】 tags to identify element types ([Primary Button], [Input Field], [Link], etc.)
4. **Syntax Rules**: All elements must have coordinates, attributes without brackets
5. **Element Selection**: Buttons use rectangles, labels use text, only icons use placeholders
6. **Page Organization**: Modals/states/tabs must use separate SolarWire fragments
7. **Container Rectangle**: Every page must have a container rectangle
8. **Dual SVG Versions**: Generate with notes and without notes versions

## Supported Scenarios

### Mobile App (mobile-app.md)
- Canvas width: 375-430px
- Vertical layout
- Touch-friendly large buttons
- Bottom navigation bar

### Web Client (web-client.md)
- Canvas width: 1200-1440px
- Horizontal layout
- Top navigation bar

### Admin Dashboard (web-admin.md)
- Canvas width: 1440-1920px
- Left sidebar
- Data tables, statistics cards

## Preview Method

Use VSCode SolarWire extension to preview solarwire code blocks in `.md` files in real-time.

## File Naming Convention

- Main document: `prd-[project-name].md`
- SVG files: `[page-name]-with-notes.svg` / `[page-name]-without-notes.svg`

## Important Principles

1. **User Initiative**: Always ask the user when uncertain, give suggestions for user to choose
2. **Progressive Confirmation**: Multi-turn dialogue, step-by-step confirmation, don't generate too much at once
3. **Flexible Output**: Decide which sections to include in the document based on actual needs
4. **Clear Feedback**: Let the user know what's being done at each step
5. **Development Ready**: PRD can directly enter development phase after generation

## License

Uses the same license as the SolarWire project.
