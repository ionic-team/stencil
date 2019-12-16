import * as d from '../../declarations';
import { Plugin, TransformResult, PluginContext } from 'rollup';
import path from 'path';
import { bundleOutput } from './bundle-output';
import { normalizeFsPath, hasError } from '@utils';
import { optimizeModule } from '../optimize/optimize-module';

export const workerPlugin = (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, platform: string): Plugin => {
  if (platform === 'worker') {
    return {
      name: 'workerPlugin',
    };
  }
  const workersMap = new Map<string, WorkerMeta>();

  return {
    name: 'workerPlugin',

    buildStart() {
      workersMap.clear();
    },

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

      // Canonical worker path
      if (id.endsWith('?worker')) {
        const workerEntryPath = normalizeFsPath(id);
        const { referenceId, dependencies } = await getWorker(config, compilerCtx, buildCtx, this, workersMap, workerEntryPath);
        dependencies.forEach(id => this.addWatchFile(id));
        return {
          code: getWorkerMain(referenceId),
          moduleSideEffects: false,
        };
      }

      // Proxy worker path
      const workerEntryPath = getWorkerEntryPath(id);
      if (workerEntryPath != null) {
        const worker = await getWorker(config, compilerCtx, buildCtx, this, workersMap, workerEntryPath);
        return {
          code: getWorkerProxy(workerEntryPath, worker.exports),
          moduleSideEffects: false,
        };
      }
      return null;
    }
  };
};

const getWorkerEntryPath = (id: string) => {
  if (WORKER_SUFFIX.some(p => id.endsWith(p))) {
    return normalizeFsPath(id);
  }
  return null;
};

interface WorkerMeta {
  referenceId: string;
  exports: string[];
  dependencies: string[];
}

const getWorker = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, ctx: PluginContext, workersMap: Map<string, WorkerMeta>, workerEntryPath: string): Promise<WorkerMeta> => {
  let worker = workersMap.get(workerEntryPath);
  if (!worker) {
    worker = await buildWorker(config, compilerCtx, buildCtx, ctx, workerEntryPath);
    workersMap.set(workerEntryPath, worker);
  }
  return worker;
}

const buildWorker = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, ctx: PluginContext, workerEntryPath: string) => {
  const workerName = path.basename(workerEntryPath, '.ts');
  const build = await bundleOutput(config, compilerCtx, buildCtx, {
    platform: 'worker',
    id: `worker-${workerName}`,
    inputs: {
      'index': workerEntryPath
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
    ctx.error('Workers should not have any external imports: ' + JSON.stringify(entryPoint.imports));
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
  const referenceId = ctx.emitFile({
    type: 'asset',
    source: code,
    name: workerName + '.js',
  });

  return {
    referenceId,
    exports: entryPoint.exports,
    dependencies: Object.keys(entryPoint.modules)
      .filter(id => !/\0/.test(id) && id !== workerEntryPath)
  };
}

const WORKER_SUFFIX = [
  '.worker.ts',
  '.worker.tsx',
  '.worker/index.ts',
  '.worker/index.tsx',
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

const getWorkerMain = (referenceId: string) => {
  return `
import { createWorker } from '${WORKER_HELPER_ID}';
export const workerPath = import.meta.ROLLUP_FILE_URL_${referenceId};
export const worker = /*@__PURE__*/createWorker(workerPath);
`;
};



const getWorkerProxy = (workerEntryPath: string, exportedMethods: string[]) => {
  return `
import { createProxy } from '${WORKER_HELPER_ID}';
import { worker } from '${workerEntryPath}?worker';
${exportedMethods.map(exportedMethod => {
  return `export const ${exportedMethod} = /*@__PURE__*/createProxy(worker, '${exportedMethod}');`;
}).join('\n')}
`;
};
