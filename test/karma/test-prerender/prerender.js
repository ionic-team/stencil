const fs = require('fs');
const path = require('path');
const { WWW_OUT_DIR } = require('../constants');
const hydrate = require('../dist/hydrate');

async function run() {
  const indexPath = path.join(__dirname, 'index.html');
  const html = fs.readFileSync(indexPath, 'utf8');

  const results = await hydrate.renderToString(html, {
    prettyHtml: true,
  });

  const filePath = path.join(__dirname, '..', WWW_OUT_DIR, 'prerender', 'index.html');
  fs.writeFileSync(filePath, results.html);

  console.log('prerendered karma test');

  results.diagnostics.forEach((d) => {
    console.log(d.level, d.header, d.messageText);
  });
}
run();
