import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from '../lib/parser';
import { render as renderSvg } from '../lib/renderer-svg';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function solarwireMarkdownItPlugin(md: any) {
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
        const svg = renderSvg(ast);
        return `
          <div style="margin: 10px 0; padding: 10px; background: white; border-radius: 4px; overflow: hidden;">
            <div style="width: 100%; display: flex; justify-content: center; align-items: center;">
              ${svg.replace(/<svg/, '<svg style="max-width: 100%; max-height: 100%; height: auto; width: auto;"')}
            </div>
          </div>
        `;
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

let diagnosticCollection: vscode.DiagnosticCollection;

export function activate(context: vscode.ExtensionContext) {
  console.log('SolarWire extension is activating...');
  vscode.window.showInformationMessage('SolarWire extension activated!');
  diagnosticCollection = vscode.languages.createDiagnosticCollection('solarwire');
  context.subscriptions.push(diagnosticCollection);

  const previewCommand = vscode.commands.registerCommand('solarwire.preview', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor!');
      return;
    }
    
    const panel = vscode.window.createWebviewPanel(
      'solarwirePreview',
      'SolarWire Preview',
      vscode.ViewColumn.Two,
      {
        enableScripts: true
      }
    );
    
    const updatePreview = () => {
      const document = editor.document;
      const content = document.getText();
      
      try {
        const ast = parse(content);
        const svg = renderSvg(ast);
        
        diagnosticCollection.delete(document.uri);
        panel.webview.html = getWebviewContent(svg, document);
      } catch (error) {
        updateDiagnostics(document, error);
        panel.webview.html = getErrorContent(error instanceof Error ? error.message : String(error));
      }
    };
    
    updatePreview();
    
    const changeSubscription = vscode.workspace.onDidChangeTextDocument(e => {
      if (e.document === editor.document) {
        updatePreview();
      }
    });
    
    panel.onDidDispose(() => {
      changeSubscription.dispose();
    });
  });

  const exportSvgCommand = vscode.commands.registerCommand('solarwire.exportSvg', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor!');
      return;
    }

    const content = editor.document.getText();
    const fileName = editor.document.fileName;
    const defaultName = path.basename(fileName, '.solarwire') + '.svg';

    try {
      const ast = parse(content);
      const svg = renderSvg(ast);

      const uri = await vscode.window.showSaveDialog({
        defaultUri: vscode.Uri.file(path.join(path.dirname(fileName), defaultName)),
        filters: {
          'SVG Files': ['svg'],
          'All Files': ['*']
        }
      });

      if (uri) {
        fs.writeFileSync(uri.fsPath, svg, 'utf-8');
        vscode.window.showInformationMessage(`SVG exported successfully to ${uri.fsPath}`);
      }
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to export SVG: ${error instanceof Error ? error.message : String(error)}`);
    }
  });

  const exportPngCommand = vscode.commands.registerCommand('solarwire.exportPng', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor!');
      return;
    }

    const content = editor.document.getText();
    const fileName = editor.document.fileName;
    const defaultName = path.basename(fileName, '.solarwire') + '.png';

    try {
      const ast = parse(content);
      const svg = renderSvg(ast);

      const panel = vscode.window.createWebviewPanel(
        'solarwireExportPng',
        'SolarWire Export PNG',
        vscode.ViewColumn.One,
        {
          enableScripts: true
        }
      );

      panel.webview.html = getPngExportContent(svg, defaultName, fileName);

      panel.webview.onDidReceiveMessage(async message => {
        if (message.command === 'savePng') {
          const uri = await vscode.window.showSaveDialog({
            defaultUri: vscode.Uri.file(path.join(path.dirname(fileName), defaultName)),
            filters: {
              'PNG Files': ['png'],
              'All Files': ['*']
            }
          });

          if (uri) {
            const base64Data = message.data.replace(/^data:image\/png;base64,/, '');
            fs.writeFileSync(uri.fsPath, base64Data, 'base64');
            vscode.window.showInformationMessage(`PNG exported successfully to ${uri.fsPath}`);
            panel.dispose();
          }
        } else if (message.command === 'cancel') {
          panel.dispose();
        }
      });
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to export PNG: ${error instanceof Error ? error.message : String(error)}`);
    }
  });

  const completionProvider = vscode.languages.registerCompletionItemProvider(
    { scheme: 'file', language: 'solarwire' },
    {
      provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
        const linePrefix = document.lineAt(position).text.substr(0, position.character);
        const items: vscode.CompletionItem[] = [];

        const elementCompletions = [
          { label: '[]', detail: 'Rectangle', insertText: '["${1:text}"]' },
          { label: '()', detail: 'Rounded Rectangle', insertText: '("${1:text}")' },
          { label: '(())', detail: 'Circle', insertText: '(("${1:text}"))' },
          { label: '""', detail: 'Text', insertText: '"${1:text}"' },
          { label: '[?]', detail: 'Placeholder', insertText: '[?"${1:text}"]' },
          { label: '<>', detail: 'Image', insertText: '<${1:url}>' },
          { label: '--', detail: 'Line', insertText: '-- @(${1:x1},${2:y1})->(${3:x2},${4:y2})' },
          { label: '{row}', detail: 'Row Container', insertText: '{row}' },
          { label: '{col}', detail: 'Column Container', insertText: '{col}' },
          { label: '##', detail: 'Table', insertText: '##' },
          { label: '#', detail: 'Table Row', insertText: '#' }
        ];

        const attributeCompletions = [
          { label: 'w', detail: 'Width (number)' },
          { label: 'h', detail: 'Height (number)' },
          { label: 'c', detail: 'Color (hex/name)' },
          { label: 'bg', detail: 'Background Color (hex/name)' },
          { label: 'b', detail: 'Border Color (hex/name)' },
          { label: 's', detail: 'Border Width (number)' },
          { label: 'r', detail: 'Border Radius (number)' },
          { label: 'size', detail: 'Size (number)' },
          { label: 'line-height', detail: 'Line Height (number)' },
          { label: 'gap', detail: 'Gap (number)' },
          { label: 'bold', detail: 'Bold Text' },
          { label: 'italic', detail: 'Italic Text' },
          { label: 'align', detail: 'Alignment (l/c/r)' },
          { label: 'note', detail: 'Note/Description (text)' },
          { label: 'colspan', detail: 'Column Span (number)' },
          { label: 'rowspan', detail: 'Row Span (number)' }
        ];

        const declarationCompletions = [
          { label: '!title', detail: 'Document Title' },
          { label: '!c', detail: 'Default Color (hex/name)' },
          { label: '!bg', detail: 'Default Background (hex/name)' },
          { label: '!size', detail: 'Default Size (number)' },
          { label: '!line-height', detail: 'Default Line Height (number)' },
          { label: '!gap', detail: 'Default Gap (number)' },
          { label: '!bold', detail: 'Default Bold' },
          { label: '!italic', detail: 'Default Italic' }
        ];

        if (linePrefix.trim().startsWith('!')) {
          declarationCompletions.forEach(decl => {
            const item = new vscode.CompletionItem(decl.label, vscode.CompletionItemKind.Keyword);
            item.detail = decl.detail;
            items.push(item);
          });
        } else {
          elementCompletions.forEach(elem => {
            const item = new vscode.CompletionItem(elem.label, vscode.CompletionItemKind.Snippet);
            item.detail = elem.detail;
            item.insertText = new vscode.SnippetString(elem.insertText);
            items.push(item);
          });

          attributeCompletions.forEach(attr => {
            const item = new vscode.CompletionItem(attr.label, vscode.CompletionItemKind.Property);
            item.detail = attr.detail;
            items.push(item);
          });
        }

        return items;
      }
    }
  );

  const hoverProvider = vscode.languages.registerHoverProvider(
    { scheme: 'file', language: 'solarwire' },
    {
      provideHover(document: vscode.TextDocument, position: vscode.Position) {
        const wordRange = document.getWordRangeAtPosition(position);
        if (!wordRange) return undefined;
        
        const word = document.getText(wordRange);
        
        const hoverInfo: Record<string, string> = {
          '[]': 'Rectangle element: ["text"]',
          '()': 'Rounded rectangle element: ("text")',
          '(())': 'Circle element: (("text"))',
          '""': 'Text element: "text"',
          '[?]': 'Placeholder element: [?"text"]',
          '<>': 'Image element: <url>',
          '--': 'Line element: -- @(x1,y1)->(x2,y2)',
          '{row}': 'Row container: {row}',
          '{col}': 'Column container: {col}',
          '##': 'Table element: ##',
          '#': 'Table row element: #',
          'w': 'Width attribute: w=number',
          'h': 'Height attribute: h=number',
          'c': 'Color attribute: c=color',
          'bg': 'Background color attribute: bg=color',
          'b': 'Border color attribute: b=color',
          's': 'Border size attribute: s=number',
          'r': 'Border radius attribute: r=number',
          'size': 'Size attribute: size=number',
          'gap': 'Gap attribute: gap=number',
          'bold': 'Bold text attribute',
          'italic': 'Italic text attribute',
          'align': 'Alignment attribute: align=l/c/r',
          'note': 'Note attribute: note="text"',
          'colspan': 'Column span attribute: colspan=number',
          'rowspan': 'Row span attribute: rowspan=number'
        };

        if (hoverInfo[word]) {
          return new vscode.Hover(hoverInfo[word]);
        }
        
        return undefined;
      }
    }
  );

  const textDocumentChange = vscode.workspace.onDidChangeTextDocument(event => {
    if (event.document.languageId === 'solarwire') {
      try {
        parse(event.document.getText());
        diagnosticCollection.delete(event.document.uri);
      } catch (error) {
        updateDiagnostics(event.document, error);
      }
    }
  });

  context.subscriptions.push(
    previewCommand,
    exportSvgCommand,
    exportPngCommand,
    completionProvider,
    hoverProvider,
    textDocumentChange
  );

  return {
    extendMarkdownIt(md: any) {
      return md.use(solarwireMarkdownItPlugin);
    }
  };
}

function updateDiagnostics(document: vscode.TextDocument, error: any) {
  const diagnostics: vscode.Diagnostic[] = [];
  const message = error instanceof Error ? error.message : String(error);
  
  let line = 0;
  let col = 0;
  
  const match = message.match(/line (\d+), column (\d+)/);
  if (match) {
    line = parseInt(match[1]) - 1;
    col = parseInt(match[2]) - 1;
  }
  
  const range = new vscode.Range(line, col, line, col + 1);
  const diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Error);
  
  diagnostics.push(diagnostic);
  diagnosticCollection.set(document.uri, diagnostics);
}

function getWebviewContent(svg: string, document: vscode.TextDocument): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SolarWire Preview</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #1e1e1e;
      min-height: 100vh;
      overflow: hidden;
    }
    .toolbar {
      margin-bottom: 20px;
      display: flex;
      gap: 10px;
      align-items: center;
    }
    .toolbar button {
      margin: 0 5px;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      background: #007acc;
      color: white;
      cursor: pointer;
      font-size: 14px;
    }
    .toolbar button:hover {
      background: #005a9e;
    }
    .zoom-level {
      padding: 8px 12px;
      background: #f0f0f0;
      color: #333;
      border-radius: 4px;
      font-size: 12px;
      min-width: 60px;
      text-align: center;
    }
    .preview-wrapper {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      width: calc(100% - 40px);
      max-width: calc(100% - 40px);
      height: calc(100vh - 160px);
      overflow: hidden;
      position: relative;
    }
    .preview-container {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      cursor: grab;
      transform-origin: center center;
    }
    .preview-container:active {
      cursor: grabbing;
    }
    .preview-container svg {
      max-width: 100%;
      max-height: 100%;
      height: auto;
      width: auto;
      transition: transform 0.1s ease-out;
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <button onclick="zoomOut()">-</button>
    <div class="zoom-level" id="zoomLevel">100%</div>
    <button onclick="zoomIn()">+</button>
    <button onclick="resetZoom()">Reset</button>
    <button onclick="downloadSvg()">Download SVG</button>
  </div>
  <div class="preview-wrapper">
    <div class="preview-container" id="preview">
      ${svg}
    </div>
  </div>
  <script>
    let scale = 1;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let translateX = 0;
    let translateY = 0;
    
    function updateTransform() {
      const preview = document.getElementById('preview');
      const svgElement = preview.querySelector('svg');
      if (svgElement) {
        svgElement.style.transform = \`scale(\${scale}) translate(\${translateX}px, \${translateY}px)\`;
      }
      document.getElementById('zoomLevel').textContent = Math.round(scale * 100) + '%';
    }
    
    function zoomIn() {
      scale = Math.min(scale + 0.1, 5);
      updateTransform();
    }
    
    function zoomOut() {
      scale = Math.max(scale - 0.1, 0.1);
      updateTransform();
    }
    
    function resetZoom() {
      scale = 1;
      translateX = 0;
      translateY = 0;
      updateTransform();
    }
    
    function downloadSvg() {
      const svg = document.getElementById('preview').innerHTML;
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'diagram.svg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    
    const previewContainer = document.getElementById('preview');
    
    previewContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      translateX = e.clientX - startX;
      translateY = e.clientY - startY;
      updateTransform();
    });
    
    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
    
    document.addEventListener('mouseleave', () => {
      isDragging = false;
    });
    
    updateTransform();
  </script>
</body>
</html>`;
}

function getErrorContent(error: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      background: #1e1e1e;
      color: #f48771;
      font-family: Consolas, Monaco, 'Courier New', monospace;
    }
    .error-container {
      background: #2d2d2d;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #f48771;
    }
    h1 {
      color: #f48771;
      margin-top: 0;
    }
  </style>
</head>
<body>
  <div class="error-container">
    <h1>⚠️ Parse Error</h1>
    <pre>${error}</pre>
  </div>
</body>
</html>`;
}

function getPngExportContent(svg: string, defaultName: string, fileName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Export PNG</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      background: #1e1e1e;
      color: white;
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 800px;
    }
    h1 {
      margin-bottom: 20px;
    }
    .preview-container {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .buttons {
      display: flex;
      gap: 10px;
    }
    button {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
    }
    .save-btn {
      background: #007acc;
      color: white;
    }
    .save-btn:hover {
      background: #005a9e;
    }
    .cancel-btn {
      background: #6c757d;
      color: white;
    }
    .cancel-btn:hover {
      background: #545b62;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Export PNG</h1>
    <div class="preview-container" id="preview">
      ${svg}
    </div>
    <div class="buttons">
      <button class="save-btn" onclick="savePng()">Save PNG</button>
      <button class="cancel-btn" onclick="cancel()">Cancel</button>
    </div>
  </div>
  <script>
    const vscode = acquireVsCodeApi();

    function savePng() {
      const svg = document.getElementById('preview').innerHTML;
      const img = new Image();
      const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = img.width * 2;
        canvas.height = img.height * 2;
        const ctx = canvas.getContext('2d');
        ctx.scale(2, 2);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const pngDataUrl = canvas.toDataURL('image/png');
        URL.revokeObjectURL(url);
        vscode.postMessage({ command: 'savePng', data: pngDataUrl });
      };
      
      img.src = url;
    }

    function cancel() {
      vscode.postMessage({ command: 'cancel' });
    }
  </script>
</body>
</html>`;
}

export function deactivate() {}
