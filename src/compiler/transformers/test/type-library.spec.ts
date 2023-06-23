import { ValidatedConfig } from '@stencil/core/declarations';
import { getMockFSPatch, mockLogger, mockValidatedConfig, setupConsoleMocker } from '@stencil/core/testing';
import { normalizePath } from '@utils';
import mock from 'mock-fs';
import path from 'path';

import { addFileToLibrary, getTypeLibrary } from '../type-library';

function resetLibrary() {
  const library = getTypeLibrary();

  for (const key in library) {
    delete library[key];
  }
}

const fixturesDir = 'fixtures';
const dessertModulePath = normalizePath(path.join(fixturesDir, 'dessert.ts'), false);
const mealModulePath = normalizePath(path.join(fixturesDir, 'meal-entry.ts'), false);

describe('type library', () => {
  let config: ValidatedConfig;
  beforeEach(() => {
    config = mockValidatedConfig();
    mock({
      [mealModulePath]: mock.load(path.resolve(__dirname, mealModulePath)),
      [dessertModulePath]: mock.load(path.resolve(__dirname, dessertModulePath)),
      ...getMockFSPatch(mock),
    });
  });

  afterEach(() => {
    mock.restore();
    resetLibrary();
  });

  it("should issue a warning if it can't find the specified file", () => {
    const { setupConsoleMocks, teardownConsoleMocks } = setupConsoleMocker();
    const { warnMock } = setupConsoleMocks();
    const logger = mockLogger();
    logger.enable();
    config.logger = logger;
    addFileToLibrary(config, 'fixtures/not-found.ts');
    expect(warnMock).toHaveBeenCalledWith(
      'docs-json: unable to gather type information from "fixtures/not-found.ts". Please double check this path exists relative to your project root.'
    );
    teardownConsoleMocks();
  });

  it('should include an enum', () => {
    addFileToLibrary(config, mealModulePath);
    expect(getTypeLibrary()[`${mealModulePath}::BestEnum`]).toEqual({
      declaration: `export enum BestEnum {
  Best,
  Worst,
  JustAlright,
}`,
      docstring: 'This has some documentation!',
      path: mealModulePath,
    });
  });

  it('should include a string union', () => {
    addFileToLibrary(config, mealModulePath);
    expect(getTypeLibrary()[`${mealModulePath}::StringUnion`]).toEqual({
      declaration: `export type StringUnion = 'left' | 'right';`,
      docstring: '',
      path: mealModulePath,
    });
  });

  it('should include a simple alias', () => {
    addFileToLibrary(config, mealModulePath);
    expect(getTypeLibrary()[`${mealModulePath}::JustAnAlias`]).toEqual({
      declaration: `string`,
      docstring: '',
      path: mealModulePath,
    });
  });

  it('should exclude any private types', () => {
    addFileToLibrary(config, mealModulePath);
    expect(getTypeLibrary()[`${mealModulePath}::PrivateType`]).toBeUndefined();
  });

  it('should include an aliased type re-export', () => {
    addFileToLibrary(config, mealModulePath);
    expect(getTypeLibrary()[`${dessertModulePath}::IceCream`]).toEqual({
      declaration: `export interface IceCream {
  delicious: true;
  flavor: string;
}`,
      docstring: '',
      path: dessertModulePath,
    });
  });

  it('should include an aliased re-export', () => {
    addFileToLibrary(config, mealModulePath);
    expect(getTypeLibrary()[`${dessertModulePath}::Cake`]).toEqual({
      declaration: `export interface Cake {
  not: 'pie';
}`,
      docstring: '',
      path: dessertModulePath,
    });
  });

  it('should include a type re-export', () => {
    addFileToLibrary(config, mealModulePath);
    expect(getTypeLibrary()[`${dessertModulePath}::Pie`]).toEqual({
      declaration: `export interface Pie {
  type: 'pumpkin' | 'apple' | 'pecan';
}`,
      docstring: '',
      path: dessertModulePath,
    });
  });

  it('should include a re-export', () => {
    addFileToLibrary(config, mealModulePath);
    expect(getTypeLibrary()[`${dessertModulePath}::Cookie`]).toEqual({
      declaration: `export interface Cookie {
  goodWith: 'cake';
}`,
      docstring: '',
      path: dessertModulePath,
    });
  });

  it('should include a type when `export *` is used', () => {
    addFileToLibrary(config, mealModulePath);
    expect(getTypeLibrary()[`${dessertModulePath}::Candy`]).toEqual({
      declaration: `export interface Candy {
  sweet: 'very yes';
}`,
      docstring: '',
      path: dessertModulePath,
    });
  });
});
