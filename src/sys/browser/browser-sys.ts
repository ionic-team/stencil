import * as d from '../../declarations';
import { setBrowserTypescriptSys } from './browser-typescript';
import path from 'path';
import { isOutputTargetWww } from '../../compiler/output-targets/output-utils';


export class BrowserSystem implements d.StencilSystem {
  details: d.SystemDetails;
  fs: d.FileSystem;
  path: d.Path;
  resolved = Promise.resolve();

  constructor(config: d.BrowserConfig) {
    this.init(config);
  }

  init(config: d.BrowserConfig) {
    this.details = {
      cpuModel: 'browser',
      cpus: 1,
      freemem() { return 0; },
      platform: config.window.navigator.userAgent,
      runtime: '',
      runtimeVersion: '',
      release: '',
      totalmem: 0,
      tmpDir: ''
    };

    this.path = path;
    this.fs = config.fs;
    setBrowserTypescriptSys(config);

    config.outputTargets.filter(isOutputTargetWww).forEach(output => {
      output.prerenderConfig = null;
      output.serviceWorker = null;
    });
  }

  cancelWorkerTasks() {/**/}

  compiler = {
    name: 'stencil',
    version: '',
    typescriptVersion: '',
    runtime: '',
    packageDir: '',
    distDir: ''
  };

  copy(_copyTasks: d.CopyTask[]) {
    return Promise.resolve(null);
  }

  createFsWatcher(_config: d.Config, _fs: d.FileSystem, _events: d.BuildEvents) {
    const fsWatcher: d.FsWatcher = null;
    return Promise.resolve(fsWatcher);
  }

  destroy() {/**/}

  addDestroy(_fn: Function) {/**/}

  generateContentHash(content: string, _length: number) {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    return (window.crypto.subtle.digest('SHA-256', data) as Promise<any>).then(b => {
      return hexString(b);
    });
  }

  minifyJs(_input: string, _opts: any) {
    return Promise.resolve(null);
  }

  nextTick(cb: Function) {
    this.resolved.then(cb as any);
  }

  optimizeCss(_inputOpts: d.OptimizeCssInput): Promise<d.OptimizeCssOutput> {
    return Promise.resolve(null);
  }

  // rollup?: RollupInterface;
  // scopeCss?: (cssText: string, scopeId: string, commentOriginalSelector: boolean) => Promise<string>;
  // semver?: Semver;
  // serializeNodeToHtml?(elm: Element | Document): string;
  // storage?: Storage;
  // transpileToEs5?(cwd: string, input: string, inlineHelpers: boolean): Promise<d.TranspileResults>;
  // validateTypes?(compilerOptions: any, emitDtsFiles: boolean, currentWorkingDir: string, collectionNames: string[], rootTsFiles: string[]): Promise<d.ValidateTypesResults>;
}


function hexString(buffer: any) {
  const byteArray = new Uint8Array(buffer);

  const hexCodes = [...byteArray].map(value => {
    const hexCode = value.toString(16);
    const paddedHexCode = hexCode.padStart(2, '0');
    return paddedHexCode;
  });

  return hexCodes.join('');
}
