import { path } from '@stencil/core/compiler';
import { mockConfig, mockCompilerSystem, mockBuildCtx, mockCompilerCtx, mockModule } from '@stencil/core/testing';
import type * as d from '../../../declarations';
import * as outputCustomElementsMod from '../dist-custom-elements';
import { stubComponentCompilerMeta } from '../../types/tests/ComponentCompilerMeta.stub';
import { generateCustomElementsTypes } from '../dist-custom-elements/custom-elements-types';
import { DIST_CUSTOM_ELEMENTS } from '../output-utils';
import { join, relative } from 'path';

const setup = () => {
  const sys = mockCompilerSystem();
  const config: d.Config = mockConfig(sys);
  const compilerCtx = mockCompilerCtx(config);
  const buildCtx = mockBuildCtx(config, compilerCtx);
  const root = config.rootDir;
  config.configPath = '/testing-path';
  config.srcDir = '/src';
  config.buildAppCore = true;
  config.rootDir = path.join(root, 'User', 'testing', '/');
  config.namespace = 'TestApp';
  config.buildEs5 = true;
  config.globalScript = path.join(root, 'User', 'testing', 'src', 'global.ts');
  config.outputTargets = [{ type: DIST_CUSTOM_ELEMENTS, dir: 'my-best-dir' }];

  const bundleCustomElementsSpy = jest.spyOn(outputCustomElementsMod, 'bundleCustomElements');

  compilerCtx.moduleMap.set('test', mockModule());

  return { config, compilerCtx, buildCtx, bundleCustomElementsSpy };
};

describe('Custom Elements Typedef generation', () => {
  it('should generate an index.d.ts file corresponding to the index.js file', async () => {
    const componentOne = stubComponentCompilerMeta();
    const componentTwo = stubComponentCompilerMeta({
      componentClassName: 'MyBestComponent',
      tagName: 'my-best-component',
    });
    const { config, compilerCtx, buildCtx } = setup();
    buildCtx.components = [componentOne, componentTwo];

    const writeFileSpy = jest.spyOn(compilerCtx.fs, 'writeFile');

    await generateCustomElementsTypes(config, compilerCtx, buildCtx, 'types_dir');

    const componentsTypeDirectoryPath = relative('my-best-dir', join('types_dir', 'components'));

    const expectedTypedefOutput = [
      '/* TestApp custom elements */',
      `export { StubCmp as StubCmp } from '${join(componentsTypeDirectoryPath, 'stub-cmp', 'stub-cmp')}';`,
      `export { MyBestComponent as MyBestComponent } from '${join(
        componentsTypeDirectoryPath,
        'my-best-component',
        'my-best-component'
      )}';`,
      '',
      '/**',
      ' * Used to manually set the base path where assets can be found.',
      ' * If the script is used as "module", it\'s recommended to use "import.meta.url",',
      ' * such as "setAssetPath(import.meta.url)". Other options include',
      ' * "setAssetPath(document.currentScript.src)", or using a bundler\'s replace plugin to',
      ' * dynamically set the path at build time, such as "setAssetPath(process.env.ASSET_PATH)".',
      ' * But do note that this configuration depends on how your script is bundled, or lack of',
      ' * bundling, and where your assets can be loaded from. Additionally custom bundling',
      ' * will have to ensure the static assets are copied to its build directory.',
      ' */',
      'export declare const setAssetPath: (path: string) => void;',
      '',
      'export interface SetPlatformOptions {',
      '  raf?: (c: FrameRequestCallback) => number;',
      '  ael?: (el: EventTarget, eventName: string, listener: EventListenerOrEventListenerObject, options: boolean | AddEventListenerOptions) => void;',
      '  rel?: (el: EventTarget, eventName: string, listener: EventListenerOrEventListenerObject, options: boolean | AddEventListenerOptions) => void;',
      '}',
      'export declare const setPlatformOptions: (opts: SetPlatformOptions) => void;',
      "export * from '../types_dir/components';",
      '',
    ].join('\n');

    expect(compilerCtx.fs.writeFile).toBeCalledWith(join('my-best-dir', 'index.d.ts'), expectedTypedefOutput, {
      outputTargetType: DIST_CUSTOM_ELEMENTS,
    });

    writeFileSpy.mockRestore();
  });
});
