import * as d from '../../declarations';
import { BuildContext } from '../build/build-ctx';
import { emitBuilds } from './emit-builds';
import { getUserCompilerOptions } from './compiler-options';
import { loadTypeScriptDiagnostic, noop } from '@utils';
import ts from 'typescript';


export async function runTsBuilder(config: d.Config, compilerCtx: d.CompilerCtx) {
  const filesToWrite = new Map<string, string>();

  const tsSolutionBuilder = await getTsSolutionBuild(config, compilerCtx, filesToWrite);

  const buildCtx = new BuildContext(config, compilerCtx);
  compilerCtx.activeBuildCtx = buildCtx;

  tsSolutionBuilder.build();

  if (filesToWrite.size > 0) {
    await compilerCtx.fs.writeFiles(filesToWrite);
    await compilerCtx.fs.commit();
    filesToWrite.clear();
  }

  if (config.watch) {
    const fsWatcher = await config.sys.createFsWatcher(config, config.sys.fs, compilerCtx.events);

    await fsWatcher.addDirectory(config.srcDir);

    compilerCtx.events.subscribe('fsChange', async (fsWatchResults) => {
      console.log('fsWatchResults', fsWatchResults);
      // tsSolutionBuilder.clean();
      tsSolutionBuilder.build();
      console.log('filesToWrite', filesToWrite);

      if (filesToWrite.size > 0) {
        await compilerCtx.fs.writeFiles(filesToWrite);
        await compilerCtx.fs.commit();
        filesToWrite.clear();
      }
    });

    // if (typeof config.configPath === 'string') {
    //   config.configPath = normalizePath(config.configPath);
    //   await compilerCtx.fsWatcher.addFile(config.configPath);
    // }
  }
}


async function getTsSolutionBuild(config: d.Config, compilerCtx: d.CompilerCtx, filesToWrite: Map<string, string>) {
  if (compilerCtx.tsSolutionBuilderHost == null) {
    compilerCtx.tsSolutionBuilderHost = createTsSolutionBuilderHost(
      config,
      compilerCtx,
      filesToWrite
    );
  }

  if (compilerCtx.tsSolutionBuilder == null) {
    if (config.watch) {
      compilerCtx.tsSolutionBuilder = await createTsSolutionBuilderWithWatch(
        config,
        compilerCtx.tsSolutionBuilderHost
      );

    } else {
      compilerCtx.tsSolutionBuilder = createTsSolutionBuilder(
        config,
        compilerCtx.tsSolutionBuilderHost
      );
    }
  }

  return compilerCtx.tsSolutionBuilder;
}


async function createTsSolutionBuilderWithWatch(config: d.Config, tsSolutionBuilderHost: ts.SolutionBuilderWithWatchHost<ts.EmitAndSemanticDiagnosticsBuilderProgram>) {

  // tsSolutionBuilderHost.watchFile = noop;

  // tsSolutionBuilderHost.watchDirectory = noop;

  const builderWithWatch = ts.createSolutionBuilderWithWatch(
    tsSolutionBuilderHost,
    [config.tsconfig],
    { incremental: true, watch: true, verbose: true }
  );

  return builderWithWatch;
}


function createTsSolutionBuilder(config: d.Config, tsSolutionBuilderHost: ts.SolutionBuilderWithWatchHost<ts.EmitAndSemanticDiagnosticsBuilderProgram>) {
  const builder = ts.createSolutionBuilder(
    tsSolutionBuilderHost,
    [config.tsconfig],
    { verbose: true }
  );

  return builder;
}


function createTsSolutionBuilderHost(config: d.Config, compilerCtx: d.CompilerCtx, filesToWrite: Map<string, string>) {

  const reportDiagnostic = (tsDiagnostic: ts.Diagnostic) => {
    compilerCtx.activeBuildCtx.diagnostics.push(loadTypeScriptDiagnostic(tsDiagnostic));
  };

  const reportDebugLog = (tsDiagnostic: ts.Diagnostic) => {
    const diagnostic = loadTypeScriptDiagnostic(tsDiagnostic);
    diagnostic.header = null;
    diagnostic.level = 'debug';
    config.logger.printDiagnostics([diagnostic], config.cwd);
  };

  const createTsProgram = (rootNames: ReadonlyArray<string> | undefined, options: ts.CompilerOptions | undefined, host: ts.CompilerHost, oldProgram: ts.EmitAndSemanticDiagnosticsBuilderProgram, configFileParsingDiagnostics: ReadonlyArray<ts.Diagnostic>, projectReferences: ReadonlyArray<ts.ProjectReference>) => {
    const tsBuilderProgram = ts.createEmitAndSemanticDiagnosticsBuilderProgram(rootNames, options, host, oldProgram, configFileParsingDiagnostics, projectReferences);
    const tsProgram = tsBuilderProgram.getProgram();

    emitBuilds(config, compilerCtx, tsProgram, filesToWrite);

    return tsBuilderProgram;
  };

  const solutionBuilderHost = ts.createSolutionBuilderWithWatchHost(
    ts.sys,
    createTsProgram,
    reportDiagnostic,
    reportDebugLog,
    reportDebugLog
  );

  solutionBuilderHost.getCurrentDirectory = () => config.cwd;

  solutionBuilderHost.trace = s => config.logger.debug(s);

  solutionBuilderHost.getParsedCommandLine = tsConfigFilePath => {
    const compilerOptions = getCompilerOptions(config, compilerCtx);
    const c = getParsedCommandLine(tsConfigFilePath, compilerOptions);

    if (c.raw) {
      if ((!Array.isArray(c.raw.include) || c.raw.include.length === 0) && (!Array.isArray(c.raw.files) || c.raw.files.length === 0)) {
        config.logger.error(`tsconfig.json should include either a "include" or "files" property: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html`);
        config.logger.error(`Please update the tsconfig.json use { "include": ["src/**/*"] }`);
      }
    }

    return c;
  };

  solutionBuilderHost.writeFile = noop;

  return solutionBuilderHost;
}


function getCompilerOptions(config: d.Config, compilerCtx: d.CompilerCtx) {
  const userCompilerOptions = getUserCompilerOptions(config, compilerCtx, compilerCtx.activeBuildCtx);
  const compilerOptions = Object.assign({}, userCompilerOptions) as ts.CompilerOptions;

  compilerOptions.outDir = undefined;
  compilerOptions.sourceMap = true;
  compilerOptions.declaration = true;
  compilerOptions.declarationDir = undefined;
  compilerOptions.declaration = true;

  return compilerOptions;
}


const extendedConfigCache = new Map() as ts.Map<ts.ExtendedConfigCacheEntry>;

function getParsedCommandLine(configFilePath: string, compilerOptions: ts.CompilerOptions) {
  const c = ts.getParsedCommandLineOfConfigFile(
    configFilePath,
    compilerOptions,
    {
      ...ts.sys,
      onUnRecoverableConfigFileDiagnostic: () => {} // tslint:disable-line no-empty
    },
    extendedConfigCache
  );
  return c;
}
