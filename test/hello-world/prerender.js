const fs = require('fs');
const path = require('path');
const hydrate = require('./dist/hydrate');


function run() {
  const html = `
    <html>
      <hello-world></hello-world>
    </html>
  `;

  const results = hydrate.renderToStringSync(html, {
    prettyHtml: true,
    title: 'Hello World'
  });

  const filePath = path.join(__dirname, 'www', 'index.html');
  fs.writeFileSync(filePath, results.html);
}
run();