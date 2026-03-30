import { UIStyles, UIPosition } from './types';

export interface StyleExtractionOptions {
  inheritStyles?: boolean;
  computeLayout?: boolean;
  normalizeColors?: boolean;
}

export function extractStyles(
  element: unknown,
  options: StyleExtractionOptions = {}
): UIStyles {
  if (!element || typeof element !== 'object') {
    return {};
  }

  const el = element as Record<string, unknown>;
  const styles: UIStyles = {};

  const computedStyle = el.style || el.computedStyle || el.styles || {};
  const styleObj = typeof computedStyle === 'object' ? computedStyle as Record<string, unknown> : {};

  extractColors(styleObj, styles, options.normalizeColors);
  extractDimensions(styleObj, styles);
  extractTypography(styleObj, styles);
  extractSpacing(styleObj, styles);
  extractBorders(styleObj, styles);
  extractOpacity(styleObj, styles);

  return styles;
}

function extractColors(
  style: Record<string, unknown>,
  result: UIStyles,
  normalize: boolean = true
): void {
  const backgroundColor = style.backgroundColor || style['background-color'] || style.background;
  if (typeof backgroundColor === 'string') {
    result.backgroundColor = normalize ? normalizeColor(backgroundColor) : backgroundColor;
  }

  const color = style.color || style.textColor || style['text-color'];
  if (typeof color === 'string') {
    result.color = normalize ? normalizeColor(color) : color;
  }

  const borderColor = style.borderColor || style['border-color'];
  if (typeof borderColor === 'string') {
    result.borderColor = normalize ? normalizeColor(borderColor) : borderColor;
  }
}

function extractDimensions(
  style: Record<string, unknown>,
  result: UIStyles
): void {
  const width = style.width;
  if (typeof width === 'number') {
    result.width = width;
  } else if (typeof width === 'string') {
    const parsed = parsePixelValue(width);
    if (parsed !== null) {
      result.width = parsed;
    }
  }

  const height = style.height;
  if (typeof height === 'number') {
    result.height = height;
  } else if (typeof height === 'string') {
    const parsed = parsePixelValue(height);
    if (parsed !== null) {
      result.height = parsed;
    }
  }
}

function extractTypography(
  style: Record<string, unknown>,
  result: UIStyles
): void {
  const fontSize = style.fontSize || style['font-size'];
  if (typeof fontSize === 'number') {
    result.fontSize = fontSize;
  } else if (typeof fontSize === 'string') {
    const parsed = parsePixelValue(fontSize);
    if (parsed !== null) {
      result.fontSize = parsed;
    }
  }

  const fontWeight = style.fontWeight || style['font-weight'];
  if (typeof fontWeight === 'string' || typeof fontWeight === 'number') {
    const weight = String(fontWeight);
    if (weight === 'bold' || weight === '700' || parseInt(weight) >= 700) {
      result.fontWeight = 'bold';
    } else {
      result.fontWeight = 'normal';
    }
  }

  const fontStyle = style.fontStyle || style['font-style'];
  if (typeof fontStyle === 'string') {
    result.fontStyle = fontStyle === 'italic' ? 'italic' : 'normal';
  }

  const textAlign = style.textAlign || style['text-align'];
  if (typeof textAlign === 'string') {
    if (textAlign === 'left' || textAlign === 'center' || textAlign === 'right') {
      result.textAlign = textAlign;
    }
  }
}

function extractSpacing(
  style: Record<string, unknown>,
  result: UIStyles
): void {
  const padding = style.padding;
  if (typeof padding === 'number') {
    result.padding = padding;
  } else if (typeof padding === 'string') {
    const parsed = parsePixelValue(padding);
    if (parsed !== null) {
      result.padding = parsed;
    }
  }

  const margin = style.margin;
  if (typeof margin === 'number') {
    result.margin = margin;
  } else if (typeof margin === 'string') {
    const parsed = parsePixelValue(margin);
    if (parsed !== null) {
      result.margin = parsed;
    }
  }
}

function extractBorders(
  style: Record<string, unknown>,
  result: UIStyles
): void {
  const borderWidth = style.borderWidth || style['border-width'] || style.border;
  if (typeof borderWidth === 'number') {
    result.borderWidth = borderWidth;
  } else if (typeof borderWidth === 'string') {
    const parsed = parsePixelValue(borderWidth);
    if (parsed !== null) {
      result.borderWidth = parsed;
    }
  }

  const borderRadius = style.borderRadius || style['border-radius'];
  if (typeof borderRadius === 'number') {
    result.borderRadius = borderRadius;
  } else if (typeof borderRadius === 'string') {
    const parsed = parsePixelValue(borderRadius);
    if (parsed !== null) {
      result.borderRadius = parsed;
    }
  }
}

function extractOpacity(
  style: Record<string, unknown>,
  result: UIStyles
): void {
  const opacity = style.opacity;
  if (typeof opacity === 'number') {
    result.opacity = Math.max(0, Math.min(1, opacity));
  } else if (typeof opacity === 'string') {
    const parsed = parseFloat(opacity);
    if (!isNaN(parsed)) {
      result.opacity = Math.max(0, Math.min(1, parsed));
    }
  }
}

export function extractPosition(element: unknown): UIPosition {
  if (!element || typeof element !== 'object') {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  const el = element as Record<string, unknown>;

  const x = extractNumberValue(el, ['x', 'left', 'offsetLeft']) || 0;
  const y = extractNumberValue(el, ['y', 'top', 'offsetTop']) || 0;
  const width = extractNumberValue(el, ['width', 'offsetWidth', 'clientWidth']) || 100;
  const height = extractNumberValue(el, ['height', 'offsetHeight', 'clientHeight']) || 40;

  return { x, y, width, height };
}

function extractNumberValue(
  obj: Record<string, unknown>,
  keys: string[]
): number | null {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string') {
      const parsed = parsePixelValue(value);
      if (parsed !== null) {
        return parsed;
      }
    }
  }
  return null;
}

function parsePixelValue(value: string): number | null {
  const match = value.match(/^([\d.]+)(px)?$/);
  if (match) {
    const num = parseFloat(match[1]);
    return isNaN(num) ? null : num;
  }
  return null;
}

function normalizeColor(color: string): string {
  const trimmed = color.trim().toLowerCase();

  if (trimmed === 'transparent') {
    return 'transparent';
  }

  if (trimmed.startsWith('#')) {
    return normalizeHexColor(trimmed);
  }

  if (trimmed.startsWith('rgb')) {
    return normalizeRgbColor(trimmed);
  }

  const namedColor = CSS_COLOR_NAMES[trimmed];
  if (namedColor) {
    return namedColor;
  }

  return color;
}

function normalizeHexColor(hex: string): string {
  if (hex.length === 4) {
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  return hex;
}

function normalizeRgbColor(rgb: string): string {
  const match = rgb.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)/i);
  if (match) {
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    const a = match[4] ? parseFloat(match[4]) : 1;

    if (a === 1) {
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    return rgb;
  }
  return rgb;
}

const CSS_COLOR_NAMES: Record<string, string> = {
  'white': '#ffffff',
  'black': '#000000',
  'red': '#ff0000',
  'green': '#008000',
  'blue': '#0000ff',
  'yellow': '#ffff00',
  'cyan': '#00ffff',
  'magenta': '#ff00ff',
  'gray': '#808080',
  'grey': '#808080',
  'silver': '#c0c0c0',
  'maroon': '#800000',
  'olive': '#808000',
  'lime': '#00ff00',
  'aqua': '#00ffff',
  'teal': '#008080',
  'navy': '#000080',
  'fuchsia': '#ff00ff',
  'purple': '#800080',
  'orange': '#ffa500',
  'pink': '#ffc0cb',
  'transparent': 'transparent',
};

export function mergeStyles(base: UIStyles, override: UIStyles): UIStyles {
  return { ...base, ...override };
}

export function computeInheritedStyles(
  parentStyles: UIStyles,
  childStyles: UIStyles
): UIStyles {
  const inherited: UIStyles = {};

  if (!childStyles.color && parentStyles.color) {
    inherited.color = parentStyles.color;
  }
  if (!childStyles.fontSize && parentStyles.fontSize) {
    inherited.fontSize = parentStyles.fontSize;
  }
  if (!childStyles.fontWeight && parentStyles.fontWeight) {
    inherited.fontWeight = parentStyles.fontWeight;
  }
  if (!childStyles.fontStyle && parentStyles.fontStyle) {
    inherited.fontStyle = parentStyles.fontStyle;
  }
  if (!childStyles.textAlign && parentStyles.textAlign) {
    inherited.textAlign = parentStyles.textAlign;
  }

  return { ...inherited, ...childStyles };
}
