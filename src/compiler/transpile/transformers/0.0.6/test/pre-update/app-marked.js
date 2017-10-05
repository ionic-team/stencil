var AppMarked = /** @class */ (function () {
    function AppMarked() {
    }
    AppMarked.prototype.componentWillLoad = function () {
        return this.fetchNewContent();
    };
    AppMarked.prototype.fetchNewContent = function () {
        var _this = this;
        return fetch("/docs-content/" + this.doc)
            .then(function (response) { return response.text(); })
            .then(function (data) {
            _this.content = data;
            var el = document.createElement('div');
            el.innerHTML = data;
            var headerEl = el.querySelector('h1');
            document.title = (headerEl && headerEl.textContent + ' - Stencil') || 'Stencil';
            // requestAnimationFrame is not available for preRendering
            // or SSR, so only run this in the browser
            if (!_this.isServer) {
                window.requestAnimationFrame(function () {
                    window.scrollTo(0, 0);
                });
            }
        });
    };
    AppMarked.prototype.render = function () {
        return (h("div", { "p": { "innerHTML": this.content } }));
    };
    return AppMarked;
}());
export { AppMarked };
