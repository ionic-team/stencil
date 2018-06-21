import * as d from '../../declarations';
import { buildError, normalizePath } from '../util';


export async function minifyStyle(config: d.Config, compilerCtx: d.CompilerCtx, diagnostics: d.Diagnostic[], styleText: string, filePath?: string) {
  if (typeof styleText !== 'string' || !styleText.length) {
    //  don't bother with invalid data
    return styleText;
  }

  const hasCssImport = styleText.includes('@import');

  if (!config.minifyCss && !hasCssImport) {
    // if we're not minifying the css (dev mode basically)
    // we still need to using clean-css to figure out all the
    // css @import rules and concatenate them, but don't
    // bother if there are no @imports at all
    return styleText;
  }

  // figure out which minify options we should use
  // config.minifyCss is basically for production
  const opts = config.minifyCss ? MINIFY_CSS_PROD : MINIFY_CSS_DEV;

  let cacheKey: string = null;
  if (!hasCssImport) {
    // only can use cache if there's no @import
    cacheKey = compilerCtx.cache.createKey('minifyStyle', '__BUILDID:MINIFYSTYLE__', styleText, opts);
    const cachedContent = await compilerCtx.cache.get(cacheKey);

    if (cachedContent != null) {
      // let's use the cached data we already figured out
      return cachedContent;
    }
  }

  // update any CSS @imports pointing to node_modules, if any
  styleText = resolveNodeModuleCssImports(config, diagnostics, styleText, filePath, hasCssImport);

  const minifyResults = await config.sys.minifyCss(styleText, filePath, opts);
  minifyResults.diagnostics.forEach(d => {
    // collect up any diagnostics from minifying
    diagnostics.push(d);
  });

  if (typeof minifyResults.output === 'string') {
    // cool, we got valid minified output

    if (cacheKey != null) {
      // only cache if we got a cache key, if not it probably has an @import
      await compilerCtx.cache.put(cacheKey, minifyResults.output);
    }

    return minifyResults.output;
  }

  return styleText;
}


const MINIFY_CSS_PROD: any = {
  level: 2
};

const MINIFY_CSS_DEV: any = {
  level: 0,
  format: 'beautify'
};


export function resolveNodeModuleCssImports(config: d.Config, diagnostics: d.Diagnostic[], styleText: string, filePath: string, hasCssImport: boolean) {
  // only bother figuring out node module import paths
  // if we have a valid file path and we see that the
  // input style text actually has a @import rule
  if (typeof filePath === 'string' && hasCssImport) {
    const imports = getNodeImports(styleText);
    const dir = config.sys.path.dirname(filePath);

    imports.forEach(orgImport => {
      try {
        const moduleId = getModuleId(orgImport);
        const modulePath = config.sys.resolveModule(dir, moduleId);
        const newImport = replaceNodeModuleUrl(config, filePath, moduleId, modulePath, orgImport);

        styleText = styleText.replace(orgImport, newImport);

      } catch (e) {
        const d = buildError(diagnostics);
        d.messageText = `Unable to resolve node module for CSS @import: ${orgImport}`;
      }
    });
  }

  return styleText;
}


export function getModuleId(orgImport: string) {
  if (orgImport.startsWith('~')) {
    orgImport = orgImport.substring(1);
  }
  const splt = orgImport.split('/');

  if (orgImport.startsWith('@')) {
    if (splt.length > 1) {
      return splt.slice(0, 2).join('/');
    }
  }

  return splt[0];
}


export function getNodeImports(styleText: string ) {
  const matches: string[] = [];
  const re = /@import (\"|\')(\~(\w|\.|\/|\-|\$|#|\!|@|&|\=|\+|\;|\,)+)(\"|\')/gm;

  let match: RegExpExecArray;

  while (match = re.exec(styleText)) {
    matches.push(match[2]);
  }

  return matches.sort((a, b) => {
    if (a.length > b.length) return -1;
    if (a.length < b.length) return 1;
    return 0;
  });
}


export function replaceNodeModuleUrl(config: d.Config, baseCssFilePath: string, moduleId: string, nodeModulePath: string, url: string) {
  nodeModulePath = normalizePath(config.sys.path.dirname(nodeModulePath));
  url = normalizePath(url);

  const absPathToNodeModuleCss = normalizePath(url.replace(`~${moduleId}`, nodeModulePath));

  const baseCssDir = normalizePath(config.sys.path.dirname(baseCssFilePath));

  const relToRoot = normalizePath(config.sys.path.relative(baseCssDir, absPathToNodeModuleCss));
  return relToRoot;
}


export async function minifyInlineStyles(config: d.Config, compilerCtx: d.CompilerCtx, doc: Document, diagnostics: d.Diagnostic[]) {
  const styles = doc.querySelectorAll('style');
  const promises: Promise<any>[] = [];

  for (let i = 0; i < styles.length; i++) {
    promises.push(minifyInlineStyle(config, compilerCtx, diagnostics, styles[i]));
  }

  await Promise.all(promises);
}


async function minifyInlineStyle(config: d.Config, compilerCtx: d.CompilerCtx, diagnostics: d.Diagnostic[], style: HTMLStyleElement) {
  if (style.innerHTML.includes('  ') || style.innerHTML.includes('\t')) {
    style.innerHTML = await minifyStyle(config, compilerCtx, diagnostics, style.innerHTML);
  }
}
