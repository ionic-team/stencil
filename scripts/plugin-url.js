
const URL = `
const URL_ = /*@__PURE__*/(function(){
  if (typeof URL === 'function') {
    return URL;

  } else if (typeof require === 'function') {
    try {
      return require('url').URL;
    } catch (e) {}
  }
  return function() {}
})();

export { URL_ as URL };
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
