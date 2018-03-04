/*!
String.prototype.startsWith
*/
String.prototype.startsWith||Object.defineProperty(String.prototype,"startsWith",{value:function(b,a){return this.substr(!a||0>a?0:+a,b.length)===b}});