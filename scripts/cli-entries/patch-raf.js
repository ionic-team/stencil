

exports.patchRaf = function patchRaf(window) {

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback) {
      var id = window.setTimeout(function() {
        callback(Date.now());
      }, 0);

      return id;
    };

    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }

};
