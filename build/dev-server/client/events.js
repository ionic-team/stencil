export const emitBuildLog = (win, buildLog) => {
    win.dispatchEvent(new CustomEvent(BUILD_LOG, { detail: buildLog }));
};
export const emitBuildResults = (win, buildResults) => {
    win.dispatchEvent(new CustomEvent(BUILD_RESULTS, { detail: buildResults }));
};
export const emitBuildStatus = (win, buildStatus) => {
    win.dispatchEvent(new CustomEvent(BUILD_STATUS, { detail: buildStatus }));
};
export const onBuildLog = (win, cb) => {
    win.addEventListener(BUILD_LOG, (ev) => {
        cb(ev.detail);
    });
};
export const onBuildResults = (win, cb) => {
    win.addEventListener(BUILD_RESULTS, (ev) => {
        cb(ev.detail);
    });
};
export const onBuildStatus = (win, cb) => {
    win.addEventListener(BUILD_STATUS, (ev) => {
        cb(ev.detail);
    });
};
const BUILD_LOG = `devserver:buildlog`;
const BUILD_RESULTS = `devserver:buildresults`;
const BUILD_STATUS = `devserver:buildstatus`;
//# sourceMappingURL=events.js.map