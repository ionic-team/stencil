import * as d from '../declarations';
import { build } from './build/build';
import { BuildContext } from './build/build-ctx';
import { catchError } from './util';
import { docs } from './docs/docs';
import { getCompilerCtx } from './build/compiler-ctx';
import { validateConfig } from '../compiler/config/validate-config';


export class Compiler {
  protected ctx: d.CompilerCtx;
  isValid: boolean;
  config: d.Config;

  constructor(rawConfig: d.Config) {
    [ this.isValid, this.config ] = isValid(rawConfig);

    if (this.isValid) {
      this.ctx = getCompilerCtx(this.config);

      let startupMsg = `${this.config.sys.compiler.name} v${this.config.sys.compiler.version} `;
      if (this.config.sys.platform !== 'win32') {
        startupMsg += `💎`;
      }

      this.config.logger.info(this.config.logger.cyan(startupMsg));
      this.config.logger.debug(`compiler runtime: ${this.config.sys.compiler.runtime}`);
      this.config.logger.debug(`compiler build: __BUILDID__`);

      this.on('build', watchResults => {
        const buildCtx = new BuildContext(this.config, this.ctx, watchResults);
        build(this.config, this.ctx, buildCtx);
      });
    }
  }

  build() {
    const buildCtx = new BuildContext(this.config, this.ctx);
    return build(this.config, this.ctx, buildCtx);
  }

  on(eventName: 'build', cb: (watchResults: d.WatchResults) => void): Function;
  on(eventName: 'buildStart', cb: () => void): Function;
  on(eventName: 'buildNoChange', cb: (buildResults: d.BuildNoChangeResults) => void): Function;
  on(eventName: 'buildFinish', cb: (buildResults: d.BuildResults) => void): Function;
  on(eventName: d.CompilerEventName, cb: any) {
    return this.ctx.events.subscribe(eventName as any, cb);
  }

  once(eventName: 'buildStart'): Promise<void>;
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
