/*!
String.prototype.endsWith
*/
String.prototype.endsWith||(String.prototype.endsWith=function(b,a){if(void 0===a||a>this.length)a=this.length;return this.substring(a-b.length,a)===b});