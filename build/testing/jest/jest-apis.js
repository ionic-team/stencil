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
import { getVersion } from 'jest';
/**
 * Get the current major version of Jest that Stencil reconciles
 *
 * @returns the major version of Jest.
 */
export const getJestMajorVersion = () => {
    return getVersion();
};
//# sourceMappingURL=jest-apis.js.map