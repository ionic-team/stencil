import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
/**
 * @hidden
 */
export class NextInput {
    constructor() {
        this.focused = new EventEmitter();
    }
    /**
     * @return {?}
     */
    receivedFocus() {
        (void 0) /* console.debug */;
        this.focused.emit(true);
    }
}
NextInput.decorators = [
    { type: Directive, args: [{
                selector: '[next-input]'
            },] },
];
/**
 * @nocollapse
 */
NextInput.ctorParameters = () => [];
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