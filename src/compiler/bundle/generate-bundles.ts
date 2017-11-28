import { BuildConfig, BuildContext, ComponentMeta, ComponentRegistry, CompiledModeStyles, ModuleFile, ManifestBundle, SourceTarget } from '../../util/interfaces';
import { componentRequiresScopedStyles, generatePreamble, pathJoin, hasError } from '../util';
import { DEFAULT_STYLE_MODE } from '../../util/constants';
import { formatLoadComponents, formatLoadStyles } from '../../util/data-serialize';
import { getAppFileName, getBundleFileName, getAppWWWBuildDir } from '../app/app-file-naming';
import { getManifestBundleModes } from './bundle-styles';
import { transpileToEs5 } from '../transpile/core-build';


export function generateBundles(config: BuildConfig, ctx: BuildContext, manifestBundles: ManifestBundle[], sourceTarget: SourceTarget) {
  const timeSpan = config.logger.createTimeSpan(`generate ${sourceTarget} bundles started`, config.devMode);

  manifestBundles.forEach(manifestBundle => {
    generateBundleFiles(config, ctx, manifestBundle, sourceTarget);
  });

  ctx.registry = generateComponentRegistry(manifestBundles);

  timeSpan.finish(`generate ${sourceTarget} bundles finished`);

  return manifestBundles;
}


function generateBundleFiles(config: BuildConfig, ctx: BuildContext, manifestBundle: ManifestBundle, sourceTarget: SourceTarget) {
  manifestBundle.moduleFiles.forEach(moduleFile => {
    moduleFile.cmpMeta.bundleIds = moduleFile.cmpMeta.bundleIds || {};
  });

  let compiledModuleText = manifestBundle.compiledModuleText;

  if (sourceTarget === 'es5') {
    const transpileResults = transpileToEs5(compiledModuleText);
    const transpileDiagnostics = transpileResults.diagnostics;
    if (transpileDiagnostics && transpileDiagnostics.length > 0) {
      ctx.diagnostics.push(...transpileResults.diagnostics);
    }
    if (hasError(transpileDiagnostics)) {
      return;
    }
    compiledModuleText = transpileResults.code;
  }

  let moduleText = formatLoadComponents(
    config.namespace,
    MODULE_ID,
    compiledModuleText,
    manifestBundle.moduleFiles
  );

  if (config.minifyJs) {
    // minify js
    const opts: any = { output: {}, compress: {}, mangle: {} };
    if (sourceTarget === 'es5') {
      opts.ecma = 5;
      opts.output.ecma = 5;
      opts.compress.ecma = 5;
      opts.compress.arrows = false;
    }

    if (config.logLevel === 'debug') {
      opts.mangle.keep_fnames = true;
      opts.compress.drop_console = false;
      opts.compress.drop_debugger = false;
      opts.output.beautify = true;
      opts.output.bracketize = true;
      opts.output.indent_level = 2;
      opts.output.comments = 'all';
      opts.output.preserve_line = true;
    }

    const minifyJsResults = config.sys.minifyJs(moduleText, opts);
    minifyJsResults.diagnostics.forEach(d => {
      ctx.diagnostics.push(d);
    });

    if (!minifyJsResults.diagnostics.length) {
      moduleText = minifyJsResults.output + ';';
    }
  }

  const modes = getManifestBundleModes(manifestBundle.moduleFiles);
  const hasDefaultMode = containsDefaultMode(modes);
  const hasNonDefaultModes = containsNonDefaultModes(modes);

  if (hasDefaultMode && hasNonDefaultModes) {
    modes.filter(m => m !== DEFAULT_STYLE_MODE).forEach(modeName => {
      const bundleStyles = manifestBundle.compiledModeStyles.filter(cms => cms.modeName === DEFAULT_STYLE_MODE);
      bundleStyles.push(...manifestBundle.compiledModeStyles.filter(cms => cms.modeName === modeName));

      writeBundleFile(config, ctx, manifestBundle, moduleText, modeName, bundleStyles, sourceTarget);
    });

  } else if (modes.length) {
    modes.forEach(modeName => {
      const bundleStyles = manifestBundle.compiledModeStyles.filter(cms => cms.modeName === modeName);

      writeBundleFile(config, ctx, manifestBundle, moduleText, modeName, bundleStyles, sourceTarget);
    });

  } else {
    writeBundleFile(config, ctx, manifestBundle, moduleText, null, [], sourceTarget);
  }
}


export function writeBundleFile(config: BuildConfig, ctx: BuildContext, manifestBundle: ManifestBundle, moduleText: string, modeName: string, bundleStyles: CompiledModeStyles[], sourceTarget: SourceTarget) {
  const unscopedStyleText = formatLoadStyles(config.namespace, bundleStyles, false);

  const unscopedContents = [
    generatePreamble(config, sourceTarget)
  ];
  if (unscopedStyleText.length) {
    unscopedContents.push(unscopedStyleText);
  }
  unscopedContents.push(moduleText);

  let unscopedContent = unscopedContents.join('\n');

  const bundleId = getBundleId(config, manifestBundle.moduleFiles.map(m => m.cmpMeta.tagNameMeta), modeName, unscopedContent);

  unscopedContent = replaceDefaulBundleId(unscopedContent, bundleId);

  const unscopedFileName = getBundleFileName(bundleId, false);

  setBundleModeIds(manifestBundle.moduleFiles, modeName, bundleId, sourceTarget);

  const unscopedWwwBuildPath = pathJoin(config, getAppWWWBuildDir(config), unscopedFileName);

  // use wwwFilePath as the cache key
  if (ctx.compiledFileCache[unscopedWwwBuildPath] === unscopedContent) {
    // unchanged, no need to resave
    return;
  }
  // cache for later
  ctx.compiledFileCache[unscopedWwwBuildPath] = unscopedContent;

  if (config.generateWWW) {
    // write the unscoped css to the www build
    ctx.filesToWrite[unscopedWwwBuildPath] = unscopedContent;
  }

  if (config.generateDistribution) {
    // write the unscoped css to the dist build
    const unscopedDistPath = pathJoin(
      config,
      config.distDir,
      getAppFileName(config),
      unscopedFileName
    );
    ctx.filesToWrite[unscopedDistPath] = unscopedContent;
  }

  if (modeName && bundleRequiresScopedStyles(manifestBundle.moduleFiles)) {
    const scopedStyleText = formatLoadStyles(config.namespace, bundleStyles, true);

    const scopedContents = [
      generatePreamble(config, sourceTarget)
    ];

    if (scopedStyleText.length) {
      scopedContents.push(scopedStyleText);
    }
    scopedContents.push(moduleText);

    const scopedFileContent = replaceDefaulBundleId(scopedContents.join('\n'), bundleId);

    const scopedFileName = getBundleFileName(bundleId, true);

    if (config.generateWWW) {
      // write the scoped css to the www build
      const scopedWwwPath = pathJoin(config,
        getAppWWWBuildDir(config),
        scopedFileName
      );
      ctx.filesToWrite[scopedWwwPath] = scopedFileContent;
    }

    if (config.generateDistribution) {
      // write the scoped css to the dist build
      const scopedDistPath = pathJoin(config, scopedFileName);
      ctx.filesToWrite[scopedDistPath] = scopedFileContent;
    }
  }
}


export function setBundleModeIds(moduleFiles: ModuleFile[], modeName: string, bundleId: string, sourceTarget: SourceTarget) {
  moduleFiles.forEach(moduleFile => {
    if (modeName) {
      moduleFile.cmpMeta.bundleIds[modeName] = moduleFile.cmpMeta.bundleIds[modeName] || {};
      if (sourceTarget === 'es5') {
        moduleFile.cmpMeta.bundleIds[modeName].es5 = bundleId;
      } else {
        moduleFile.cmpMeta.bundleIds[modeName].es2015 = bundleId;
      }

    } else {
      moduleFile.cmpMeta.bundleIds[DEFAULT_STYLE_MODE] = moduleFile.cmpMeta.bundleIds[DEFAULT_STYLE_MODE] || {};
      if (sourceTarget === 'es5') {
        moduleFile.cmpMeta.bundleIds[DEFAULT_STYLE_MODE].es5 = bundleId;
      } else {
        moduleFile.cmpMeta.bundleIds[DEFAULT_STYLE_MODE].es2015 = bundleId;
      }
    }

  });
}


export function generateComponentRegistry(manifestBundles: ManifestBundle[]) {
  const registryComponents: ComponentMeta[] = [];
  const registry: ComponentRegistry = {};

  manifestBundles.forEach(manifestBundle => {
    manifestBundle.moduleFiles.filter(m => m.cmpMeta).forEach(moduleFile => {
      registryComponents.push(moduleFile.cmpMeta);
    });
  });

  registryComponents.sort((a, b) => {
    if (a.tagNameMeta < b.tagNameMeta) return -1;
    if (a.tagNameMeta > b.tagNameMeta) return 1;
    return 0;

  }).forEach(cmpMeta => {
    registry[cmpMeta.tagNameMeta] = cmpMeta;
  });

  return registry;
}


export function getBundleId(config: BuildConfig, components: string[], modeName: string, content: string) {
  if (config.hashFileNames) {
    // create style id from hashing the content
    return config.sys.generateContentHash(content, config.hashedFileNameLength);
  }

  if (modeName === DEFAULT_STYLE_MODE || !modeName) {
    return components[0];
  }

  return components[0] + '.' + modeName;
}


export function bundleRequiresScopedStyles(moduleFiles: ModuleFile[]) {
  return moduleFiles
          .filter(m => m.cmpMeta && m.cmpMeta.stylesMeta)
          .some(m => componentRequiresScopedStyles(m.cmpMeta.encapsulation));
}


export function containsDefaultMode(modes: string[]) {
  return modes.some(m => m === DEFAULT_STYLE_MODE);
}


export function containsNonDefaultModes(modes: string[]) {
  return modes.length > 0 && modes.some(m => m !== DEFAULT_STYLE_MODE);
}


function replaceDefaulBundleId(fileContent: string, newModuleId: string) {
  return fileContent.replace(MODULE_ID_REGEX, newModuleId);
}


const MODULE_ID = '__STENCIL__MODULE__ID__';
const MODULE_ID_REGEX = new RegExp(MODULE_ID, 'g');
