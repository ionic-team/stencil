
const URL = `
const URL_ = /*@__PURE__*/(function(){
  if (typeof URL === 'function') {
    return URL;
  }
  const requireFunc = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require;
  if (typeof requireFunc === 'function') {
    try {
      return requireFunc('url').URL;
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
