import { convertVueToSolarWire, parseVue } from '../adapters/vue';

describe('Vue Adapter', () => {
  describe('convertVueToSolarWire', () => {
    it('should convert simple Vue button', () => {
      const vue = '<template><button>Click me</button></template>';
      const result = convertVueToSolarWire(vue);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('Click me');
    });

    it('should convert Vue input', () => {
      const vue = '<template><input type="text" placeholder="Enter name" /></template>';
      const result = convertVueToSolarWire(vue);
      
      expect(result.success).toBe(true);
    });

    it('should convert Vue with class', () => {
      const vue = '<template><button class="btn-primary">Submit</button></template>';
      const result = convertVueToSolarWire(vue);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('Submit');
    });

    it('should convert Vue with inline style', () => {
      const vue = '<template><button style="background-color: red">Red</button></template>';
      const result = convertVueToSolarWire(vue);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('Red');
    });

    it('should convert nested Vue elements', () => {
      const vue = `<template><div><h1>Title</h1><button>Click</button></div></template>`;
      const result = convertVueToSolarWire(vue);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('Title');
      expect(result.code).toContain('Click');
    });

    it('should convert Vue checkbox', () => {
      const vue = '<template><input type="checkbox" v-model="checked" /></template>';
      const result = convertVueToSolarWire(vue);
      
      expect(result.success).toBe(true);
    });

    it('should convert Vue select', () => {
      const vue = `<template><select><option>A</option><option>B</option></select></template>`;
      const result = convertVueToSolarWire(vue);
      
      expect(result.success).toBe(true);
    });

    it('should convert Vue image', () => {
      const vue = '<template><img src="logo.png" alt="Logo" /></template>';
      const result = convertVueToSolarWire(vue);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('Logo');
    });

    it('should convert Vue link', () => {
      const vue = '<template><a href="https://example.com">Visit</a></template>';
      const result = convertVueToSolarWire(vue);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('Visit');
    });

    it('should convert Vue text elements', () => {
      const vue = '<template><p>Hello World</p></template>';
      const result = convertVueToSolarWire(vue);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('Hello World');
    });

    it('should convert Vue form with multiple inputs', () => {
      const vue = `
        <template>
          <form>
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <button type="submit">Submit</button>
          </form>
        </template>
      `;
      const result = convertVueToSolarWire(vue);
      
      expect(result.success).toBe(true);
    });

    it('should handle Vue with v-bind', () => {
      const vue = '<template><button :disabled="isDisabled">Click</button></template>';
      const result = convertVueToSolarWire(vue);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('Click');
    });

    it('should handle Vue with v-on', () => {
      const vue = '<template><button @click="handleClick">Click</button></template>';
      const result = convertVueToSolarWire(vue);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('Click');
    });

    it('should handle Vue with v-model', () => {
      const vue = '<template><input v-model="name" placeholder="Name" /></template>';
      const result = convertVueToSolarWire(vue);
      
      expect(result.success).toBe(true);
    });

    it('should handle Vue with v-if', () => {
      const vue = '<template><div v-if="show">Content</div></template>';
      const result = convertVueToSolarWire(vue);
      
      expect(result.success).toBe(true);
    });

    it('should handle Vue with v-for', () => {
      const vue = '<template><ul><li v-for="item in items">{{ item }}</li></ul></template>';
      const result = convertVueToSolarWire(vue);
      
      expect(result.success).toBe(true);
    });

    it('should handle empty template', () => {
      const vue = '<template></template>';
      const result = convertVueToSolarWire(vue);
      
      expect(result.success).toBe(true);
    });

    it('should handle Vue SFC with script and style', () => {
      const vue = `
        <template>
          <button>Click</button>
        </template>
        <script>
        export default {
          name: 'MyButton'
        }
        </script>
        <style scoped>
        button { color: red; }
        </style>
      `;
      const result = convertVueToSolarWire(vue);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('Click');
    });

    it('should handle template without wrapper', () => {
      const vue = '<button>Click</button>';
      const result = convertVueToSolarWire(vue);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('Click');
    });
  });

  describe('parseVue', () => {
    it('should parse Vue to UITree', () => {
      const vue = '<template><button>Test</button></template>';
      const tree = parseVue(vue);
      
      expect(tree.root).toBeDefined();
      expect(tree.metadata.source).toBe('vue');
    });

    it('should handle nested elements', () => {
      const vue = '<template><div><span>Text</span></div></template>';
      const tree = parseVue(vue);
      
      expect(tree.root.children.length).toBeGreaterThan(0);
    });
  });
});
