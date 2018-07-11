import * as d from '../../declarations';
import { attachMessageHandler } from './worker/worker-child';
import { copyTasksWorker } from '../../compiler/copy/copy-tasks-worker';
import { loadTerserDiagnostics } from '../../util/logger/logger-uglify';
import { normalizePath } from '../../compiler/util';
import { ShadowCss } from '../../compiler/style/shadow-css';
import { transpileToEs5Worker } from '../../compiler/transpile/transpile-to-es5-worker';
import { validateTypesWorker } from '../../compiler/transpile/validate-types-worker';

const autoprefixer = require('autoprefixer');
const CleanCSS = require('clean-css');
const gzipSize = require('gzip-size');
const postcss = require('postcss');
const Terser = require('terser');


export class NodeSystemWorker {
  workerContext: d.WorkerContext = {};

  async autoprefixCss(input: string, opts: any) {
    if (opts == null || typeof opts !== 'object') {
      opts = {
        browsers: [
          'last 2 versions',
          'iOS >= 9',
          'Android >= 4.4',
          'Explorer >= 11',
          'ExplorerMobile >= 11'
        ],
        cascade: false,
        remove: false
      };
    }
    const prefixer = postcss([autoprefixer(opts)]);
    const result = await prefixer.process(input, {
      map: false,
      from: undefined
    });
    return result.css as string;
  }

  copy(copyTasks: d.CopyTask[]) {
    return copyTasksWorker(copyTasks);
  }

  gzipSize(text: string) {
    return gzipSize(text);
  }

  minifyCss(input: string, filePath?: string, opts: any = {}) {
    let minifyInput: any;

    if (typeof filePath === 'string') {
      filePath = normalizePath(filePath);
      minifyInput = {
        [filePath]: {
          styles: input
        }
      };
    } else {
      minifyInput = input;
    }

    const cleanCss = new CleanCSS(opts);
    const result = cleanCss.minify(minifyInput);
    const diagnostics: d.Diagnostic[] = [];

    if (result.errors) {
      result.errors.forEach((msg: string) => {
        diagnostics.push({
          header: 'Minify CSS',
          messageText: msg,
          level: 'error',
          type: 'build'
        });
      });
    }

    if (result.warnings) {
      result.warnings.forEach((msg: string) => {
        diagnostics.push({
          header: 'Minify CSS',
          messageText: msg,
          level: 'warn',
          type: 'build'
        });
      });
    }

    return {
      output: result.styles,
      sourceMap: result.sourceMap,
      diagnostics: diagnostics
    };
  }

  minifyJs(input: string, opts?: any) {
    const result: d.TerserResult = Terser.minify(input, opts);
    const diagnostics: d.Diagnostic[] = [];

    loadTerserDiagnostics(input, result, diagnostics);

    return {
      output: (result.code as string),
      sourceMap: result.sourceMap,
      diagnostics: diagnostics
    };
  }

  scopeCss(cssText: string, scopeAttribute: string, hostScopeAttr: string, slotScopeAttr: string) {
    const sc = new ShadowCss();
    return sc.shimCssText(cssText, scopeAttribute, hostScopeAttr, slotScopeAttr);
  }

  transpileToEs5(cwd: string, input: string) {
    return transpileToEs5Worker(cwd, input);
  }

  validateTypes(compilerOptions: any, emitDtsFiles: boolean, currentWorkingDir: string, collectionNames: string[], rootTsFiles: string[]) {
    return validateTypesWorker(this.workerContext, emitDtsFiles, compilerOptions, currentWorkingDir, collectionNames, rootTsFiles);
  }

}


export function createRunner() {
  const instance: any = new NodeSystemWorker();

  return (methodName: string, args: any[]) => {
    // get the method on the loaded module
    const workerFn = instance[methodName];
    if (typeof workerFn !== 'function') {
      throw new Error(`invalid method: ${methodName}`);
    }

    // call the method on the loaded module
    const rtn = workerFn.apply(instance, args);
    if (rtn == null || typeof rtn.then !== 'function') {
      // sync function returned void or a value that's not a promise
      return Promise.resolve(rtn);
    }

    return rtn as Promise<any>;
  };
}


export { attachMessageHandler };
