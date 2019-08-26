import * as d from '../../declarations';
import { hasError, loadTypeScriptDiagnostics } from '@utils';
import { convertDecoratorsToStatic } from '../transformers/decorators-to-static/convert-decorators';
import { updateStencilCoreImports } from '../transformers/update-stencil-core-import';
import { convertStaticToMeta } from '../transformers/static-to-meta/visitor';
import { getComponentsFromModules } from '../output-targets/output-utils';
import ts from 'typescript';
import { resolveComponentDependencies } from '../entries/resolve-component-dependencies';
import { generateAppTypes } from '../types/generate-app-types';
import { BuildContext } from '../build/build-ctx';
import { filesChanged, hasHtmlChanges, hasScriptChanges, hasStyleChanges, scriptsAdded, scriptsDeleted } from '../fs-watch/fs-watch-rebuild';
import { hasServiceWorkerChanges } from '../service-worker/generate-sw';
import { build } from '../build/build';
import { updateComponentBuildConditionals } from '../app-core/build-conditionals';

export function createFullBuildHost(config: d.Config, compilerCtx: d.CompilerCtx): Promise<d.BuildResults> {
  const host = ts.createCompilerHost({});
  const builder = ts.createAbstractBuilder([], {}, host);
  const buildCtx = new BuildContext(config, compilerCtx);
  buildCtx.isRebuild = false;
  buildCtx.requiresFullBuild = true;
  buildCtx.start();

  return build(config, compilerCtx, buildCtx, builder);
}

export function createWatchHost(config: d.Config, compilerCtx: d.CompilerCtx) {
  const filesAdded = new Set<string>();
  const filesUpdated = new Set<string>();
  const filesDeleted = new Set<string>();
  const tsSys: ts.System = {
    ...ts.sys,
    watchFile(path, callback, pollingInterval) {
      return ts.sys.watchFile(path, (file, eventKind) => {
        if (eventKind === ts.FileWatcherEventKind.Created) {
          filesAdded.add(file);
        } else if (eventKind === ts.FileWatcherEventKind.Changed) {
          filesUpdated.add(file);
        } else if (eventKind === ts.FileWatcherEventKind.Deleted) {
          filesDeleted.add(file);
        }
        callback(file, eventKind);
      }, pollingInterval);
    },
    writeFile(path, data) {
      const inMemoryOnly = !path.endsWith('.d.ts');
      compilerCtx.fs.writeFile(path, data, { inMemoryOnly });
    },
    fileExists(filePath) {
      return compilerCtx.fs.accessSync(filePath);
    },
    readFile(filePath) {
      try {
        return compilerCtx.fs.readFileSync(filePath, {useCache: false});
      } catch (e) {}
      return undefined;
    },
    setTimeout(callback, time) {
      const id = setInterval(() => {
        if (!running) {
          callback();
          clearInterval(id);
        }
      }, time);
      return id;
    },
    clearTimeout(id) {
      return clearInterval(id);
    }
  };

  let running = false;
  let isRebuild = false;
  const host = ts.createWatchCompilerHost(
    config.tsconfig,
    {
      noEmitOnError: false,
      declaration: true,
      declarationDir: config.sys.path.join(config.rootDir, 'dist', 'types'),
      outDir: config.rootDir,
      rootDir: config.rootDir,
    },
    tsSys,
    ts.createEmitAndSemanticDiagnosticsBuilderProgram,
    () => { return; },
    () => { return; }
  );

  host.afterProgramCreate = async (builder) => {
    const buildCtx = new BuildContext(config, compilerCtx);
    buildCtx.filesAdded = Array.from(filesAdded.keys());
    buildCtx.filesUpdated = Array.from(filesUpdated.keys());
    buildCtx.filesDeleted = Array.from(filesDeleted.keys());
    buildCtx.filesChanged = filesChanged(buildCtx);
    buildCtx.scriptsAdded = scriptsAdded(config, buildCtx);
    buildCtx.scriptsDeleted = scriptsDeleted(config, buildCtx);
    buildCtx.hasScriptChanges = hasScriptChanges(buildCtx);
    buildCtx.hasStyleChanges = hasStyleChanges(buildCtx);
    buildCtx.hasHtmlChanges = hasHtmlChanges(config, buildCtx);
    buildCtx.hasServiceWorkerChanges = hasServiceWorkerChanges(config, buildCtx);

    buildCtx.isRebuild = isRebuild;
    buildCtx.requiresFullBuild = !isRebuild;
    buildCtx.start();

    running = true;
    await build(config, compilerCtx, buildCtx, builder);
    isRebuild = true;
    running = false;
  };
  return ts.createWatchProgram(host);
}


export async function transpileApp(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, builder: ts.BuilderProgram) {
  const syntactic = loadTypeScriptDiagnostics(builder.getSyntacticDiagnostics());
  buildCtx.diagnostics.push(...syntactic);

  if (hasError(buildCtx.diagnostics)) {
    return false;
  }

  const typeChecker = builder.getProgram().getTypeChecker();
  const transformOpts: d.TransformOptions = {
    coreImportPath: '@stencil/core',
    componentExport: null,
    componentMetadata: null,
    proxy: null,
    style: 'static'
  };

  const customTransforms = {
    before: [
      convertDecoratorsToStatic(config, [], typeChecker),
      updateStencilCoreImports(transformOpts.coreImportPath)
    ],
    after: [
      convertStaticToMeta(config, compilerCtx, buildCtx, typeChecker, null, transformOpts)
    ]
  };

  builder.emit(undefined, undefined, undefined, false, customTransforms);

  buildCtx.moduleFiles = Array.from(compilerCtx.moduleMap.values());
  buildCtx.components = getComponentsFromModules(buildCtx.moduleFiles);
  updateComponentBuildConditionals(compilerCtx.moduleMap, buildCtx.components);
  resolveComponentDependencies(buildCtx.components);

  if (buildCtx.hasError) {
    return false;
  }

  // create the components.d.ts file and write to disk
  const changed = await generateAppTypes(config, compilerCtx, buildCtx, 'src');
  if (changed) {
    return true;
  }

  if (config.validateTypes) {
    const semantic = loadTypeScriptDiagnostics(builder.getSemanticDiagnostics());
    buildCtx.diagnostics.push(...semantic);
  }
  return false;
}

export function cleanModuleFileCache(compilerCtx: d.CompilerCtx) {
  // let's clean up the module file cache so we only
  // hold on to stuff we know is being used
  const foundSourcePaths = new Set<string>();

  compilerCtx.rootTsFiles.forEach(rootTsFile => {
    const moduleFile = compilerCtx.moduleMap.get(rootTsFile);
    addSourcePaths(compilerCtx, moduleFile, foundSourcePaths);
  });

  compilerCtx.moduleMap.forEach(moduleFile => {
    const sourcePath = moduleFile.sourceFilePath;

    if (sourcePath.endsWith('.d.ts') || sourcePath.endsWith('.js')) {
      // don't bother cleaning up for .d.ts and .js modules files
      return;
    }

    if (!foundSourcePaths.has(sourcePath)) {
      // this source path is a typescript file
      // but we never found it again, so let's forget it
      compilerCtx.moduleMap.delete(sourcePath);
    }
  });
}


function addSourcePaths(compilerCtx: d.CompilerCtx, moduleFile: d.Module, foundSourcePaths: Set<string>) {
  if (moduleFile && !foundSourcePaths.has(moduleFile.sourceFilePath)) {
    foundSourcePaths.add(moduleFile.sourceFilePath);

    moduleFile.localImports.forEach(localImport => {
      const moduleFile = compilerCtx.moduleMap.get(localImport);
      if (moduleFile) {
        addSourcePaths(compilerCtx, moduleFile, foundSourcePaths);
      }
    });
  }
}
