import * as d from '../../../declarations';
import { getModuleId, getNodeImports, replaceNodeModuleUrl } from '../minify-style';
import { mockConfig } from '../../../testing/mocks';
import * as path from 'path';


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
