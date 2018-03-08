/*!
String.prototype.endsWith
*/
String.prototype.endsWith||Object.defineProperty(String.prototype,"endsWith",{writable:!0,configurable:!0,value:function(b,a){if(void 0===a||a>this.length)a=this.length;return this.substring(a-b.length,a)===b}});