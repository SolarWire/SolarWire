const fs = require('fs');
const path = require('path');
const { parse } = require('@solarwire/parser');
const { render: renderSvg } = require('@solarwire/renderer-svg');
const { render: renderHtml } = require('@solarwire/renderer-html');

const solarwirePath = path.join(__dirname, 'example.solarwire');
const svgPath = path.join(__dirname, 'example.svg');
const htmlPath = path.join(__dirname, 'example.html');

try {
  const solarwireCode = fs.readFileSync(solarwirePath, 'utf-8');
  console.log('Parsing SolarWire code...');
  
  const ast = parse(solarwireCode);
  console.log('Parse successful! Rendering SVG and HTML...');
  
  const svg = renderSvg(ast);
  const html = renderHtml(ast);
  console.log('Render successful! Saving files...');
  
  fs.writeFileSync(svgPath, svg, 'utf-8');
  fs.writeFileSync(htmlPath, html, 'utf-8');
  console.log(`SVG file saved to: ${svgPath}`);
  console.log(`HTML file saved to: ${htmlPath}`);
  console.log('\nSVG preview:');
  console.log(svg.substring(0, 500) + '...');
} catch (error) {
  console.error('Error:', error.message);
  if (error.stack) {
    console.error(error.stack);
  }
  process.exit(1);
}
