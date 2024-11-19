System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var e, s;
  return {
    setters: [ function(t) {
      e = t.r, s = t.h;
    } ],
    execute: function() {
      t("slot_replace_wrapper_root", /** @class */ function() {
        function class_1(t) {
          e(this, t), this.href = void 0;
        }
        return class_1.prototype.componentDidLoad = function() {
          this.href = "http://stenciljs.com/";
        }, class_1.prototype.render = function() {
          return s("main", null, s("slot-replace-wrapper", {
            href: this.href,
            class: "results1"
          }, s("content-end", {
            slot: "start"
          }, "A")), s("slot-replace-wrapper", {
            href: this.href,
            class: "results2"
          }, s("content-end", null, "B")), s("slot-replace-wrapper", {
            href: this.href,
            class: "results3"
          }, s("content-end", {
            slot: "end"
          }, "C")), s("slot-replace-wrapper", {
            href: this.href,
            class: "results4"
          }, s("content-start", {
            slot: "start"
          }, "A"), s("content-default", null, "B"), s("content-end", {
            slot: "end"
          }, "C")), s("slot-replace-wrapper", {
            href: this.href,
            class: "results5"
          }, s("content-default", null, "B"), s("content-end", {
            slot: "end"
          }, "C"), s("content-start", {
            slot: "start"
          }, "A")), s("slot-replace-wrapper", {
            href: this.href,
            class: "results6"
          }, s("content-end", {
            slot: "end"
          }, "C"), s("content-start", {
            slot: "start"
          }, "A"), s("content-default", null, "B")), s("slot-replace-wrapper", {
            href: this.href,
            class: "results7"
          }, s("content-start", {
            slot: "start"
          }, "A1"), s("content-start", {
            slot: "start"
          }, "A2"), s("content-default", null, "B1"), s("content-default", null, "B2"), s("content-end", {
            slot: "end"
          }, "C1"), s("content-end", {
            slot: "end"
          }, "C2")), s("slot-replace-wrapper", {
            href: this.href,
            class: "results8"
          }, s("content-default", null, "B1"), s("content-end", {
            slot: "end"
          }, "C1"), s("content-start", {
            slot: "start"
          }, "A1"), s("content-default", null, "B2"), s("content-end", {
            slot: "end"
          }, "C2"), s("content-start", {
            slot: "start"
          }, "A2")));
        }, class_1;
      }());
    }
  };
}));