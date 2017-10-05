var DocumentComponent = /** @class */ (function () {
    function DocumentComponent() {
        this.pages = [];
    }
    DocumentComponent.prototype.render = function () {
        return (h("div", 0, this.pages.map(function (page) { return h("app-marked", { "p": { "doc": page } }); })));
    };
    return DocumentComponent;
}());
export { DocumentComponent };
