function preprocess(input) {
  const lines = input.split(/\r?\n/);
  const result = [];
  const stack = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    if (trimmed === '' || trimmed.startsWith('//')) {
      result.push(line);
      continue;
    }
    
    const indentMatch = line.match(/^([ \t]*)/);
    const indent = indentMatch ? indentMatch[1] : '';
    const indentLevel = indent.length;
    
    while (stack.length > 0 && stack[stack.length - 1].level >= indentLevel) {
      stack.pop();
    }
    
    const isContainer = 
      trimmed.startsWith('{row}') || 
      trimmed.startsWith('{col}') || 
      trimmed.startsWith('{}') ||
      trimmed.startsWith('##') ||
      trimmed.startsWith('#');
      
    if (isContainer) {
      stack.push({ level: indentLevel, lineIndex: result.length });
    }
    
    result.push(line);
  }
  
  return result.join('\n');
}

function buildNestingTree(input) {
  const lines = input.split(/\r?\n/);
  const elements = [];
  const stack = [{ children: elements, level: -1 }];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    if (trimmed === '' || trimmed.startsWith('//')) {
      continue;
    }
    
    const indentMatch = line.match(/^([ \t]*)/);
    const indent = indentMatch ? indentMatch[1] : '';
    const indentLevel = indent.length;
    
    while (stack.length > 1 && stack[stack.length - 1].level >= indentLevel) {
      stack.pop();
    }
    
    const currentParent = stack[stack.length - 1];
    const element = { 
      line: trimmed, 
      lineIndex: i, 
      indentLevel, 
      children: [] 
    };
    
    currentParent.children.push(element);
    
    const isContainer = 
      trimmed.startsWith('{row}') || 
      trimmed.startsWith('{col}') || 
      trimmed.startsWith('{}') ||
      trimmed.startsWith('##') ||
      trimmed.startsWith('#');
      
    if (isContainer) {
      stack.push(element);
    }
  }
  
  return elements;
}

module.exports = { preprocess, buildNestingTree };
