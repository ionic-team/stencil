import { getCompilerSystem } from './state/stencil-cli-config';
import { readJson, uuidv4 } from './telemetry/helpers';

const CONFIG_FILE = 'config.json';
export const DEFAULT_CONFIG_DIRECTORY = (file: boolean = false) => {
	return getCompilerSystem().resolvePath(`${getCompilerSystem().homeDir()}/.ionic${file ? "/" + CONFIG_FILE : ""}`);
}

export interface TelemetryConfig {
	"telemetry.stencil"?: boolean,
	"tokens.telemetry"?: string,
}

export async function readConfig(): Promise<TelemetryConfig> {
	let config: TelemetryConfig = await readJson(DEFAULT_CONFIG_DIRECTORY(true));

	if (!config) {
		config = {
			"tokens.telemetry": uuidv4(),
			"telemetry.stencil": true,
		};

		await writeConfig(config);
	}

	return config;
}

export async function writeConfig(config: TelemetryConfig): Promise<void> {
	try {
		await getCompilerSystem().createDir(DEFAULT_CONFIG_DIRECTORY(), { recursive: true });
		await getCompilerSystem().writeFile(DEFAULT_CONFIG_DIRECTORY(true), JSON.stringify(config))
	} catch (error) {
		console.error(`Stencil Telemetry: couldn't write configuration file to ${DEFAULT_CONFIG_DIRECTORY(true)} - ${error}.`)
	};
}

export async function updateConfig(newOptions: TelemetryConfig): Promise<void> {
	const config = await readConfig();
	await writeConfig(Object.assign(config, newOptions));
}
