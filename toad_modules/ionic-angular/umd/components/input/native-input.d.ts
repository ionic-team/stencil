import { ElementRef, EventEmitter, Renderer } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Config } from '../../config/config';
import { Platform } from '../../platform/platform';
/**
 * @hidden
 */
export declare class NativeInput {
    _elementRef: ElementRef;
    _renderer: Renderer;
    private _plt;
    ngControl: NgControl;
    _relocated: boolean;
    _clone: boolean;
    _blurring: boolean;
    _unrefBlur: Function;
    focusChange: EventEmitter<boolean>;
    valueChange: EventEmitter<string>;
    keydown: EventEmitter<string>;
    constructor(_elementRef: ElementRef, _renderer: Renderer, config: Config, _plt: Platform, ngControl: NgControl);
    _change(ev: any): void;
    _keyDown(ev: any): void;
    _focus(): void;
    _blur(): void;
    labelledBy(val: string): void;
    isDisabled(val: boolean): void;
    setFocus(): void;
    beginFocus(shouldFocus: boolean, inputRelativeY: number): void;
    hideFocus(shouldHideFocus: boolean): void;
    setValue(val: any): void;
    getValue(): string;
    setMin(val: any): void;
    setMax(val: any): void;
    setStep(val: any): void;
    setElementClass(cssClass: string, shouldAdd: boolean): void;
    element(): HTMLInputElement;
    ngOnDestroy(): void;
}
