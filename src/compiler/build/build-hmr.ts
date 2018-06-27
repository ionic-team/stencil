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

  const changedScriptFiles = buildCtx.filesChanged.filter(f => {
    return f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js') || f.endsWith('.jsx');
  });

  if (changedScriptFiles.length === 0) {
    return null;
  }

  const componentsUpdated: string[] = [];
  const allModuleFiles = Object.keys(compilerCtx.moduleFiles).map(tsFilePath => compilerCtx.moduleFiles[tsFilePath]);

  changedScriptFiles.forEach(changedScriptFile => {
    addComponentsUpdated(allModuleFiles, componentsUpdated, changedScriptFile);
  });

  if (componentsUpdated.length === 0) {
    return null;
  }

  return componentsUpdated.sort();
}


function addComponentsUpdated(allModuleFiles: d.ModuleFile[], componentsUpdated: string[], changedScriptFile: string) {
  allModuleFiles.forEach(moduleFile => {
    if (moduleFile.cmpMeta) {
      const checkedFiles: string[] = [];
      const shouldAdd = addComponentUpdated(allModuleFiles, componentsUpdated, changedScriptFile, checkedFiles, moduleFile);

      if (shouldAdd && !componentsUpdated.includes(moduleFile.cmpMeta.tagNameMeta)) {
        componentsUpdated.push(moduleFile.cmpMeta.tagNameMeta);
      }
    }
  });
}


function addComponentUpdated(allModuleFiles: d.ModuleFile[], componentsUpdated: string[], changedScriptFile: string, checkedFiles: string[], moduleFile: d.ModuleFile): boolean {
  if (checkedFiles.includes(changedScriptFile)) {
    return false;
  }
  checkedFiles.push(changedScriptFile);

  if (moduleFile.sourceFilePath === changedScriptFile) {
    return true;
  }

  if (moduleFile.jsFilePath === changedScriptFile) {
    return true;
  }

  return moduleFile.localImports.some(localImport => {
    const localImportModuleFile = allModuleFiles.find(m => m.sourceFilePath === localImport);
    if (localImportModuleFile) {
      return addComponentUpdated(allModuleFiles, componentsUpdated, changedScriptFile, checkedFiles, localImportModuleFile);
    }
    return false;
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

  return excludeFiles;
}


const IMAGE_EXT = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.svg'];
