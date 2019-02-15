
export function writeTask(cb: Function) {
  cb();
}

export const tick = {
  then(cb: Function) {
    cb();
  }
};

export function consoleError(e: any) {
  console.error(e);
}

export function loadModule(_a: any, _b: any) {
  return Promise.resolve<any>({});
}


export {
  win,
  plt,
  doc,
  registerHost,
  connectedCallback,
  createEvent,
  getConnect,
  getContext,
  getElement,
  setMode,
  getMode,
  styles,
  rootAppliedStyles,
  getHostRef,
  Build,
  Host,
  h
} from '../client';
