import { path } from '@stencil/core/compiler';
import {
  mockBuildCtx,
  mockCompilerCtx,
  mockCompilerSystem,
  mockModule,
  mockValidatedConfig,
} from '@stencil/core/testing';

import type * as d from '../../../declarations';
import { OutputTargetDistCustomElements } from '../../../declarations';
import { STENCIL_APP_GLOBALS_ID, STENCIL_INTERNAL_CLIENT_ID, USER_INDEX_ENTRY_ID } from '../../bundle/entry-alias-ids';
import { stubComponentCompilerMeta } from '../../types/tests/ComponentCompilerMeta.stub';
import {
  addCustomElementInputs,
  bundleCustomElements,
  generateEntryPoint,
  getBundleOptions,
  outputCustomElements,
} from '../dist-custom-elements';
import * as outputCustomElementsMod from '../dist-custom-elements';
import { DIST_CUSTOM_ELEMENTS, DIST_CUSTOM_ELEMENTS_BUNDLE } from '../output-utils';

const setup = () => {
  const sys = mockCompilerSystem();
  const config: d.ValidatedConfig = mockValidatedConfig({
    buildAppCore: true,
    buildEs5: true,
    configPath: '/testing-path',
    namespace: 'TestApp',
    outputTargets: [{ type: DIST_CUSTOM_ELEMENTS }],
    srcDir: '/src',
    sys,
  });
  const compilerCtx = mockCompilerCtx(config);
  const buildCtx = mockBuildCtx(config, compilerCtx);

  const root = config.rootDir;
  config.rootDir = path.join(root, 'User', 'testing', '/');
  config.globalScript = path.join(root, 'User', 'testing', 'src', 'global.ts');

  const bundleCustomElementsSpy = jest.spyOn(outputCustomElementsMod, 'bundleCustomElements');

  compilerCtx.moduleMap.set('test', mockModule());

  return { config, compilerCtx, buildCtx, bundleCustomElementsSpy };
};

describe('Custom Elements output target', () => {
  it('should return early if config.buildDist is false', async () => {
    const { config, compilerCtx, buildCtx, bundleCustomElementsSpy } = setup();
    config.buildDist = false;
    await outputCustomElements(config, compilerCtx, buildCtx);
    expect(bundleCustomElementsSpy).not.toHaveBeenCalled();
  });

  it.each<d.OutputTarget[][]>([
    [[]],
    [[{ type: 'dist' }]],
    [[{ type: 'dist' }, { type: DIST_CUSTOM_ELEMENTS_BUNDLE }]],
  ])('should return early if no appropriate output target (%j)', async (outputTargets) => {
    const { config, compilerCtx, buildCtx, bundleCustomElementsSpy } = setup();
    config.outputTargets = outputTargets;
    await outputCustomElements(config, compilerCtx, buildCtx);
    expect(bundleCustomElementsSpy).not.toHaveBeenCalled();
  });

  describe('generateEntryPoint', () => {
    it.each([true, false])('should include globalScripts if the right option is set', (includeGlobalScripts) => {
      const entryPoint = generateEntryPoint({
        type: DIST_CUSTOM_ELEMENTS,
        includeGlobalScripts,
      });
      const globalScriptsBoilerplate = `import { globalScripts } from '${STENCIL_APP_GLOBALS_ID}';\nglobalScripts();`;
      expect(entryPoint.includes(globalScriptsBoilerplate)).toBe(includeGlobalScripts);
    });
  });

  describe('getBundleOptions', () => {
    it('should set basic properties on BundleOptions', () => {
      const { config, buildCtx, compilerCtx } = setup();
      const options = getBundleOptions(config, buildCtx, compilerCtx, { type: DIST_CUSTOM_ELEMENTS });
      expect(options.id).toBe('customElements');
      expect(options.platform).toBe('client');
      expect(options.inlineWorkers).toBe(true);
      expect(options.inputs).toEqual({
        index: '\0core',
      });
      expect(options.loader).toEqual({
        '\0core': generateEntryPoint({ type: DIST_CUSTOM_ELEMENTS }),
      });
      expect(options.preserveEntrySignatures).toEqual('allow-extension');
    });

    it.each([true, false, undefined])('should set externalRuntime correctly when %p', (externalRuntime) => {
      const { config, buildCtx, compilerCtx } = setup();
      const options = getBundleOptions(config, buildCtx, compilerCtx, {
        type: DIST_CUSTOM_ELEMENTS,
        externalRuntime,
      });
      if (externalRuntime) {
        expect(options.externalRuntime).toBe(true);
      } else {
        expect(options.externalRuntime).toBe(false);
      }
    });

    it.each([true, false, undefined])('should pass through inlineDynamicImports=%p', (inlineDynamicImports) => {
      const { config, buildCtx, compilerCtx } = setup();
      const options = getBundleOptions(config, buildCtx, compilerCtx, {
        type: DIST_CUSTOM_ELEMENTS,
        inlineDynamicImports,
      });
      expect(options.inlineDynamicImports).toBe(inlineDynamicImports);
    });
  });

  describe('bundleCustomElements', () => {
    it('should set a diagnostic if no `dir` prop on the output target', async () => {
      const { config, compilerCtx, buildCtx } = setup();
      const outputTarget: OutputTargetDistCustomElements = { type: DIST_CUSTOM_ELEMENTS };
      await bundleCustomElements(config, compilerCtx, buildCtx, outputTarget);
      expect(buildCtx.diagnostics).toEqual([
        {
          level: 'error',
          type: 'build',
          messageText: 'dist-custom-elements output target provided with no output target directory!',
        },
      ]);
    });
  });

  describe('addCustomElementInputs', () => {
    it('should add imports to index.js for all included components', () => {
      const componentOne = stubComponentCompilerMeta();
      const componentTwo = stubComponentCompilerMeta({
        componentClassName: 'MyBestComponent',
        tagName: 'my-best-component',
      });
      const { config, compilerCtx, buildCtx } = setup();
      buildCtx.components = [componentOne, componentTwo];

      const bundleOptions = getBundleOptions(
        config,
        buildCtx,
        compilerCtx,
        config.outputTargets[0] as OutputTargetDistCustomElements
      );
      addCustomElementInputs(buildCtx, bundleOptions);
      expect(bundleOptions.loader['\0core']).toEqual(
        `export { setAssetPath, setNonce, setPlatformOptions } from '${STENCIL_INTERNAL_CLIENT_ID}';
export * from '${USER_INDEX_ENTRY_ID}';
import { globalScripts } from '${STENCIL_APP_GLOBALS_ID}';
globalScripts();
export { StubCmp, defineCustomElement as defineCustomElementStubCmp } from '\0StubCmp';
export { MyBestComponent, defineCustomElement as defineCustomElementMyBestComponent } from '\0MyBestComponent';`
      );
    });

    it('should correctly handle capitalization edge-cases', () => {
      const component = stubComponentCompilerMeta({
        componentClassName: 'ComponentWithJSX',
        tagName: 'component-with-jsx',
      });

      const { config, compilerCtx, buildCtx } = setup();
      buildCtx.components = [component];

      const bundleOptions = getBundleOptions(
        config,
        buildCtx,
        compilerCtx,
        config.outputTargets[0] as OutputTargetDistCustomElements
      );
      addCustomElementInputs(buildCtx, bundleOptions);
      expect(bundleOptions.loader['\0core']).toEqual(
        `export { setAssetPath, setNonce, setPlatformOptions } from '${STENCIL_INTERNAL_CLIENT_ID}';
export * from '${USER_INDEX_ENTRY_ID}';
import { globalScripts } from '${STENCIL_APP_GLOBALS_ID}';
globalScripts();
export { ComponentWithJsx, defineCustomElement as defineCustomElementComponentWithJsx } from '\0ComponentWithJsx';`
      );
    });
  });
});
