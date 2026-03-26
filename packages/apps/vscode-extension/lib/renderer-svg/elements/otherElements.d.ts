import { CircleElement, TextElement, PlaceholderElement, ImageElement, TableElement, TableRowElement, Element } from '@solarwire/parser';
import { RenderContext } from '../context';
import { RenderResult } from './rectangle';
export declare function renderCircle(element: CircleElement, context: RenderContext): RenderResult;
export declare function renderText(element: TextElement, context: RenderContext): RenderResult;
export declare function renderPlaceholder(element: PlaceholderElement, context: RenderContext): RenderResult;
export declare function renderImage(element: ImageElement, context: RenderContext): RenderResult;
export declare function renderTable(element: TableElement | TableRowElement, context: RenderContext, renderChild: (child: Element, childContext: RenderContext) => RenderResult): RenderResult;
