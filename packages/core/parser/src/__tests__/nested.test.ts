import { parse } from '../index';
import type { TableElement, TableRowElement } from '../types';

describe('Nested Elements', () => {
  it('should parse table with rows and cells', () => {
    const result = parse('##\n  #\n    ["列1"]\n    ["列2"]\n  #\n    "数据1"\n    "数据2"');
    expect(result.elements.length).toBe(1);
    
    const table = result.elements[0] as TableElement;
    expect(table.type).toBe('table');
    expect(table.children).toHaveLength(2);
    
    const row1 = table.children[0] as TableRowElement;
    expect(row1.type).toBe('table-row');
    expect(row1.children).toHaveLength(2);
    
    const row2 = table.children[1] as TableRowElement;
    expect(row2.type).toBe('table-row');
    expect(row2.children).toHaveLength(2);
  });

  it('should parse table with multiple rows', () => {
    const result = parse('## @(0,0) w=400\n  #\n    "A"\n    "B"\n  #\n    "C"\n    "D"');
    expect(result.elements.length).toBe(1);
    
    const table = result.elements[0] as TableElement;
    expect(table.type).toBe('table');
    expect(table.children).toHaveLength(2);
  });
});
