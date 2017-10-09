var LazyIframe = (function () {
    function LazyIframe() {
    }
    LazyIframe.prototype.componentDidLoad = function () {
        var _this = this;
        if ("IntersectionObserver" in window) {
            this.io = new IntersectionObserver(function (data) {
                if (data[0].isIntersecting) {
                    _this.handleIframe();
                    _this.cleanup();
                }
            });
            this.io.observe(this.el.querySelector("iframe"));
        }
        else {
            this.handleIframe();
        }
    };
    LazyIframe.prototype.componentDidUnload = function () {
        this.cleanup();
    };
    LazyIframe.prototype.handleIframe = function () {
        this.realSrc = this.src;
    };
    LazyIframe.prototype.cleanup = function () {
        // always make sure we remove the intersection
        // observer when its served its purpose so we dont
        // eat cpu cycles unnecessarily
        if (this.io) {
            this.io.disconnect();
            this.io = null;
        }
    };
    LazyIframe.prototype.render = function () {
        return (h("div", null, h("iframe", { "width": "560", "height": "315", "frameBorder": "0", "title": this.title, "allowFullScreen": true, "src": this.realSrc })));
    };
    return LazyIframe;
}());
export { LazyIframe };
