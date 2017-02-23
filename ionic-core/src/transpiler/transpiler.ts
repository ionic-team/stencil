import { TranspileOptions, TranspileContext } from './interfaces';
import { Logger, BuildError, runTypeScriptDiagnostics } from './logger';
import { transformTsFiles } from './transformer';
import { getTsConfig, writeTranspiledFiles } from './util';
import * as ts from 'typescript';
import * as path from 'path';


export function transpileProject(opts: TranspileOptions, ctx: TranspileContext = {}) {
  const logger = new Logger(ctx, `transpile`);

  return transpile(opts, ctx)
    .then(() => {
      // congrats, we did it!  (•_•) / ( •_•)>⌐■-■ / (⌐■_■)
      logger.finish();
    })
    .catch(err => {
      if (err.isFatal) { throw err; }
      throw logger.fail(err);
    });
}


export function transpile(opts: TranspileOptions, ctx: TranspileContext) {
  if (!opts.srcDir) {
    throw new BuildError(`srcDir required`);
  }
  if (!path.isAbsolute(opts.srcDir)) {
    throw new BuildError(`srcDir must be an absolute path`);
  }

  const tsConfig = getTsConfig(opts, ctx);

  return transformTsFiles(tsConfig.fileNames, opts, ctx).then(files => {
    const compilerHost = ts.createCompilerHost(tsConfig.options);

    const tsSysReadFile = ts.sys.readFile;

    ts.sys.readFile = (filePath: string, encoding: string): string => {
      // first see if there's a transformed TS file first
      const file = files.get(filePath);
      if (file.srcTransformedText) {
        return file.srcTransformedText;
      }

      // no transformed TS file, just get the source
      return file.srcText;
    };

    const transpiledFiles = new Map<string, string>();

    const program = ts.createProgram(tsConfig.fileNames, tsConfig.options, compilerHost, ctx.cachedTsProgram);
    program.emit(undefined, (filePath: string, transpiledText: string) => {
      transpiledFiles.set(filePath, transpiledText);
    });

    ts.sys.readFile = tsSysReadFile;

    const tsDiagnostics = program.getSyntacticDiagnostics()
                          .concat(program.getSemanticDiagnostics())
                          .concat(program.getOptionsDiagnostics());

    const diagnostics = runTypeScriptDiagnostics(opts, tsDiagnostics);

    if (diagnostics.length) {
      // darn, we've got some things wrong, transpile failed :(
      // printDiagnostics(diagnostics);
    }

    return writeTranspiledFiles(transpiledFiles, opts, ctx);
  });
}

