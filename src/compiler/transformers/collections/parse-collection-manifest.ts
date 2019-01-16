import * as d from '../../../declarations';
import { getModule } from '../../build/compiler-ctx';
import { normalizePath } from '@stencil/core/utils';
import { parseCollectionComponents } from './parse-collection-components';


export function parseCollectionManifest(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, collectionName: string, collectionDir: string, collectionJsonStr: string) {
  const collectionManifest: d.CollectionManifest = JSON.parse(collectionJsonStr);

  const compilerVersion: d.CollectionCompilerVersion = collectionManifest.compiler || {} as any;

  const collection: d.CollectionCompilerMeta = {
    collectionName: collectionName,
    dependencies: parseCollectionDependencies(collectionManifest),
    compiler: {
      name: compilerVersion.name || '',
      version: compilerVersion.version || '',
      typescriptVersion: compilerVersion.typescriptVersion || ''
    },
    bundles: []
  };

  parseCollectionComponents(config, compilerCtx, buildCtx, collectionDir, collectionManifest, collection);
  parseGlobal(config, compilerCtx, collectionDir, collectionManifest, collection);
  parseBundles(collectionManifest, collection);

  return collection;
}


export function parseCollectionDependencies(collectionManifest: d.CollectionManifest) {
  const dependencies: string[] = [];

  if (Array.isArray(collectionManifest.collections)) {
    collectionManifest.collections.forEach(c => {
      dependencies.push(c.name);
    });
  }

  return dependencies;
}


export function parseGlobal(config: d.Config, compilerCtx: d.CompilerCtx, collectionDir: string, collectionManifest: d.CollectionManifest, collection: d.CollectionCompilerMeta) {
  if (typeof collectionManifest.global !== 'string') return;

  const sourceFilePath = normalizePath(config.sys.path.join(collectionDir, collectionManifest.global));

  collection.global = getModule(compilerCtx, sourceFilePath);
  collection.global.jsFilePath = normalizePath(config.sys.path.join(collectionDir, collectionManifest.global));
}


export function parseBundles(collectionManifest: d.CollectionManifest, collection: d.CollectionCompilerMeta) {
  if (invalidArrayData(collectionManifest.bundles)) {
    collection.bundles = [];
    return;
  }

  collection.bundles = collectionManifest.bundles.map(b => {
    return {
      components: b.components.slice().sort()
    };
  });
}


function invalidArrayData(arr: any[]) {
  return (!arr || !Array.isArray(arr) || arr.length === 0);
}
