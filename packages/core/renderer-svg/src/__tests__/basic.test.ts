import { parse } from '@solarwire/parser';
import { render } from '../index';

describe('SolarWire SVG Renderer', () => {
  describe('Basic Elements', () => {
    it('should render a single rectangle with default styles', () => {
      const ast = parse('["Login"]');
      const svg = render(ast);
      
      expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect(svg).toContain('<rect');
      expect(svg).toContain('Login');
      expect(svg).toContain('fill="#ffffff"');
      expect(svg).toContain('stroke="#333333"');
    });

    it('should render a rectangle with attributes', () => {
      const ast = parse('["Submit"] w=120 h=50 c=blue bg=lightgray');
      const svg = render(ast);
      
      expect(svg).toContain('width="120"');
      expect(svg).toContain('height="50"');
      expect(svg).toContain('fill="lightgray"');
      expect(svg).toContain('fill="blue"');
    });

    it('should render a rounded rectangle', () => {
      const ast = parse('("Card") r=10');
      const svg = render(ast);
      
      expect(svg).toContain('rx="10"');
      expect(svg).toContain('ry="10"');
      expect(svg).toContain('Card');
    });

    it('should render a circle', () => {
      const ast = parse('(("Avatar")) w=30 h=30');
      const svg = render(ast);
      
      expect(svg).toContain('<circle');
      expect(svg).toContain('cx="');
      expect(svg).toContain('cy="');
      expect(svg).toContain('r="15"');
    });

    it('should render text element', () => {
      const ast = parse('"Hello, World!"');
      const svg = render(ast);
      
      expect(svg).toContain('<text');
      expect(svg).toContain('Hello, World!');
      expect(svg).toContain('font-size="12"');
    });

    it('should render multiline text', () => {
      const ast = parse('"First line\\nSecond line"');
      const svg = render(ast);
      
      expect(svg).toContain('First line');
      expect(svg).toContain('Second line');
    });

    it('should render icon', () => {
      const ast = parse('!icon "home"');
      const svg = render(ast);
      
      expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect(svg).toContain('<path');
    });

    it('should render placeholder', () => {
      const ast = parse('[?"Ad space"]');
      const svg = render(ast);
      
      expect(svg).toContain('fill="#f0f0f0"');
      expect(svg).toContain('Ad space');
    });
  });

  describe('Coordinates', () => {
    it('should render element with absolute coordinates', () => {
      const ast = parse('["A"] @(10,20)');
      const svg = render(ast);
      
      expect(svg).toContain('x="10"');
      expect(svg).toContain('y="20"');
    });

    it('should render multiple elements with relative coordinates', () => {
      const ast = parse('["First"] @(0,0) w=100 h=50\n["Second"] @(L+0,B+10)');
      const svg = render(ast);
      
      expect(svg).toContain('First');
      expect(svg).toContain('Second');
    });

    it('should render element with edge coordinates', () => {
      const ast = parse('["Ref"] @(0,0) w=100 h=50\n["Next"] @(R+10,T+5)');
      const svg = render(ast);
      
      expect(svg).toContain('Ref');
      expect(svg).toContain('Next');
    });
  });

  describe('Line Elements', () => {
    it('should render a line without label', () => {
      const ast = parse('-- @(10,10)->(100,10)');
      const svg = render(ast);
      
      expect(svg).toContain('<line');
      expect(svg).toContain('x1="10"');
      expect(svg).toContain('y1="10"');
      expect(svg).toContain('x2="100"');
      expect(svg).toContain('y2="10"');
    });

    it('should render a line with label', () => {
      const ast = parse('--"connect"-- @(10,10)->(100,20)');
      const svg = render(ast);
      
      expect(svg).toContain('<line');
      expect(svg).toContain('connect');
    });

    it('should render line with relative end', () => {
      const ast = parse('-- @(10,10)->(+50,+20)');
      const svg = render(ast);
      
      expect(svg).toContain('<line');
      expect(svg).toContain('x1="10"');
      expect(svg).toContain('y1="10"');
    });
  });

  describe('Containers', () => {
    it('should render row container', () => {
      const ast = parse('{row}');
      const svg = render(ast);
      
      expect(svg).toContain('xmlns');
    });

    it('should render column container', () => {
      const ast = parse('{col}');
      const svg = render(ast);
      
      expect(svg).toContain('xmlns');
    });

    it('should render container with gap', () => {
      const ast = parse('{row} gap=10');
      const svg = render(ast);
      
      expect(svg).toContain('xmlns');
    });
  });

  describe('Attributes', () => {
    it('should render bold text', () => {
      const ast = parse('"Bold" bold');
      const svg = render(ast);
      
      expect(svg).toContain('font-weight="bold"');
    });

    it('should render italic text', () => {
      const ast = parse('"Italic" italic');
      const svg = render(ast);
      
      expect(svg).toContain('font-style="italic"');
    });

    it('should render centered alignment', () => {
      const ast = parse('["Centered"] align=c');
      const svg = render(ast);
      
      expect(svg).toContain('text-anchor="middle"');
    });

    it('should render dashed line', () => {
      const ast = parse('-- @(10,10)->(100,10) style=dashed');
      const svg = render(ast);
      
      expect(svg).toContain('stroke-dasharray="5,5"');
    });

    it('should render dotted line', () => {
      const ast = parse('-- @(10,10)->(100,10) style=dotted');
      const svg = render(ast);
      
      expect(svg).toContain('stroke-dasharray="2,2"');
    });
  });

  describe('Table Elements', () => {
    it('should render table with border', () => {
      const ast = parse('## border=1 w=300');
      const svg = render(ast);
      
      expect(svg).toContain('stroke-width="1"');
      expect(svg).toContain('width="300"');
    });
  });

  describe('Complete Document', () => {
    it('should render complete wireframe', () => {
      const ast = parse('["Header"] @(0,0) w=400 h=60\n["Footer"] @(0,380) w=400 h=40');
      const svg = render(ast);
      
      expect(svg).toContain('Header');
      expect(svg).toContain('Footer');
      expect(svg).toContain('viewBox');
    });
  });

  describe('Global Defaults', () => {
    it('should apply document-level declarations', () => {
      const ast = parse('!c=#ff0000\n!size=16\n["Button"]');
      const svg = render(ast);
      
      expect(svg).toContain('fill="#ff0000"');
      expect(svg).toContain('font-size="16"');
    });

    it('should override global defaults with local attributes', () => {
      const ast = parse('!c=#ff0000\n!size=16\n["Button"] c=#0000ff size=20');
      const svg = render(ast);
      
      expect(svg).toContain('fill="#0000ff"');
      expect(svg).toContain('font-size="20"');
    });
  });

  describe('Note Attributes', () => {
    it('should render note attribute as title', () => {
      const ast = parse('["Button"] note="Click here to login"');
      const svg = render(ast);
      
      expect(svg).toContain('<title>Click here to login</title>');
    });
  });

  describe('Multi-line Text', () => {
    it('should render triple-quoted multi-line text', () => {
      const ast = parse('"""Line 1\nLine 2\nLine 3"""');
      const svg = render(ast);
      
      expect(svg).toContain('Line 1');
      expect(svg).toContain('Line 2');
      expect(svg).toContain('Line 3');
    });
  });
  
  describe('Additional Features', () => {
    it('should render circle with note attribute', () => {
      const ast = parse('(("User")) note="Profile avatar"');
      const svg = render(ast);
      
      expect(svg).toContain('<title>Profile avatar</title>');
    });
    
    it('should render text element with note attribute', () => {
      const ast = parse('"Username" note="Enter your username"');
      const svg = render(ast);
      
      expect(svg).toContain('<title>Enter your username</title>');
    });
    
    it('should render icon with note attribute', () => {
      const ast = parse('!icon "home" note="Go to homepage"');
      const svg = render(ast);
      
      expect(svg).toContain('<title>Go to homepage</title>');
    });
    
    it('should apply multiple global defaults', () => {
      const ast = parse('!c=red\n!size=16\n["Test"]');
      const svg = render(ast);
      
      expect(svg).toContain('fill="red"');
      expect(svg).toContain('font-size="16"');
    });
  });
});
