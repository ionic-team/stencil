const ts = require('typescript');
const fs = require('fs-extra');
const path = require('path');
const childProcess = require('child_process');


const SRC_ROOT = path.join(__dirname, '../src');


function watchCompiler() {
  const compilerDir = path.join(SRC_ROOT, 'compiler');

  watchDirectory(compilerDir, changedFile => {
    console.log(`watch compiler: ${changedFile}`);
    runScript(`build.compiler`, []);
  });
}


function watchCore() {
  [
    'core',
    'util'
  ].forEach(dir => {

    watchDirectory(path.join(SRC_ROOT, dir), changedFile => {
      console.log(`watch core: ${changedFile}`);
      runScript(`build.core`, ['--', 'dev']);
    });

  });
}


function watchDirectory(dirPath, onFileChange) {
  let timer;

  function queueCallback(changedFile) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      onFileChange(changedFile);
    }, 250);
  }

  function recursiveReadDir(dirPath) {
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


function runScript(scriptName, args) {
  console.log(`run ${scriptName}`);

  const p = childProcess.spawn('npm', ['run', scriptName].concat(args), { cwd: path.join(__dirname, '../') });

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
runScript(`build.core`, ['--', 'dev']);


// keep watching for changes
watchCompiler();
watchCore();