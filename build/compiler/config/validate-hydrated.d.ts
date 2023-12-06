import { HydratedFlag, UnvalidatedConfig } from '../../declarations';
/**
 * Validate the `.hydratedFlag` property on the supplied config object and
 * return a properly-validated value.
 *
 * @param config the configuration we're examining
 * @returns a suitable value for the hydratedFlag property
 */
export declare const validateHydrated: (config: UnvalidatedConfig) => HydratedFlag | null;
