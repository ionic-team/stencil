(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "./card", "./card-content", "./card-header", "./card-title"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var card_1 = require("./card");
    var card_content_1 = require("./card-content");
    var card_header_1 = require("./card-header");
    var card_title_1 = require("./card-title");
    /**
     * @hidden
     */
    var CardModule = (function () {
        function CardModule() {
        }
        /**
         * @return {?}
         */
        CardModule.forRoot = function () {
            return {
                ngModule: CardModule, providers: []
            };
        };
        return CardModule;
    }());
    CardModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [
                        card_1.Card,
                        card_content_1.CardContent,
                        card_header_1.CardHeader,
                        card_title_1.CardTitle
                    ],
                    exports: [
                        card_1.Card,
                        card_content_1.CardContent,
                        card_header_1.CardHeader,
                        card_title_1.CardTitle
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    CardModule.ctorParameters = function () { return []; };
    exports.CardModule = CardModule;
    function CardModule_tsickle_Closure_declarations() {
        /** @type {?} */
        CardModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        CardModule.ctorParameters;
    }
});
//# sourceMappingURL=card.module.js.map