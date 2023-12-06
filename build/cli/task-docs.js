import { isOutputTargetDocs } from '@utils';
import { startupCompilerLog } from './logs';
export const taskDocs = async (coreCompiler, config) => {
    config.devServer = {};
    config.outputTargets = config.outputTargets.filter(isOutputTargetDocs);
    config.devMode = true;
    startupCompilerLog(coreCompiler, config);
    const compiler = await coreCompiler.createCompiler(config);
    await compiler.build();
    await compiler.destroy();
};
//# sourceMappingURL=task-docs.js.map