import type * as d from '../../declarations';
/**
 * Validate that a service worker configuration is valid, if it is present and
 * accounted for.
 *
 * Note that our service worker configuration / support is based on
 * Workbox, a package for automatically generating Service Workers to cache
 * assets on the client. More here: https://developer.chrome.com/docs/workbox/
 *
 * This function first checks that the service worker config set on the
 * supplied `OutputTarget` is not empty and that we are not currently in
 * development mode. In those cases it will early return.
 *
 * If we do find a service worker configuration we do some validation to ensure
 * that things are set up correctly.
 *
 * @param config the current, validated configuration
 * @param outputTarget the `www` outputTarget whose service worker
 * configuration we want to validate. **Note**: the `.serviceWorker` object
 * _will be mutated_ if it is present.
 */
export declare const validateServiceWorker: (config: d.ValidatedConfig, outputTarget: d.OutputTargetWww) => void;
