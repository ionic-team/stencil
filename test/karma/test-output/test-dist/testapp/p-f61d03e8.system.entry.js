System.register([ "./p-329d5583.system.js" ], (function(e) {
  "use strict";
  var n, t;
  return {
    setters: [ function(e) {
      n = e.r, t = e.h;
    } ],
    execute: function() {
      e("node_resolution", /** @class */ function() {
        function class_1(e) {
          n(this, e);
        }
        return class_1.prototype.render = function() {
          return t("div", null, t("h1", null, "node-resolution"), t("p", {
            id: "module-index"
          }, "module/index.js"), t("p", {
            id: "module"
          }, "module.js"));
        }, class_1;
      }());
    }
  };
}));