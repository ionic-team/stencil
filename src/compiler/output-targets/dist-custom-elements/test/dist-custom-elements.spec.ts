import { addCustomElementInputs } from '../index';

describe('dist-custom-elements', () => {
  it('should add custom element inputs', () => {
    const buildCtx: any = {
      components: [
        {
          isPlain: true,
          sourceFilePath: './foo/bar.tsx',
          tagName: 'my-tag',
        },
      ],
    };
    const bundleOpts: any = {
      inputs: {},
      loader: {},
    };
    const outputTarget: any = {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'single-export-module',
    };
    addCustomElementInputs(buildCtx, bundleOpts, outputTarget);
    expect(bundleOpts.loader['\x00core']).toContain(`export { MyTag } from '\x00MyTag';\n`);
  });
});
