import * as path from 'path';
import * as d from '../../../declarations';
import { doNotExpectFiles, expectFiles } from '../../../testing/utils';
import { TestingCompiler } from '../../../testing/testing-compiler';
import { TestingConfig } from '../../../testing/testing-config';

const root = path.resolve('/');

describe('outputTargets', () => {

  jest.setTimeout(20000);
  let c: TestingCompiler;
  let config: TestingConfig;

  it('default www files', async () => {

    config = new TestingConfig();
    config.buildAppCore = true;
    config.rootDir = path.join(root, 'User', 'testing', '/');

    c = new TestingCompiler(config);

    await c.fs.writeFiles({
      [path.join(root, 'User', 'testing', 'src', 'index.html')]: `<cmp-a></cmp-a>`,
      [path.join(root, 'User', 'testing', 'src', 'components', 'cmp-a.tsx')]: `@Component({ tag: 'cmp-a' }) export class CmpA {}`,
    });
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    expectFiles(c.fs, [
      path.join(root, 'User', 'testing', 'www'),
      path.join(root, 'User', 'testing', 'www', 'build'),
      path.join(root, 'User', 'testing', 'www', 'build', 'app'),
      path.join(root, 'User', 'testing', 'www', 'build', 'app.js'),
      path.join(root, 'User', 'testing', 'www', 'build', 'app', 'cmp-a.entry.js'),
      path.join(root, 'User', 'testing', 'www', 'build', 'app', 'es5-build-disabled.js'),
      path.join(root, 'User', 'testing', 'www', 'build', 'app', 'app.core.js'),
      path.join(root, 'User', 'testing', 'www', 'build', 'app', 'app.registry.json'),

      path.join(root, 'User', 'testing', 'www', 'index.html'),

      path.join(root, 'User', 'testing', 'src', 'components.d.ts'),
    ]);

    doNotExpectFiles(c.fs, [
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
