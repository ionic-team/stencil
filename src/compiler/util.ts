import { BANNER, ENCAPSULATION } from '../util/constants';
import { BuildConfig, BuildContext, Diagnostic, FilesMap, StencilSystem } from '../util/interfaces';


export function getBuildContext(ctx?: BuildContext) {
  // create the build context if it doesn't exist
  ctx = ctx || {};

  ctx.diagnostics = ctx.diagnostics || [];
  ctx.manifest = ctx.manifest || {};
  ctx.registry = ctx.registry || {};
  ctx.filesToWrite = ctx.filesToWrite || {};
  ctx.appFiles = ctx.appFiles || {};
  ctx.moduleFiles = ctx.moduleFiles || {};
  ctx.jsFiles = ctx.jsFiles || {};
  ctx.cssFiles = ctx.cssFiles || {};
  ctx.dependentManifests = ctx.dependentManifests || {};
  ctx.compiledFileCache = ctx.compiledFileCache || {};
  ctx.moduleBundleOutputs = ctx.moduleBundleOutputs || {};
  ctx.styleSassUnscopedOutputs = ctx.styleSassUnscopedOutputs || {};
  ctx.styleSassScopedOutputs = ctx.styleSassScopedOutputs || {};
  ctx.styleCssUnscopedOutputs = ctx.styleCssUnscopedOutputs || {};
  ctx.styleCssScopedOutputs = ctx.styleCssScopedOutputs || {};
  ctx.changedFiles = ctx.changedFiles || [];

  return ctx;
}


export function resetBuildContext(ctx: BuildContext) {
  ctx.registry = {};
  ctx.manifest = {};
  ctx.diagnostics = [];
  ctx.sassBuildCount = 0;
  ctx.transpileBuildCount = 0;
  ctx.indexBuildCount = 0;
  ctx.moduleBundleCount = 0;
  ctx.styleBundleCount = 0;
  ctx.prerenderedUrls = 0;
  delete ctx.localPrerenderServer;
}


export function getJsFile(sys: StencilSystem, ctx: BuildContext, jsFilePath: string) {
  jsFilePath = normalizePath(jsFilePath);

  if (typeof ctx.filesToWrite[jsFilePath] === 'string') {
    return Promise.resolve(ctx.filesToWrite[jsFilePath]);
  }

  if (typeof ctx.jsFiles[jsFilePath] === 'string') {
    return Promise.resolve(ctx.jsFiles[jsFilePath]);
  }

  return new Promise<string>((resolve, reject) => {
    sys.fs.readFile(jsFilePath, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        ctx.jsFiles[jsFilePath] = data;
        resolve(data);
      }
    });
  });
}


export function readFile(sys: StencilSystem, filePath: string) {
  return new Promise<string>((resolve, reject) => {
    sys.fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}


export function writeFiles(sys: StencilSystem, rootDir: string, filesToWrite: FilesMap): Promise<any> {
  const directories = getDirectoriesFromFiles(sys, filesToWrite);
  return ensureDirectoriesExist(sys, directories, [rootDir]).then(() => {
    return writeToDisk(sys, filesToWrite);
  });
}


function writeToDisk(sys: StencilSystem, filesToWrite: FilesMap): Promise<any> {
  // assumes directories to be saved in already exit
  return new Promise((resolve, reject) => {
    const filePathsToWrite = Object.keys(filesToWrite);

    let doneWriting = 0;
    let rejected = false;

    if (!filePathsToWrite.length) {
      // shouldn't be possible, but ya never know
      resolve();
      return;
    }

    filePathsToWrite.forEach(filePathToWrite => {
      sys.fs.writeFile(filePathToWrite, filesToWrite[filePathToWrite], (err) => {
        if (err) {
          rejected = true;
          reject(err);

        } else {
          doneWriting++;
          if (doneWriting >= filePathsToWrite.length && !rejected) {
            resolve();
          }
        }
      });
    });
  });
}


export function ensureDirectoriesExist(sys: StencilSystem, directories: string[], existingDirectories: string[]) {
  return new Promise(resolve => {

    const knowExistingDirPaths = existingDirectories.map(existingDirectory => {
      return normalizePath(existingDirectory).split('/');
    });

    const checkDirectories = sortDirectories(directories).slice();

    function ensureDir() {
      if (checkDirectories.length === 0) {
        resolve();
        return;
      }

      // double check this path has been normalized with / paths
      const checkDirectory = normalizePath(checkDirectories.shift());

      const dirPaths = checkDirectory.split('/');
      let pathSections = 1;

      function ensureSection() {
        if (pathSections > dirPaths.length) {
          ensureDir();
          return;
        }

        const checkDirPaths = dirPaths.slice(0, pathSections);

        // should have already been normalized to / paths
        const dirPath = checkDirPaths.join('/');

        for (var i = 0; i < knowExistingDirPaths.length; i++) {
          var existingDirPaths = knowExistingDirPaths[i];
          var alreadyExists = true;

          for (var j = 0; j < checkDirPaths.length; j++) {
            if (checkDirPaths[j] !== existingDirPaths[j]) {
              alreadyExists = false;
              break;
            }
          }

          if (alreadyExists) {
            pathSections++;
            ensureSection();
            return;
          }
        }

        sys.fs.mkdir(normalizePath(dirPath), () => {
          // not worrying about the error here
          // if there's an error, it's probably because this directory already exists
          // which is what we want, no need to check access AND mkdir
          // should have already been normalized to / paths
          knowExistingDirPaths.push(dirPath.split('/'));
          pathSections++;
          ensureSection();
        });
      }

      ensureSection();
    }

    ensureDir();
  });
}


function getDirectoriesFromFiles(sys: StencilSystem, filesToWrite: FilesMap) {
  const directories: string[] = [];

  Object.keys(filesToWrite).forEach(filePath => {
    const dir = normalizePath(sys.path.dirname(filePath));
    if (directories.indexOf(dir) === -1) {
      directories.push(dir);
    }
  });

  return directories;
}


function sortDirectories(directories: string[]) {
  return directories.sort((a, b) => {
    // should have already been normalized to / paths
    const aPaths = a.split('/').length;
    const bPaths = b.split('/').length;

    if (aPaths < bPaths) return -1;
    if (aPaths > bPaths) return 1;

    if (a < b) return -1;
    if (a > b) return 1;

    return 0;
  });
}


export function isTsFile(filePath: string) {
  const parts = filePath.toLowerCase().split('.');
  if (parts.length > 1) {
    if (parts[parts.length - 1] === 'ts' || parts[parts.length - 1] === 'tsx') {
      if (parts.length > 2 && (parts[parts.length - 2] === 'd' || parts[parts.length - 2] === 'spec')) {
        return false;
      }
      return true;
    }
  }
  return false;
}


export function isDtsFile(filePath: string) {
  const parts = filePath.toLowerCase().split('.');
  if (parts.length > 2) {
    return (parts[parts.length - 2] === 'd' && parts[parts.length - 1] === 'ts');
  }
  return false;
}


export function isJsFile(filePath: string) {
  const parts = filePath.toLowerCase().split('.');
  if (parts.length > 1) {
    if (parts[parts.length - 1] === 'js') {
      if (parts.length > 2 && parts[parts.length - 2] === 'spec') {
        return false;
      }
      return true;
    }
  }
  return false;
}


export function isSassFile(filePath: string) {
  const ext = filePath.split('.').pop().toLowerCase();
  return ext === 'scss' || ext === 'sass';
}


export function isCssFile(filePath: string) {
  return filePath.split('.').pop().toLowerCase() === 'css';
}


export function isHtmlFile(filePath: string) {
  const ext = filePath.split('.').pop().toLowerCase();
  return ext === 'html' || ext === 'htm';
}

export function isWebDevFile(filePath: string) {
  const ext = filePath.split('.').pop().toLowerCase();
  return (WEB_DEV_EXT.indexOf(ext) > -1 || isTsFile(filePath));
}
const WEB_DEV_EXT = ['js', 'jsx', 'html', 'htm', 'css', 'scss', 'sass'];


export function generatePreamble(config: BuildConfig) {
  let preamble: string[] = [];

  if (config.preamble) {
    preamble = config.preamble.split('\n');
  }

  preamble.push(BANNER);

  if (preamble.length > 1) {
    preamble = preamble.map(l => ` * ${l}`);

    preamble.unshift(`/*!`);
    preamble.push(` */\n`);

    return preamble.join('\n');
  }

  return `/*! ${BANNER} */\n`;
}


export function buildError(diagnostics: Diagnostic[]) {
  const d: Diagnostic = {
    level: 'error',
    type: 'build',
    header: 'build error',
    messageText: 'build error',
    relFilePath: null,
    absFilePath: null,
    lines: []
  };

  diagnostics.push(d);

  return d;
}


export function buildWarn(diagnostics: Diagnostic[]) {
  const d: Diagnostic = {
    level: 'warn',
    type: 'build',
    header: 'build warn',
    messageText: 'build warn',
    relFilePath: null,
    absFilePath: null,
    lines: []
  };

  diagnostics.push(d);

  return d;
}


export function catchError(diagnostics: Diagnostic[], err: Error) {
  const d: Diagnostic = {
    level: 'error',
    type: 'build',
    header: 'build error',
    messageText: 'build error',
    relFilePath: null,
    absFilePath: null,
    lines: []
  };

  if (err) {
    if (err.stack) {
      d.messageText = err.stack.toString();

    } else {
      if (err.message) {
        d.messageText = err.message.toString();

      } else {
        d.messageText = err.toString();
      }
    }
  }

  diagnostics.push(d);

  return d;
}


export function hasError(diagnostics: Diagnostic[]) {
  return diagnostics.some(d => d.level === 'error' && d.type !== 'runtime');
}


export function componentRequiresScopedStyles(encapsulation: ENCAPSULATION) {
  return (encapsulation === ENCAPSULATION.ScopedCss || encapsulation === ENCAPSULATION.ShadowDom);
}


export function normalizePath(str: string) {
  // Convert Windows backslash paths to slash paths: foo\\bar ➔ foo/bar
  // https://github.com/sindresorhus/slash MIT
  // By Sindre Sorhus
  if (EXTENDED_PATH_REGEX.test(str) || NON_ASCII_REGEX.test(str)) {
    return str;
  }

  return str.replace(SLASH_REGEX, '/');
}

const EXTENDED_PATH_REGEX = /^\\\\\?\\/;
const NON_ASCII_REGEX = /[^\x00-\x80]+/;
const SLASH_REGEX = /\\/g;
