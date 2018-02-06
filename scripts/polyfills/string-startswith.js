/*!
String.prototype.startsWith
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
*/
String.prototype.startsWith||Object.defineProperty(String.prototype, "startsWith", {
    value: function(search, pos) {
        return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
    }
});