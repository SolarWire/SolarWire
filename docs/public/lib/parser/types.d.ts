export interface AbsoluteCoordinate {
    type: 'absolute';
    value: number;
}
export interface RelativeCoordinate {
    type: 'relative';
    value: number;
}
export interface EdgeCoordinate {
    type: 'edge';
    direction: 'L' | 'R' | 'T' | 'B' | 'C';
    value: number;
}
export type Coordinate = AbsoluteCoordinate | RelativeCoordinate | EdgeCoordinate;
export interface RelativeEndCoordinate {
    type: 'relative';
    dx: number;
    dy: number;
}
export type CoordinateExpression = {
    x: Coordinate;
    y: Coordinate;
};
export interface SourceLocation {
    line: number;
    column?: number;
}
export interface BaseElement {
    type: string;
    attributes: Record<string, string>;
    coordinates?: CoordinateExpression;
    children?: BaseElement[];
    location?: SourceLocation;
}
export interface RectangleElement extends BaseElement {
    type: 'rectangle';
    text?: string;
}
export interface RoundedRectangleElement extends BaseElement {
    type: 'rounded-rectangle';
    text?: string;
}
export interface CircleElement extends BaseElement {
    type: 'circle';
    text?: string;
}
export interface TextElement extends BaseElement {
    type: 'text';
    text: string;
}
export interface PlaceholderElement extends BaseElement {
    type: 'placeholder';
    text?: string;
}
export interface ImageElement extends BaseElement {
    type: 'image';
    url: string;
}
export interface LineElement extends BaseElement {
    type: 'line';
    label?: string;
    start: CoordinateExpression;
    end: CoordinateExpression | RelativeEndCoordinate;
}
export interface TableElement extends BaseElement {
    type: 'table';
    children: TableRowElement[];
}
export interface TableRowElement extends BaseElement {
    type: 'table-row';
    children: BaseElement[];
}
export type Element = RectangleElement | RoundedRectangleElement | CircleElement | TextElement | PlaceholderElement | ImageElement | LineElement | TableElement | TableRowElement;
export interface DocumentDeclaration {
    key: string;
    value: string;
}
export interface Document {
    declarations: DocumentDeclaration[];
    elements: Element[];
}
