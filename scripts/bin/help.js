var chalk = require('chalk');


module.exports = function help() {
  var p = chalk.dim((process.platform === 'win32') ? '>' : '$');

  console.log(`
  ${chalk.bold('Build:')} ${chalk.dim('Build components for development or production.')}

    ${p} ${chalk.green('stencil build [--dev] [--watch] [--prerender] [--debug]')}

      ${chalk.green('--dev')} ${chalk.dim('..................')} Execute a development build.
      ${chalk.green('--watch')} ${chalk.dim('................')} Execute a build in watch mode.
      ${chalk.green('--prerender')} ${chalk.dim('............')} Prerender URLs.
      ${chalk.green('--debug')} ${chalk.dim('................')} Set the log level to debug.
      ${chalk.green('--config')} ${chalk.dim('...............')} Stencil config file.

  ${chalk.bold('Examples:')}

    ${p} ${chalk.green('stencil build --dev --watch')}
    ${p} ${chalk.green('stencil build --prerender')}
    ${p} ${chalk.green('stencil init')}

`);
}
