System.register([], (function(t) {
  "use strict";
  return {
    execute: function() {
      t("t", (function(t, e) {
        return new Promise((function(n) {
          setTimeout((function() {
            return n(e);
          }), t);
        }));
      }));
    }
  };
}));