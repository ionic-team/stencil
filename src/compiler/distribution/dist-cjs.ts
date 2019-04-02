import * as d from '../../declarations';
import { getDistCjsDir, getDistCjsIndexPath, getDistEsmDir } from '../app/app-file-naming';
import { normalizePath } from '../util';
import ts from 'typescript';


export async function generateCommonJsDist(config: d.Config, compilerCtx: d.CompilerCtx) {
  const distOutputs = config.outputTargets.filter(o => o.type === 'dist') as d.OutputTargetDist[];

  if (distOutputs.length === 0) {
    // not doing any dist builds
    return;
  }

  await Promise.all(distOutputs.map(distOutput => {
    return generateCommonJsOutput(config, compilerCtx, distOutput);
  }));

  await compilerCtx.fs.commit();
  await compilerCtx.cache.commit();
}


async function generateCommonJsOutput(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist) {
  const distIndexCjsPath = getDistCjsIndexPath(config, outputTarget);
  const esmDirPath = getDistEsmDir(config, outputTarget);
  const cjsDirPath = getDistEsmDir(config, outputTarget);
  const esmIndexFilePath = config.sys.path.join(esmDirPath, 'index.js');
  const cjsIndexFilePath = config.sys.path.join(cjsDirPath, 'index.js');

  const cjs: string[] = [
    `// ${config.namespace}: CommonJS Main`,
    `module.exports = require('${normalizePath(config.sys.path.relative(distIndexCjsPath, cjsIndexFilePath))}');`
  ];

  await compilerCtx.fs.writeFile(distIndexCjsPath, cjs.join('\n'));

  await commonJsifyFile(compilerCtx, esmIndexFilePath, cjsIndexFilePath);

  const esmEs5DirPath = getDistEsmDir(config, outputTarget, 'es5');
  const cjsEs5DirPath = getDistCjsDir(config, outputTarget, 'es5');

  await commonJsifyDir(config, compilerCtx, esmEs5DirPath, cjsEs5DirPath);
}


async function commonJsifyDir(config: d.Config, compilerCtx: d.CompilerCtx, esmDirPath: string, cjsDirPath: string) {
  const items = await compilerCtx.fs.readdir(esmDirPath, { inMemoryOnly: true, recursive: true });

  await Promise.all(items.map(async item => {
    if (item.isFile && item.relPath.endsWith('.js')) {
      const esmFilePath = item.absPath;
      const cjsFilePath = config.sys.path.join(cjsDirPath, item.relPath);
      await commonJsifyFile(compilerCtx, esmFilePath, cjsFilePath);

    } else if (item.isDirectory) {
      const subEsmDirPath = item.absPath;
      const subCjsDirPath = config.sys.path.join(cjsDirPath, item.relPath);
      await commonJsifyDir(config, compilerCtx, subEsmDirPath, subCjsDirPath);
    }
  }));
}


async function commonJsifyFile(compilerCtx: d.CompilerCtx, esmFilePath: string, cjsFilePath: string) {
  const esmCode = await compilerCtx.fs.readFile(esmFilePath);

  const cjsCode = await transpileToCommonJS(compilerCtx, esmCode);

  await compilerCtx.fs.writeFile(cjsFilePath, cjsCode);
}


async function transpileToCommonJS(compilerCtx: d.CompilerCtx, esmCode: string) {
  let cjsCode = esmCode;

  const cacheKey = compilerCtx.cache.createKey('cjsdist', esmCode);
  const cachedContent = await compilerCtx.cache.get(cacheKey);
  if (cachedContent != null) {
    return cachedContent;
  }

  const transpileOpts: ts.TranspileOptions = {
    compilerOptions: {
      sourceMap: false,
      allowJs: true,
      declaration: false,
      target: ts.ScriptTarget.ES5,
      module: ts.ModuleKind.CommonJS,
      removeComments: false,
      isolatedModules: true,
      skipLibCheck: true
    }
  };

  const tsResults = ts.transpileModule(esmCode, transpileOpts);

  cjsCode = tsResults.outputText;

  await compilerCtx.cache.put(cacheKey, cjsCode);

  return cjsCode;
}
