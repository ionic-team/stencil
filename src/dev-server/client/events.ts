export const emitBuildLog = (win: Window, buildLog: any) => {
  win.dispatchEvent(new CustomEvent(BUILD_LOG, { detail: buildLog }));
};

export const emitBuildResults = (win: Window, buildResults: any) => {
  win.dispatchEvent(new CustomEvent(BUILD_RESULTS, { detail: buildResults }));
};

export const emitBuildStatus = (win: Window, buildStatus: string) => {
  win.dispatchEvent(new CustomEvent(BUILD_STATUS, { detail: buildStatus }));
};

export const onBuildLog = (win: Window, cb: (buildLog: any) => void) => {
  win.addEventListener(BUILD_LOG, (ev: any) => {
    cb(ev.detail);
  });
};

export const onBuildResults = (win: Window, cb: (buildResults: any) => void) => {
  win.addEventListener(BUILD_RESULTS, (ev: any) => {
    cb(ev.detail);
  });
};

export const onBuildStatus = (win: Window, cb: (buildStatus: string) => void) => {
  win.addEventListener(BUILD_STATUS, (ev: any) => {
    cb(ev.detail);
  });
};

const BUILD_LOG = `devserver:buildlog`;
const BUILD_RESULTS = `devserver:buildresults`;
const BUILD_STATUS = `devserver:buildstatus`;
