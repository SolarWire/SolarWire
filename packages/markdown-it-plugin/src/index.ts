import type MarkdownIt from 'markdown-it';
import type { Renderer, Token } from 'markdown-it';
import { parse } from '@solarwire/parser';
import { render } from '@solarwire/renderer-svg';

export interface SolarWirePluginOptions {
  className?: string;
  wrapInFigure?: boolean;
  onError?: (error: Error, code: string) => void;
}

const defaultOptions: SolarWirePluginOptions = {
  className: 'solarwire',
  wrapInFigure: false,
};

export default function solarwirePlugin(
  md: MarkdownIt,
  options: SolarWirePluginOptions = {}
): void {
  const opts = { ...defaultOptions, ...options };

  function renderSolarwire(tokens: Token[], idx: number): string {
    const token = tokens[idx];
    const code = token.content.trim();

    try {
      const ast = parse(code);
      const svg = render(ast);
      
      if (opts.wrapInFigure) {
        return `<figure class="${opts.className}">${svg}</figure>`;
      }
      
      return `<div class="${opts.className}">${svg}</div>`;
    } catch (error) {
      const err = error as Error;
      if (opts.onError) {
        opts.onError(err, code);
      }
      
      const errorHtml = `
        <div class="${opts.className} ${opts.className}-error" style="border: 1px solid #dc3545; padding: 1rem; background: #fff5f5; border-radius: 4px;">
          <strong style="color: #dc3545;">Error rendering SolarWire:</strong>
          <pre style="margin-top: 0.5rem 0; padding: 0.5rem; background: #f8f9fa; border-radius: 4px; overflow-x: auto;">${escapeHtml(err.message)}</pre>
          <details>
            <summary>Code</summary>
            <pre style="margin: 0.5rem 0; padding: 0.5rem; background: #f8f9fa; border-radius: 4px; overflow-x: auto;">${escapeHtml(code)}</pre>
          </details>
        </div>
      `;
      return errorHtml;
    }
  }

  function escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  const defaultFenceRenderer = md.renderer.rules.fence;

  md.renderer.rules.fence = function(
    tokens: Token[],
    idx: number,
    options: any,
    env: any,
    self: Renderer
  ): string {
    const token = tokens[idx];
    const info = token.info ? md.utils.unescapeAll(token.info).trim() : '';

    if (info === 'solarwire') {
      return renderSolarwire(tokens, idx);
    }

    return defaultFenceRenderer ? defaultFenceRenderer(tokens, idx, options, env, self) : '';
  };
}

export { solarwirePlugin };
