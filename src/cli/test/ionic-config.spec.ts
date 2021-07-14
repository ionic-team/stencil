import fs from 'fs-extra';
import { readConfig, writeConfig, updateConfig, DEFAULT_CONFIG_DIRECTORY } from '../ionic-config';

describe('readConfig', () => {

	it('should create a file if it does not exist', async () => {
		if (await fs.pathExists(DEFAULT_CONFIG_DIRECTORY)) {
			fs.rmSync(DEFAULT_CONFIG_DIRECTORY);
		}

		expect(await fs.pathExists(DEFAULT_CONFIG_DIRECTORY)).toBe(false)

		const config = await readConfig();

		expect(typeof config).toBe("object");
		expect(Object.keys(config).join()).toBe("tokens.telemetry,telemetry.stencil");
	});

	it('should read a file if it exists', async () => {
		await writeConfig({"telemetry.stencil": true, "tokens.telemetry": "12345"})

		expect(await fs.pathExists(DEFAULT_CONFIG_DIRECTORY)).toBe(true)

		const config = await readConfig();

		expect(typeof config).toBe("object");
		expect(Object.keys(config).join()).toBe("telemetry.stencil,tokens.telemetry");
		expect(config['telemetry.stencil']).toBe(true);
		expect(config['tokens.telemetry']).toBe("12345");
	});
});

describe('updateConfig', () => {

	it('should edit a file', async () => {
		await writeConfig({ "telemetry.stencil": true, "tokens.telemetry": "12345" })

		expect(await fs.pathExists(DEFAULT_CONFIG_DIRECTORY)).toBe(true)

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
