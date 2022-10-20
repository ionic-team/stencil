import { path } from '@stencil/core/compiler';
import {
  mockBuildCtx,
  mockCompilerCtx,
  mockCompilerSystem,
  mockModule,
  mockValidatedConfig,
} from '@stencil/core/testing';
import { join, relative } from 'path';

import type * as d from '../../../declarations';
import { stubComponentCompilerMeta } from '../../types/tests/ComponentCompilerMeta.stub';
import * as outputCustomElementsMod from '../dist-custom-elements';
import { generateCustomElementsTypes } from '../dist-custom-elements/custom-elements-types';
import { DIST_CUSTOM_ELEMENTS } from '../output-utils';

const setup = () => {
  const sys = mockCompilerSystem();
  const config: d.ValidatedConfig = mockValidatedConfig({
    configPath: '/testing-path',
    buildAppCore: true,
    buildEs5: true,
    namespace: 'TestApp',
    outputTargets: [{ type: DIST_CUSTOM_ELEMENTS, dir: 'my-best-dir' }],
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

describe('Custom Elements Typedef generation', () => {
  it('should generate an index.d.ts file corresponding to the index.js file', async () => {
    // this component tests the 'happy path' of a component's filename coinciding with its
    // tag name
    const componentOne = stubComponentCompilerMeta({
      tagName: 'my-component',
      sourceFilePath: '/src/components/my-component/my-component.tsx',
    });
    // this component tests that we correctly resolve its path when the component tag does
    // not match its filename
    const componentTwo = stubComponentCompilerMeta({
      sourceFilePath: '/src/components/the-other-component/my-real-best-component.tsx',
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
      `export { StubCmp as MyComponent } from '${join(componentsTypeDirectoryPath, 'my-component', 'my-component')}';`,
      `export { MyBestComponent as MyBestComponent } from '${join(
        componentsTypeDirectoryPath,
        'the-other-component',
        'my-real-best-component'
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

    expect(compilerCtx.fs.writeFile).toHaveBeenCalledWith(join('my-best-dir', 'index.d.ts'), expectedTypedefOutput, {
      outputTargetType: DIST_CUSTOM_ELEMENTS,
    });

    writeFileSpy.mockRestore();
  });
});
