System.register([],(function(t){"use strict";return{execute:function(){t({g:e,s:r});function e(t,e,r){var i=n(t,e,r);var s=localStorage.getItem(i);if(typeof s==="string"){var u=parseInt(s,10);if(!isNaN(u)){return u}}return null}function r(t,e,r,i){var s=n(t,e,r);localStorage.setItem(s,String(i))}function n(t,e,r){return"screenshot_mismatch_"+t+"_"+e+"_"+r}}}}));