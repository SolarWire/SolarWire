<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
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

const examples = [
  {
    name: 'Login Form',
    code: `!title="Login Page"
!bg=#f5f5f5
!size=14
!line-height=1.5

[] @(0,0) w=400 h=560 bg=#fff

"Welcome Back" @(130,80) size=24 bold
"Please sign in to continue" @(125,115) c=#666 size=12

"Email Address" @(50,160) size=12 bold
["you@example.com"] @(50,185) w=300 h=48 bg=#fff b=#ddd r=6 note="Email input field with placeholder"

"Password" @(50,260) size=12 bold
["••••••••"] @(50,285) w=300 h=48 bg=#fff b=#ddd r=6 note="Password input field"

"Forgot password?" @(260,345) c=#A8B1FF size=11 align=r

["Sign In"] @(50,380) w=300 h=52 bg=#A8B1FF c=white size=16 bold r=6 note="Primary action button"

"Don't have an account?" @(90,470) c=#666 size=12
"Sign up" @(270,470) c=#A8B1FF size=12 bold`
  },
  {
    name: 'Dashboard',
    code: `!title="Admin Dashboard"
!bg=#f5f5f5
!size=14

[] @(0,0) w=1000 h=650 bg=#fff

[] @(0,0) w=220 h=650 bg=#1e1e2e
(("🎨")) @(24,24) w=48 h=48 bg=#A8B1FF c=white r=8
"SolarWire" @(82,48) c=white size=18 bold

"Overview" @(24,100) c=#A8B1FF size=13
"Analytics" @(24,135) c=#94a3b8 size=13
"Projects" @(24,170) c=#94a3b8 size=13
"Team" @(24,205) c=#94a3b8 size=13
"Settings" @(24,240) c=#94a3b8 size=13

[] @(240,24) w=220 h=120 bg=#fff r=12 b=#e2e8f0 note="Revenue statistics card"
"Total Revenue" @(260,52) c=#64748b size=12
"$128,450" @(260,92) size=28 bold c=#1e293b
"+12.5%" @(420,92) size=13 c=#22c55e align=r

[] @(480,24) w=220 h=120 bg=#fff r=12 b=#e2e8f0 note="Users statistics card"
"Active Users" @(500,52) c=#64748b size=12
"3,240" @(500,92) size=28 bold c=#1e293b
"+8.2%" @(660,92) size=13 c=#22c55e align=r

[] @(720,24) w=220 h=120 bg=#fff r=12 b=#e2e8f0 note="Projects statistics card"
"Total Projects" @(740,52) c=#64748b size=12
"156" @(740,92) size=28 bold c=#1e293b
"+3.1%" @(900,92) size=13 c=#ef4444 align=r

[] @(240,168) w=700 h=40 bg=#e2e8f0 r=8
"Recent Projects" @(260,192) c=#1e293b size=14 bold
"View All" @(900,192) c=#A8B1FF size=12 align=r

[] @(240,220) w=700 h=80 bg=#fff r=8 b=#e2e8f0
(("📊")) @(260,245) w=40 h=40 bg=#dbeafe c=#3b82f6 r=8
"Website Redesign" @(310,240) c=#1e293b size=13 bold
"Marketing Team" @(310,265) c=#64748b size=11
"In Progress" @(860,255) c=#f59e0b size=12 align=r

[] @(240,316) w=700 h=80 bg=#fff r=8 b=#e2e8f0
(("🚀")) @(260,341) w=40 h=40 bg=#dcfce7 c=#22c55e r=8
"Mobile App Launch" @(310,336) c=#1e293b size=13 bold
"Product Team" @(310,361) c=#64748b size=11
"Completed" @(875,351) c=#22c55e size=12 align=r`
  },
  {
    name: 'Mobile App',
    code: `!title="Mobile App"
!bg=#f8fafc
!size=14

[] @(0,0) w=375 h=812 bg=#fff

[] @(0,0) w=375 h=54 bg=#ffffff b=#f1f5f9
"9:41" @(42,30) c=#0f172a size=15 bold
"📶 🔋" @(310,30) c=#64748b size=14 align=r

[] @(0,54) w=375 h=60 bg=#fff
"🔙" @(20,86) c=#0f172a size=18
"Discover" @(177,86) c=#0f172a size=17 bold
"🔔" @(335,86) c=#0f172a size=18 align=r

"Featured" @(20,140) c=#0f172a size=16 bold
"See all" @(330,140) c=#A8B1FF size=13 align=r

[] @(20,160) w=335 h=180 bg=#A8B1FF r=16 note="Featured card"
"🎨 Design Inspiration" @(40,270) c=#fff size=18 bold
"Explore creative UI ideas" @(40,300) c=#f1f5f9 size=13

"Categories" @(20,365) c=#0f172a size=16 bold

[] @(20,385) w=75 h=90 bg=#fef3c7 r=12
"🎮" @(57,420) size=28
"Games" @(57,455) c=#0f172a size=11

[] @(105,385) w=75 h=90 bg=#dbeafe r=12
"📚" @(142,420) size=28
"Books" @(142,455) c=#0f172a size=11

[] @(190,385) w=75 h=90 bg=#fce7f3 r=12
"🎵" @(227,420) size=28
"Music" @(227,455) c=#0f172a size=11

[] @(275,385) w=75 h=90 bg=#dcfce7 r=12
"🏃" @(312,420) size=28
"Sports" @(312,455) c=#0f172a size=11

"Popular Today" @(20,495) c=#0f172a size=16 bold

[] @(20,515) w=335 h=80 bg=#fff r=12 b=#f1f5f9
(("🔥")) @(40,540) w=44 h=44 bg=#fee2e2 c=#ef4444 r=10
"Top 10 UI Trends" @(96,535) c=#0f172a size=14 bold
"12.5K views" @(96,565) c=#64748b size=11

[] @(20,610) w=335 h=80 bg=#fff r=12 b=#f1f5f9
(("💡")) @(40,635) w=44 h=44 bg=#fef3c7 c=#f59e0b r=10
"Productivity Hacks" @(96,630) c=#0f172a size=14 bold
"8.2K views" @(96,660) c=#64748b size=11

[] @(0,712) w=375 h=100 bg=#ffffff b=#f1f5f9
"🏠" @(56,745) c=#A8B1FF size=22
"Discover" @(56,775) c=#A8B1FF size=11
"🔍" @(160,745) c=#94a3b8 size=22
"Search" @(160,775) c=#94a3b8 size=11
"❤️" @(263,745) c=#94a3b8 size=22
"Saved" @(263,775) c=#94a3b8 size=11
"👤" @(319,745) c=#94a3b8 size=22
"Profile" @(319,775) c=#94a3b8 size=11 align=r`
  },
  {
    name: 'Complete Showcase',
    code: `!title="SolarWire Showcase"
!c=#1a1a2e
!size=14
!bg=#f8fafc
!r=0

[] @(0,0) w=1200 h=800 bg=#ffffff

"🎨 SolarWire Showcase" @(40,30) size=28 bold
"A comprehensive demonstration of all SolarWire elements" @(40,70) c=#64748b size=13

[] @(40,110) w=360 h=280 bg=#ffffff b=#e2e8f0 r=12
"Buttons" @(60,140) size=16 bold c=#1e293b

["Primary"] @(60,180) w=100 h=42 bg=#6366f1 c=#ffffff r=8 note="Primary button
1. Main action
   - Submit forms
   - Confirm actions
2. Visual style
   - Filled background
   - White text"

["Secondary"] @(180,180) w=100 h=42 bg=#ffffff b=#e2e8f0 c=#1e293b r=8 note="Secondary button
1. Alternative action
   - Cancel operations
   - Navigate back
2. Visual style
   - Border only
   - Dark text"

["Success"] @(300,180) w=80 h=42 bg=#22c55e c=#ffffff r=8

["Danger"] @(60,240) w=80 h=42 bg=#ef4444 c=#ffffff r=8

["Warning"] @(160,240) w=80 h=42 bg=#f59e0b c=#ffffff r=8

["Ghost"] @(260,240) w=80 h=42 bg=#ffffff c=#6366f1 r=8 b=#6366f1

["Disabled"] @(60,300) w=100 h=42 bg=#e2e8f0 c=#94a3b8 r=8

["Loading..."] @(180,300) w=100 h=42 bg=#6366f1 c=#ffffff r=8

[] @(420,110) w=360 h=280 bg=#ffffff b=#e2e8f0 r=12
"Form Elements" @(440,140) size=16 bold c=#1e293b

"Email Address" @(440,180) size=12 c=#475569
["john@example.com"] @(440,205) w=320 h=44 bg=#ffffff b=#e2e8f0 c=#94a3b8 r=8 note="Email input
1. Validation
   - Email format check
   - Required field
2. Features
   - Auto-complete
   - Clear button"

"Password" @(440,270) size=12 c=#475569
["••••••••"] @(440,295) w=320 h=44 bg=#ffffff b=#e2e8f0 c=#1e293b r=8

["Remember me"] @(440,355) w=20 h=20 bg=#6366f1 c=#ffffff r=4
"Remember me" @(468,358) size=13

[] @(800,110) w=360 h=280 bg=#ffffff b=#e2e8f0 r=12
"Cards & Avatars" @(820,140) size=16 bold c=#1e293b

("User Profile Card") @(820,180) w=320 h=100 bg=#f1f5f9 r=12 note="Profile card
1. Display info
   - User avatar
   - Name and email
   - Role badge
2. Actions
   - Edit profile
   - View details"

(("JD")) @(840,205) w=50 h=50 bg=#6366f1 c=#ffffff note="Avatar
1. Content
   - User initials
   - Or profile image
2. Size options
   - Small: 32px
   - Medium: 48px
   - Large: 64px"

"John Doe" @(904,215) size=15 bold c=#1e293b
"Product Designer" @(904,238) size=12 c=#64748b

["Edit"] @(1060,215) w=60 h=32 bg=#ffffff b=#e2e8f0 c=#1e293b r=6 size=12

(("AB")) @(820,300) w=40 h=40 bg=#22c55e c=#ffffff
(("CD")) @(870,300) w=40 h=40 bg=#f59e0b c=#ffffff
(("EF")) @(920,300) w=40 h=40 bg=#ef4444 c=#ffffff
(("GH")) @(970,300) w=40 h=40 bg=#8b5cf6 c=#ffffff
(("IJ")) @(1020,300) w=40 h=40 bg=#06b6d4 c=#ffffff

"+5 more" @(1080,312) c=#64748b size=12

[] @(40,420) w=540 h=340 bg=#ffffff b=#e2e8f0 r=12
"Data Table" @(60,450) size=16 bold c=#1e293b

[] @(60,490) w=500 h=40 bg=#f1f5f9 r=8
"ID" @(80,510) size=12 bold c=#475569
"Name" @(160,510) size=12 bold c=#475569
"Status" @(300,510) size=12 bold c=#475569
"Date" @(420,510) size=12 bold c=#475569

[] @(60,530) w=500 h=40 bg=#ffffff
"001" @(80,550) size=12 c=#64748b
"Alice Brown" @(160,550) size=12 c=#1e293b
["Active"] @(300,540) w=70 h=24 bg=#dcfce7 c=#166534 r=4 size=11
"2024-03-15" @(420,550) size=12 c=#64748b

[] @(60,570) w=500 h=40 bg=#fafafa
"002" @(80,590) size=12 c=#64748b
"Bob Smith" @(160,590) size=12 c=#1e293b
["Pending"] @(300,580) w=70 h=24 bg=#fef3c7 c=#92400e r=4 size=11
"2024-03-14" @(420,590) size=12 c=#64748b

[] @(60,610) w=500 h=40 bg=#ffffff
"003" @(80,630) size=12 c=#64748b
"Carol White" @(160,630) size=12 c=#1e293b
["Inactive"] @(300,620) w=70 h=24 bg=#f1f5f9 c=#64748b r=4 size=11
"2024-03-10" @(420,630) size=12 c=#64748b

[] @(600,420) w=560 h=340 bg=#ffffff b=#e2e8f0 r=12
"Status & Indicators" @(620,450) size=16 bold c=#1e293b

"Status Badges" @(620,490) size=13 c=#475569

["Success"] @(620,520) w=80 h=28 bg=#dcfce7 c=#166534 r=6 size=12
["Warning"] @(720,520) w=80 h=28 bg=#fef3c7 c=#92400e r=6 size=12
["Error"] @(820,520) w=80 h=28 bg=#fee2e2 c=#991b1b r=6 size=12
["Info"] @(920,520) w=80 h=28 bg=#dbeafe c=#1e40af r=6 size=12

"Progress Indicators" @(620,580) size=13 c=#475569

[] @(620,610) w=200 h=8 bg=#e2e8f0 r=4
[] @(620,610) w=150 h=8 bg=#6366f1 r=4

[] @(620,640) w=200 h=8 bg=#e2e8f0 r=4
[] @(620,640) w=100 h=8 bg=#22c55e r=4

[] @(620,670) w=200 h=8 bg=#e2e8f0 r=4
[] @(620,670) w=180 h=8 bg=#f59e0b r=4

"75%" @(840,620) size=12 c=#1e293b
"50%" @(840,650) size=12 c=#1e293b
"90%" @(840,680) size=12 c=#1e293b

"Navigation" @(620,720) size=13 c=#475569

["Dashboard"] @(620,750) w=90 h=36 bg=#6366f1 c=#ffffff r=6 size=12
["Projects"] @(730,750) w=80 h=36 bg=#ffffff b=#e2e8f0 c=#475569 r=6 size=12
["Settings"] @(830,750) w=80 h=36 bg=#ffffff b=#e2e8f0 c=#475569 r=6 size=12
["Help"] @(930,750) w=60 h=36 bg=#ffffff b=#e2e8f0 c=#475569 r=6 size=12`
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
  padding: 8px 0;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
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
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

.resizer{
  width: 6px;
  background: #3c3c3c;
  cursor: col-resize;
  flex-shrink: 0;
  transition: background 0.2s ease;
}

.resizer:hover{
  background: #A8B1FF;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hint {
  font-weight: normal;
  color: #888;
  font-size: 11px;
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
