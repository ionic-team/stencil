import { isOutputTargetHydrate, WWW } from '@utils';
import { readConfig, updateConfig, writeConfig } from '../ionic-config';
import { hasDebug, hasVerbose, readJson, tryFn, uuidv4 } from './helpers';
import { shouldTrack } from './shouldTrack';
/**
 * Used to within taskBuild to provide the component_count property.
 *
 * @param sys The system where the command is invoked
 * @param config The config passed into the Stencil command
 * @param coreCompiler The compiler used to do builds
 * @param result The results of a compiler build.
 */
export async function telemetryBuildFinishedAction(sys, config, coreCompiler, result) {
    const tracking = await shouldTrack(config, sys, !!config.flags.ci);
    if (!tracking) {
        return;
    }
    const component_count = result.componentGraph ? Object.keys(result.componentGraph).length : undefined;
    const data = await prepareData(coreCompiler, config, sys, result.duration, component_count);
    await sendMetric(sys, config, 'stencil_cli_command', data);
    config.logger.debug(`${config.logger.blue('Telemetry')}: ${config.logger.gray(JSON.stringify(data))}`);
}
/**
 * A function to wrap a compiler task function around. Will send telemetry if, and only if, the machine allows.
 *
 * @param sys The system where the command is invoked
 * @param config The config passed into the Stencil command
 * @param coreCompiler The compiler used to do builds
 * @param action A Promise-based function to call in order to get the duration of any given command.
 * @returns void
 */
export async function telemetryAction(sys, config, coreCompiler, action) {
    const tracking = await shouldTrack(config, sys, !!config.flags.ci);
    let duration = undefined;
    let error;
    if (action) {
        const start = new Date();
        try {
            await action();
        }
        catch (e) {
            error = e;
        }
        const end = new Date();
        duration = end.getTime() - start.getTime();
    }
    // We'll get componentCount details inside the taskBuild, so let's not send two messages.
    if (!tracking || (config.flags.task == 'build' && !config.flags.args.includes('--watch'))) {
        return;
    }
    const data = await prepareData(coreCompiler, config, sys, duration);
    await sendMetric(sys, config, 'stencil_cli_command', data);
    config.logger.debug(`${config.logger.blue('Telemetry')}: ${config.logger.gray(JSON.stringify(data))}`);
    if (error) {
        throw error;
    }
}
/**
 * Helper function to determine if a Stencil configuration builds an application.
 *
 * This function is a rough approximation whether an application is generated as a part of a Stencil build, based on
 * contents of the project's `stencil.config.ts` file.
 *
 * @param config the configuration used by the Stencil project
 * @returns true if we believe the project generates an application, false otherwise
 */
export function hasAppTarget(config) {
    return config.outputTargets.some((target) => target.type === WWW && (!!target.serviceWorker || (!!target.baseUrl && target.baseUrl !== '/')));
}
export function isUsingYarn(sys) {
    var _a;
    return ((_a = sys.getEnvironmentVar('npm_execpath')) === null || _a === void 0 ? void 0 : _a.includes('yarn')) || false;
}
/**
 * Build a list of the different types of output targets used in a Stencil configuration.
 *
 * Duplicate entries will not be returned from the list
 *
 * @param config the configuration used by the Stencil project
 * @returns a unique list of output target types found in the Stencil configuration
 */
export function getActiveTargets(config) {
    const result = config.outputTargets.map((t) => t.type);
    return Array.from(new Set(result));
}
/**
 * Prepare data for telemetry
 *
 * @param coreCompiler the core compiler
 * @param config the current Stencil config
 * @param sys the compiler system instance in use
 * @param duration_ms the duration of the action being tracked
 * @param component_count the number of components being built (optional)
 * @returns a Promise wrapping data for the telemetry endpoint
 */
export const prepareData = async (coreCompiler, config, sys, duration_ms, component_count = undefined) => {
    var _a, _b, _c;
    const { typescript, rollup } = coreCompiler.versions || { typescript: 'unknown', rollup: 'unknown' };
    const { packages, packagesNoVersions } = await getInstalledPackages(sys, config);
    const targets = getActiveTargets(config);
    const yarn = isUsingYarn(sys);
    const stencil = coreCompiler.version || 'unknown';
    const system = `${sys.name} ${sys.version}`;
    const os_name = (_a = sys.details) === null || _a === void 0 ? void 0 : _a.platform;
    const os_version = (_b = sys.details) === null || _b === void 0 ? void 0 : _b.release;
    const cpu_model = (_c = sys.details) === null || _c === void 0 ? void 0 : _c.cpuModel;
    const build = coreCompiler.buildId || 'unknown';
    const has_app_pwa_config = hasAppTarget(config);
    const anonymizedConfig = anonymizeConfigForTelemetry(config);
    return {
        arguments: config.flags.args,
        build,
        component_count,
        config: anonymizedConfig,
        cpu_model,
        duration_ms,
        has_app_pwa_config,
        os_name,
        os_version,
        packages,
        packages_no_versions: packagesNoVersions,
        rollup,
        stencil,
        system,
        system_major: getMajorVersion(system),
        targets,
        task: config.flags.task,
        typescript,
        yarn,
    };
};
// props in output targets for which we retain their original values when
// preparing a config for telemetry
//
// we omit the values of all other fields on output targets.
const OUTPUT_TARGET_KEYS_TO_KEEP = ['type'];
// top-level config props that we anonymize for telemetry
const CONFIG_PROPS_TO_ANONYMIZE = [
    'rootDir',
    'fsNamespace',
    'packageJsonFilePath',
    'namespace',
    'srcDir',
    'srcIndexHtml',
    'buildLogFilePath',
    'cacheDir',
    'configPath',
    'tsconfig',
];
// Props we delete entirely from the config for telemetry
//
// TODO(STENCIL-469): Investigate improving anonymization for tsCompilerOptions and devServer
const CONFIG_PROPS_TO_DELETE = [
    'commonjs',
    'devServer',
    'env',
    'logger',
    'rollupConfig',
    'sys',
    'testing',
    'tsCompilerOptions',
];
/**
 * Anonymize the config for telemetry, replacing potentially revealing config props
 * with a placeholder string if they are present (this lets us still track how frequently
 * these config options are being used)
 *
 * @param config the config to anonymize
 * @returns an anonymized copy of the same config
 */
export const anonymizeConfigForTelemetry = (config) => {
    const anonymizedConfig = { ...config };
    for (const prop of CONFIG_PROPS_TO_ANONYMIZE) {
        if (anonymizedConfig[prop] !== undefined) {
            anonymizedConfig[prop] = 'omitted';
        }
    }
    anonymizedConfig.outputTargets = config.outputTargets.map((target) => {
        // Anonymize the outputTargets on our configuration, taking advantage of the
        // optional 2nd argument to `JSON.stringify`. If anything is not a string
        // we retain it so that any nested properties are handled, else we check
        // whether it's in our 'keep' list to decide whether to keep it or replace it
        // with `"omitted"`.
        const anonymizedOT = JSON.parse(JSON.stringify(target, (key, value) => {
            if (!(typeof value === 'string')) {
                return value;
            }
            if (OUTPUT_TARGET_KEYS_TO_KEEP.includes(key)) {
                return value;
            }
            return 'omitted';
        }));
        // this prop has to be handled separately because it is an array
        // so the replace function above will be called with all of its
        // members, giving us `["omitted", "omitted", ...]`.
        //
        // Instead, we check for its presence and manually copy over.
        if (isOutputTargetHydrate(target) && target.external) {
            anonymizedOT['external'] = target.external.concat();
        }
        return anonymizedOT;
    });
    // TODO(STENCIL-469): Investigate improving anonymization for tsCompilerOptions and devServer
    for (const prop of CONFIG_PROPS_TO_DELETE) {
        delete anonymizedConfig[prop];
    }
    return anonymizedConfig;
};
/**
 * Reads package-lock.json, yarn.lock, and package.json files in order to cross-reference
 * the dependencies and devDependencies properties. Pulls up the current installed version
 * of each package under the @stencil, @ionic, and @capacitor scopes.
 *
 * @param sys the system instance where telemetry is invoked
 * @param config the Stencil configuration associated with the current task that triggered telemetry
 * @returns an object listing all dev and production dependencies under the aforementioned scopes
 */
async function getInstalledPackages(sys, config) {
    let packages = [];
    let packagesNoVersions = [];
    const yarn = isUsingYarn(sys);
    try {
        // Read package.json and package-lock.json
        const appRootDir = sys.getCurrentDirectory();
        const packageJson = await tryFn(readJson, sys, sys.resolvePath(appRootDir + '/package.json'));
        // They don't have a package.json for some reason? Eject button.
        if (!packageJson) {
            return { packages, packagesNoVersions };
        }
        const rawPackages = Object.entries({
            ...packageJson.devDependencies,
            ...packageJson.dependencies,
        });
        // Collect packages only in the stencil, ionic, or capacitor org's:
        // https://www.npmjs.com/org/stencil
        const ionicPackages = rawPackages.filter(([k]) => k.startsWith('@stencil/') || k.startsWith('@ionic/') || k.startsWith('@capacitor/'));
        try {
            packages = yarn ? await yarnPackages(sys, ionicPackages) : await npmPackages(sys, ionicPackages);
        }
        catch (e) {
            packages = ionicPackages.map(([k, v]) => `${k}@${v.replace('^', '')}`);
        }
        packagesNoVersions = ionicPackages.map(([k]) => `${k}`);
        return { packages, packagesNoVersions };
    }
    catch (err) {
        hasDebug(config.flags) && console.error(err);
        return { packages, packagesNoVersions };
    }
}
/**
 * Visits the npm lock file to find the exact versions that are installed
 * @param sys The system where the command is invoked
 * @param ionicPackages a list of the found packages matching `@stencil`, `@capacitor`, or `@ionic` from the package.json file.
 * @returns an array of strings of all the packages and their versions.
 */
async function npmPackages(sys, ionicPackages) {
    const appRootDir = sys.getCurrentDirectory();
    const packageLockJson = await tryFn(readJson, sys, sys.resolvePath(appRootDir + '/package-lock.json'));
    return ionicPackages.map(([k, v]) => {
        var _a, _b, _c, _d;
        let version = (_d = (_b = (_a = packageLockJson === null || packageLockJson === void 0 ? void 0 : packageLockJson.dependencies[k]) === null || _a === void 0 ? void 0 : _a.version) !== null && _b !== void 0 ? _b : (_c = packageLockJson === null || packageLockJson === void 0 ? void 0 : packageLockJson.devDependencies[k]) === null || _c === void 0 ? void 0 : _c.version) !== null && _d !== void 0 ? _d : v;
        version = version.includes('file:') ? sanitizeDeclaredVersion(v) : version;
        return `${k}@${version}`;
    });
}
/**
 * Visits the yarn lock file to find the exact versions that are installed
 * @param sys The system where the command is invoked
 * @param ionicPackages a list of the found packages matching `@stencil`, `@capacitor`, or `@ionic` from the package.json file.
 * @returns an array of strings of all the packages and their versions.
 */
async function yarnPackages(sys, ionicPackages) {
    const appRootDir = sys.getCurrentDirectory();
    const yarnLock = sys.readFileSync(sys.resolvePath(appRootDir + '/yarn.lock'));
    const yarnLockYml = sys.parseYarnLockFile(yarnLock);
    return ionicPackages.map(([k, v]) => {
        var _a;
        const identifiedVersion = `${k}@${v}`;
        let version = (_a = yarnLockYml.object[identifiedVersion]) === null || _a === void 0 ? void 0 : _a.version;
        version = version.includes('undefined') ? sanitizeDeclaredVersion(identifiedVersion) : version;
        return `${k}@${version}`;
    });
}
/**
 * This function is used for fallback purposes, where an npm or yarn lock file doesn't exist in the consumers directory.
 * This will strip away '*', '^' and '~' from the declared package versions in a package.json.
 * @param version the raw semver pattern identifier version string
 * @returns a cleaned up representation without any qualifiers
 */
function sanitizeDeclaredVersion(version) {
    return version.replace(/[*^~]/g, '');
}
/**
 * If telemetry is enabled, send a metric to an external data store
 *
 * @param sys the system instance where telemetry is invoked
 * @param config the Stencil configuration associated with the current task that triggered telemetry
 * @param name the name of a trackable metric. Note this name is not necessarily a scalar value to track, like
 * "Stencil Version". For example, "stencil_cli_command" is a name that is used to track all CLI command information.
 * @param value the data to send to the external data store under the provided name argument
 */
export async function sendMetric(sys, config, name, value) {
    const session_id = await getTelemetryToken(sys);
    const message = {
        name,
        timestamp: new Date().toISOString(),
        source: 'stencil_cli',
        value,
        session_id,
    };
    await sendTelemetry(sys, config, message);
}
/**
 * Used to read the config file's tokens.telemetry property.
 *
 * @param sys The system where the command is invoked
 * @returns string
 */
async function getTelemetryToken(sys) {
    const config = await readConfig(sys);
    if (config['tokens.telemetry'] === undefined) {
        config['tokens.telemetry'] = uuidv4();
        await writeConfig(sys, config);
    }
    return config['tokens.telemetry'];
}
/**
 * Issues a request to the telemetry server.
 * @param sys The system where the command is invoked
 * @param config The config passed into the Stencil command
 * @param data Data to be tracked
 */
async function sendTelemetry(sys, config, data) {
    try {
        const now = new Date().toISOString();
        const body = {
            metrics: [data],
            sent_at: now,
        };
        // This request is only made if telemetry is on.
        const response = await sys.fetch('https://api.ionicjs.com/events/metrics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        hasVerbose(config.flags) &&
            console.debug('\nSent %O metric to events service (status: %O)', data.name, response.status, '\n');
        if (response.status !== 204) {
            hasVerbose(config.flags) &&
                console.debug('\nBad response from events service. Request body: %O', response.body.toString(), '\n');
        }
    }
    catch (e) {
        hasVerbose(config.flags) && console.debug('Telemetry request failed:', e);
    }
}
/**
 * Checks if telemetry is enabled on this machine
 * @param sys The system where the command is invoked
 * @returns true if telemetry is enabled, false otherwise
 */
export async function checkTelemetry(sys) {
    const config = await readConfig(sys);
    if (config['telemetry.stencil'] === undefined) {
        config['telemetry.stencil'] = true;
        await writeConfig(sys, config);
    }
    return config['telemetry.stencil'];
}
/**
 * Writes to the config file, enabling telemetry for this machine.
 * @param sys The system where the command is invoked
 * @returns true if writing the file was successful, false otherwise
 */
export async function enableTelemetry(sys) {
    return await updateConfig(sys, { 'telemetry.stencil': true });
}
/**
 * Writes to the config file, disabling telemetry for this machine.
 * @param sys The system where the command is invoked
 * @returns true if writing the file was successful, false otherwise
 */
export async function disableTelemetry(sys) {
    return await updateConfig(sys, { 'telemetry.stencil': false });
}
/**
 * Takes in a semver string in order to return the major version.
 * @param version The fully qualified semver version
 * @returns a string of the major version
 */
function getMajorVersion(version) {
    const parts = version.split('.');
    return parts[0];
}
//# sourceMappingURL=telemetry.js.map