import { getSourceMappingUrlForEndOfFile, join } from '@utils';
export const writeLazyModule = async (config, compilerCtx, outputTargetType, destinations, entryModule, shouldHash, code, sourceMap, sufix) => {
    // code = replaceStylePlaceholders(entryModule.cmps, modeName, code);
    const bundleId = await getBundleId(config, entryModule.entryKey, shouldHash, code, sufix);
    const fileName = `${bundleId}.entry.js`;
    if (sourceMap) {
        code = code + getSourceMappingUrlForEndOfFile(fileName);
    }
    await Promise.all(destinations.map((dst) => {
        compilerCtx.fs.writeFile(join(dst, fileName), code, { outputTargetType });
        if (!!sourceMap) {
            compilerCtx.fs.writeFile(join(dst, fileName) + '.map', JSON.stringify(sourceMap), { outputTargetType });
        }
    }));
    return {
        bundleId,
        fileName,
        code,
    };
};
const getBundleId = async (config, entryKey, shouldHash, code, sufix) => {
    if (shouldHash) {
        const hash = await config.sys.generateContentHash(code, config.hashedFileNameLength);
        return `p-${hash}${sufix}`;
    }
    const components = entryKey.split('.');
    let bundleId = components[0];
    if (components.length > 2) {
        bundleId = `${bundleId}_${components.length - 1}`;
    }
    return bundleId + sufix;
};
//# sourceMappingURL=write-lazy-entry-module.js.map