#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

function parseArgs() {
  const args = {};
  const argv = process.argv.slice(2);
  
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--output' && argv[i + 1]) {
      args.output = argv[i + 1];
      i++;
    }
  }
  
  return args;
}

function findInputFile(outputPath) {
  const outputDir = path.dirname(outputPath);
  const inputFile = path.join(outputDir, '.testcases.ndjson');
  
  if (fs.existsSync(inputFile)) {
    return inputFile;
  }
  
  return null;
}

function readTestCases(inputFile) {
  const content = fs.readFileSync(inputFile, 'utf-8');
  const lines = content.trim().split('\n').filter(line => line.trim());
  
  return lines.map(line => {
    try {
      return JSON.parse(line);
    } catch (e) {
      console.error(`Failed to parse line: ${line.substring(0, 50)}...`);
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

async function createExcel(testCases, outputPath) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'SolarWire PRD to TestCase';
  workbook.created = new Date();
  
  const modules = groupByModule(testCases);
  const stats = calculateStats(testCases, modules);
  
  await createSummarySheet(workbook, testCases);
  await createModuleSheet(workbook, modules);
  await createStatsSheet(workbook, stats);
  
  await workbook.xlsx.writeFile(outputPath);
  
  return stats;
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

async function main() {
  const args = parseArgs();
  
  if (!args.output) {
    console.error('Usage: node generate-excel.js --output <output-path>');
    console.error('Example: node generate-excel.js --output .solarwire/my-project/test-cases.xlsx');
    process.exit(1);
  }
  
  const inputFile = findInputFile(args.output);
  
  if (!inputFile) {
    console.error(`Error: Cannot find .testcases.ndjson in the output directory`);
    console.error(`Expected: ${path.join(path.dirname(args.output), '.testcases.ndjson')}`);
    process.exit(1);
  }
  
  console.log(`Reading test cases from: ${inputFile}`);
  
  const testCases = readTestCases(inputFile);
  
  if (testCases.length === 0) {
    console.error('Error: No valid test cases found');
    process.exit(1);
  }
  
  console.log(`Found ${testCases.length} test cases`);
  console.log(`Generating Excel: ${args.output}`);
  
  const stats = await createExcel(testCases, args.output);
  
  fs.unlinkSync(inputFile);
  console.log(`Cleaned up: ${inputFile}`);
  
  console.log('\n=== Statistics ===');
  console.log(`Total: ${stats.total}`);
  console.log(`P0: ${stats.p0}, P1: ${stats.p1}, P2: ${stats.p2}`);
  console.log('\nDone!');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
