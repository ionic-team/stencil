import * as d from '../../declarations';
import { normalizePath } from '../util';


export function genereateHmr(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (!config.devServer || !config.devServer.hotReplacement || !buildCtx.isRebuild) {
    return null;
  }

  const hmr: d.HotModuleReplacement = {};

  if (buildCtx.scriptsAdded.length > 0) {
    hmr.scriptsAdded = buildCtx.scriptsAdded.slice();
  }

  if (buildCtx.scriptsDeleted.length > 0) {
    hmr.scriptsDeleted = buildCtx.scriptsDeleted.slice();
  }

  const excludeHmr = excludeHmrFiles(config, config.devServer.excludeHmr, buildCtx.filesChanged);
  if (excludeHmr.length > 0) {
    hmr.excludeHmr = excludeHmr.slice();
  }

  if (buildCtx.hasIndexHtmlChanges) {
    hmr.indexHtmlUpdated = true;
  }

  if (buildCtx.hasServiceWorkerChanges) {
    hmr.serviceWorkerUpdated = true;
  }

  const componentsUpdated = getComponentsUpdated(compilerCtx, buildCtx);
  if (componentsUpdated) {
    hmr.componentsUpdated = componentsUpdated;
  }

  if (Object.keys(buildCtx.stylesUpdated).length > 0) {
    hmr.inlineStylesUpdated = buildCtx.stylesUpdated.map(s => {
      return {
        styleTag: s.styleTag,
        styleMode: s.styleMode,
        styleText: s.styleText,
        isScoped: s.isScoped
      } as d.HmrStyleUpdate;
    }).sort((a, b) => {
      if (a.styleTag < b.styleTag) return -1;
      if (a.styleTag > b.styleTag) return 1;
      return 0;
    });
  }

  const externalStylesUpdated = getExternalStylesUpdated(config, buildCtx);
  if (externalStylesUpdated) {
    hmr.externalStylesUpdated = externalStylesUpdated;
  }

  const externalImagesUpdated = getImagesUpdated(config, buildCtx);
  if (externalImagesUpdated) {
    hmr.imagesUpdated = externalImagesUpdated;
  }

  if (Object.keys(hmr).length === 0) {
    return null;
  }

  hmr.versionId = Date.now().toString().substring(6);

  return hmr;
}


function getComponentsUpdated(compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  // find all of the components that would be affected from the file changes
  if (!buildCtx.filesChanged) {
    return null;
  }

  const filesToLookForImporters = buildCtx.filesChanged.filter(f => {
    return f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js') || f.endsWith('.jsx');
  });

  if (filesToLookForImporters.length === 0) {
    return null;
  }

  const changedScriptFiles: string[] = [];
  const checkedFiles: string[] = [];

  const allModuleFiles = Object.keys(compilerCtx.moduleFiles)
    .map(tsFilePath => compilerCtx.moduleFiles[tsFilePath])
    .filter(moduleFile => moduleFile.localImports && moduleFile.localImports.length > 0);

  while (filesToLookForImporters.length > 0) {
    const scriptFile = filesToLookForImporters.shift();
    addTsFileImporters(allModuleFiles, filesToLookForImporters, checkedFiles, changedScriptFiles, scriptFile);
  }

  const tags = changedScriptFiles.reduce((tags, changedTsFile) => {
    const moduleFile = compilerCtx.moduleFiles[changedTsFile];
    if (moduleFile && moduleFile.cmpMeta && moduleFile.cmpMeta.tagNameMeta) {
      if (!tags.includes(moduleFile.cmpMeta.tagNameMeta)) {
        tags.push(moduleFile.cmpMeta.tagNameMeta);
      }
    }
    return tags;
  }, [] as string[]);

  if (tags.length === 0) {
    return null;
  }

  return tags.sort();
}


function addTsFileImporters(allModuleFiles: d.ModuleFile[], filesToLookForImporters: string[], checkedFiles: string[], changedScriptFiles: string[], scriptFile: string) {
  if (!changedScriptFiles.includes(scriptFile)) {
    // add it to our list of files to transpile
    changedScriptFiles.push(scriptFile);
  }

  if (checkedFiles.includes(scriptFile)) {
    // already checked this file
    return;
  }
  checkedFiles.push(scriptFile);

  // get all the ts files that import this ts file
  const tsFilesThatImportsThisTsFile = allModuleFiles.reduce((arr, moduleFile) => {
    moduleFile.localImports.forEach(localImport => {
      let checkFile = localImport;

      if (checkFile === scriptFile) {
        arr.push(moduleFile.sourceFilePath);
        return;
      }

      checkFile = localImport + '.tsx';
      if (checkFile === scriptFile) {
        arr.push(moduleFile.sourceFilePath);
        return;
      }

      checkFile = localImport + '.ts';
      if (checkFile === scriptFile) {
        arr.push(moduleFile.sourceFilePath);
        return;
      }

      checkFile = localImport + '.js';
      if (checkFile === scriptFile) {
        arr.push(moduleFile.sourceFilePath);
        return;
      }
    });
    return arr;
  }, [] as string[]);

  // add all the files that import this ts file to the list of ts files we need to look through
  tsFilesThatImportsThisTsFile.forEach(tsFileThatImportsThisTsFile => {
    // if we add to this array, then the while look will keep working until it's empty
    filesToLookForImporters.push(tsFileThatImportsThisTsFile);
  });
}


function getExternalStylesUpdated(config: d.Config, buildCtx: d.BuildCtx) {
  if (!buildCtx.isRebuild) {
    return null;
  }

  const outputTargets = (config.outputTargets as d.OutputTargetWww[]).filter(o => o.type === 'www');
  if (outputTargets.length === 0) {
    return null;
  }

  const cssFiles = buildCtx.filesWritten.filter(f => f.endsWith('.css'));
  if (cssFiles.length === 0) {
    return null;
  }

  return cssFiles.map(cssFile => {
    return config.sys.path.basename(cssFile);
  }).sort();
}


function getImagesUpdated(config: d.Config, buildCtx: d.BuildCtx) {
  const outputTargets = (config.outputTargets as d.OutputTargetWww[]).filter(o => o.type === 'www');
  if (outputTargets.length === 0) {
    return null;
  }

  const imageFiles = buildCtx.filesChanged.reduce((arr, filePath) => {
    if (IMAGE_EXT.some(ext => filePath.toLowerCase().endsWith(ext))) {
      const fileName = config.sys.path.basename(filePath);
      if (!arr.includes(fileName)) {
        arr.push(fileName);
      }
    }
    return arr;
  }, []);

  if (imageFiles.length === 0) {
    return null;
  }

  return imageFiles.sort();
}


function excludeHmrFiles(config: d.Config, excludeHmr: string[], filesChanged: string[]) {
  const excludeFiles: string[] = [];

  if (!excludeHmr || excludeHmr.length === 0) {
    return excludeFiles;
  }

  excludeHmr.forEach(excludeHmr => {

    return filesChanged.map(fileChanged => {
      let shouldExclude = false;

      if (config.sys.isGlob(excludeHmr)) {
        shouldExclude = config.sys.minimatch(fileChanged, excludeHmr);
      } else {
        shouldExclude = (normalizePath(excludeHmr) === normalizePath(fileChanged));
      }

      if (shouldExclude) {
        config.logger.debug(`excludeHmr: ${fileChanged}`);
        excludeFiles.push(config.sys.path.basename(fileChanged));
      }

      return shouldExclude;

    }).some(r => r);
  });

  return excludeFiles.sort();
}


const IMAGE_EXT = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.svg'];
