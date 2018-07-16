import * as d from '../../../declarations';
import { getCssImports, getModuleId, isCssNodeModule, isLocalCssImport, replaceImportDeclarations } from '../css-imports';
import { mockBuildCtx, mockConfig } from '../../../testing/mocks';
import { normalizePath } from '../../util';
import * as path from 'path';


describe('css-imports', () => {
  const root = path.resolve('/');
  const config = mockConfig();
  let buildCtx: d.BuildCtx;

  config.sys.resolveModule = (_fromDir, moduleId) => {
    return normalizePath(path.join(root, 'mocked', 'node_modules', moduleId, 'package.json'));
  };

  beforeEach(() => {
    buildCtx = mockBuildCtx(config);
  });


  describe('isCssNodeModule',  () => {

    it('starts with ~ is node module', () => {
      const url = `~@ionic/core/css/normalize.css`;
      expect(isCssNodeModule(url)).toBe(true);
    });

    it('http url not node module', () => {
      const url = `http://stenciljs.com/styles.css`;
      expect(isCssNodeModule(url)).toBe(false);
    });

    it('local url not node module', () => {
      const url = `styles.css`;
      expect(isCssNodeModule(url)).toBe(false);
    });

  });


  describe('replaceImportDeclarations',  () => {

    it('replace node_module imports w/ styleText', () => {
      const styleText = `@import '~@ionic/core/dist/ionic/ionic.css'; body { color: red; }`;
      const cssImports: d.CssImportData[] = [
        {
          filePath: `/node_modules/@ionic/core/dist/ionic/ionic.css`,
          srcImport: `@import '~@ionic/core/dist/ionic/ionic.css';`,
          url: `~@ionic/core/dist/ionic/ionic.css`,
          styleText: `div { color: blue; }`
        },
      ];
      const output = replaceImportDeclarations(styleText, cssImports, true);
      expect(output).toBe(`div { color: blue; } body { color: red; }`);
    });

    it('replace local imports w/ styleText', () => {
      const styleText = `@import "file-a.css"; @import "./file-b.css"; body { color: red; }`;
      const cssImports: d.CssImportData[] = [
        {
          filePath: `/src/cmp/file-a.css`,
          srcImport: `@import "file-a.css";`,
          url: `file-a.css`,
          styleText: `div { color: blue; }`
        },
        {
          filePath: `/src/cmp/file-b.css`,
          srcImport: `@import "./file-b.css";`,
          url: `./file-c.css`,
          styleText: `span { color: green; }`
        },
      ];
      const output = replaceImportDeclarations(styleText, cssImports, true);
      expect(output).toBe(`div { color: blue; } span { color: green; } body { color: red; }`);
    });

    it('do nothing for no imports', () => {
      const styleText = `body { color: red; }`;
      const cssImports: d.CssImportData[] = [];
      const output = replaceImportDeclarations(styleText, cssImports, true);
      expect(output).toBe(`body { color: red; }`);
    });

    it('do nothing for empty string', () => {
      const styleText = ``;
      const cssImports: d.CssImportData[] = [];
      const output = replaceImportDeclarations(styleText, cssImports, true);
      expect(output).toBe(``);
    });

  });


  describe('isLocalCssImport', () => {

    it('not local, http w/ spaces url', () => {
      const i = `@import url(   "  https//stenciljs.com/some.css);`;
      expect(isLocalCssImport(i)).toBe(false);
    });

    it('not local, // url', () => {
      const i = `@import url(//stenciljs.com/some.css);`;
      expect(isLocalCssImport(i)).toBe(false);
    });

    it('not local, https url', () => {
      const i = `@import url(https://stenciljs.com/some.css);`;
      expect(isLocalCssImport(i)).toBe(false);
    });

    it('not local, http url, no quotes', () => {
      const i = `@import url(http://stenciljs.com/some.css);`;
      expect(isLocalCssImport(i)).toBe(false);
    });

    it('not local, http url, double quotes', () => {
      const i = `@import url("http://stenciljs.com/some.css");`;
      expect(isLocalCssImport(i)).toBe(false);
    });

    it('not local, http url, single quotes', () => {
      const i = `@import url('http://stenciljs.com/some.css');`;
      expect(isLocalCssImport(i)).toBe(false);
    });

    it('is local, url, single quotes', () => {
      const i = `@import url('some.css');`;
      expect(isLocalCssImport(i)).toBe(true);
    });

    it('is local, url, double quotes', () => {
      const i = `@import url("some.css");`;
      expect(isLocalCssImport(i)).toBe(true);
    });

    it('is local, double quotes', () => {
      const i = `@import "some.css";`;
      expect(isLocalCssImport(i)).toBe(true);
    });

    it('is local, single quotes', () => {
      const i = `@import 'some.css';`;
      expect(isLocalCssImport(i)).toBe(true);
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
          srcImport: `@import "file-b";`,
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
          filePath: normalizePath(path.join(root, 'src', 'cmp', 'file-b.less')),
          srcImport: `@import "file-b";`,
          url: `file-b`
        }
      ]);
    });

    it('url() w/out quotes', () => {
      const filePath = normalizePath(path.join(root, 'src', 'cmp', 'file-a.scss'));
      const content = `
        @import url(../../node_modules/@ionic/core/css/normalize.css);
      `;
      const results = getCssImports(config, buildCtx, filePath, content);
      expect(results).toEqual([
        {
          filePath: normalizePath(path.join(root, 'node_modules', '@ionic', 'core', 'css', 'normalize.css')),
          srcImport: `@import url(../../node_modules/@ionic/core/css/normalize.css);`,
          url: `../../node_modules/@ionic/core/css/normalize.css`
        }
      ]);
    });

    it('absolute url()', () => {
      const filePath = normalizePath(path.join(root, 'src', 'cmp', 'file-a.scss'));
      const content = `
        @import url('${normalizePath(path.join(root, 'build', 'app', 'app.css'))}');
      `;
      const results = getCssImports(config, buildCtx, filePath, content);
      expect(results).toEqual([
        {
          filePath: normalizePath(path.join(root, 'build', 'app', 'app.css')),
          srcImport: `@import url('${normalizePath(path.join(root, 'build', 'app', 'app.css'))}');`,
          url: `${normalizePath(path.join(root, 'build', 'app', 'app.css'))}`
        }
      ]);
    });

    it('relative url()s', () => {
      const filePath = normalizePath(path.join(root, 'src', 'cmp', 'file-a.css'));
      const content = `
        @import url('file-a.css');
        @import url('./file-b.css');
        @import url('../file-c.css');
      `;
      const results = getCssImports(config, buildCtx, filePath, content);
      expect(results).toEqual([
        {
          filePath: normalizePath(path.join(root, 'src', 'cmp', 'file-a.css')),
          srcImport: `@import url('file-a.css');`,
          url: `file-a.css`
        },
        {
          filePath: normalizePath(path.join(root, 'src', 'cmp', 'file-b.css')),
          srcImport: `@import url('./file-b.css');`,
          url: `./file-b.css`
        },
        {
          filePath: normalizePath(path.join(root, 'src', 'file-c.css')),
          srcImport: `@import url('../file-c.css');`,
          url: `../file-c.css`
        }
      ]);
    });

    it('ignore external url()s', () => {
      const filePath = normalizePath(path.join(root, 'src', 'cmp', 'file-a.css'));
      const content = `
        @import url("http://stenciljs.com/build/app/app.css");
        @import url("HTTPS://stenciljs.com/build/app/app.css");
        @import url('//stenciljs.com/build/app/app.css');
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
          srcImport: `@import "file-b.css";`,
          url: `file-b.css`
        },
        {
          filePath: normalizePath(path.join(root, 'src', 'cmp', 'file-c.css')),
          srcImport: `@import "./file-c.css";`,
          url: `./file-c.css`
        },
        {
          filePath: normalizePath(path.join(root, 'src', 'global', 'file-d.css')),
          srcImport: `@import "../global/file-d.css";`,
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
          srcImport: `@import 'file-b.css';`,
          url: `file-b.css`
        },
        {
          filePath: normalizePath(path.join(root, 'src', 'cmp', 'file-c.css')),
          srcImport: `@import './file-c.css';`,
          url: `./file-c.css`
        },
        {
          filePath: normalizePath(path.join(root, 'src', 'global', 'file-d.css')),
          srcImport: `@import '../global/file-d.css';`,
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
          filePath: normalizePath(path.join(root, 'mocked', 'node_modules', '@ionic', 'core', 'dist', 'ionic', 'ionic.css')),
          srcImport: `@import '~@ionic/core/dist/ionic/ionic.css';`,
          updatedImport: `@import "${normalizePath(path.join(root, 'mocked', 'node_modules', '@ionic', 'core', 'dist', 'ionic', 'ionic.css'))}";`,
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
          srcImport: `@import '${normalizePath(path.join(root, 'src', 'file-b.css'))}';`,
          url: `${normalizePath(path.join(root, 'src', 'file-b.css'))}`
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
