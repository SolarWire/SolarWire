import { parse } from '../index';
import type {
  RectangleElement,
  TextElement,
  IconElement,
  PlaceholderElement,
  ImageElement,
  CircleElement,
  LineElement,
  RowContainer,
  ColContainer,
  TableElement,
  TableRowElement
} from '../types';

describe('SolarWire Parser', () => {
  describe('Basic Elements', () => {
    it('should parse a single rectangle element', () => {
      const result = parse('["Login"] w=100 c=red');
      expect(result.declarations).toEqual([]);
      expect(result.elements.length).toBe(1);
      const elem = result.elements[0] as RectangleElement;
      expect(elem.type).toBe('rectangle');
      expect(elem.text).toBe('Login');
      expect(elem.attributes).toEqual({ w: '100', c: 'red' });
    });

    it('should parse element with coordinates and attributes', () => {
      const result = parse('["User"] @(10,20) w=200 bold');
      expect(result.elements.length).toBe(1);
      const elem = result.elements[0] as RectangleElement;
      expect(elem.type).toBe('rectangle');
      expect(elem.coordinates).toEqual({
        x: { type: 'absolute', value: 10 },
        y: { type: 'absolute', value: 20 }
      });
      expect(elem.attributes).toEqual({ w: '200', bold: 'true' });
    });
  });

  describe('Document Declarations', () => {
    it('should parse document level declarations', () => {
      const result = parse('!device=phone\n!c=#333\n("Card")');
      expect(result.declarations).toEqual([
        { key: 'device', value: 'phone' },
        { key: 'c', value: '#333' }
      ]);
      expect(result.elements.length).toBe(1);
    });
  });

  describe('Multiple Elements', () => {
    it('should parse multiple elements', () => {
      const result = parse('["Login"]\n("Card")\n"Text"');
      expect(result.elements.length).toBe(3);
      expect(result.elements[0].type).toBe('rectangle');
      expect(result.elements[1].type).toBe('rounded-rectangle');
      expect(result.elements[2].type).toBe('text');
    });
  });

  describe('Coordinates', () => {
    it('should parse absolute coordinates', () => {
      const result = parse('["Test"] @(100,50)');
      const elem = result.elements[0] as RectangleElement;
      expect(elem.coordinates).toEqual({
        x: { type: 'absolute', value: 100 },
        y: { type: 'absolute', value: 50 }
      });
    });

    it('should parse relative coordinates', () => {
      const result = parse('["Test"] @(0,+30)');
      const elem = result.elements[0] as RectangleElement;
      expect(elem.coordinates).toEqual({
        x: { type: 'absolute', value: 0 },
        y: { type: 'relative', value: 30 }
      });
    });

    it('should parse edge coordinates', () => {
      const result = parse('["Test"] @(R+10, T+5)');
      const elem = result.elements[0] as RectangleElement;
      expect(elem.coordinates).toEqual({
        x: { type: 'edge', direction: 'R', value: 10 },
        y: { type: 'edge', direction: 'T', value: 5 }
      });
    });
  });

  describe('Text Elements', () => {
    it('should parse text element', () => {
      const result = parse('"Username"');
      const elem = result.elements[0] as TextElement;
      expect(elem.type).toBe('text');
      expect(elem.text).toBe('Username');
    });

    it('should parse multiline text with \\n', () => {
      const result = parse('"First line\\nSecond line"');
      const elem = result.elements[0] as TextElement;
      expect(elem.text).toBe('First line\nSecond line');
    });
  });

  describe('Containers', () => {
    it('should parse row container', () => {
      const result = parse('{row} gap=8');
      const elem = result.elements[0] as RowContainer;
      expect(elem.type).toBe('row');
      expect(elem.attributes).toEqual({ gap: '8' });
    });

    it('should parse column container', () => {
      const result = parse('{col} gap=12');
      const elem = result.elements[0] as ColContainer;
      expect(elem.type).toBe('col');
      expect(elem.attributes).toEqual({ gap: '12' });
    });

    it('should parse empty container', () => {
      const result = parse('{} gap=8');
      const elem = result.elements[0] as RowContainer;
      expect(elem.type).toBe('row');
      expect(elem.attributes).toEqual({ gap: '8' });
    });
  });

  describe('Other Elements', () => {
    it('should parse icon element', () => {
      const result = parse('!icon "home"');
      const elem = result.elements[0] as IconElement;
      expect(elem.type).toBe('icon');
      expect(elem.name).toBe('home');
    });

    it('should parse placeholder element', () => {
      const result = parse('[?"Ad space"]');
      const elem = result.elements[0] as PlaceholderElement;
      expect(elem.type).toBe('placeholder');
      expect(elem.text).toBe('Ad space');
    });

    it('should parse image element', () => {
      const result = parse('<logo.png> w=32');
      const elem = result.elements[0] as ImageElement;
      expect(elem.type).toBe('image');
      expect(elem.url).toBe('logo.png');
      expect(elem.attributes).toEqual({ w: '32' });
    });

    it('should parse circle element', () => {
      const result = parse('(("Avatar"))');
      const elem = result.elements[0] as CircleElement;
      expect(elem.type).toBe('circle');
      expect(elem.text).toBe('Avatar');
    });

    it('should parse table element', () => {
      const result = parse('## border=1');
      const elem = result.elements[0] as TableElement;
      expect(elem.type).toBe('table');
      expect(elem.attributes).toEqual({ border: '1' });
    });

    it('should parse table row element', () => {
      const result = parse('# bg=#eee');
      const elem = result.elements[0] as TableRowElement;
      expect(elem.type).toBe('table-row');
      expect(elem.attributes).toEqual({ bg: '#eee' });
    });
  });

  describe('Line Elements', () => {
    it('should parse line without label', () => {
      const result = parse('-- @(10,10)->(100,10)');
      const elem = result.elements[0] as LineElement;
      expect(elem.type).toBe('line');
      expect(elem.start).toEqual({
        x: { type: 'absolute', value: 10 },
        y: { type: 'absolute', value: 10 }
      });
      expect(elem.end).toEqual({
        x: { type: 'absolute', value: 100 },
        y: { type: 'absolute', value: 10 }
      });
    });

    it('should parse line with label', () => {
      const result = parse('--"connect"-- @(10,10)->(100,20)');
      const elem = result.elements[0] as LineElement;
      expect(elem.type).toBe('line');
      expect(elem.label).toBe('connect');
    });

    it('should parse line with relative end', () => {
      const result = parse('-- @(10,10)->(+50,+20)');
      const elem = result.elements[0] as LineElement;
      expect(elem.type).toBe('line');
      expect(elem.end).toEqual({
        type: 'relative',
        dx: 50,
        dy: 20
      });
    });
  });

  describe('Comments', () => {
    it('should ignore comments', () => {
      const result = parse('["Login"] // This is a comment\n// Another comment\n("Card")');
      expect(result.elements.length).toBe(2);
      expect(result.elements[0].type).toBe('rectangle');
      expect(result.elements[1].type).toBe('rounded-rectangle');
    });
  });
});
