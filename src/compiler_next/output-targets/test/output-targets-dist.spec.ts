import { doNotExpectFiles, expectFiles } from '../../../testing/testing-utils';
import { Compiler, Config } from '@stencil/core/compiler';
import { mockConfig } from '@stencil/core/testing';
import path from 'path';


describe('outputTarget, dist', () => {

  jest.setTimeout(20000);
  let compiler: Compiler;
  let config: Config;
  const root = path.resolve('/');

  it('default dist files', async () => {
    config = mockConfig();
    config.buildAppCore = true;
    config.rootDir = path.join(root, 'User', 'testing', '/');
    config.namespace = 'TestApp';
    config.buildEs5 = true;
    config.globalScript = path.join(root, 'User', 'testing', 'src', 'global.ts');
    config.outputTargets = [{ type: 'dist' }];

    compiler = new Compiler(config);

    await compiler.fs.writeFiles({
      [path.join(config.sys.getClientPath('polyfills/index.js'))]: `/* polyfills */`,
      [path.join(root, 'User', 'testing', 'package.json')]: `{
        "module": "dist/index.mjs",
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
        [path.join(root, 'User', 'testing', 'src', 'global.ts')]: `export default function() { console.log('my global'); }`
    });
    await compiler.fs.commit();

    const r = await compiler.build();
    expect(r.diagnostics).toHaveLength(0);

    expectFiles(compiler.fs, [
      path.join(root, 'User', 'testing', 'dist', 'index.js'),
      path.join(root, 'User', 'testing', 'dist', 'index.mjs'),

      path.join(root, 'User', 'testing', 'dist', 'collection', 'collection-manifest.json'),
      path.join(root, 'User', 'testing', 'dist', 'collection', 'components', 'cmp-a.js'),
      path.join(root, 'User', 'testing', 'dist', 'collection', 'components', 'cmp-a.ios.css'),
      path.join(root, 'User', 'testing', 'dist', 'collection', 'components', 'cmp-a.md.css'),
      path.join(root, 'User', 'testing', 'dist', 'collection', 'global.js'),

      path.join(root, 'User', 'testing', 'dist', 'esm', 'index.mjs'),
      path.join(root, 'User', 'testing', 'dist', 'esm', 'loader.mjs'),
      path.join(root, 'User', 'testing', 'dist', 'esm-es5', 'index.mjs'),
      path.join(root, 'User', 'testing', 'dist', 'esm-es5', 'loader.mjs'),
      path.join(root, 'User', 'testing', 'dist', 'esm', 'polyfills', 'index.js'),

      path.join(root, 'User', 'testing', 'dist', 'loader'),

      path.join(root, 'User', 'testing', 'dist', 'types'),

      path.join(root, 'User', 'testing', 'src', 'components.d.ts'),
    ]);

    doNotExpectFiles(compiler.fs, [
      path.join(root, 'User', 'testing', 'build'),
      path.join(root, 'User', 'testing', 'esm'),
      path.join(root, 'User', 'testing', 'es5'),
      path.join(root, 'User', 'testing', 'www'),
      path.join(root, 'User', 'testing', 'index.html'),
    ]);

  });

});
