import { mockBuildCtx, mockCompilerCtx, mockModule, mockValidatedConfig } from '@stencil/core/testing';
import { stubComponentCompilerMeta } from '../../types/tests/ComponentCompilerMeta.stub';
import { BundleOptions } from '../bundle-interface';
import { extTransformsPlugin } from '../ext-transforms-plugin';
import * as importPathLib from '../../transformers/stencil-import-path';
import { normalizePath } from '@utils';

describe('extTransformsPlugin', () => {
  function setup(bundleOptsOverrides: Partial<BundleOptions> = {}) {
    const config = mockValidatedConfig({
      plugins: [],
      outputTargets: [
        {
          type: 'dist-collection',
          dir: 'dist/',
          collectionDir: 'dist/collectionDir',
        },
      ],
      srcDir: '/some/stubbed/path',
    });
    const compilerCtx = mockCompilerCtx(config);
    const buildCtx = mockBuildCtx(config, compilerCtx);

    const compilerComponentMeta = stubComponentCompilerMeta({
      tagName: 'my-component',
      componentClassName: 'MyComponent',
    });

    buildCtx.components = [compilerComponentMeta];

    compilerCtx.moduleMap.set(
      compilerComponentMeta.sourceFilePath,
      mockModule({
        cmps: [compilerComponentMeta],
      })
    );

    const bundleOpts: BundleOptions = {
      id: 'test-bundle',
      platform: 'client',
      inputs: {},
      ...bundleOptsOverrides,
    };

    const cssText = ':host { text: pink; }';

    // mock out the read for our CSS
    jest.spyOn(compilerCtx.fs, 'readFile').mockResolvedValue(cssText);

    // mock out compilerCtx.worker.transformCssToEsm because 1) we want to
    // test what arguments are passed to it and 2) calling it un-mocked causes
    // the infamous autoprefixer-spew-issue :(
    const transformCssToEsmSpy = jest.spyOn(compilerCtx.worker, 'transformCssToEsm').mockResolvedValue({
      styleText: cssText,
      output: cssText,
      map: null,
      diagnostics: [],
      imports: [],
      defaultVarName: 'foo',
      styleDocs: [],
    });

    const writeFileSpy = jest.spyOn(compilerCtx.fs, 'writeFile');
    return {
      plugin: extTransformsPlugin(config, compilerCtx, buildCtx, bundleOpts),
      config,
      compilerCtx,
      buildCtx,
      bundleOpts,
      writeFileSpy,
      transformCssToEsmSpy,
      cssText,
    };
  }

  describe('transform function', () => {
    it('should set name', () => {
      expect(setup().plugin.name).toBe('extTransformsPlugin');
    });

    it('should return early if no data can be gleaned from the id', async () => {
      const { plugin } = setup();
      // @ts-ignore we're testing something which shouldn't normally happen,
      // but might if an argument of the wrong type were passed as `id`
      const parseSpy = jest.spyOn(importPathLib, 'parseImportPath').mockReturnValue({ data: null });
      // @ts-ignore the Rollup plugins expect to be called in a Rollup context
      expect(await plugin.transform('asdf', 'foo.css')).toBe(null);
      parseSpy.mockRestore();
    });

    it('should write CSS files if associated with a tag', async () => {
      const { plugin, writeFileSpy } = setup();

      // @ts-ignore the Rollup plugins expect to be called in a Rollup context
      await plugin.transform('asdf', '/some/stubbed/path/foo.css?tag=my-component');

      const [path, css] = writeFileSpy.mock.calls[0];

      expect(normalizePath(path)).toBe('./dist/collectionDir/foo.css');

      expect(css).toBe(':host { text: pink; }');
    });

    describe('passing `commentOriginalSelector` to `transformCssToEsm`', () => {
      it.each([
        [false, 'tag=my-component&encapsulation=scoped'],
        [true, 'tag=my-component&encapsulation=shadow'],
        [false, 'tag=my-component'],
      ])('should pass true if %p and hydrate', async (expectation, queryParams) => {
        const { plugin, transformCssToEsmSpy } = setup({ platform: 'hydrate' });
        // @ts-ignore the Rollup plugins expect to be called in a Rollup context
        await plugin.transform('asdf', `/some/stubbed/path/foo.css?${queryParams}`);
        expect(transformCssToEsmSpy.mock.calls[0][0].commentOriginalSelector).toBe(expectation);
      });

      it('should pass false if shadow, hydrate, but using HMR in dev watch mode', async () => {
        const { plugin, transformCssToEsmSpy, config } = setup({ platform: 'hydrate' });

        config.flags.watch = true;
        config.flags.dev = true;
        config.flags.serve = true;
        config.devServer = { reloadStrategy: 'hmr' };

        // @ts-ignore the Rollup plugins expect to be called in a Rollup context
        await plugin.transform('asdf', '/some/stubbed/path/foo.css?tag=my-component&encapsulation=shadow');
        expect(transformCssToEsmSpy.mock.calls[0][0].commentOriginalSelector).toBe(false);
      });

      it.each(['tag=my-component&encapsulation=scoped', 'tag=my-component&encapsulation=shadow', 'tag=my-component'])(
        'should pass false if %p without hydrate',
        async (queryParams) => {
          const { plugin, transformCssToEsmSpy } = setup();
          // @ts-ignore the Rollup plugins expect to be called in a Rollup context
          await plugin.transform('asdf', `/some/stubbed/path/foo.css?${queryParams}`);
          expect(transformCssToEsmSpy.mock.calls[0][0].commentOriginalSelector).toBe(false);
        }
      );
    });
  });
});
