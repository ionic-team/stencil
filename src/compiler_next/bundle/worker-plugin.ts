import * as d from '../../declarations';
import { Plugin, TransformResult, PluginContext } from 'rollup';
import { bundleOutput } from './bundle-output';
import { normalizeFsPath, hasError } from '@utils';
import { optimizeModule } from '../optimize/optimize-module';


export const workerPlugin = (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, platform: string): Plugin => {
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
        const workerName = getWorkerName(workerEntryPath);
        const { referenceId, dependencies } = await getWorker(config, compilerCtx, buildCtx, this, workersMap, workerEntryPath);
        dependencies.forEach(id => this.addWatchFile(id));
        return {
          code: getWorkerMain(referenceId, workerName),
          moduleSideEffects: false,
        };
      }

      // Proxy worker path
      const workerEntryPath = getWorkerEntryPath(id);
      if (workerEntryPath != null) {
        const worker = await getWorker(config, compilerCtx, buildCtx, this, workersMap, workerEntryPath);
        if (worker) {
          return {
            code: getWorkerProxy(workerEntryPath, worker.exports),
            moduleSideEffects: false,
          };
        }
      }
      return null;
    }
  };
};

const getWorkerEntryPath = (id: string) => {
  if (/\.worker(\.|\/)/.test(id)) {
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

const getWorkerName = (id: string) => {
  const parts = id.split('/').filter(i => !i.includes('index'));
  id = parts[parts.length - 1];
  return id.replace('.tsx', '').replace('.ts', '');
};

const buildWorker = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, ctx: PluginContext, workerEntryPath: string) => {
  const workerName = getWorkerName(workerEntryPath);
  const build = await bundleOutput(config, compilerCtx, buildCtx, {
    platform: 'worker',
    id: workerName,
    inputs: {
      [workerName]: workerEntryPath
    },
    inlineDynamicImports: true,
  });

  if (build) {
    // Generate commonjs output so we can intercept exports at runtme
    const output = await build.generate({
      format: 'commonjs',
      intro: getWorkerIntro(workerName, config.devMode),
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
  return null;
}

const WORKER_HELPER_ID = '@worker-helper';

const getWorkerIntro = (workerName: string, isDev: boolean) => `
const exports = {};
const workerMsgId = 'stencil.${workerName}';
const workerMsgCallbackId = workerMsgId + '.cb';

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
      ${isDev ? `
      value = exports[method](...args);
      if (!value || !value.then) {
        throw new Error('The exported method "' + method + '" does not return a Promise, make sure it is an "async" function');
      }
      value = await value;
      ` : `
      value = await exports[method](...args);` }

    } catch (e) {
      err = {
        message: typeof e === 'string' ? e : e.message,
        stack: e.stack
      };
    }

    postMessage(
      [workerMsgId, id, value, err],
      value instanceof ArrayBuffer ? [value] : []
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

    worker.postMessage(
      [workerMsgId, pendingId, exportedMethod, args],
      args.filter(a => a instanceof ArrayBuffer)
    );
  })
);
`;

const getWorkerMain = (referenceId: string, workerName: string) => {
  return `
import { createWorker } from '${WORKER_HELPER_ID}';
export const workerName = '${workerName}';
export const workerMsgId = 'stencil.' + workerName;
export const workerPath = /*@__PURE__*/import.meta.ROLLUP_FILE_URL_${referenceId};
export const worker = /*@__PURE__*/createWorker(workerPath, workerName, workerMsgId);
`;
};



const getWorkerProxy = (workerEntryPath: string, exportedMethods: string[]) => {
  return `
import { createWorkerProxy } from '${WORKER_HELPER_ID}';
import { worker, workerName, workerMsgId } from '${workerEntryPath}?worker';
${exportedMethods.map(exportedMethod => {
  if (exportedMethod === 'default') {
    return `export default /*@__PURE__*/createWorkerProxy(worker, workerMsgId, '${exportedMethod}');`;
  } else {
    return `export const ${exportedMethod} = /*@__PURE__*/createWorkerProxy(worker, workerMsgId, '${exportedMethod}');`;
  }
}).join('\n')}
`;
};
