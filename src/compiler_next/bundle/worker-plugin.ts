import * as d from '../../declarations';
import { Plugin, TransformResult } from 'rollup';
import path from 'path';
import { bundleOutput } from './bundle-output';
import { normalizeFsPath, hasError } from '@utils';
import { optimizeModule } from '../optimize/optimize-module';

export const workerPlugin = (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx): Plugin => {
  return {
    name: 'workerPlugin',

    resolveId(id) {
      if (id === WORKER_HELPER_ID) {
        return {
          id,
          moduleSideEffects: false
        };
      }
      return null;
    },

    load(id) {
      if (id === WORKER_HELPER_ID) {
        return WORKER_HELPERS;
      }
      return null;
    },

    async transform(_, id): Promise<TransformResult> {
      if (/\0/.test(id)) {
        return null;
      }

      const workerEntryPath = getWorkerEntryPath(id);
      if (workerEntryPath != null) {
        const exportWorker = id.includes('?worker');
        const workerName = path.basename(workerEntryPath, '.ts');

        // Rollup worker
        const build = await bundleOutput(config, compilerCtx, buildCtx, {
          platform: 'worker',
          id: `worker-${workerName}`,
          inputs: {
            'index': workerEntryPath + '?worker-entry'
          },
          inlineDynamicImports: true,
        });

        // Generate commonjs output so we can intercept exports at runtme
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

        // Optimize code
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

        // Put worker in an asset so new Worker() can reference it later
        const referenceId = this.emitFile({
          type: 'asset',
          source: code,
          name: workerName + '.js',
        });

        Object.keys(entryPoint.modules)
          .filter(id => !/\0/.test(id) && id !== workerEntryPath)
          .forEach(id => this.addWatchFile(id));
        return {
          code: getWorkerMain(referenceId, workerName, entryPoint.exports, exportWorker),
          moduleSideEffects: false,
        };
      }
      return null;
    }
  };
};

const getWorkerEntryPath = (id: string) => {
  if (!id.includes('?worker-entry') && WORKER_SUFFIX.some(p => id.endsWith(p))) {
    return normalizeFsPath(id);
  }
  return null;
};

const WORKER_SUFFIX = [
  '?worker',
  '.worker',
  '.worker/index.ts',
  '.worker/index.tsx',
  '.worker/index.js',
  '.worker/index.mjs',
];

const WORKER_HELPER_ID = '@worker-helper';

const WORKER_INTRO = `
const exports = {};
addEventListener('message', async ({data}) => {
  if (data && data[0] === 'stencil') {
    let id = data[1];
    let method = data[2];
    let args = data[3];
    let i = 0;
    let argsLen = args.length;
    let value;
    let err;
    let destroyIds;

    try {
      for (; i < argsLen; i++) {
        if (Array.isArray(args[i]) && args[i][0] === 'stencil-callback') {
          const callbackId = args[i][1];
          const cb = (...cbArgs) => {
            postMessage(
              ['stencil-callback', callbackId, cbArgs]
            );
          };
          args[i] = cb;
          (destroyIds = destroyIds || []).push(callbackId);
        }
      }

      value = await exports[method](...args);

      if (destroyIds) {
        value = ['stencil-destroy', destroyIds];
      }

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
let pendingIds = 0;
let callbackIds = 0;
const pending = new Map();
const callbacks = new Map();

export const createWorker = (workerPath, workerOpts) => {
  const worker = new Worker(workerPath, workerOpts);
  worker.addEventListener('message', ({data}) => {
    if (data) {
      const msgType = data[0];
      const id = data[1];
      const value = data[2];
      const err = data[3];
      if (msgType === 'stencil') {
        const [resolve, reject] = pending.get(id);
        pending.delete(id);
        if (err) {
          reject(err);
        } else {
          if (Array.isArray(value) && value[0] === 'stencil-destroy') {
            for (let i = 0, l = value[1].length; i < l; i++) {
              callbacks.delete(value[1][i]);
            }
            value = undefined;
          }
          resolve(value);
        }
      } else if (msgType === 'stencil-callback') {
        try {
          callbacks.get(id)(...value);
        } catch (e) {
          console.error(e);
        }
      }
    }
  });
  return worker;
};

export const createProxy = (worker, exportedMethod) => (
  (...args) => new Promise((resolve, reject) => {
    const pendingId = pendingIds++;
    pending.set(pendingId, [resolve, reject]);

    for (let i = 0, l = args.length; i < l; i++) {
      if (typeof args[i] === 'function') {
        const callbackId = callbackIds++;
        callbacks.set(callbackId, args[i]);
        args[i] = ['stencil-callback', callbackId];
      }
    }

    worker.postMessage(
      ['stencil', pendingId, exportedMethod, args],
      args.filter(a => a instanceof ArrayBuffer)
    );
  })
);
`;


const getWorkerMain = (referenceId: string, workerName: string, exportedMethods: string[], exportWorker: boolean) => {
  return `
import { createProxy, createWorker } from '${WORKER_HELPER_ID}';
${exportWorker ? 'export ' : ''}const worker = createWorker(import.meta.ROLLUP_FILE_URL_${referenceId}, {name: "${workerName}"});
${exportedMethods.map(exportedMethod => {
  return `export const ${exportedMethod} = /*@__PURE__*/createProxy(worker, '${exportedMethod}');`;
}).join('\n')}
`;
};
