import * as d from '../../declarations';
import { copyEsmCorePolyfills } from '../app/app-polyfills';
import { getComponentsEsmBuildPath, getComponentsEsmFileName, getCoreEsmFileName, getDefineCustomElementsPath, getDistEsmComponentsDir, getDistEsmDir, getDistEsmIndexPath, getLoaderEsmPath } from '../app/app-file-naming';
import { formatBrowserLoaderComponent } from '../../util/data-serialize';
import { normalizePath, pathJoin } from '../util';


export async function generateEsmIndexes(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist) {

  const targets = ['es5', 'es2017'] as d.SourceTarget[];
  await Promise.all([
    generateEsmIndexShortcut(config, compilerCtx, outputTarget),
    ...targets.map(sourceTarget => generateEsmIndex(config, compilerCtx, outputTarget, sourceTarget))
  ]);
}

async function generateEsmIndexShortcut(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist) {
  const indexPath = getDistEsmIndexPath(config, outputTarget);
  const contentJs = `export * from './es5/index.js';`;
  await compilerCtx.fs.writeFile(indexPath, contentJs);
}

async function generateEsmIndex(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist, sourceTarget: d.SourceTarget) {
  const esm: string[] = [
    `// ${config.namespace}: ES Module`
  ];

  const exportsIndexPath = pathJoin(config, getDistEsmComponentsDir(config, outputTarget, sourceTarget), 'index.js');
  const fileExists = await compilerCtx.fs.access(exportsIndexPath);
  if (fileExists) {
    await addExport(config, compilerCtx, outputTarget, sourceTarget, esm, exportsIndexPath);
  }

  const distIndexEsmPath = getDistEsmIndexPath(config, outputTarget, sourceTarget);
  await Promise.all([
    compilerCtx.fs.writeFile(distIndexEsmPath, esm.join('\n')),
    copyEsmCorePolyfills(config, compilerCtx, outputTarget),
    patchCollection(config, compilerCtx, outputTarget)
  ]);
}


async function addExport(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist, sourceTarget: d.SourceTarget, esm: string[], filePath: string) {
  const fileExists = await compilerCtx.fs.access(filePath);
  if (fileExists) {
    let relPath = normalizePath(config.sys.path.relative(getDistEsmDir(config, outputTarget, sourceTarget), filePath));

    if (!relPath.startsWith('.')) {
      relPath = './' + relPath;
    }

    esm.push(`export * from '${relPath}';`);
  }
}


export async function generateEsmHosts(config: d.Config, compilerCtx: d.CompilerCtx, cmpRegistry: d.ComponentRegistry, outputTarget: d.OutputTarget) {
  if (outputTarget.type !== 'dist' || !config.buildEsm) {
    return;
  }

  await Promise.all([
    generateEsmHost(config, compilerCtx, cmpRegistry, outputTarget, 'es5'),
    generateEsmHost(config, compilerCtx, cmpRegistry, outputTarget, 'es2017'),

    generateEsmLoader(config, compilerCtx, outputTarget)
  ]);
}

export async function generateEsmHost(config: d.Config, compilerCtx: d.CompilerCtx, cmpRegistry: d.ComponentRegistry, outputTarget: d.OutputTargetDist, sourceTarget: d.SourceTarget) {
  await Promise.all([
    generateEsm(config, compilerCtx, cmpRegistry, outputTarget, sourceTarget),
    generateDefineCustomElements(config, compilerCtx, cmpRegistry, outputTarget, sourceTarget),
  ]);
}

async function generateDefineCustomElements(config: d.Config, compilerCtx: d.CompilerCtx, cmpRegistry: d.ComponentRegistry, outputTarget: d.OutputTargetDist, sourceTarget: d.SourceTarget) {
  const componentClassList = Object.keys(cmpRegistry).map(tagName => {
    const cmpMeta: d.ComponentMeta = cmpRegistry[tagName];
    return cmpMeta.componentClass;
  }).sort();

  const componentsFileName = getComponentsEsmFileName(config);
  const c = `
// ${config.namespace}: Custom Elements Define Library, ES Module/${sourceTarget} Target

import { defineCustomElement } from './${getCoreEsmFileName(config)}';
import {\n  ${componentClassList.join(',\n  ')}\n} from './${componentsFileName}';

export function defineCustomElements(win, opts) {
  return defineCustomElement(win, [\n    ${componentClassList.join(',\n    ')}\n  ], opts);
}
`;

  const defineFilePath = getDefineCustomElementsPath(config, outputTarget, sourceTarget);

  await compilerCtx.fs.writeFile(defineFilePath, c);
}

async function generateEsm(config: d.Config, compilerCtx: d.CompilerCtx, cmpRegistry: d.ComponentRegistry, outputTarget: d.OutputTargetDist, sourceTarget: d.SourceTarget) {
  const VAR = sourceTarget === 'es5' ? 'var' : 'const';
  const c = await Promise.all(Object.keys(cmpRegistry).sort().map(async tagName => {
    const cmpMeta = cmpRegistry[tagName];
    const data = JSON.stringify(formatBrowserLoaderComponent(cmpMeta));
    return `export ${VAR} ${cmpMeta.componentClass} = ${data};`;
  }));

  c.unshift(`// ${config.namespace}: Host Data, ES Module/${sourceTarget} Target`);

  const componentsEsmFilePath = getComponentsEsmBuildPath(config, outputTarget, sourceTarget);

  await compilerCtx.fs.writeFile(componentsEsmFilePath, c.join('\n'));
}

async function generateEsmLoader(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist) {
  const loaderPath = getLoaderEsmPath(config, outputTarget);
  const es5EntryPoint = getDefineCustomElementsPath(config, outputTarget, 'es5');
  const es2017EntryPoint = getDefineCustomElementsPath(config, outputTarget, 'es2017');

  const packageJsonContent = JSON.stringify({
    'name': 'loader',
    'typings': './index.d.ts',
    'module': './index.js',
    'es2017': './index.es2017.js'
  }, null, 2);

  const indexDtsContent = `export declare function defineCustomElements(win: any): Promise<void>;`;
  const indexES5Content = `export * from '${config.sys.path.relative(loaderPath, es5EntryPoint)}';`;
  const indexES2017Content = `export * from '${config.sys.path.relative(loaderPath, es2017EntryPoint)}';`;

  await Promise.all([
    compilerCtx.fs.writeFile(pathJoin(config, loaderPath, 'package.json'), packageJsonContent),
    compilerCtx.fs.writeFile(pathJoin(config, loaderPath, 'index.d.ts'), indexDtsContent),
    compilerCtx.fs.writeFile(pathJoin(config, loaderPath, 'index.js'), indexES5Content),
    compilerCtx.fs.writeFile(pathJoin(config, loaderPath, 'index.es2017.js'), indexES2017Content)
  ]);
}


async function patchCollection(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist) {
  // it's possible a d.ts file was exported from the index.ts file
  // which is fine, except that messes with any raw JS exports
  // in the collection/index.js
  // so let's just make this work by putting in empty js files
  // and call it a day
  const collectionInterfacePath = pathJoin(config, outputTarget.collectionDir, 'interface.js');
  await compilerCtx.fs.writeFile(collectionInterfacePath, '');
}
