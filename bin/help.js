var chalk = require('chalk');


module.exports = function help() {
  var p = chalk.dim((process.platform === 'win32') ? '>' : '$');

  console.log(`
  ${chalk.bold(chalk.green('stencil build') + ' - Build your stencil project')}

    This command line tool allows you to build stencil collections and applications.

  ${chalk.bold('Usage:')}

    ${p} ${chalk.green('stencil build [--dev] [--watch] [--debug]')}

  ${chalk.bold('Options:')}

    ${chalk.green('--dev')} .................. Execute a development build.
    ${chalk.green('--watch')} ................ Execute a build in watch mode.
    ${chalk.green('--debug')} ................ Set the log level to debug.
    ${chalk.green('--config')} ............... Stencil config file.

  ${chalk.bold('Examples:')}

    ${p} ${chalk.green('stencil build --dev')}
    ${p} ${chalk.green('stencil build --watch')}

`);
}
