import { doNotExpectFiles, expectFiles } from '../../../testing/testing-utils';
import { createCompiler } from '@stencil/core/compiler';
import * as d from '@stencil/core/declarations';
import { mockConfig } from '@stencil/core/testing';
import path from 'path';

describe('outputTarget, dist', () => {
  jest.setTimeout(20000);
  let compiler: d.Compiler;
  let config: d.Config;
  const root = path.resolve('/');

  it('default dist files', async () => {
    config = mockConfig();
    config.buildAppCore = true;
    config.rootDir = path.join(root, 'User', 'testing', '/');
    config.namespace = 'TestApp';
    config.buildEs5 = true;
    config.globalScript = path.join(root, 'User', 'testing', 'src', 'global.ts');
    config.outputTargets = [{ type: 'dist' }];

    // Renamed from new Compiler since Adam switch to primarily functional throughout stencil with the compiler rewrite.
    compiler = await createCompiler(config);

    // The system doesn't allow for bulk writes of files - likely a symptom of adding support for mutiple systems like Deno?
    await Promise.all([
      await compiler.sys.writeFile(
        path.join(config.sys.getCompilerExecutingPath() + 'polyfills/index.js'),
        `/* polyfills */`
      ),
      await compiler.sys.writeFile(
        path.join(root, 'User', 'testing', 'package.json'),
        `{
        "module": "dist/index.mjs",
        "main": "dist/index.js",
        "collection": "dist/collection/collection-manifest.json",
        "types": "dist/types/components.d.ts"
      }`
      ),
      await compiler.sys.writeFile(path.join(root, 'User', 'testing', 'src', 'index.html'), `<cmp-a></cmp-a>`),
      await compiler.sys.writeFile(
        path.join(root, 'User', 'testing', 'src', 'components', 'cmp-a.tsx'),
        `
        @Component({
          tag: 'cmp-a',
          styleUrls: {
            ios: 'cmp-a.ios.css',
            md: 'cmp-a.md.css'
          }
        }) export class CmpA {}`
      ),
      await compiler.sys.writeFile(
        path.join(root, 'User', 'testing', 'src', 'components', 'cmp-a.ios.css'),
        `cmp-a { color: blue; }`
      ),
      await compiler.sys.writeFile(
        path.join(root, 'User', 'testing', 'src', 'components', 'cmp-a.md.css'),
        `cmp-a { color: green; }`
      ),
      await compiler.sys.writeFile(
        path.join(root, 'User', 'testing', 'src', 'global.ts'),
        `export default function() { console.log('my global'); }`
      ),
    ]);

    // Seems some config variable passed down within this command isn't passed down all the way
    // Causing a TypeError: Cannot read property 'extendedDiagnostics' of undefined
    const r = await compiler.build();
    expect(r.diagnostics).toHaveLength(0);

    // I'm nervous that the mocked out compiler.sys doesn't ACTUALLY have the same in-memory file system anymore...
    // unsure what could be done about that right now.
    // unsure also where the assertion within this function lies
    expectFiles(compiler.sys, [
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

    // unsure where the assertion within this function lies
    doNotExpectFiles(compiler.sys, [
      path.join(root, 'User', 'testing', 'build'),
      path.join(root, 'User', 'testing', 'esm'),
      path.join(root, 'User', 'testing', 'es5'),
      path.join(root, 'User', 'testing', 'www'),
      path.join(root, 'User', 'testing', 'index.html'),
    ]);
  });
});
