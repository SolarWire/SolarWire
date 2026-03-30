const { convertHTMLToSolarWire, parseHTML } = require('./dist');

console.log('=== 调试 HTML 解析 ===');
const html = `<form class="login-form">
  <input type="text" placeholder="用户名" id="username">
  <input type="password" placeholder="密码" id="password">
  <button type="submit">登录</button>
</form>`;

const tree = parseHTML(html);
console.log('Root type:', tree.root.type);
console.log('Root tagName:', tree.root.tagName);
console.log('Root children count:', tree.root.children?.length || 0);

function printTree(element, indent = 0) {
  const prefix = '  '.repeat(indent);
  console.log(`${prefix}- type: ${element.type}, tagName: ${element.tagName}, text: ${element.text?.substring(0, 20) || 'none'}, children: ${element.children?.length || 0}`);
  if (element.attributes?.placeholder) {
    console.log(`${prefix}  placeholder: ${element.attributes.placeholder}`);
  }
  if (element.children) {
    for (const child of element.children) {
      printTree(child, indent + 1);
    }
  }
}

printTree(tree.root);

console.log('\n=== 最终输出 ===');
const result = convertHTMLToSolarWire(html, { preserveTextContent: true });
console.log(result.code);
