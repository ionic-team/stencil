import type * as d from '../../declarations';
/**
 * Given a user-supplied config, get a validated config which can be used to
 * start building a Stencil project.
 *
 * @param userConfig a configuration object
 * @returns a validated config object with stricter typing
 */
export declare const getConfig: (userConfig: d.Config) => d.ValidatedConfig;
