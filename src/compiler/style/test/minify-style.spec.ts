import * as d from '../../../declarations';
import { minifyStyle } from '../minify-style';
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

  it('minify and no css @import', async () => {
    config.minifyCss = true;
    const styleText = `/* css */ body { color: #ff0000; }`;
    const output = await minifyStyle(config, compilerCtx, diagnostics, styleText);
    expect(output).toBe(`body{color:red}`);
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
