import path from 'path';

const ts: any = {};

export const initTypescript = () => {
  if (!ts.transform) {
    if (globalThis.ts) {
      // doing this so we can lazy load "ts"
      Object.assign(ts, globalThis.ts);
    } else {
      throw new Error(`typescript: missing global "ts" variable`);
    }
  }

  if (!ts.sys) {
    ts.sys = {
      args: [],
      newLine: '\n',
      useCaseSensitiveFileNames: false,
      write(s: string) {
        console.log(s);
      },
      readFile(_p: string, _encoding: string) {
        throw new Error('ts.sys.readFile not implemented');
      },
      writeFile(_p: string, _data: string, _writeByteOrderMark: boolean) {
        throw new Error('ts.sys.writeFile not implemented');
      },
      resolvePath(p: string) {
        return path.resolve(p);
      },
      fileExists(_p: string) {
        throw new Error('ts.sys.fileExists not implemented');
      },
      directoryExists(_p: string) {
        throw new Error('ts.sys.directoryExists not implemented');
      },
      createDirectory(_p: string) {
        throw new Error('ts.sys.createDirectory not implemented');
      },
      getExecutingFilePath() {
        return location.href;
      },
      getCurrentDirectory() {
        return '/';
      },
      getDirectories(_path: string) {
        return [] as string[];
      },
      readDirectory(_path: string, _extensions?: ReadonlyArray<string>, _exclude?: ReadonlyArray<string>, _include?: ReadonlyArray<string>, _depth?: number) {
        return [] as string[];
      },
      exit(exitCode: number) {
        console.log('typescript exit:', exitCode);
      }
    };
  }
};


export default ts;

declare var globalThis: any;
