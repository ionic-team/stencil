/* tslint:disable */

/*!
Array.flat and Array.flatMap
*/
// @ts-ignore
Array.prototype.flat||Object.defineProperties(Array.prototype,{flat:{configurable:!0,value:function(){let t=isNaN(arguments[0])?1:Number(arguments[0]);const r=Array.prototype.slice.call(this),a=[];for(;t&&r.length;){const e=r.pop();Object(e)instanceof Array?(--t,Array.prototype.push.apply(r,e)):a.unshift(e)}return a.concat(r)},writable:!0},flatMap:{configurable:!0,value:function(t){return Array.prototype.map.apply(this,arguments).flat()},writable:!0}})

/*!
Object.entries
*/
// @ts-ignore
Object.entries||(Object.entries=function(c){for(var b=Object.keys(c),a=b.length,d=Array(a);a--;)d[a]=[b[a],c[b[a]]];return d});

/*!
Object.values
*/
// @ts-ignore
Object.values||(Object.values=function(n){return Object.keys(n).map(function(r){return n[r]})});
