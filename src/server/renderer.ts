import { CompilerCtx, ComponentRegistry, Config, HydrateOptions, HydrateResults, OutputTarget } from '../declarations';
import { catchError } from '../compiler/util';
import { getCompilerCtx } from '../compiler/build/compiler-ctx';
import { getGlobalBuildPath } from '../compiler/app/app-file-naming';
import { hydrateHtml } from './hydrate-html';
import { InMemoryFileSystem } from '../util/in-memory-fs';
import { loadComponentRegistry } from './load-registry';
import { validateBuildConfig } from '../compiler/config/validate-config';


export class Renderer {
  private ctx: CompilerCtx;
  private outputTarget: OutputTarget;
  private cmpRegistry: ComponentRegistry;


  constructor(public config: Config, registry?: ComponentRegistry, ctx?: CompilerCtx) {
    this.config = config;
    validateBuildConfig(config);

    // init the build context
    this.ctx = getCompilerCtx(config, ctx);

    this.outputTarget = config.outputTargets.find(o => o.type === 'www');

    // load the component registry from the registry.json file
    this.cmpRegistry = registry || loadComponentRegistry(config, this.ctx, this.outputTarget);

    if (Object.keys(this.cmpRegistry).length === 0) {
      throw new Error(`No registered components found: ${config.namespace}`);
    }

    // load the app global file into the context
    loadAppGlobal(config, this.ctx, this.outputTarget);
  }

  async hydrate(hydrateOpts: HydrateOptions) {
    let hydrateResults: HydrateResults;

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

  get fs(): InMemoryFileSystem {
    return this.ctx.fs;
  }

}


/**
 * Deprecated
 * Please use "const renderer = new Renderer(config);" instead.
 */
export function createRenderer(config: Config) {
  const renderer = new Renderer(config);

  config.logger.warn(`"createRenderer(config)" is deprecated. Please use "const renderer = new Renderer(config);" instead"`);

  return {
    hydrateToString: renderer.hydrate.bind(renderer)
  };
}


function loadAppGlobal(config: Config, compilerCtx: CompilerCtx, outputTarget: OutputTarget) {
  compilerCtx.appFiles = compilerCtx.appFiles || {};

  if (compilerCtx.appFiles.global) {
    // already loaded the global js content
    return;
  }

  // let's load the app global js content
  const appGlobalPath = getGlobalBuildPath(config, outputTarget);
  try {
    compilerCtx.appFiles.global = compilerCtx.fs.readFileSync(appGlobalPath);

  } catch (e) {
    config.logger.debug(`missing app global: ${appGlobalPath}`);
  }
}
