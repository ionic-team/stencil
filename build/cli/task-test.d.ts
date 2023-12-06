import type { ValidatedConfig } from '../declarations';
/**
 * Entrypoint for any Stencil tests
 * @param config a validated Stencil configuration entity
 * @returns a void promise
 */
export declare const taskTest: (config: ValidatedConfig) => Promise<void>;
