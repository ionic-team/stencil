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
    config = mockValidatedConfig({ tsCompilerOptions: {} });

    resolveModuleNameSpy = jest.spyOn(ts, 'resolveModuleName');
  });

  afterEach(() => {
    resolveModuleNameSpy.mockReset();
  });

  it('ignores relative imports', () => {
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

    module = transpileModule(inputText, config, null, [], [mapImportsToPathAliases(config, '', '')]);

    expect(module.outputText).toContain('import * as dateUtils from "../utils";');
  });

  it('ignores external imports', () => {
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

    module = transpileModule(inputText, config, null, [], [mapImportsToPathAliases(config, '', '')]);

    expect(module.outputText).toContain('import { utils } from "@stencil/core";');
  });

  it('does nothing if there is no resolved module', () => {
    resolveModuleNameSpy.mockReturnValue({
      resolvedModule: undefined,
    });
    const inputText = `
        import { utils } from "@utils";

        utils.test();
    `;

    module = transpileModule(inputText, config, null, [], [mapImportsToPathAliases(config, '', '')]);

    expect(module.outputText).toContain('import { utils } from "@utils";');
  });

  // TODO(STENCIL-223): remove spy to test actual resolution behavior
  it('replaces the path alias with the generated relative path', () => {
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

    module = transpileModule(inputText, config, null, [], [mapImportsToPathAliases(config, '', '')]);

    expect(module.outputText).toContain('import { utils } from "utils";');
  });

  // The resolved module is not part of the output directory
  it('generates the correct relative path when the resolved module is outside the transpiled project', () => {
    config.srcDir = '/test-dir';
    resolveModuleNameSpy.mockReturnValue({
      resolvedModule: {
        isExternalLibraryImport: false,
        extension: Extension.Ts,
        resolvedFileName: '/some-compiled-dir/utils/utils.ts',
      },
    });
    const inputText = `
        import { utils } from "@utils";

        utils.test();
    `;

    module = transpileModule(
      inputText,
      config,
      null,
      [],
      [mapImportsToPathAliases(config, '/dist/collection/test.js', '/dist/collection')]
    );

    expect(module.outputText).toContain('import { utils } from "../../some-compiled-dir/utils/utils";');
  });

  // Source module and resolved module are in the same output directory
  it('generates the correct relative path when the resolved module is within the transpiled project', () => {
    config.srcDir = '/test-dir';
    resolveModuleNameSpy.mockReturnValue({
      resolvedModule: {
        isExternalLibraryImport: false,
        extension: Extension.Ts,
        resolvedFileName: '/test-dir/utils/utils.ts',
      },
    });
    const inputText = `
        import { utils } from "@utils";

        utils.test();
    `;

    module = transpileModule(
      inputText,
      config,
      null,
      [],
      [mapImportsToPathAliases(config, 'dist/collection/test.js', 'dist/collection')]
    );

    expect(module.outputText).toContain('import { utils } from "utils/utils";');
  });
});
