import { NgModule } from '@angular/core';
import { Card } from './card';
import { CardContent } from './card-content';
import { CardHeader } from './card-header';
import { CardTitle } from './card-title';
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
export { CardModule };
CardModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    Card,
                    CardContent,
                    CardHeader,
                    CardTitle
                ],
                exports: [
                    Card,
                    CardContent,
                    CardHeader,
                    CardTitle
                ]
            },] },
];
/**
 * @nocollapse
 */
CardModule.ctorParameters = function () { return []; };
function CardModule_tsickle_Closure_declarations() {
    /** @type {?} */
    CardModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    CardModule.ctorParameters;
}
//# sourceMappingURL=card.module.js.map