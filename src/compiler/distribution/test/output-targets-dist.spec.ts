import * as path from 'path';
import * as d from '@declarations';
import { doNotExpectFiles, expectFiles } from '../../../testing/utils';
import { TestingCompiler } from '../../../testing/testing-compiler';
import { TestingConfig } from '../../../testing/testing-config';

const root = path.resolve('/');

describe('outputTargets', () => {

  jest.setTimeout(20000);
  let c: TestingCompiler;
  let config: TestingConfig;

  it('default dist files', async () => {
    config = new TestingConfig();
    config.buildAppCore = true;
    config.rootDir = path.join(root, 'User', 'testing', '/');
    config.namespace = 'TestApp';
    config.buildEs5 = true;
    config.globalScript = path.join(root, 'User', 'testing', 'src', 'global.ts');
    config.outputTargets = [{ type: 'dist' }];

    c = new TestingCompiler(config);

    await c.fs.writeFiles({
      [path.join(root, 'User', 'testing', 'package.json')]: `{
        "module": "dist/esm/index.js",
        "main": "dist/index.js",
        "collection": "dist/collection/collection-manifest.json",
        "types": "dist/types/components.d.ts"
      }`,
      [path.join(root, 'User', 'testing', 'src', 'index.html')]: `<cmp-a></cmp-a>`,
      [path.join(root, 'User', 'testing', 'src', 'components', 'cmp-a.tsx')]: `
        @Component({
          tag: 'cmp-a',
          styleUrls: {
            ios: 'cmp-a.ios.css',
            md: 'cmp-a.md.css'
          }
        }) export class CmpA {}`,
        [path.join(root, 'User', 'testing', 'src', 'components', 'cmp-a.ios.css')]: `cmp-a { color: blue; }`,
        [path.join(root, 'User', 'testing', 'src', 'components', 'cmp-a.md.css')]: `cmp-a { color: green; }`,
        [path.join(root, 'User', 'testing', 'src', 'global.ts')]: `export const MyGlobal: any = {};`
    });
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    expectFiles(c.fs, [
      path.join(root, 'User', 'testing', 'dist', 'index.js'),

      path.join(root, 'User', 'testing', 'dist', 'collection', 'collection-manifest.json'),
      path.join(root, 'User', 'testing', 'dist', 'collection', 'components', 'cmp-a.js'),
      path.join(root, 'User', 'testing', 'dist', 'collection', 'components', 'cmp-a.ios.css'),
      path.join(root, 'User', 'testing', 'dist', 'collection', 'components', 'cmp-a.md.css'),
      path.join(root, 'User', 'testing', 'dist', 'collection', 'global.js'),

      path.join(root, 'User', 'testing', 'dist', 'esm', 'es5', 'polyfills', 'array.js'),
      path.join(root, 'User', 'testing', 'dist', 'esm', 'es5', 'polyfills', 'dom.js'),
      path.join(root, 'User', 'testing', 'dist', 'esm', 'es5', 'polyfills', 'fetch.js'),
      path.join(root, 'User', 'testing', 'dist', 'esm', 'es5', 'polyfills', 'object.js'),
      path.join(root, 'User', 'testing', 'dist', 'esm', 'es5', 'polyfills', 'promise.js'),
      path.join(root, 'User', 'testing', 'dist', 'esm', 'es5', 'polyfills', 'string.js'),
      path.join(root, 'User', 'testing', 'dist', 'esm', 'es5', 'polyfills', 'url.js'),
      path.join(root, 'User', 'testing', 'dist', 'esm', 'es5', 'polyfills', 'tslib.js'),
      path.join(root, 'User', 'testing', 'dist', 'esm', 'es5', 'testapp.components.js'),
      path.join(root, 'User', 'testing', 'dist', 'esm', 'es5', 'testapp.core.js'),
      path.join(root, 'User', 'testing', 'dist', 'esm', 'es5', 'testapp.define.js'),
      path.join(root, 'User', 'testing', 'dist', 'esm', 'es5', 'testapp.global.js'),
      path.join(root, 'User', 'testing', 'dist', 'esm', 'es5', 'build', 'cmp-a.ios.entry.js'),
      path.join(root, 'User', 'testing', 'dist', 'esm', 'es5', 'build', 'cmp-a.ios.sc.entry.js'),
      path.join(root, 'User', 'testing', 'dist', 'esm', 'es5', 'build', 'cmp-a.md.entry.js'),
      path.join(root, 'User', 'testing', 'dist', 'esm', 'es5', 'build', 'cmp-a.md.sc.entry.js'),
      path.join(root, 'User', 'testing', 'dist', 'esm', 'index.js'),
      path.join(root, 'User', 'testing', 'dist', 'testapp.js'),
      path.join(root, 'User', 'testing', 'dist', 'testapp', 'cmp-a.ios.entry.js'),
      path.join(root, 'User', 'testing', 'dist', 'testapp', 'cmp-a.ios.sc.entry.js'),
      path.join(root, 'User', 'testing', 'dist', 'testapp', 'cmp-a.md.entry.js'),
      path.join(root, 'User', 'testing', 'dist', 'testapp', 'cmp-a.md.sc.entry.js'),
      path.join(root, 'User', 'testing', 'dist', 'testapp', 'testapp.core.js'),
      path.join(root, 'User', 'testing', 'dist', 'testapp', 'testapp.global.js'),

      path.join(root, 'User', 'testing', 'dist', 'types'),

      // these are written by the worker thread now which is hard to test
      // path.join(root, 'User', 'testing', 'dist', 'types', 'components'),
      // path.join(root, 'User', 'testing', 'dist', 'types', 'components.d.ts'),
      // path.join(root, 'User', 'testing', 'dist', 'types', 'components', 'cmp-a.d.ts'),
      // path.join(root, 'User', 'testing', 'dist', 'types', 'global.d.ts'),
      // path.join(root, 'User', 'testing', 'dist', 'types', 'stencil.core.d.ts'),

      path.join(root, 'User', 'testing', 'src', 'components.d.ts'),
    ]);

    doNotExpectFiles(c.fs, [
      path.join(root, 'User', 'testing', 'build'),
      path.join(root, 'User', 'testing', 'esm'),
      path.join(root, 'User', 'testing', 'es5'),
      path.join(root, 'User', 'testing', 'www'),
      path.join(root, 'User', 'testing', 'index.html'),
    ]);

  });

});
