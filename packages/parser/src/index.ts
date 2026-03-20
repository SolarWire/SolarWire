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

  elementsWithIndent.forEach((item) => {
    const { element, indent } = item;

    while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
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
