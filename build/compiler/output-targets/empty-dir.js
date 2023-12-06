import { isOutputTargetDist, isOutputTargetDistCustomElements, isOutputTargetDistLazy, isOutputTargetDistLazyLoader, isOutputTargetHydrate, isOutputTargetWww, isString, } from '@utils';
const isEmptable = (o) => isOutputTargetDist(o) ||
    isOutputTargetDistCustomElements(o) ||
    isOutputTargetWww(o) ||
    isOutputTargetDistLazy(o) ||
    isOutputTargetDistLazyLoader(o) ||
    isOutputTargetHydrate(o);
export const emptyOutputTargets = async (config, compilerCtx, buildCtx) => {
    if (buildCtx.isRebuild) {
        return;
    }
    const cleanDirs = config.outputTargets
        .filter(isEmptable)
        .filter((o) => o.empty === true)
        .map((o) => o.dir || o.esmDir)
        .filter(isString);
    if (cleanDirs.length === 0) {
        return;
    }
    const timeSpan = buildCtx.createTimeSpan(`cleaning ${cleanDirs.length} dirs`, true);
    await compilerCtx.fs.emptyDirs(cleanDirs);
    timeSpan.finish('cleaning dirs finished');
};
//# sourceMappingURL=empty-dir.js.map