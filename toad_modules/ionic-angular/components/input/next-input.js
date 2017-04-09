import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
/**
 * @hidden
 */
var NextInput = (function () {
    function NextInput() {
        this.focused = new EventEmitter();
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
export { NextInput };
NextInput.decorators = [
    { type: Directive, args: [{
                selector: '[next-input]'
            },] },
];
/**
 * @nocollapse
 */
NextInput.ctorParameters = function () { return []; };
NextInput.propDecorators = {
    'focused': [{ type: Output },],
    'receivedFocus': [{ type: HostListener, args: ['focus',] },],
};
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
//# sourceMappingURL=next-input.js.map