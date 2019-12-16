import * as d from '../../declarations';
import { Plugin } from 'rollup';
import path from 'path';
import { bundleOutput } from './bundle-output';
import { normalizeFsPath, hasError } from '@utils';
import { optimizeModule } from '../optimize/optimize-module';

export const workerPlugin = (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx): Plugin => {
  return {
    name: 'workerPlugin',

    resolveId(id) {
      if (id === WORKER_HELPER_ID) {
        return id;
      }
      return null;
    },

    load(id) {
      if (id === WORKER_HELPER_ID) {
        return WORKER_HELPERS;
      }
      return null;
    },

    async transform(_, id) {
      if (/\0/.test(id)) {
        return null;
      }
      if (id.endsWith('?worker')) {
        const filePath = normalizeFsPath(id)
        const workerName = path.basename(filePath, '.ts');
        const build = await bundleOutput(config, compilerCtx, buildCtx, {
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
        const results = await optimizeModule(config, compilerCtx, {
          input: code,
          sourceTarget: config.buildEs5 ? 'es5' : 'es2017',
          isCore: false,
          minify: config.minifyJs,
          inlineHelpers: true
        });
        buildCtx.diagnostics.push(...results.diagnostics);
        if (!hasError(results.diagnostics)) {
          code = results.output;
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

const WORKER_HELPER_ID = '@worker-helper';

const WORKER_INTRO = `
const exports = {};
addEventListener('message', async ({data}) => {
  if (data[0] === 'stencil') {
    let id = data[1];
    let method = data[2];
    let args = data[3];
    let value;
    let err;
    try {
      value = await exports[method](...args);
    } catch (e) {
      err = {
        message: typeof e === 'string' ? e : e.message,
        stack: e.stack
      };
    }
    postMessage(
      ['stencil', id, value, err],
      value instanceof ArrayBuffer ? [value] : []
    );
  }
});
`

export const WORKER_HELPERS = `
export const createProxy = (worker, exportedMethod) => {
  let id = 0;
  const pending = new Map();
  const proxy = {};
  worker.addEventListener('message', ({data}) => {
    if (data[0] === 'stencil') {
      const id = data[1];
      const [resolve, reject] = pending.get(id);
      pending.delete(id);
      if (data[3]) {
        reject(data[3]);
      } else {
        resolve(data[2]);
      }
    }
  });
  exportedMethod.forEach(method => {
    proxy[method] = (...args) => {
      return new Promise((resolve, reject) => {
        const key = id++;
        pending.set(key, [resolve, reject]);
        return worker.postMessage(
          ['stencil', key, method, args],
          args.filter(a => a instanceof ArrayBuffer)
        );
      });
    };
  });
  return proxy;
};
`;


const getWorkerMain = (referenceId: string, workerName: string, exportedMethod: string[]) => {
  return `
import {createProxy} from '${WORKER_HELPER_ID}';
export const worker = new Worker(import.meta.ROLLUP_FILE_URL_${referenceId}, {name: "${workerName}"});
const methods = /*@__PURE__*/createProxy(worker, ${JSON.stringify(exportedMethod)});
export default methods;`;
};

