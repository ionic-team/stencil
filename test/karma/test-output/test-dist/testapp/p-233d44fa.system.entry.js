System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var i, c;
  return {
    setters: [ function(t) {
      i = t.r, c = t.h;
    } ],
    execute: function() {
      t("listen_window", /** @class */ function() {
        function class_1(t) {
          i(this, t), this.clicked = 0, this.scrolled = 0;
        }
        return class_1.prototype.winClick = function() {
          this.clicked++;
        }, class_1.prototype.winScroll = function() {
          this.scrolled++;
        }, class_1.prototype.render = function() {
          return c("div", null, c("div", {
            id: "clicked"
          }, "Clicked: ", this.clicked), c("div", null, "Scrolled: ", this.scrolled), c("button", null, "Click!"), c("div", {
            style: {
              background: "gray",
              paddingTop: "2000px"
            }
          }));
        }, class_1;
      }());
    }
  };
}));