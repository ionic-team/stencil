import { mockValidatedConfig } from '@stencil/core/testing';
import { ValidatedConfig } from '../../../internal';
import { transpileModule } from './transpile';

describe('mapImportsToPathAliases', () => {
  let module: ReturnType<typeof transpileModule>;
  let config: ValidatedConfig;

  beforeEach(() => {
    config = mockValidatedConfig({ tsconfig: './tsconfig.json', tsCompilerOptions: {} });
  });

  /**
   * This test fails
   * The `transpileModule` helper method is designed to only transpile a single module's (file's)
   * content. However, with the solution implemented to fix module imports not getting transformed respective of
   * their path aliases in the `tsconfig.json` file for a project, this helper cannot resolve the defined imports so
   * the text returned from the helper keeps the original import path intact.
   */
  it('should replace the path alias with the generated relative path', () => {
    config.tsCompilerOptions.paths = {
      '@utils': ['./utils'],
    };
    config.tsCompilerOptions.baseUrl = '.';
    const inputText = `
        import * as dateUtils from '@utils';

        dateUtils.test();
    `;

    module = transpileModule(inputText, config, null, [], []);

    expect(module.outputText).toEqual(`import * as dateUtils from '../../utils/date'`);
  });
});
