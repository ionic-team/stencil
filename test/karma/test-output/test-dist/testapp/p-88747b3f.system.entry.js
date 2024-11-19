System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var e, o, n;
  return {
    setters: [ function(t) {
      e = t.r, o = t.h, n = t.e;
    } ],
    execute: function() {
      t("slotted_css", /** @class */ function() {
        function class_1(t) {
          e(this, t);
        }
        return class_1.prototype.render = function() {
          return o(n, null, o("section", null, o("header", null, o("slot", {
            name: "header-slot-name"
          })), o("section", {
            class: "content"
          }, o("slot", null)), o("footer", null, o("slot", {
            name: "footer-slot-name"
          }))));
        }, class_1;
      }()).style = ':host{display:-ms-inline-flexbox;display:inline-flex;border:2px dashed gray;padding:2px}.content ::slotted(*){background-color:rgb(0, 255, 0)}::slotted(:not([slot="header-slot-name"])){border:4px solid rgb(0, 0, 255);color:rgb(0, 0, 255);font-weight:bold}::slotted([slot="header-slot-name"]){border:4px solid rgb(255, 0, 0);color:rgb(255, 0, 0);font-weight:bold}::slotted(*){margin:8px;padding:8px}';
    }
  };
}));