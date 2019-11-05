import * as d from '../../declarations';


export function emitBuildLog(win: d.DevClientWindow, buildLog: d.BuildLog) {
  win.dispatchEvent(new CustomEvent(BUILD_LOG, { detail: buildLog }));
}


export function emitBuildResults(win: d.DevClientWindow, buildResults: d.BuildResults) {
  win.dispatchEvent(new CustomEvent(BUILD_RESULTS, { detail: buildResults }));
}


export function emitBuildStatus(win: d.DevClientWindow, buildStatus: d.BuildStatus) {
  win.dispatchEvent(new CustomEvent(BUILD_STATUS, { detail: buildStatus }));
}


export function onBuildLog(win: d.DevClientWindow, cb: (buildLog: d.BuildLog) => void) {
  win.addEventListener(BUILD_LOG, (ev: any) => {
    cb(ev.detail);
  });
}


export function onBuildResults(win: d.DevClientWindow, cb: (buildResults: d.BuildResults) => void) {
  win.addEventListener(BUILD_RESULTS, (ev: any) => {
    cb(ev.detail);
  });
}


export function onBuildStatus(win: d.DevClientWindow, cb: (buildStatus: d.BuildStatus) => void) {
  win.addEventListener(BUILD_STATUS, (ev: any) => {
    cb(ev.detail);
  });
}


const BUILD_LOG = `devserver:buildlog`;
const BUILD_RESULTS = `devserver:buildresults`;
const BUILD_STATUS = `devserver:buildstatus`;
