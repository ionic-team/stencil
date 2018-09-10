import * as d from '../../declarations';
import { copyEsmCorePolyfills } from '../app/app-polyfills';
import { getComponentsEsmBuildPath, getComponentsEsmFileName, getCoreEsmFileName, getDefineCustomElementsPath, getDistEsmComponentsDir, getDistEsmDir, getDistEsmIndexPath, getLoaderEsmPath } from '../app/app-file-naming';
import { formatBrowserLoaderComponent } from '../../util/data-serialize';
import { normalizePath, pathJoin } from '../util';


export async function generateEsmIndexes(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist) {

  const targets = ['es5'] as d.SourceTarget[];
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
  if (outputTarget.type !== 'dist') {
    return;
  }

  await Promise.all([
    generateEsmEs5(config, compilerCtx, cmpRegistry, outputTarget),
    generateDefineCustomElements(config, compilerCtx, cmpRegistry, outputTarget),
    generateEsmLoader(config, compilerCtx, outputTarget)
  ]);
}


async function generateDefineCustomElements(config: d.Config, compilerCtx: d.CompilerCtx, cmpRegistry: d.ComponentRegistry, outputTarget: d.OutputTargetDist) {
  const componentClassList = Object.keys(cmpRegistry).map(tagName => {
    const cmpMeta: d.ComponentMeta = cmpRegistry[tagName];
    return cmpMeta.componentClass;
  }).sort();

  const componentsFileName = getComponentsEsmFileName(config);
  const c = `
// ${config.namespace}: Custom Elements Define Library, ES Module/ES5 Target

import { defineCustomElement } from './${getCoreEsmFileName(config)}';
import {\n  ${componentClassList.join(',\n  ')}\n} from './${componentsFileName}';

export function defineCustomElements(win, opts) {
  defineCustomElement(win, [\n    ${componentClassList.join(',\n    ')}\n  ], opts);
}
`;

  const defineFilePath = getDefineCustomElementsPath(config, outputTarget, 'es5');

  await compilerCtx.fs.writeFile(defineFilePath, c);
}

async function generateEsmEs5(config: d.Config, compilerCtx: d.CompilerCtx, cmpRegistry: d.ComponentRegistry, outputTarget: d.OutputTargetDist) {
  const c = await Promise.all(Object.keys(cmpRegistry).sort().map(async tagName => {
    const cmpMeta = cmpRegistry[tagName];
    const data = JSON.stringify(formatBrowserLoaderComponent(cmpMeta));
    return `export var ${cmpMeta.componentClass} = ${data};`;
  }));

  c.unshift(`// ${config.namespace}: Host Data, ES Module/ES5 Target`);

  const componentsEsmFilePath = getComponentsEsmBuildPath(config, outputTarget, 'es5');

  await compilerCtx.fs.writeFile(componentsEsmFilePath, c.join('\n\n'));
}

async function generateEsmLoader(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist) {
  const loaderPath = getLoaderEsmPath(config, outputTarget);
  const defineFilePath = getDefineCustomElementsPath(config, outputTarget, 'es5');

  const packageJsonContent = JSON.stringify({
    'name': 'loader',
    'typings': './index.d.ts',
    'module': config.sys.path.relative(loaderPath, defineFilePath)
  });

  const indexDtsContent = `export declare function defineCustomElements(win: any): void;`;

  await compilerCtx.fs.writeFile(pathJoin(config, loaderPath, 'package.json'), packageJsonContent);
  await compilerCtx.fs.writeFile(pathJoin(config, loaderPath, 'index.d.ts'), indexDtsContent);
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
