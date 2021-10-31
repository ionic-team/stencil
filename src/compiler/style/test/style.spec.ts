import type * as d from '@stencil/core/declarations';
import { mockCreateCompiler, MockCompiler, mockCompilerRoot } from '../../../testing/mock-compiler';
import path from 'path';

describe('component-styles', () => {
  jest.setTimeout(25000);
  let compiler: MockCompiler;

  afterEach(async () => {
    compiler.destroy();
  });

  it('should escape unicode characters', async () => {
    compiler = await mockCreateCompiler();
    const config = compiler.config;
    await config.sys.writeFile(
      path.join(config.srcDir, 'components', 'cmp-a.css'),
      `.myclass:before { content: "\\F113"; }`
    );
    await config.sys.writeFile(
      path.join(config.srcDir, 'components', 'cmp-a.tsx'),
      `
      @Component({ tag: 'cmp-a', styleUrl: 'cmp-a.css' }) export class CmpA {}
    `
    );

    const r = await compiler.build();
    expect(r.diagnostics).toHaveLength(0);

    const content = await config.sys.readFile(path.join(mockCompilerRoot, 'www', 'build', 'cmp-a.entry.js'));
    expect(content).toContain('\\\\F113');
  });

  it('should escape octal literals', async () => {
    compiler = await mockCreateCompiler();
    const config = compiler.config;
    await config.sys.writeFile(
      path.join(config.srcDir, 'components', 'cmp-a.css'),
      `.myclass:before { content: "\\2014 \\00A0"; }`
    );
    await config.sys.writeFile(
      path.join(config.srcDir, 'components', 'cmp-a.tsx'),
      `
      @Component({ tag: 'cmp-a', styleUrl: 'cmp-a.css' }) export class CmpA {}
    `
    );

    const r = await compiler.build();
    expect(r.diagnostics).toHaveLength(0);

    const content = await compiler.sys.readFile(path.join(mockCompilerRoot, 'www', 'build', 'cmp-a.entry.js'));
    expect(content).toContain('\\\\2014 \\\\00A0');
  });

  it('should add mode styles to hashed filename/minified builds', async () => {
    let config: d.Config = {};
    config.minifyJs = true;
    config.minifyCss = true;
    config.hashFileNames = true;
    config.hashedFileNameLength = 4;

    compiler = await mockCreateCompiler(config);
    config = compiler.config;

    await config.sys.writeFile(
      path.join(config.srcDir, 'components', 'cmp-a.tsx'),
      `
      import { Component, h } from '@stencil/core';
      @Component({
        tag: 'cmp-a',
        styleUrls: {
          ios: 'cmp-a.ios.css',
          md: 'cmp-a.md.css'
        }
      })
      export class CmpA {}
    `
    );
    await config.sys.writeFile(path.join(config.srcDir, 'components', 'cmp-a.ios.css'), `body{font-family:Helvetica}`);
    await config.sys.writeFile(path.join(config.srcDir, 'components', 'cmp-a.md.css'), `body{font-family:Roboto}`);

    const r = await compiler.build();
    expect(r.diagnostics).toHaveLength(0);

    let hasIos = false;
    let hasMd = false;

    r.filesWritten.forEach((f) => {
      const content = compiler.sys.readFileSync(f);
      if (content.includes(`body{font-family:Helvetica}`)) {
        hasIos = true;
      }
      if (content.includes(`body{font-family:Roboto}`)) {
        hasMd = true;
      }
    });

    expect(hasIos).toBe(true);
    expect(hasMd).toBe(true);
  });

  it('should add default styles to hashed filename/minified builds', async () => {
    let config: d.Config = {};
    config.minifyJs = true;
    config.minifyCss = true;
    config.hashFileNames = true;

    compiler = await mockCreateCompiler(config);
    config = compiler.config;
    config.sys.generateContentHash = async function () {
      return 'hashed';
    };

    await config.sys.writeFile(path.join(config.srcDir, 'components', 'cmp-a.css'), `body{color:red}`);
    await config.sys.writeFile(
      path.join(config.srcDir, 'components', 'cmp-a.tsx'),
      `
      @Component({ tag: 'cmp-a', styleUrl: 'cmp-a.css' }) export class CmpA {}
    `
    );

    const r = await compiler.build();
    expect(r.diagnostics).toHaveLength(0);

    const content = await config.sys.readFile(path.join(mockCompilerRoot, 'www', 'build', 'p-hashed.entry.js'));
    expect(content).toContain(`body{color:red}`);
  });

  it('error for missing css import', async () => {
    let config: d.Config = {};
    config.minifyJs = true;
    config.minifyCss = true;
    config.hashFileNames = true;

    compiler = await mockCreateCompiler(config);
    config = compiler.config;
    config.sys.generateContentHash = async function () {
      return 'hashed';
    };

    await config.sys.writeFile(
      path.join(config.srcDir, 'components', 'cmp-a.css'),
      `@import 'variables.css'; body{color:var(--color)}`
    );
    await config.sys.writeFile(
      path.join(config.srcDir, 'components', 'cmp-a.tsx'),
      `
      @Component({ tag: 'cmp-a', styleUrl: 'cmp-a.css' }) export class CmpA {}
    `
    );

    const r = await compiler.build();
    expect(r.diagnostics).toHaveLength(1);
    expect(r.diagnostics[0].messageText).toContain('Unable to read css import');
  });

  it('css imports', async () => {
    let config: d.Config = {};
    config.minifyJs = true;
    config.minifyCss = true;
    config.hashFileNames = true;

    compiler = await mockCreateCompiler(config);
    config = compiler.config;
    config.sys.generateContentHash = async function () {
      return 'hashed';
    };

    await config.sys.writeFile(path.join(config.srcDir, 'components', 'variables.css'), `:root{--color:red}`);
    await config.sys.writeFile(
      path.join(config.srcDir, 'components', 'cmp-a.css'),
      `@import 'variables.css'; body{color:var(--color)}`
    );
    await config.sys.writeFile(
      path.join(config.srcDir, 'components', 'cmp-a.tsx'),
      `
      @Component({ tag: 'cmp-a', styleUrl: 'cmp-a.css' }) export class CmpA {}
    `
    );

    const r = await compiler.build();
    expect(r.diagnostics).toHaveLength(0);

    const content = await compiler.sys.readFile(path.join(mockCompilerRoot, 'www', 'build', 'p-hashed.entry.js'));
    expect(content).toContain(`:root{--color:red}`);
  });
});
