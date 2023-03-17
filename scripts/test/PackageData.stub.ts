import { PackageData } from '../utils/write-pkg-json';

/**
 * Generates a stub {@link PackageData}. This function uses sensible defaults for the initial stub. However,
 * any field in the object may be overridden via the `overrides` argument.
 * @param overrides a partial implementation of `PackageData`. Any provided fields will override the defaults provided
 * by this function.
 * @returns the stubbed `PackageData`
 */
export const stubPackageData = (overrides: Partial<PackageData> = {}): PackageData => {
  const defaults: PackageData = {
    name: 'mock-pkg',
    description: 'a mock package for testing',
    main: 'mock.js',
    version: '0.0.0',
  };

  return { ...defaults, ...overrides };
};
