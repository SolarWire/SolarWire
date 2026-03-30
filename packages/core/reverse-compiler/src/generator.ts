import {
  UIElement,
  UITree,
  ConversionOptions,
  ConversionResult,
  ConversionError,
  ConversionWarning,
  UIElementType,
} from './types';
import { analyzeLayout, detectGridLayout } from './analyzer';

const DEFAULT_OPTIONS: ConversionOptions = {
  includeNotes: true,
  includePositions: true,
  preserveTextContent: true,
  simplifyLayout: true,
  targetWidth: 800,
};

export function generateSolarWire(
  tree: UITree,
  options: ConversionOptions = {}
): ConversionResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const errors: ConversionError[] = [];
  const warnings: ConversionWarning[] = [];

  try {
    const analysisResult = analyzeLayout([tree.root], {
      targetWidth: opts.targetWidth,
      simplifyLayout: opts.simplifyLayout,
    });

    const gridInfo = detectGridLayout(analysisResult.elements);

    let code: string;

    if (gridInfo.isGrid && tree.root.type === 'container') {
      code = generateTableLayout(tree.root, gridInfo, opts, warnings);
    } else {
      code = generateElementCode(tree.root, opts, 0, warnings);
    }

    return {
      success: true,
      code: code.trim(),
      warnings: warnings.length > 0 ? warnings : undefined,
      elements: analysisResult.elements,
    };
  } catch (error) {
    const err = error as Error;
    errors.push({
      code: 'GENERATION_ERROR',
      message: err.message,
    });

    return {
      success: false,
      errors,
    };
  }
}

function generateElementCode(
  element: UIElement,
  options: ConversionOptions,
  indent: number,
  warnings: ConversionWarning[]
): string {
  const indentStr = '  '.repeat(indent);
  let code = '';

  switch (element.type) {
    case 'button':
      code = generateButtonElement(element, options, indentStr);
      break;
    case 'input':
      code = generateInputElement(element, options, indentStr);
      break;
    case 'text':
      code = generateTextElement(element, options, indentStr);
      break;
    case 'textarea':
      code = generateTextareaElement(element, options, indentStr);
      break;
    case 'checkbox':
      code = generateCheckboxElement(element, options, indentStr);
      break;
    case 'radio':
      code = generateRadioElement(element, options, indentStr);
      break;
    case 'select':
      code = generateSelectElement(element, options, indentStr);
      break;
    case 'image':
      code = generateImageElement(element, options, indentStr);
      break;
    case 'link':
      code = generateLinkElement(element, options, indentStr);
      break;
    case 'container':
      code = generateContainerElement(element, options, indent, warnings);
      break;
    case 'table':
      code = generateTableElement(element, options, indent, warnings);
      break;
    case 'table-row':
      code = generateTableRowElement(element, options, indent, warnings);
      break;
    case 'table-cell':
      code = generateTableCellElement(element, options, indentStr);
      break;
    case 'divider':
      code = generateDividerElement(element, options, indentStr);
      break;
    default:
      warnings.push({
        code: 'UNKNOWN_ELEMENT_TYPE',
        message: `Unknown element type: ${element.type}, treating as container`,
        element,
      });
      code = generateContainerElement(element, options, indent, warnings);
  }

  return code;
}

function generateButtonElement(
  element: UIElement,
  options: ConversionOptions,
  indentStr: string
): string {
  const text = options.preserveTextContent ? (element.text || 'Button') : 'Button';
  const attrs = generateAttributes(element, options);

  return `${indentStr}[${escapeText(text)}]${attrs}`;
}

function generateInputElement(
  element: UIElement,
  options: ConversionOptions,
  indentStr: string
): string {
  const placeholder = element.attributes.placeholder || element.text || 'Input';
  const attrs = generateAttributes(element, options);

  return `${indentStr}[?${escapeText(placeholder)}]${attrs}`;
}

function generateTextElement(
  element: UIElement,
  options: ConversionOptions,
  indentStr: string
): string {
  const text = options.preserveTextContent ? (element.text || 'Text') : 'Text';
  const attrs = generateAttributes(element, options, true);

  return `${indentStr}"${escapeText(text)}"${attrs}`;
}

function generateTextareaElement(
  element: UIElement,
  options: ConversionOptions,
  indentStr: string
): string {
  const text = options.preserveTextContent ? (element.text || 'Textarea') : 'Textarea';
  const attrs = generateAttributes(element, options);

  return `${indentStr}[${escapeText(text)}]${attrs}`;
}

function generateCheckboxElement(
  element: UIElement,
  options: ConversionOptions,
  indentStr: string
): string {
  const text = options.preserveTextContent ? (element.text || 'Checkbox') : 'Checkbox';
  const attrs = generateAttributes(element, options);

  return `${indentStr}[☑ ${escapeText(text)}]${attrs}`;
}

function generateRadioElement(
  element: UIElement,
  options: ConversionOptions,
  indentStr: string
): string {
  const text = options.preserveTextContent ? (element.text || 'Radio') : 'Radio';
  const attrs = generateAttributes(element, options);

  return `${indentStr}[○ ${escapeText(text)}]${attrs}`;
}

function generateSelectElement(
  element: UIElement,
  options: ConversionOptions,
  indentStr: string
): string {
  const text = options.preserveTextContent ? (element.text || 'Select') : 'Select';
  const attrs = generateAttributes(element, options);

  return `${indentStr}[▼ ${escapeText(text)}]${attrs}`;
}

function generateImageElement(
  element: UIElement,
  options: ConversionOptions,
  indentStr: string
): string {
  const alt = element.attributes.alt || 'Image';
  const attrs = generateAttributes(element, options);

  return `${indentStr}[🖼 ${escapeText(alt)}]${attrs}`;
}

function generateLinkElement(
  element: UIElement,
  options: ConversionOptions,
  indentStr: string
): string {
  const text = options.preserveTextContent ? (element.text || 'Link') : 'Link';
  const attrs = generateAttributes(element, options, true);

  return `${indentStr}"${escapeText(text)}"${attrs}`;
}

function generateContainerElement(
  element: UIElement,
  options: ConversionOptions,
  indent: number,
  warnings: ConversionWarning[]
): string {
  const indentStr = '  '.repeat(indent);
  const attrs = generateAttributes(element, options);
  const note = options.includeNotes && element.note ? ` note="${escapeText(element.note)}"` : '';

  let code = `${indentStr}[Container]${attrs}${note}`;

  if (element.children && element.children.length > 0) {
    for (const child of element.children) {
      const childCode = generateElementCode(child, options, indent + 1, warnings);
      if (childCode) {
        code += `\n${childCode}`;
      }
    }
  }

  return code;
}

function generateTableElement(
  element: UIElement,
  options: ConversionOptions,
  indent: number,
  warnings: ConversionWarning[]
): string {
  const indentStr = '  '.repeat(indent);
  const attrs = generateAttributes(element, options);

  let code = `${indentStr}##${attrs}`;

  if (element.children && element.children.length > 0) {
    for (const child of element.children) {
      const childCode = generateElementCode(child, options, indent + 1, warnings);
      if (childCode) {
        code += `\n${childCode}`;
      }
    }
  }

  return code;
}

function generateTableLayout(
  container: UIElement,
  gridInfo: { columns: number; rows: number },
  options: ConversionOptions,
  warnings: ConversionWarning[]
): string {
  const attrs = generateAttributes(container, options);
  let code = `##${attrs}`;

  if (container.children && container.children.length > 0) {
    const rows = groupElementsByRows(container.children);

    for (const row of rows) {
      code += `\n  #`;

      for (const cell of row) {
        const cellCode = generateElementCode(cell, options, 2, warnings);
        if (cellCode) {
          code += `\n${cellCode}`;
        }
      }
    }
  }

  return code;
}

function groupElementsByRows(elements: UIElement[]): UIElement[][] {
  if (elements.length === 0) return [];

  const sorted = [...elements].sort((a, b) => a.position.y - b.position.y);
  const rows: UIElement[][] = [];
  let currentRow: UIElement[] = [sorted[0]];
  let currentY = sorted[0].position.y;

  for (let i = 1; i < sorted.length; i++) {
    const element = sorted[i];
    const yDiff = Math.abs(element.position.y - currentY);

    if (yDiff < 10) {
      currentRow.push(element);
    } else {
      rows.push(currentRow.sort((a, b) => a.position.x - b.position.x));
      currentRow = [element];
      currentY = element.position.y;
    }
  }

  if (currentRow.length > 0) {
    rows.push(currentRow.sort((a, b) => a.position.x - b.position.x));
  }

  return rows;
}

function generateTableRowElement(
  element: UIElement,
  options: ConversionOptions,
  indent: number,
  warnings: ConversionWarning[]
): string {
  const indentStr = '  '.repeat(indent);
  let code = `${indentStr}#`;

  if (element.children && element.children.length > 0) {
    for (const child of element.children) {
      const childCode = generateElementCode(child, options, indent + 1, warnings);
      if (childCode) {
        code += `\n${childCode}`;
      }
    }
  }

  return code;
}

function generateTableCellElement(
  element: UIElement,
  options: ConversionOptions,
  indentStr: string
): string {
  const text = options.preserveTextContent ? (element.text || '') : '';
  const attrs = generateAttributes(element, options, true);

  if (text) {
    return `${indentStr}"${escapeText(text)}"${attrs}`;
  }

  return `${indentStr}""`;
}

function generateDividerElement(
  element: UIElement,
  options: ConversionOptions,
  indentStr: string
): string {
  const attrs = generateAttributes(element, options);

  return `${indentStr}---${attrs}`;
}

function generateAttributes(
  element: UIElement,
  options: ConversionOptions,
  isText: boolean = false
): string {
  const attrs: string[] = [];

  if (options.includePositions && element.position) {
    const pos = element.position;
    if (pos.x !== 0 || pos.y !== 0) {
      attrs.push(`@(${pos.x},${pos.y})`);
    }
  }

  if (!isText) {
    if (element.position.width && element.position.width !== 100) {
      attrs.push(`w=${element.position.width}`);
    }
    if (element.position.height && element.position.height !== 40) {
      attrs.push(`h=${element.position.height}`);
    }
  }

  if (element.styles) {
    if (element.styles.backgroundColor) {
      attrs.push(`bg=${element.styles.backgroundColor}`);
    }
    if (element.styles.color) {
      attrs.push(`c=${element.styles.color}`);
    }
    if (element.styles.borderColor) {
      attrs.push(`b=${element.styles.borderColor}`);
    }
    if (element.styles.borderRadius && element.styles.borderRadius > 0) {
      attrs.push(`r=${element.styles.borderRadius}`);
    }
  }

  if (options.includeNotes && element.note) {
    attrs.push(`note="${escapeText(element.note)}"`);
  }

  if (attrs.length === 0) {
    return '';
  }

  const hasPosition = attrs.some(a => a.startsWith('@'));
  const otherAttrs = attrs.filter(a => !a.startsWith('@'));

  if (hasPosition && otherAttrs.length > 0) {
    return ` ${attrs[0]} ${otherAttrs.join(' ')}`;
  }

  return ` ${attrs.join(' ')}`;
}

function escapeText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n');
}

export function generateFromElements(
  elements: UIElement[],
  options: ConversionOptions = {}
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const warnings: ConversionWarning[] = [];

  return elements
    .map(el => generateElementCode(el, opts, 0, warnings))
    .filter(code => code.length > 0)
    .join('\n');
}
