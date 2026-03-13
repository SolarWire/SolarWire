const fs = require('fs');
const path = require('path');
const peggy = require('peggy');

console.log('Generating parser...');

const grammarPath = path.join(__dirname, 'src', 'grammar.pegjs');
const outputPath = path.join(__dirname, 'src', 'parser.js');

try {
  const grammar = fs.readFileSync(grammarPath, 'utf8');
  const parserSource = peggy.generate(grammar, {
    output: 'source',
    format: 'commonjs'
  });
  fs.writeFileSync(outputPath, parserSource);
  console.log('✓ Parser generated successfully at:', outputPath);
} catch (e) {
  console.error('Error generating parser:', e);
  process.exit(1);
}
