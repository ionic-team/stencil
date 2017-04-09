(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    /**
     * @hidden
     */
    var NextInput = (function () {
        function NextInput() {
            this.focused = new core_1.EventEmitter();
        }
        /**
         * @return {?}
         */
        NextInput.prototype.receivedFocus = function () {
            (void 0) /* console.debug */;
            this.focused.emit(true);
        };
        return NextInput;
    }());
    NextInput.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '[next-input]'
                },] },
    ];
    /**
     * @nocollapse
     */
    NextInput.ctorParameters = function () { return []; };
    NextInput.propDecorators = {
        'focused': [{ type: core_1.Output },],
        'receivedFocus': [{ type: core_1.HostListener, args: ['focus',] },],
    };
    exports.NextInput = NextInput;
    function NextInput_tsickle_Closure_declarations() {
        /** @type {?} */
        NextInput.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        NextInput.ctorParameters;
        /** @type {?} */
        NextInput.propDecorators;
        /** @type {?} */
        NextInput.prototype.focused;
    }
});
//# sourceMappingURL=next-input.js.map