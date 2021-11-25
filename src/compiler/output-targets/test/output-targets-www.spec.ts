import { doNotExpectFiles, expectFiles } from '../../../testing/testing-utils';
import { Compiler, Config } from '@stencil/core/compiler';
import { mockConfig } from '@stencil/core/testing';
import path from 'path';

xdescribe('outputTarget, www', () => {
  jest.setTimeout(20000);
  let compiler: Compiler;
  let config: Config;
  const root = path.resolve('/');

  it('default www files', async () => {
    config = mockConfig();
    config.namespace = 'App';
    config.buildAppCore = true;
    config.rootDir = path.join(root, 'User', 'testing', '/');

    compiler = new Compiler(config);

    await compiler.fs.writeFiles({
      [path.join(root, 'User', 'testing', 'src', 'index.html')]: `<cmp-a></cmp-a>`,
      [path.join(
        root,
        'User',
        'testing',
        'src',
        'components',
        'cmp-a.tsx'
      )]: `@Component({ tag: 'cmp-a' }) export class CmpA {}`,
    });
    await compiler.fs.commit();

    const r = await compiler.build();
    expect(r.diagnostics).toHaveLength(0);

    expectFiles(compiler.fs, [
      path.join(root, 'User', 'testing', 'www'),
      path.join(root, 'User', 'testing', 'www', 'build'),
      path.join(root, 'User', 'testing', 'www', 'build', 'app.js'),
      path.join(root, 'User', 'testing', 'www', 'build', 'app.js.map'),
      path.join(root, 'User', 'testing', 'www', 'build', 'app.esm.js'),
      path.join(root, 'User', 'testing', 'www', 'build', 'cmp-a.entry.js'),
      path.join(root, 'User', 'testing', 'www', 'build', 'cmp-a.entry.js.map'),

      path.join(root, 'User', 'testing', 'www', 'index.html'),

      path.join(root, 'User', 'testing', 'src', 'components.d.ts'),
    ]);

    doNotExpectFiles(compiler.fs, [
      path.join(root, 'User', 'testing', 'src', 'components', 'cmp-a.js'),

      path.join(root, 'User', 'testing', 'dist', '/'),
      path.join(root, 'User', 'testing', 'dist', 'collection'),
      path.join(root, 'User', 'testing', 'dist', 'collection', 'collection-manifest.json'),
      path.join(root, 'User', 'testing', 'dist', 'collection', 'components'),
      path.join(root, 'User', 'testing', 'dist', 'collection', 'components', 'cmp-a.js'),

      path.join(root, 'User', 'testing', 'dist', 'testapp', '/'),
      path.join(root, 'User', 'testing', 'dist', 'testapp.js'),
      path.join(root, 'User', 'testing', 'dist', 'testapp', 'cmp-a.entry.js'),
      path.join(root, 'User', 'testing', 'dist', 'testapp', 'es5-build-disabled.js'),
      path.join(root, 'User', 'testing', 'dist', 'testapp', 'testapp.core.js'),

      path.join(root, 'User', 'testing', 'dist', 'types'),
      path.join(root, 'User', 'testing', 'dist', 'types', 'components'),
      path.join(root, 'User', 'testing', 'dist', 'types', 'components.d.ts'),
      path.join(root, 'User', 'testing', 'dist', 'types', 'components', 'cmp-a.d.ts'),
      path.join(root, 'User', 'testing', 'dist', 'types', 'stencil.core.d.ts'),
    ]);
  });
});
