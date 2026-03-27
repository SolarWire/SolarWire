// SolarWire Parser - Browser Bundle
// This is a bundled version of the parser for browser use

let parser = null;

// Embedded parser (simplified version for browser)
function parse(input) {
  const lines = input.split('\n');
  const ast = {
    type: 'document',
    declarations: [],
    elements: []
  };
  
  let currentElement = null;
  let currentTable = null;
  let indentStack = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('//')) continue;
    
    // Declaration
    if (trimmed.startsWith('!')) {
      const match = trimmed.match(/^!(\w+)=(.+)$/);
      if (match) {
        ast.declarations.push({
          name: match[1],
          value: match[2].replace(/^["']|["']$/g, '')
        });
      }
      continue;
    }
    
    // Calculate indentation
    const indent = line.length - line.trimStart().length;
    
    // Table row
    if (trimmed.startsWith('#') && currentTable) {
      const rowMatch = trimmed.match(/^#\s*(.*)$/);
      if (rowMatch) {
        const row = {
          type: 'table-row',
          attributes: {},
          cells: []
        };
        
        // Parse row attributes
        let rest = rowMatch[1];
        const attrRegex = /(\w+)=([^\s]+)/g;
        let attrMatch;
        while ((attrMatch = attrRegex.exec(rest)) !== null) {
          row.attributes[attrMatch[1]] = attrMatch[2];
        }
        
        // Parse cells
        const cellRegex = /\[?"([^"]*)"?]?\s*/g;
        let cellMatch;
        while ((cellMatch = cellRegex.exec(rest)) !== null) {
          if (cellMatch[1]) {
            row.cells.push({
              type: 'text',
              content: cellMatch[1]
            });
          }
        }
        
        currentTable.children.push(row);
      }
      continue;
    }
    
    // Table
    if (trimmed.startsWith('##')) {
      const tableMatch = trimmed.match(/^##\s*@?\(?(\d+),\s*(\d+)\)?\s*(.*)$/);
      if (tableMatch) {
        currentTable = {
          type: 'table',
          x: parseInt(tableMatch[1]),
          y: parseInt(tableMatch[2]),
          attributes: {},
          children: []
        };
        
        // Parse table attributes
        const rest = tableMatch[3];
        const attrRegex = /(\w+)=([^\s]+)/g;
        let attrMatch;
        while ((attrMatch = attrRegex.exec(rest)) !== null) {
          currentTable.attributes[attrMatch[1]] = attrMatch[2];
        }
        
        ast.elements.push(currentTable);
      }
      continue;
    }
    
    // Line
    if (trimmed.startsWith('--')) {
      const lineMatch = trimmed.match(/^--\s*@?\(?(\d+),\s*(\d+)\)?\s*->\s*\(?\(?(\d+),\s*(\d+)\)?\)?\s*(.*)$/);
      if (lineMatch) {
        ast.elements.push({
          type: 'line',
          x1: parseInt(lineMatch[1]),
          y1: parseInt(lineMatch[2]),
          x2: parseInt(lineMatch[3]),
          y2: parseInt(lineMatch[4]),
          attributes: {}
        });
      }
      continue;
    }
    
    // Circle with text
    if (trimmed.startsWith('(("')) {
      const match = trimmed.match(/^\(\("([^"]*)"\)\)\s*@?\(?(\d+),\s*(\d+)\)?\s*(.*)$/);
      if (match) {
        const el = {
          type: 'circle',
          content: match[1],
          x: parseInt(match[2]),
          y: parseInt(match[3]),
          attributes: {}
        };
        parseAttributes(el, match[4]);
        ast.elements.push(el);
      }
      continue;
    }
    
    // Circle placeholder
    if (trimmed.startsWith('((')) {
      const match = trimmed.match(/^\(\(([^)]*)\)\)\s*@?\(?(\d+),\s*(\d+)\)?\s*(.*)$/);
      if (match) {
        const el = {
          type: 'circle',
          content: match[1],
          x: parseInt(match[2]),
          y: parseInt(match[3]),
          attributes: {}
        };
        parseAttributes(el, match[4]);
        ast.elements.push(el);
      }
      continue;
    }
    
    // Rounded rectangle with text
    if (trimmed.startsWith('("')) {
      const match = trimmed.match(/^\("([^"]*)"\)\s*@?\(?(\d+),\s*(\d+)\)?\s*(.*)$/);
      if (match) {
        const el = {
          type: 'rounded-rectangle',
          content: match[1],
          x: parseInt(match[2]),
          y: parseInt(match[3]),
          attributes: {}
        };
        parseAttributes(el, match[4]);
        ast.elements.push(el);
      }
      continue;
    }
    
    // Rectangle with placeholder
    if (trimmed.startsWith('[?')) {
      const match = trimmed.match(/^\[\?"([^"]*)"\]\s*@?\(?(\d+),\s*(\d+)\)?\s*(.*)$/);
      if (match) {
        const el = {
          type: 'placeholder',
          content: match[1],
          x: parseInt(match[2]),
          y: parseInt(match[3]),
          attributes: {}
        };
        parseAttributes(el, match[4]);
        ast.elements.push(el);
      }
      continue;
    }
    
    // Rectangle with text
    if (trimmed.startsWith('["')) {
      const match = trimmed.match(/^\["([^"]*)"\]\s*@?\(?(\d+),\s*(\d+)\)?\s*(.*)$/);
      if (match) {
        const el = {
          type: 'rectangle',
          content: match[1],
          x: parseInt(match[2]),
          y: parseInt(match[3]),
          attributes: {}
        };
        parseAttributes(el, match[4]);
        ast.elements.push(el);
      }
      continue;
    }
    
    // Plain text
    if (trimmed.startsWith('"')) {
      const match = trimmed.match(/^"([^"]*)"\s*@?\(?(\d+),\s*(\d+)\)?\s*(.*)$/);
      if (match) {
        const el = {
          type: 'text',
          content: match[1],
          x: parseInt(match[2]),
          y: parseInt(match[3]),
          attributes: {}
        };
        parseAttributes(el, match[4]);
        ast.elements.push(el);
      }
      continue;
    }
  }
  
  return ast;
}

function parseAttributes(element, attrString) {
  if (!attrString) return;
  
  // Parse note attribute (multiline)
  const noteMatch = attrString.match(/note="([^"]*(?:\n[^"]*)*)"/);
  if (noteMatch) {
    element.attributes.note = noteMatch[1];
    attrString = attrString.replace(noteMatch[0], '');
  }
  
  // Parse other attributes
  const attrRegex = /(\w+)=([^\s]+)/g;
  let match;
  while ((match = attrRegex.exec(attrString)) !== null) {
    element.attributes[match[1]] = match[2];
  }
  
  // Parse boolean attributes
  const boolAttrs = ['bold', 'italic', 'underline'];
  for (const attr of boolAttrs) {
    if (attrString.includes(attr)) {
      element.attributes[attr] = true;
    }
  }
}

export { parse };
