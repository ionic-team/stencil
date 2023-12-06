import { createNodeLogger } from '@sys-api-node';
import { createConfigFlags } from '../../cli/config-flags';
import { validateConfig } from '../config/validate-config';
/**
 * Given a user-supplied config, get a validated config which can be used to
 * start building a Stencil project.
 *
 * @param userConfig a configuration object
 * @returns a validated config object with stricter typing
 */
export const getConfig = (userConfig) => {
    var _a, _b;
    userConfig.logger = (_a = userConfig.logger) !== null && _a !== void 0 ? _a : createNodeLogger();
    const flags = createConfigFlags((_b = userConfig.flags) !== null && _b !== void 0 ? _b : {});
    userConfig.flags = flags;
    const config = validateConfig(userConfig, {}).config;
    return config;
};
//# sourceMappingURL=config.js.map