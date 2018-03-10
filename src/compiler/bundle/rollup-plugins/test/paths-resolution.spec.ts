import { CompilerCtx, Config } from '../../../../declarations';
import {
  mockCache,
  mockConfig,
  mockStencilSystem
} from '../../../../testing/mocks';
import localResolution from '../local-resolution';
import pathsResolver from '../paths-resolution';


describe('paths-resolution', () => {

  it('should resolve UNIX paths', async () => {
    const pathsResolverInstance = await pathsResolver(config, compilerCtx, {
      paths: {
        '~components/*': [
          'src/components/*'
        ],
        'decorators/test': [
          'src/decorators/test/test'
        ],
        '~test-helper': [
          'src/helpers/test-helper/test-helper'
        ]
      }
    });

    expect(
      pathsResolverInstance.resolveId(
        '~components/app-home/app-home',
        '/virtual/path/workspace/src/components/app-home/app-home.actions.ts'
      )
    ).toBe('/virtual/path/workspace/dist/collection/components/app-home/app-home.js');

    expect(
      pathsResolverInstance.resolveId(
        'decorators/test',
        '/virtual/path/workspace/src/components/app-home/app-home.actions.ts'
      )
    ).toBe('/virtual/path/workspace/dist/collection/decorators/test/test.js');

    expect(
      pathsResolverInstance.resolveId(
        '~test-helper',
        '/virtual/path/workspace/src/helpers/test-helper/test-helper.ts'
      )
    ).toBe('/virtual/path/workspace/dist/collection/helpers/test-helper/test-helper.js');
  });

  it('should resolve Windows paths', async () => {
    const pathsResolverInstance = await pathsResolver(config, compilerCtx, {
      paths: {
        '~components\\*': [
          'src\\components\\*'
        ],
        'decorators\\test': [
          'src\\decorators\\test\\test'
        ],
        '~test-helper': [
          'src\\helpers\\test-helper\\test-helper'
        ]
      }
    });

    expect(
      pathsResolverInstance.resolveId(
        '~components\\app-home\\app-home',
        '/virtual/path/workspace/src/components/app-home/app-home.actions.ts'
      )).toBe('/virtual/path/workspace/dist/collection/components/app-home/app-home.js');

    expect(
      pathsResolverInstance.resolveId(
        '~components\\app-home\\app-home',
        '/virtual/path/workspace/src/components/app-home/app-home.actions.ts'
      )
    ).toBe('/virtual/path/workspace/dist/collection/components/app-home/app-home.js');

    expect(
      pathsResolverInstance.resolveId(
        'decorators\\test',
        '/virtual/path/workspace/src/components/app-home/app-home.actions.ts'
      )
    ).toBe('/virtual/path/workspace/dist/collection/decorators/test/test.js');

    expect(
      pathsResolverInstance.resolveId(
        '~test-helper',
        '/virtual/path/workspace/src/helpers/test-helper/test-helper.ts'
      )
    ).toBe('/virtual/path/workspace/dist/collection/helpers/test-helper/test-helper.js');
  });

  it('should resolve mixed paths', async () => {
    const pathsResolverInstance = await pathsResolver(config, compilerCtx, {
      paths: {
        '~components/*': [
          'src\\components\\*'
        ],
        'decorators\\test': [
          'src\\decorators/test\\test'
        ],
        '~test-helper': [
          'src/helpers\\test-helper/test-helper'
        ]
      }
    });

    expect(
      pathsResolverInstance.resolveId(
        '~components/app-home/app-home',
        '/virtual/path/workspace/src/components/app-home/app-home.actions.ts'
      )).toBe('/virtual/path/workspace/dist/collection/components/app-home/app-home.js');

    expect(
      pathsResolverInstance.resolveId(
        '~components/app-home\\app-home',
        '/virtual/path/workspace/src/components/app-home/app-home.actions.ts'
      )
    ).toBe('/virtual/path/workspace/dist/collection/components/app-home/app-home.js');

    expect(
      pathsResolverInstance.resolveId(
        'decorators\\test',
        '/virtual/path/workspace/src/components/app-home/app-home.actions.ts'
      )
    ).toBe('/virtual/path/workspace/dist/collection/decorators/test/test.js');

    expect(
      pathsResolverInstance.resolveId(
        '~test-helper',
        '/virtual/path/workspace/src/helpers/test-helper/test-helper.ts'
      )
    ).toBe('/virtual/path/workspace/dist/collection/helpers/test-helper/test-helper.js');

  });

  it('should return null for unexisting paths', async () => {
    const pathsResolverInstance = await pathsResolver(config, compilerCtx, {
      paths: {
        '~components/*': [
          'src/components/*'
        ],
        'decorators/test': [
          'src/decorators/test/test'
        ],
        '~test-helper': [
          'src/helpers/test-helper/test-helper'
        ]
      }
    });

    expect(
      pathsResolverInstance.resolveId(
        '~unexisting-path/app-home/app-home',
        '/virtual/path/workspace/src/components/app-home/app-home.actions.ts'
      )
    ).toBe(null);
  });

  var config: Config;
  var compilerCtx: CompilerCtx;

  beforeEach(() => {
    config = mockConfig();

    config.rootDir = '/virtual/path/workspace/';

    config.sys = mockStencilSystem();

    compilerCtx = {
      moduleFiles: {
        '/virtual/path/workspace/src/components/app-home/app-home.tsx': {
          jsFilePath: '/virtual/path/workspace/dist/collection/components/app-home/app-home.js'
        },
        '/virtual/path/workspace/src/components/app-home/app-home.actions.ts': {
          jsFilePath: '/virtual/path/workspace/dist/collection/components/app-home/app-home.actions.js'
        },
        '/virtual/path/workspace/src/decorators/test/test.ts': {
          jsFilePath: '/virtual/path/workspace/dist/collection/decorators/test/test.js'
        },
        '/virtual/path/workspace/src/helpers/test-helper/test-helper.ts': {
          jsFilePath: '/virtual/path/workspace/dist/collection/helpers/test-helper/test-helper.js'
        }
      }
    };
  });

});
