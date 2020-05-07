import path from 'path';
import { promisify } from 'util';
import fs from 'fs';
import { PackageJSON } from './types';

const readFile = promisify(fs.readFile);

export const toLowerCase = (str: string) => str.toLowerCase();

export const dashToPascalCase = (str: string) => toLowerCase(str).split('-').map(segment => segment.charAt(0).toUpperCase() + segment.slice(1)).join('');

export function flatOne<T>(array: T[][]): T[] {
  if (array.flat) {
    return array.flat(1);
  }
  return array.reduce((result, item) => {
    result.push(...item);
    return result;
  }, [] as T[]);
}

export function sortBy<T>(array: T[], prop: ((item: T) => string)) {
  return array.slice().sort((a, b) => {
    const nameA = prop(a);
    const nameB = prop(b);
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });
}

export function normalizePath(str: string) {
  // Convert Windows backslash paths to slash paths: foo\\bar ➔ foo/bar
  // https://github.com/sindresorhus/slash MIT
  // By Sindre Sorhus
  if (typeof str !== 'string') {
    throw new Error(`invalid path to normalize`);
  }
  str = str.trim();

  if (EXTENDED_PATH_REGEX.test(str) || NON_ASCII_REGEX.test(str)) {
    return str;
  }

  str = str.replace(SLASH_REGEX, '/');

  // always remove the trailing /
  // this makes our file cache look ups consistent
  if (str.charAt(str.length - 1) === '/') {
    const colonIndex = str.indexOf(':');
    if (colonIndex > -1) {
      if (colonIndex < str.length - 2) {
        str = str.substring(0, str.length - 1);
      }

    } else if (str.length > 1) {
      str = str.substring(0, str.length - 1);
    }
  }

  return str;
}

export function relativeImport(pathFrom: string, pathTo: string, ext?: string) {
  let relativePath = path.relative(path.dirname(pathFrom), path.dirname(pathTo));
  if (relativePath === '') {
    relativePath = '.';
  } else if (relativePath[0] !== '.') {
    relativePath = './' + relativePath;
  }
  return normalizePath(`${relativePath}/${path.basename(pathTo, ext)}`);
}

export async function readPackageJson(rootDir: string) {
  const pkgJsonPath = path.join(rootDir, 'package.json');

  let pkgJson: string;
  try {
    pkgJson = await readFile(pkgJsonPath, 'utf8');

  } catch (e) {
    throw new Error(`Missing "package.json" file for distribution: ${pkgJsonPath}`);
  }

  let pkgData: PackageJSON;
  try {
    pkgData = JSON.parse(pkgJson);

  } catch (e) {
    throw new Error(`Error parsing package.json: ${pkgJsonPath}, ${e}`);
  }

  return pkgData;
}

const EXTENDED_PATH_REGEX = /^\\\\\?\\/;
const NON_ASCII_REGEX = /[^\x00-\x80]+/;
const SLASH_REGEX = /\\/g;
