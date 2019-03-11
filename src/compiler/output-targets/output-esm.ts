import * as d from '../../declarations';
import { copyEsmCorePolyfills } from '../app-core/app-polyfills';
import { dashToPascalCase } from '@utils';
import { getComponentsEsmBuildPath, getComponentsEsmFileName, getCoreEsmFileName, getDefineCustomElementsPath, getDistEsmComponentsDir, getDistEsmDir, getDistEsmIndexPath, getLoaderEsmPath, isOutputTargetDist } from './output-utils';
import { normalizePath } from '@utils';


export async function outputEsmIndexes(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (!buildCtx.requiresFullBuild && buildCtx.isRebuild && !buildCtx.hasScriptChanges) {
    return;
  }

  const outputTargets = config.outputTargets.filter(isOutputTargetDist);
  if (outputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate esm started`, true);

  const promises = outputTargets.map(outputTarget => {
    return generateEsmSourceTargets(config, compilerCtx, outputTarget);
  });

  await Promise.all(promises);

  timespan.finish(`generate esm finished`);
}


export function generateEsmSourceTargets(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist) {
  const targets = ['es5', 'es2017'] as d.SourceTarget[];

  const promises: Promise<any>[] = [
    generateEsmIndexShortcut(config, compilerCtx, outputTarget),
    ...targets.map(sourceTarget => generateEsmIndex(config, compilerCtx, outputTarget, sourceTarget))
  ];

  return Promise.all(promises);
}


function generateEsmIndexShortcut(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist) {
  const indexPath = getDistEsmIndexPath(config, outputTarget);
  const contentJs = config.buildEs5
    ? `export * from './es5/index.js';`
    : `export * from './es2017/index.js';`;

  return compilerCtx.fs.writeFile(indexPath, contentJs);
}


async function generateEsmIndex(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist, sourceTarget: d.SourceTarget) {
  const esm: string[] = [
    `// ${config.namespace}: ES Module`
  ];

  const exportsIndexPath = config.sys.path.join(getDistEsmComponentsDir(config, outputTarget, sourceTarget), 'index.js');
  const fileExists = await compilerCtx.fs.access(exportsIndexPath);
  if (fileExists) {
    await addExport(config, compilerCtx, outputTarget, sourceTarget, esm, exportsIndexPath);
  }

  const distIndexEsmPath = getDistEsmIndexPath(config, outputTarget, sourceTarget);

  return Promise.all([
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


export async function generateEsmHosts(config: d.Config, compilerCtx: d.CompilerCtx, cmpRegistry: any, outputTarget: d.OutputTarget) {
  if (outputTarget.type !== 'dist' || !config.buildEsm) {
    return Promise.resolve();
  }

  const esmImports: EsmImport[] = Object.keys(cmpRegistry).sort().map(tagName => {
    // const cmpMeta = cmpRegistry[tagName];
    const data = 'formatBrowserLoaderComponent(cmpMeta)';
    return {
      name: dashToPascalCase(tagName),
      data,
    };
  });

  const hosts: Promise<any>[] = [
    generateEsmLoader(config, compilerCtx, outputTarget),

    generateEsmHost(config, compilerCtx, outputTarget, 'es2017', esmImports),
  ];

  if (config.buildEs5) {
    hosts.push(
      generateEsmHost(config, compilerCtx, outputTarget, 'es5', esmImports)
    );
  }

  return Promise.all(hosts);
}

export function generateEsmHost(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist, sourceTarget: d.SourceTarget, esmImports: EsmImport[]) {
  return Promise.all([
    generateEsm(config, compilerCtx, outputTarget, sourceTarget, esmImports),
    generateDefineCustomElements(config, compilerCtx, outputTarget, sourceTarget),
  ]);
}

function generateDefineCustomElements(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist, sourceTarget: d.SourceTarget) {
  const componentsFileName = getComponentsEsmFileName(config);
  const c = `
// ${config.namespace}: Custom Elements Define Library, ES Module/${sourceTarget} Target

import { defineCustomElement } from './${getCoreEsmFileName(config)}';
import { COMPONENTS } from './${componentsFileName}';

export const defineCustomElements = (win, opts) => {
  return defineCustomElement(win, COMPONENTS, opts);
};
`;

  const defineFilePath = getDefineCustomElementsPath(config, outputTarget, sourceTarget);

  return compilerCtx.fs.writeFile(defineFilePath, c);
}

function generateEsm(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist, sourceTarget: d.SourceTarget, esmImports: EsmImport[]) {
  const VAR = sourceTarget === 'es5' ? 'var' : 'const';
  const indexContent = [
    `// ${config.namespace}: Host Data, ES Module/${sourceTarget} Target`,
    `export ${VAR} COMPONENTS = ${JSON.stringify(esmImports.map(({data}) => data))}`
  ].join('\n');

  const componentsEsmFilePath = getComponentsEsmBuildPath(config, outputTarget, sourceTarget);

  return compilerCtx.fs.writeFile(componentsEsmFilePath, indexContent);
}

function generateEsmLoader(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist) {
  const loaderPath = getLoaderEsmPath(config, outputTarget);
  const es5EntryPoint = getDefineCustomElementsPath(config, outputTarget, 'es5');
  const es2017EntryPoint = getDefineCustomElementsPath(config, outputTarget, 'es2017');

  const packageJsonContent = JSON.stringify({
    'name': 'loader',
    'typings': './index.d.ts',
    'module': './index.js',
    'es2017': './index.es2017.js'
  }, null, 2);

  const indexPath = config.buildEs5 ? es5EntryPoint : es2017EntryPoint;
  const indexDtsContent = generateIndexDts();
  const indexContent = `export * from '${normalizePath(config.sys.path.relative(loaderPath, indexPath))}';`;
  const indexES2017Content = `export * from '${normalizePath(config.sys.path.relative(loaderPath, es2017EntryPoint))}';`;

  return Promise.all([
    compilerCtx.fs.writeFile(config.sys.path.join(loaderPath, 'package.json'), packageJsonContent),
    compilerCtx.fs.writeFile(config.sys.path.join(loaderPath, 'index.d.ts'), indexDtsContent),
    compilerCtx.fs.writeFile(config.sys.path.join(loaderPath, 'index.js'), indexContent),
    compilerCtx.fs.writeFile(config.sys.path.join(loaderPath, 'index.es2017.js'), indexES2017Content)
  ]);
}


function patchCollection(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist) {
  // it's possible a d.ts file was exported from the index.ts file
  // which is fine, except that messes with any raw JS exports
  // in the collection/index.js
  // so let's just make this work by putting in empty js files
  // and call it a day
  const collectionInterfacePath = config.sys.path.join(outputTarget.collectionDir, 'interface.js');
  return compilerCtx.fs.writeFile(collectionInterfacePath, '');
}

function generateIndexDts() {
  return 'export declare function defineCustomElements(win: any, opts?: any): Promise<void>;';
}

interface EsmImport {
  name: string;
  data: any;
}
