/*!
String.prototype.startsWith
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
*/
String.prototype.startsWith||Object.defineProperty(String.prototype,"startsWith",{value:function(b,a){return this.substr(!a||0>a?0:+a,b.length)===b}});