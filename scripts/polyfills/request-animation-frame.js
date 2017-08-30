/*!
requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
MIT license
*/
(function(a){for(var f=0,c=["ms","moz","webkit","o"],b=0;b<c.length&&!a.requestAnimationFrame;++b)a.requestAnimationFrame=a[c[b]+"RequestAnimationFrame"],a.cancelAnimationFrame=a[c[b]+"CancelAnimationFrame"]||a[c[b]+"CancelRequestAnimationFrame"];a.requestAnimationFrame||(a.requestAnimationFrame=function(b,c){var d=(new Date).getTime(),e=Math.max(0,16-(d-f)),g=a.setTimeout(function(){b(d+e)},e);f=d+e;return g});a.cancelAnimationFrame||(a.cancelAnimationFrame=function(a){clearTimeout(a)})})(window);