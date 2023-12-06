import type * as d from '../../declarations';
/**
 * Entrypoint to creating a service worker for every `www` output target
 * @param config the Stencil configuration used for the build
 * @param buildCtx the build context associated with the build to mark as done
 */
export declare const outputServiceWorkers: (config: d.ValidatedConfig, buildCtx: d.BuildCtx) => Promise<void>;
