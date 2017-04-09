import { NgModule } from '@angular/core';
import { Grid } from './grid';
import { Row } from './row';
import { Col } from './col';
/**
 * @hidden
 */
var GridModule = (function () {
    function GridModule() {
    }
    /**
     * @return {?}
     */
    GridModule.forRoot = function () {
        return {
            ngModule: GridModule, providers: []
        };
    };
    return GridModule;
}());
export { GridModule };
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
GridModule.ctorParameters = function () { return []; };
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