import { mockLogger } from '@stencil/core/testing';
import { getCompilerSystem, initializeStencilCLIConfig } from '../state/stencil-cli-config';
import { readConfig, writeConfig, updateConfig, defaultConfig } from '../ionic-config';
import { createSystem } from '../../compiler/sys/stencil-sys';
import { UUID_REGEX } from '../telemetry/helpers';

const UUID1 = '5588e0f0-02b5-4afa-8194-5d8f78683b36';
const UUID2 = 'e5609819-5c24-4fa2-8817-e05ca10b8cae';

describe('readConfig', () => {
  initializeStencilCLIConfig({
    sys: createSystem(),
    logger: mockLogger(),
    args: [],
  });

  it('should create a file if it does not exist', async () => {
    let result = await getCompilerSystem().stat(defaultConfig());

    if (result.isFile) {
      await getCompilerSystem().removeFile(defaultConfig());
    }

    result = await getCompilerSystem().stat(defaultConfig());

    expect(result.isFile).toBe(false);

    const config = await readConfig();

    expect(Object.keys(config).join()).toBe('tokens.telemetry,telemetry.stencil');
  });

  it('should fix the telemetry token if necessary', async () => {
    await writeConfig({ 'telemetry.stencil': true, 'tokens.telemetry': 'aaaa' });

    let result = await getCompilerSystem().stat(defaultConfig());

    expect(result.isFile).toBe(true);

    const config = await readConfig();

    expect(Object.keys(config).join()).toBe('telemetry.stencil,tokens.telemetry');
    expect(config['telemetry.stencil']).toBe(true);
    expect(!!config['tokens.telemetry'].match(UUID_REGEX)).toBe(true);
  });

  it('should read a file if it exists', async () => {
    await writeConfig({ 'telemetry.stencil': true, 'tokens.telemetry': UUID1 });

    let result = await getCompilerSystem().stat(defaultConfig());

    expect(result.isFile).toBe(true);

    const config = await readConfig();

    expect(Object.keys(config).join()).toBe('telemetry.stencil,tokens.telemetry');
    expect(config['telemetry.stencil']).toBe(true);
    expect(config['tokens.telemetry']).toBe(UUID1);
  });
});

describe('updateConfig', () => {
  initializeStencilCLIConfig({
    sys: createSystem(),
    logger: mockLogger(),
    args: [],
  });

  it('should edit a file', async () => {
    await writeConfig({ 'telemetry.stencil': true, 'tokens.telemetry': UUID1 });

    let result = await getCompilerSystem().stat(defaultConfig());

    expect(result.isFile).toBe(true);

    const configPre = await readConfig();

    expect(typeof configPre).toBe('object');
    expect(Object.keys(configPre).join()).toBe('telemetry.stencil,tokens.telemetry');
    expect(configPre['telemetry.stencil']).toBe(true);
    expect(configPre['tokens.telemetry']).toBe(UUID1);

    await updateConfig({ 'telemetry.stencil': false, 'tokens.telemetry': UUID2 });

    const configPost = await readConfig();

    expect(typeof configPost).toBe('object');
    // Should keep the previous order
    expect(Object.keys(configPost).join()).toBe('telemetry.stencil,tokens.telemetry');
    expect(configPost['telemetry.stencil']).toBe(false);
    expect(configPost['tokens.telemetry']).toBe(UUID2);
  });
});
