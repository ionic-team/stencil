/**
 * Convert Windows backslash paths to slash paths: foo\\bar ➔ foo/bar
 * Forward-slash paths can be used in Windows as long as they're not
 * extended-length paths and don't contain any non-ascii characters.
 * This was created since the path methods in Node.js outputs \\ paths on Windows.
 * @param path the Windows-based path to convert
 * @returns the converted path
 */
export const normalizePath = (path: string): string => {
  if (typeof path !== 'string') {
    throw new Error(`invalid path to normalize`);
  }
  path = normalizeSlashes(path.trim());

  const components = pathComponents(path, getRootLength(path));
  const reducedComponents = reducePathComponents(components);
  const rootPart = reducedComponents[0];
  const secondPart = reducedComponents[1];
  const normalized = rootPart + reducedComponents.slice(1).join('/');

  if (normalized === '') {
    return '.';
  }
  if (
    rootPart === '' &&
    secondPart &&
    path.includes('/') &&
    !secondPart.startsWith('.') &&
    !secondPart.startsWith('@')
  ) {
    return './' + normalized;
  }
  return normalized;
};

const normalizeSlashes = (path: string) => path.replace(backslashRegExp, '/');

const altDirectorySeparator = '\\';
const urlSchemeSeparator = '://';
const backslashRegExp = /\\/g;

const reducePathComponents = (components: readonly string[]) => {
  if (!Array.isArray(components) || components.length === 0) {
    return [];
  }
  const reduced = [components[0]];
  for (let i = 1; i < components.length; i++) {
    const component = components[i];
    if (!component) continue;
    if (component === '.') continue;
    if (component === '..') {
      if (reduced.length > 1) {
        if (reduced[reduced.length - 1] !== '..') {
          reduced.pop();
          continue;
        }
      } else if (reduced[0]) continue;
    }
    reduced.push(component);
  }
  return reduced;
};

const getRootLength = (path: string) => {
  const rootLength = getEncodedRootLength(path);
  return rootLength < 0 ? ~rootLength : rootLength;
};

const getEncodedRootLength = (path: string): number => {
  if (!path) return 0;
  const ch0 = path.charCodeAt(0);

  // POSIX or UNC
  if (ch0 === CharacterCodes.slash || ch0 === CharacterCodes.backslash) {
    if (path.charCodeAt(1) !== ch0) return 1; // POSIX: "/" (or non-normalized "\")

    const p1 = path.indexOf(ch0 === CharacterCodes.slash ? '/' : altDirectorySeparator, 2);
    if (p1 < 0) return path.length; // UNC: "//server" or "\\server"

    return p1 + 1; // UNC: "//server/" or "\\server\"
  }

  // DOS
  if (isVolumeCharacter(ch0) && path.charCodeAt(1) === CharacterCodes.colon) {
    const ch2 = path.charCodeAt(2);
    if (ch2 === CharacterCodes.slash || ch2 === CharacterCodes.backslash) return 3; // DOS: "c:/" or "c:\"
    if (path.length === 2) return 2; // DOS: "c:" (but not "c:d")
  }

  // URL
  const schemeEnd = path.indexOf(urlSchemeSeparator);
  if (schemeEnd !== -1) {
    const authorityStart = schemeEnd + urlSchemeSeparator.length;
    const authorityEnd = path.indexOf('/', authorityStart);
    if (authorityEnd !== -1) {
      // URL: "file:///", "file://server/", "file://server/path"
      // For local "file" URLs, include the leading DOS volume (if present).
      // Per https://www.ietf.org/rfc/rfc1738.txt, a host of "" or "localhost" is a
      // special case interpreted as "the machine from which the URL is being interpreted".
      const scheme = path.slice(0, schemeEnd);
      const authority = path.slice(authorityStart, authorityEnd);
      if (
        scheme === 'file' &&
        (authority === '' || authority === 'localhost') &&
        isVolumeCharacter(path.charCodeAt(authorityEnd + 1))
      ) {
        const volumeSeparatorEnd = getFileUrlVolumeSeparatorEnd(path, authorityEnd + 2);
        if (volumeSeparatorEnd !== -1) {
          if (path.charCodeAt(volumeSeparatorEnd) === CharacterCodes.slash) {
            // URL: "file:///c:/", "file://localhost/c:/", "file:///c%3a/", "file://localhost/c%3a/"
            return ~(volumeSeparatorEnd + 1);
          }
          if (volumeSeparatorEnd === path.length) {
            // URL: "file:///c:", "file://localhost/c:", "file:///c$3a", "file://localhost/c%3a"
            // but not "file:///c:d" or "file:///c%3ad"
            return ~volumeSeparatorEnd;
          }
        }
      }
      return ~(authorityEnd + 1); // URL: "file://server/", "http://server/"
    }
    return ~path.length; // URL: "file://server", "http://server"
  }

  // relative
  return 0;
};

const isVolumeCharacter = (charCode: number) =>
  (charCode >= CharacterCodes.a && charCode <= CharacterCodes.z) ||
  (charCode >= CharacterCodes.A && charCode <= CharacterCodes.Z);

const getFileUrlVolumeSeparatorEnd = (url: string, start: number) => {
  const ch0 = url.charCodeAt(start);
  if (ch0 === CharacterCodes.colon) return start + 1;
  if (ch0 === CharacterCodes.percent && url.charCodeAt(start + 1) === CharacterCodes._3) {
    const ch2 = url.charCodeAt(start + 2);
    if (ch2 === CharacterCodes.a || ch2 === CharacterCodes.A) return start + 3;
  }
  return -1;
};

const pathComponents = (path: string, rootLength: number) => {
  const root = path.substring(0, rootLength);
  const rest = path.substring(rootLength).split('/');
  const restLen = rest.length;
  if (restLen > 0 && !rest[restLen - 1]) {
    rest.pop();
  }
  return [root, ...rest];
};

/**
 * Same as normalizePath(), expect it'll also strip any query strings
 * from the path name. So /dir/file.css?tag=cmp-a becomes /dir/file.css
 * @param p the path to normalize
 * @returns the normalized path, sans any query strings
 */
export const normalizeFsPath = (p: string) => normalizePath(p.split('?')[0].replace(/\0/g, ''));

export const normalizeFsPathQuery = (importPath: string) => {
  const pathParts = importPath.split('?');
  const filePath = normalizePath(pathParts[0]);
  const ext = filePath.split('.').pop().toLowerCase();
  const params = pathParts.length > 1 ? new URLSearchParams(pathParts[1]) : null;
  const format = params ? params.get('format') : null;

  return {
    filePath,
    ext,
    params,
    format,
  };
};

const enum CharacterCodes {
  a = 0x61,
  A = 0x41,
  z = 0x7a,
  Z = 0x5a,
  _3 = 0x33,

  backslash = 0x5c, // \
  colon = 0x3a, // :
  dot = 0x2e, // .
  percent = 0x25, // %
  slash = 0x2f, // /
}
