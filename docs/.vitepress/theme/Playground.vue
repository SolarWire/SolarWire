<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { parse } from './lib/parser.js'
import { render as renderSvg } from './lib/renderer.js'

import loginFormCode from '../../examples/login-form.solarwire?raw'
import dashboardCode from '../../examples/dashboard.solarwire?raw'
import mobileAppCode from '../../examples/mobile-app.solarwire?raw'
import completeShowcaseCode from '../../examples/complete-showcase.solarwire?raw'

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

const examples = [
  { name: 'Login Form', code: loginFormCode },
  { name: 'Dashboard', code: dashboardCode },
  { name: 'Mobile App', code: mobileAppCode },
  { name: 'Complete Showcase', code: completeShowcaseCode }
]

const code = ref(defaultCode)
const svgOutput = ref('')
const error = ref('')
const showNotes = ref(true)
const loading = ref(false)
const scale = ref(1)
const panX = ref(0)
const panY = ref(0)
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const previewRef = ref(null)
const editorWidth = ref(50)
const isResizing = ref(false)
const resizeStartX = ref(0)
const resizeStartWidth = ref(0)

let debounceTimer = null

onMounted(() => {
  render()
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('mousemove', handleResizeMove)
  document.addEventListener('mouseup', handleResizeEnd)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('mousemove', handleResizeMove)
  document.removeEventListener('mouseup', handleResizeEnd)
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

function handleWheel(e) {
  if (e.ctrlKey) {
    e.preventDefault()
    if (e.deltaY < 0) {
      zoomIn()
    } else {
      zoomOut()
    }
  }
}

function handleKeydown(e) {
  if (e.target.tagName === 'TEXTAREA') return
  if (e.key === '+' || e.key === '=') {
    zoomIn()
  } else if (e.key === '-') {
    zoomOut()
  } else if (e.key === '0') {
    resetZoom()
  }
}

function startDrag(e) {
  if (e.button !== 0) return
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

function startResize(e) {
  if (e.button !== 0) return
  isResizing.value = true
  resizeStartX.value = e.clientX
  resizeStartWidth.value = editorWidth.value
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
}

function handleResizeMove(e) {
  if (!isResizing.value) return
  const container = document.querySelector('.editor-container')
  if (!container) return
  const containerRect = container.getBoundingClientRect()
  const deltaX = e.clientX - resizeStartX.value
  const containerWidth = containerRect.width
  const deltaPercent = (deltaX / containerWidth) * 100
  let newWidth = resizeStartWidth.value + deltaPercent
  newWidth = Math.max(20, Math.min(80, newWidth))
  editorWidth.value = newWidth
}

function handleResizeEnd() {
  if (!isResizing.value) return
  isResizing.value = false
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
}

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
        <span class="zoom-level">{{ Math.round(scale * 100) }}%</span>
        <button @click="zoomIn" class="btn btn-icon" title="Zoom In">+</button>
        <button @click="resetZoom" class="btn" title="Reset">Reset</button>
        <button @click="copyCode" class="btn">Copy Code</button>
        <button @click="downloadSVG" class="btn btn-primary" :disabled="!svgOutput">Download SVG</button>
      </div>
    </div>
    
    <div class="editor-container">
      <div class="editor-panel" :style="{ width: `${editorWidth}%` }">
        <div class="panel-header">Code</div>
        <textarea 
          v-model="code" 
          @input="handleInput"
          class="code-editor"
          spellcheck="false"
          placeholder="Enter SolarWire code here..."
        ></textarea>
      </div>
      
      <div class="resizer" @mousedown="startResize"></div>
      
      <div class="preview-panel" :style="{ width: `${100 - editorWidth}%` }">
        <div class="panel-header">Preview <span class="hint">(Ctrl+Scroll to zoom, drag to pan)</span></div>
        <div 
          ref="previewRef"
          class="preview-content"
          @mousedown="startDrag"
          @mousemove="onDrag"
          @mouseup="endDrag"
          @mouseleave="endDrag"
          @wheel="handleWheel"
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
  background: var(--vp-c-bg);
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--vp-c-bg-alt);
  border-bottom: 1px solid var(--vp-c-divider);
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
  color: var(--vp-c-text-1);
}

select {
  padding: 8px 16px;
  background: transparent;
  color: #A8B1FF;
  border: 1px solid #A8B1FF;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

select:hover{
  background: rgba(168, 177, 255, 0.1);
  border-color: #8B96E8;
}

select:focus{
  outline: none;
  border-color: #8B96E8;
  box-shadow: 0 0 0 3px rgba(168, 177, 255, 0.2);
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #A8B1FF;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  padding: 8px 12px;
  border-radius: 20px;
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.checkbox:hover{
  background: rgba(168, 177, 255, 0.1);
  border-color: rgba(168, 177, 255, 0.3);
}

.checkbox input[type="checkbox"] {
  accent-color: #A8B1FF;
  width: 16px;
  height: 16px;
}

.btn {
  padding: 8px 16px;
  background: transparent;
  color: #A8B1FF;
  border: 1px solid #A8B1FF;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn:hover{
  background: rgba(168, 177, 255, 0.1);
  border-color: #8B96E8;
  color: #BEC5FF;
}

.btn-icon {
  width: 36px;
  height: 36px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  line-height: 1;
  border-radius: 50%;
}

.btn-primary{
  background: linear-gradient(135deg, #A8B1FF 0%, #8B96E8 100%);
  border: none;
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(168, 177, 255, 0.3);
  border-radius: 20px;
}

.btn-primary:hover{
  background: linear-gradient(135deg, #8B96E8 0%, #6E7BD1 100%);
  box-shadow: 0 6px 25px rgba(168, 177, 255, 0.5);
  transform: translateY(-2px);
  color: #ffffff;
}

.btn:disabled{
  opacity: 0.5;
  cursor: not-allowed;
}

.zoom-level {
  color: var(--vp-c-text-2);
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
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

.resizer{
  width: 6px;
  background: var(--vp-c-divider);
  cursor: col-resize;
  flex-shrink: 0;
  transition: background 0.2s ease;
}

.resizer:hover{
  background: #A8B1FF;
}

.panel-header{
  padding: 8px 16px;
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  border-bottom: 1px solid var(--vp-c-divider);
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hint {
  font-weight: normal;
  color: var(--vp-c-text-3);
  font-size: 11px;
}

.code-editor{
  flex: 1;
  padding: 16px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
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
  background: var(--vp-c-bg-alt);
}

.code-editor::placeholder{
  color: var(--vp-c-text-3);
}

.preview-content{
  flex: 1;
  padding: 16px;
  background: #f5f5f5;
  overflow: auto;
  display: block;
  min-height: 0;
  user-select: none;
  position: relative;
}

.svg-container{
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
  transform-origin: 0 0;
  transition: transform 0.1s ease;
  display: inline-block;
}

.svg-container :deep(svg){
  display: block;
  max-width: none;
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
  
  .editor-panel,
  .preview-panel{
    width: 100% !important;
  }
  
  .editor-panel{
    border-right: none;
    border-bottom: 1px solid #3c3c3c;
    min-height: 200px;
  }
  
  .resizer{
    display: none;
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
