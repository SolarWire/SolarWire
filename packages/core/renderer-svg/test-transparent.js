const { parse } = require('@solarwire/parser');
const { render } = require('./dist/index');

const code = `## @(0,0) w=300 border=1
  # bg=transparent
    "A"
    "B"`;

const ast = parse(code);
const svg = render(ast);
console.log(svg);
