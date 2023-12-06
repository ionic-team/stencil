"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stubPackageData = void 0;
/**
 * Generates a stub {@link PackageData}. This function uses sensible defaults for the initial stub. However,
 * any field in the object may be overridden via the `overrides` argument.
 * @param overrides a partial implementation of `PackageData`. Any provided fields will override the defaults provided
 * by this function.
 * @returns the stubbed `PackageData`
 */
const stubPackageData = (overrides = {}) => {
    const defaults = {
        name: 'mock-pkg',
        description: 'a mock package for testing',
        main: 'mock.js',
        version: '0.0.0',
    };
    return { ...defaults, ...overrides };
};
exports.stubPackageData = stubPackageData;
