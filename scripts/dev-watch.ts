import * as ts from 'typescript';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as childProcess from 'child_process';


const SRC_ROOT = path.join(__dirname, '../../src');


function watchCompiler() {
  const compilerDir = path.join(SRC_ROOT, 'compiler');

  watchDirectory(compilerDir, changedFile => {
    console.log(`watch compiler: ${changedFile}`);
    runScript(`build.compiler`, []);
  });
}


function watchWeb() {
  ['bindings/web/src', 'client', 'platform', 'polyfills', 'util'].forEach(dir => {

    watchDirectory(path.join(SRC_ROOT, dir), changedFile => {
      console.log(`watch: ${changedFile}`);
      runScript(`build.web`, ['--', 'dev']);
    });

  });
}


function watchDirectory(dirPath: string, onFileChange: ts.FileWatcherCallback) {
  let timer: NodeJS.Timer;

  function queueCallback(changedFile: string) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      onFileChange(changedFile);
    }, 300);
  }

  function recursiveReadDir(dirPath: string) {
    if (dirPath === 'test') return;

    fs.readdirSync(dirPath).forEach(name => {
      if (name.indexOf('.spec.') > -1) return;

      const dirItem = path.join(dirPath, name);

      if (fs.statSync(dirItem).isFile()) {
        ts.sys.watchFile(dirItem, queueCallback);
      } else {
        recursiveReadDir(dirItem);
      }
    });

  }

  recursiveReadDir(dirPath);
}


function runScript(scriptName: string, args: string[]) {
  console.log(`run ${scriptName}`);

  const p = childProcess.spawn('npm', ['run', scriptName].concat(args), { cwd: path.join(__dirname, '../..') });

  p.stdout.on('data', (data) => {
    console.log(data.toString().trim());
  });

  p.stderr.on('data', (data) => {
    console.log(`stderr: ${data.toString().trim()}`);
  });

  p.on('close', (code) => {
    if (code !== 0) {
      console.log(`"${scriptName}" exited with code: ${code}`);
    }
  });
}


// kick off first builds
runScript(`build.compiler`, []);
runScript(`build.web`, ['--', 'dev']);


// keep watching for changes
watchCompiler();
watchWeb();