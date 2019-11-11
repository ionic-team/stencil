import * as d from '../../declarations';
import { getCssImports } from './css-imports';
import { getStyleId } from './style-utils';


export async function getComponentStylesCache(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, cmp: d.ComponentCompilerMeta, styleMeta: d.StyleCompiler, commentOriginalSelector: boolean) {
  const cacheKey = getComponentStylesCacheKey(cmp, styleMeta.modeName);

  const cachedStyleMeta = compilerCtx.cachedStyleMeta.get(cacheKey);
  if (!cachedStyleMeta) {
    // don't have the cache to begin with, so can't continue
    return null;
  }

  if (isChangedTsFile(cmp.sourceFilePath, buildCtx) && hasDecoratorStyleChanges(compilerCtx, cmp, cacheKey)) {
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

  if (commentOriginalSelector && typeof cachedStyleMeta.compiledStyleTextScopedCommented !== 'string') {
    return null;
  }

  // woot! let's use the cached data we already compiled
  return cachedStyleMeta;
}


function isChangedTsFile(sourceFilePath: string, buildCtx: d.BuildCtx) {
  return (buildCtx.filesChanged.includes(sourceFilePath));
}


function hasDecoratorStyleChanges(compilerCtx: d.CompilerCtx, cmp: d.ComponentCompilerMeta, cacheKey: string) {
  const lastStyleInput = compilerCtx.lastComponentStyleInput.get(cacheKey);
  if (!lastStyleInput) {
    return true;
  }

  return (lastStyleInput !== getComponentStyleInputKey(cmp));
}


export function isChangedStyleEntryFile(buildCtx: d.BuildCtx, styleMeta: d.StyleCompiler) {
  if (!styleMeta.externalStyles) {
    return false;
  }

  return (buildCtx.filesChanged.some(f => {
    return styleMeta.externalStyles.some(s => s.absolutePath === f);
  }));
}


async function isChangedStyleEntryImport(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, styleMeta: d.StyleCompiler) {
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


function getComponentStyleInputKey(cmp: d.ComponentCompilerMeta) {
  const input: string[] = [];

  if (Array.isArray(cmp.styles)) {
    cmp.styles.forEach(styleMeta => {
      input.push(styleMeta.modeName);

      if (typeof styleMeta.styleStr === 'string') {
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


export function setComponentStylesCache(compilerCtx: d.CompilerCtx, cmp: d.ComponentCompilerMeta, styleMeta: d.StyleCompiler) {
  const cacheKey = getComponentStylesCacheKey(cmp, styleMeta.modeName);

  compilerCtx.cachedStyleMeta.set(cacheKey, styleMeta);

  const styleInput = getComponentStyleInputKey(cmp);
  compilerCtx.lastComponentStyleInput.set(cacheKey, styleInput);
}


function getComponentStylesCacheKey(cmp: d.ComponentCompilerMeta, modeName: string) {
  return `${cmp.sourceFilePath}#${cmp.tagName}#${modeName}`;
}


export async function updateLastStyleComponetInputs(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (config.watch) {
    const promises: Promise<any>[] = [];
    compilerCtx.moduleMap.forEach(m => {
      if (Array.isArray(m.cmps)) {
        promises.push(...m.cmps.map(async cmp => {
          const cacheKey = cmp.tagName;
          const currentInputHash = await getComponentDecoratorStyleHash(config, cmp);

          if (cmp.styles == null || cmp.styles.length === 0) {
            compilerCtx.styleModeNames.forEach(modeName => {
              const lastInputHash = compilerCtx.lastComponentStyleInput.get(cacheKey);
              if (lastInputHash !== currentInputHash) {
                buildCtx.stylesUpdated.push({
                  styleTag: cmp.tagName,
                  styleText: '',
                  styleMode: modeName
                });

                const cacheKey = getComponentStylesCacheKey(cmp, modeName);
                compilerCtx.cachedStyleMeta.delete(cacheKey);

                const styleId = getStyleId(cmp, modeName, false);
                compilerCtx.lastBuildStyles.delete(styleId);
              }
            });
          }
          compilerCtx.lastComponentStyleInput.set(cacheKey, currentInputHash);
        }));
      }
    });
    await Promise.all(promises);
  }
}

function getComponentDecoratorStyleHash(config: d.Config, cmp: d.ComponentCompilerMeta) {
  return config.sys.generateContentHash(getComponentStyleInputKey(cmp), 8);
}
