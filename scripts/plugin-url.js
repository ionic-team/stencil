
const URL = `
let Url = function() { return {}; };

if (typeof URL === 'function') {
  Url = URL;

} else if (typeof require === 'function') {
  try {
    Url = require('url').URL;
  } catch (e) {}
}

export { Url as URL };
`

function urlPlugin() {

  return {
    resolveId(id) {
      if (id === 'url') {
        return id;
      }
      return null;
    },
    load(id) {
      if (id === 'url') {
        return URL;
      }
      return null;
    }
  }
}


exports.urlPlugin = urlPlugin;
