import * as path from 'path';
import { TestingCompiler } from '../../../testing/testing-compiler';


describe('entries', () => {

  let c: TestingCompiler;
  const root = path.resolve('/');

  beforeEach(async () => {
    c = new TestingCompiler();
    await c.fs.writeFile(path.join(root, 'src', 'index.html'), `<cmp-a></cmp-a>`);
    await c.fs.commit();
  });


  it('should transpile attr in componet static property', async () => {
    c.config.bundles = [ { components: ['cmp-a'] } ];
    await c.fs.writeFile(path.join(root, 'src', 'cmp-a.tsx'), `
      @Component({ tag: 'cmp-a' }) export class CmpA {
        @Prop() str: string;
        @Prop() myStr: string;
        @Prop() myNum: number;
        @Prop() myBool: boolean;
        @Prop() myAny: any;
        @Prop() myPromise: Promise<void>;
        @Prop() arr: string[];
        @Prop() obj: Object;
      }
    `, { clearFileCache: true });
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    const content = (await c.fs.readFile(path.join(root, 'www', 'build', 'app', 'cmp-a.js'))).replace(/(?:\r\n|\r|\n)/g, ' ').replace(/\s\s+/g, ' ');
    expect(content).toContain(`"arr": { "type": "Any", "attr": "arr" }`);
    expect(content).toContain(`"myAny": { "type": "Any", "attr": "my-any"`);
    expect(content).toContain(`"myBool": { "type": Boolean, "attr": "my-bool" }`);
    expect(content).toContain(`"myNum": { "type": Number, "attr": "my-num" }`);
    expect(content).toContain(`"myPromise": { "type": "Any", "attr": "my-promise" }`);
    expect(content).toContain(`"myStr": { "type": String, "attr": "my-str" }`);
    expect(content).toContain(`"obj": { "type": "Any", "attr": "obj" }`);
    expect(content).toContain(`"str": { "type": String, "attr": "str" }`);
  });

  it('get component dependencies from imports w/ circular dependencies', async () => {
    await c.fs.writeFiles({
      [path.join(root, 'src', 'new-dir', 'cmp-b.tsx')]: `@Component({ tag: 'cmp-b' }) export class CmpB {}`,
      [path.join(root, 'src', 'new-dir', 'cmp-c.tsx')]: `@Component({ tag: 'cmp-c' }) export class CmpC {}`,
      [path.join(root, 'src', 'util-1.tsx')]: `
        import { getImportedCmpC } from './util-2';
        export function getCmpB() {
          return {
            'b': document.createElement("cmp-b"),
            'c': getImportedCmpC()
          }
        }
      `,
      [path.join(root, 'src', 'util-2.tsx')]: `
        import { getCmpB } from './util-1';
        export function derpCircular() {
          return getCmpB();
        }
        export function getImportedCmpC() {
          return {
            'b': document.createElement("cmp-b"),
            'c': document.createElement("cmp-c")
          };
        }
      `
    }, { clearFileCache: true });

    await c.fs.writeFile(path.join(root, 'src', 'cmp-a.tsx'), `
      import { getCmpB } from './util-1';

      @Component({ tag: 'cmp-a' }) export class CmpA {
        componentWillLoad() {
          getCmpB();
        }
      }
    `, { clearFileCache: true });
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    expect(r.components[0].dependencies).toEqual(['cmp-b', 'cmp-c']);
  });

  it('get component dependencies from imports', async () => {
    await c.fs.writeFiles({
      [path.join(root, 'src', 'new-dir', 'cmp-b.tsx')]: `@Component({ tag: 'cmp-b' }) export class CmpB {}`,
      [path.join(root, 'src', 'new-dir', 'cmp-c.tsx')]: `@Component({ tag: 'cmp-c' }) export class CmpC {}`,
      [path.join(root, 'src', 'new-dir', 'cmp-d.tsx')]: `@Component({ tag: 'cmp-d' }) export class CmpD {}`,
      [path.join(root, 'src', 'new-dir', 'cmp-e.tsx')]: `@Component({ tag: 'cmp-e' }) export class CmpE {}`,
      [path.join(root, 'src', 'util-1.tsx')]: `
        import { getImportedCmpC } from './util-2';
        export function getCmpB() {
          const el = document.createElement("cmp-b");
          return el;
        }
        export function getCmpC() {
          return getImportedCmpC();
        }
      `,
      [path.join(root, 'src', 'util-2.tsx')]: `
        import { getJsxCmpD } from './util-3';
        export function getImportedCmpC() {
          return {
            cmpC: document.createElement("cmp-c"),
            cmpD: getJsxCmpD()
          };
        }
      `,
      [path.join(root, 'src', 'util-3.tsx')]: `
        export function getJsxCmpD() {
          return <cmp-d/>;
        }
        export function getJsxCmpE() {
          return document.createElement('cmp-e');
        }
      `
    }, { clearFileCache: true });

    await c.fs.writeFile(path.join(root, 'src', 'cmp-a.tsx'), `
      import { getCmpB, getCmpC } from './util-1';

      @Component({ tag: 'cmp-a' }) export class CmpA {
        componentWillLoad() {
          getCmpB();
        }
        componentDidLoad() {
          getCmpC();
        }
      }
    `, { clearFileCache: true });
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    expect(r.components[0].dependencies).toEqual(['cmp-b', 'cmp-c', 'cmp-d', 'cmp-e']);
  });

  it('get CallExpression component dependencies', async () => {
    await c.fs.writeFiles({
      [path.join(root, 'src', 'new-dir', 'cmp-b.tsx')]: `@Component({ tag: 'cmp-b' }) export class CmpB {}`,
      [path.join(root, 'src', 'new-dir', 'cmp-c.tsx')]: `@Component({ tag: 'cmp-c' }) export class CmpC {}`,
      [path.join(root, 'src', 'new-dir', 'no-find.tsx')]: `@Component({ tag: 'no-find' }) export class NoFind {}`
    }, { clearFileCache: true });

    await c.fs.writeFile(path.join(root, 'src', 'cmp-a.tsx'), `
      @Component({ tag: 'cmp-a' }) export class CmpA {
        render() {
          someFunction('no-find');
          if (true) {
            return (
              h('cmp-b')
            );
          }
          return (
            h('cmp-c')
          );
        }
      }
    `, { clearFileCache: true });
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    expect(r.components[0].tag).toBe('cmp-a');
    expect(r.components[0].dependencies).toEqual(['cmp-b', 'cmp-c']);
  });

  it('get CallExpression PropertyAccessExpression component dependencies', async () => {
    await c.fs.writeFiles({
      [path.join(root, 'src', 'new-dir', 'cmp-b.tsx')]: `@Component({ tag: 'cmp-b' }) export class CmpB {}`,
      [path.join(root, 'src', 'new-dir', 'cmp-c.tsx')]: `@Component({ tag: 'cmp-c' }) export class CmpC {}`,
      [path.join(root, 'src', 'new-dir', 'no-find.tsx')]: `@Component({ tag: 'no-find' }) export class NoFind {}`
    }, { clearFileCache: true });

    await c.fs.writeFile(path.join(root, 'src', 'cmp-a.tsx'), `
      @Component({ tag: 'cmp-a' }) export class CmpA {
        constructor() {
          document.createElement('cmp-b');
          var doc = document;
          doc.createElementNS('cMp-C');
          document.createElement('   no-find   ');
          doc.someFunction('no-find');
        }
      }
    `, { clearFileCache: true });
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    expect(r.components[0].tag).toBe('cmp-a');
    expect(r.components[0].dependencies).toEqual(['cmp-b', 'cmp-c']);
  });

  it('get component dependencies from html string literals', async () => {
    await c.fs.writeFiles({
      [path.join(root, 'src', 'new-dir', 'cmp-b.tsx')]: `@Component({ tag: 'cmp-b' }) export class CmpB {}`,
      [path.join(root, 'src', 'new-dir', 'cmp-c.tsx')]: `@Component({ tag: 'cmp-c' }) export class CmpC {}`,
      [path.join(root, 'src', 'new-dir', 'no-find.tsx')]: `@Component({ tag: 'no-find' }) export class NoFind {}`
    }, { clearFileCache: true });

    await c.fs.writeFile(path.join(root, 'src', 'cmp-a.tsx'), `
      @Component({ tag: 'cmp-a' }) export class CmpA {
        // no-find
        //no-find
        /* no-find */
        /*no-find*/
        constructor() {
          this.el.innerHTML = '<cmp-b></cmp-b>';
          $.append('<cmp-c></cmp-c>');
        }
      }
    `, { clearFileCache: true });
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    expect(r.components[0].tag).toBe('cmp-a');
    expect(r.components[0].dependencies).toEqual(['cmp-b', 'cmp-c']);
  });

});
