import { parse } from '@solarwire/parser';
import { render } from '@solarwire/renderer-svg';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default function solarwireMarkdownItPlugin(md: any) {
  const defaultFenceRenderer = md.renderer.rules.fence;

  md.renderer.rules.fence = function(
    tokens: any[],
    idx: number,
    options: any,
    env: any,
    self: any
  ) {
    const token = tokens[idx];
    const info = token.info ? md.utils.unescapeAll(token.info).trim() : '';

    if (info.toLowerCase() === 'solarwire') {
      const code = token.content.trim();

      try {
        const ast = parse(code);
        const svg = render(ast);
        return `<div style="margin: 10px 0; padding: 10px; background: white; border-radius: 4px;">${svg}</div>`;
      } catch (error) {
        const err = error as Error;
        return `
          <div style="border: 1px solid #dc3545; padding: 1rem; background: #fff5f5; border-radius: 4px; margin: 10px 0;">
            <strong style="color: #dc3545;">Error rendering SolarWire:</strong>
            <pre style="margin: 0.5rem 0; padding: 0.5rem; background: #f8f9fa; border-radius: 4px; overflow-x: auto;">${escapeHtml(err.message)}</pre>
            <details>
              <summary>Code</summary>
              <pre style="margin: 0.5rem 0; padding: 0.5rem; background: #f8f9fa; border-radius: 4px; overflow-x: auto;">${escapeHtml(code)}</pre>
            </details>
          </div>
        `;
      }
    }

    return defaultFenceRenderer ? defaultFenceRenderer(tokens, idx, options, env, self) : '';
  };
}
