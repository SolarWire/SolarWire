# SolarWire PRD Generator Skill

This is a complete, ready-to-use SolarWire PRD Generator Skill package.

## Portability

**This skill is fully self-contained and portable.** You can copy the entire `solarwire-prd` folder to any AI tool or project and it will work immediately.

All dependencies are bundled in the `lib` directory:
- `lib/parser/` - SolarWire parser (from @solarwire/parser)
- `lib/renderer-svg/` - SVG renderer (from @solarwire/renderer-svg)

## Directory Structure

```
solarwire-prd/
├── SKILL.md             # Main skill definition file
├── README.md            # Documentation (this file)
├── package.json         # Package metadata
├── generate-svg.js      # SVG generation script (portable)
├── lib/                 # Bundled dependencies (portable)
│   ├── parser/          # SolarWire parser
│   └── renderer-svg/    # SVG renderer
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
- **Fully Portable**: Copy the folder anywhere and it works

## Usage

### 1. Copy to Your AI Tool

Simply copy the entire `solarwire-prd` folder to your AI tool's skill directory.

### 2. Generate PRD

Use the skill with your AI assistant to generate PRD documents.

### 3. Generate SVG Files

After generating the PRD markdown file, run the SVG generation script:

```bash
node generate-svg.js path/to/prd-[project-name].md
```

**Output:**
- `[page-name]-with-notes.svg` - Wireframe with note annotations
- `[page-name]-without-notes.svg` - Clean wireframe without notes
- Files are saved to `.solarwire/assets/` directory

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
