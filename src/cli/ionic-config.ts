import { getCompilerSystem } from '@utils';
import { readJson, uuidv4, UUID_REGEX } from './telemetry/helpers';

export const isTest = () => process.env.JEST_WORKER_ID !== undefined;

export const defaultConfig = () =>
  getCompilerSystem().resolvePath(
    `${getCompilerSystem().homeDir()}/.ionic/${isTest() ? 'tmp-config.json' : 'config.json'}`
  );

export const defaultConfigDirectory = () => getCompilerSystem().resolvePath(`${getCompilerSystem().homeDir()}/.ionic`);

export interface TelemetryConfig {
  'telemetry.stencil'?: boolean;
  'tokens.telemetry'?: string;
}

/**
 * Reads an Ionic configuration file from disk, parses it, and performs any necessary corrections to it if ceratin
 * values are deemed to be malformed
 * @returns the config read from disk that has been potentially been updated
 */
export async function readConfig(): Promise<TelemetryConfig> {
  let config: TelemetryConfig = await readJson(defaultConfig());

  if (!config) {
    config = {
      'tokens.telemetry': uuidv4(),
      'telemetry.stencil': true,
    };

    await writeConfig(config);
  } else if (!UUID_REGEX.test(config['tokens.telemetry'])) {
    const newUuid = uuidv4();
    await writeConfig({ ...config, 'tokens.telemetry': newUuid });
    config['tokens.telemetry'] = newUuid;
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
