import type { Config} from '../declarations';
import { CoreCompiler } from './load-compiler';
import { checkTelemetry, disableTelemetry, enableTelemetry } from './telemetry/telemetry';

export const taskTelemetry = async (_coreCompiler: CoreCompiler, config: Config) => {
  const p = config.logger.dim(config.sys.details.platform === 'windows' ? '>' : '$');
  const logger = config.logger;
  const isEnabling = config.flags.args.includes("on");
  const isDisabling = config.flags.args.includes("off");
  const hasTelemetry = await checkTelemetry();
  const INFORMATION = `\n\nInformation about the data we collect is available on our website: ${logger.bold('https://stenciljs.com/telemetry')}`
  const THANK_YOU = `\n\nThank you for helping to make Stencil better! 💖` + INFORMATION;
  
  if (isEnabling) {
    await enableTelemetry()
    console.log(`${logger.bold('Telemetry:')} ${logger.dim('Enabled') + THANK_YOU}\n`)
    return;
  }

  if (isDisabling) {
    await disableTelemetry()
    console.log(`${logger.bold('Telemetry:')} ${logger.dim('Disabled') + INFORMATION}\n`)
    return;
  }


	console.log(`
    ${logger.bold('Telemetry:')} ${hasTelemetry ? logger.dim('Enabled') + THANK_YOU : logger.dim('Disabled') + INFORMATION}

      ${p} ${logger.green('stencil telemetry [off|on]')}

        ${logger.cyan('off')} ${logger.dim('.............')} Disable sharing anonymous usage data
        ${logger.cyan('on')} ${logger.dim('..............')} Enable sharing anonymous usage data
  `);
};
