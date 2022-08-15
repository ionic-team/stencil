import { mockValidatedConfig } from '@stencil/core/testing';
import { ValidatedConfig } from '../../../internal';
import { transpileModule } from './transpile';
import ts, { Extension } from 'typescript';
import { mapImportsToPathAliases } from '../map-imports-to-path-aliases';

describe('mapImportsToPathAliases', () => {
  let module: ReturnType<typeof transpileModule>;
  let config: ValidatedConfig;
  let resolveModuleNameSpy: jest.SpyInstance<
    ReturnType<typeof ts.resolveModuleName>,
    Parameters<typeof ts.resolveModuleName>
  >;

  beforeEach(() => {
    config = mockValidatedConfig({ tsconfig: './tsconfig.json', tsCompilerOptions: {} });

    resolveModuleNameSpy = jest.spyOn(ts, 'resolveModuleName');
  });

  afterEach(() => {
    resolveModuleNameSpy.mockReset();
  });

  it('should ignore relative imports', () => {
    resolveModuleNameSpy.mockReturnValue({
      resolvedModule: {
        isExternalLibraryImport: false,
        extension: Extension.Ts,
        resolvedFileName: 'utils.js',
      },
    });
    const inputText = `
        import * as dateUtils from "../utils";

        dateUtils.test();
    `;

    module = transpileModule(inputText, config, null, [], [mapImportsToPathAliases(config)]);

    expect(module.outputText).toContain('import * as dateUtils from "../utils";');
  });

  it('should ignore external imports', () => {
    resolveModuleNameSpy.mockReturnValue({
      resolvedModule: {
        isExternalLibraryImport: true,
        extension: Extension.Ts,
        resolvedFileName: 'utils.js',
      },
    });
    const inputText = `
        import { utils } from "@stencil/core";

        utils.test();
    `;

    module = transpileModule(inputText, config, null, [], [mapImportsToPathAliases(config)]);

    expect(module.outputText).toContain('import { utils } from "@stencil/core";');
  });

  it('should do nothing if there is no resolved module', () => {
    resolveModuleNameSpy.mockReturnValue({
      resolvedModule: undefined,
    });
    const inputText = `
        import { utils } from "@utils";

        utils.test();
    `;

    module = transpileModule(inputText, config, null, [], [mapImportsToPathAliases(config)]);

    expect(module.outputText).toContain('import { utils } from "@utils";');
  });

  // TODO(STENCIL-223): remove spy to test actual resolution behavior
  it('should replace the path alias with the generated relative path', () => {
    resolveModuleNameSpy.mockReturnValue({
      resolvedModule: {
        isExternalLibraryImport: false,
        extension: Extension.Ts,
        resolvedFileName: 'utils.ts',
      },
    });
    const inputText = `
        import { utils } from "@utils";

        utils.test();
    `;

    module = transpileModule(inputText, config, null, [], [mapImportsToPathAliases(config)]);

    expect(module.outputText).toContain('import { utils } from "utils";');
  });
});
