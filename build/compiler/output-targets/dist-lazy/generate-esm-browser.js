import { generatePreamble } from '@utils';
import { generateRollupOutput } from '../../app-core/bundle-app-core';
import { generateLazyModules } from './generate-lazy-module';
export const generateEsmBrowser = async (config, compilerCtx, buildCtx, rollupBuild, outputTargets) => {
    const esmOutputs = outputTargets.filter((o) => !!o.esmDir && !!o.isBrowserBuild);
    if (esmOutputs.length) {
        const outputTargetType = esmOutputs[0].type;
        const esmOpts = {
            banner: generatePreamble(config),
            format: 'es',
            entryFileNames: '[name].esm.js',
            chunkFileNames: config.hashFileNames ? 'p-[hash].js' : '[name]-[hash].js',
            assetFileNames: config.hashFileNames ? 'p-[hash][extname]' : '[name]-[hash][extname]',
            preferConst: true,
            sourcemap: config.sourceMap,
        };
        const output = await generateRollupOutput(rollupBuild, esmOpts, config, buildCtx.entryModules);
        if (output != null) {
            const es2017destinations = esmOutputs
                .map((o) => o.esmDir)
                .filter((esmDir) => typeof esmDir === 'string');
            buildCtx.esmBrowserComponentBundle = await generateLazyModules(config, compilerCtx, buildCtx, outputTargetType, es2017destinations, output, 'es2017', true, '');
        }
    }
    return { name: 'esm-browser', buildCtx };
};
//# sourceMappingURL=generate-esm-browser.js.map