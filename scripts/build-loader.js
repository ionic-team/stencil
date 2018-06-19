const fs = require('fs-extra');


function buildLoader(inputLoaderFile, outputLoaderFile) {
  let content = fs.readFileSync(inputLoaderFile, 'utf8');

  content = content.replace(/export function /g, 'function ');

  content = `(function(win, doc, namespace, fsNamespace, resourcesUrl, appCore, appCoreSsr, appCorePolyfilled, hydratedCssClass, components) {

  ${content}

  init(win, doc, namespace, fsNamespace, resourcesUrl, appCore, appCoreSsr, appCorePolyfilled, hydratedCssClass, components);

  })(window, document, '__APP__');`;

  fs.writeFileSync(outputLoaderFile, content);

  console.log(`✅ loader: ${outputLoaderFile}`);
}

module.exports = buildLoader;
