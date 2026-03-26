import { Document, Element } from '@solarwire/parser';
import { RenderContext, ElementBounds } from './context';
import { RenderResult } from './elements/rectangle';
interface NoteInfo {
    number: number;
    note: string;
    bounds: ElementBounds;
}
interface RenderOptions {
    disableNotes?: boolean;
    notes?: NoteInfo[];
    noteNumberRef?: {
        current: number;
    };
}
export declare function renderElement(element: Element, context: RenderContext, options?: RenderOptions): RenderResult;
export declare function render(ast: Document, options?: {
    disableNotes?: boolean;
}): string;
export {};
