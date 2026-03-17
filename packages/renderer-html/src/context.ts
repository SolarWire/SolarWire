import { Coordinate, CoordinateExpression, RelativeEndCoordinate, Element, DocumentDeclaration } from '@solarwire/parser';

export interface GlobalDefaults {
  device?: string;
  c?: string;
  size?: number;
  'line-height'?: number;
  gap?: number;
  bg?: string;
  r?: number;
  'icon-library'?: string;
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
}

export function createRenderContext(declarations: DocumentDeclaration[] = []): RenderContext {
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
  };
}

export function createChildContext(parentContext: RenderContext, offsetX: number, offsetY: number): RenderContext {
  return {
    offsetX: parentContext.offsetX + offsetX,
    offsetY: parentContext.offsetY + offsetY,
    lastElementBounds: null,
    isFirstElement: true,
    globalDefaults: parentContext.globalDefaults,
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
      if (context.isFirstElement || !lastBounds) {
        baseValue = 0;
      } else {
        baseValue = isX ? lastBounds.x : lastBounds.y;
      }
      baseValue += coord.value;
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
    default:
      baseValue = 0;
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
  defaultValue: 'left' | 'center' | 'right'
): 'left' | 'center' | 'right' {
  const align = attributes['align'];
  switch (align) {
    case 'l':
      return 'left';
    case 'c':
      return 'center';
    case 'r':
      return 'right';
    default:
      return defaultValue;
  }
}

export function getStyleAttribute(
  attributes: Record<string, string>
): { borderStyle?: string } {
  const style = attributes['style'];
  switch (style) {
    case 'dashed':
      return { borderStyle: 'dashed' };
    case 'dotted':
      return { borderStyle: 'dotted' };
    default:
      return {};
  }
}
