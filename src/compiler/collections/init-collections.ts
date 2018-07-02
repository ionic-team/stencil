import { BuildCtx, CompilerCtx, Config } from '../../declarations';
import { upgradeCollection } from './upgrade-collection';


export async function initCollections(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx) {
  const uninitialized = compilerCtx.collections.filter(c => !c.isInitialized);

  await Promise.all(uninitialized.map(async collection => {
    // Look at all dependent components from outside collections and
    // upgrade the components to be compatible with this version if need be
    await upgradeCollection(config, compilerCtx, buildCtx, collection);

    collection.isInitialized = true;
  }));
}
