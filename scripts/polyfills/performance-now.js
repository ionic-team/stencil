/*! window.performance.now
http://opensource.org/licenses/MIT
Copyright Paul Irish 2015 */
(function(a){0=="performance"in a&&(a.performance={});if(0=="now"in a.performance){var b=Date.now();performance.timing&&performance.timing.navigationStart&&(b=performance.timing.navigationStart);a.performance.now=function(){return Date.now()-b}}})(window);