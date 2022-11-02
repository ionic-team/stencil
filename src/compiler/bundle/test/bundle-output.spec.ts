import { mockBuildCtx, mockCompilerCtx, mockValidatedConfig } from '@stencil/core/testing';
import { OutputOptions } from 'rollup';

import { BuildCtx, CompilerCtx, ValidatedConfig } from '../../../declarations';
import { BundleOptions } from '../bundle-interface';
import { getRollupOptions } from '../bundle-output';

describe('bundle output', () => {
  describe('getRollupOptions', () => {
    let config: ValidatedConfig;
    let compilerCtx: CompilerCtx;
    let buildCtx: BuildCtx;
    let bundleOptions: BundleOptions;

    beforeEach(() => {
      config = mockValidatedConfig();
      compilerCtx = mockCompilerCtx(config);
      buildCtx = mockBuildCtx(config, compilerCtx);
      bundleOptions = {
        id: 'customElements',
        platform: 'client',
        inputs: {
          index: 'core',
        },
      };
    });

    it('should default `inlineDynamicImports` to `false` in the output section', () => {
      const options = getRollupOptions(config, compilerCtx, buildCtx, bundleOptions);

      expect((options.output as OutputOptions).inlineDynamicImports).toBe(false);
    });

    it('should allow `inlineDynamicImports` to be `true` in the output section if only one input is provided', () => {
      bundleOptions.inlineDynamicImports = true;
      const options = getRollupOptions(config, compilerCtx, buildCtx, bundleOptions);

      expect((options.output as OutputOptions).inlineDynamicImports).toBe(true);
    });

    it('should not allow `inlineDynamicImports` to be `true` in the output section if multiple inputs are provided', () => {
      bundleOptions.inlineDynamicImports = true;
      bundleOptions.inputs = {
        ...bundleOptions.inputs,
        test: 'Test',
      };
      const options = getRollupOptions(config, compilerCtx, buildCtx, bundleOptions);

      expect((options.output as OutputOptions).inlineDynamicImports).toBe(false);
    });
  });
});
