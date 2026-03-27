<script setup>
import { ref, onMounted } from 'vue'
import { parse } from './lib/parser.js'
import { render as renderSvg } from './lib/renderer.js'

const defaultCode = `!title="Login Page"
!bg=#f5f5f5

[] @(0,0) w=400 h=500 bg=#fff

"Welcome Back" @(130,80) size=24 bold
"Please sign in" @(140,115) c=#666

"Email" @(50,180)
["Enter your email"] @(50,205) w=300 h=44 bg=#fff b=#ddd note="Email input field"

"Password" @(50,280)
["Enter password"] @(50,305) w=300 h=44 bg=#fff b=#ddd note="Password input field"

["Sign In"] @(50,420) w=300 h=48 bg=#A8B1FF c=white size=16 note="Submit login form"

"No account?" @(100,500) c=#666
"Sign up" @(260,500) c=#A8B1FF`

const code = ref(defaultCode)
const svgOutput = ref('')
const error = ref('')
const showNotes = ref(true)
const loading = ref(false)
const loadError = ref('')
const scale = ref(1)
const panX = ref(0)
const panY = ref(0)
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })

let debounceTimer = null

onMounted(() => {
  render()
})

function render() {
  error.value = ''
  try {
    const ast = parse(code.value)
    svgOutput.value = renderSvg(ast, { showNotes: showNotes.value })
  } catch (e) {
    error.value = e.message || String(e)
  }
}

function handleInput() {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(render, 300)
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

function zoomIn() {
  scale.value = Math.min(scale.value * 1.2, 3)
}

function zoomOut() {
  scale.value = Math.max(scale.value / 1.2, 0.1)
}

function resetZoom() {
  scale.value = 1
  panX.value = 0
  panY.value = 0
}

function startDrag(e) {
  isDragging.value = true
  dragStart.value = { x: e.clientX - panX.value, y: e.clientY - panY.value }
}

function onDrag(e) {
  if (!isDragging.value) return
  panX.value = e.clientX - dragStart.value.x
  panY.value = e.clientY - dragStart.value.y
}

function endDrag() {
  isDragging.value = false
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
["Enter your email"] @(50,205) w=300 h=44 bg=#fff b=#ddd note="Email input field"

"Password" @(50,280)
["Enter password"] @(50,305) w=300 h=44 bg=#fff b=#ddd note="Password input field"

["Sign In"] @(50,420) w=300 h=48 bg=#A8B1FF c=white size=16 note="Submit login form"`
  },
  {
    name: 'Dashboard',
    code: `!title="Dashboard"
!bg=#f5f5f5

[] @(0,0) w=800 h=600 bg=#fff

[] @(0,0) w=200 h=600 bg=#1a1a2e

(("SW")) @(20,20) w=40 h=40 bg=#A8B1FF c=white
"SolarWire" @(70,28) c=white bold

"Dashboard" @(20,100) c=#A8B1FF
"Users" @(20,140) c=#aaa
"Settings" @(20,180) c=#aaa

[] @(220,20) w=180 h=100 bg=#fff r=8 note="Total users card"
"Total Users" @(240,40) c=#666
"12345" @(240,70) size=24 bold

[] @(420,20) w=180 h=100 bg=#fff r=8 note="Revenue card"
"Revenue" @(440,40) c=#666
"45678" @(440,70) size=24 bold`
  },
  {
    name: 'Mobile App',
    code: `!title="Mobile App"
!bg=#f5f5f5

[] @(0,0) w=375 h=812 bg=#fff

[] @(0,0) w=375 h=44 bg=#A8B1FF
"9:41" @(170,12) c=white bold

[] @(0,44) w=375 h=60 bg=#A8B1FF
"Home" @(165,64) c=white size=18 bold

"Good Morning!" @(20,130) size=20 bold

[] @(20,180) w=160 h=80 bg=#e8f5e9 r=12 note="Balance card"
"Balance" @(40,195) c=#666 size=12
"12345" @(40,220) size=20 bold c=#27ae60

[] @(195,180) w=160 h=80 bg=#e3f2fd r=12 note="Points card"
"Points" @(215,195) c=#666 size=12
"2450" @(215,220) size=20 bold c=#2196f3`
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
        <button @click="zoomOut" class="btn btn-icon" title="Zoom Out">−</button>
        <span class="zoom-level">{{ Math.round(scale.value * 100) }}%</span>
        <button @click="zoomIn" class="btn btn-icon" title="Zoom In">+</button>
        <button @click="resetZoom" class="btn" title="Reset">Reset</button>
        <button @click="copyCode" class="btn">Copy Code</button>
        <button @click="downloadSVG" class="btn btn-primary" :disabled="!svgOutput">Download SVG</button>
      </div>
    </div>
    
    <div class="editor-container">
      <div class="editor-panel">
        <div class="panel-header">Code</div>
        <textarea 
          v-model="code" 
          @input="handleInput"
          class="code-editor"
          spellcheck="false"
          placeholder="Enter SolarWire code here..."
        ></textarea>
      </div>
      
      <div class="preview-panel">
        <div class="panel-header">Preview</div>
        <div 
          class="preview-content"
          @mousedown="startDrag"
          @mousemove="onDrag"
          @mouseup="endDrag"
          @mouseleave="endDrag"
        >
          <div v-if="loading" class="loading">Loading...</div>
          <div v-else-if="error" class="error">{{ error }}</div>
          <div 
            v-else-if="svgOutput" 
            class="svg-container" 
            :style="{ transform: `translate(${panX}px, ${panY}px) scale(${scale})`, cursor: isDragging ? 'grabbing' : 'grab' }"
            v-html="svgOutput"
          ></div>
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
  flex-shrink: 0;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
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
  font-size: 14px;
}

select:hover{
  background: #4a4a4a;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #ccc;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
}

.btn {
  padding: 6px 12px;
  background: #3c3c3c;
  color: #fff;
  border: 1px solid #555;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn:hover{
  background: #4a4a4a;
}

.btn-icon {
  width: 32px;
  padding: 6px 0;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
}

.btn-primary{
  background: #A8B1FF;
  border-color: #A8B1FF;
}

.btn-primary:hover{
  background: #8B96E8;
}

.btn:disabled{
  opacity: 0.5;
  cursor: not-allowed;
}

.zoom-level {
  color: #ccc;
  font-size: 12px;
  min-width: 40px;
  text-align: center;
}

.editor-container{
  display: flex;
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

.editor-panel,
.preview-panel{
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

.editor-panel{
  border-right: 1px solid #3c3c3c;
}

.panel-header{
  padding: 8px 16px;
  background: #252526;
  color: #ccc;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  border-bottom: 1px solid #3c3c3c;
  flex-shrink: 0;
}

.code-editor{
  flex: 1;
  padding: 16px;
  background: #1e1e1e;
  color: #d4d4d4;
  border: none;
  resize: none;
  font-family: 'Fira Code', 'Monaco', 'Menlo', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.6;
  outline: none;
  min-height: 0;
  box-sizing: border-box;
}

.code-editor:focus{
  background: #1a1a1a;
}

.code-editor::placeholder{
  color: #666;
}

.preview-content{
  flex: 1;
  padding: 16px;
  background: #f5f5f5;
  overflow: auto;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  min-height: 0;
  user-select: none;
}

.svg-container{
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
  transform-origin: 0 0;
  transition: transform 0.1s ease;
}

.svg-container :deep(svg){
  display: block;
}

.loading{
  color: #666;
  font-size: 14px;
}

.error{
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

.placeholder{
  color: #999;
  font-size: 14px;
}

@media (max-width: 768px) {
  .editor-container{
    flex-direction: column;
  }
  
  .editor-panel{
    border-right: none;
    border-bottom: 1px solid #3c3c3c;
    min-height: 200px;
  }
  
  .toolbar{
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .toolbar-left, .toolbar-right{
    flex-wrap: wrap;
  }
}
</style>
