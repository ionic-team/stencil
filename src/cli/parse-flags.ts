import { CompilerSystem, LogLevel, LOG_LEVELS, TaskCommand } from '../declarations';
import { dashToPascalCase, toDashCase } from '@utils';
import {
  BOOLEAN_CLI_ARGS,
  BooleanCLIArg,
  CLI_ARG_ALIASES,
  ConfigFlags,
  LOG_LEVEL_CLI_ARGS,
  LogCLIArg,
  NUMBER_CLI_ARGS,
  NumberCLIArg,
  STRING_CLI_ARGS,
  STRING_NUMBER_CLI_ARGS,
  StringCLIArg,
  StringNumberCLIArg,
  createConfigFlags,
} from './config-flags';

/**
 * Parse command line arguments into a structured `ConfigFlags` object
 *
 * @param args an array of config flags
 * @param sys an optional compiler system
 * @returns a structured ConfigFlags object
 */
export const parseFlags = (args: string[], sys?: CompilerSystem): ConfigFlags => {
  const flags: ConfigFlags = createConfigFlags();

  // cmd line has more priority over npm scripts cmd
  flags.args = Array.isArray(args) ? args.slice() : [];
  if (flags.args.length > 0 && flags.args[0] && !flags.args[0].startsWith('-')) {
    flags.task = flags.args[0] as TaskCommand;
  }
  parseArgs(flags, flags.args);

  if (sys && sys.name === 'node') {
    const envArgs = getNpmConfigEnvArgs(sys);
    parseArgs(flags, envArgs);

    envArgs.forEach((envArg) => {
      if (!flags.args.includes(envArg)) {
        flags.args.push(envArg);
      }
    });
  }

  if (flags.task != null) {
    const i = flags.args.indexOf(flags.task);
    if (i > -1) {
      flags.args.splice(i, 1);
    }
  }

  flags.unknownArgs = flags.args.filter((arg: string) => {
    return !flags.knownArgs.includes(arg);
  });

  return flags;
};

/**
 * Parse command line arguments that are enumerated in the `config-flags`
 * module. Handles leading dashes on arguments, aliases that are defined for a
 * small number of arguments, and parsing values for non-boolean arguments
 * (e.g. port number for the dev server).
 *
 * @param flags a ConfigFlags object to which parsed arguments will be added
 * @param args  an array of command-line arguments to parse
 */
const parseArgs = (flags: ConfigFlags, args: string[]) => {
  BOOLEAN_CLI_ARGS.forEach((argName) => parseBooleanArg(flags, args, argName));
  STRING_CLI_ARGS.forEach((argName) => parseStringArg(flags, args, argName));
  NUMBER_CLI_ARGS.forEach((argName) => parseNumberArg(flags, args, argName));
  STRING_NUMBER_CLI_ARGS.forEach((argName) => parseStringNumberArg(flags, args, argName));
  LOG_LEVEL_CLI_ARGS.forEach((argName) => parseLogLevelArg(flags, args, argName));
};

/**
 * Parse a boolean CLI argument. For these, we support the following formats:
 *
 * - `--booleanArg`
 * - `--boolean-arg`
 * - `--noBooleanArg`
 * - `--no-boolean-arg`
 *
 * The final two variants should be parsed to a value of `false` on the config
 * object.
 *
 * @param flags the config flags object, while we'll modify
 * @param args our CLI arguments
 * @param configCaseName the argument we want to look at right now
 */
const parseBooleanArg = (flags: ConfigFlags, args: string[], configCaseName: BooleanCLIArg) => {
  // we support both dash-case and PascalCase versions of the parameter
  // argName is 'configCase' version which can be found in BOOLEAN_ARG_OPTS
  const alias = CLI_ARG_ALIASES[configCaseName];
  const dashCaseName = toDashCase(configCaseName);

  if (typeof flags[configCaseName] !== 'boolean') {
    flags[configCaseName] = null;
  }

  args.forEach((cmdArg) => {
    let value;

    if (cmdArg === `--${configCaseName}` || cmdArg === `--${dashCaseName}`) {
      value = true;
    } else if (cmdArg === `--no-${dashCaseName}` || cmdArg === `--no${dashToPascalCase(dashCaseName)}`) {
      value = false;
    } else if (alias && cmdArg === `-${alias}`) {
      value = true;
    }

    if (value !== undefined && cmdArg !== undefined) {
      flags[configCaseName] = value;
      flags.knownArgs.push(cmdArg);
    }
  });
};

/**
 * Parse a string CLI argument
 *
 * @param flags the config flags object, while we'll modify
 * @param args our CLI arguments
 * @param configCaseName the argument we want to look at right now
 */
const parseStringArg = (flags: ConfigFlags, args: string[], configCaseName: StringCLIArg) => {
  if (typeof flags[configCaseName] !== 'string') {
    flags[configCaseName] = null;
  }

  const { value, matchingArg } = getValue(args, configCaseName);

  if (value !== undefined && matchingArg !== undefined) {
    flags[configCaseName] = value;
    flags.knownArgs.push(matchingArg);
    flags.knownArgs.push(value);
  }
};

/**
 * Parse a number CLI argument
 *
 * @param flags the config flags object, while we'll modify
 * @param args our CLI arguments
 * @param configCaseName the argument we want to look at right now
 */
const parseNumberArg = (flags: ConfigFlags, args: string[], configCaseName: NumberCLIArg) => {
  if (typeof flags[configCaseName] !== 'number') {
    flags[configCaseName] = null;
  }

  const { value, matchingArg } = getValue(args, configCaseName);

  if (value !== undefined && matchingArg !== undefined) {
    flags[configCaseName] = parseInt(value, 10);
    flags.knownArgs.push(matchingArg);
    flags.knownArgs.push(value);
  }
};

/**
 * Parse a CLI argument which may be either a string or a number
 *
 * @param flags the config flags object, while we'll modify
 * @param args our CLI arguments
 * @param configCaseName the argument we want to look at right now
 */
const parseStringNumberArg = (flags: ConfigFlags, args: string[], configCaseName: StringNumberCLIArg) => {
  if (!['number', 'string'].includes(typeof flags[configCaseName])) {
    flags[configCaseName] = null;
  }

  const { value, matchingArg } = getValue(args, configCaseName);

  if (value !== undefined && matchingArg !== undefined) {
    if (CLI_ARG_STRING_REGEX.test(value)) {
      // if it matches the regex we treat it like a string
      flags[configCaseName] = value;
    } else {
      // it was a number, great!
      flags[configCaseName] = Number(value);
    }
    flags.knownArgs.push(matchingArg);
    flags.knownArgs.push(value);
  }
};

/**
 * We use this regular expression to detect CLI parameters which
 * should be parsed as string values (as opposed to numbers) for
 * the argument types for which we support both a string and a
 * number value.
 *
 * The regex tests for the presence of at least one character which is
 * _not_ a digit (`\d`), a period (`\.`), or one of the characters `"e"`,
 * `"E"`, `"+"`, or `"-"` (the latter four characters are necessary to
 * support the admittedly unlikely use of scientific notation, like `"4e+0"`
 * for `4`).
 *
 * Thus we'll match a string like `"50%"`, but not a string like `"50"` or
 * `"5.0"`. If it matches a given string we conclude that the string should
 * be parsed as a string literal, rather than using `Number` to convert it
 * to a number.
 */
const CLI_ARG_STRING_REGEX = /[^\d\.Ee\+\-]+/g;

/**
 * Parse a LogLevel CLI argument. These can be only a specific
 * set of strings, so this function takes care of validating that
 * the value is correct.
 *
 * @param flags the config flags object, while we'll modify
 * @param args our CLI arguments
 * @param configCaseName the argument we want to look at right now
 */
const parseLogLevelArg = (flags: ConfigFlags, args: string[], configCaseName: LogCLIArg) => {
  if (typeof flags[configCaseName] !== 'string') {
    flags[configCaseName] = null;
  }

  const { value, matchingArg } = getValue(args, configCaseName);

  if (value !== undefined && matchingArg !== undefined && isLogLevel(value)) {
    flags[configCaseName] = value;
    flags.knownArgs.push(matchingArg);
    flags.knownArgs.push(value);
  }
};

/**
 * Helper for pulling values out from the raw array of CLI arguments. This logic
 * is shared between a few different types of CLI args.
 *
 * We look for arguments in the following formats:
 *
 * - `--my-cli-argument value`
 * - `--my-cli-argument=value`
 * - `--myCliArgument value`
 * - `--myCliArgument=value`
 *
 * We also check for shortened aliases, which we define for a few arguments.
 *
 * @param args the CLI args we're dealing with
 * @param configCaseName the ConfigFlag key which we're looking to pull out a value for
 * @returns the value for the flag as well as the exact string which it matched from
 * the user input.
 */
const getValue = (
  args: string[],
  configCaseName: StringCLIArg | NumberCLIArg | StringNumberCLIArg | LogCLIArg
): CLIArgValue => {
  // for some CLI args we have a short alias, like 'c' for 'config'
  const alias = CLI_ARG_ALIASES[configCaseName];
  // we support supplying arguments in both dash-case and configCase
  // for ease of use
  const dashCaseName = toDashCase(configCaseName);

  let value: string | undefined;
  let matchingArg: string | undefined;
  args.forEach((arg, i) => {
    if (arg.startsWith(`--${dashCaseName}=`) || arg.startsWith(`--${configCaseName}=`)) {
      value = getEqualsValue(arg);
      matchingArg = arg;
    } else if (arg === `--${dashCaseName}` || arg === `--${configCaseName}`) {
      value = args[i + 1];
      matchingArg = arg;
    } else if (alias) {
      if (arg.startsWith(`-${alias}=`)) {
        value = getEqualsValue(arg);
        matchingArg = arg;
      } else if (arg === `-${alias}`) {
        value = args[i + 1];
        matchingArg = arg;
      }
    }
  });
  return { value, matchingArg };
};

interface CLIArgValue {
  // the concrete value pulled from the CLI args
  value: string;
  // the matching argument key
  matchingArg: string;
}

/**
 * When a parameter is set in the format `--foobar=12` at the CLI (as opposed to
 * `--foobar 12`) we want to get the value after the `=` sign
 *
 * @param commandArgument the arg in question
 * @returns the value after the `=`
 */
const getEqualsValue = (commandArgument: string) => commandArgument.split('=').slice(1).join('=');

/**
 * Small helper for getting type-system-level assurance that a `string` can be
 * narrowed to a `LogLevel`
 *
 * @param maybeLogLevel the string to check
 * @returns whether this is a `LogLevel`
 */
const isLogLevel = (maybeLogLevel: string): maybeLogLevel is LogLevel =>
  // unfortunately `includes` is typed on `ReadonlyArray<T>` as `(el: T):
  // boolean` so a `string` cannot be passed to `includes` on a
  // `ReadonlyArray` 😢 thus we `as any`
  //
  // see microsoft/TypeScript#31018 for some discussion of this
  LOG_LEVELS.includes(maybeLogLevel as any);

const getNpmConfigEnvArgs = (sys: CompilerSystem) => {
  // process.env.npm_config_argv
  // {"remain":["4444"],"cooked":["run","serve","--port","4444"],"original":["run","serve","--port","4444"]}
  let args: string[] = [];
  try {
    const npmConfigArgs = sys.getEnvironmentVar('npm_config_argv');
    if (npmConfigArgs) {
      args = JSON.parse(npmConfigArgs).original as string[];
      if (args[0] === 'run') {
        args = args.slice(2);
      }
    }
  } catch (e) {}
  return args;
};
