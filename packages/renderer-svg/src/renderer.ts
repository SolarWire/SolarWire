import { Document, Element } from '@solarwire/parser';
import { createRenderContext, RenderContext, ElementBounds } from './context';
import { renderRectangle, RenderResult } from './elements/rectangle';
import { renderCircle, renderText, renderPlaceholder, renderImage, renderTable } from './elements/otherElements';
import { renderLine, renderContainer } from './elements/lineAndContainer';

function wrapText(text: string, maxWidth: number, fontSize: number = 12): string[] {
  const lines: string[] = [];
  const avgCharWidth = fontSize * 0.65;
  const cjkCharWidth = fontSize * 1.0;
  const isCJK = (char: string) => /[\u4e00-\u9fa5\u3400-\u4dbf\u3040-\u30ff\u31f0-\u31ff\uac00-\ud7af]/.test(char);
  
  const getCharWidth = (char: string): number => {
    return isCJK(char) ? cjkCharWidth : avgCharWidth;
  };
  
  text.split('\n').forEach(paragraph => {
    if (paragraph.trim() === '') {
      lines.push('');
      return;
    }
    
    let currentLine = '';
    let currentWidth = 0;
    let i = 0;
    
    while (i < paragraph.length) {
      const char = paragraph[i];
      
      if (char === ' ' || char === '\t') {
        currentLine += char;
        currentWidth += avgCharWidth;
        i++;
        continue;
      }
      
      let token = '';
      let tokenWidth = 0;
      
      if (isCJK(char)) {
        token = char;
        tokenWidth = cjkCharWidth;
        i++;
      } else {
        let j = i;
        while (j < paragraph.length && !isCJK(paragraph[j]) && paragraph[j] !== ' ' && paragraph[j] !== '\t') {
          token += paragraph[j];
          tokenWidth += avgCharWidth;
          j++;
        }
        i = j;
      }
      
      if (currentWidth + tokenWidth <= maxWidth || currentLine === '') {
        currentLine += token;
        currentWidth += tokenWidth;
      } else {
        if (tokenWidth > maxWidth) {
          if (currentLine.trim() !== '') {
            lines.push(currentLine.trim());
          }
          
          let remainingToken = token;
          while (remainingToken.length > 0) {
            let part = '';
            let partWidth = 0;
            let k = 0;
            
            while (k < remainingToken.length) {
              const charWidth = getCharWidth(remainingToken[k]);
              if (partWidth + charWidth > maxWidth && part.length > 0) {
                break;
              }
              part += remainingToken[k];
              partWidth += charWidth;
              k++;
            }
            
            if (k >= remainingToken.length) {
              currentLine = part;
              currentWidth = partWidth;
              remainingToken = '';
            } else {
              lines.push(part);
              remainingToken = remainingToken.substring(k);
            }
          }
        } else {
          lines.push(currentLine.trim());
          currentLine = token;
          currentWidth = tokenWidth;
        }
      }
    }
    
    if (currentLine.trim()) {
      lines.push(currentLine.trim());
    }
  });
  
  return lines;
}

export function renderElement(element: Element, context: RenderContext): RenderResult {
  switch (element.type) {
    case 'rectangle':
    case 'rounded-rectangle':
      return renderRectangle(element, context);
    case 'circle':
      return renderCircle(element, context);
    case 'text':
      return renderText(element, context);
    case 'placeholder':
      return renderPlaceholder(element, context);
    case 'image':
      return renderImage(element, context);
    case 'line':
      return renderLine(element, context);
    case 'row':
    case 'col':
      return renderContainer(element, context, renderElement);
    case 'table':
    case 'table-row':
      return renderTable(element, context, renderElement);
    default:
      throw new Error(`Unknown element type: ${(element as any).type}`);
  }
}

interface NoteInfo {
  number: number;
  note: string;
  bounds: ElementBounds;
}

export function render(ast: Document, options?: { disableNotes?: boolean }): string {
  const context = createRenderContext(ast.declarations);
  const svgParts: string[] = [];
  let minX = Infinity;
  let minY = Infinity;
  let maxX = 0;
  let maxY = 0;
  const elementResults: RenderResult[] = [];
  const notes: NoteInfo[] = [];
  let noteNumber = 1;
  const disableNotes = options?.disableNotes ?? false;
  
  ast.elements.forEach(element => {
    const result = renderElement(element, context);
    elementResults.push(result);
    minX = Math.min(minX, result.bounds.x);
    minY = Math.min(minY, result.bounds.y);
    maxX = Math.max(maxX, result.bounds.x + result.bounds.width);
    maxY = Math.max(maxY, result.bounds.y + result.bounds.height);
    
    if (!disableNotes && element.attributes && element.attributes.note) {
      notes.push({
        number: noteNumber,
        note: element.attributes.note,
        bounds: result.bounds
      });
      noteNumber++;
    }
  });
  
  const margin = 20;
  const viewBoxX = minX - margin;
  const viewBoxY = minY - margin;
  const viewBoxWidth = maxX - minX + margin * 2;
  
  let notesAreaHeight = 0;
  const extraNoteSpacing = 20;
  if (!disableNotes && notes.length > 0) {
    const cardMargin = 10;
    const cardsPerRow = 2;
    const lineHeight = 22;
    const cardPadding = 12;
    const cardWidth = (viewBoxWidth - margin * 2 - 10) / 2;
    
    const cardHeights = notes.map(note => {
      const lines = wrapText(note.note, cardWidth - 28 - 12, 12);
      const contentHeight = lines.length * lineHeight;
      return Math.max(60, contentHeight + cardPadding * 2);
    });
    
    const rowMaxHeights: number[] = [];
    notes.forEach((_, index) => {
      const row = Math.floor(index / cardsPerRow);
      if (!rowMaxHeights[row]) rowMaxHeights[row] = 0;
      rowMaxHeights[row] = Math.max(rowMaxHeights[row], cardHeights[index]);
    });
    
    const totalRowHeight = rowMaxHeights.reduce((sum, height) => sum + height, 0);
    const rows = rowMaxHeights.length;
    notesAreaHeight = totalRowHeight + (rows + 1) * cardMargin + extraNoteSpacing;
  }
  
  const viewBoxHeight = maxY - minY + margin * 2 + notesAreaHeight;
  
  svgParts.push(`<?xml version="1.0" encoding="UTF-8"?>`);
  svgParts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}" width="${viewBoxWidth}" height="${viewBoxHeight}">`);
  svgParts.push(`<style>`);
  svgParts.push(`  text { font-family: Arial, sans-serif; }`);
  if (!disableNotes) {
    svgParts.push(`  .note-badge { fill: #70B603; }`);
    svgParts.push(`  .note-badge-text { fill: white; font-size: 12px; font-weight: bold; }`);
    svgParts.push(`  .note-card { fill: #f8f9fa; stroke: #dee2e6; stroke-width: 1; }`);
    svgParts.push(`  .note-card-text { fill: #333; font-size: 12px; line-height: 22px; }`);
    svgParts.push(`  .note-card-badge { fill: #70B603; }`);
    svgParts.push(`  .note-card-badge-text { fill: white; font-size: 10px; font-weight: bold; }`);
  }
  svgParts.push(`</style>`);
  
  elementResults.forEach(result => {
    svgParts.push(result.svg);
  });
  
  if (!disableNotes) {
    notes.forEach(note => {
      const badgeX = note.bounds.x + note.bounds.width - 8;
      const badgeY = note.bounds.y - 8;
      const badgeRadius = 10;
      
      svgParts.push(`  <defs>`);
      svgParts.push(`    <filter id="badge-shadow-${note.number}" x="-50%" y="-50%" width="200%" height="200%">`);
      svgParts.push(`      <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="black" flood-opacity="0.7"/>`);
      svgParts.push(`    </filter>`);
      svgParts.push(`  </defs>`);
      
      svgParts.push(`  <path d="M${badgeX} ${badgeY - badgeRadius} C${badgeX + badgeRadius} ${badgeY - badgeRadius} ${badgeX + badgeRadius} ${badgeY + badgeRadius * 0.5} ${badgeX} ${badgeY + badgeRadius * 1.5} C${badgeX - badgeRadius} ${badgeY + badgeRadius * 0.5} ${badgeX - badgeRadius} ${badgeY - badgeRadius} ${badgeX} ${badgeY - badgeRadius} Z" fill="#70B603" stroke="white" stroke-width="1" filter="url(#badge-shadow-${note.number})"/>`);
      svgParts.push(`  <text x="${badgeX}" y="${badgeY + 2}" text-anchor="middle" class="note-badge-text">${note.number}</text>`);
    });
    
    if (notes.length > 0) {
      const notesY = maxY + margin + extraNoteSpacing;
      const cardWidth = (viewBoxWidth - margin * 2 - 10) / 2;
      const cardMargin = 10;
      const cardsPerRow = 2;
      const lineHeight = 22;
      const cardPadding = 12;
      
      const cardHeights = notes.map(note => {
        const lines = wrapText(note.note, cardWidth - 28 - 12, 12);
        const contentHeight = lines.length * lineHeight;
        return Math.max(60, contentHeight + cardPadding * 2);
      });
      
      const rowMaxHeights: number[] = [];
      notes.forEach((_, index) => {
        const row = Math.floor(index / cardsPerRow);
        if (!rowMaxHeights[row]) rowMaxHeights[row] = 0;
        rowMaxHeights[row] = Math.max(rowMaxHeights[row], cardHeights[index]);
      });
      
      const rowStartYs: number[] = [0];
      for (let row = 1; row < rowMaxHeights.length; row++) {
        rowStartYs[row] = rowStartYs[row - 1] + rowMaxHeights[row - 1] + cardMargin;
      }
      
      notes.forEach((note, index) => {
        const col = index % cardsPerRow;
        const row = Math.floor(index / cardsPerRow);
        const cardX = viewBoxX + margin + col * (cardWidth + cardMargin);
        const cardY = notesY + cardMargin + rowStartYs[row];
        const cardHeight = cardHeights[index];
        
        svgParts.push(`  <rect x="${cardX}" y="${cardY}" width="${cardWidth}" height="${cardHeight}" rx="8" class="note-card"/>`);
        
        const badgeX = cardX + 12;
        const badgeY = cardY + 12;
        const badgeRadius = 8;
        
        svgParts.push(`  <defs>`);
        svgParts.push(`    <filter id="card-badge-shadow-${index}" x="-50%" y="-50%" width="200%" height="200%">`);
        svgParts.push(`      <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="black" flood-opacity="0.7"/>`);
        svgParts.push(`    </filter>`);
        svgParts.push(`  </defs>`);
        
        svgParts.push(`  <circle cx="${badgeX}" cy="${badgeY}" r="${badgeRadius}" fill="#70B603" stroke="white" stroke-width="1" filter="url(#card-badge-shadow-${index})"/>`);
        svgParts.push(`  <text x="${badgeX}" y="${badgeY + 3}" text-anchor="middle" class="note-card-badge-text">${note.number}</text>`);
        
        const textX = cardX + 28;
        const textY = cardY + cardPadding;
        svgParts.push(`  <text x="${textX}" y="${textY}" fill="#333" font-size="12" dominant-baseline="hanging">`);
        
        const lines = wrapText(note.note, cardWidth - 28 - 12, 12);
        
        lines.forEach((line, lineIndex) => {
          if (lineIndex === 0) {
            svgParts.push(`    <tspan x="${textX}">${line}</tspan>`);
          } else {
            svgParts.push(`    <tspan x="${textX}" dy="22">${line}</tspan>`);
          }
        });
        
        svgParts.push(`  </text>`);
      });
    }
  }
  
  svgParts.push('</svg>');
  
  return svgParts.join('\n');
}
