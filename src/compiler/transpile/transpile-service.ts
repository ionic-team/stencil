import * as d from '../../declarations';

import { convertDecoratorsToStatic } from '../transformers/decorators-to-static/convert-decorators';
import { getUserCompilerOptions } from './compiler-options';
import { flatOne, loadTypeScriptDiagnostics, normalizePath } from '@utils';
import { convertStaticToMeta } from '../transformers/static-to-meta/visitor';
import ts from 'typescript';


export async function buildTsService(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx): Promise<d.TsService> {
  const transpileCtx: TranspileContext = {
    compilerCtx: compilerCtx,
    buildCtx: buildCtx,
    configKey: null,
    snapVersion: 0,
    snapshotVersions: new Map<string, string>(),
    filesFromFsCache: [],
    hasQueuedTsServicePrime: false
  };

  const userCompilerOptions = await getUserCompilerOptions(config, transpileCtx.compilerCtx, transpileCtx.buildCtx);
  const compilerOptions = {
    ...userCompilerOptions,

    isolatedModules: false,
    suppressOutputPathCheck: true,
    allowNonTsExtensions: true,
    removeComments: config.devMode,
    sourceMap: false,
    noEmit: false,
    skipLibCheck: true,
    noEmitOnError: false,
    out: undefined,
    outFile: undefined,

  } as ts.CompilerOptions;

  const servicesHost: ts.LanguageServiceHost = {
    getScriptFileNames: () => transpileCtx.compilerCtx.rootTsFiles,
    getScriptVersion: (filePath) => transpileCtx.snapshotVersions.get(filePath) || '0',
    getScriptSnapshot: (filePath) => {
      try {
        const sourceText = transpileCtx.compilerCtx.fs.readFileSync(filePath);
        return ts.ScriptSnapshot.fromString(sourceText);
      } catch (e) {}
      return undefined;
    },
    getCurrentDirectory: () => config.cwd,
    getCompilationSettings: () => compilerOptions,
    getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
    fileExists: (filePath) => transpileCtx.compilerCtx.fs.accessSync(filePath),
    readFile: (filePath) => {
      try {
        return transpileCtx.compilerCtx.fs.readFileSync(filePath);
      } catch (e) {}
      return undefined;
    },
    readDirectory: ts.sys.readDirectory,
    getCustomTransformers: () => {
      const typeChecker = service.getProgram().getTypeChecker();

      const transformOpts: d.TransformOptions = {
        addCompilerMeta: false,
        addStyle: true
      };

      return {
        before: [
          convertDecoratorsToStatic(config, transpileCtx.buildCtx.diagnostics, typeChecker)
        ],
        after: [
          convertStaticToMeta(config, transpileCtx.compilerCtx, transpileCtx.buildCtx, typeChecker, null, transformOpts)
        ]
      };
    }
  };

  // create our typescript language service to be reused
  const service = ts.createLanguageService(servicesHost, ts.createDocumentRegistry());
  return {
    getTypeDiagnostics: (tsFilePaths?: string[]) => {
      if (tsFilePaths) {
        return flatOne(tsFilePaths.map(sourceFilePath => {
          return service.getSemanticDiagnostics(sourceFilePath);
        }));
      } else {
        return service.getProgram().getSemanticDiagnostics();
      }
    },
    invalidate: (tsFilePaths: string[]) => {
      const version = ++transpileCtx.snapVersion;
      tsFilePaths.forEach(file => {
        transpileCtx.snapshotVersions.set(file, String(version));
      });
    },
    transpile: async (compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, tsFilePaths: string[]) => {
      transpileCtx.compilerCtx = compilerCtx;
      transpileCtx.buildCtx = buildCtx;

      // loop through each ts file that has changed
      const changeCtx = {
        types: false,
        implementation: false,
      };
      await Promise.all(tsFilePaths.map(tsFilePath => {
        return transpileTsFile(service, transpileCtx, changeCtx, tsFilePath);
      }));
      return changeCtx;
    }
  };
}


async function transpileTsFile(service: ts.LanguageService, transpileCtx: TranspileContext, changeCtx: d.TsChangeContext, sourceFilePath: string) {
  transpileCtx.buildCtx.transpileBuildCount++;

  // let's do this!
  const output = service.getEmitOutput(sourceFilePath);

  // load syntactic diagnostics
  const tsDiagnostics = service.getSyntacticDiagnostics(sourceFilePath);
  loadTypeScriptDiagnostics(transpileCtx.buildCtx.diagnostics, tsDiagnostics);

  await Promise.all(output.outputFiles.map(async tsOutput => {
    const outputFilePath = normalizePath(tsOutput.name);
    return outputFile(transpileCtx.compilerCtx, outputFilePath, tsOutput.text, changeCtx);
  }));
}


async function outputFile(compilerCtx: d.CompilerCtx, outputFilePath: string, outputText: string, changeCtx: d.TsChangeContext) {
  // the in-memory .js version is be virtually next to the source ts file
  // but it never actually gets written to disk, just there in spirit
  const isJS = outputFilePath.endsWith('.js');
  const { changedContent } = await compilerCtx.fs.writeFile(
    outputFilePath,
    outputText,
    { inMemoryOnly: isJS }
  );
  if (changedContent) {
    if (isJS) {
      changeCtx.implementation = true;
    } else {
      changeCtx.types = true;
    }
  }
}


interface TranspileContext {
  compilerCtx: d.CompilerCtx;
  buildCtx: d.BuildCtx;
  configKey: string;
  snapVersion: number;
  snapshotVersions: Map<string, string>;
  filesFromFsCache: string[];
  hasQueuedTsServicePrime: boolean;
}
