/*!
 * This file contains Jest API usages for situations where it is difficult to determine which API should be used.
 *
 * An example of this is determining the version of Jest, which is retrieved via the `getVersion` API.
 * It's difficult at compile & runtime to determine:
 * 1. If such an API exists
 * 2. If it's typings are the same across all versions of Jest
 * 3. If there are variants of this API, which one to use and when
 *
 * Short of probing the directory where a user keeps their modules (e.g. `node_modules/`), we need to make a "best
 * guess" at things. This file is meant to only contain functions for these types of scenarios. It is expected that this
 * file be added to sparingly.
 */

import type { TransformedSource } from '@jest/transform';
import type { Config } from '@jest/types';
import { getVersion } from 'jest';

// TODO(STENCIL-959): Improve this typing by narrowing it
export type JestPuppeteerEnvironment = any;

export type JestPreprocessor = {
  process(sourceText: string, sourcePath: string, ...args: any[]): string | TransformedSource;
  getCacheKey(sourceText: string, sourcePath: string, ...args: any[]): string;
};

// TODO(STENCIL-960): Improve this typing by narrowing it
export type JestTestRunner = any;

/**
 * This type serves as an alias for the type representing the initial configuration for Jest.
 * This alias serves two purposes:
 * 1. It allows Stencil to have a single source of truth for the return type(s) on {@link JestFacade} (and its
 *    implementations)
 * 2. It prevents TypeScript from expanding Jest typings in the generated `.d.ts` file. This is necessary as TypeScript
 *    will make assumptions about where it can dynamically resolve Jest typings from, which do not necessarily hold
 *    true for every type of Stencil project directory structure.
 */
export type JestPresetConfig = Config.InitialOptions;

/**
 * Get the current major version of Jest that Stencil reconciles
 *
 * @returns the major version of Jest.
 */
export const getJestMajorVersion = (): string => {
  return getVersion();
};
