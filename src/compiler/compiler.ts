import { BuildResults, CompilerCtx, CompilerEventName, Config, Diagnostic } from '../util/interfaces';
import { build } from './build/build';
import { catchError, getCompilerCtx } from './util';
import { docs } from './docs/docs';
import { InMemoryFileSystem } from '../util/in-memory-fs';
import { initPlugins } from './plugin/plugin';
import { validateBuildConfig } from '../compiler/config/validate-config';
import { validatePrerenderConfig } from './prerender/validate-prerender-config';
import { validateServiceWorkerConfig } from './service-worker/validate-sw-config';


export class Compiler {
  private ctx: CompilerCtx;
  isValid: boolean;

  constructor(public config: Config) {
    this.isValid = isValid(config);
    if (this.isValid) {
      this.ctx = getCompilerCtx(config);
      initPlugins(config);
    }
  }

  build() {
    return build(this.config, this.ctx);
  }

  on(eventName: 'build', cb: (buildResults: BuildResults) => void): Function;
  on(eventName: 'rebuild', cb: (buildResults: BuildResults) => void): Function;
  on(eventName: any, cb: any) {
    return this.ctx.events.subscribe(eventName, cb);
  }

  once(eventName: 'build'): Promise<BuildResults>;
  once(eventName: 'rebuild'): Promise<BuildResults>;
  once(eventName: CompilerEventName) {
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
  trigger(eventName: CompilerEventName, ...args: any[]) {
    args.unshift(eventName);
    this.ctx.events.emit.apply(this.ctx.events, args);
  }

  docs() {
    return docs(this.config, this.ctx);
  }

  get fs(): InMemoryFileSystem {
    return this.ctx.fs;
  }

  get name() {
    return this.config.sys.compiler.name;
  }

  get version() {
    return this.config.sys.compiler.version;
  }

}


function isValid(config: Config) {
  try {
    // validate the build config
    validateBuildConfig(config, true);
    validatePrerenderConfig(config);
    validateServiceWorkerConfig(config);
    return true;

  } catch (e) {
    if (config.logger) {
      const diagnostics: Diagnostic[] = [];
      catchError(diagnostics, e);
      config.logger.printDiagnostics(diagnostics);

    } else {
      console.error(e);
    }
    return false;
  }
}
