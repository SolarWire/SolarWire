const fs = require('fs');
const path = require('path');
const { parse } = require('../core/parser/dist');
const { render } = require('../core/renderer-svg/dist');

function renderSolarWireToSVG(solarwireCode, baseOutputPath) {
  console.log('Parsing SolarWire code...');
  const ast = parse(solarwireCode);

  console.log('Rendering SVG with notes...');
  const svgWithNotes = render(ast);
  const outputPathWithNotes = baseOutputPath.replace('.svg', '-with-notes.svg');
  fs.writeFileSync(outputPathWithNotes, svgWithNotes, 'utf-8');
  console.log(`✓ Saved: ${outputPathWithNotes}`);

  console.log('Rendering SVG without notes...');
  const svgWithoutNotes = render(ast, { disableNotes: true });
  const outputPathWithoutNotes = baseOutputPath.replace('.svg', '-without-notes.svg');
  fs.writeFileSync(outputPathWithoutNotes, svgWithoutNotes, 'utf-8');
  console.log(`✓ Saved: ${outputPathWithoutNotes}`);

  return {
    withNotes: outputPathWithNotes,
    withoutNotes: outputPathWithoutNotes
  };
}

function renderFromFile(inputFilePath, outputFilePath) {
  console.log(`Reading input file: ${inputFilePath}`);
  const solarwireCode = fs.readFileSync(inputFilePath, 'utf-8');
  return renderSolarWireToSVG(solarwireCode, outputFilePath);
}

function renderFromString(solarwireCode, outputBasePath) {
  return renderSolarWireToSVG(solarwireCode, outputBasePath);
}

module.exports = {
  renderSolarWireToSVG,
  renderFromFile,
  renderFromString
};

if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage:');
    console.log('  node render-svg.js <input.solarwire> <output.svg>');
    console.log('');
    console.log('Example:');
    console.log('  node render-svg.js example.solarwire example.svg');
    process.exit(1);
  }

  const inputPath = args[0];
  const outputPath = args[1] || inputPath.replace('.solarwire', '.svg');
  
  renderFromFile(inputPath, outputPath);
  console.log('\nDone!');
}
