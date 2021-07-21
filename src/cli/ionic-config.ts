import { getCompilerSystem } from './state/stencil-cli-config';
import { readJson, uuidv4 } from './telemetry/helpers';

export const DEFAULT_CONFIG = (file: boolean = false) => {
  return getCompilerSystem().resolvePath(`${getCompilerSystem().homeDir()}/.ionic${file ? '/config.json' : ''}`);
};

export interface TelemetryConfig {
  'telemetry.stencil'?: boolean;
  'tokens.telemetry'?: string;
}

export async function readConfig(): Promise<TelemetryConfig> {
  let config: TelemetryConfig = await readJson(DEFAULT_CONFIG(true));

  if (!config) {
    config = {
      'tokens.telemetry': uuidv4(),
      'telemetry.stencil': true,
    };

    await writeConfig(config);
  }

  return config;
}

export async function writeConfig(config: TelemetryConfig): Promise<void> {
  try {
    await getCompilerSystem().createDir(DEFAULT_CONFIG(), { recursive: true });
    await getCompilerSystem().writeFile(DEFAULT_CONFIG(true), JSON.stringify(config));
  } catch (error) {
    console.error(`Stencil Telemetry: couldn't write configuration file to ${DEFAULT_CONFIG(true)} - ${error}.`);
  }
}

export async function updateConfig(newOptions: TelemetryConfig): Promise<void> {
  const config = await readConfig();
  await writeConfig(Object.assign(config, newOptions));
}
