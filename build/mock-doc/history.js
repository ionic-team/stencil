export class MockHistory {
    constructor() {
        this.items = [];
    }
    get length() {
        return this.items.length;
    }
    back() {
        this.go(-1);
    }
    forward() {
        this.go(1);
    }
    go(_value) {
        //
    }
    pushState(_state, _title, _url) {
        //
    }
    replaceState(_state, _title, _url) {
        //
    }
}
//# sourceMappingURL=history.js.map