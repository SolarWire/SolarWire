import { detectElementType, detectAllElements } from '../detector';
import type { UIElement } from '../types';

describe('Element Detector', () => {
  describe('detectElementType', () => {
    it('should detect button from button tag', () => {
      const element = { tagName: 'BUTTON' };
      const result = detectElementType(element);
      expect(result.type).toBe('button');
    });

    it('should detect button from input type submit', () => {
      const element = { tagName: 'INPUT', type: 'submit' };
      const result = detectElementType(element);
      expect(result.type).toBe('button');
    });

    it('should detect input from input tag', () => {
      const element = { tagName: 'INPUT', type: 'text' };
      const result = detectElementType(element);
      expect(result.type).toBe('input');
    });

    it('should detect checkbox from input type checkbox', () => {
      const element = { tagName: 'INPUT', type: 'checkbox' };
      const result = detectElementType(element);
      expect(result.type).toBe('checkbox');
    });

    it('should detect radio from input type radio', () => {
      const element = { tagName: 'INPUT', type: 'radio' };
      const result = detectElementType(element);
      expect(result.type).toBe('radio');
    });

    it('should detect select from select tag', () => {
      const element = { tagName: 'SELECT' };
      const result = detectElementType(element);
      expect(result.type).toBe('select');
    });

    it('should detect textarea from textarea tag', () => {
      const element = { tagName: 'TEXTAREA' };
      const result = detectElementType(element);
      expect(result.type).toBe('textarea');
    });

    it('should detect image from img tag', () => {
      const element = { tagName: 'IMG' };
      const result = detectElementType(element);
      expect(result.type).toBe('image');
    });

    it('should detect link from a tag', () => {
      const element = { tagName: 'A', href: 'https://example.com' };
      const result = detectElementType(element);
      expect(result.type).toBe('link');
    });

    it('should detect table from table tag', () => {
      const element = { tagName: 'TABLE' };
      const result = detectElementType(element);
      expect(result.type).toBe('table');
    });

    it('should detect text from p tag', () => {
      const element = { tagName: 'P' };
      const result = detectElementType(element);
      expect(result.type).toBe('text');
    });

    it('should detect text from span tag', () => {
      const element = { tagName: 'SPAN' };
      const result = detectElementType(element);
      expect(result.type).toBe('text');
    });

    it('should detect text from h1-h6 tags', () => {
      ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].forEach(tag => {
        const element = { tagName: tag };
        const result = detectElementType(element);
        expect(result.type).toBe('text');
      });
    });

    it('should detect container from div tag', () => {
      const element = { tagName: 'DIV' };
      const result = detectElementType(element);
      expect(result.type).toBe('container');
    });

    it('should detect container from section tag', () => {
      const element = { tagName: 'SECTION' };
      const result = detectElementType(element);
      expect(result.type).toBe('container');
    });

    it('should detect divider from hr tag', () => {
      const element = { tagName: 'HR' };
      const result = detectElementType(element);
      expect(result.type).toBe('divider');
    });

    it('should return unknown for unrecognized tags', () => {
      const element = { tagName: 'CUSTOM-ELEMENT' };
      const result = detectElementType(element);
      expect(result.type).toBe('unknown');
    });

    it('should return unknown for invalid input', () => {
      expect(detectElementType(null).type).toBe('unknown');
      expect(detectElementType(undefined).type).toBe('unknown');
      expect(detectElementType('string').type).toBe('unknown');
    });

    it('should detect button from role attribute', () => {
      const element = { tagName: 'DIV', role: 'button' };
      const result = detectElementType(element);
      expect(result.type).toBe('button');
    });

    it('should detect table-row from tr tag', () => {
      const element = { tagName: 'TR' };
      const result = detectElementType(element);
      expect(result.type).toBe('table-row');
    });

    it('should detect table-cell from td tag', () => {
      const element = { tagName: 'TD' };
      const result = detectElementType(element);
      expect(result.type).toBe('table-cell');
    });

    it('should detect table-cell from th tag', () => {
      const element = { tagName: 'TH' };
      const result = detectElementType(element);
      expect(result.type).toBe('table-cell');
    });
  });

  describe('detectAllElements', () => {
    const createMockElement = (type: string, children: UIElement[] = []): UIElement => ({
      type: type as any,
      position: { x: 0, y: 0, width: 100, height: 40 },
      styles: {},
      attributes: {},
      children,
    });

    it('should traverse and detect all elements', () => {
      const tree = createMockElement('container', [
        createMockElement('button'),
        createMockElement('text'),
      ]);

      const results = detectAllElements(tree);
      expect(results.length).toBe(3);
    });

    it('should handle empty tree', () => {
      const tree = createMockElement('container');
      const results = detectAllElements(tree);
      expect(results.length).toBe(1);
    });
  });
});
