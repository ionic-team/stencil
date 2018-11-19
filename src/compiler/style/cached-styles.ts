import * as d from '../../declarations';
import { getCssImports } from './css-imports';


export async function getComponentStylesCache(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, moduleFile: d.ModuleFile, styleMeta: d.StyleMeta, modeName: string) {
  const cacheKey = getComponentStylesCacheKey(moduleFile, modeName);

  const cachedStyleMeta = compilerCtx.cachedStyleMeta.get(cacheKey);
  if (!cachedStyleMeta) {
    // don't have the cache to begin with, so can't continue
    return null;
  }

  if (isChangedTsFile(moduleFile, buildCtx) && hasDecoratorStyleChanges(compilerCtx, moduleFile, cacheKey)) {
    // this module is one of the changed ts files
    // and the changed ts file has different
    // styleUrls or styleStr in the component decorator
    return null;
  }

  if (!buildCtx.hasStyleChanges) {
    // doesn't look like there was any style changes to begin with
    // just return our cached data
    return cachedStyleMeta;
  }

  if (isChangedStyleEntryFile(buildCtx, styleMeta)) {
    // one of the files that's this components style url was one that changed
    return null;
  }

  const hasChangedImport = await isChangedStyleEntryImport(config, compilerCtx, buildCtx, styleMeta);
  if (hasChangedImport) {
    // one of the files that's imported by the style url changed
    return null;
  }

  // woot! let's use the cached data we already compiled
  return cachedStyleMeta;
}


function isChangedTsFile(moduleFile: d.ModuleFile, buildCtx: d.BuildCtx) {
  return (buildCtx.filesChanged.includes(moduleFile.sourceFilePath));
}


function hasDecoratorStyleChanges(compilerCtx: d.CompilerCtx, moduleFile: d.ModuleFile, cacheKey: string) {
  const lastStyleInput = compilerCtx.lastComponentStyleInput.get(cacheKey);
  if (!lastStyleInput) {
    return true;
  }

  return (lastStyleInput !== getComponentStyleInputKey(moduleFile));
}


export function isChangedStyleEntryFile(buildCtx: d.BuildCtx, styleMeta: d.StyleMeta) {
  if (!styleMeta.externalStyles) {
    return false;
  }

  return (buildCtx.filesChanged.some(f => {
    return styleMeta.externalStyles.some(s => s.absolutePath === f);
  }));
}


async function isChangedStyleEntryImport(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, styleMeta: d.StyleMeta) {
  if (!styleMeta.externalStyles) {
    return false;
  }

  const checkedFiles: string[] = [];

  const promises = styleMeta.externalStyles.map(externalStyle => {
    return hasChangedImportFile(config, compilerCtx, buildCtx, externalStyle.absolutePath, checkedFiles);
  });

  const results = await Promise.all(promises);

  return results.includes(true);
}


async function hasChangedImportFile(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, filePath: string, checkedFiles: string[]) {
  if (checkedFiles.includes(filePath)) {
    // already checked
    return false;
  }
  checkedFiles.push(filePath);

  let rtn = false;

  try {
    const content = await compilerCtx.fs.readFile(filePath);
    rtn = await hasChangedImportContent(config, compilerCtx, buildCtx, filePath, content, checkedFiles);
  } catch (e) {}

  return rtn;
}


async function hasChangedImportContent(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, filePath: string, content: string, checkedFiles: string[]): Promise<boolean> {
  const cssImports = getCssImports(config, buildCtx, filePath, content);
  if (cssImports.length === 0) {
    // don't bother
    return false;
  }

  const isChangedImport = buildCtx.filesChanged.some(changedFilePath => {
    return cssImports.some(c => c.filePath === changedFilePath || c.altFilePath === changedFilePath);
  });

  if (isChangedImport) {
    // one of the changed files is an import of this file
    return true;
  }

  // keep diggin'
  const promises = cssImports.map(async (cssImportData) => {
    let hasChanged = await hasChangedImportFile(config, compilerCtx, buildCtx, cssImportData.filePath, checkedFiles);

    if (!hasChanged && typeof cssImportData.altFilePath === 'string') {
      hasChanged = await hasChangedImportFile(config, compilerCtx, buildCtx, cssImportData.altFilePath, checkedFiles);
    }

    return hasChanged;
  });

  const results = await Promise.all(promises);

  return results.includes(true);
}


function getComponentStyleInputKey(moduleFile: d.ModuleFile) {
  const input: string[] = [];

  if (moduleFile.cmpMeta.stylesMeta) {
    Object.keys(moduleFile.cmpMeta.stylesMeta).forEach(modeName => {
      input.push(modeName);

      const styleMeta = moduleFile.cmpMeta.stylesMeta[modeName];
      if (styleMeta.styleStr) {
        input.push(styleMeta.styleStr);
      }
      if (styleMeta.externalStyles) {
        styleMeta.externalStyles.forEach(s => {
          input.push(s.absolutePath);
        });
      }
    });
  }

  return input.join(',');
}


export function setComponentStylesCache(compilerCtx: d.CompilerCtx, moduleFile: d.ModuleFile, modeName: string, styleMeta: d.StyleMeta) {
  const cacheKey = getComponentStylesCacheKey(moduleFile, modeName);

  compilerCtx.cachedStyleMeta.set(cacheKey, styleMeta);

  const styleInput = getComponentStyleInputKey(moduleFile);
  compilerCtx.lastComponentStyleInput.set(cacheKey, styleInput);
}


function getComponentStylesCacheKey(moduleFile: d.ModuleFile, modeName: string) {
  return `${moduleFile.sourceFilePath}#${modeName}`;
}
