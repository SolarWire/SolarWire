import { Document, Element } from '@solarwire/parser';
import { RenderContext, ElementBounds } from './context';
import { RenderResult } from './elements/rectangle';
interface NoteInfo {
    number: number;
    note: string;
    bounds: ElementBounds;
}
interface InternalRenderOptions {
    disableNotes?: boolean;
    sourceInput?: string;
    notes?: NoteInfo[];
    noteNumberRef?: {
        current: number;
    };
}
export declare function renderElement(element: Element, context: RenderContext, options?: InternalRenderOptions): RenderResult;
export interface RenderOptions {
    disableNotes?: boolean;
    sourceInput?: string;
}
export declare function render(ast: Document, options?: RenderOptions): string;
export {};
