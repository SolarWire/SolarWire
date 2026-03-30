import { generateSolarWire, generateFromElements } from '../generator';
import type { UIElement, UITree, UIStyles, UIPosition } from '../types';

describe('Code Generator', () => {
  const defaultPosition: UIPosition = { x: 0, y: 0, width: 100, height: 40 };
  const defaultStyles: UIStyles = {
    color: undefined,
    backgroundColor: undefined,
    width: undefined,
    height: undefined,
    fontSize: undefined,
    fontWeight: undefined,
    borderRadius: undefined,
    borderColor: undefined,
    padding: undefined,
    margin: undefined,
  };

  function createElement(overrides: Partial<UIElement>): UIElement {
    return {
      type: 'container',
      position: defaultPosition,
      styles: defaultStyles,
      attributes: {},
      children: [],
      ...overrides
    };
  }

  function createTree(root: UIElement): UITree {
    return {
      root,
      metadata: {
        source: 'html',
        createdAt: new Date(),
      },
    };
  }

  describe('generateSolarWire', () => {
    it('should generate button element', () => {
      const element = createElement({ type: 'button', text: 'Click me' });
      const tree = createTree(element);
      const result = generateSolarWire(tree);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('["Click me"]');
    });

    it('should generate input element', () => {
      const element = createElement({
        type: 'input',
        attributes: { placeholder: 'Enter name' }
      });
      const tree = createTree(element);
      const result = generateSolarWire(tree);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('[?"Enter name"]');
    });
    it('should generate text element', () => {
      const element = createElement({ type: 'text', text: 'Hello World' });
      const tree = createTree(element);
      const result = generateSolarWire(tree);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('"Hello World"');
    });
    it('should generate checkbox element', () => {
      const element = createElement({ type: 'checkbox', text: 'I agree' });
      const tree = createTree(element);
      const result = generateSolarWire(tree);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('[☑ "I agree"]');
    });
    it('should generate radio element', () => {
      const element = createElement({ type: 'radio', text: 'Option 1' });
      const tree = createTree(element);
      const result = generateSolarWire(tree);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('[○ "Option 1"]');
    });
    it('should generate select element', () => {
      const element = createElement({ type: 'select', text: 'Choose' });
      const tree = createTree(element);
      const result = generateSolarWire(tree);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('[▼ "Choose"]');
    });
    it('should generate image element', () => {
      const element = createElement({
        type: 'image',
        attributes: { alt: 'Logo' }
      });
      const tree = createTree(element);
      const result = generateSolarWire(tree);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('[🖼 "Logo"]');
    });
    it('should generate link element', () => {
      const element = createElement({ type: 'link', text: 'Click here' });
      const tree = createTree(element);
      const result = generateSolarWire(tree);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('"Click here"');
    });
    it('should generate divider element', () => {
      const element = createElement({ type: 'divider' });
      const tree = createTree(element);
      const result = generateSolarWire(tree);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('---');
    });
    it('should generate container with children', () => {
      const element = createElement({
        type: 'container',
        children: [
          createElement({ type: 'text', text: 'Inside container' })
        ]
      });
      const tree = createTree(element);
      const result = generateSolarWire(tree);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('[Container]');
      expect(result.code).toContain('"Inside container"');
    });
    it('should generate table element', () => {
      const element = createElement({ type: 'table' });
      const tree = createTree(element);
      const result = generateSolarWire(tree);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('##');
    });
    it('should handle errors gracefully', () => {
      const element = createElement({ type: 'button' });
      const tree = createTree(element);
      const result = generateSolarWire(tree);
      
      expect(result.success).toBe(true);
    });
  });
  describe('generateFromElements', () => {
    it('should generate code for multiple elements', () => {
      const elements: UIElement[] = [
        createElement({ type: 'button', text: 'Submit' }),
        createElement({ type: 'text', text: 'Hello' })
      ];
      const result = generateFromElements(elements);
      
      expect(result).toContain('["Submit"]');
      expect(result).toContain('"Hello"');
    });
    it('should handle empty elements array', () => {
      const result = generateFromElements([]);
      expect(result).toBe('');
    });
  });
  describe('Attributes generation', () => {
    it('should include width attribute', () => {
      const element = createElement({
        type: 'button',
        text: 'Submit',
        position: { ...defaultPosition, width: 200 }
      });
      const tree = createTree(element);
      const result = generateSolarWire(tree);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('w=200');
    });
    it('should include background color', () => {
      const element = createElement({
        type: 'button',
        text: 'Red Button',
        styles: { ...defaultStyles, backgroundColor: '#ff0000' }
      });
      const tree = createTree(element);
      const result = generateSolarWire(tree);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('bg=#ff0000');
    });
    it('should include position when not at origin', () => {
      const element = createElement({
        type: 'button',
        text: 'Positioned',
        position: { x: 100, y: 50, width: 100, height: 40 }
      });
      const tree = createTree(element);
      const result = generateSolarWire(tree);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('@(100,50)');
    });
  });
});
