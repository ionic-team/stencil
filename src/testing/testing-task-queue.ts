import * as d from '@declarations';


const queuedTicks: Function[] = [];
const queuedReadTasks: d.RafCallback[] = [];
const queuedWriteTasks: d.RafCallback[] = [];
const moduleLoaded = new Map();
const queuedLoadModules: QueuedLoadModule[] = [];


export function resetTaskQueue() {
  queuedTicks.length = 0;
  queuedReadTasks.length = 0;
  queuedWriteTasks.length = 0;
  moduleLoaded.clear();
  queuedLoadModules.length = 0;
}


export const tick = {
  then(cb: Function) {
    queuedTicks.push(cb);
  }
};


export function flushTicks() {
  return new Promise((resolve, reject) => {
    try {
      process.nextTick(() => {
        let cb: Function;
        while ((cb = queuedTicks.shift())) {
          cb();
        }
      });

      resolve();

    } catch (e) {
      reject(`flushTicks: ${e}`);
    }
  });
}


export function readTask(cb: d.RafCallback) {
  queuedReadTasks.push(cb);
}

export function writeTask(cb: d.RafCallback) {
  queuedWriteTasks.push(cb);
}


export function flushQueue() {
  return new Promise((resolve, reject) => {
    try {
      process.nextTick(() => {
        let cb: Function;
        while ((cb = queuedReadTasks.shift())) {
          cb(Date.now());
        }
        while ((cb = queuedWriteTasks.shift())) {
          cb(Date.now());
        }
      });

      resolve();

    } catch (e) {
      reject(`flushQueue: ${e}`);
    }
  });
}


export async function flushAll() {
  while (queuedTicks.length > 0 || queuedLoadModules.length > 0 || queuedReadTasks.length > 0 || queuedWriteTasks.length > 0) {
    await flushTicks();
    await flushLoadModule();
    await flushQueue();
  }
}


export function loadModule(_elm: d.HostElement, bundleId: d.ModeBundleId) {
  return new Promise<any>(resolve => {
    queuedLoadModules.push({
      bundleId,
      resolve: () => resolve(moduleLoaded.get(bundleId))
    });
  });
}


export function flushLoadModule(bundleId?: string) {
  return new Promise((resolve, reject) => {
    try {
      process.nextTick(() => {
        if (bundleId != null) {
          for (let i = 0; i < queuedLoadModules.length; i++) {
            if (queuedLoadModules[i].bundleId === bundleId) {
              queuedLoadModules[i].resolve();
              queuedLoadModules.splice(i, 1);
              i--;
            }
          }

        } else {
          let queuedLoadModule: QueuedLoadModule;
          while ((queuedLoadModule = queuedLoadModules.shift())) {
            queuedLoadModule.resolve();
          }
        }

        resolve();
      });

    } catch (e) {
      reject(`flushLoadModule: ${e}`);
    }
  });
}


export function registerModule(bundleId: string, Cstr: any) {
  moduleLoaded.set(bundleId, Cstr);
}


interface QueuedLoadModule {
  bundleId: any;
  resolve: Function;
}
