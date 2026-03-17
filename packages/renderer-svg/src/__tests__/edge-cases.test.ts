import { parse } from '@solarwire/parser';
import { render } from '../index';

describe('SolarWire SVG Renderer - Edge Cases', () => {
  describe('Table with colspan/rowspan', () => {
    it('should render table cell with colspan', () => {
      const ast = parse('##\n#\n["Header"] colspan=2\n["Normal"]');
      const svg = render(ast);
      
      expect(svg).toContain('Header');
      expect(svg).toContain('Normal');
    });

    it('should render table cell with rowspan', () => {
      const ast = parse('##\n#\n["Header"] rowspan=2\n["Normal"]\n#\n["Other"]');
      const svg = render(ast);
      
      expect(svg).toContain('Header');
    });

    it('should render table cell with both colspan and rowspan', () => {
      const ast = parse('##\n#\n["Merged"] colspan=2 rowspan=2\n["A"]\n#\n["B"]\n["C"]');
      const svg = render(ast);
      
      expect(svg).toContain('Merged');
    });
  });

  describe('Complex Note Content', () => {
    it('should render note with multi-line text', () => {
      const ast = parse('["Button"] note="First line\\nSecond line\\nThird line"');
      const svg = render(ast);
      
      expect(svg).toContain('First line');
      expect(svg).toContain('Second line');
      expect(svg).toContain('Third line');
    });

    it('should render note with list markers', () => {
      const ast = parse('["List"] note="- Item 1\\n- Item 2\\n- Item 3"');
      const svg = render(ast);
      
      expect(svg).toContain('- Item 1');
      expect(svg).toContain('- Item 2');
      expect(svg).toContain('- Item 3');
    });

    it('should render multiple notes with badges', () => {
      const ast = parse('["First"] note="First note"\n["Second"] note="Second note"\n["Third"] note="Third note"');
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
      const ast = parse('<image.png> w=100 h=80');
      const svg = render(ast);
      
      expect(svg).toContain('rect');
      expect(svg).toContain('image.png');
    });

    it('should render image with custom size', () => {
      const ast = parse('<logo.jpg> w=200 h=150');
      const svg = render(ast);
      
      expect(svg).toContain('width="200"');
      expect(svg).toContain('height="150"');
    });
  });

  describe('Icon Library', () => {
    it('should render material-icons icon', () => {
      const ast = parse('!icon "star" library=material-icons');
      const svg = render(ast);
      
      expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    });

    it('should render font-awesome icon', () => {
      const ast = parse('!icon "home" library=font-awesome');
      const svg = render(ast);
      
      expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    });

    it('should render default icon for unknown name', () => {
      const ast = parse('!icon "unknown-icon"');
      const svg = render(ast);
      
      expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    });
  });

  describe('Special Characters and Text', () => {
    it('should render text with special characters', () => {
      const ast = parse('"Special chars"');
      const svg = render(ast);
      
      expect(svg).toContain('Special chars');
    });

    it('should render very long text', () => {
      const longText = 'A'.repeat(100);
      const ast = parse(`"${longText}"`);
      const svg = render(ast);
      
      expect(svg).toContain('A');
    });

    it('should render empty text', () => {
      const ast = parse('""');
      const svg = render(ast);
      
      expect(svg).toContain('<text');
    });
  });

  describe('Empty and Minimal Elements', () => {
    it('should render empty rectangle', () => {
      const ast = parse('[]');
      const svg = render(ast);
      
      expect(svg).toContain('<rect');
    });

    it('should render minimal container', () => {
      const ast = parse('{}');
      const svg = render(ast);
      
      expect(svg).toContain('xmlns');
    });

    it('should render element without text', () => {
      const ast = parse('[""] w=50 h=30');
      const svg = render(ast);
      
      expect(svg).toContain('width="50"');
      expect(svg).toContain('height="30"');
    });
  });

  describe('Nested Containers', () => {
    it('should render deeply nested containers', () => {
      const ast = parse('{row}\n  {col}\n    ["Level 1"]\n    {row}\n      ["Level 2"]\n      ["Level 2-2"]');
      const svg = render(ast);
      
      expect(svg).toContain('Level 1');
      expect(svg).toContain('Level 2');
      expect(svg).toContain('Level 2-2');
    });

    it('should render mixed row and column containers', () => {
      const ast = parse('{row}\n  ["Left"]\n  {col}\n    ["Top Right"]\n    ["Bottom Right"]');
      const svg = render(ast);
      
      expect(svg).toContain('Left');
      expect(svg).toContain('Top Right');
      expect(svg).toContain('Bottom Right');
    });
  });

  describe('Border and Styling Edge Cases', () => {
    it('should render zero border width', () => {
      const ast = parse('["No Border"] s=0');
      const svg = render(ast);
      
      expect(svg).toContain('stroke-width="0"');
    });

    it('should render very thick border', () => {
      const ast = parse('["Thick Border"] s=10');
      const svg = render(ast);
      
      expect(svg).toContain('stroke-width="10"');
    });

    it('should render element with all attributes', () => {
      const ast = parse('["Full"] w=200 h=100 c=red bg=blue b=green s=3 size=16 bold italic align=c note="Test note"');
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
        code += `["Note ${i}"] note="This is note ${i}"\n`;
      }
      const ast = parse(code);
      const svg = render(ast);
      
      expect(svg).toContain('note-badge');
      expect(svg).toContain('note-card');
      expect(svg).toContain('This is note 0');
      expect(svg).toContain('This is note 19');
    });
  });
});
