import * as d from '../../../declarations';
import { normalizePath } from '../../util';
import { parseCollectionComponents } from './parse-collection-components';


export function parseCollectionManifest(config: d.Config, compilerCtx: d.CompilerCtx, collectionName: string, collectionDir: string, collectionJsonStr: string) {
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

  parseCollectionComponents(config, compilerCtx, collectionDir, collectionManifest, collection);
  parseGlobal(config, collectionDir, collectionManifest, collection);
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


export function parseGlobal(config: d.Config, collectionDir: string, collectionManifest: d.CollectionManifest, collection: d.CollectionCompilerMeta) {
  if (typeof collectionManifest.global !== 'string') return;

  collection.global = {
    sourceFilePath: normalizePath(config.sys.path.join(collectionDir, collectionManifest.global)),
    jsFilePath: normalizePath(config.sys.path.join(collectionDir, collectionManifest.global)),
    localImports: [],
    externalImports: [],
    potentialCmpRefs: []
  };
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
