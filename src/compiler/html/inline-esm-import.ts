import type * as d from '../../declarations';
import { getAbsoluteBuildDir } from './html-utils';
import { generateHashedCopy } from '../output-targets/copy/hashed-copy';
import { injectModulePreloads } from './inject-module-preloads';
import { isString } from '@utils';
import { join } from 'path';
import ts from 'typescript';

export const optimizeEsmImport = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  doc: Document,
  outputTarget: d.OutputTargetWww,
) => {
  const resourcesUrl = getAbsoluteBuildDir(outputTarget);
  const entryFilename = `${config.fsNamespace}.esm.js`;
  const expectedSrc = join(resourcesUrl, entryFilename);

  const script = Array.from(doc.querySelectorAll('script')).find(
    s => s.getAttribute('type') === 'module' && !s.hasAttribute('crossorigin') && s.getAttribute('src') === expectedSrc,
  );

  if (!script) {
    return false;
  }

  script.setAttribute('data-resources-url', resourcesUrl);
  script.setAttribute('data-stencil-namespace', config.fsNamespace);

  const entryPath = join(outputTarget.buildDir, entryFilename);
  const content = await compilerCtx.fs.readFile(entryPath);

  if (isString(content)) {
    // If the script is too big, instead of inlining, we hash the file and change
    // the <script> to the new location
    if (config.allowInlineScripts && content.length < MAX_JS_INLINE_SIZE) {
      // Let's try to inline, we have to fix all the relative paths of the imports
      const results = updateImportPaths(content, resourcesUrl);
      if (results.orgImportPaths.length > 0) {
        // insert inline script
        script.removeAttribute('src');
        script.innerHTML = results.code;
      }
    } else {
      const hashedFile = await generateHashedCopy(config, compilerCtx, entryPath);
      if (hashedFile) {
        const hashedPath = join(resourcesUrl, hashedFile);
        script.setAttribute('src', hashedPath);
        injectModulePreloads(doc, [hashedPath]);
      }
    }
    return true;
  }
  return false;
};

export const updateImportPaths = (code: string, newDir: string) => {
  const orgImportPaths: string[] = [];
  const tsSourceFile = ts.createSourceFile('module.ts', code, ts.ScriptTarget.Latest);
  ts.transform(tsSourceFile, [readImportPaths(orgImportPaths)]);

  orgImportPaths.forEach(orgImportPath => {
    const newPath = replacePathDir(orgImportPath, newDir);
    if (newPath) {
      code = code.replace(`"${orgImportPath}"`, `"${newPath}"`);
      code = code.replace(`'${orgImportPath}'`, `'${newPath}'`);
    }
  });

  return {
    code,
    orgImportPaths,
  };
};

const replacePathDir = (orgImportPath: string, newDir: string) => {
  if (orgImportPath.startsWith('./') && (orgImportPath.endsWith('.js') || orgImportPath.endsWith('.mjs'))) {
    return newDir + orgImportPath.substring(2);
  }
  return null;
};

const readImportPaths = (orgImportPaths: string[]): ts.TransformerFactory<ts.SourceFile> => {
  return () => {
    return tsSourceFile => {
      const importStatements = tsSourceFile.statements
        .filter(ts.isImportDeclaration)
        .filter(s => s.moduleSpecifier != null)
        .filter(s => ts.isStringLiteral(s.moduleSpecifier) && s.moduleSpecifier.text);

      importStatements.forEach(s => {
        if (ts.isStringLiteral(s.moduleSpecifier)) {
          orgImportPaths.push(s.moduleSpecifier.text);
        }
      });

      return tsSourceFile;
    };
  };
};

// https://twitter.com/addyosmani/status/1143938175926095872
const MAX_JS_INLINE_SIZE = 1 * 1024;
