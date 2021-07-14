import fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';

import { uuidv4 } from './telemetry/helpers';

const CONFIG_FILE = 'config.json';
export const DEFAULT_CONFIG_DIRECTORY = path.resolve(os.homedir(), '.ionic', CONFIG_FILE);

export interface TelemetryConfig {
	"telemetry.stencil"?: boolean,
	"tokens.telemetry"?: string,
}

export async function readConfig(): Promise<TelemetryConfig> {
	try {
		
		return await fs.readJson(DEFAULT_CONFIG_DIRECTORY);
	} catch (e) {
		if (e.code !== 'ENOENT') {
			throw e;
		}

		const config: TelemetryConfig = {
			"tokens.telemetry": uuidv4(),
			"telemetry.stencil": true,
		};

		await writeConfig(config);

		return config;
	}
}

export async function writeConfig(config: TelemetryConfig): Promise<void> {
	await fs.mkdirp(path.dirname(DEFAULT_CONFIG_DIRECTORY)).then(async () => {
		return await fs.writeJSON(DEFAULT_CONFIG_DIRECTORY, config, { spaces: '\t' });
	}).catch(() => {
		console.debug(`Couldn't write to ${DEFAULT_CONFIG_DIRECTORY}. `)
	});
}

export async function updateConfig(newOptions: TelemetryConfig): Promise<void> {
	const config = await readConfig();
	await writeConfig(Object.assign(config, newOptions));
}