import * as d from '../../../declarations';
import { getCssImports, getModuleId, replaceImportDeclarations } from '../css-imports';
import { mockBuildCtx, mockConfig } from '../../../testing/mocks';
import { normalizePath } from '../../util';
import * as path from 'path';


describe('css-imports', () => {
  const root = path.resolve('/');
  const config = mockConfig();
  let buildCtx: d.BuildCtx;

  config.sys.resolveModule = (_fromDir, moduleId) => {
    return `MOCKED_RESOLVE:${moduleId}`;
  };

  beforeEach(() => {
    buildCtx = mockBuildCtx(config);
  });


  describe('replaceImportDeclarations',  () => {

    it('replace node_module imports', () => {
      const styleText = `@import '~@ionic/core/dist/ionic/ionic.css'; body { color: red; }`;
      const cssImports: d.CssImportData[] = [
        {
          filePath: `/node_modules/@ionic/core/dist/ionic/ionic.css`,
          importDeclaration: `@import '~@ionic/core/dist/ionic/ionic.css';`,
          url: `~@ionic/core/dist/ionic/ionic.css`,
          styleText: `div { color: blue; }`
        },
      ];
      const output = replaceImportDeclarations(styleText, cssImports);
      expect(output).toBe(`div { color: blue; } body { color: red; }`);
    });

    it('replace local imports', () => {
      const styleText = `@import "file-a.css"; @import "./file-b.css"; body { color: red; }`;
      const cssImports: d.CssImportData[] = [
        {
          filePath: `/src/cmp/file-a.css`,
          importDeclaration: `@import "file-a.css";`,
          url: `file-a.css`,
          styleText: `div { color: blue; }`
        },
        {
          filePath: `/src/cmp/file-b.css`,
          importDeclaration: `@import "./file-b.css";`,
          url: `./file-c.css`,
          styleText: `span { color: green; }`
        },
      ];
      const output = replaceImportDeclarations(styleText, cssImports);
      expect(output).toBe(`div { color: blue; } span { color: green; } body { color: red; }`);
    });

    it('do nothing for no imports', () => {
      const styleText = `body { color: red; }`;
      const cssImports: d.CssImportData[] = [];
      const output = replaceImportDeclarations(styleText, cssImports);
      expect(output).toBe(`body { color: red; }`);
    });

    it('do nothing for empty string', () => {
      const styleText = ``;
      const cssImports: d.CssImportData[] = [];
      const output = replaceImportDeclarations(styleText, cssImports);
      expect(output).toBe(``);
    });

  });


  describe('getCssImports', () => {

    it('scss extension', () => {
      const filePath = normalizePath(path.join(root, 'src', 'cmp', 'file-a.scss'));
      const content = `
        @import "file-b";
      `;
      const results = getCssImports(config, buildCtx, filePath, content);
      expect(results).toEqual([
        {
          filePath: normalizePath(path.join(root, 'src', 'cmp', 'file-b.scss')),
          importDeclaration: `@import "file-b";`,
          url: `file-b`
        }
      ]);
    });

    it('less extension', () => {
      const filePath = normalizePath(path.join(root, 'src', 'cmp', 'file-a.LESS'));
      const content = `
        @import "file-b";
      `;
      const results = getCssImports(config, buildCtx, filePath, content);
      expect(results).toEqual([
        {
          filePath: normalizePath(path.join(root, 'src', 'cmp', 'file-b.LESS')),
          importDeclaration: `@import "file-b";`,
          url: `file-b`
        }
      ]);
    });

    it('url()', () => {
      const filePath = normalizePath(path.join(root, 'src', 'cmp', 'file-a.css'));
      const content = `
        @import url("http://stenciljs.com/build/app/app.css");
        @import url("HTTPS://stenciljs.com/build/app/app.css");
        @import url('//stenciljs.com/build/app/app.css');
        @import url('/build/app/app.css');
        @import url('app.css');
      `;
      const results = getCssImports(config, buildCtx, filePath, content);
      expect(results).toEqual([]);
    });

    it('double quote, relative path @import', () => {
      const filePath = normalizePath(path.join(root, 'src', 'cmp', 'file-a.css'));
      const content = `
        @import "file-b.css";
        @import "./file-c.css";
        @import "../global/file-d.css";
      `;
      const results = getCssImports(config, buildCtx, filePath, content);
      expect(results).toEqual([
        {
          filePath: normalizePath(path.join(root, 'src', 'cmp', 'file-b.css')),
          importDeclaration: `@import "file-b.css";`,
          url: `file-b.css`
        },
        {
          filePath: normalizePath(path.join(root, 'src', 'cmp', 'file-c.css')),
          importDeclaration: `@import "./file-c.css";`,
          url: `./file-c.css`
        },
        {
          filePath: normalizePath(path.join(root, 'src', 'global', 'file-d.css')),
          importDeclaration: `@import "../global/file-d.css";`,
          url: `../global/file-d.css`
        },
      ]);
    });

    it('single quote, relative path @import', () => {
      const filePath = normalizePath(path.join(root, 'src', 'cmp', 'file-a.css'));
      const content = `
        @import 'file-b.css';
        @import './file-c.css';
        @import '../global/file-d.css';
      `;
      const results = getCssImports(config, buildCtx, filePath, content);
      expect(results).toEqual([
        {
          filePath: normalizePath(path.join(root, 'src', 'cmp', 'file-b.css')),
          importDeclaration: `@import 'file-b.css';`,
          url: `file-b.css`
        },
        {
          filePath: normalizePath(path.join(root, 'src', 'cmp', 'file-c.css')),
          importDeclaration: `@import './file-c.css';`,
          url: `./file-c.css`
        },
        {
          filePath: normalizePath(path.join(root, 'src', 'global', 'file-d.css')),
          importDeclaration: `@import '../global/file-d.css';`,
          url: `../global/file-d.css`
        },
      ]);
    });

    it('node path @import', () => {
      const filePath = normalizePath(path.join(root, 'src', 'cmp', 'file-a.css'));
      const content = `
        @import '~@ionic/core/dist/ionic/ionic.css';
      `;
      const results = getCssImports(config, buildCtx, filePath, content);
      expect(results).toEqual([
        {
          filePath: `MOCKED_RESOLVE:@ionic/core`,
          importDeclaration: `@import '~@ionic/core/dist/ionic/ionic.css';`,
          url: `~@ionic/core/dist/ionic/ionic.css`
        },
      ]);
    });

    it('absolute path @import', () => {
      const filePath = normalizePath(path.join(root, 'src', 'cmp', 'file-a.css'));
      const content = `
        @import '${normalizePath(path.join(root, 'src', 'file-b.css'))}';
      `;
      const results = getCssImports(config, buildCtx, filePath, content);
      expect(results).toEqual([
        {
          filePath: normalizePath(path.join(root, 'src', 'file-b.css')),
          importDeclaration: `@import '/src/file-b.css';`,
          url: `/src/file-b.css`
        },
      ]);
    });

    it('no @import', () => {
      const filePath = normalizePath(path.join(root, 'src', 'file-a.css'));
      const content = `body { color: red; }`;
      const results = getCssImports(config, buildCtx, filePath, content);
      expect(results).toEqual([]);
    });

  });

  describe('getModuleId', () => {

    it('getModuleId non-scoped package', () => {
      expect(getModuleId('~ionicons/dist/css/ionicons.css')).toBe('ionicons');
      expect(getModuleId('ionicons/dist/css/ionicons.css')).toBe('ionicons');
    });

    it('getModuleId scoped package', () => {
      expect(getModuleId('~@ionic/core/dist/ionic/css/ionic.css')).toBe('@ionic/core');
      expect(getModuleId('@ionic/core/dist/ionic/css/ionic.css')).toBe('@ionic/core');
    });

  });

});
