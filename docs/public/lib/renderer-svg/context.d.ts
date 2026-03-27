import { Coordinate, CoordinateExpression, RelativeEndCoordinate, Element, DocumentDeclaration, SourceLocation } from '@solarwire/parser';
export declare function escapeHtml(text: string): string;
export interface ErrorDetails {
    title: string;
    expected?: string;
    found?: string;
    location?: string;
    reason?: string;
    solution?: string;
}
export declare function formatRenderError(details: ErrorDetails, sourceInput: string | undefined, location: SourceLocation | undefined, contextLines?: number): string;
export declare function formatErrorWithContext(message: string, sourceInput: string | undefined, location: SourceLocation | undefined, contextLines?: number): string;
export declare function getElementLocationInfo(element: Element): string;
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
export declare function createRenderContext(declarations?: DocumentDeclaration[], sourceInput?: string): RenderContext;
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
export declare function getOpacityAttribute(attributes: Record<string, string>, key?: string, defaultValue?: number): number;
