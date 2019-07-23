import * as d from '../../../declarations';
import { getModule } from '../../build/compiler-ctx';
import { normalizePath } from '@utils';
import { parseCollectionComponents } from './parse-collection-components';


export const parseCollectionManifest = (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, collectionName: string, collectionDir: string, collectionJsonStr: string) => {
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
    bundles: parseBundles(collectionManifest),
    global: parseGlobal(config, compilerCtx, collectionDir, collectionManifest)
  };

  parseCollectionComponents(config, compilerCtx, buildCtx, collectionDir, collectionManifest, collection);

  return collection;
};


export const parseCollectionDependencies = (collectionManifest: d.CollectionManifest) => {
  return (collectionManifest.collections || []).map(c => c.name);
};


export const parseGlobal = (config: d.Config, compilerCtx: d.CompilerCtx, collectionDir: string, collectionManifest: d.CollectionManifest) => {
  if (typeof collectionManifest.global !== 'string') {
    return undefined;
  }

  const sourceFilePath = normalizePath(config.sys.path.join(collectionDir, collectionManifest.global));

  const globalModule = getModule(config, compilerCtx, sourceFilePath);
  globalModule.jsFilePath = normalizePath(config.sys.path.join(collectionDir, collectionManifest.global));
  return globalModule;
};


export const parseBundles = (collectionManifest: d.CollectionManifest) => {
  if (invalidArrayData(collectionManifest.bundles)) {
    return [];
  }

  return collectionManifest.bundles.map(b => {
    return {
      components: b.components.slice().sort()
    };
  });
};


const invalidArrayData = (arr: any[]) => {
  return (!arr || !Array.isArray(arr) || arr.length === 0);
};
