import * as d from '../../declarations';
import { Plugin, TransformResult, PluginContext } from 'rollup';
import { bundleOutput } from './bundle-output';
import { normalizeFsPath, hasError } from '@utils';
import { optimizeModule } from '../optimize/optimize-module';

export const workerPlugin = (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  platform: string,
  inlineWorkers: boolean
): Plugin => {
  if (platform === 'worker' || platform === 'hydrate') {
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
          moduleSideEffects: false,
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
        const workerName = getWorkerName(workerEntryPath);
        const { code, dependencies, workerMsgId } = await getWorker(config, compilerCtx, buildCtx, this, workersMap, workerEntryPath);
        const referenceId = this.emitFile({
          type: 'asset',
          source: code,
          name: workerName + '.js',
        });
        dependencies.forEach(id => this.addWatchFile(id));
        return {
          code: getWorkerMain(referenceId, workerName, workerMsgId),
          moduleSideEffects: false,
        };

      } else if (id.endsWith('?worker-inline')) {
        const workerEntryPath = normalizeFsPath(id);
        const workerName = getWorkerName(workerEntryPath);
        const { code, dependencies, workerMsgId } = await getWorker(config, compilerCtx, buildCtx, this, workersMap, workerEntryPath);
        dependencies.forEach(id => this.addWatchFile(id));
        return {
          code: getInlineWorker(code, workerName, workerMsgId),
          moduleSideEffects: false,
        };
      }

      // Proxy worker path
      const workerEntryPath = getWorkerEntryPath(id);
      if (workerEntryPath != null) {
        const worker = await getWorker(config, compilerCtx, buildCtx, this, workersMap, workerEntryPath);
        if (worker) {
          if (inlineWorkers) {
            return {
              code: getInlineWorkerProxy(workerEntryPath, worker.workerMsgId, worker.exports),
              moduleSideEffects: false,
            };
          } else {
            return {
              code: getWorkerProxy(workerEntryPath, worker.exports),
              moduleSideEffects: false,
            };
          }
        }
      }
      return null;
    },
  };
};

const getWorkerEntryPath = (id: string) => {
  if (WORKER_SUFFIX.some(p => id.endsWith(p))) {
    return normalizeFsPath(id);
  }
  return null;
};

interface WorkerMeta {
  code: string;
  workerMsgId: string;
  exports: string[];
  dependencies: string[];
}

const getWorker = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  ctx: PluginContext,
  workersMap: Map<string, WorkerMeta>,
  workerEntryPath: string,
): Promise<WorkerMeta> => {
  let worker = workersMap.get(workerEntryPath);
  if (!worker) {
    worker = await buildWorker(config, compilerCtx, buildCtx, ctx, workerEntryPath);
    workersMap.set(workerEntryPath, worker);
  }
  return worker;
};

const getWorkerName = (id: string) => {
  const parts = id.split('/').filter(i => !i.includes('index'));
  id = parts[parts.length - 1];
  return id.replace('.tsx', '').replace('.ts', '');
};

const buildWorker = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, ctx: PluginContext, workerEntryPath: string) => {
  const workerName = getWorkerName(workerEntryPath);
  const workerMsgId = `stencil.${workerName}`;
  const build = await bundleOutput(config, compilerCtx, buildCtx, {
    platform: 'worker',
    id: workerName,
    inputs: {
      [workerName]: workerEntryPath,
    },
    inlineDynamicImports: true,
  });

  if (build) {
    // Generate commonjs output so we can intercept exports at runtme
    const output = await build.generate({
      format: 'commonjs',
      banner: '(()=>{\n',
      footer: '})();',
      intro: getWorkerIntro(workerMsgId, config.devMode),
      esModule: false,
      preferConst: true,
      externalLiveBindings: false,
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
      inlineHelpers: true,
    });
    buildCtx.diagnostics.push(...results.diagnostics);
    if (!hasError(results.diagnostics)) {
      code = results.output;
    }

    return {
      code,
      exports: entryPoint.exports,
      workerMsgId,
      dependencies: Object.keys(entryPoint.modules).filter(id => !/\0/.test(id) && id !== workerEntryPath),
    };
  }
  return null;
};

const WORKER_SUFFIX = ['.worker.ts', '.worker.tsx', '.worker/index.ts', '.worker/index.tsx'];

const WORKER_HELPER_ID = '@worker-helper';

const getWorkerIntro = (workerMsgId: string, isDev: boolean) => `
const exports = {};
const workerMsgId = '${workerMsgId}';
const workerMsgCallbackId = workerMsgId + '.cb';
const getTransferables = (value) => {
  if (!!value) {
    if (value instanceof ArrayBuffer) {
      return [value];
    }
    if (value.constructor === Object) {
      return [].concat(...Object.keys(value).map(k => getTransferables(value[k])))
    }
    if (typeof value === 'object') {
      return getTransferables(value.buffer);
    }
  }
  return [];
};
addEventListener('message', async ({data}) => {
  if (data && data[0] === workerMsgId) {
    let id = data[1];
    let method = data[2];
    let args = data[3];
    let i = 0;
    let argsLen = args.length;
    let value;
    let err;

    try {
      for (; i < argsLen; i++) {
        if (Array.isArray(args[i]) && args[i][0] === workerMsgCallbackId) {
          const callbackId = args[i][1];
          args[i] = (...cbArgs) => {
            postMessage(
              [workerMsgCallbackId, callbackId, cbArgs]
            );
          };
        }
      }
      ${
        isDev
          ? `
      value = exports[method](...args);
      if (!value || !value.then) {
        throw new Error('The exported method "' + method + '" does not return a Promise, make sure it is an "async" function');
      }
      value = await value;
      `
          : `
      value = await exports[method](...args);`
      }

    } catch (e) {
      value = null;
      ${isDev ? 'console.error(e);' : ''}
      err = {
        message: typeof e === 'string' ? e : e.message,
        stack: e.stack
      };
      value = undefined;
    }

    const transferables = getTransferables(value);
    ${isDev ? `if (transferables.length > 0) console.debug('Transfering', transferables);` : ''}

    postMessage(
      [workerMsgId, id, value, err],
      transferables
    );
  }
});
`;

export const WORKER_HELPERS = `
let pendingIds = 0;
let callbackIds = 0;
const pending = new Map();
const callbacks = new Map();

export const createWorker = (workerPath, workerName, workerMsgId) => {
  const worker = new Worker(workerPath, {name:workerName});

  worker.addEventListener('message', ({data}) => {
    if (data) {
      const workerMsg = data[0];
      const id = data[1];
      const value = data[2];

      if (workerMsg === workerMsgId) {
        const err = data[3];
        const [resolve, reject, callbackIds] = pending.get(id);
        pending.delete(id);

        if (err) {
          reject(err);
        } else {
          if (callbackIds) {
            callbackIds.forEach(id => callbacks.delete(id));
          }
          resolve(value);
        }
      } else if (workerMsg === workerMsgId + '.cb') {
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

export const createWorkerProxy = (worker, workerMsgId, exportedMethod) => (
  (...args) => new Promise((resolve, reject) => {
    let pendingId = pendingIds++;
    let i = 0;
    let argLen = args.length;
    let mainData = [resolve, reject];
    pending.set(pendingId, mainData);

    for (; i < argLen; i++) {
      if (typeof args[i] === 'function') {
        const callbackId = callbackIds++;
        callbacks.set(callbackId, args[i]);
        args[i] = [workerMsgId + '.cb', callbackId];
        (mainData[2] = mainData[2] || []).push(callbackId);
      }
    }
    const postMessage = (w) => (
      w.postMessage(
        [workerMsgId, pendingId, exportedMethod, args],
        args.filter(a => a instanceof ArrayBuffer)
      )
    );
    if (worker.then) {
      worker.then(postMessage);
    } else {
      postMessage(worker);
    }
  })
);
`;

const getWorkerMain = (referenceId: string, workerName: string, workerMsgId: string) => {
  return `
import { createWorker } from '${WORKER_HELPER_ID}';
export const workerName = '${workerName}';
export const workerMsgId = '${workerMsgId}';
export const workerPath = /*@__PURE__*/import.meta.ROLLUP_FILE_URL_${referenceId};
export const worker = /*@__PURE__*/createWorker(workerPath, workerName, workerMsgId);
`;
};

const getInlineWorker = (code: string, workerName: string, workerMsgId: string) => {
  return `
import { createWorker } from '${WORKER_HELPER_ID}';
const blob = new Blob([${JSON.stringify(code)}], { type: 'text/javascript' });
const url = URL.createObjectURL(blob);
export const worker = createWorker(url, '${workerName}', '${workerMsgId}');
URL.revokeObjectURL(url);
`;
};

const getWorkerProxy = (workerEntryPath: string, exportedMethods: string[]) => {
  return `
import { createWorkerProxy } from '${WORKER_HELPER_ID}';
import { worker, workerName, workerMsgId } from '${workerEntryPath}?worker';
${exportedMethods
  .map(exportedMethod => {
    return `export const ${exportedMethod} = /*@__PURE__*/createWorkerProxy(worker, workerMsgId, '${exportedMethod}');`;
  })
  .join('\n')}
`;
};

const getInlineWorkerProxy = (workerEntryPath: string, workerMsgId: string, exportedMethods: string[]) => {
  return `
import { createWorkerProxy } from '${WORKER_HELPER_ID}';
const workerPromise = import('${workerEntryPath}?worker-inline').then(m => m.worker);
${exportedMethods
  .map(exportedMethod => {
    return `export const ${exportedMethod} = /*@__PURE__*/createWorkerProxy(workerPromise, '${workerMsgId}', '${exportedMethod}');`;
  })
  .join('\n')}
`;
};
