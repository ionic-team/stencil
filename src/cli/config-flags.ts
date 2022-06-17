/**
 * All the boolean options supported by the Stencil CLI
 */
export const BOOLEAN_CLI_ARGS = [
  'build',
  'cache',
  'checkVersion',
  'ci',
  'compare',
  'debug',
  'dev',
  'devtools',
  'docs',
  'e2e',
  'es5',
  'esm',
  'headless',
  'help',
  'log',
  'open',
  'prerender',
  'prerenderExternal',
  'prod',
  'profile',
  'serviceWorker',
  'screenshot',
  'serve',
  'skipNodeCheck',
  'spec',
  'ssr',
  'stats',
  'updateScreenshot',
  'verbose',
  'version',
  'watch',
] as const;

/**
 * All the number options supported by the Stencil CLI
 */
export const NUMBER_CLI_ARGS = ['maxWorkers', 'port'] as const;

/**
 * All the string options supported by the Stencil CLI
 */
export const STRING_CLI_ARGS = ['address', 'config', 'docsJson', 'emulate', 'root', 'screenshotConnector'] as const;

/**
 * All the log level-type options supported by the Stencil CLI
 *
 * This is a bit silly since there's only one such argument atm,
 * but this approach lets us make sure that we're handling all
 * our arguments in a type-safe way.
 */
export const LOG_LEVEL_CLI_ARGS = ['logLevel'] as const;

/**
 * A type which gives the members of a `ReadonlyArray<string>` as
 * an enum-like type which can be used for e.g. keys in a `Record`
 * (as in the `AliasMap` type below)
 */
type ArrayValuesAsUnion<T extends ReadonlyArray<string>> = T[number];

export type BooleanCLIArg = ArrayValuesAsUnion<typeof BOOLEAN_CLI_ARGS>;
export type StringCLIArg = ArrayValuesAsUnion<typeof STRING_CLI_ARGS>;
export type NumberCLIArg = ArrayValuesAsUnion<typeof NUMBER_CLI_ARGS>;
export type LogCLIArg = ArrayValuesAsUnion<typeof LOG_LEVEL_CLI_ARGS>;

type KnownCLIArg = BooleanCLIArg | StringCLIArg | NumberCLIArg | LogCLIArg;

type AliasMap = Partial<Record<KnownCLIArg, string>>;

/**
 * For a small subset of CLI options we support a short alias e.g. `'h'` for `'help'`
 */
export const CLI_ARG_ALIASES: AliasMap = {
  config: 'c',
  help: 'h',
  port: 'p',
  version: 'v',
};
