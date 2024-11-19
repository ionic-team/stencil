import { c as setMode } from "./index-a2c0d171.js";

var globalScript = function() {
  setMode((function(o) {
    return o.colormode || o.getAttribute("colormode") || window.KarmaMode;
  }));
}, globalScripts = function() {
  globalScript();
};

export { globalScripts as g };