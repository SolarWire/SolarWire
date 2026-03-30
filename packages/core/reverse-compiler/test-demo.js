const { convertHTMLToSolarWire, convertJSXToSolarWire, convertVueToSolarWire } = require('./dist');

console.log('=== HTML 测试 ===');
const html = `
<form class="login-form">
  <input type="text" placeholder="用户名" id="username">
  <input type="password" placeholder="密码" id="password">
  <button type="submit">登录</button>
</form>
`;
console.log('输入 HTML:');
console.log(html);

const htmlResult = convertHTMLToSolarWire(html, { preserveTextContent: true, includePositions: false });
console.log('输出 SolarWire:');
console.log(htmlResult.code);
console.log('成功:', htmlResult.success);
console.log('元素数量:', htmlResult.elements?.length || 0);
if (htmlResult.warnings) {
  console.log('警告:', htmlResult.warnings);
}

console.log('\n=== 简单HTML测试 ===');
const simpleHtml = '<input type="text" placeholder="用户名">';
console.log('输入:', simpleHtml);
const simpleResult = convertHTMLToSolarWire(simpleHtml, { preserveTextContent: true });
console.log('输出:', simpleResult.code);

console.log('\n=== JSX 测试 ===');
const jsx = `<button className="btn-primary" onClick={handleSubmit}>提交</button>`;
console.log('输入 JSX:', jsx);
const jsxResult = convertJSXToSolarWire(jsx, { preserveTextContent: true });
console.log('输出 SolarWire:', jsxResult.code);

console.log('\n=== Vue 测试 ===');
const vue = `<template><button @click="handleClick">点击</button></template>`;
console.log('输入 Vue:', vue);
const vueResult = convertVueToSolarWire(vue, { preserveTextContent: true });
console.log('输出 SolarWire:', vueResult.code);
