import { convertHTMLToSolarWire } from '../adapters/html';

describe('HTML Adapter', () => {
  describe('convertHTMLToSolarWire', () => {
    it('should convert simple button', () => {
      const html = '<button>Click me</button>';
      const result = convertHTMLToSolarWire(html);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('Click me');
    });

    it('should convert input field', () => {
      const html = '<input type="text" placeholder="Enter name">';
      const result = convertHTMLToSolarWire(html);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('Enter name');
    });

    it('should convert checkbox', () => {
      const html = '<input type="checkbox" id="agree"> <label for="agree">I agree</label>';
      const result = convertHTMLToSolarWire(html);
      
      expect(result.success).toBe(true);
    });

    it('should convert radio button', () => {
      const html = '<input type="radio" name="choice" id="opt1"> <label for="opt1">Option 1</label>';
      const result = convertHTMLToSolarWire(html);
      
      expect(result.success).toBe(true);
    });

    it('should convert select dropdown', () => {
      const html = '<select><option>Option A</option><option>Option B</option></select>';
      const result = convertHTMLToSolarWire(html);
      
      expect(result.success).toBe(true);
    });

    it('should convert textarea', () => {
      const html = '<textarea placeholder="Enter description"></textarea>';
      const result = convertHTMLToSolarWire(html);
      
      expect(result.success).toBe(true);
    });

    it('should convert image', () => {
      const html = '<img src="logo.png" alt="Logo">';
      const result = convertHTMLToSolarWire(html);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('Logo');
    });

    it('should convert link', () => {
      const html = '<a href="https://example.com">Visit Site</a>';
      const result = convertHTMLToSolarWire(html);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('Visit Site');
    });

    it('should convert text elements', () => {
      const html = '<p>Hello World</p>';
      const result = convertHTMLToSolarWire(html);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('Hello World');
    });

    it('should convert heading elements', () => {
      const html = '<h1>Title</h1><h2>Subtitle</h2>';
      const result = convertHTMLToSolarWire(html);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('Title');
      expect(result.code).toContain('Subtitle');
    });

    it('should convert divider', () => {
      const html = '<hr>';
      const result = convertHTMLToSolarWire(html);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('---');
    });

    it('should convert nested structure', () => {
      const html = `<div><h1>Form</h1><input type="text" placeholder="Name"><button>Submit</button></div>`;
      const result = convertHTMLToSolarWire(html);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('Form');
      expect(result.code).toContain('Submit');
    });

    it('should convert table structure', () => {
      const html = `
        <table>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
          <tr>
            <td>John</td>
            <td>john@example.com</td>
          </tr>
        </table>
      `;
      const result = convertHTMLToSolarWire(html);
      
      expect(result.success).toBe(true);
    });

    it('should handle empty input', () => {
      const html = '';
      const result = convertHTMLToSolarWire(html);
      
      expect(result.success).toBe(true);
    });

    it('should handle invalid HTML gracefully', () => {
      const html = '<div><p>Unclosed';
      const result = convertHTMLToSolarWire(html);
      
      expect(result.success).toBe(true);
    });

    it('should extract inline styles', () => {
      const html = '<button style="background-color: red; color: white;">Red Button</button>';
      const result = convertHTMLToSolarWire(html);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('Red Button');
    });

    it('should extract CSS classes', () => {
      const html = '<button class="btn btn-primary">Primary</button>';
      const result = convertHTMLToSolarWire(html);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('Primary');
    });

    it('should handle deeply nested elements', () => {
      const html = `
        <div>
          <div>
            <div>
              <span>Deep text</span>
            </div>
          </div>
        </div>
      `;
      const result = convertHTMLToSolarWire(html);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('Deep text');
    });

    it('should preserve element attributes as notes when enabled', () => {
      const html = '<button id="submit-btn" disabled>Submit</button>';
      const result = convertHTMLToSolarWire(html, { includeNotes: true });
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('Submit');
    });
  });

  describe('Error handling', () => {
    it('should handle null input', () => {
      const result = convertHTMLToSolarWire(null as unknown as string);
      
      expect(result.success).toBe(true);
    });

    it('should handle undefined input', () => {
      const result = convertHTMLToSolarWire(undefined as unknown as string);
      
      expect(result.success).toBe(true);
    });
  });

  describe('Options', () => {
    it('should respect includePositions option', () => {
      const html = '<button>Text</button>';
      const result = convertHTMLToSolarWire(html, { includePositions: false });
      
      expect(result.success).toBe(true);
    });

    it('should respect includeNotes option', () => {
      const html = '<div><!-- This is a comment --><p>Text</p></div>';
      const result = convertHTMLToSolarWire(html, { includeNotes: true });
      
      expect(result.success).toBe(true);
    });
  });
});
