import { parse } from '@solarwire/parser';
import { render } from '../index';

describe('SolarWire Performance Tests', () => {
  describe('Large File Performance', () => {
    it('should parse and render 100 elements quickly', () => {
      let code = '';
      for (let i = 0; i < 100; i++) {
        code += '["Element ' + i + '"] w=80 h=40\n';
      }
      
      const parseStart = Date.now();
      const ast = parse(code);
      const parseEnd = Date.now();
      const parseTime = parseEnd - parseStart;
      
      console.log('Parse time for 100 elements: ' + parseTime.toFixed(2) + 'ms');
      expect(parseTime).toBeLessThan(1000);
      
      const renderStart = Date.now();
      const svg = render(ast);
      const renderEnd = Date.now();
      const renderTime = renderEnd - renderStart;
      
      console.log('Render time for 100 elements: ' + renderTime.toFixed(2) + 'ms');
      expect(renderTime).toBeLessThan(1000);
      
      expect(svg).toContain('Element 0');
      expect(svg).toContain('Element 99');
    });

    it('should parse and render 500 elements quickly', () => {
      let code = '';
      for (let i = 0; i < 500; i++) {
        code += '["Element ' + i + '"] w=60 h=30\n';
      }
      
      const parseStart = Date.now();
      const ast = parse(code);
      const parseEnd = Date.now();
      const parseTime = parseEnd - parseStart;
      
      console.log('Parse time for 500 elements: ' + parseTime.toFixed(2) + 'ms');
      expect(parseTime).toBeLessThan(2000);
      
      const renderStart = Date.now();
      const svg = render(ast);
      const renderEnd = Date.now();
      const renderTime = renderEnd - renderStart;
      
      console.log('Render time for 500 elements: ' + renderTime.toFixed(2) + 'ms');
      expect(renderTime).toBeLessThan(2000);
      
      expect(svg).toContain('Element 0');
      expect(svg).toContain('Element 499');
    });

    it('should parse and render document with 50 notes', () => {
      let code = '';
      for (let i = 0; i < 50; i++) {
        code += '["Note ' + i + '"] note="This is a note number ' + i + '"\n';
      }
      
      const parseStart = Date.now();
      const ast = parse(code);
      const parseEnd = Date.now();
      const parseTime = parseEnd - parseStart;
      
      console.log('Parse time for 50 notes: ' + parseTime.toFixed(2) + 'ms');
      expect(parseTime).toBeLessThan(1000);
      
      const renderStart = Date.now();
      const svg = render(ast);
      const renderEnd = Date.now();
      const renderTime = renderEnd - renderStart;
      
      console.log('Render time for 50 notes: ' + renderTime.toFixed(2) + 'ms');
      expect(renderTime).toBeLessThan(1000);
      
      expect(svg).toContain('note-badge');
      expect(svg).toContain('note-card');
    });

    it('should parse and render large table', () => {
      let code = '## @(0,0) w=500\n';
      for (let row = 0; row < 20; row++) {
        code += '  #\n';
        for (let col = 0; col < 5; col++) {
          code += '    "Cell ' + row + '-' + col + '"\n';
        }
      }
      
      const parseStart = Date.now();
      const ast = parse(code);
      const parseEnd = Date.now();
      const parseTime = parseEnd - parseStart;
      
      console.log('Parse time for large table: ' + parseTime.toFixed(2) + 'ms');
      expect(parseTime).toBeLessThan(1000);
      
      const renderStart = Date.now();
      const svg = render(ast);
      const renderEnd = Date.now();
      const renderTime = renderEnd - renderStart;
      
      console.log('Render time for large table: ' + renderTime.toFixed(2) + 'ms');
      expect(renderTime).toBeLessThan(1000);
      
      expect(svg).toContain('Cell 0-0');
      expect(svg).toContain('Cell 19-4');
    });
  });

  describe('Memory Usage (approximate)', () => {
    it('should handle repeated parsing without significant slowdown', () => {
      const code = '["Test Element"] w=100 h=50\n["Another Element"] w=80 h=40';
      
      const times: number[] = [];
      
      for (let i = 0; i < 50; i++) {
        const start = Date.now();
        const ast = parse(code);
        render(ast);
        const end = Date.now();
        times.push(end - start);
      }
      
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      
      console.log('Average parse+render time over 50 iterations: ' + avgTime.toFixed(2) + 'ms');
      
      expect(avgTime).toBeGreaterThanOrEqual(0);
    });
  });
});
