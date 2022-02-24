import { shouldTransform } from '../jest-preprocessor';

describe('jest preprocessor', () => {
  describe('in CJS mode', () => {
    it('shouldTransform', () => {
      expect(shouldTransform('file.ts', '', false)).toBe(true);
      expect(shouldTransform('file.d.ts', '', false)).toBe(true);
      expect(shouldTransform('file.tsx', '', false)).toBe(true);
      expect(shouldTransform('file.jsx', '', false)).toBe(true);
      expect(shouldTransform('file.mjs', '', false)).toBe(true);
      expect(shouldTransform('file.cjs', '', false)).toBe(false);
      expect(shouldTransform('file.css', '', false)).toBe(true);
      expect(shouldTransform('file.CsS', '', false)).toBe(true);
      expect(shouldTransform('file.css?tag=my-cmp', '', false)).toBe(true);
    });

    it('shouldTransform js ext with es module imports/exports', () => {
      expect(shouldTransform('file.js', 'import {} from "./file";', false)).toBe(true);
      expect(shouldTransform('file.js', 'import.meta.url', false)).toBe(true);
      expect(shouldTransform('file.js', 'export * from "./file";', false)).toBe(true);
      expect(shouldTransform('file.js', 'console.log("hi")', false)).toBe(false);
    });
  });

  describe('in ESM mode', () => {
    it('shouldTransform', () => {
      expect(shouldTransform('file.ts', '', true)).toBe(true);
      expect(shouldTransform('file.d.ts', '', true)).toBe(true);
      expect(shouldTransform('file.tsx', '', true)).toBe(true);
      expect(shouldTransform('file.jsx', '', true)).toBe(true);
      expect(shouldTransform('file.mjs', '', true)).toBe(false);
      expect(shouldTransform('file.cjs', '', true)).toBe(false);
      expect(shouldTransform('file.css', '', true)).toBe(true);
      expect(shouldTransform('file.CsS', '', true)).toBe(true);
      expect(shouldTransform('file.css?tag=my-cmp', '', true)).toBe(true);
    });

    it('shouldTransform returns false for js ext with es module imports/exports', () => {
      expect(shouldTransform('file.js', 'import {} from "./file";', true)).toBe(false);
      expect(shouldTransform('file.js', 'import.meta.url', true)).toBe(false);
      expect(shouldTransform('file.js', 'export * from "./file";', true)).toBe(false);
      expect(shouldTransform('file.js', 'console.log("hi")', true)).toBe(false);
    });
  });
});
