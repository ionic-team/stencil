import * as d from '../../declarations';

export const generateHmr = (config: d.Config, _compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  if (!config.devServer || !buildCtx.isRebuild) {
    return null;
  }

  if (config.devServer.reloadStrategy == null) {
    return null;
  }

  const hmr: d.HotModuleReplacement = {
    reloadStrategy: 'pageReload',
    versionId: Date.now().toString().substring(6) + '' + Math.round((Math.random() * 89999) + 10000)
  };
  return hmr;
};

