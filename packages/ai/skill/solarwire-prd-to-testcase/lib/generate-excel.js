#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const TEMP_FILE = '.testcases-temp.ndjson';

function parseArgs() {
  const args = { command: '', params: {} };
  const argv = process.argv.slice(2);
  
  if (argv.length === 0) {
    return args;
  }
  
  args.command = argv[0];
  
  for (let i = 1; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].substring(2);
      if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) {
        args.params[key] = argv[i + 1];
        i++;
      } else {
        args.params[key] = true;
      }
    }
  }
  
  return args;
}

function getTempFilePath(outputPath) {
  const dir = path.dirname(outputPath);
  return path.join(dir, TEMP_FILE);
}

function appendToTemp(dir, data) {
  const tempFile = path.join(dir, TEMP_FILE);
  const lines = data.map(tc => JSON.stringify(tc)).join('\n') + '\n';
  fs.appendFileSync(tempFile, lines, 'utf-8');
}

function readTestCases(dir) {
  const tempFile = path.join(dir, TEMP_FILE);
  
  if (!fs.existsSync(tempFile)) {
    return [];
  }
  
  const content = fs.readFileSync(tempFile, 'utf-8');
  const lines = content.trim().split('\n').filter(line => line.trim());
  
  return lines.map(line => {
    try {
      return JSON.parse(line);
    } catch (e) {
      return null;
    }
  }).filter(tc => tc !== null);
}

function groupByModule(testCases) {
  const modules = new Map();
  
  for (const tc of testCases) {
    const module = tc.module || 'Unknown';
    if (!modules.has(module)) {
      modules.set(module, []);
    }
    modules.get(module).push(tc);
  }
  
  return modules;
}

function calculateStats(testCases, modules) {
  const stats = {
    total: testCases.length,
    p0: testCases.filter(tc => tc.priority === 'P0').length,
    p1: testCases.filter(tc => tc.priority === 'P1').length,
    p2: testCases.filter(tc => tc.priority === 'P2').length,
    byType: {},
    byModule: {}
  };
  
  for (const tc of testCases) {
    const type = tc.type || 'Unknown';
    stats.byType[type] = (stats.byType[type] || 0) + 1;
  }
  
  for (const [module, cases] of modules) {
    stats.byModule[module] = cases.length;
  }
  
  return stats;
}

async function createWorkbook() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'SolarWire PRD to TestCase';
  workbook.created = new Date();
  return workbook;
}

async function createSummarySheet(workbook, testCases) {
  const sheet = workbook.addWorksheet('测试用例汇总');
  
  sheet.columns = [
    { header: '用例编号', key: 'id', width: 10 },
    { header: '所属模块', key: 'module', width: 15 },
    { header: '用例名称', key: 'name', width: 35 },
    { header: '测试类型', key: 'type', width: 12 },
    { header: '前置条件', key: 'precondition', width: 40 },
    { header: '测试步骤', key: 'steps', width: 60 },
    { header: '测试数据', key: 'testData', width: 25 },
    { header: '预期结果', key: 'expected', width: 50 },
    { header: '优先级', key: 'priority', width: 8 },
    { header: '关联需求', key: 'related', width: 12 },
    { header: '边界值', key: 'boundary', width: 25 },
    { header: '异常场景', key: 'exception', width: 25 },
    { header: '备注', key: 'remark', width: 20 }
  ];
  
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1890FF' }
  };
  
  for (const col of sheet.columns) {
    col.alignment = { vertical: 'top', wrapText: true };
  }
  
  for (const tc of testCases) {
    sheet.addRow({
      id: tc.id || '',
      module: tc.module || '',
      name: tc.name || '',
      type: tc.type || '',
      precondition: tc.precondition || '',
      steps: tc.steps || '',
      testData: tc.testData || '',
      expected: tc.expected || '',
      priority: tc.priority || '',
      related: tc.related || '',
      boundary: tc.boundary || '',
      exception: tc.exception || '',
      remark: tc.remark || ''
    });
  }
}

async function createModuleSheet(workbook, modules) {
  const sheet = workbook.addWorksheet('按模块分组');
  
  sheet.columns = [
    { header: '用例编号', key: 'id', width: 10 },
    { header: '所属模块', key: 'module', width: 15 },
    { header: '用例名称', key: 'name', width: 35 },
    { header: '测试类型', key: 'type', width: 12 },
    { header: '前置条件', key: 'precondition', width: 40 },
    { header: '测试步骤', key: 'steps', width: 60 },
    { header: '测试数据', key: 'testData', width: 25 },
    { header: '预期结果', key: 'expected', width: 50 },
    { header: '优先级', key: 'priority', width: 8 },
    { header: '关联需求', key: 'related', width: 12 },
    { header: '边界值', key: 'boundary', width: 25 },
    { header: '异常场景', key: 'exception', width: 25 },
    { header: '备注', key: 'remark', width: 20 }
  ];
  
  for (const col of sheet.columns) {
    col.alignment = { vertical: 'top', wrapText: true };
  }
  
  for (const [module, cases] of modules) {
    const headerRow = sheet.addRow([module]);
    headerRow.font = { bold: true, size: 14 };
    sheet.mergeCells(`A${headerRow.number}:M${headerRow.number}`);
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    
    const columnHeaderRow = sheet.addRow([
      '用例编号', '所属模块', '用例名称', '测试类型', '前置条件',
      '测试步骤', '测试数据', '预期结果', '优先级',
      '关联需求', '边界值', '异常场景', '备注'
    ]);
    columnHeaderRow.font = { bold: true };
    
    for (const tc of cases) {
      sheet.addRow({
        id: tc.id || '',
        module: tc.module || '',
        name: tc.name || '',
        type: tc.type || '',
        precondition: tc.precondition || '',
        steps: tc.steps || '',
        testData: tc.testData || '',
        expected: tc.expected || '',
        priority: tc.priority || '',
        related: tc.related || '',
        boundary: tc.boundary || '',
        exception: tc.exception || '',
        remark: tc.remark || ''
      });
    }
    
    sheet.addRow([]);
  }
}

async function createStatsSheet(workbook, stats) {
  const sheet = workbook.addWorksheet('测试统计');
  
  sheet.columns = [
    { header: '统计项', key: 'item', width: 20 },
    { header: '数量', key: 'value', width: 15 }
  ];
  
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1890FF' }
  };
  
  sheet.addRow(['总用例数', stats.total]);
  sheet.addRow(['P0用例数', stats.p0]);
  sheet.addRow(['P1用例数', stats.p1]);
  sheet.addRow(['P2用例数', stats.p2]);
  sheet.addRow([]);
  sheet.addRow(['按测试类型统计', '']);
  for (const [type, count] of Object.entries(stats.byType)) {
    sheet.addRow([type, count]);
  }
  sheet.addRow([]);
  sheet.addRow(['按模块统计', '']);
  for (const [module, count] of Object.entries(stats.byModule)) {
    sheet.addRow([module, count]);
  }
}

async function commandCreate(params) {
  if (!params.output) {
    console.error('Error: --output parameter required');
    process.exit(1);
  }
  
  const dir = path.dirname(params.output);
  const tempFile = path.join(dir, TEMP_FILE);
  
  if (fs.existsSync(tempFile)) {
    fs.unlinkSync(tempFile);
  }
  
  console.log(`Created temp file: ${tempFile}`);
  console.log('Ready to append test cases.');
}

async function commandAppendBatch(params) {
  if (!params.file) {
    console.error('Error: --file parameter required');
    process.exit(1);
  }
  
  if (!params.data) {
    console.error('Error: --data parameter required');
    process.exit(1);
  }
  
  const dir = path.dirname(params.file);
  
  let testCases;
  try {
    testCases = JSON.parse(params.data);
    if (!Array.isArray(testCases)) {
      testCases = [testCases];
    }
  } catch (e) {
    console.error('Error: Invalid JSON data');
    process.exit(1);
  }
  
  appendToTemp(dir, testCases);
  
  const currentCount = readTestCases(dir).length;
  console.log(`Appended ${testCases.length} test cases. Total: ${currentCount}`);
}

async function commandFinalize(params) {
  if (!params.file) {
    console.error('Error: --file parameter required');
    process.exit(1);
  }
  
  const dir = path.dirname(params.file);
  const tempFile = path.join(dir, TEMP_FILE);
  
  const testCases = readTestCases(dir);
  
  if (testCases.length === 0) {
    console.error('Error: No test cases found');
    process.exit(1);
  }
  
  console.log(`Generating Excel with ${testCases.length} test cases...`);
  
  const modules = groupByModule(testCases);
  const stats = calculateStats(testCases, modules);
  
  const workbook = await createWorkbook();
  await createSummarySheet(workbook, testCases);
  await createModuleSheet(workbook, modules);
  await createStatsSheet(workbook, stats);
  
  await workbook.xlsx.writeFile(params.file);
  
  fs.unlinkSync(tempFile);
  
  console.log(`\nExcel generated: ${params.file}`);
  console.log('\n=== Statistics ===');
  console.log(`Total: ${stats.total}`);
  console.log(`P0: ${stats.p0}, P1: ${stats.p1}, P2: ${stats.p2}`);
  console.log('\nDone!');
}

function printUsage() {
  console.log(`
Usage: node generate-excel.js <command> [options]

Commands:
  create              Create a new Excel file (initialize temp storage)
  append-batch        Append a batch of test cases
  finalize            Generate final Excel and clean up

Options:
  create:
    --output <path>   Output Excel file path

  append-batch:
    --file <path>     Excel file path (to determine directory)
    --data <json>     JSON array of test cases

  finalize:
    --file <path>     Excel file path to generate

Examples:
  # Step 1: Create
  node generate-excel.js create --output .solarwire/my-project/test-cases.xlsx

  # Step 2: Append batches (repeat as needed)
  node generate-excel.js append-batch --file .solarwire/my-project/test-cases.xlsx --data '[{"id":"TC-001","module":"登录页面","name":"测试用例名称","type":"功能测试","precondition":"前置条件","steps":"测试步骤","testData":"测试数据","expected":"预期结果","priority":"P0","related":"","boundary":"","exception":"","remark":""}]'

  # Step 3: Finalize
  node generate-excel.js finalize --file .solarwire/my-project/test-cases.xlsx
`);
}

async function main() {
  const { command, params } = parseArgs();
  
  switch (command) {
    case 'create':
      await commandCreate(params);
      break;
    case 'append-batch':
      await commandAppendBatch(params);
      break;
    case 'finalize':
      await commandFinalize(params);
      break;
    default:
      printUsage();
      process.exit(command ? 1 : 0);
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
