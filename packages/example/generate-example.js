
const fs = require('fs');
const path = require('path');
const { parse } = require('../parser/dist');
const { render } = require('../renderer-svg/dist');

console.log('Reading example.solarwire...');
const input = fs.readFileSync(
  path.join(__dirname, 'example.solarwire'),
  'utf8'
);

console.log('Parsing...');
const ast = parse(input);

console.log('Rendering...');
const svg = render(ast);

console.log('Writing example.svg...');
fs.writeFileSync(
  path.join(__dirname, 'example.svg'),
  svg
);

console.log('Done!');
