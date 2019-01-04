import * as d from '../../declarations';
import { bundleLazyModule } from './bundle-lazy-module';
import { catchError, normalizePath, pathJoin } from '../util';
import { dashToPascalCase } from '../../util/helpers';
import { RollupBuild } from 'rollup';


export async function generateLazyModuleFormats(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {

  const entryInputPaths = await createLazyEntryModules(config, compilerCtx, buildCtx);
  if (entryInputPaths == null || entryInputPaths.length === 0) {
    return null;
  }

  const timespan = buildCtx.createTimeSpan(`module derive started`, true);

  // Check for index.js file. This file is used for stencil project exports
  // usually this contains utility exports.
  // If it exists then add it as an entry point.
  const exportedFile = pathJoin(config, config.srcDir, 'index.js');
  const fileExists = await compilerCtx.fs.access(exportedFile);
  if (fileExists) {
    buildCtx.entryModules.push({
      entryKey: 'exportedFile',
      filePath: exportedFile,
      moduleFiles: []
    });
  }

  try {
    // run rollup, but don't generate yet
    // returned rollup bundle can be reused for es module and legacy
    const rollupBuild = await bundleLazyModule(config, compilerCtx, buildCtx, entryInputPaths);
    if (rollupBuild == null) {
      return null;
    }

    if (buildCtx.shouldAbort) {
      // rollup errored, so let's not continue
      return null;
    }

    const [esm, amd] = await Promise.all([
      // [0] bundle using only es modules and dynamic imports
      await createEsmModulesFromRollup(config, rollupBuild),

      // [1] bundle using commonjs using jsonp callback
      await createAmdModulesFromRollup(config, rollupBuild, buildCtx.entryModules),
    ]);

    if (buildCtx.shouldAbort) {
      // someone could have errored
      return null;
    }

    timespan.finish(`module derive finished`);

    return {
      esm,
      amd
    } as d.JSModuleFormats;

  } catch (err) {
    catchError(buildCtx.diagnostics, err);
  }

  return null;
}


async function createEsmModulesFromRollup(config: d.Config, rollupBuild: RollupBuild) {
  const { output } = await rollupBuild.generate({
    ...config.rollupConfig.outputOptions,
    format: 'es',
    // banner: generatePreamble(config),
    // intro: MODULE_INTRO_PLACEHOLDER,
    strict: false,
  });
  return <any>output as d.JSModuleList;
}


async function createAmdModulesFromRollup(config: d.Config, rollupBuild: RollupBuild, entryModules: d.EntryModule[]) {
  if (!config.buildEs5) {
    // only create legacy modules when generating es5 fallbacks
    return null;
  }

  rollupBuild.cache.modules.forEach(module => {
    const key = module.id;
    const entryModule = entryModules.find(b => b.entryKey === `./${key}.js`);
    if (entryModule) {
      entryModule.dependencies = module.dependencies.slice();
    }
  });

  const { output } = await rollupBuild.generate({
    ...config.rollupConfig.outputOptions,
    format: 'amd',
    amd: {
      id: MODULE_BUNDLEID_PLACEHOLDER,
      define: `${config.namespace}.loadBundle`
    },
    // banner: generatePreamble(config),
    // intro: MODULE_INTRO_PLACEHOLDER,
    strict: false,
  });


  return <any>output as d.JSModuleList;
}


async function createLazyEntryModules(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  const promises = buildCtx.entryModules.map(async entryModule => {
    return createLazyEntryModule(config, compilerCtx, entryModule);
  });

  const entryInputPaths = await Promise.all(promises);

  return entryInputPaths.sort();
}


async function createLazyEntryModule(config: d.Config, compilerCtx: d.CompilerCtx, entryModule: d.EntryModule) {
  const entryInputPath = entryModule.filePath;

  const promises = entryModule.moduleFiles.map(async moduleFile => {
    return updateToLazyComponent(config, compilerCtx, entryModule, moduleFile);
  });

  const lazyModules = (await Promise.all(promises)).sort((a, b) => {
    if (a.tagName < b.tagName) return -1;
    if (a.tagName > b.tagName) return 1;
    return 0;
  });

  const lazyModuleContent = lazyModules.map(lazyModule => {
    return lazyModule.exportLine;
  }).join('\n');

  await compilerCtx.fs.writeFile(entryInputPath, lazyModuleContent, { inMemoryOnly: true});

  return entryInputPath;
}


interface LazyModule {
  exportLine: string;
  filePath: string;
  tagName: string;
}


async function updateToLazyComponent(config: d.Config, compilerCtx: d.CompilerCtx, entryModule: d.EntryModule, moduleFile: d.Module) {
  const lazyModuleFilePath = `${moduleFile.jsFilePath}.lazy.mjs`;

  const lazyModuleContent = `export class ${moduleFile.cmpCompilerMeta.componentClassName} {}`;

  await compilerCtx.fs.writeFile(lazyModuleFilePath, lazyModuleContent, { inMemoryOnly: true});
  // console.log('write', lazyModuleFilePath)

  const lazyModule: LazyModule = {
    filePath: lazyModuleFilePath,
    exportLine: createComponentExport(config, entryModule, moduleFile, lazyModuleFilePath),
    tagName: moduleFile.cmpCompilerMeta.tagName
  };

  return lazyModule;
}


function createComponentExport(config: d.Config, entryModule: d.EntryModule, moduleFile: d.Module, lazyModuleFilePath: string) {
  const originalClassName = moduleFile.cmpCompilerMeta.componentClassName;
  const pascalCasedClassName = dashToPascalCase(moduleFile.cmpCompilerMeta.tagName);
  const relPath = config.sys.path.relative(config.sys.path.dirname(entryModule.filePath), lazyModuleFilePath);
  const filePath = normalizePath(relPath);

  if (originalClassName === pascalCasedClassName) {
    return `export { ${originalClassName} } from './${filePath}';`;
  }

  return `export { ${originalClassName} as ${pascalCasedClassName} } from './${filePath}';`;
}

export const MODULE_INTRO_PLACEHOLDER = `/**:module-intro-placeholder:**/`;

export const MODULE_BUNDLEID_PLACEHOLDER = `/**:module-bundle-id:**/`;
