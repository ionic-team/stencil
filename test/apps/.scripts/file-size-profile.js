const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const brotli = require('brotli');


module.exports = function fileSizeProfile(appName, filePaths, output) {
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
  try {
    const content = fs.readFileSync(filePath);
    let fileName = path.basename(filePath);

    let brotliSize;
    let gzipSize;
    let minifiedSize;

    if (content.length > 0) {
      brotliSize = getFileSize(brotli.compress(content).length);
      gzipSize = getFileSize(zlib.gzipSync(content, { level: 9 }).length);
      minifiedSize = getFileSize(fs.statSync(filePath).size);
    } else {
      brotliSize = gzipSize = minifiedSize = getFileSize(0);
    }

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

  } catch (e) {
    return e;
  }
}

function getFileSize(bytes) {
  if (bytes < 1024) {
    return `${bytes}B`;
  }
  return `${(bytes / 1024).toFixed(2)}KB`;
}
