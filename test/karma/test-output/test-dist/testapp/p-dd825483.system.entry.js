System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var e, i;
  return {
    setters: [ function(t) {
      e = t.r, i = t.h;
    } ],
    execute: function() {
      t("init_css_root", /** @class */ function() {
        function class_1(t) {
          e(this, t);
        }
        return class_1.prototype.render = function() {
          return [ i("div", {
            id: "relative"
          }), i("div", {
            id: "relativeToRoot"
          }), i("div", {
            id: "absolute"
          }) ];
        }, class_1;
      }()).style = 'div#relativeToRoot{background-image:url("/assets/favicon.ico?relativeToRoot")}div#relative{background-image:url("../assets/favicon.ico?relative")}div#absolute{background-image:url("https://www.google.com/favicon.ico")}';
    }
  };
}));