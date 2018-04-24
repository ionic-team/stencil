import { TestingCompiler } from '../../../testing/testing-compiler';
import { wroteFile } from '../../../testing/utils';
import * as path from 'path';


describe('plugin', () => {
  let c: TestingCompiler;
  const root = path.resolve('/');

  beforeEach(async () => {
    c = new TestingCompiler();
    await c.fs.writeFiles({
      [path.join(root, 'src', 'index.html')]: `<cmp-a></cmp-a>`
    });
    await c.fs.commit();
  });

  it('transform, async', async () => {
    c.config.bundles = [ { components: ['cmp-a'] } ];

    await c.fs.writeFiles({
      [path.join(root, 'stencil.config.js')]: `

        function myPlugin() {
          return {
            transform: function(sourceText) {
              return new Promise(resolve => {
                resolve(sourceText.replace('constructor() { }', 'constructor(){console.log("transformed!")}'));
              });
            },
            name: 'myPlugin'
          };
        }

        exports.config = {
          plugins: [myPlugin()]
        };
      `,
      [path.join(root, 'src', 'cmp-a.tsx')]: `
        @Component({ tag: 'cmp-a' }) export class CmpA {
          constructor() { }
        }
      `
    }, { clearFileCache: true });
    await c.fs.commit();

    c.loadConfigFile(path.join(root, 'stencil.config.js'));

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    const cmpA = await c.fs.readFile(path.join(root, 'www', 'build', 'app', 'cmp-a.js'));
    expect(cmpA).toContain('transformed!');
  });

  it('transform, sync', async () => {
    c.config.bundles = [ { components: ['cmp-a'] } ];

    await c.fs.writeFiles({
      [path.join(root, 'stencil.config.js')]: `

        function myPlugin() {
          return {
            transform: function(sourceText) {
              return sourceText.replace('constructor() { }', 'constructor(){console.log("transformed!")}');
            },
            name: 'myPlugin'
          };
        }

        exports.config = {
          plugins: [myPlugin()]
        };
      `,
      [path.join(root, 'src', 'cmp-a.tsx')]: `
        @Component({ tag: 'cmp-a' }) export class CmpA {
          constructor() { }
        }
      `
    }, { clearFileCache: true });
    await c.fs.commit();

    c.loadConfigFile(path.join(root, 'stencil.config.js'));

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    const cmpA = await c.fs.readFile(path.join(root, 'www', 'build', 'app', 'cmp-a.js'));
    expect(cmpA).toContain('transformed!');
  });

  it('resolveId, async', async () => {
    c.config.bundles = [ { components: ['cmp-a'] } ];

    await c.fs.writeFiles({
      [path.join(root, 'stencil.config.js')]: `

        function myPlugin() {
          return {
            resolveId: function(importee, importer) {
              if (importee === '#crazy-path!') {
                return Promise.resolve('${path.join(root, 'dist', 'my-dep-fn.js')}');
              }
            },
            name: 'myPlugin'
          };
        }

        exports.config = {
          plugins: [myPlugin()]
        };
      `,
      [path.join(root, 'src', 'cmp-a.tsx')]: `
        import { depFn } '#crazy-path!'
        @Component({ tag: 'cmp-a' }) export class CmpA {
          constructor() {
            depFn();
          }
        }
      `,
      [path.join(root, 'dist', 'my-dep-fn.js')]: `
        export function depFn(){
          console.log('imported depFun()');
        }
      `
    }, { clearFileCache: true });
    await c.fs.commit();

    c.loadConfigFile(path.join(root, 'stencil.config.js'));

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    const cmpA = await c.fs.readFile(path.join(root, 'www', 'build', 'app', 'cmp-a.js'));
    expect(cmpA).toContain('imported depFun()');
  });

  it('resolveId, sync', async () => {
    c.config.bundles = [ { components: ['cmp-a'] } ];

    await c.fs.writeFiles({
      [path.join(root, 'stencil.config.js')]: `

        function myPlugin() {
          return {
            resolveId: function(importee, importer) {
              if (importee === '#crazy-path!') {
                return '${path.join(root, 'dist', 'my-dep-fn.js')}';
              }
            },
            name: 'myPlugin'
          };
        }

        exports.config = {
          plugins: [myPlugin()]
        };
      `,
      [path.join(root, 'src', 'cmp-a.tsx')]: `
        import { depFn } '#crazy-path!'
        @Component({ tag: 'cmp-a' }) export class CmpA {
          constructor() {
            depFn();
          }
        }
      `,
      [path.join(root, 'dist', 'my-dep-fn.js')]: `
        export function depFn(){
          console.log('imported depFun()');
        }
      `
    }, { clearFileCache: true });
    await c.fs.commit();

    c.loadConfigFile(path.join(root, 'stencil.config.js'));

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    const cmpA = await c.fs.readFile(path.join(root, 'www', 'build', 'app', 'cmp-a.js'));
    expect(cmpA).toContain('imported depFun()');
  });


});
