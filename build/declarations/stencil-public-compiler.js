export * from './stencil-public-docs';
/**
 * This sets the log level hierarchy for our terminal logger, ranging from
 * most to least verbose.
 *
 * Ordering the levels like this lets us easily check whether we should log a
 * message at a given time. For instance, if the log level is set to `'warn'`,
 * then anything passed to the logger with level `'warn'` or `'error'` should
 * be logged, but we should _not_ log anything with level `'info'` or `'debug'`.
 *
 * If we have a current log level `currentLevel` and a message with level
 * `msgLevel` is passed to the logger, we can determine whether or not we should
 * log it by checking if the log level on the message is further up or at the
 * same level in the hierarchy than `currentLevel`, like so:
 *
 * ```ts
 * LOG_LEVELS.indexOf(msgLevel) >= LOG_LEVELS.indexOf(currentLevel)
 * ```
 *
 * NOTE: for the reasons described above, do not change the order of the entries
 * in this array without good reason!
 */
export const LOG_LEVELS = ['debug', 'info', 'warn', 'error'];
/**
 * The collection of valid export behaviors.
 * Used to generate a type for typed configs as well as output target validation
 * for the `dist-custom-elements` output target.
 *
 * Adding a value to this const array will automatically add it as a valid option on the
 * output target configuration for `customElementsExportBehavior`.
 *
 * - `default`: No additional export or definition behavior will happen.
 * - `auto-define-custom-elements`: Enables the auto-definition of a component and its children (recursively) in the custom elements registry. This
 * functionality allows consumers to bypass the explicit call to define a component, its children, its children's
 * children, etc. Users of this flag should be aware that enabling this functionality may increase bundle size.
 * - `bundle`: A `defineCustomElements` function will be exported from the distribution directory. This behavior was added to allow easy migration
 * from `dist-custom-elements-bundle` to `dist-custom-elements`.
 * - `single-export-module`: All components will be re-exported from the specified directory's root `index.js` file.
 */
export const CustomElementsExportBehaviorOptions = [
    'default',
    'auto-define-custom-elements',
    'bundle',
    'single-export-module',
];
//# sourceMappingURL=stencil-public-compiler.js.map