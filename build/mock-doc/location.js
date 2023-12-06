export class MockLocation {
    constructor() {
        this.ancestorOrigins = null;
        this.protocol = '';
        this.host = '';
        this.hostname = '';
        this.port = '';
        this.pathname = '';
        this.search = '';
        this.hash = '';
        this.username = '';
        this.password = '';
        this.origin = '';
        this._href = '';
    }
    get href() {
        return this._href;
    }
    set href(value) {
        const url = new URL(value, 'http://mockdoc.stenciljs.com');
        this._href = url.href;
        this.protocol = url.protocol;
        this.host = url.host;
        this.hostname = url.hostname;
        this.port = url.port;
        this.pathname = url.pathname;
        this.search = url.search;
        this.hash = url.hash;
        this.username = url.username;
        this.password = url.password;
        this.origin = url.origin;
    }
    assign(_url) {
        //
    }
    reload(_forcedReload) {
        //
    }
    replace(_url) {
        //
    }
    toString() {
        return this.href;
    }
}
//# sourceMappingURL=location.js.map