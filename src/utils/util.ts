import type * as d from '../declarations';
import { dashToPascalCase, isString, toDashCase } from './helpers';
import { buildError } from './message-utils';

export const createJsVarName = (fileName: string) => {
  if (isString(fileName)) {
    fileName = fileName.split('?')[0];
    fileName = fileName.split('#')[0];
    fileName = fileName.split('&')[0];
    fileName = fileName.split('=')[0];
    fileName = toDashCase(fileName);
    fileName = fileName.replace(/[|;$%@"<>()+,.{}_\!\/\\]/g, '-');
    fileName = dashToPascalCase(fileName);

    if (fileName.length > 1) {
      fileName = fileName[0].toLowerCase() + fileName.slice(1);
    } else {
      fileName = fileName.toLowerCase();
    }

    if (fileName.length > 0 && !isNaN(fileName[0] as any)) {
      fileName = '_' + fileName;
    }
  }
  return fileName;
};

/**
 * Determines if a given file path points to a type declaration file (ending in .d.ts) or not. This function is
 * case-insensitive in its heuristics.
 * @param filePath the path to check
 * @returns `true` if the given `filePath` points to a type declaration file, `false` otherwise
 */
export const isDtsFile = (filePath: string): boolean => {
  const parts = filePath.toLowerCase().split('.');
  if (parts.length > 2) {
    return parts[parts.length - 2] === 'd' && parts[parts.length - 1] === 'ts';
  }
  return false;
};

/**
 * Generate the preamble to be placed atop the main file of the build
 * @param config the Stencil configuration file
 * @returns the generated preamble
 */
export const generatePreamble = (config: d.Config): string => {
  const { preamble } = config;

  if (!preamble) {
    return '';
  }

  // generate the body of the JSDoc-style comment
  const preambleComment: string[] = preamble.split('\n').map((l) => ` * ${l}`);

  preambleComment.unshift(`/*!`);
  preambleComment.push(` */`);

  return preambleComment.join('\n');
};

const lineBreakRegex = /\r?\n|\r/g;
export function getTextDocs(docs: d.CompilerJsDoc | undefined | null) {
  if (docs == null) {
    return '';
  }
  return `${docs.text.replace(lineBreakRegex, ' ')}
${docs.tags
  .filter((tag) => tag.name !== 'internal')
  .map((tag) => `@${tag.name} ${(tag.text || '').replace(lineBreakRegex, ' ')}`)
  .join('\n')}`.trim();
}

/**
 * Retrieve a project's dependencies from the current build context
 * @param buildCtx the current build context to query for a specific package
 * @returns a list of package names the project is dependent on
 */
const getDependencies = (buildCtx: d.BuildCtx): ReadonlyArray<string> => {
  if (buildCtx.packageJson != null && buildCtx.packageJson.dependencies != null) {
    return Object.keys(buildCtx.packageJson.dependencies).filter((pkgName) => !SKIP_DEPS.includes(pkgName));
  }
  return [];
};

/**
 * Utility to determine whether a project has a dependency on a package
 * @param buildCtx the current build context to query for a specific package
 * @param depName the name of the dependency/package
 * @returns `true` if the project has a dependency a packaged with the provided name, `false` otherwise
 */
export const hasDependency = (buildCtx: d.BuildCtx, depName: string): boolean => {
  return getDependencies(buildCtx).includes(depName);
};

export const getDynamicImportFunction = (namespace: string) => `__sc_import_${namespace.replace(/\s|-/g, '_')}`;

export const readPackageJson = async (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  try {
    const pkgJson = await compilerCtx.fs.readFile(config.packageJsonFilePath);

    if (pkgJson) {
      const parseResults = parsePackageJson(pkgJson, config.packageJsonFilePath);
      if (parseResults.diagnostic) {
        buildCtx.diagnostics.push(parseResults.diagnostic);
      } else {
        buildCtx.packageJson = parseResults.data;
      }
    }
  } catch (e) {
    if (!config.outputTargets.some((o) => o.type.includes('dist'))) {
      const diagnostic = buildError(buildCtx.diagnostics);
      diagnostic.header = `Missing "package.json"`;
      diagnostic.messageText = `Valid "package.json" file is required for distribution: ${config.packageJsonFilePath}`;
    }
  }
};

/**
 * A type that describes the result of parsing a `package.json` file's contents
 */
export type ParsePackageJsonResult = {
  diagnostic: d.Diagnostic | null;
  data: any | null;
  filePath: string;
};

/**
 * Parse a string read from a `package.json` file
 * @param pkgJsonStr the string read from a `package.json` file
 * @param pkgJsonFilePath the path to the already read `package.json` file
 * @returns the results of parsing the provided contents of the `package.json` file
 */
export const parsePackageJson = (pkgJsonStr: string, pkgJsonFilePath: string): ParsePackageJsonResult => {
  const parseResult: ParsePackageJsonResult = {
    diagnostic: null,
    data: null,
    filePath: pkgJsonFilePath,
  };

  try {
    parseResult.data = JSON.parse(pkgJsonStr);
  } catch (e) {
    parseResult.diagnostic = buildError();
    parseResult.diagnostic.absFilePath = isString(pkgJsonFilePath) ? pkgJsonFilePath : undefined;
    parseResult.diagnostic.header = `Error Parsing JSON`;
    if (e instanceof Error) {
      parseResult.diagnostic.messageText = e.message;
    }
  }

  return parseResult;
};

const SKIP_DEPS = ['@stencil/core'];

/**
 * Check whether a string is a member of a ReadonlyArray<string>
 *
 * We need a little helper for this because unfortunately `includes` is typed
 * on `ReadonlyArray<T>` as `(el: T): boolean` so a `string` cannot be passed
 * to `includes` on a `ReadonlyArray` 😢 thus we have a little helper function
 * where we do the type coercion just once.
 *
 * see microsoft/TypeScript#31018 for some discussion of this
 *
 * @param readOnlyArray the array we're checking
 * @param maybeMember a value which is possibly a member of the array
 * @returns whether the array contains the member or not
 */
export const readOnlyArrayHasStringMember = <T extends string>(
  readOnlyArray: ReadonlyArray<T>,
  maybeMember: T | string
): maybeMember is T => readOnlyArray.includes(maybeMember as typeof readOnlyArray[number]);
