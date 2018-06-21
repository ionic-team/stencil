import * as d from '../declarations';
import { catchError } from '../compiler/util';
import { getCompilerCtx } from '../compiler/build/compiler-ctx';
import { getGlobalJsBuildPath } from '../compiler/app/app-file-naming';
import { hydrateHtml } from './hydrate-html';
import { loadComponentRegistry } from './load-registry';
import { validateConfig } from '../compiler/config/validate-config';


export class Renderer {
  private ctx: d.CompilerCtx;
  private outputTarget: d.OutputTargetWww;
  private cmpRegistry: d.ComponentRegistry;


  constructor(public config: d.Config, registry?: d.ComponentRegistry, ctx?: d.CompilerCtx, outputTarget?: d.OutputTargetWww) {
    this.config = validateConfig(config);

    // do not allow more than one worker when prerendering
    config.sys.initWorkers(1);

    // init the build context
    this.ctx = getCompilerCtx(config, ctx);

    this.outputTarget = outputTarget || config.outputTargets.find(o => o.type === 'www');

    // load the component registry from the registry.json file
    this.cmpRegistry = registry || loadComponentRegistry(config, this.ctx, this.outputTarget);

    if (Object.keys(this.cmpRegistry).length === 0) {
      throw new Error(`No registered components found: ${config.namespace}`);
    }

    // load the app global file into the context
    loadAppGlobal(config, this.ctx, this.outputTarget);
  }

  async hydrate(hydrateOpts: d.HydrateOptions) {
    let hydrateResults: d.HydrateResults;

    // kick off hydrated, which is an async opertion
    try {
      hydrateResults = await hydrateHtml(this.config, this.ctx, this.outputTarget, this.cmpRegistry, hydrateOpts);

    } catch (e) {
      hydrateResults = {
        url: hydrateOpts.path,
        diagnostics: [],
        html: hydrateOpts.html,
        styles: null,
        anchors: [],
        components: [],
        styleUrls: [],
        scriptUrls: [],
        imgUrls: []
      };

      catchError(hydrateResults.diagnostics, e);
    }

    return hydrateResults;
  }

  get fs(): d.InMemoryFileSystem {
    return this.ctx.fs;
  }

  destroy() {
    if (this.config && this.config.sys && this.config.sys.destroy) {
      this.config.sys.destroy();
    }
  }

}


function loadAppGlobal(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetWww) {
  compilerCtx.appFiles = compilerCtx.appFiles || {};

  if (compilerCtx.appFiles.global) {
    // already loaded the global js content
    return;
  }

  // let's load the app global js content
  const appGlobalPath = getGlobalJsBuildPath(config, outputTarget);
  try {
    compilerCtx.appFiles.global = compilerCtx.fs.readFileSync(appGlobalPath);

  } catch (e) {
    config.logger.debug(`missing app global: ${appGlobalPath}`);
  }
}
