import type * as d from '../../declarations';
import { taskGenerate, getBoilerplateByExtension, GenerableExtension, BoilerplateFile } from '../task-generate';
import { mockConfig, mockStencilSystem } from '@stencil/core/testing';
import * as utils from '../../utils/validation';

import * as coreCompiler from '@stencil/core/compiler';
import { CoreCompiler } from '../load-compiler';

const promptMock = jest.fn().mockResolvedValue('my-component');

jest.mock('prompts', () => ({
  prompt: promptMock,
}));

const setup = async () => {
  const sys = mockStencilSystem();
  const config: d.Config = mockConfig(sys);
  config.configPath = '/testing-path';
  config.srcDir = '/src';

  // set up some mocks / spies
  config.sys.exit = jest.fn();
  config.flags.unknownArgs = [];
  const errorSpy = jest.spyOn(config.logger, 'error');
  const validateTagSpy = jest.spyOn(utils, 'validateComponentTag').mockReturnValue(undefined);

  // mock prompt usage: tagName and filesToGenerate are the keys used for
  // different calls, so we can cheat here and just do a single
  // mockResolvedValue
  promptMock.mockResolvedValue({
    tagName: 'my-component',
    filesToGenerate: ['css', 'spec.tsx', 'e2e.ts'],
  });

  return { config, errorSpy, validateTagSpy };
};

/**
 * Little test helper function which just temporarily silences
 * console.log calls so we can avoid spewing a bunch of stuff.
 */
async function silentGenerate(coreCompiler: CoreCompiler, config: d.Config) {
  const tmp = console.log;
  console.log = jest.fn();
  await taskGenerate(coreCompiler, config);
  console.log = tmp;
}

describe('generate task', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    jest.resetModules();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should exit with an error if no `configPath` is supplied', async () => {
    const { config, errorSpy } = await setup();
    config.configPath = undefined;
    await taskGenerate(coreCompiler, config);
    expect(config.sys.exit).toBeCalledWith(1);
    expect(errorSpy).toBeCalledWith(
      'Please run this command in your root directory (i. e. the one containing stencil.config.ts).'
    );
  });

  it('should exit with an error if no `srcDir` is supplied', async () => {
    const { config, errorSpy } = await setup();
    config.srcDir = undefined;
    await taskGenerate(coreCompiler, config);
    expect(config.sys.exit).toBeCalledWith(1);
    expect(errorSpy).toBeCalledWith("Stencil's srcDir was not specified.");
  });

  it('should exit with an error if the component name does not validate', async () => {
    const { config, errorSpy, validateTagSpy } = await setup();
    validateTagSpy.mockReturnValue('error error error');
    await taskGenerate(coreCompiler, config);
    expect(config.sys.exit).toBeCalledWith(1);
    expect(errorSpy).toBeCalledWith('error error error');
  });

  it.each([true, false])('should create a directory for the generated components', async (includeTests) => {
    const { config } = await setup();
    if (!includeTests) {
      promptMock.mockResolvedValue({
        tagName: 'my-component',
        // simulate the user picking only the css option
        filesToGenerate: ['css'],
      });
    }

    const createDirSpy = jest.spyOn(config.sys, 'createDir');
    await silentGenerate(coreCompiler, config);
    expect(createDirSpy).toBeCalledWith(
      includeTests ? `${config.srcDir}/components/my-component/test` : `${config.srcDir}/components/my-component`,
      { recursive: true }
    );
  });

  it('should generate the files the user picked', async () => {
    const { config } = await setup();
    const writeFileSpy = jest.spyOn(config.sys, 'writeFile');
    await silentGenerate(coreCompiler, config);
    const userChoices: ReadonlyArray<BoilerplateFile> = [
      { extension: 'tsx', path: '/src/components/my-component/my-component.tsx' },
      { extension: 'css', path: '/src/components/my-component/my-component.css' },
      { extension: 'spec.tsx', path: '/src/components/my-component/test/my-component.spec.tsx' },
      { extension: 'e2e.ts', path: '/src/components/my-component/test/my-component.e2e.ts' },
    ];

    userChoices.forEach((file) => {
      expect(writeFileSpy).toBeCalledWith(file.path, getBoilerplateByExtension('my-component', file.extension, true));
    });
  });

  it('should error without writing anything if a to-be-generated file is already present', async () => {
    const { config, errorSpy } = await setup();
    jest.spyOn(config.sys, 'readFile').mockResolvedValue('some file contents');
    await silentGenerate(coreCompiler, config);
    expect(errorSpy).toBeCalledWith(
      'Generating code would overwrite the following files:',
      '\t/src/components/my-component/my-component.tsx',
      '\t/src/components/my-component/my-component.css',
      '\t/src/components/my-component/test/my-component.spec.tsx',
      '\t/src/components/my-component/test/my-component.e2e.ts'
    );
    expect(config.sys.exit).toBeCalledWith(1);
  });
});
