import { join, normalizePath } from '@utils';
import { parseCollectionComponents, transpileCollectionModule } from './parse-collection-components';
export const parseCollectionManifest = (config, compilerCtx, buildCtx, collectionName, collectionDir, collectionJsonStr) => {
    const collectionManifest = JSON.parse(collectionJsonStr);
    const compilerVersion = collectionManifest.compiler || {};
    const collection = {
        collectionName: collectionName,
        moduleId: collectionName,
        moduleDir: collectionDir,
        moduleFiles: [],
        dependencies: parseCollectionDependencies(collectionManifest),
        compiler: {
            name: compilerVersion.name || '',
            version: compilerVersion.version || '',
            typescriptVersion: compilerVersion.typescriptVersion || '',
        },
        bundles: parseBundles(collectionManifest),
    };
    parseGlobal(config, compilerCtx, buildCtx, collectionDir, collectionManifest, collection);
    parseCollectionComponents(config, compilerCtx, buildCtx, collectionDir, collectionManifest, collection);
    return collection;
};
export const parseCollectionDependencies = (collectionManifest) => {
    return (collectionManifest.collections || []).map((c) => c.name);
};
export const parseGlobal = (config, compilerCtx, buildCtx, collectionDir, collectionManifest, collection) => {
    if (typeof collectionManifest.global !== 'string') {
        return;
    }
    const sourceFilePath = normalizePath(join(collectionDir, collectionManifest.global));
    const globalModule = transpileCollectionModule(config, compilerCtx, buildCtx, collection, sourceFilePath);
    collection.global = globalModule;
};
export const parseBundles = (collectionManifest) => {
    if (invalidArrayData(collectionManifest.bundles)) {
        return [];
    }
    return collectionManifest.bundles.map((b) => {
        return {
            components: b.components.slice().sort(),
        };
    });
};
const invalidArrayData = (arr) => {
    return !arr || !Array.isArray(arr) || arr.length === 0;
};
//# sourceMappingURL=parse-collection-manifest.js.map