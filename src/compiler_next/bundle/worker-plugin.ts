import * as d from '../../declarations';
import { Plugin } from 'rollup';
import path from 'path';
import { bundleApp } from './bundle-output';
import { normalizeFsPath, hasError } from '@utils';
import { optimizeModule } from '../optimize/optimize-module';

export const workerPlugin = (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx): Plugin => {
  return {
    name: 'workerPlugin',

    async transform(_, id) {
      if (/\0/.test(id)) {
        return null;
      }
      if (id.endsWith('?worker')) {
        const filePath = normalizeFsPath(id)
        const workerName = path.basename(filePath, '.ts');
        const build = await bundleApp(config, compilerCtx, buildCtx, {
          platform: 'worker',
          id: `worker-${id}`,
          inputs: {
            'index': filePath
          },
          inlineDynamicImports: true,
        });
        const output = await build.generate({
          format: 'commonjs',
          intro: WORKER_INTRO,
          esModule: false,
          preferConst: true,
          externalLiveBindings: false
        });
        const entryPoint = output.output[0];
        if (entryPoint.imports.length > 0) {
          this.error('Workers should not have any external imports: ' + JSON.stringify(entryPoint.imports));
        }
        let code = entryPoint.code;
        if (config.minifyJs) {
          const results = await optimizeModule(config, compilerCtx, {
            input: code,
            sourceTarget: 'es2017',
            isCore: false,
            minify: true,
          });
          buildCtx.diagnostics.push(...results.diagnostics);
          if (!hasError(results.diagnostics)) {
            code = results.output;
          }
        }
        const referenceId = this.emitFile({
          type: 'asset',
          source: code,
          name: workerName + '.worker.js'
        });
        return getWorkerMain(referenceId, workerName, entryPoint.exports);
      }
      return null;
    }
  };
};

const WORKER_INTRO = `
const exports = {};
onmessage = async ({data}) => {
  const id = data[0];
  const method = exports[data[1]];
  const args = data[2];
  let value;
  let err;
  try {
    value = await method(...args);
  } catch (e) {
    err = {
      message: typeof e === 'string' ? e : e.message,
      stack: e.stack
    };
  }
  postMessage([id, value, err]);
};
`

const getWorkerMain = (referenceId: string, workerName: string, exportedMethod: string[]) => {
  return `
export const worker = new Worker(import.meta.ROLLUP_FILE_URL_${referenceId}, {name: "${workerName}"});
const methods = /*@__PURE__*/(() => {
  let id = 0;
  const pending = new Map();
  const proxy = {};
  worker.onmessage = (ev) => {
    const [id, value, err] = ev.data;
    const [resolve, reject] = pending.get(id);
    pending.delete(id);
    if (err) {
      reject(err);
    } else {
      resolve(value);
    }
  };
  ${JSON.stringify(exportedMethod)}.forEach(method => {
    proxy[method] = (...args) => {
      return new Promise((resolve, reject) => {
        pending.set(id, [resolve, reject]);
        return worker.postMessage([id++, method, args]);
      });
    };
  });
  return proxy;
})();

export default methods;

`
}
