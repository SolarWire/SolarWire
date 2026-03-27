import { Coordinate, CoordinateExpression, RelativeEndCoordinate, Element, DocumentDeclaration, SourceLocation } from '@solarwire/parser';

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export interface ErrorDetails {
  title: string;
  expected?: string;
  found?: string;
  location?: string;
  reason?: string;
  solution?: string;
}

export function formatRenderError(
  details: ErrorDetails,
  sourceInput: string | undefined,
  location: SourceLocation | undefined,
  contextLines: number = 3
): string {
  let result = '═'.repeat(60) + '\n';
  result += '  RENDER ERROR\n';
  result += '═'.repeat(60) + '\n\n';
  result += `  ${details.title}\n\n`;
  
  if (details.expected || details.found) {
    if (details.expected) {
      result += `  Expected: ${details.expected}\n`;
    }
    if (details.found) {
      result += `  Found:    ${details.found}\n`;
    }
    result += '\n';
  }
  
  if (details.location) {
    result += `  Position: ${details.location}\n\n`;
  }
  
  if (details.reason) {
    result += `  Reason: ${details.reason}\n\n`;
  }
  
  if (details.solution) {
    result += `  Solution: ${details.solution}\n`;
  }
  
  if (!sourceInput || !location) {
    return result;
  }
  
  const lines = sourceInput.split(/\r?\n/);
  const lineNum = location.line;
  const columnNum = location.column || 1;
  
  const startLine = Math.max(0, lineNum - contextLines - 1);
  const endLine = Math.min(lines.length, lineNum + contextLines);
  
  const maxLineNumWidth = Math.max(
    String(startLine + 1).length,
    String(endLine).length,
    4
  );
  
  result += '\n' + '─'.repeat(60) + '\n';
  result += '  Context:\n';
  result += '─'.repeat(60) + '\n';
  
  for (let i = startLine; i < endLine; i++) {
    const currentLineNum = i + 1;
    const isErrorLine = i === lineNum - 1;
    const lineContent = lines[i] || '';
    
    if (isErrorLine) {
      result += `>>> ${currentLineNum.toString().padStart(maxLineNumWidth, ' ')} | ${lineContent}\n`;
      const pointerOffset = columnNum > 0 ? columnNum - 1 : 0;
      const spaces = ' '.repeat(5 + maxLineNumWidth + 3 + pointerOffset);
      result += `${spaces}^\n`;
      result += `${spaces}| HERE\n`;
    } else {
      result += `    ${currentLineNum.toString().padStart(maxLineNumWidth, ' ')} | ${lineContent}\n`;
    }
  }
  
  result += '─'.repeat(60) + '\n';
  
  return result;
}

export function formatErrorWithContext(
  message: string,
  sourceInput: string | undefined,
  location: SourceLocation | undefined,
  contextLines: number = 3
): string {
  let result = message;
  
  if (!sourceInput || !location) {
    return result;
  }
  
  const lines = sourceInput.split(/\r?\n/);
  const lineNum = location.line;
  const columnNum = location.column || 1;
  
  const startLine = Math.max(0, lineNum - contextLines - 1);
  const endLine = Math.min(lines.length, lineNum + contextLines);
  
  const maxLineNumWidth = Math.max(
    String(startLine + 1).length,
    String(endLine).length,
    4
  );
  
  result += '\n\n' + '─'.repeat(60) + '\n';
  result += '  Context:\n';
  result += '─'.repeat(60) + '\n';
  
  for (let i = startLine; i < endLine; i++) {
    const currentLineNum = i + 1;
    const isErrorLine = i === lineNum - 1;
    const lineContent = lines[i] || '';
    
    if (isErrorLine) {
      result += `>>> ${currentLineNum.toString().padStart(maxLineNumWidth, ' ')} | ${lineContent}\n`;
      const pointerOffset = columnNum > 0 ? columnNum - 1 : 0;
      const spaces = ' '.repeat(5 + maxLineNumWidth + 3 + pointerOffset);
      result += `${spaces}^\n`;
      result += `${spaces}| HERE\n`;
    } else {
      result += `    ${currentLineNum.toString().padStart(maxLineNumWidth, ' ')} | ${lineContent}\n`;
    }
  }
  
  result += '─'.repeat(60) + '\n';
  
  return result;
}

export function getElementLocationInfo(element: Element): string {
  if (element.location) {
    return `line ${element.location.line}`;
  }
  if (element.coordinates) {
    const x = element.coordinates.x.type === 'absolute' 
      ? element.coordinates.x.value 
      : 'relative';
    const y = element.coordinates.y.type === 'absolute' 
      ? element.coordinates.y.value 
      : 'relative';
    return `@(${x}, ${y})`;
  }
  return 'unknown position';
}

export interface GlobalDefaults {
  c?: string;
  size?: number;
  'line-height'?: number;
  gap?: number;
  bg?: string;
  r?: number;
  bold?: boolean;
  [key: string]: string | number | boolean | undefined;
}

export interface ElementBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RenderContext {
  offsetX: number;
  offsetY: number;
  lastElementBounds: ElementBounds | null;
  isFirstElement: boolean;
  globalDefaults: GlobalDefaults;
  sourceInput?: string;
}

export function createRenderContext(declarations: DocumentDeclaration[] = [], sourceInput?: string): RenderContext {
  const globalDefaults: GlobalDefaults = {};
  
  declarations.forEach(decl => {
    const { key, value } = decl;
    if (['size', 'line-height', 'gap', 'r'].includes(key)) {
      globalDefaults[key] = parseFloat(value);
    } else if (key === 'bold') {
      globalDefaults[key] = true;
    } else {
      globalDefaults[key] = value;
    }
  });
  
  return {
    offsetX: 0,
    offsetY: 0,
    lastElementBounds: null,
    isFirstElement: true,
    globalDefaults,
    sourceInput,
  };
}

export function createChildContext(parentContext: RenderContext, offsetX: number, offsetY: number): RenderContext {
  return {
    offsetX: parentContext.offsetX + offsetX,
    offsetY: parentContext.offsetY + offsetY,
    lastElementBounds: null,
    isFirstElement: true,
    globalDefaults: parentContext.globalDefaults,
    sourceInput: parentContext.sourceInput,
  };
}

export function updateLastElementBounds(context: RenderContext, bounds: ElementBounds): void {
  context.lastElementBounds = bounds;
  context.isFirstElement = false;
}

export interface AbsolutePosition {
  x: number;
  y: number;
}

export function calculateCoordinate(
  context: RenderContext,
  coord: Coordinate,
  isX: boolean,
  lastBounds: ElementBounds | null
): number {
  let baseValue: number;

  switch (coord.type) {
    case 'absolute':
      baseValue = coord.value;
      break;
    case 'relative':
      baseValue = coord.value;
      break;
    case 'edge':
      if (!lastBounds) {
        baseValue = 0;
      } else {
        switch (coord.direction) {
          case 'L':
            baseValue = lastBounds.x;
            break;
          case 'R':
            baseValue = lastBounds.x + lastBounds.width;
            break;
          case 'T':
            baseValue = lastBounds.y;
            break;
          case 'B':
            baseValue = lastBounds.y + lastBounds.height;
            break;
          case 'C':
            baseValue = isX 
              ? lastBounds.x + lastBounds.width / 2 
              : lastBounds.y + lastBounds.height / 2;
            break;
          default:
            baseValue = 0;
        }
      }
      baseValue += coord.value;
      break;
    default: {
      const exhaustiveCheck: never = coord;
      throw new Error(`Unknown coordinate type: ${(exhaustiveCheck as any).type}`);
    }
  }

  return baseValue + (isX ? context.offsetX : context.offsetY);
}

export function calculatePosition(
  context: RenderContext,
  coords: CoordinateExpression
): AbsolutePosition {
  const x = calculateCoordinate(context, coords.x, true, context.lastElementBounds);
  const y = calculateCoordinate(context, coords.y, false, context.lastElementBounds);
  return { x, y };
}

export function calculateLineEnd(
  context: RenderContext,
  start: AbsolutePosition,
  end: CoordinateExpression | RelativeEndCoordinate
): AbsolutePosition {
  if ('dx' in end) {
    return {
      x: start.x + end.dx,
      y: start.y + end.dy,
    };
  } else {
    return calculatePosition(context, end);
  }
}

export function getNumberAttribute(
  attributes: Record<string, string>,
  globalDefaults: GlobalDefaults,
  key: string,
  defaultValue: number
): number {
  const localValue = attributes[key];
  if (localValue !== undefined) {
    const parsed = parseFloat(localValue);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  if (globalDefaults[key] !== undefined && typeof globalDefaults[key] === 'number') {
    return globalDefaults[key] as number;
  }
  return defaultValue;
}

export function getColorAttribute(
  attributes: Record<string, string>,
  globalDefaults: GlobalDefaults,
  key: string,
  defaultValue: string
): string {
  return attributes[key] ?? (globalDefaults[key] as string) ?? defaultValue;
}

export function getBooleanAttribute(
  attributes: Record<string, string>,
  globalDefaults: GlobalDefaults,
  key: string
): boolean {
  if (key in attributes) return true;
  if (globalDefaults[key] !== undefined) return !!globalDefaults[key];
  return false;
}

export function getAlignAttribute(
  attributes: Record<string, string>,
  defaultValue: 'start' | 'middle' | 'end'
): 'start' | 'middle' | 'end' {
  const align = attributes['align'];
  switch (align) {
    case 'l':
      return 'start';
    case 'c':
      return 'middle';
    case 'r':
      return 'end';
    default:
      return defaultValue;
  }
}

export function getStyleAttribute(
  attributes: Record<string, string>
): { strokeDasharray?: string } {
  const style = attributes['style'];
  switch (style) {
    case 'dashed':
      return { strokeDasharray: '5,5' };
    case 'dotted':
      return { strokeDasharray: '2,2' };
    default:
      return {};
  }
}

export function getOpacityAttribute(
  attributes: Record<string, string>,
  key: string = 'opacity',
  defaultValue: number = 1
): number {
  const value = attributes[key];
  if (value === undefined) return defaultValue;
  const parsed = parseFloat(value);
  if (isNaN(parsed)) return defaultValue;
  return Math.max(0, Math.min(1, parsed));
}
