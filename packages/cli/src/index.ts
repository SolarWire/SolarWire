#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from '@solarwire/parser';
import { render as renderSvg } from '@solarwire/renderer-svg';
import { render as renderHtml } from '@solarwire/renderer-html';

const program = new Command();

program
  .name('solarwire')
  .description('SolarWire - Create beautiful diagrams with simple syntax')
  .version('0.1.0');

program
  .command('render <input>')
  .description('Render a SolarWire diagram file')
  .option('-o, --output <output>', 'Output file path')
  .option('-f, --format <format>', 'Output format (svg, html)', 'svg')
  .action((input, options) => {
    try {
      const content = fs.readFileSync(input, 'utf-8');
      const ast = parse(content);
      
      let output: string;
      let ext: string;
      
      if (options.format === 'html') {
        output = renderHtml(ast);
        ext = 'html';
      } else {
        output = renderSvg(ast);
        ext = 'svg';
      }
      
      const outputPath = options.output || 
        path.join(path.dirname(input), path.basename(input, '.solarwire') + '.' + ext);
      
      fs.writeFileSync(outputPath, output);
      console.log(`✅ Successfully rendered to ${outputPath}`);
    } catch (error) {
      console.error('❌ Error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program
  .command('svg <input>')
  .description('Render a SolarWire diagram to SVG')
  .option('-o, --output <output>', 'Output file path')
  .action((input, options) => {
    try {
      const content = fs.readFileSync(input, 'utf-8');
      const ast = parse(content);
      const output = renderSvg(ast);
      
      const outputPath = options.output || 
        path.join(path.dirname(input), path.basename(input, '.solarwire') + '.svg');
      
      fs.writeFileSync(outputPath, output);
      console.log(`✅ Successfully rendered SVG to ${outputPath}`);
    } catch (error) {
      console.error('❌ Error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program
  .command('html <input>')
  .description('Render a SolarWire diagram to HTML')
  .option('-o, --output <output>', 'Output file path')
  .action((input, options) => {
    try {
      const content = fs.readFileSync(input, 'utf-8');
      const ast = parse(content);
      const output = renderHtml(ast);
      
      const outputPath = options.output || 
        path.join(path.dirname(input), path.basename(input, '.solarwire') + '.html');
      
      fs.writeFileSync(outputPath, output);
      console.log(`✅ Successfully rendered HTML to ${outputPath}`);
    } catch (error) {
      console.error('❌ Error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program.parse();
