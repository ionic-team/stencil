const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const brotli = require('brotli');
const glob = require('glob');

let totalBrotli = 0;
let totalGzip = 0;
let totalMinify = 0;

module.exports = function fileSizeProfile(appName, filePaths, output) {
  output.push(``, `## ${appName}`);
  output.push(``);
  output.push(`| File                       | Brotli   | Gzipped  | Minified |`)
  output.push(`|----------------------------|----------|----------|----------|`);

  totalBrotli = 0;
  totalGzip = 0;
  totalMinify = 0;
  filePaths.forEach(pattern => {
    glob.sync(pattern).forEach(filePath => {
      output.push(getBuildFileSize(filePath));
    });
  });

  // render SUM
  output.push(render('TOTAL', totalBrotli, totalGzip, totalMinify));

  output.push(``, ``);
}


function getBuildFileSize(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    let fileName = path.basename(filePath);

    let brotliSize;
    let gzipSize;
    let minifiedSize;

    if (content.length > 0) {
      const brotliResult = brotli.compress(content);
      brotliSize = brotliResult ? brotliResult.length : 0;
      gzipSize = zlib.gzipSync(content, { level: 9 }).length;
      minifiedSize = fs.statSync(filePath).size;
    } else {
      brotliSize = gzipSize = minifiedSize = 0;
    }
    totalBrotli += brotliSize;
    totalGzip += gzipSize;
    totalMinify += minifiedSize;

    return render(fileName, brotliSize, gzipSize, minifiedSize);

  } catch (e) {
    console.error(e);
    return '';
  }
}

function render(fileName, brotliSize, gzipSize, minifiedSize) {
  return `| ${fileName.padEnd(26)} | ${getFileSize(brotliSize).padEnd(8)} | ${getFileSize(gzipSize).padEnd(8)} | ${getFileSize(minifiedSize).padEnd(8)} |`;
}

function getFileSize(bytes) {
  if (bytes === 0) {
    return 'ERROR';
  }
  if (bytes < 1024) {
    return `${bytes}B`;
  }
  return `${(bytes / 1024).toFixed(2)}KB`;
}
