const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const brotli = require('brotli');

const output = [];
const rootDir = path.join(__dirname, '..');


analysis(
  'Hello World',
  [
    path.join(rootDir, 'hello-world', 'www', 'build', 'app.js'),
  ]
);

// analysis(
//   'Todo App',
//   [
//     path.join(rootDir, 'todo-app', 'www', 'build', 'app', 'my-todo.entry.js'),
//     path.join(rootDir, 'todo-app', 'www', 'build', 'app', 'app.core.js'),
//     path.join(rootDir, 'todo-app', 'www', 'build', 'app.css'),
//   ]
// );


function analysis(appName, filePaths) {
  output.push(``, `## ${appName}`);
  output.push(``);
  output.push(`| File                       | Brotli   | Gzipped  | Minified |`)
  output.push(`|----------------------------|----------|----------|----------|`);

  filePaths.forEach(filePath => {
    output.push(getBuildFileSize(filePath));
  });

  output.push(``, ``);
}


function getBuildFileSize(filePath) {
  const content = fs.readFileSync(filePath);
  let fileName = path.basename(filePath);
  let brotliSize = getFileSize(brotli.compress(content).length);
  let gzipSize = getFileSize(zlib.gzipSync(content, { level: 9 }).length);
  let minifiedSize = getFileSize(fs.statSync(filePath).size);

  while (fileName.length < 26) {
    fileName += ' ';
  }

  while (brotliSize.length < 8) {
    brotliSize += ' ';
  }

  while (gzipSize.length < 8) {
    gzipSize += ' ';
  }

  while (minifiedSize.length < 8) {
    minifiedSize += ' ';
  }

  return `| ${fileName} | ${brotliSize} | ${gzipSize} | ${minifiedSize} |`;
}

function getFileSize(bytes) {
  if (bytes < 1024) {
    return `${bytes}B`;
  }
  return `${(bytes / 1024).toFixed(2)}KB`;
}

fs.writeFileSync(path.join(rootDir, 'readme.md'), output.join('\n'));
