System.register([ "./p-329d5583.system.js", "./p-bd05c61f.system.js", "./p-c57f74a3.system.js" ], (function(t) {
  "use strict";
  var s, n, e;
  return {
    setters: [ function(t) {
      s = t.r, n = t.h;
    }, function(t) {
      e = t.s;
    }, function() {} ],
    execute: function() {
      t("external_import_a", /** @class */ function() {
        function class_1(t) {
          s(this, t);
        }
        return class_1.prototype.componentWillLoad = function() {
          var t = e().data;
          this.first = t.first, this.last = t.last;
        }, class_1.prototype.render = function() {
          return n("div", null, this.first, " ", this.last);
        }, class_1;
      }());
    }
  };
}));