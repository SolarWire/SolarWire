import { Coordinate, CoordinateExpression, RelativeEndCoordinate, DocumentDeclaration } from '@solarwire/parser';
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
}
export declare function createRenderContext(declarations?: DocumentDeclaration[]): RenderContext;
export declare function createChildContext(parentContext: RenderContext, offsetX: number, offsetY: number): RenderContext;
export declare function updateLastElementBounds(context: RenderContext, bounds: ElementBounds): void;
export interface AbsolutePosition {
    x: number;
    y: number;
}
export declare function calculateCoordinate(context: RenderContext, coord: Coordinate, isX: boolean, lastBounds: ElementBounds | null): number;
export declare function calculatePosition(context: RenderContext, coords: CoordinateExpression): AbsolutePosition;
export declare function calculateLineEnd(context: RenderContext, start: AbsolutePosition, end: CoordinateExpression | RelativeEndCoordinate): AbsolutePosition;
export declare function getNumberAttribute(attributes: Record<string, string>, globalDefaults: GlobalDefaults, key: string, defaultValue: number): number;
export declare function getColorAttribute(attributes: Record<string, string>, globalDefaults: GlobalDefaults, key: string, defaultValue: string): string;
export declare function getBooleanAttribute(attributes: Record<string, string>, globalDefaults: GlobalDefaults, key: string): boolean;
export declare function getAlignAttribute(attributes: Record<string, string>, defaultValue: 'start' | 'middle' | 'end'): 'start' | 'middle' | 'end';
export declare function getStyleAttribute(attributes: Record<string, string>): {
    strokeDasharray?: string;
};
