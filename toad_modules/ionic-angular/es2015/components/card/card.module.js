import { NgModule } from '@angular/core';
import { Card } from './card';
import { CardContent } from './card-content';
import { CardHeader } from './card-header';
import { CardTitle } from './card-title';
/**
 * @hidden
 */
export class CardModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: CardModule, providers: []
        };
    }
}
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
CardModule.ctorParameters = () => [];
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