import type { LogLevel, TaskCommand } from '@stencil/core/declarations';

/**
 * All the Boolean options supported by the Stencil CLI
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
 * All the Number options supported by the Stencil CLI
 */
export const NUMBER_CLI_ARGS = ['maxWorkers', 'port'] as const;

/**
 * All the String options supported by the Stencil CLI
 */
export const STRING_CLI_ARGS = [
  'address',
  'config',
  'docsJson',
  'emulate',
  'root',
  'screenshotConnector',
  'docsApi',
] as const;

/**
 * All the LogLevel-type options supported by the Stencil CLI
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

/**
 * Given two types `K` and `T` where `K` extends `ReadonlyArray<string>`,
 * construct a type which maps the strings in `K` as keys to values of type `T`.
 *
 * Because we use types derived this way to construct an interface (`ConfigFlags`)
 * for which we want optional keys, we make all the properties optional (w/ `'?'`)
 * and possibly null.
 */
type ObjectFromKeys<K extends ReadonlyArray<string>, T> = {
  [key in K[number]]?: T | null;
};

/**
 * Type containing the possible Boolean configuration flags, to be included
 * in ConfigFlags, below
 */
type BooleanConfigFlags = ObjectFromKeys<typeof BOOLEAN_CLI_ARGS, boolean>;
/**
 * Type containing the possible Boolean configuration flags, to be included
 * in ConfigFlags, below
 */
type StringConfigFlags = ObjectFromKeys<typeof STRING_CLI_ARGS, string>;
/**
 * Type containing the possible Boolean configuration flags, to be included
 * in ConfigFlags, below
 */
type NumberConfigFlags = ObjectFromKeys<typeof NUMBER_CLI_ARGS, number>;
/**
 * Type containing the possible Boolean configuration flags, to be included
 * in ConfigFlags, below
 */
type LogLevelFlags = ObjectFromKeys<typeof LOG_LEVEL_CLI_ARGS, LogLevel>;

/**
 * The configuration flags which can be set by the user on the command line.
 * This interface captures both known arguments (which are enumerated and then
 * parsed according to their types) and unknown arguments which the user may
 * pass at the CLI.
 *
 * Note that this interface is constructed by extending `BooleanConfigFlags`,
 * `StringConfigFlags`, etc. These types are in turn constructed from types
 * extending `ReadonlyArray<string>` which we declare in another module. This
 * allows us to record our known CLI arguments in one place, using a
 * `ReadonlyArray<string>` to get both a type-level representation of what CLI
 * options we support and a runtime list of strings which can be used to match
 * on actual flags passed by the user.
 */
export interface ConfigFlags extends BooleanConfigFlags, StringConfigFlags, NumberConfigFlags, LogLevelFlags {
  task?: TaskCommand | null;
  args?: string[];
  knownArgs?: string[];
  unknownArgs?: string[];
}
