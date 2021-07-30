import { getCompilerSystem } from './state/stencil-cli-config';
import { readJson, uuidv4 } from './telemetry/helpers';

export const defaultConfig = () =>
  getCompilerSystem().resolvePath(`${getCompilerSystem().homeDir()}/.ionic/config.json`);

export const defaultConfigDirectory = () => getCompilerSystem().resolvePath(`${getCompilerSystem().homeDir()}/.ionic`);

export interface TelemetryConfig {
  'telemetry.stencil'?: boolean;
  'tokens.telemetry'?: string;
}

export async function readConfig(): Promise<TelemetryConfig> {
  let config: TelemetryConfig = await readJson(defaultConfig());

  if (!config) {
    config = {
      'tokens.telemetry': uuidv4(),
      'telemetry.stencil': true,
    };

    await writeConfig(config);
  }

  return config;
}

export async function writeConfig(config: TelemetryConfig): Promise<boolean> {
  let result = false;
  try {
    await getCompilerSystem().createDir(defaultConfigDirectory(), { recursive: true });
    await getCompilerSystem().writeFile(defaultConfig(), JSON.stringify(config, null, 2));
    result = true;
  } catch (error) {
    console.error(`Stencil Telemetry: couldn't write configuration file to ${defaultConfig()} - ${error}.`);
  }

  return result;
}

export async function updateConfig(newOptions: TelemetryConfig): Promise<boolean> {
  const config = await readConfig();
  return await writeConfig(Object.assign(config, newOptions));
}
