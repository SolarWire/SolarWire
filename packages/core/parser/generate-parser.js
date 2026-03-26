const fs = require('fs');
const path = require('path');
const peggy = require('peggy');

console.log('Generating parser...');

const grammarPath = path.join(__dirname, 'src', 'grammar.pegjs');
const srcOutputPath = path.join(__dirname, 'src', 'parser.js');
const distOutputPath = path.join(__dirname, 'dist', 'parser.js');

try {
  const grammar = fs.readFileSync(grammarPath, 'utf8');
  const parserSource = peggy.generate(grammar, {
    output: 'source',
    format: 'commonjs'
  });
  fs.writeFileSync(srcOutputPath, parserSource);
  console.log('✓ Parser generated successfully at:', srcOutputPath);
  
  const distDir = path.dirname(distOutputPath);
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  fs.writeFileSync(distOutputPath, parserSource);
  console.log('✓ Parser copied to:', distOutputPath);
} catch (e) {
  console.error('Error generating parser:', e);
  process.exit(1);
}
