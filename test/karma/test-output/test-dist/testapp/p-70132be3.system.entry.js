System.register([ "./p-329d5583.system.js", "./p-c57f74a3.system.js" ], (function(t) {
  "use strict";
  var s, n, e;
  return {
    setters: [ function(t) {
      s = t.r, n = t.h;
    }, function(t) {
      e = t.d;
    } ],
    execute: function() {
      t("external_import_c", /** @class */ function() {
        function class_1(t) {
          s(this, t);
        }
        return class_1.prototype.componentWillLoad = function() {
          this.first = e().first, this.last = e().last;
        }, class_1.prototype.render = function() {
          return n("div", null, this.first, " ", this.last);
        }, class_1;
      }());
    }
  };
}));