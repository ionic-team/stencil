const fs = require('fs');
const path = require('path');
const hydrate = require('./dist/hydrate');


async function run() {
  const srcIndex = path.join(__dirname, 'www', 'index.html');
  const html = fs.readFileSync(srcIndex, 'utf-8');

  const results = await hydrate.renderToString(html, {prettyHtml: true});

  const dstIndex = path.join(__dirname, 'www', 'prerendered.html');
  fs.writeFileSync(dstIndex, results.html);
}
run();