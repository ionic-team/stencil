import { join } from '@utils';
import ts from 'typescript';
import { updateModule } from '../static-to-meta/parse-static';
export const parseCollectionComponents = (config, compilerCtx, buildCtx, collectionDir, collectionManifest, collection) => {
    if (collectionManifest.entries) {
        collectionManifest.entries.forEach((entryPath) => {
            const componentPath = join(collectionDir, entryPath);
            transpileCollectionModule(config, compilerCtx, buildCtx, collection, componentPath);
        });
    }
};
export const transpileCollectionModule = (config, compilerCtx, buildCtx, collection, inputFileName) => {
    const sourceText = compilerCtx.fs.readFileSync(inputFileName);
    const sourceFile = ts.createSourceFile(inputFileName, sourceText, ts.ScriptTarget.ES2017, true, ts.ScriptKind.JS);
    return updateModule(config, compilerCtx, buildCtx, sourceFile, sourceText, inputFileName, undefined, collection);
};
//# sourceMappingURL=parse-collection-components.js.map