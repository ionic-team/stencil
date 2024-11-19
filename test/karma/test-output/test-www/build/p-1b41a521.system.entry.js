System.register([ "./p-329d5583.system.js" ], (function(s) {
  "use strict";
  var l, t;
  return {
    setters: [ function(s) {
      l = s.h, t = s.r;
    } ],
    execute: function() {
      var i = "A", n = l("span", null, "A"), c = l("div", null, "A"), u = l("span", null, "B"), e = l("div", null, "B"), a = l("div", null, "C");
      s("slot_basic_root", /** @class */ function() {
        function class_1(s) {
          t(this, s), this.inc = 1;
        }
        return class_1.prototype.testClick = function() {
          this.inc++;
        }, class_1.prototype.render = function() {
          return l("div", null, l("button", {
            onClick: this.testClick.bind(this),
            class: "test"
          }, "Test"), l("div", {
            class: "inc"
          }, "Rendered: ", this.inc), l("div", {
            class: "results1"
          }, l("slot-basic", null, i, "B")), l("div", {
            class: "results2"
          }, l("slot-basic", null, i, u)), l("div", {
            class: "results3"
          }, l("slot-basic", null, i, e)), l("div", {
            class: "results4"
          }, l("slot-basic", null, l("footer", null, i, e))), l("div", {
            class: "results5"
          }, l("slot-basic", null, n, "B")), l("div", {
            class: "results6"
          }, l("slot-basic", null, n, u)), l("div", {
            class: "results7"
          }, l("slot-basic", null, n, e)), l("div", {
            class: "results8"
          }, l("slot-basic", null, c, "B")), l("div", {
            class: "results9"
          }, l("slot-basic", null, c, u)), l("div", {
            class: "results10"
          }, l("slot-basic", null, c, e)), l("div", {
            class: "results11"
          }, l("slot-basic", null, c, l("footer", null, e), a)));
        }, class_1;
      }());
    }
  };
}));