
export const writeTask = (cb: Function) => {
  cb();
};

export const tick = {
  then(cb: Function) {
    cb();
  }
};

export const consoleError = (e: any) => {
  console.error(e);
};

export const loadModule = (_a: any, _b: any) => {
  return Promise.resolve<any>({});
};


export {
  win,
  plt,
  supportsShadowDom,
  supportsListenerOptions,
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
