import * as d from '../declarations';
import { build } from './build/build';
import { BuildContext } from './build/build-ctx';
import { catchError } from './util';
import { docs } from './docs/docs';
import { getCompilerCtx } from './build/compiler-ctx';
import { startDevServerMain } from '../dev-server/start-server-main';
import { validateConfig } from '../compiler/config/validate-config';


export class Compiler implements d.Compiler {
  protected ctx: d.CompilerCtx;
  isValid: boolean;
  config: d.Config;

  constructor(rawConfig: d.Config) {
    [ this.isValid, this.config ] = isValid(rawConfig);
    const config = this.config;

    if (this.isValid) {
      const details = config.sys.details;

      let startupMsg = `${config.sys.compiler.name} v${config.sys.compiler.version} `;
      if (details.platform !== 'win32') {
        startupMsg += `💎`;
      }

      config.logger.info(config.logger.cyan(startupMsg));

      config.logger.debug(`${details.platform}, ${details.cpuModel}, cpus: ${details.cpus}, freemem: ${details.freemem}`);
      config.logger.debug(`${details.runtime} ${details.runtimeVersion}`);

      config.logger.debug(`compiler runtime: ${config.sys.compiler.runtime}`);

      const workers = config.sys.initWorkers(config.maxConcurrentWorkers);
      config.logger.debug(`compiler workers: ${workers}`);

      config.logger.debug(`minifyJs: ${config.minifyJs}, minifyCss: ${config.minifyCss}, buildEs5: ${config.buildEs5}`);

      this.ctx = getCompilerCtx(config);

      this.on('build', watchResults => {
        const buildCtx = new BuildContext(config, this.ctx, watchResults);
        build(this.config, this.ctx, buildCtx);
      });

      if (config.flags.serve) {
        this.startDevServer();
      }
    }
  }

  async startDevServer() {
    if (this.config.sys.details.runtime !== 'node') {
      throw new Error(`Dev Server only availabe in node`);
    }

    // start up the dev server
    const devServerConfig = await startDevServerMain(this.config, this.ctx);

    // get the browser url to be logged out at the end of the build
    this.config.devServer.browserUrl = devServerConfig.browserUrl;

    return {
      browserUrl: this.config.devServer.browserUrl
    };
  }

  build() {
    const buildCtx = new BuildContext(this.config, this.ctx);
    return build(this.config, this.ctx, buildCtx);
  }

  on(eventName: 'build', cb: (watchResults?: d.WatchResults) => void): Function;
  on(eventName: 'buildNoChange', cb: (buildResults: d.BuildNoChangeResults) => void): Function;
  on(eventName: 'buildLog', cb: (buildResults: d.BuildLog) => void): Function;
  on(eventName: 'buildFinish', cb: (buildResults: d.BuildResults) => void): Function;
  on(eventName: d.CompilerEventName, cb: any) {
    return this.ctx.events.subscribe(eventName as any, cb);
  }

  once(eventName: 'buildFinish'): Promise<d.BuildResults>;
  once(eventName: 'buildNoChange'): Promise<d.BuildNoChangeResults>;
  once(eventName: d.CompilerEventName) {
    return new Promise<any>(resolve => {
      const off = this.ctx.events.subscribe(eventName as any, (...args: any[]) => {
        off();
        resolve.apply(this, args);
      });
    });
  }

  off(eventName: string, cb: Function) {
    this.ctx.events.unsubscribe(eventName, cb);
  }

  trigger(eventName: 'fileUpdate', path: string): void;
  trigger(eventName: 'fileAdd', path: string): void;
  trigger(eventName: 'fileDelete', path: string): void;
  trigger(eventName: 'dirAdd', path: string): void;
  trigger(eventName: 'dirDelete', path: string): void;
  trigger(eventName: d.CompilerEventName, ...args: any[]) {
    args.unshift(eventName);
    this.ctx.events.emit.apply(this.ctx.events, args);
  }

  docs() {
    return docs(this.config, this.ctx);
  }

  get fs(): d.InMemoryFileSystem {
    return this.ctx.fs;
  }

  get name() {
    return this.config.sys.compiler.name;
  }

  get version() {
    return this.config.sys.compiler.version;
  }

}

function isValid(config: d.Config): [ boolean, d.Config | null] {
  try {
    // validate the build config
    validateConfig(config, true);
    return [ true, config ];

  } catch (e) {
    if (config.logger) {
      const diagnostics: d.Diagnostic[] = [];
      catchError(diagnostics, e);
      config.logger.printDiagnostics(diagnostics);

    } else {
      console.error(e);
    }
    return [ false, null ];
  }
}
