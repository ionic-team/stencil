import { isString } from '@utils';
import { nodeRequire } from '../sys/node-require';
export const getPrerenderConfig = (diagnostics, prerenderConfigPath) => {
    const prerenderConfig = {};
    if (isString(prerenderConfigPath)) {
        const results = nodeRequire(prerenderConfigPath);
        diagnostics.push(...results.diagnostics);
        if (results.module != null && typeof results.module === 'object') {
            if (results.module.config != null && typeof results.module.config === 'object') {
                Object.assign(prerenderConfig, results.module.config);
            }
            else {
                Object.assign(prerenderConfig, results.module);
            }
        }
    }
    return prerenderConfig;
};
//# sourceMappingURL=prerender-config.js.map