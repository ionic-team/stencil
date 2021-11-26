import type * as d from '../declarations';
import { checkTelemetry, disableTelemetry, enableTelemetry } from './telemetry/telemetry';

export const taskTelemetry = async (config: d.Config, sys: d.CompilerSystem, logger: d.Logger) => {
  const prompt = logger.dim(sys.details.platform === 'windows' ? '>' : '$');
  const isEnabling = config.flags.args.includes('on');
  const isDisabling = config.flags.args.includes('off');
  const INFORMATION = `Opt in or our of telemetry. Information about the data we collect is available on our website: ${logger.bold(
    'https://stenciljs.com/telemetry'
  )}`;
  const THANK_YOU = `Thank you for helping to make Stencil better! 💖`;
  const ENABLED_MESSAGE = `${logger.green('Enabled')}. ${THANK_YOU}\n\n`;
  const DISABLED_MESSAGE = `${logger.red('Disabled')}\n\n`;
  const hasTelemetry = await checkTelemetry(sys);

  if (isEnabling) {
    const result = await enableTelemetry(sys);
    result
      ? console.log(`\n  ${logger.bold('Telemetry is now ') + ENABLED_MESSAGE}`)
      : console.log(`Something went wrong when enabling Telemetry.`);
    return;
  }

  if (isDisabling) {
    const result = await disableTelemetry(sys);
    result
      ? console.log(`\n  ${logger.bold('Telemetry is now ') + DISABLED_MESSAGE}`)
      : console.log(`Something went wrong when disabling Telemetry.`);
    return;
  }

  console.log(`  ${logger.bold('Telemetry:')} ${logger.dim(INFORMATION)}`);

  console.log(`\n  ${logger.bold('Status')}: ${hasTelemetry ? ENABLED_MESSAGE : DISABLED_MESSAGE}`);

  console.log(`    ${prompt} ${logger.green('stencil telemetry [off|on]')}

        ${logger.cyan('off')} ${logger.dim('.............')} Disable sharing anonymous usage data
        ${logger.cyan('on')} ${logger.dim('..............')} Enable sharing anonymous usage data
  `);
};
