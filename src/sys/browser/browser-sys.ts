import * as d from '../../declarations';
import { BrowserRollup } from './browser-rollup';
import { isOutputTargetWww } from '../../compiler/output-targets/output-utils';
import { setBrowserTypescriptSys } from './browser-typescript';
import fs from 'fs';
import path from 'path';


export const browserSystem = (config: d.BrowserConfig) => {
  const resolved = Promise.resolve();

  const sys: d.StencilSystem = {

    cancelWorkerTasks() {/**/},

    compiler: {
      name: 'stencil',
      version: '0.0.0',
      typescriptVersion: '0.0.0',
      runtime: '0.0.0',
      packageDir: '/node_modules/@stencil/core',
      distDir: '/node_modules/@stencil/core/dist'
    },

    copy(_copyTasks: d.CopyTask[]) {
      return Promise.resolve(null);
    },

    createFsWatcher(_config: d.Config, _fs: d.FileSystem, _events: d.BuildEvents) {
      const fsWatcher: d.FsWatcher = null;
      return Promise.resolve(fsWatcher);
    },

    destroy() {/**/},

    addDestroy(_fn: Function) {/**/},

    details: {
      cpuModel: 'browser',
      cpus: 1,
      freemem() { return 0; },
      platform: config.win.navigator.userAgent,
      runtime: 'browser',
      runtimeVersion: '',
      release: '',
      totalmem: 0,
      tmpDir: ''
    },

    fs: fs as any,

    generateContentHash(content: string, _length: number) {
      const encoder = new TextEncoder();
      const data = encoder.encode(content);
      return (config.win.crypto.subtle.digest('SHA-256', data) as Promise<any>).then(b => {
        return hexString(b);
      });
    },

    minifyJs(_input: string, _opts: any) {
      return Promise.resolve(null);
    },

    nextTick(cb: Function) {
      resolved.then(cb as any);
    },

    optimizeCss(_inputOpts: d.OptimizeCssInput): Promise<d.OptimizeCssOutput> {
      return Promise.resolve(null);
    },

    path: path,

    rollup: BrowserRollup
  };

  initBrowserSysFs();
  setBrowserTypescriptSys(config);

  if (config.outputTargets) {
    config.outputTargets.filter(isOutputTargetWww).forEach(output => {
      output.prerenderConfig = null;
      output.serviceWorker = null;
    });
  }

  return sys;
};


const initBrowserSysFs = () => {
  fs.mkdirSync('/');
  fs.mkdirSync('/node_modules');
  fs.mkdirSync('/node_modules/@stencil');
  fs.mkdirSync('/node_modules/@stencil/core');
  fs.mkdirSync('/node_modules/@stencil/core/dist');
  fs.mkdirSync('/node_modules/@stencil/core/dist/client');

  fs.writeFileSync('/node_modules/@stencil/core/dist/client/index.mjs', '$COMPILER_CLIENT_INDEX$');

  fs.writeFileSync('/node_modules/@stencil/core/package.json', '$CORE_PACKAGE_JSON$');
};


const hexString = (buffer: any) => {
  return [...new Uint8Array(buffer)].map(b => {
    return b.toString(16).padStart(2, '0');
  }).join('');
};
