import * as d from '../declarations';


export function helpTask(process: NodeJS.Process, logger: d.Logger) {
  const p = logger.dim((process.platform === 'win32') ? '>' : '$');

  console.log(`
  ${logger.bold('Build:')} ${logger.dim('Build components for development or production.')}

    ${p} ${logger.green('stencil build [--dev] [--watch] [--prerender] [--debug]')}

      ${logger.green('--dev')} ${logger.dim('...............')} Execute a development build
      ${logger.green('--watch')} ${logger.dim('.............')} Execute a build in watch mode
      ${logger.green('--serve')} ${logger.dim('.............')} Start the dev-server
      ${logger.green('--prerender')} ${logger.dim('.........')} Prerender URLs
      ${logger.green('--stats')} ${logger.dim('.............')} Write stencil-stats.json file
      ${logger.green('--log')} ${logger.dim('...............')} Write stencil-build.log file
      ${logger.green('--config')} ${logger.dim('............')} Set stencil config file
      ${logger.green('--docs')} ${logger.dim('..............')} Generate readme.md docs for each component
      ${logger.green('--debug')} ${logger.dim('.............')} Set the log level to debug

  ${logger.bold('Examples:')}

    ${p} ${logger.green('stencil build --dev --watch --serve')}
    ${p} ${logger.green('stencil build --prerender')}

`);
}
