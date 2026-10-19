import { mockBuildCtx, mockCompilerCtx, mockModule, mockValidatedConfig } from '@stencil/core/testing';
import { normalizePath } from '@utils';

import type * as d from '../../../declarations';
import { getDocsStyles } from '../../docs/generate-doc-data';
import { generateMarkdown } from '../../docs/readme/output-docs';
import * as importPathLib from '../../transformers/stencil-import-path';
import { stubComponentCompilerMeta } from '../../types/tests/ComponentCompilerMeta.stub';
import { BundleOptions } from '../bundle-interface';
import { extTransformsPlugin } from '../ext-transforms-plugin';

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
      }),
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
      plugin: extTransformsPlugin(config, compilerCtx, buildCtx),
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

    it('should replay cached style docs after a TypeScript-only rebuild', async () => {
      const { plugin, buildCtx, cssText, transformCssToEsmSpy } = setup();
      const styleDocs = [
        { name: '--background', docs: 'Background color', annotation: 'prop' as const, mode: '$' },
        { name: '--color', docs: 'Text color', annotation: 'prop' as const, mode: '$' },
      ];
      transformCssToEsmSpy.mockResolvedValue({
        styleText: cssText,
        output: cssText,
        map: null,
        diagnostics: [],
        imports: [],
        defaultVarName: 'foo',
        styleDocs,
      });

      // The initial build transforms CSS and records its documentation in Rollup's module cache.
      const transformCssModule = plugin.transform as (code: string, id: string) => Promise<unknown>;
      const transformResult = await transformCssModule('asdf', '/some/stubbed/path/foo.css?tag=my-component');
      const cachedMetadata = (transformResult as { meta: { styleDocs: typeof styleDocs } }).meta;

      // A TypeScript-only rebuild creates fresh component metadata before Rollup reuses the cached CSS module.
      const rebuiltComponent = stubComponentCompilerMeta({
        tagName: 'my-component',
        componentClassName: 'MyComponent',
        styleDocs: [],
      });
      buildCtx.components = [rebuiltComponent];

      const shouldTransformCachedModule = plugin.shouldTransformCachedModule as (options: {
        ast: unknown;
        code: string;
        id: string;
        meta: typeof cachedMetadata;
        moduleSideEffects: boolean;
        resolvedSources: Record<string, unknown>;
        syntheticNamedExports: boolean;
      }) => boolean | null;
      const shouldTransform = shouldTransformCachedModule({
        ast: undefined,
        code: cssText,
        id: '/some/stubbed/path/foo.css?tag=my-component',
        meta: cachedMetadata,
        moduleSideEffects: false,
        resolvedSources: {},
        syntheticNamedExports: false,
      });

      expect(shouldTransform).toBeNull();
      expect(rebuiltComponent.styleDocs).toEqual(styleDocs);

      const docsStyles = getDocsStyles(rebuiltComponent);
      expect(docsStyles).toEqual([
        { name: '--background', docs: 'Background color', annotation: 'prop', mode: undefined },
        { name: '--color', docs: 'Text color', annotation: 'prop', mode: undefined },
      ]);

      const docsComponent: d.JsonDocsComponent = {
        tag: 'my-component',
        filePath: 'src/my-component.tsx',
        fileName: 'my-component.tsx',
        dirPath: 'src',
        readmePath: 'src/readme.md',
        usagesDir: 'src/usage',
        encapsulation: 'none',
        docs: '',
        docsTags: [],
        usage: {},
        props: [],
        methods: [],
        events: [],
        listeners: [],
        styles: docsStyles,
        slots: [],
        parts: [],
        dependents: [],
        dependencies: [],
        dependencyGraph: {},
        customStates: [],
        readme: '',
      };
      const readme = generateMarkdown('', docsComponent, [], { type: 'docs-readme', footer: '' });

      expect(readme).toContain('`--background`');
      expect(readme).toContain('Background color');
      expect(readme).toContain('`--color`');
      expect(readme).toContain('Text color');
    });
  });
});
