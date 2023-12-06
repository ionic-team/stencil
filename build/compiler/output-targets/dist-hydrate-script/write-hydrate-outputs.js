import { join } from '@utils';
import { basename } from 'path';
import { relocateHydrateContextConst } from './relocate-hydrate-context';
export const writeHydrateOutputs = (config, compilerCtx, buildCtx, outputTargets, rollupOutput) => {
    return Promise.all(outputTargets.map((outputTarget) => {
        return writeHydrateOutput(config, compilerCtx, buildCtx, outputTarget, rollupOutput);
    }));
};
const writeHydrateOutput = async (config, compilerCtx, buildCtx, outputTarget, rollupOutput) => {
    const hydratePackageName = await getHydratePackageName(config, compilerCtx);
    const hydrateAppDirPath = outputTarget.dir;
    const hydrateCoreIndexPath = join(hydrateAppDirPath, 'index.js');
    const hydrateCoreIndexDtsFilePath = join(hydrateAppDirPath, 'index.d.ts');
    const pkgJsonPath = join(hydrateAppDirPath, 'package.json');
    const pkgJsonCode = getHydratePackageJson(config, hydrateCoreIndexPath, hydrateCoreIndexDtsFilePath, hydratePackageName);
    await Promise.all([
        copyHydrateRunnerDts(config, compilerCtx, hydrateAppDirPath),
        compilerCtx.fs.writeFile(pkgJsonPath, pkgJsonCode),
    ]);
    // always remember a path to the hydrate app that the prerendering may need later on
    buildCtx.hydrateAppFilePath = hydrateCoreIndexPath;
    await Promise.all(rollupOutput.output.map(async (output) => {
        if (output.type === 'chunk') {
            output.code = relocateHydrateContextConst(config, compilerCtx, output.code);
            const filePath = join(hydrateAppDirPath, output.fileName);
            await compilerCtx.fs.writeFile(filePath, output.code, { immediateWrite: true });
        }
    }));
};
const getHydratePackageJson = (config, hydrateAppFilePath, hydrateDtsFilePath, hydratePackageName) => {
    const pkg = {
        name: hydratePackageName,
        description: `${config.namespace} component hydration app.`,
        main: basename(hydrateAppFilePath),
        types: basename(hydrateDtsFilePath),
    };
    return JSON.stringify(pkg, null, 2);
};
const getHydratePackageName = async (config, compilerCtx) => {
    try {
        const rootPkgFilePath = join(config.rootDir, 'package.json');
        const pkgStr = await compilerCtx.fs.readFile(rootPkgFilePath);
        const pkgData = JSON.parse(pkgStr);
        return `${pkgData.name}/hydrate`;
    }
    catch (e) { }
    return `${config.fsNamespace}/hydrate`;
};
const copyHydrateRunnerDts = async (config, compilerCtx, hydrateAppDirPath) => {
    const packageDir = join(config.sys.getCompilerExecutingPath(), '..', '..');
    const srcHydrateDir = join(packageDir, 'internal', 'hydrate', 'runner.d.ts');
    const runnerDtsDestPath = join(hydrateAppDirPath, 'index.d.ts');
    await compilerCtx.fs.copyFile(srcHydrateDir, runnerDtsDestPath);
};
//# sourceMappingURL=write-hydrate-outputs.js.map