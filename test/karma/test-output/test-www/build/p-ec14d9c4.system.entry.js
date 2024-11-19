System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var r, s;
  return {
    setters: [ function(t) {
      r = t.r, s = t.h;
    } ],
    execute: function() {
      t("attribute_html_root", /** @class */ function() {
        function class_1(t) {
          r(this, t), this.strAttr = void 0, this.anyAttr = void 0, this.nuAttr = void 0;
        }
        return class_1.prototype.render = function() {
          return [ s("p", null, "strAttr:", " ", s("strong", {
            id: "str-attr"
          }, this.strAttr, " ", typeof this.strAttr)), s("p", null, "anyAttr:", " ", s("strong", {
            id: "any-attr"
          }, this.anyAttr, " ", typeof this.anyAttr)), s("p", null, "nuAttr:", " ", s("strong", {
            id: "nu-attr"
          }, this.nuAttr, " ", typeof this.nuAttr)) ];
        }, class_1;
      }());
    }
  };
}));