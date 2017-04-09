(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "./avatar"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var avatar_1 = require("./avatar");
    /**
     * @hidden
     */
    var AvatarModule = (function () {
        function AvatarModule() {
        }
        /**
         * @return {?}
         */
        AvatarModule.forRoot = function () {
            return {
                ngModule: AvatarModule, providers: []
            };
        };
        return AvatarModule;
    }());
    AvatarModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [
                        avatar_1.Avatar
                    ],
                    exports: [
                        avatar_1.Avatar
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    AvatarModule.ctorParameters = function () { return []; };
    exports.AvatarModule = AvatarModule;
    function AvatarModule_tsickle_Closure_declarations() {
        /** @type {?} */
        AvatarModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        AvatarModule.ctorParameters;
    }
});
//# sourceMappingURL=avatar.module.js.map