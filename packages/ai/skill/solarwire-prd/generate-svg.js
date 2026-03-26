#!/usr/bin/env node

/**
 * SolarWire PRD SVG Generator
 * 
 * This script extracts solarwire code blocks from markdown files
 * and generates SVG files (with notes and without notes versions)
 * 
 * Usage: node generate-svg.js <path-to-md-file>
 * 
 * This script is self-contained and portable. All dependencies are
 * included in the `lib` directory.
 */

const fs = require('fs');
const path = require('path');

// Import parser and renderer from bundled lib directory
let parse, render;

try {
  // Use relative paths to the lib directory (portable)
  const parserPath = path.join(__dirname, 'lib', 'parser', 'index.js');
  const rendererPath = path.join(__dirname, 'lib', 'renderer-svg', 'index.js');
  
  if (!fs.existsSync(parserPath)) {
    throw new Error(`Parser not found at: ${parserPath}`);
  }
  if (!fs.existsSync(rendererPath)) {
    throw new Error(`Renderer not found at: ${rendererPath}`);
  }
  
  parse = require(parserPath).parse;
  render = require(rendererPath).render;
} catch (e) {
  console.error('Error loading SolarWire packages:', e.message);
  console.error('');
  console.error('The lib directory is missing or incomplete.');
  console.error('Please ensure the following directories exist:');
  console.error('  - lib/parser/        (from @solarwire/parser dist)');
  console.error('  - lib/renderer-svg/  (from @solarwire/renderer-svg dist)');
  process.exit(1);
}

/**
 * Extract solarwire code blocks from markdown content
 */
function extractSolarwireBlocks(content) {
  const blocks = [];
  const regex = /```solarwire\s*\n([\s\S]*?)```/g;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    blocks.push({
      fullMatch: match[0],
      code: match[1].trim()
    });
  }
  
  return blocks;
}

/**
 * Extract page title from solarwire code
 */
function extractPageTitle(code) {
  const titleMatch = code.match(/!title="([^"]+)"/);
  return titleMatch ? titleMatch[1] : 'untitled';
}

/**
 * Generate SVG files from a markdown file
 */
function generateSVGs(mdFilePath, outputDir) {
  console.log(`\nProcessing: ${mdFilePath}`);
  
  // Read markdown file
  const content = fs.readFileSync(mdFilePath, 'utf-8');
  
  // Extract solarwire blocks
  const blocks = extractSolarwireBlocks(content);
  
  if (blocks.length === 0) {
    console.log('  No solarwire code blocks found.');
    return;
  }
  
  console.log(`  Found ${blocks.length} solarwire code block(s)`);
  
  // Process each block
  blocks.forEach((block, index) => {
    try {
      const pageTitle = extractPageTitle(block.code);
      const safeName = pageTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const baseName = `${safeName || `page-${index + 1}`}`;
      
      console.log(`\n  Generating SVG for: ${pageTitle}`);
      
      // Parse the solarwire code
      const ast = parse(block.code);
      
      // Generate SVG with notes
      const svgWithNotes = render(ast, { disableNotes: false });
      const withNotesPath = path.join(outputDir, `${baseName}-with-notes.svg`);
      fs.writeFileSync(withNotesPath, svgWithNotes);
      console.log(`    ✓ Created: ${baseName}-with-notes.svg`);
      
      // Generate SVG without notes
      const svgWithoutNotes = render(ast, { disableNotes: true });
      const withoutNotesPath = path.join(outputDir, `${baseName}-without-notes.svg`);
      fs.writeFileSync(withoutNotesPath, svgWithoutNotes);
      console.log(`    ✓ Created: ${baseName}-without-notes.svg`);
      
    } catch (e) {
      console.error(`    ✗ Error processing block ${index + 1}:`, e.message);
    }
  });
}

/**
 * Process a PRD markdown file and generate SVGs
 */
function processPRDFile(mdFilePath) {
  const mdDir = path.dirname(mdFilePath);
  const mdFileName = path.basename(mdFilePath, '.md');
  
  // Output directory: .solarwire/assets/
  const outputBaseDir = path.join(mdDir, '.solarwire', 'assets');
  
  // Ensure output directory exists
  if (!fs.existsSync(outputBaseDir)) {
    fs.mkdirSync(outputBaseDir, { recursive: true });
  }
  
  generateSVGs(mdFilePath, outputBaseDir);
}

/**
 * Main
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('SolarWire PRD SVG Generator');
    console.log('');
    console.log('Usage: node generate-svg.js <path-to-md-file>');
    console.log('');
    console.log('Example:');
    console.log('  node generate-svg.js ./prd-my-project.md');
    console.log('  node generate-svg.js ../.solarwire/prd-my-project.md');
    console.log('');
    console.log('Output:');
    console.log('  SVG files will be saved to .solarwire/assets/ directory');
    process.exit(0);
  }
  
  const mdFilePath = path.resolve(args[0]);
  
  if (!fs.existsSync(mdFilePath)) {
    console.error(`Error: File not found: ${mdFilePath}`);
    process.exit(1);
  }
  
  processPRDFile(mdFilePath);
  console.log('\n✓ SVG generation complete!');
}

main();
