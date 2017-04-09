import { NgModule } from '@angular/core';
import { Grid } from './grid';
import { Row } from './row';
import { Col } from './col';
/**
 * @hidden
 */
export class GridModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: GridModule, providers: []
        };
    }
}
GridModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    Grid,
                    Row,
                    Col
                ],
                exports: [
                    Grid,
                    Row,
                    Col
                ]
            },] },
];
/**
 * @nocollapse
 */
GridModule.ctorParameters = () => [];
function GridModule_tsickle_Closure_declarations() {
    /** @type {?} */
    GridModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    GridModule.ctorParameters;
}
//# sourceMappingURL=grid.module.js.map