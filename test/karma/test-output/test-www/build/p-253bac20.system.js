System.register([], (function(e) {
  "use strict";
  return {
    execute: function() {
      e("o", (function(e, t) {
        void 0 === t && (t = "lifecycle-loads");
        var n = document.createElement("li");
        n.innerText = e, document.getElementById(t).appendChild(n);
      }));
    }
  };
}));