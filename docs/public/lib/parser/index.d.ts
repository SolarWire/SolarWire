import type { Document } from './types';
export type { Document, Element, DocumentDeclaration, BaseElement, RectangleElement, RoundedRectangleElement, CircleElement, TextElement, PlaceholderElement, ImageElement, LineElement, TableElement, TableRowElement, Coordinate, AbsoluteCoordinate, RelativeCoordinate, EdgeCoordinate, CoordinateExpression, RelativeEndCoordinate, SourceLocation, } from './types';
export declare function parse(input: string): Document;
