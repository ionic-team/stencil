import * as d from '../../declarations';
import { Plugin } from 'rollup';
import path from 'path';
import { bundleOutput } from './bundle-output';
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

const WORKER_INTRO = `
const exports = {};
addEventListener('message', async ({data}) => {
  let id = data[0];
  let method = data[1];
  if (id.startsWith('stncl-') && method) {
    let args = data[2];
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
      [id, value, err],
      value instanceof ArrayBuffer ? [value] : []
    );
  }
});
`

const getWorkerMain = (referenceId: string, workerName: string, exportedMethod: string[]) => {
  return `
export const worker = new Worker(import.meta.ROLLUP_FILE_URL_${referenceId}, {name: "${workerName}"});
const methods = /*@__PURE__*/(() => {
  let id = 0;
  const pending = new Map();
  const proxy = {};
  worker.addEventListener('message', ({data}) => {
    const id = data[0];
    if (id.startsWith('stncl-')) {
      const [resolve, reject] = pending.get(id);
      pending.delete(id);
      if (data[2]) {
        reject(data[2]);
      } else {
        resolve(data[1]);
      }
    }
  });
  ${JSON.stringify(exportedMethod)}.forEach(method => {
    proxy[method] = (...args) => {
      return new Promise((resolve, reject) => {
        const key = 'stncl-' + id++;
        pending.set(key, [resolve, reject]);
        return worker.postMessage(
          [key, method, args],
          args.filter(a => a instanceof ArrayBuffer)
        );
      });
    };
  });
  return proxy;
})();

export default methods;

`
}
