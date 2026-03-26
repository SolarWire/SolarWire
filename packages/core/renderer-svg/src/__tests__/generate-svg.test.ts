import { parse } from '@solarwire/parser';
import { render } from '../index';
import * as fs from 'fs';
import * as path from 'path';

describe('Generate SVG', () => {
  it('should generate complete example SVG', () => {
    const solarwireCode = '!c=#333\n!size=12\n["矩形示例"] @(20,20) w=150 h=50 c=blue bg=lightgray note="这是一个矩形"\n("圆角矩形") @(200,20) w=150 h=50 r=10 bg=#fff0c0 note="这是一个圆角矩形"\n(("圆形")) @(20,100) w=60 h=60 bg=#90EE90 note="圆形头像"\n["粗体"] @(20,180) bold\n["斜体"] @(100,180) italic\n["居中"] @(180,180) align=c\n["右对齐"] @(260,180) align=r\n["按钮1"] @(20,250) w=80 h=35 bg=#4CAF50 c=white\n["按钮2"] @(R+10,T+0) w=80 h=35 bg=#2196F3 c=white';

    const ast = parse(solarwireCode);
    const svg = render(ast);
    
    const outputPath = path.join(__dirname, '../../complete-example.svg');
    fs.writeFileSync(outputPath, svg, 'utf-8');
    
    console.log('\n========================================');
    console.log('SVG file generated:');
    console.log(outputPath);
    console.log('\nSVG content:');
    console.log('----------------------------------------');
    console.log(svg);
    console.log('========================================\n');
    
    expect(svg).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(svg).toContain('矩形示例');
    expect(svg).toContain('圆角矩形');
    expect(svg).toContain('圆形');
    expect(svg).toContain('按钮1');
  });
});
