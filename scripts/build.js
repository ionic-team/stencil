const fs = require('fs-extra');
const path = require('path');
const { fork } = require('child_process');
const Listr = require('listr');
const color = require('ansi-colors');
const { getBuildId, run } = require('./script-utils');


const DIST_DIR = path.resolve(__dirname, '..', 'dist');
const buildId = getBuildId();
const isCI = process.argv.includes('--ci');

const start = Date.now();


run(async () => {
  await fs.emptyDir(DIST_DIR);

  const scripts = [
    ['CLI', 'build-cli.js'],
    ['Compiler', 'build-compiler.js'],
    ['Dev Server', 'build-dev-server.js'],
    ['Dev Server Client', 'build-dev-server-client.js'],
    ['Hydrate', 'build-hydrate.js'],
    ['Mock Doc', 'build-mock-doc.js'],
    ['Runtime', 'build-runtime.js'],
    ['Screenshot', 'build-screenshot.js'],
    ['Submodules', 'build-submodules.js'],
    ['Sys Node', 'build-sys-node.js'],
    ['Testing', 'build-testing.js']
  ];

  const errors = [];

  const tasks = scripts.map(script => {
    return {
      title: script[0],
      task() {
        return new Promise((resolve, reject) => {
          const cmd = path.join(__dirname, script[1]);
          const args = [`--build-id=${buildId}`];
          const opts = {
            stdio: ['pipe', 'pipe', 'pipe', 'ipc']
          };
          const cp = fork(cmd, args, opts);

          cp.stderr.on('data', data => {
            errors.push(`\n${color.bold(color.red(script[0] + ' error:'))}\n\n${data}`);
          });

          cp.on('exit', code => {
            if (code != 0) {
              reject();
            } else {
              resolve();
            }
          });
        });
      }
    };
  });

  try {
    if (isCI) {
      await Promise.all(tasks.map(async t => {
        await t.task();
        console.log(`${color.bold(color.green('✓'))} ${t.title}`);
      }));

    } else {
      const listr = new Listr(tasks, {
        concurrent: true,
        exitOnError: true,
        showSubtasks: false
      });

      await listr.run();

      console.log(color.dim(`\n  ${Date.now() - start}ms`) + (process.platform === 'win32' ? '' : ' 🎉') + '\n');
    }

  } catch (e) {
    errors.forEach(err => {
      console.error(err);
    });
    process.exit(1);
  }
});
