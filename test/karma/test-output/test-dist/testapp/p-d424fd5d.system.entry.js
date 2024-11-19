System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var s, n;
  return {
    setters: [ function(t) {
      s = t.r, n = t.h;
    } ],
    execute: function() {
      t("json_basic", /** @class */ function() {
        function class_1(t) {
          s(this, t);
        }
        return class_1.prototype.render = function() {
          return n("div", {
            id: "json-foo"
          }, "bar");
        }, class_1;
      }());
    }
  };
}));