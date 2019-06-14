import * as d from '../../declarations';
import path from 'path';
import ts from 'typescript';


export function setBrowserTypescriptSys(config: d.BrowserConfig) {
  ts.sys = {
    args: [],
    newLine: '\n',
    useCaseSensitiveFileNames: false,
    write(s: string) {
      config.window.console.log(s);
    },
    readFile(p: string, encoding: string) {
      return config.fs.readFileSync(p, encoding);
    },
    writeFile(p: string, data: string, _writeByteOrderMark: boolean) {
      config.fs.writeFileSync(p, data);
    },
    resolvePath(p: string) {
      return path.resolve(p);
    },
    fileExists(p: string) {
      return config.fs.existsSync(p);
    },
    directoryExists(p: string) {
      return config.fs.existsSync(p);
    },
    createDirectory(p: string) {
      config.fs.mkdirSync(p);
    },
    getExecutingFilePath() {
      return config.window.location.href;
    },
    getCurrentDirectory() {
      return '/';
    },
    getDirectories(_path: string) {
      const dirs: string[] = [];

      return dirs;
    },
    readDirectory(_path: string, _extensions?: ReadonlyArray<string>, _exclude?: ReadonlyArray<string>, _include?: ReadonlyArray<string>, _depth?: number) {
      const files: string[] = [];

      return files;
    },
    exit(exitCode: number) {
      console.log('typescript exit:', exitCode);
    }
  };
}
