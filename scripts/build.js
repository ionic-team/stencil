const fs = require('fs-extra');
const path = require('path');
const { execSync, fork } = require('child_process');
const Listr = require('listr');
const color = require('ansi-colors');
const { getBuildId, run } = require('./script-utils');


const DIST_DIR = path.resolve(__dirname, '..', 'dist');
const buildId = getBuildId();

const start = Date.now();


run(async () => {
  execSync('npm install resolve@1.8.1', {
    cwd: path.join(__dirname, '..', 'node_modules', 'rollup-plugin-node-resolve')
  });

  await fs.remove(DIST_DIR);

  const scripts = [
    ['CLI', 'build-cli.js'],
    ['Compiler', 'build-compiler.js'],
    ['Dev Sever', 'build-dev-server.js'],
    ['Dev Server Client', 'build-dev-server-client.js'],
    ['Mock Doc', 'build-mock-doc.js'],
    ['Runtime', 'build-runtime.js'],
    ['Screenshot', 'build-screenshot.js'],
    ['Server', 'build-server.js'],
    ['Submodules', 'build-submodules.js'],
    ['Sys Node', 'build-sys-node.js'],
    ['Testing', 'build-testing.js']
  ];

  const errors = [];

  const tasks = scripts.map(script => {
    return {
      title: script[0],
      task: () => {
        return new Promise((resolve, reject) => {
          const cmd = path.join(__dirname, script[1]);
          const args = [`--build-id=${buildId}`];
          const opts = {
            stdio: ['pipe', 'pipe', 'pipe', 'ipc']
          };
          const cp = fork(cmd, args, opts);

          cp.stderr.on('data', data => {
            errors.push(data);
          });

          cp.on('exit', code => {
            if (code != 0) {
              reject();
            } else {
              resolve();
            }
          });

        }).catch(() => {
          throw new Error();
        });
      }
    };
  });

  const listr = new Listr(tasks, {
    concurrent: true,
    exitOnError: true,
    showSubtasks: false
  });

  listr.run().then(() => {
    console.log(color.dim(`\n  ${Date.now() - start}ms`) + '  🎉\n');

  }).catch(() => {
    console.error('\n' + errors.join('\n'));
  });

});
