import { RectangleElement, RoundedRectangleElement } from '@solarwire/parser';
import { RenderContext, ElementBounds } from '../context';
export interface RenderResult {
    svg: string;
    bounds: ElementBounds;
}
export declare function renderRectangle(element: RectangleElement | RoundedRectangleElement, context: RenderContext): RenderResult;
