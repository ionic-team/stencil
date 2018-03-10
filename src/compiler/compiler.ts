import { BuildResults, CompilerCtx, CompilerEventName, Config, Diagnostic } from '../declarations';
import { build } from './build/build';
import { catchError } from './util';
import { docs } from './docs/docs';
import { getCompilerCtx } from './build/compiler-ctx';
import { InMemoryFileSystem } from '../util/in-memory-fs';
import { validateConfig } from '../compiler/config/validate-config';


export class Compiler {
  protected ctx: CompilerCtx;
  isValid: boolean;
  config: Config;

  constructor(rawConfig: Config) {
    [ this.isValid, this.config ] = isValid(rawConfig);

    if (this.isValid) {
      this.ctx = getCompilerCtx(this.config);

      let startupMsg = `${this.config.sys.compiler.name} v${this.config.sys.compiler.version} `;
      if (this.config.sys.platform !== 'win32') {
        startupMsg += `💎`;
      }

     this.config.logger.info(this.config.logger.cyan(startupMsg));
     this.config.logger.debug(`compiler runtime: ${this.config.sys.compiler.runtime}`);
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

function isValid(config: Config): [ boolean, Config | null] {
  try {
    // validate the build config
    validateConfig(config, true);
    return [ true, config ];

  } catch (e) {
    if (config.logger) {
      const diagnostics: Diagnostic[] = [];
      catchError(diagnostics, e);
      config.logger.printDiagnostics(diagnostics);

    } else {
      console.error(e);
    }
    return [ false, null ];
  }
}
