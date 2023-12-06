import { ConfigFlags } from './config-flags';
/**
 * Parse command line arguments into a structured `ConfigFlags` object
 *
 * @param args an array of CLI flags
 * @returns a structured ConfigFlags object
 */
export declare const parseFlags: (args: string[]) => ConfigFlags;
export declare const Empty: unique symbol;
/**
 * The result of trying to parse a CLI arg. This will be a `string` if a
 * well-formed value is present, or `Empty` to indicate that nothing was matched
 * or that the input was malformed.
 */
type CLIValueResult = string | typeof Empty;
/**
 * Parse an 'equals' argument, which is a CLI argument-value pair in the
 * format `--foobar=12` (as opposed to a space-separated format like
 * `--foobar 12`).
 *
 * To parse this we split on the `=`, returning the first part as the argument
 * name and the second part as the value. We join the value on `"="` in case
 * there is another `"="` in the argument.
 *
 * This function is safe to call with any arg, and can therefore be used as
 * an argument 'normalizer'. If CLI argument is not an 'equals' argument then
 * the return value will be a tuple of the original argument and an empty
 * string `""` for the value.
 *
 * In code terms, if you do:
 *
 * ```ts
 * const [arg, value] = parseEqualsArg("--myArgument")
 * ```
 *
 * Then `arg` will be `"--myArgument"` and `value` will be `""`, whereas if
 * you do:
 *
 *
 * ```ts
 * const [arg, value] = parseEqualsArg("--myArgument=myValue")
 * ```
 *
 * Then `arg` will be `"--myArgument"` and `value` will be `"myValue"`.
 *
 * @param arg the arg in question
 * @returns a tuple containing the arg name and the value (if present)
 */
export declare const parseEqualsArg: (arg: string) => [string, CLIValueResult];
export {};
