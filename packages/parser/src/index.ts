import type { Document } from './types';

export type {
  Document,
  Element,
  DocumentDeclaration,
  BaseElement,
  RectangleElement,
  RoundedRectangleElement,
  CircleElement,
  TextElement,
  IconElement,
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

export function parse(input: string): Document {
  if (!parser) {
    throw new Error(
      'Parser not generated. Please run: npm run build'
    );
  }

  try {
    return parser.parse(input);
  } catch (e: any) {
    const error = new Error(
      `Parse error at line ${e.location?.start?.line}, column ${e.location?.start?.column}: ${e.message}`
    );
    (error as any).location = e.location;
    throw error;
  }
}
