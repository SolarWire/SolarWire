import { parse } from '@solarwire/parser';
import { render } from '../index';

describe('SolarWire SVG Renderer - Edge Cases', () => {
  describe('Table with colspan/rowspan', () => {
    it('should render table cell with colspan', () => {
      const ast = parse(`## @(10,20) w=300 border=1
  # bg=#eee
    ["Header"] colspan=2
    ["Normal"]`);
      const svg = render(ast);
      
      expect(svg).toContain('Header');
      expect(svg).toContain('Normal');
    });

    it('should render table cell with rowspan', () => {
      const ast = parse(`## @(10,20) w=300 border=1
  # bg=#eee
    ["Header"] rowspan=2
    ["Normal"]
  #
    ["Other"]`);
      const svg = render(ast);
      
      expect(svg).toContain('Header');
    });

    it('should render table cell with both colspan and rowspan', () => {
      const ast = parse(`## @(10,20) w=300 border=1
  # bg=#eee
    ["Merged"] colspan=2 rowspan=2
    ["A"]
  #
    ["B"]
    ["C"]`);
      const svg = render(ast);
      
      expect(svg).toContain('Merged');
    });
  });

  describe('Complex Note Content', () => {
    it('should render note with multi-line text', () => {
      const ast = parse('["Button"] @(10,20) note="First line\\nSecond line\\nThird line"');
      const svg = render(ast);
      
      expect(svg).toContain('First line');
      expect(svg).toContain('Second line');
      expect(svg).toContain('Third line');
    });

    it('should render note with list markers', () => {
      const ast = parse('["List"] @(10,20) note="- Item 1\\n- Item 2\\n- Item 3"');
      const svg = render(ast);
      
      expect(svg).toContain('- Item 1');
      expect(svg).toContain('- Item 2');
      expect(svg).toContain('- Item 3');
    });

    it('should render multiple notes with badges', () => {
      const ast = parse('["First"] @(10,20) note="First note"\n["Second"] @(100,20) note="Second note"\n["Third"] @(190,20) note="Third note"');
      const svg = render(ast);
      
      expect(svg).toContain('note-badge');
      expect(svg).toContain('note-card');
      expect(svg).toContain('First note');
      expect(svg).toContain('Second note');
      expect(svg).toContain('Third note');
    });
  });

  describe('Image Element', () => {
    it('should render image placeholder', () => {
      const ast = parse('<image.png> @(10,20) w=100 h=80');
      const svg = render(ast);
      
      expect(svg).toContain('rect');
      expect(svg).toContain('image.png');
    });

    it('should render image with custom size', () => {
      const ast = parse('<logo.jpg> @(10,20) w=200 h=150');
      const svg = render(ast);
      
      expect(svg).toContain('width="200"');
      expect(svg).toContain('height="150"');
    });
  });

  describe('Special Characters and Text', () => {
    it('should render text with special characters', () => {
      const ast = parse('"Special chars" @(10,20)');
      const svg = render(ast);
      
      expect(svg).toContain('Special chars');
    });

    it('should render very long text', () => {
      const longText = 'A'.repeat(100);
      const ast = parse(`"${longText}" @(10,20)`);
      const svg = render(ast);
      
      expect(svg).toContain('A');
    });

    it('should render empty text', () => {
      const ast = parse('"" @(10,20)');
      const svg = render(ast);
      
      expect(svg).toContain('<text');
    });
  });

  describe('Empty and Minimal Elements', () => {
    it('should render empty rectangle', () => {
      const ast = parse('[] @(10,20)');
      const svg = render(ast);
      
      expect(svg).toContain('<rect');
    });

    it('should render element without text', () => {
      const ast = parse('[""] @(10,20) w=50 h=30');
      const svg = render(ast);
      
      expect(svg).toContain('width="50"');
      expect(svg).toContain('height="30"');
    });
  });

  describe('Border and Styling Edge Cases', () => {
    it('should render zero border width', () => {
      const ast = parse('["No Border"] @(10,20) s=0');
      const svg = render(ast);
      
      expect(svg).toContain('stroke-width="0"');
    });

    it('should render very thick border', () => {
      const ast = parse('["Thick Border"] @(10,20) s=10');
      const svg = render(ast);
      
      expect(svg).toContain('stroke-width="10"');
    });

    it('should render element with all attributes', () => {
      const ast = parse('["Full"] @(10,20) w=200 h=100 c=red bg=blue b=green s=3 size=16 bold italic align=c note="Test note"');
      const svg = render(ast);
      
      expect(svg).toContain('width="200"');
      expect(svg).toContain('height="100"');
      expect(svg).toContain('fill="blue"');
      expect(svg).toContain('fill="red"');
      expect(svg).toContain('stroke="green"');
      expect(svg).toContain('stroke-width="3"');
      expect(svg).toContain('font-size="16"');
      expect(svg).toContain('font-weight="bold"');
      expect(svg).toContain('font-style="italic"');
      expect(svg).toContain('text-anchor="middle"');
    });
  });

  describe('Large Documents', () => {
    it('should render document with many elements', () => {
      let code = '';
      for (let i = 0; i < 50; i++) {
        code += `["Element ${i}"] @(${i * 10},${(i % 5) * 60})\n`;
      }
      const ast = parse(code);
      const svg = render(ast);
      
      expect(svg).toContain('Element 0');
      expect(svg).toContain('Element 49');
    });

    it('should render document with many notes', () => {
      let code = '';
      for (let i = 0; i < 20; i++) {
        code += `["Note ${i}"] @(${i * 50},20) note="This is note ${i}"\n`;
      }
      const ast = parse(code);
      const svg = render(ast);
      
      expect(svg).toContain('note-badge');
      expect(svg).toContain('note-card');
      expect(svg).toContain('This is note 0');
      expect(svg).toContain('This is note 19');
    });
  });

  describe('Table with Notes', () => {
    it('should render table with note on table element', () => {
      const ast = parse(`## @(10,20) w=300 border=1 note="Table description"
  # bg=#eee
    "Header 1"
    "Header 2"
  #
    "Cell 1"
    "Cell 2"`);
      const svg = render(ast);
      
      expect(svg).toContain('Table description');
    });

    it('should render table cells with individual notes', () => {
      const ast = parse(`## @(10,20) w=300 border=1
  # bg=#eee
    "ID" note="Unique identifier"
    "Name" note="User name"
  #
    "1"
    "John"`);
      const svg = render(ast);
      
      expect(svg).toContain('Unique identifier');
      expect(svg).toContain('User name');
    });
  });
});
