import { parse } from '@solarwire/parser';
import { render } from '../index';

describe('Default Values', () => {
  it('should render rectangle with white background by default', () => {
    const ast = parse('["默认矩形"]');
    const svg = render(ast);
    
    expect(svg).toContain('fill="#ffffff"');
  });

  it('should render rounded rectangle with white background by default', () => {
    const ast = parse('("默认圆角矩形")');
    const svg = render(ast);
    
    expect(svg).toContain('fill="#ffffff"');
  });

  it('should render circle with transparent background by default', () => {
    const ast = parse('(("默认圆形"))');
    const svg = render(ast);
    
    expect(svg).toContain('fill="transparent"');
  });

  it('should render placeholder with #f0f0f0 background by default', () => {
    const ast = parse('[?"默认占位符"]');
    const svg = render(ast);
    
    expect(svg).toContain('fill="#f0f0f0"');
  });

  it('should render text with black color by default', () => {
    const ast = parse('"默认文本"');
    const svg = render(ast);
    
    expect(svg).toContain('fill="#000000"');
  });

  it('should render container with white background by default', () => {
    const ast = parse('{row}');
    const svg = render(ast);
    
    expect(svg).toContain('fill="#ffffff"');
  });

  it('should render column container with white background by default', () => {
    const ast = parse('{col}');
    const svg = render(ast);
    
    expect(svg).toContain('fill="#ffffff"');
  });

  it('should override global defaults with local attributes', () => {
    const ast = parse('!bg=lightgray\n["带全局和本地属性"] bg=white');
    const svg = render(ast);
    
    expect(svg).toContain('fill="white"');
  });
});
