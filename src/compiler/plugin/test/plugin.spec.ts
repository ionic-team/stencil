import type * as d from '../../../declarations';
import path from 'path';
import { mockCreateCompiler, MockCompiler, mockCompilerRoot } from '../../../testing/mock-compiler';
import { normalizePath } from '@utils';

describe('plugin', () => {
  jest.setTimeout(25000);

  let initConfig: d.Config = {};
  initConfig.outputTargets = [{ type: 'www' }];

  let compiler: MockCompiler;

  afterEach(async () => {
    await compiler.destroy();
  });

  it('transform, async', async () => {
    function myPlugin() {
      return {
        transform: function (sourceText: string) {
          return new Promise((resolve) => {
            sourceText += `\nconsole.log('transformed 1!')`;
            resolve(sourceText);
          });
        },
        name: 'myPlugin',
      };
    }
    compiler = await mockCreateCompiler({ ...initConfig, rollupPlugins: { before: [myPlugin()] } });
    const config = compiler.config;

    await config.sys.writeFile(
      path.join(config.srcDir, 'components', 'cmp-a.tsx'),
      `
      import { Component, h } from '@stencil/core';
      @Component({ tag: 'cmp-a' }) export class CmpA {
        constructor() { }
      }
    `
    );

    const r = await compiler.build();
    expect(r.diagnostics).toHaveLength(0);

    const cmpA = await config.sys.readFile(path.join(config.rootDir, 'www', 'build', 'cmp-a.entry.js'));
    expect(cmpA).toContain('transformed 1!');
  });

  it('transform, sync', async () => {
    function myPlugin() {
      return {
        transform(sourceText: string) {
          sourceText += `\nconsole.log('transformed 2!')`;
          return sourceText;
        },
        name: 'myPlugin',
      };
    }
    compiler = await mockCreateCompiler({ ...initConfig, rollupPlugins: { before: [myPlugin()] } });
    const config = compiler.config;

    await config.sys.writeFile(
      path.join(config.srcDir, 'components', 'cmp-a.tsx'),
      `
      import { Component, h } from '@stencil/core';
      @Component({ tag: 'cmp-a' }) export class CmpA {
        constructor() { }
      }
    `
    );

    const r = await compiler.build();
    expect(r.diagnostics).toHaveLength(0);

    const cmpA = await config.sys.readFile(path.join(mockCompilerRoot, 'www', 'build', 'cmp-a.entry.js'));
    expect(cmpA).toContain('transformed 2!');
  });

  it('resolveId, async', async () => {
    const filePath = normalizePath(path.join(mockCompilerRoot, 'dist', 'my-dep-fn.js'));

    function myPlugin() {
      return {
        resolveId(importee: string) {
          if (importee === '#crazy-path!') {
            return Promise.resolve(filePath);
          }
          return Promise.resolve(null);
        },
        name: 'myPlugin',
      };
    }

    compiler = await mockCreateCompiler({ ...initConfig, rollupPlugins: { before: [myPlugin()] } });
    const config = compiler.config;

    await config.sys.writeFile(
      path.join(config.srcDir, 'components', 'cmp-a.tsx'),
      `
      import { depFn } from '#crazy-path!';
      import { Component, h } from '@stencil/core';
      @Component({ tag: 'cmp-a' }) export class CmpA {
        constructor() {
          depFn();
        }
      }
    `
    );
    await config.sys.writeFile(
      filePath,
      `
      export function depFn(){
        console.log('imported depFun() 1');
      }
    `
    );

    const r = await compiler.build();
    expect(r.diagnostics).toHaveLength(0);

    const cmpA = await config.sys.readFile(path.join(mockCompilerRoot, 'www', 'build', 'cmp-a.entry.js'));
    expect(cmpA).toContain('imported depFun() 1');
  });

  it('resolveId, sync', async () => {
    const filePath = normalizePath(path.join(mockCompilerRoot, 'dist', 'my-dep-fn.js'));

    function myPlugin() {
      return {
        resolveId(importee: string) {
          if (importee === '#crazy-path!') {
            return filePath;
          }
          return null;
        },
        name: 'myPlugin',
      };
    }

    compiler = await mockCreateCompiler({ ...initConfig, rollupPlugins: { before: [myPlugin()] } });
    const config = compiler.config;

    await config.sys.writeFile(
      path.join(config.srcDir, 'components', 'cmp-a.tsx'),
      `
      import { depFn } from '#crazy-path!'
      import { Component, h } from '@stencil/core';
      @Component({ tag: 'cmp-a' }) export class CmpA {
        constructor() {
          depFn();
        }
      }
    `
    );
    await config.sys.writeFile(
      filePath,
      `
      export function depFn(){
        console.log('imported depFun() 2');
      }
    `
    );

    const r = await compiler.build();
    expect(r.diagnostics).toHaveLength(0);

    const cmpA = await config.sys.readFile(path.join(mockCompilerRoot, 'www', 'build', 'cmp-a.entry.js'));
    expect(cmpA).toContain('imported depFun() 2');
  });

  it('style', async () => {
    function myPlugin() {
      return {
        transform: function (sourceText: string, id: string) {
          return new Promise((resolve) => {
            if (id.includes('style.css')) {
              sourceText += `\nconsole.log('transformed!')`;
            }
            resolve(sourceText);
          });
        },
        name: 'myPlugin',
      };
    }

    compiler = await mockCreateCompiler({ ...initConfig, rollupPlugins: { before: [myPlugin()] } });
    const config = compiler.config;

    await config.sys.writeFile(path.join(config.srcDir, 'components', 'style.css'), `p { color: red; }`);
    await config.sys.writeFile(
      path.join(config.srcDir, 'components', 'cmp-a.tsx'),
      `
      import { Component, h } from '@stencil/core';
      @Component({ tag: 'cmp-a', styleUrl: './style.css' }) export class CmpA {
        constructor() { }
      }
    `
    );

    const r = await compiler.build();
    expect(r.diagnostics).toHaveLength(0);

    const cmpA = await config.sys.readFile(path.join(mockCompilerRoot, 'www', 'build', 'cmp-a.entry.js'));
    expect(cmpA).toContain('transformed!');
  });
});
