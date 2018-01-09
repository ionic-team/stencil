import { Logger } from '../util/interfaces';


export function help(process: NodeJS.Process, logger: Logger) {
  var p = logger.dim((process.platform === 'win32') ? '>' : '$');

  console.log(`
  ${logger.bold('Build:')} ${logger.dim('Build components for development or production.')}

    ${p} ${logger.green('stencil build [--dev] [--watch] [--prerender] [--debug]')}

      ${logger.green('--dev')} ${logger.dim('..................')} Execute a development build.
      ${logger.green('--watch')} ${logger.dim('................')} Execute a build in watch mode.
      ${logger.green('--prerender')} ${logger.dim('............')} Prerender URLs.
      ${logger.green('--debug')} ${logger.dim('................')} Set the log level to debug.
      ${logger.green('--config')} ${logger.dim('...............')} Stencil config file.
      ${logger.green('--docs')} ${logger.dim('.................')} Generate readme.md docs for each component

  ${logger.bold('Examples:')}

    ${p} ${logger.green('stencil build --dev --watch')}
    ${p} ${logger.green('stencil build --prerender')}
    ${p} ${logger.green('stencil init')}

`);
}
