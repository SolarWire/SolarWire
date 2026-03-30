import { convertJSXToSolarWire, parseJSX } from '../adapters/jsx';

describe('JSX Adapter', () => {
  describe('convertJSXToSolarWire', () => {
    it('should convert simple JSX button', () => {
      const jsx = '<button>Click me</button>';
      const result = convertJSXToSolarWire(jsx);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('Click me');
    });

    it('should convert JSX input', () => {
      const jsx = '<input type="text" placeholder="Enter name" />';
      const result = convertJSXToSolarWire(jsx);
      
      expect(result.success).toBe(true);
    });

    it('should convert JSX with className', () => {
      const jsx = '<button className="btn-primary">Submit</button>';
      const result = convertJSXToSolarWire(jsx);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('Submit');
    });

    it('should convert JSX with inline style', () => {
      const jsx = '<button style={{ backgroundColor: "red" }}>Red</button>';
      const result = convertJSXToSolarWire(jsx);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('Red');
    });

    it('should convert nested JSX elements', () => {
      const jsx = `<div><h1>Title</h1><button>Click</button></div>`;
      const result = convertJSXToSolarWire(jsx);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('Title');
      expect(result.code).toContain('Click');
    });

    it('should convert JSX checkbox', () => {
      const jsx = '<input type="checkbox" checked={true} />';
      const result = convertJSXToSolarWire(jsx);
      
      expect(result.success).toBe(true);
    });

    it('should convert JSX select', () => {
      const jsx = `<select><option>A</option><option>B</option></select>`;
      const result = convertJSXToSolarWire(jsx);
      
      expect(result.success).toBe(true);
    });

    it('should convert JSX image', () => {
      const jsx = '<img src="logo.png" alt="Logo" />';
      const result = convertJSXToSolarWire(jsx);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('Logo');
    });

    it('should convert JSX link', () => {
      const jsx = '<a href="https://example.com">Visit</a>';
      const result = convertJSXToSolarWire(jsx);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('Visit');
    });

    it('should convert JSX text elements', () => {
      const jsx = '<p>Hello World</p>';
      const result = convertJSXToSolarWire(jsx);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('Hello World');
    });

    it('should convert JSX form with multiple inputs', () => {
      const jsx = `
        <form>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <button type="submit">Submit</button>
        </form>
      `;
      const result = convertJSXToSolarWire(jsx);
      
      expect(result.success).toBe(true);
    });

    it('should handle JSX fragment-like structure', () => {
      const jsx = '<><h1>Title</h1><p>Content</p></>';
      const result = convertJSXToSolarWire(jsx);
      
      expect(result.success).toBe(true);
    });

    it('should handle empty JSX', () => {
      const jsx = '';
      const result = convertJSXToSolarWire(jsx);
      
      expect(result.success).toBe(true);
    });

    it('should handle JSX with event handlers', () => {
      const jsx = '<button onClick={handleClick}>Click</button>';
      const result = convertJSXToSolarWire(jsx);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('Click');
    });

    it('should handle JSX with boolean attributes', () => {
      const jsx = '<input type="text" disabled required />';
      const result = convertJSXToSolarWire(jsx);
      
      expect(result.success).toBe(true);
    });
  });

  describe('parseJSX', () => {
    it('should parse JSX to UITree', () => {
      const jsx = '<button>Test</button>';
      const tree = parseJSX(jsx);
      
      expect(tree.root).toBeDefined();
      expect(tree.metadata.source).toBe('jsx');
    });

    it('should handle nested elements', () => {
      const jsx = '<div><span>Text</span></div>';
      const tree = parseJSX(jsx);
      
      expect(tree.root.children.length).toBeGreaterThan(0);
    });
  });
});
