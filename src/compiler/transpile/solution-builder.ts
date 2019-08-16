import * as d from '../../declarations';
import { COMPILER_BUILD } from '../build/compiler-build-id';
import { getUserCompilerOptions } from './compiler-options';
import { loadTypeScriptDiagnostic } from '@utils';
import { convertDecoratorsToStatic } from '../transformers/decorators-to-static/convert-decorators';
import { updateStencilCoreImports } from '../transformers/update-stencil-core-import';
import { convertStaticToMeta } from '../transformers/static-to-meta/visitor';
import ts from 'typescript';


export async function ensureTsProgram(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (compilerCtx.tsLanguageService == null) {
    compilerCtx.tsLanguageService = await buildTsService(config, compilerCtx, buildCtx);
  }

  if (compilerCtx.tsSolutionBuilderHost == null) {
    createSolutionBuilder(config, compilerCtx, buildCtx);
  }

  if (compilerCtx.tsSolutionBuilder != null) {
    compilerCtx.tsSolutionBuilder.buildReferences(config.tsconfig);
  }

  if (config.watch) {
    // if (instance.hasUnaccountedModifiedFiles) {
    //   if (instance.changedFilesList) {
    //     instance.watchHost.updateRootFileNames();
    //   }
    //   if (instance.watchOfFilesAndCompilerOptions) {
    //     instance.program = instance.watchOfFilesAndCompilerOptions
    //       .getProgram()
    //       .getProgram();
    //   }
    //   instance.hasUnaccountedModifiedFiles = false;
    // }
  }
}


function createSolutionBuilder(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  const tsSolutionBuilderHost = createSolutionBuilderHost(config, compilerCtx, buildCtx);

  compilerCtx.tsSolutionBuilder = ts.createSolutionBuilderWithWatch(
    tsSolutionBuilderHost,
    [config.tsconfig],
    { verbose: true, watch: true }
  );

  return tsSolutionBuilderHost;
}


function createSolutionBuilderHost(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {

  const getCurrentDirectory = () => config.cwd;

  const reportDiagnostic = (tsDiagnostic: ts.Diagnostic) => {
    buildCtx.diagnostics.push(loadTypeScriptDiagnostic(tsDiagnostic));
  };

  const reportSolutionBuilderStatus = (tsDiagnostic: ts.Diagnostic) => {
    buildCtx.diagnostics.push(loadTypeScriptDiagnostic(tsDiagnostic));
  };

  const reportWatchStatus = (tsDiagnostic: ts.Diagnostic, _newLine: string, _options: ts.CompilerOptions) => {
    // log.logInfo(
    //   `${ts.flattenDiagnosticMessageText(
    //     d.messageText,
    //     compiler.sys.newLine
    //   )}${newLine + newLine}`
    // );
    buildCtx.diagnostics.push(loadTypeScriptDiagnostic(tsDiagnostic));
  };

  const compilerOptions = getCompilerOptions(config, compilerCtx, buildCtx);

  const solutionBuilderHost = ts.createSolutionBuilderWithWatchHost(
    ts.sys,
    ts.createEmitAndSemanticDiagnosticsBuilderProgram,
    reportDiagnostic,
    reportSolutionBuilderStatus,
    reportWatchStatus
  );
  solutionBuilderHost.getCurrentDirectory = getCurrentDirectory;
  solutionBuilderHost.trace = s => config.logger.info(s);
  solutionBuilderHost.getParsedCommandLine = tsConfigFilePath => {
    return getParsedCommandLine(tsConfigFilePath, compilerOptions);
  };

  // make a (sync) resolver that follows webpack's rules
  // const resolveSync = makeResolver(loader._compiler.options);
  // const resolvers = makeResolvers(
  //   compilerOptions,
  //   solutionBuilderHost,
  //   customResolveTypeReferenceDirective,
  //   customResolveModuleName,
  //   resolveSync,
  //   appendTsTsxSuffixesIfRequired,
  //   scriptRegex
  // );

  // used for (/// <reference types="...">) see https://github.com/Realytics/fork-ts-checker-webpack-plugin/pull/250#issuecomment-485061329
  // solutionBuilderHost.resolveTypeReferenceDirectives = resolvers.resolveTypeReferenceDirectives;
  // solutionBuilderHost.resolveModuleNames = resolvers.resolveModuleNames;
  // solutionBuilderHost.buildReferences
  return solutionBuilderHost;
}


async function buildTsService(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  const transpileCtx: TranspileContext = {
    service: null,
    buildCtx: buildCtx,
    configKey: null,
    snapshotVersions: new Map<string, string>(),
    filesFromFsCache: [],
    hasQueuedTsServicePrime: false
  };

  const compilerOptions = getCompilerOptions(config, compilerCtx, buildCtx);

  // create a config key that will be used as part of the file's cache key
  transpileCtx.configKey = COMPILER_BUILD.id;

  const servicesHost: ts.LanguageServiceHost = {
    getScriptFileNames: () => compilerCtx.rootTsFiles,
    getScriptVersion: (filePath) => transpileCtx.snapshotVersions.get(filePath),
    getScriptSnapshot: (filePath) => {
      try {
        const sourceText = compilerCtx.fs.readFileSync(filePath);
        return ts.ScriptSnapshot.fromString(sourceText);
      } catch (e) {}
      return undefined;
    },
    getCurrentDirectory: () => config.cwd,
    getCompilationSettings: () => compilerOptions,
    getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
    fileExists: (filePath) => compilerCtx.fs.accessSync(filePath),
    readFile: (filePath) => {
      try {
        return compilerCtx.fs.readFileSync(filePath);
      } catch (e) {}
      return undefined;
    },
    readDirectory: ts.sys.readDirectory,
    getCustomTransformers: () => {
      return getCustomTransformers(config, compilerCtx, transpileCtx);
    }
  };

  // create our typescript language service to be reused
  transpileCtx.service = ts.createLanguageService(servicesHost, ts.createDocumentRegistry());

  return transpileCtx.service;
}

function getCustomTransformers(config: d.Config, compilerCtx: d.CompilerCtx, transpileCtx: TranspileContext) {
  const typeChecker = transpileCtx.service.getProgram().getTypeChecker();

  const transformOpts: d.TransformOptions = {
    coreImportPath: '@stencil/core',
    componentExport: null,
    componentMetadata: null,
    proxy: null,
    style: 'static'
  };

  return {
    before: [
      convertDecoratorsToStatic(config, transpileCtx.buildCtx.diagnostics, typeChecker),
      updateStencilCoreImports(transformOpts.coreImportPath)
    ],
    after: [
      convertStaticToMeta(config, compilerCtx, transpileCtx.buildCtx, typeChecker, null, transformOpts)
    ]
  };
}


function getCompilerOptions(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  const userCompilerOptions = getUserCompilerOptions(config, compilerCtx, buildCtx);
  const compilerOptions = Object.assign({}, userCompilerOptions) as ts.CompilerOptions;

  compilerOptions.isolatedModules = false;
  compilerOptions.suppressOutputPathCheck = true;
  compilerOptions.allowNonTsExtensions = true;
  compilerOptions.removeComments = false;
  compilerOptions.sourceMap = false;
  compilerOptions.lib = undefined;
  compilerOptions.types = undefined;
  compilerOptions.noEmit = undefined;
  compilerOptions.noEmitOnError = undefined;
  compilerOptions.rootDirs = undefined;
  compilerOptions.declaration = undefined;
  compilerOptions.declarationDir = undefined;
  compilerOptions.out = undefined;
  compilerOptions.outFile = undefined;
  compilerOptions.outDir = undefined;

  return compilerOptions;
}


const extendedConfigCache = new Map() as ts.Map<ts.ExtendedConfigCacheEntry>;

function getParsedCommandLine(configFilePath: string, compilerOptions: ts.CompilerOptions) {
  const result = ts.getParsedCommandLineOfConfigFile(
    configFilePath,
    compilerOptions,
    {
      ...ts.sys,
      onUnRecoverableConfigFileDiagnostic: () => {} // tslint:disable-line no-empty
    },
    extendedConfigCache
  );
  return result;
}

interface TranspileContext {
  service: ts.LanguageService;
  buildCtx: d.BuildCtx;
  configKey: string;
  snapshotVersions: Map<string, string>;
  filesFromFsCache: string[];
  hasQueuedTsServicePrime: boolean;
}
