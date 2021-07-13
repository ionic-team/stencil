import { readJSON, writeJSON, mkdirp } from '@ionic/utils-fs';

import * as os from 'os';
import * as path from 'path';

import { uuidv4 } from './telemetry/helpers';

export const CONFIG_FILE = 'config.json';
export const DEFAULT_CONFIG_DIRECTORY = path.resolve(os.homedir(), '.ionic', CONFIG_FILE);

export interface SystemConfig {
	"telemetry"?: boolean,
	"telemetry.stencil"?: boolean,
	"tokens.telemetry"?: string,
}

export async function readConfig(): Promise<SystemConfig> {
	try {
		return await readJSON(DEFAULT_CONFIG_DIRECTORY);
	} catch (e) {
		if (e.code !== 'ENOENT') {
			throw e;
		}

		const config: SystemConfig = {
			"tokens.telemetry": uuidv4(),
			"telemetry": true,
			"telemetry.stencil": true,
		};

		await writeConfig(config);

		return config;
	}
}

export async function writeConfig(config: SystemConfig): Promise<void> {
	await mkdirp(path.dirname(DEFAULT_CONFIG_DIRECTORY));
	await writeJSON(DEFAULT_CONFIG_DIRECTORY, config, { spaces: '\t' });
}

export async function updateConfig(newOptions: SystemConfig): Promise<void> {
	const config = await readConfig();
	await writeConfig(Object.assign(config, newOptions));
}