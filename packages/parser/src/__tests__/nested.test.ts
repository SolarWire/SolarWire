import { parse } from '../index';
import type { RowContainer, ColContainer, TableElement, TableRowElement } from '../types';

describe('Nested Elements', () => {
  it('should parse row container with children', () => {
    const result = parse('{row}\n  ["按钮1"]\n  ["按钮2"]');
    expect(result.elements.length).toBe(1);
    
    const container = result.elements[0] as RowContainer;
    expect(container.type).toBe('row');
    expect(container.children).toHaveLength(2);
    expect(container.children[0].type).toBe('rectangle');
    expect(container.children[1].type).toBe('rectangle');
  });

  it('should parse column container with children', () => {
    const result = parse('{col}\n  "项1"\n  "项2"\n  "项3"');
    expect(result.elements.length).toBe(1);
    
    const container = result.elements[0] as ColContainer;
    expect(container.type).toBe('col');
    expect(container.children).toHaveLength(3);
    expect(container.children[0].type).toBe('text');
    expect(container.children[1].type).toBe('text');
    expect(container.children[2].type).toBe('text');
  });

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

  it('should parse nested containers', () => {
    const result = parse('{col}\n  {row}\n    ["左"]\n    ["右"]\n  ["底部"]');
    expect(result.elements.length).toBe(1);
    
    const outerContainer = result.elements[0] as ColContainer;
    expect(outerContainer.type).toBe('col');
    expect(outerContainer.children).toHaveLength(2);
    
    const innerContainer = outerContainer.children[0] as RowContainer;
    expect(innerContainer.type).toBe('row');
    expect(innerContainer.children).toHaveLength(2);
  });
});
