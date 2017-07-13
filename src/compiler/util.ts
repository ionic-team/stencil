import { BANNER } from '../util/constants';
import { BuildConfig, Diagnostic, FilesMap, StencilSystem } from './interfaces';


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


export function emptyDir(sys: StencilSystem, dir: string) {
  // TODO!
  sys; dir;
  return Promise.resolve();
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


function ensureDirectoriesExist(sys: StencilSystem, directories: string[], existingDirectories: string[]) {
  return new Promise(resolve => {

    const knowExistingDirPaths = existingDirectories.map(existingDirectory => {
      return existingDirectory.split(sys.path.sep);
    });

    const checkDirectories = sortDirectories(sys, directories).slice();

    function ensureDir() {
      if (checkDirectories.length === 0) {
        resolve();
        return;
      }

      const checkDirectory = checkDirectories.shift();

      const dirPaths = checkDirectory.split(sys.path.sep);
      let pathSections = 1;

      function ensureSection() {
        if (pathSections > dirPaths.length) {
          ensureDir();
          return;
        }

        const checkDirPaths = dirPaths.slice(0, pathSections);
        const dirPath = checkDirPaths.join(sys.path.sep);

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

        sys.fs.mkdir(dirPath, () => {
          // not worrying about the error here
          // if there's an error, it's probably because this directory already exists
          // which is what we want, no need to check access AND mkdir
          knowExistingDirPaths.push(dirPath.split(sys.path.sep));
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
    const dir = sys.path.dirname(filePath);
    if (directories.indexOf(dir) === -1) {
      directories.push(dir);
    }
  });

  return directories;
}


function sortDirectories(sys: StencilSystem, directories: string[]) {
  return directories.sort((a, b) => {
    const aPaths = a.split(sys.path.sep).length;
    const bPaths = b.split(sys.path.sep).length;

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
      if (parts.length > 2 && parts[parts.length - 2] === 'd') {
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
  return WEB_DEV_EXT.indexOf(ext) > -1;
}
const WEB_DEV_EXT = ['ts', 'tsx', 'js', 'jsx', 'html', 'htm', 'css', 'scss', 'sass'];


export function hasCmpClass(sourceText: string, filePath: string) {
  if (filePath.indexOf('.tsx') === -1) {
    return false;
  }

  if (sourceText.indexOf('@Component') === -1) {
    return false;
  }

  return true;
}


export function generateBanner(config: BuildConfig) {
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

  return `/*! ${BANNER} */\n\n`;

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


export function normalizePath(str: string) {
  // Convert Windows backslash paths to slash paths: foo\\bar ➔ foo/bar
  // https://github.com/sindresorhus/slash MIT
  // By Sindre Sorhus
  const isExtendedLengthPath = EXTENDED_PATH_REGEX.test(str);
  const hasNonAscii = NON_ASCII_REGEX.test(str);

  if (isExtendedLengthPath || hasNonAscii) {
    return str;
  }

  return str.replace(SLASH_REGEX, '/');
}

const EXTENDED_PATH_REGEX = /^\\\\\?\\/;
const NON_ASCII_REGEX = /[^\x00-\x80]+/;
const SLASH_REGEX = /\\/g;
