import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import { readJson, uuidv4 } from './telemetry/helpers';

const CONFIG_FILE = 'config.json';
export const DEFAULT_CONFIG_DIRECTORY = path.resolve(os.homedir(), '.ionic', CONFIG_FILE);

export interface TelemetryConfig {
	"telemetry.stencil"?: boolean,
	"tokens.telemetry"?: string,
}

export async function readConfig(): Promise<TelemetryConfig> {
	try {
		return await readJson(DEFAULT_CONFIG_DIRECTORY);
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
	try {
		await fs.promises.mkdir(path.dirname(DEFAULT_CONFIG_DIRECTORY), { recursive: true });
		await fs.promises.writeFile(DEFAULT_CONFIG_DIRECTORY, JSON.stringify(config))
	} catch (error) {
		console.error(`Stencil Telemetry: couldn't write configuration file to ${DEFAULT_CONFIG_DIRECTORY} - ${error}.`)
	};
}

export async function updateConfig(newOptions: TelemetryConfig): Promise<void> {
	const config = await readConfig();
	await writeConfig(Object.assign(config, newOptions));
}
