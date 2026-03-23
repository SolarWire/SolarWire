import type { Document, Element } from './types';

export type {
  Document,
  Element,
  DocumentDeclaration,
  BaseElement,
  RectangleElement,
  RoundedRectangleElement,
  CircleElement,
  TextElement,
  PlaceholderElement,
  ImageElement,
  LineElement,
  RowContainer,
  ColContainer,
  TableElement,
  TableRowElement,
  Coordinate,
  AbsoluteCoordinate,
  RelativeCoordinate,
  EdgeCoordinate,
  CoordinateExpression,
  RelativeEndCoordinate,
} from './types';

let parser: any = null;

try {
  parser = require('./parser');
} catch {
  console.warn(
    'Parser not generated. Please run: npm run build'
  );
}

function isContainer(type: string): boolean {
  return ['row', 'col', 'table', 'table-row'].indexOf(type) !== -1;
}

function buildNestedStructure(elementsWithIndent: any[]): Element[] {
  const result: Element[] = [];
  const stack: any[] = [];
  let lastTableRowIndent: number | null = null;
  let lastTableIndent: number | null = null;

  elementsWithIndent.forEach((item, index) => {
    const { element, indent } = item;

    while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
      const popped = stack.pop();
      if (popped.element.type === 'table-row') {
        lastTableRowIndent = null;
      }
      if (popped.element.type === 'table') {
        lastTableIndent = null;
      }
    }

    if (element.type === 'table-row') {
      if (lastTableIndent === null || indent <= lastTableIndent) {
        throw new Error(`Table-row element at position ${index + 1} must be indented more than the table element`);
      }
    }

    if (lastTableRowIndent !== null && indent <= lastTableRowIndent) {
      throw new Error(`Table cell element at position ${index + 1} must be indented more than the table-row element`);
    }

    if (stack.length === 0) {
      result.push(element);
    } else {
      const parent = stack[stack.length - 1].element;
      if (isContainer(parent.type)) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(element);
      }
    }

    if (isContainer(element.type)) {
      stack.push({ element, indent });
      if (element.type === 'table-row') {
        lastTableRowIndent = indent;
      }
      if (element.type === 'table') {
        lastTableIndent = indent;
      }
    }
  });

  return result;
}

function calculateIndent(line: string): number {
  let indent = 0;
  while (indent < line.length && (line[indent] === ' ' || line[indent] === '\t')) {
    indent++;
  }
  return indent;
}

function isBlankLine(line: string): boolean {
  return line.trim() === '';
}

function isCommentLine(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.startsWith('//');
}

function isDeclarationLine(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.startsWith('!');
}

export function parse(input: string): Document {
  if (!parser) {
    throw new Error(
      'Parser not generated. Please run: npm run build'
    );
  }

  try {
    const rawResult = parser.parse(input);
    const lines = input.split(/\r?\n/);
    const elementLines: string[] = [];

    lines.forEach((line) => {
      if (!isBlankLine(line) && !isCommentLine(line) && !isDeclarationLine(line)) {
        elementLines.push(line);
      }
    });

    const elementsWithIndent: any[] = [];
    let elementIndex = 0;

    rawResult.elements.forEach((element: Element) => {
      if (elementIndex < elementLines.length) {
        const line = elementLines[elementIndex];
        const indent = calculateIndent(line);
        elementsWithIndent.push({ element, indent });
        elementIndex++;
      }
    });

    return {
      declarations: rawResult.declarations,
      elements: buildNestedStructure(elementsWithIndent)
    };
  } catch (e: any) {
    const error = new Error(
      `Parse error at line ${e.location?.start?.line}, column ${e.location?.start?.column}: ${e.message}`
    );
    (error as any).location = e.location;
    throw error;
  }
}
