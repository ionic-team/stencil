import { createLogger } from '../../../compiler/sys/logger/console-logger';
import { createSystem } from '../../../compiler/sys/stencil-sys';
import StencilCLIConfig, { getCompilerSystem, getStencilCLIConfig, initializeStencilCLIConfig, getLogger, getCoreCompiler } from '../stencil-cli-config';

describe('StencilCLIConfig', () => {
	const config = initializeStencilCLIConfig({
		sys: createSystem(),
		args: [],
		logger: createLogger()
	})

	it('should behave as a singleton', async () => {
		const config2 = initializeStencilCLIConfig({
			sys: createSystem(),
			args: [],
			logger: createLogger()
		})

		expect(config2).toBe(config);

		const config3 = getStencilCLIConfig();

		expect(config3).toBe(config);
	});

	it('allows updating any item', async () => {
		config.args = ["nice", "awesome"];
		expect(config.args).toEqual(["nice", "awesome"]);
	});


	it('getCompilerSystem should return a segment of the singleton', async () => {
		expect(config.sys).toBe(getCompilerSystem());
	});

	it('getLogger should return a segment of the singleton', async () => {
		expect(config.logger).toBe(getLogger());
	});

	it('getCoreCompiler should return a segment of the singleton', async () => {
		expect(config.coreCompiler).toBe(getCoreCompiler());
	});

});
