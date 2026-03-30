#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

class PRDToTestCaseConverter {
    constructor(prdPath) {
        this.prdPath = prdPath;
        this.prdContent = '';
        this.testCases = [];
        this.modules = new Map();
        this.userStories = [];
        this.features = [];
        this.flows = [];
        this.currentPage = '';
        this.tcCounter = 1;
    }

    parse() {
        this.prdContent = fs.readFileSync(this.prdPath, 'utf-8');
        this.parseDocumentInfo();
        this.parseUserStories();
        this.parseFeatureList();
        this.parseBusinessFlows();
        this.parseSolarWireNotes();
        return this;
    }

    parseDocumentInfo() {
        const projectNameMatch = this.prdContent.match(/#\s*Product Requirements Document\s*-\s*(.+)/);
        if (projectNameMatch) {
            this.projectName = projectNameMatch[1].trim();
        }
    }

    parseUserStories() {
        const usRegex = /\|\s*(US-\d+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*(P\d)\s*\|/g;
        let match;
        while ((match = usRegex.exec(this.prdContent)) !== null) {
            const [, id, story, criteria, priority] = match;
            const criteriaText = criteria.replace(/<br\s*\/?>/g, '\n').trim();
            const givenWhenThen = this.parseGivenWhenThen(criteriaText);
            this.userStories.push({
                id: id.trim(),
                story: story.trim(),
                criteria: criteriaText,
                givenWhenThen,
                priority: priority.trim()
            });
        }
    }

    parseGivenWhenThen(criteriaText) {
        const cases = [];
        const gwtRegex = /Given\s+(.+?),?\s+when\s+(.+?),?\s+then\s+(.+?)(?=Given|$)/gi;
        let match;
        while ((match = gwtRegex.exec(criteriaText)) !== null) {
            cases.push({
                given: match[1].trim(),
                when: match[2].trim(),
                then: match[3].trim()
            });
        }
        return cases;
    }

    parseFeatureList() {
        const featureRegex = /\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*(P\d)\s*\|\s*([^|]+)\s*\|/g;
        let match;
        let inFeatureSection = false;
        const lines = this.prdContent.split('\n');
        
        for (const line of lines) {
            if (line.includes('## 2. Feature') || line.includes('### 2.1 Feature')) {
                inFeatureSection = true;
                continue;
            }
            if (inFeatureSection && line.startsWith('## ')) {
                inFeatureSection = false;
            }
            if (inFeatureSection && line.startsWith('|')) {
                const cols = line.split('|').map(c => c.trim()).filter(c => c);
                if (cols.length >= 4 && cols[0] !== 'Module' && cols[0] !== '模块') {
                    this.features.push({
                        module: cols[0],
                        feature: cols[1],
                        priority: cols[2],
                        description: cols[3] || ''
                    });
                }
            }
        }
    }

    parseBusinessFlows() {
        const mermaidRegex = /```mermaid\n([\s\S]*?)```/g;
        let match;
        while ((match = mermaidRegex.exec(this.prdContent)) !== null) {
            const mermaidCode = match[1];
            const flowType = this.detectFlowType(mermaidCode);
            const nodes = this.parseMermaidNodes(mermaidCode);
            this.flows.push({
                type: flowType,
                code: mermaidCode,
                nodes
            });
        }
    }

    detectFlowType(code) {
        if (code.includes('flowchart') || code.includes('graph')) return 'flowchart';
        if (code.includes('sequenceDiagram')) return 'sequence';
        return 'unknown';
    }

    parseMermaidNodes(code) {
        const nodes = [];
        const nodeRegex = /([A-Z])\s*\[([^\]]+)\]|\[([^\]]+)\]\s*->\s*\[([^\]]+)\]|([A-Z])\s*\{([^}]+)\}/g;
        let match;
        while ((match = nodeRegex.exec(code)) !== null) {
            if (match[1] && match[2]) {
                nodes.push({ id: match[1], label: match[2], type: 'action' });
            } else if (match[5] && match[6]) {
                nodes.push({ id: match[5], label: match[6], type: 'decision' });
            }
        }
        return nodes;
    }

    parseSolarWireNotes() {
        const solarwireRegex = /```solarwire\n([\s\S]*?)```/g;
        let match;
        
        while ((match = solarwireRegex.exec(this.prdContent)) !== null) {
            const code = match[1];
            const titleMatch = code.match(/!title\s*=\s*["']([^"']+)["']/);
            const title = titleMatch ? titleMatch[1] : 'Unknown Page';
            this.currentPage = title;
            
            const noteRegex = /note\s*=\s*["']([^"']+?)["']/g;
            let noteMatch;
            
            while ((noteMatch = noteRegex.exec(code)) !== null) {
                const note = noteMatch[1];
                const elementMatch = code.substring(0, noteMatch.index).match(/\[?"?([^"\]\[(@]+)"?\]?\s*@/g);
                const elementName = elementMatch ? 
                    elementMatch[elementMatch.length - 1].replace(/[\[\]"@]/g, '').trim() : 
                    'Element';
                
                this.parseNoteToTestCases(note, elementName, title);
            }
        }
    }

    parseNoteToTestCases(note, elementName, page) {
        const lines = note.split('\n');
        const firstLine = lines[0].trim();
        const elementDefinition = firstLine;
        
        const sections = this.parseNoteSections(lines.slice(1));
        
        for (const [sectionName, items] of Object.entries(sections)) {
            for (const item of items) {
                this.generateTestCasesFromItem(sectionName, item, elementDefinition, elementName, page);
            }
        }
    }

    parseNoteSections(lines) {
        const sections = {};
        let currentSection = '';
        let currentItems = [];
        let currentItem = '';
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const numberedMatch = line.match(/^(\d+)\.\s*(.+)/);
            const bulletMatch = line.match(/^(\s*)[-#]\s*(.+)/);
            
            if (numberedMatch) {
                if (currentSection && currentItem) {
                    currentItems.push(currentItem.trim());
                }
                currentSection = numberedMatch[2].trim();
                currentItem = '';
                currentItems = [];
            } else if (bulletMatch) {
                if (currentItem) {
                    currentItems.push(currentItem.trim());
                }
                currentItem = bulletMatch[2].trim();
            } else if (line.trim() && currentItem) {
                currentItem += ' ' + line.trim();
            }
        }
        
        if (currentItem) {
            currentItems.push(currentItem.trim());
        }
        if (currentSection) {
            sections[currentSection] = currentItems;
        }
        
        return sections;
    }

    generateTestCasesFromItem(sectionName, item, elementDef, elementName, page) {
        const sectionLower = sectionName.toLowerCase();
        
        if (sectionLower.includes('click') || sectionLower.includes('点击')) {
            this.addTestCase({
                module: page,
                name: `${elementDef}-${item.substring(0, 20)}`,
                type: '功能测试',
                precondition: '用户已进入该页面',
                steps: `1. 查看${elementDef}\n2. 执行操作：${item}`,
                testData: '',
                expected: item,
                priority: 'P0',
                related: '',
                boundary: '',
                exception: '',
                remark: ''
            });
        }
        
        if (sectionLower.includes('success') || sectionLower.includes('成功')) {
            this.addTestCase({
                module: page,
                name: `${elementDef}-成功处理-${item.substring(0, 15)}`,
                type: '功能测试',
                precondition: '用户已执行操作',
                steps: `1. 执行操作\n2. 观察结果`,
                testData: '',
                expected: item,
                priority: 'P0',
                related: '',
                boundary: '',
                exception: '',
                remark: ''
            });
        }
        
        if (sectionLower.includes('failure') || sectionLower.includes('失败') || sectionLower.includes('error')) {
            this.addTestCase({
                module: page,
                name: `${elementDef}-异常处理-${item.substring(0, 15)}`,
                type: '异常测试',
                precondition: '用户已进入该页面',
                steps: `1. 触发异常情况\n2. 观察错误处理`,
                testData: '',
                expected: item,
                priority: 'P1',
                related: '',
                boundary: '',
                exception: item,
                remark: ''
            });
        }
        
        if (sectionLower.includes('input') || sectionLower.includes('输入')) {
            this.generateInputTestCases(item, elementDef, page);
        }
        
        if (sectionLower.includes('valid') || sectionLower.includes('校验') || sectionLower.includes('验证')) {
            this.generateValidationTestCases(item, elementDef, page);
        }
        
        if (sectionLower.includes('disabled') || sectionLower.includes('禁用') || sectionLower.includes('不可')) {
            this.addTestCase({
                module: page,
                name: `${elementDef}-禁用状态-${item.substring(0, 15)}`,
                type: 'UI测试',
                precondition: '用户已进入该页面',
                steps: `1. 检查禁用条件\n2. 验证元素状态`,
                testData: '',
                expected: item,
                priority: 'P1',
                related: '',
                boundary: '',
                exception: '',
                remark: ''
            });
        }
        
        if (sectionLower.includes('data') || sectionLower.includes('数据')) {
            this.addTestCase({
                module: page,
                name: `${elementDef}-数据验证-${item.substring(0, 15)}`,
                type: '功能测试',
                precondition: '数据已加载',
                steps: `1. 查看数据展示\n2. 验证数据正确性`,
                testData: '',
                expected: item,
                priority: 'P1',
                related: '',
                boundary: '',
                exception: '',
                remark: ''
            });
        }
    }

    generateInputTestCases(item, elementDef, page) {
        const lengthMatch = item.match(/(\d+)\s*(?:to|-)\s*(\d+)|min(?:imum)?\s*(\d+).*?max(?:imum)?\s*(\d+)/i);
        if (lengthMatch) {
            const min = parseInt(lengthMatch[1] || lengthMatch[3]);
            const max = parseInt(lengthMatch[2] || lengthMatch[4]);
            
            this.addTestCase({
                module: page,
                name: `${elementDef}-最小长度边界`,
                type: '边界测试',
                precondition: '用户已进入该页面',
                steps: `1. 输入${min-1}个字符\n2. 验证提示信息`,
                testData: `${min-1}个字符`,
                expected: '提示长度不足',
                priority: 'P1',
                related: '',
                boundary: `${min-1}, ${min}, ${max}, ${max+1}`,
                exception: '',
                remark: ''
            });
            
            this.addTestCase({
                module: page,
                name: `${elementDef}-最大长度边界`,
                type: '边界测试',
                precondition: '用户已进入该页面',
                steps: `1. 输入${max+1}个字符\n2. 验证提示信息`,
                testData: `${max+1}个字符`,
                expected: '提示长度超限',
                priority: 'P1',
                related: '',
                boundary: `${min-1}, ${min}, ${max}, ${max+1}`,
                exception: '',
                remark: ''
            });
        }
        
        this.addTestCase({
            module: page,
            name: `${elementDef}-输入规则验证`,
            type: '表单验证',
            precondition: '用户已进入该页面',
            steps: `1. 输入测试数据\n2. 验证输入规则`,
            testData: item,
            expected: '符合输入规则',
            priority: 'P0',
            related: '',
            boundary: '',
            exception: '',
            remark: item
        });
    }

    generateValidationTestCases(item, elementDef, page) {
        this.addTestCase({
            module: page,
            name: `${elementDef}-格式校验`,
            type: '表单验证',
            precondition: '用户已进入该页面',
            steps: `1. 输入测试数据\n2. 触发校验\n3. 查看校验结果`,
            testData: '各种格式测试数据',
            expected: item,
            priority: 'P0',
            related: '',
            boundary: '',
            exception: '',
            remark: ''
        });
    }

    addTestCase(tc) {
        tc.id = `TC-${String(this.tcCounter++).padStart(3, '0')}`;
        this.testCases.push(tc);
        
        if (!this.modules.has(tc.module)) {
            this.modules.set(tc.module, []);
        }
        this.modules.get(tc.module).push(tc);
    }

    generateFromUserStories() {
        for (const story of this.userStories) {
            for (const gwt of story.givenWhenThen) {
                this.addTestCase({
                    module: '用户故事验收测试',
                    name: `${story.id}-${gwt.when.substring(0, 20)}`,
                    type: '功能测试',
                    precondition: gwt.given,
                    steps: `1. ${gwt.given}\n2. ${gwt.when}`,
                    testData: '',
                    expected: gwt.then,
                    priority: story.priority,
                    related: story.id,
                    boundary: '',
                    exception: '',
                    remark: story.story
                });
            }
        }
    }

    generateFromFeatures() {
        for (const feature of this.features) {
            this.addTestCase({
                module: feature.module,
                name: `${feature.feature}-功能验证`,
                type: '功能测试',
                precondition: '系统正常运行',
                steps: `1. 进入${feature.module}\n2. 测试${feature.feature}功能`,
                testData: '',
                expected: feature.description,
                priority: feature.priority,
                related: '',
                boundary: '',
                exception: '',
                remark: ''
            });
        }
    }

    generateFromFlows() {
        for (const flow of this.flows) {
            if (flow.type === 'flowchart') {
                const path = flow.nodes.map(n => n.label).join(' → ');
                this.addTestCase({
                    module: '业务流程测试',
                    name: `流程路径测试-${path.substring(0, 30)}`,
                    type: '功能测试',
                    precondition: '系统正常运行',
                    steps: flow.nodes.filter(n => n.type === 'action')
                        .map((n, i) => `${i+1}. ${n.label}`).join('\n'),
                    testData: '',
                    expected: '流程正常完成',
                    priority: 'P0',
                    related: '',
                    boundary: '',
                    exception: '',
                    remark: ''
                });
            }
        }
    }

    async generateExcel(outputPath) {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'SolarWire PRD to TestCase';
        workbook.created = new Date();
        
        const sheet1 = workbook.addWorksheet('测试用例汇总');
        this.setupSummarySheet(sheet1);
        
        for (const tc of this.testCases) {
            sheet1.addRow([
                tc.id, tc.module, tc.name, tc.type, tc.precondition,
                tc.steps, tc.testData, tc.expected, tc.priority,
                tc.related, tc.boundary, tc.exception, tc.remark
            ]);
        }
        
        const sheet2 = workbook.addWorksheet('按模块分组');
        this.setupModuleSheet(sheet2);
        
        for (const [module, cases] of this.modules) {
            const headerRow = sheet2.addRow([module]);
            headerRow.font = { bold: true, size: 14 };
            sheet2.mergeCells(`A${headerRow.number}:M${headerRow.number}`);
            headerRow.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE0E0E0' }
            };
            
            const headerRow2 = sheet2.addRow([
                '用例编号', '所属模块', '用例名称', '测试类型', '前置条件',
                '测试步骤', '测试数据', '预期结果', '优先级',
                '关联需求', '边界值', '异常场景', '备注'
            ]);
            headerRow2.font = { bold: true };
            
            for (const tc of cases) {
                sheet2.addRow([
                    tc.id, tc.module, tc.name, tc.type, tc.precondition,
                    tc.steps, tc.testData, tc.expected, tc.priority,
                    tc.related, tc.boundary, tc.exception, tc.remark
                ]);
            }
            
            sheet2.addRow([]);
        }
        
        const sheet3 = workbook.addWorksheet('测试统计');
        this.setupStatsSheet(sheet3);
        
        const stats = this.calculateStats();
        sheet3.addRow(['统计项', '数量']);
        sheet3.addRow(['总用例数', stats.total]);
        sheet3.addRow(['P0用例数', stats.p0]);
        sheet3.addRow(['P1用例数', stats.p1]);
        sheet3.addRow(['P2用例数', stats.p2]);
        sheet3.addRow([]);
        sheet3.addRow(['按测试类型统计', '']);
        for (const [type, count] of Object.entries(stats.byType)) {
            sheet3.addRow([type, count]);
        }
        sheet3.addRow([]);
        sheet3.addRow(['按模块统计', '']);
        for (const [module, count] of Object.entries(stats.byModule)) {
            sheet3.addRow([module, count]);
        }
        
        await workbook.xlsx.writeFile(outputPath);
        return outputPath;
    }

    setupSummarySheet(sheet) {
        sheet.columns = [
            { header: '用例编号', key: 'id', width: 10 },
            { header: '所属模块', key: 'module', width: 15 },
            { header: '用例名称', key: 'name', width: 30 },
            { header: '测试类型', key: 'type', width: 12 },
            { header: '前置条件', key: 'precondition', width: 25 },
            { header: '测试步骤', key: 'steps', width: 40 },
            { header: '测试数据', key: 'testData', width: 20 },
            { header: '预期结果', key: 'expected', width: 30 },
            { header: '优先级', key: 'priority', width: 8 },
            { header: '关联需求', key: 'related', width: 10 },
            { header: '边界值', key: 'boundary', width: 20 },
            { header: '异常场景', key: 'exception', width: 20 },
            { header: '备注', key: 'remark', width: 20 }
        ];
        
        sheet.getRow(1).font = { bold: true };
        sheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF1890FF' }
        };
        sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        
        for (const col of sheet.columns) {
            col.alignment = { vertical: 'top', wrapText: true };
        }
    }

    setupModuleSheet(sheet) {
        sheet.columns = [
            { header: '用例编号', key: 'id', width: 10 },
            { header: '所属模块', key: 'module', width: 15 },
            { header: '用例名称', key: 'name', width: 30 },
            { header: '测试类型', key: 'type', width: 12 },
            { header: '前置条件', key: 'precondition', width: 25 },
            { header: '测试步骤', key: 'steps', width: 40 },
            { header: '测试数据', key: 'testData', width: 20 },
            { header: '预期结果', key: 'expected', width: 30 },
            { header: '优先级', key: 'priority', width: 8 },
            { header: '关联需求', key: 'related', width: 10 },
            { header: '边界值', key: 'boundary', width: 20 },
            { header: '异常场景', key: 'exception', width: 20 },
            { header: '备注', key: 'remark', width: 20 }
        ];
        
        for (const col of sheet.columns) {
            col.alignment = { vertical: 'top', wrapText: true };
        }
    }

    setupStatsSheet(sheet) {
        sheet.columns = [
            { header: '统计项', key: 'item', width: 20 },
            { header: '数量', key: 'count', width: 15 }
        ];
        
        sheet.getRow(1).font = { bold: true };
        sheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF1890FF' }
        };
        sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    }

    calculateStats() {
        const stats = {
            total: this.testCases.length,
            p0: this.testCases.filter(tc => tc.priority === 'P0').length,
            p1: this.testCases.filter(tc => tc.priority === 'P1').length,
            p2: this.testCases.filter(tc => tc.priority === 'P2').length,
            byType: {},
            byModule: {}
        };
        
        for (const tc of this.testCases) {
            stats.byType[tc.type] = (stats.byType[tc.type] || 0) + 1;
            stats.byModule[tc.module] = (stats.byModule[tc.module] || 0) + 1;
        }
        
        return stats;
    }
}

async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('Usage: node generate-testcases.js <prd-file-path>');
        console.log('Example: node generate-testcases.js .solarwire/my-project/solarwire-prd.md');
        process.exit(1);
    }
    
    const prdPath = args[0];
    
    if (!fs.existsSync(prdPath)) {
        console.error(`Error: File not found: ${prdPath}`);
        process.exit(1);
    }
    
    const outputDir = path.dirname(prdPath);
    const outputPath = path.join(outputDir, 'test-cases.xlsx');
    
    console.log(`Parsing PRD: ${prdPath}`);
    
    const converter = new PRDToTestCaseConverter(prdPath);
    converter.parse();
    converter.generateFromUserStories();
    converter.generateFromFeatures();
    converter.generateFromFlows();
    
    console.log(`Generated ${converter.testCases.length} test cases`);
    console.log(`Writing Excel: ${outputPath}`);
    
    await converter.generateExcel(outputPath);
    
    console.log('Done!');
    console.log(`\nStatistics:`);
    const stats = converter.calculateStats();
    console.log(`  Total: ${stats.total}`);
    console.log(`  P0: ${stats.p0}, P1: ${stats.p1}, P2: ${stats.p2}`);
}

main().catch(console.error);
