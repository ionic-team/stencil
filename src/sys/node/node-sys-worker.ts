import * as d from '../../declarations';
import { attachMessageHandler } from './worker/worker-child';
import { copyTasksWorker } from '../../compiler/copy/copy-tasks-worker';
import { loadMinifyJsDiagnostics } from '../../util/logger/logger-minify-js';
import { optimizeCssWorker } from './optimize-css-worker';
import { requestLatestCompilerVersion } from './check-version';
import { ShadowCss } from '../../compiler/style/shadow-css';
import { transpileToEs5Worker } from '../../compiler/transpile/transpile-to-es5-worker';
import { validateTypesWorker } from '../../compiler/transpile/validate-types-worker';



const Terser = require('terser/dist/bundle.js');


export class NodeSystemWorker {
  workerContext: d.WorkerContext = {};

  copy(copyTasks: d.CopyTask[]) {
    return copyTasksWorker(copyTasks);
  }

  optimizeCss(inputOpts: d.OptimizeCssInput) {
    return optimizeCssWorker(inputOpts);
  }

  minifyJs(input: string, opts?: any) {
    const result: d.MinifyJsResult = Terser.minify(input, opts);
    const diagnostics: d.Diagnostic[] = [];

    loadMinifyJsDiagnostics(input, result, diagnostics);

    return {
      output: (result.code as string),
      sourceMap: result.sourceMap,
      diagnostics: diagnostics
    };
  }

  requestLatestCompilerVersion() {
    return requestLatestCompilerVersion();
  }

  scopeCss(cssText: string, scopeId: string, hostScopeId: string, slotScopeId: string) {
    const sc = new ShadowCss();
    return sc.shimCssText(cssText, scopeId, hostScopeId, slotScopeId);
  }

  transpileToEs5(cwd: string, input: string, inlineHelpers: boolean) {
    return transpileToEs5Worker(cwd, input, inlineHelpers);
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
