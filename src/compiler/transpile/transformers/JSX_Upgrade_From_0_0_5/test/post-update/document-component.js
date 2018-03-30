var DocumentComponent = /** @class */ (function () {
    function DocumentComponent() {
        this.pages = [];
    }
    DocumentComponent.prototype.render = function () {
        return (h("div", null, this.pages.map(function (page) { return h("app-marked", { "doc": page }); })));
    };
    return DocumentComponent;
}());
export { DocumentComponent };
