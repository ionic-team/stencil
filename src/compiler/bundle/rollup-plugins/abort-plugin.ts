import * as d from '../../../declarations';


export default function abortPlugin(buildCtx: d.BuildCtx) {
  // this plugin is only used to ensure we're not trying to bundle
  // when it's no longer the active build. So in a way we're canceling
  // any bundling for previous builds still running since everything is async.
  return {
    name: 'abortPlugin',

    resolveId() {
      if (!buildCtx.isActiveBuild) {
        return `_not_active_build.js`;
      }
      return null;
    },

    load() {
      if (!buildCtx.isActiveBuild) {
        return `/* build aborted */`;
      }
      return null;
    }
  };
}
