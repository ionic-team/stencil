import { mockLogger } from '@stencil/core/testing';
import { getCompilerSystem, initializeStencilCLIConfig } from '../state/stencil-cli-config';
import { readConfig, writeConfig, updateConfig, DEFAULT_CONFIG_DIRECTORY } from '../ionic-config';
import { createSystem } from '../../compiler/sys/stencil-sys';

describe('readConfig', () => {

	initializeStencilCLIConfig({
		sys: createSystem(),
		logger: mockLogger(),
		args: []
	});

	it('should create a file if it does not exist', async () => {
		let result = await getCompilerSystem().stat(DEFAULT_CONFIG_DIRECTORY(true));

		if (result.isFile) {
			await getCompilerSystem().removeFile(DEFAULT_CONFIG_DIRECTORY(true))
		}

		result = await getCompilerSystem().stat(DEFAULT_CONFIG_DIRECTORY(true))

		expect(result.isFile).toBe(false)

		const config = await readConfig();

		expect(Object.keys(config).join()).toBe("tokens.telemetry,telemetry.stencil");
	});

	it('should read a file if it exists', async () => {
		await writeConfig({ "telemetry.stencil": true, "tokens.telemetry": "12345" })

		let result = await getCompilerSystem().stat(DEFAULT_CONFIG_DIRECTORY(true));

		expect(result.isFile).toBe(true)

		const config = await readConfig();

		expect(Object.keys(config).join()).toBe("telemetry.stencil,tokens.telemetry");
		expect(config['telemetry.stencil']).toBe(true);
		expect(config['tokens.telemetry']).toBe("12345");
	});
});

describe('updateConfig', () => {
	initializeStencilCLIConfig({
		sys: createSystem(),
		logger: mockLogger(),
		args: []
	});

	it('should edit a file', async () => {
		await writeConfig({ "telemetry.stencil": true, "tokens.telemetry": "12345" })

		let result = await getCompilerSystem().stat(DEFAULT_CONFIG_DIRECTORY(true));

		expect(result.isFile).toBe(true)

		const configPre = await readConfig();

		expect(typeof configPre).toBe("object");
		expect(Object.keys(configPre).join()).toBe("telemetry.stencil,tokens.telemetry");
		expect(configPre['telemetry.stencil']).toBe(true);
		expect(configPre['tokens.telemetry']).toBe("12345");

		await updateConfig({ "telemetry.stencil": false, "tokens.telemetry": "67890" });

		const configPost = await readConfig();

		expect(typeof configPost).toBe("object");
		// Should keep the previous order
		expect(Object.keys(configPost).join()).toBe("telemetry.stencil,tokens.telemetry");
		expect(configPost['telemetry.stencil']).toBe(false);
		expect(configPost['tokens.telemetry']).toBe("67890");
	});

});
