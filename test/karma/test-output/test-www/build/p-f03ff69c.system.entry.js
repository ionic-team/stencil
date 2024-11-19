System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var n, s;
  return {
    setters: [ function(t) {
      n = t.r, s = t.h;
    } ],
    execute: function() {
      t("slot_fallback_root", /** @class */ function() {
        function class_1(t) {
          n(this, t), this.contentInc = 0, this.fallbackInc = 0, this.inc = 0, this.slotContent = "slot light dom 0";
        }
        return class_1.prototype.changeLightDom = function() {
          this.inc++;
        }, class_1.prototype.changeSlotContent = function() {
          this.contentInc++, this.slotContent = "slot light dom " + this.contentInc;
        }, class_1.prototype.changeFallbackContent = function() {
          this.fallbackInc++;
        }, class_1.prototype.render = function() {
          return [ s("button", {
            onClick: this.changeFallbackContent.bind(this),
            class: "change-fallback-content"
          }, "Change Fallback Slot Content"), s("button", {
            onClick: this.changeLightDom.bind(this),
            class: "change-light-dom"
          }, this.inc % 2 == 0 ? "Use light dom content" : "Use fallback slot content"), s("button", {
            onClick: this.changeSlotContent.bind(this),
            class: "change-slot-content"
          }, "Change Slot Content"), s("slot-fallback", {
            inc: this.fallbackInc,
            class: "results1"
          }, this.inc % 2 != 0 ? [ s("content-default", null, this.slotContent, " : default"), s("content-end", {
            slot: "end"
          }, this.slotContent, " : end"), s("content-start", {
            slot: "start"
          }, this.slotContent, " : start") ] : null) ];
        }, class_1;
      }());
    }
  };
}));