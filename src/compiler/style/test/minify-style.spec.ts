import * as d from '../../../declarations';
import { getModuleId, getNodeImports, minifyStyle, replaceNodeModuleUrl } from '../minify-style';
import { mockCompilerCtx, mockConfig } from '../../../testing/mocks';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as os from 'os';


describe('minifyStyle',  () => {
  let config: d.Config;
  let compilerCtx: d.CompilerCtx;
  let diagnostics: d.Diagnostic[];

  beforeEach(() => {
    config = mockConfig();
    compilerCtx = mockCompilerCtx();
    diagnostics = [];
  });


  it('handles error', async () => {
    const filePath = path.join(os.tmpdir(), 'my.css');
    config.minifyCss = true;
    const styleText = `@import "./missing-file.css"; /* css */ body { color: #ff0000; }`;
    const output = await minifyStyle(config, compilerCtx, diagnostics, styleText, filePath);

    expect(output).toBe(`body{color:red}`);
    expect(diagnostics).toHaveLength(1);
  });

  it('concat imports when in prod mode and using css @import, and minify', async () => {
    const filePath = path.join(os.tmpdir(), 'my.css');
    fs.writeFileSync(filePath, '');
    const importPath = path.join(os.tmpdir(), 'some-other.css');
    fs.writeFileSync(importPath, `/* other css */ h1 { color: #00FF00; }`);

    config.minifyCss = true;
    const styleText = `@import "./some-other.css"; /* css */ body { color: #ff0000; }`;
    const output = await minifyStyle(config, compilerCtx, diagnostics, styleText, filePath);

    expect(output).toBe(`h1{color:#0f0}body{color:red}`);
    expect(diagnostics).toHaveLength(0);
  });

  it('concat imports when in dev mode and using css @import, but no minify', async () => {
    const filePath = path.join(os.tmpdir(), 'my.css');
    fs.writeFileSync(filePath, '');
    const importPath = path.join(os.tmpdir(), 'some-other.css');
    fs.writeFileSync(importPath, `/* other css */ h1 { color: #00FF00; }`);

    config.minifyCss = false;
    const styleText = `@import "./some-other.css"; /* css */ body { color: #ff0000; }`;
    const output = await minifyStyle(config, compilerCtx, diagnostics, styleText, filePath);

    expect(output).toContain(`/* other css */`);
    expect(output).toContain(`/* css */`);
    expect(diagnostics).toHaveLength(0);
  });

  it('minify and no css @import', async () => {
    config.minifyCss = true;
    const styleText = `/* css */ body { color: #ff0000; }`;
    const output = await minifyStyle(config, compilerCtx, diagnostics, styleText);
    expect(output).toBe(`body{color:red}`);
    expect(diagnostics).toHaveLength(0);
  });

  it('do nothing for dev mode and no css @import', async () => {
    config.minifyCss = false;
    const styleText = `/* css */ body { color: #ff0000; }`;
    const output = await minifyStyle(config, compilerCtx, diagnostics, styleText);
    expect(output).toBe(`/* css */ body { color: #ff0000; }`);
    expect(diagnostics).toHaveLength(0);
  });

  it('do nothing for invalid data', async () => {
    let output = await minifyStyle(config, compilerCtx, diagnostics, null);
    expect(output).toBe(null);
    expect(diagnostics).toHaveLength(0);

    output = await minifyStyle(config, compilerCtx, diagnostics, undefined);
    expect(output).toBe(undefined);
    expect(diagnostics).toHaveLength(0);

    output = await minifyStyle(config, compilerCtx, diagnostics, '');
    expect(output).toBe('');
    expect(diagnostics).toHaveLength(0);
  });

});


describe('getImports', () => {

  it(`multiple node imports"`, () => {
    const styleText = `

      @import '~@ionic/core/dist/ionic/grid.css';

      @import "~@ionic/core/dist/ionic/text-transformation.css";

      body{color:red}
    `;
    const r = getNodeImports(styleText);
    expect(r).toEqual([
      `~@ionic/core/dist/ionic/text-transformation.css`,
      `~@ionic/core/dist/ionic/grid.css`
    ]);
  });

  it(`@import "~@ionic/core/dist/ionic/ionic.css"`, () => {
    const styleText = `@import "~@ionic/core/dist/ionic/ionic.css"; body{color:red}`;
    const r = getNodeImports(styleText);
    expect(r).toEqual([`~@ionic/core/dist/ionic/ionic.css`]);
  });

  it(`@import '~@ionic/core/dist/ionic/ionic.css'`, () => {
    const styleText = `@import '~@ionic/core/dist/ionic/ionic.css'; body{color:red}`;
    const r = getNodeImports(styleText);
    expect(r).toEqual([`~@ionic/core/dist/ionic/ionic.css`]);
  });

  it('/local.css @import', () => {
    const styleText = `@import "/local.css"; body{color:red}`;
    const filePath = `/some/path.css`;
    const r = getNodeImports(styleText);
    expect(r).toEqual([]);
  });

  it('../local.css @import', () => {
    const styleText = `@import "../local.css"; body{color:red}`;
    const filePath = `/some/path.css`;
    const r = getNodeImports(styleText);
    expect(r).toEqual([]);
  });

  it('./local.css @import', () => {
    const styleText = `@import "./local.css"; body{color:red}`;
    const filePath = `/some/path.css`;
    const r = getNodeImports(styleText);
    expect(r).toEqual([]);
  });

  it('local.css @import', () => {
    const styleText = `@import "local.css"; body{color:red}`;
    const filePath = `/some/path.css`;
    const r = getNodeImports(styleText);
    expect(r).toEqual([]);
  });

  it('localcss @import', () => {
    const styleText = `@import "localcss"; body{color:red}`;
    const filePath = `/some/path.css`;
    const r = getNodeImports(styleText);
    expect(r).toEqual([]);
  });

  it('css w/out @import', () => {
    const styleText = `body{color:red}`;
    const filePath = `/some/path.css`;
    const r = getNodeImports(styleText);
    expect(r).toEqual([]);
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


describe('replaceNodeModuleUrl', () => {

  const config = mockConfig();
  const root = path.resolve('/');

  it('replaceNodeModuleUrl', () => {
    const moduleId = `@ionic/core`;
    const nodeModulePath = path.join(root, 'my-app', 'src', 'node_modules', '@ionic', 'core', 'package.json');
    const baseCssFilePath = path.join(root, 'my-app', 'src', 'global', 'app.css');
    const importCssUrl = path.join('~@ionic', 'core', 'dist', 'ionic.css');
    const newUrl = replaceNodeModuleUrl(config, baseCssFilePath, moduleId, nodeModulePath, importCssUrl);
    expect(newUrl).toBe('../node_modules/@ionic/core/dist/ionic.css');
  });

});
