import type { Config } from '../declarations';
import { taskTelemetry } from './task-telemetry';

export const taskHelp = async (config: Config) => {
  const logger = config.logger;
  const sys = config.sys;

  const p = logger.dim(sys.details.platform === 'windows' ? '>' : '$');

  console.log(`
  ${logger.bold('Build:')} ${logger.dim('Build components for development or production.')}

    ${p} ${logger.green('stencil build [--dev] [--watch] [--prerender] [--debug]')}

      ${logger.cyan('--dev')} ${logger.dim('.............')} Development build
      ${logger.cyan('--watch')} ${logger.dim('...........')} Rebuild when files update
      ${logger.cyan('--serve')} ${logger.dim('...........')} Start the dev-server
      ${logger.cyan('--prerender')} ${logger.dim('.......')} Prerender the application
      ${logger.cyan('--docs')} ${logger.dim('............')} Generate component readme.md docs
      ${logger.cyan('--config')} ${logger.dim('..........')} Set stencil config file
      ${logger.cyan('--stats')} ${logger.dim('...........')} Write stencil-stats.json file
      ${logger.cyan('--log')} ${logger.dim('.............')} Write stencil-build.log file
      ${logger.cyan('--debug')} ${logger.dim('...........')} Set the log level to debug


  ${logger.bold('Test:')} ${logger.dim('Run unit and end-to-end tests.')}

    ${p} ${logger.green('stencil test [--spec] [--e2e]')}

      ${logger.cyan('--spec')} ${logger.dim('............')} Run unit tests with Jest
      ${logger.cyan('--e2e')} ${logger.dim('.............')} Run e2e tests with Puppeteer


  ${logger.bold('Generate:')} ${logger.dim('Bootstrap components.')}

    ${p} ${logger.green('stencil generate')} or ${logger.green('stencil g')}

`);
  
  await taskTelemetry(config);

  console.log(`
  ${logger.bold('Examples:')}

  ${p} ${logger.green('stencil build --dev --watch --serve')}
  ${p} ${logger.green('stencil build --prerender')}
  ${p} ${logger.green('stencil test --spec --e2e')}
  ${p} ${logger.green('stencil generate')}
  ${p} ${logger.green('stencil g my-component')}
`)
};
