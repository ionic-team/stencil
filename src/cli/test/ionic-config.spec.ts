import { mockLogger } from '@stencil/core/testing';
import { getCompilerSystem, initializeStencilCLIConfig } from '@utils';
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

  beforeEach(async () => {
    await getCompilerSystem().removeFile(defaultConfig());
  });

  it('should create a file if it does not exist', async () => {
    const result = await getCompilerSystem().stat(defaultConfig());

    // expect the file to have been deleted by the test setup
    expect(result.isFile).toBe(false);

    const config = await readConfig();

    expect(Object.keys(config).join()).toBe('tokens.telemetry,telemetry.stencil');
  });

  it("should fix the telemetry token if it's a string, but an invalid UUID", async () => {
    await writeConfig({ 'telemetry.stencil': true, 'tokens.telemetry': 'aaaa' });

    const result = await getCompilerSystem().stat(defaultConfig());

    expect(result.isFile).toBe(true);

    const config = await readConfig();

    expect(Object.keys(config).join()).toBe('telemetry.stencil,tokens.telemetry');
    expect(config['telemetry.stencil']).toBe(true);
    expect(config['tokens.telemetry']).toMatch(UUID_REGEX);
  });

  it('handles a non-string telemetry token', async () => {
    // our typings state that `tokens.telemetry` is of type `string | undefined`, but technically this value could be
    // anything. use `undefined` to make the typings happy (this should cover all non-string telemetry tokens). the
    // important thing here is that the value is _not_ a string for this test!
    await writeConfig({ 'telemetry.stencil': true, 'tokens.telemetry': undefined });

    const config = await readConfig();

    expect(Object.keys(config).join()).toBe('telemetry.stencil,tokens.telemetry');
    expect(config['telemetry.stencil']).toBe(true);
    expect(config['tokens.telemetry']).toMatch(UUID_REGEX);
  });

  it('handles a non-existent telemetry token', async () => {
    await writeConfig({ 'telemetry.stencil': true });

    const config = await readConfig();

    expect(Object.keys(config).join()).toBe('telemetry.stencil,tokens.telemetry');
    expect(config['telemetry.stencil']).toBe(true);
    expect(config['tokens.telemetry']).toMatch(UUID_REGEX);
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
