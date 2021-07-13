import { send } from './ipc';
import { tryFn, isInteractive } from './helpers';
import { CompilerSystem, Config, Logger, PackageJsonData } from 'src/declarations';
import { parseFlags } from '../parse-flags';
import { loadCoreCompiler } from '../load-compiler';
import { readJson } from '@ionic/utils-fs';
import { resolve } from 'path';
import { readConfig, updateConfig } from '../ionic-config';
import { isObject } from '@utils';

export interface CommandMetricData {
	// app_id: string;
	command: string;
	arguments: string;
	options: string;
	duration: number;
	error: string | null;
	node_version: string;
	// os: string;
}

export interface Metric<N extends string, D> {
	name: N;
	timestamp: string;
	source: 'stencil_cli';
	value: D;
}

// Used for deeper understanding on how people are using certain output targets
interface OutputTargetOptions {
	serviceWorker?: boolean;
}

type TelemetryCallback = (...args: any[]) => void | Promise<void>;

export interface TrackableData {
	command?: string;
	token?: string;
	arguments?: string[];
	targets?: string[][] | OutputTargetOptions[][];
	task?: string;
	duration?: number;
	packages?: string[][];
	telemetry?: boolean;
	ci?: boolean;
	platform: string;
	typescript: string;
	rollup: string;
	compiler: string;
	system: string;
	build: string;
	stencil: string;
}

export interface telemetryActionArgs {
	args?: string[],
	sys?: CompilerSystem,
	logger?: Logger,
	config?: Config,
	action?: TelemetryCallback
}

export async function telemetryAction(options: telemetryActionArgs) {
	const { args, sys, logger, config, action } = options;
	const coreCompiler = await loadCoreCompiler(sys);
	const details = sys.details;
	const versions = coreCompiler.versions;
	const flags = parseFlags(args, sys);
	let duration = undefined;
	let error: any;

	if (action) {
		const start = new Date();

		try {
			await action();
		} catch (e) {
			error = e;
		}

		const end = new Date();
		duration = end.getTime() - start.getTime();
	}
	
	const token = await getTelemetryToken();
	const packages = await getInstalledPackages();
	const targets = await getActiveTargets(config);

	const data: TrackableData = {
		token,
		duration,
		targets,
		packages: packages || [],
		arguments: flags.args,
		ci: !!flags.ci,
		task: flags.task,
		stencil: coreCompiler.version,
		system: `${sys.name} ${sys.version}`,
		platform: `${details.platform} (${details.release})`,
		compiler: sys.getCompilerExecutingPath(),
		build: coreCompiler.buildId,
		typescript: versions.typescript,
		rollup: versions.rollup
	};

	if (await shouldTrack(data.ci)) {
		await sendMetric('stencil_cli_command', data);
		logger.debug(`${logger.blue('Telemetry')}: ${logger.gray(JSON.stringify(data))}`)
	}

	if (error) {
		throw error;
	}
}

async function getActiveTargets(config: Config): Promise<string[][] | OutputTargetOptions[][]> {
	return (config.outputTargets as any[]).map(target => {
		let outputTargetSettings: OutputTargetOptions = {};

		if (target.type === "www") {
			outputTargetSettings.serviceWorker = isObject(target?.serviceWorker)
		}

		return [target.type, outputTargetSettings]
	});
}

async function getInstalledPackages() {
	// Read package.json
	const appRootDir = process.cwd();
	const packageJson: PackageJsonData = (await tryFn(readJson, resolve(appRootDir, 'package.json')));

	const packages = Object.entries({
		...packageJson.devDependencies,
		...packageJson.dependencies,
	});

	// Collect packages only in the stencil, ionic, or capacitor org's:
	// https://www.npmjs.com/org/stencil
	const stencilPackages = packages.filter(([k]) =>
		k.startsWith('@stencil/') || k.startsWith('@ionic/') || k.startsWith('@capacitor/'),
	);

	const versions = stencilPackages.map(([k, v]) => [
		`${k}`,
		v as string,
	]);

	return versions;
}

export async function shouldTrack(ci: boolean) { return await checkTelemetry() && !ci && isInteractive() }

export async function getTelemetryToken() {
	const config = await readConfig();
	return config["tokens.telemetry"];
}

export async function checkTelemetry() {
	const config = await readConfig();
	return config["telemetry.stencil"];
}

export async function enableTelemetry() {
	await updateConfig({ "telemetry.stencil": true });
}

export async function disableTelemetry() {
	await updateConfig({ "telemetry.stencil": false });
}

/**
 * If telemetry is enabled, send a metric via IPC to a forked process for uploading.
 */
export async function sendMetric<D>(
	name: string,
	data: D,
): Promise<void> {
	const message: Metric<string, D> = {
		name,
		timestamp: new Date().toISOString(),
		source: 'stencil_cli',
		value: data,
	};

	await send({ type: 'telemetry', data: message });
}

/**
 * Walk through the command's parent tree and construct a space-separated name.
 *
 * Probably overkill because we don't have nested commands, but whatever.
 */
// function getFullCommandName(cmd: Command): string {
// 	const names: string[] = [];

// 	while (cmd.parent !== null) {
// 		names.push(cmd.name());
// 		cmd = cmd.parent;
// 	}

// 	return names.reverse().join(' ');
// }