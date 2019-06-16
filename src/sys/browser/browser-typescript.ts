import * as d from '../../declarations';
import fs from 'fs';
import path from 'path';
import ts from 'typescript';


export function setBrowserTypescriptSys(config: d.BrowserConfig) {
  ts.sys = {
    args: [],
    newLine: '\n',
    useCaseSensitiveFileNames: false,
    write(s: string) {
      config.win.console.log(s);
    },
    readFile(p: string, encoding: string) {
      return fs.readFileSync(p, encoding);
    },
    writeFile(p: string, data: string, _writeByteOrderMark: boolean) {
      fs.writeFileSync(p, data);
    },
    resolvePath(p: string) {
      return path.resolve(p);
    },
    fileExists(p: string) {
      return fs.existsSync(p);
    },
    directoryExists(p: string) {
      return fs.existsSync(p);
    },
    createDirectory(p: string) {
      fs.mkdirSync(p);
    },
    getExecutingFilePath() {
      return config.win.location.href;
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
