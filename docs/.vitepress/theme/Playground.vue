<script setup>
import { ref, onMounted } from 'vue'

const defaultCode = `!title="Login Page"
!bg=#f5f5f5

// Container
[] @(0,0) w=400 h=500 bg=#fff

// Header
"Welcome Back" @(130,80) size=24 bold
"Please sign in" @(140,115) c=#666

// Form
"Email" @(50,180)
["Enter your email"] @(50,205) w=300 h=44 bg=#fff b=#ddd

"Password" @(50,280)
["Enter password"] @(50,305) w=300 h=44 bg=#fff b=#ddd

// Actions
["Remember me"] @(50,370) w=16 h=16
"Remember me" @(74,372)

["Sign In"] @(50,420) w=300 h=48 bg=#3498db c=white size=16

// Footer
"Don't have an account?" @(100,500) c=#666
"Sign up" @(260,500) c=#3498db`

const code = ref(defaultCode)
const svgOutput = ref('')
const error = ref('')
const showNotes = ref(true)
const loading = ref(true)

let parser = null
let renderer = null

onMounted(async () => {
  try {
    const base = import.meta.env.BASE_URL || '/'
    const parserModule = await import(base + 'lib/parser/index.js')
    const rendererModule = await import(base + 'lib/renderer-svg/index.js')
    parser = parserModule
    renderer = rendererModule
    loading.value = false
    render()
  } catch (e) {
    error.value = 'Failed to load SolarWire libraries: ' + e.message
    loading.value = false
  }
})

function render() {
  if (!parser || !renderer) return
  
  error.value = ''
  try {
    const ast = parser.parse(code.value)
    svgOutput.value = renderer.render(ast, { showNotes: showNotes.value })
  } catch (e) {
    error.value = e.message
  }
}

function downloadSVG() {
  if (!svgOutput.value) return
  const blob = new Blob([svgOutput.value], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'wireframe.svg'
  a.click()
  URL.revokeObjectURL(url)
}

function copyCode() {
  navigator.clipboard.writeText(code.value)
}

const examples = [
  {
    name: 'Login Form',
    code: `!title="Login Page"
!bg=#f5f5f5

[] @(0,0) w=400 h=500 bg=#fff

"Welcome Back" @(130,80) size=24 bold
"Please sign in" @(140,115) c=#666

"Email" @(50,180)
["Enter your email"] @(50,205) w=300 h=44 bg=#fff b=#ddd

"Password" @(50,280)
["Enter password"] @(50,305) w=300 h=44 bg=#fff b=#ddd

["Sign In"] @(50,420) w=300 h=48 bg=#3498db c=white size=16`
  },
  {
    name: 'Dashboard',
    code: `!title="Dashboard"
!bg=#f5f5f5

[] @(0,0) w=800 h=600 bg=#fff

// Sidebar
[] @(0,0) w=200 h=600 bg=#1a1a2e

(("SW")) @(20,20) w=40 h=40 bg=#3498db c=white
"SolarWire" @(70,28) c=white bold

"Dashboard" @(20,100) c=#3498db
"Users" @(20,140) c=#aaa
"Settings" @(20,180) c=#aaa

// Stats
[] @(220,20) w=180 h=100 bg=#fff r=8
"Total Users" @(240,40) c=#666
"12,345" @(240,70) size=24 bold

[] @(420,20) w=180 h=100 bg=#fff r=8
"Revenue" @(440,40) c=#666
"$45,678" @(440,70) size=24 bold`
  },
  {
    name: 'Mobile App',
    code: `!title="Mobile App"
!bg=#f5f5f5

[] @(0,0) w=375 h=812 bg=#fff

// Status Bar
[] @(0,0) w=375 h=44 bg=#3498db
"9:41" @(170,12) c=white bold

// Header
[] @(0,44) w=375 h=60 bg=#3498db
"Home" @(165,64) c=white size=18 bold

// Content
"Good Morning!" @(20,130) size=20 bold

[] @(20,180) w=160 h=80 bg=#e8f5e9 r=12
"Balance" @(40,195) c=#666 size=12
"$12,345" @(40,220) size=20 bold c=#27ae60

[] @(195,180) w=160 h=80 bg=#e3f2fd r=12
"Points" @(215,195) c=#666 size=12
"2,450" @(215,220) size=20 bold c=#2196f3`
  },
  {
    name: 'Data Table',
    code: `!title="User List"
!bg=#f5f5f5

[] @(0,0) w=800 h=500 bg=#fff

"User Management" @(20,30) size=20 bold
["Add User"] @(700,25) w=80 h=36 bg=#3498db c=white r=4

## @(20,80) w=760 border=1
  # bg=#f5f5f5 bold
    "ID"
    "Name"
    "Email"
    "Status"
    "Actions"
  # bg=#fff
    "1"
    "John Doe"
    "john@example.com"
    "Active" c=#27ae60
    ["Edit"] ["Delete"]
  # bg=#f9f9f9
    "2"
    "Jane Smith"
    "jane@example.com"
    "Active" c=#27ae60
    ["Edit"] ["Delete"]`
  }
]

function loadExample(example) {
  code.value = example.code
  render()
}
</script>

<template>
  <div class="playground">
    <div class="toolbar">
      <div class="toolbar-left">
        <span class="title">SolarWire Playground</span>
        <select @change="e => { const idx = e.target.selectedIndex; if (idx > 0) loadExample(examples[idx - 1]); e.target.selectedIndex = 0; }">
          <option selected disabled>Load Example...</option>
          <option v-for="ex in examples" :key="ex.name">{{ ex.name }}</option>
        </select>
      </div>
      <div class="toolbar-right">
        <label class="checkbox">
          <input type="checkbox" v-model="showNotes" @change="render" />
          Show Notes
        </label>
        <button @click="copyCode" class="btn">Copy Code</button>
        <button @click="downloadSVG" class="btn btn-primary" :disabled="!svgOutput">Download SVG</button>
      </div>
    </div>
    
    <div class="editor-container">
      <div class="editor-panel">
        <div class="panel-header">Code</div>
        <textarea 
          v-model="code" 
          @input="render"
          class="code-editor"
          spellcheck="false"
          placeholder="Enter SolarWire code here..."
          :disabled="loading"
        ></textarea>
      </div>
      
      <div class="preview-panel">
        <div class="panel-header">Preview</div>
        <div class="preview-content">
          <div v-if="loading" class="loading">Loading SolarWire...</div>
          <div v-else-if="error" class="error">{{ error }}</div>
          <div v-else-if="svgOutput" class="svg-container" v-html="svgOutput"></div>
          <div v-else class="placeholder">Enter code to see preview</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.playground {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  background: #1e1e1e;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #252526;
  border-bottom: 1px solid #3c3c3c;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

select {
  padding: 6px 12px;
  background: #3c3c3c;
  color: #fff;
  border: 1px solid #555;
  border-radius: 4px;
  cursor: pointer;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #ccc;
  font-size: 14px;
  cursor: pointer;
}

.btn {
  padding: 6px 16px;
  background: #3c3c3c;
  color: #fff;
  border: 1px solid #555;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn:hover {
  background: #4a4a4a;
}

.btn-primary {
  background: #3498db;
  border-color: #3498db;
}

.btn-primary:hover {
  background: #2980b9;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.editor-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.editor-panel,
.preview-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor-panel {
  border-right: 1px solid #3c3c3c;
}

.panel-header {
  padding: 8px 16px;
  background: #252526;
  color: #ccc;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  border-bottom: 1px solid #3c3c3c;
}

.code-editor {
  flex: 1;
  padding: 16px;
  background: #1e1e1e;
  color: #d4d4d4;
  border: none;
  resize: none;
  font-family: 'Fira Code', 'Monaco', 'Menlo', monospace;
  font-size: 14px;
  line-height: 1.6;
  outline: none;
}

.code-editor::placeholder {
  color: #666;
}

.preview-content {
  flex: 1;
  padding: 16px;
  background: #f5f5f5;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.svg-container {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.svg-container :deep(svg) {
  display: block;
}

.loading {
  color: #666;
  font-size: 14px;
}

.error {
  color: #e74c3c;
  background: #fff;
  padding: 16px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 13px;
  white-space: pre-wrap;
  max-width: 100%;
  overflow: auto;
}

.placeholder {
  color: #999;
  font-size: 14px;
}

@media (max-width: 768px) {
  .editor-container {
    flex-direction: column;
  }
  
  .editor-panel {
    border-right: none;
    border-bottom: 1px solid #3c3c3c;
  }
  
  .toolbar {
    flex-wrap: wrap;
    gap: 8px;
  }
}
</style>
