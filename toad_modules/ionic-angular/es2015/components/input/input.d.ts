import { ElementRef, EventEmitter, Renderer } from '@angular/core';
import { NgControl } from '@angular/forms';
import { App } from '../app/app';
import { Config } from '../../config/config';
import { Content, ContentDimensions, ScrollEvent } from '../content/content';
import { PointerCoordinates } from '../../util/dom';
import { DomController } from '../../platform/dom-controller';
import { Form, IonicFormInput } from '../../util/form';
import { Ion } from '../ion';
import { Item } from '../item/item';
import { NativeInput } from './native-input';
import { NextInput } from './next-input';
import { NavController } from '../../navigation/nav-controller';
import { NavControllerBase } from '../../navigation/nav-controller-base';
import { Platform } from '../../platform/platform';
/**
 * @name Input
 * @description
 *
 * `ion-input` is meant for text type inputs only, such as `text`,
 * `password`, `email`, `number`, `search`, `tel`, and `url`. Ionic
 * still uses an actual `<input type="text">` HTML element within the
 * component, however, with Ionic wrapping the native HTML input
 * element it's better able to handle the user experience and
 * interactivity.
 *
 * Similarly, `<ion-textarea>` should be used in place of `<textarea>`.
 *
 * An `ion-input` is **not** used for non-text type inputs, such as a
 * `checkbox`, `radio`, `toggle`, `range`, `select`, etc.
 *
 * Along with the blur/focus events, `input` support all standard text input
 * events like `keyup`, `keydown`, `keypress`, `input`,etc. Any standard event
 * can be attached and will function as expected.
 *
 * @usage
 * ```html
 * <ion-list>
 *   <ion-item>
 *     <ion-label color="primary">Inline Label</ion-label>
 *     <ion-input placeholder="Text Input"></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label color="primary" fixed>Fixed Label</ion-label>
 *     <ion-input type="tel" placeholder="Tel Input"></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-input type="number" placeholder="Number Input with no label"></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label color="primary" stacked>Stacked Label</ion-label>
 *     <ion-input type="email" placeholder="Email Input"></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label color="primary" stacked>Stacked Label</ion-label>
 *     <ion-input type="password" placeholder="Password Input"></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label color="primary" floating>Floating Label</ion-label>
 *     <ion-input></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-input placeholder="Clear Input" clearInput></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-textarea placeholder="Enter a description"></ion-textarea>
 *   </ion-item>
 * </ion-list>
 * ```
 *
 * @demo /docs/demos/src/input/
 */
export declare class TextInput extends Ion implements IonicFormInput {
    private _plt;
    private _form;
    private _app;
    private _content;
    private _item;
    ngControl: NgControl;
    private _dom;
    _autoComplete: string;
    _autoCorrect: string;
    _autoFocusAssist: string;
    _clearInput: boolean;
    _clearOnEdit: boolean;
    _coord: PointerCoordinates;
    _didBlurAfterEdit: boolean;
    _disabled: boolean;
    _readonly: boolean;
    _isTouch: boolean;
    _keyboardHeight: number;
    _min: any;
    _max: any;
    _step: any;
    _native: NativeInput;
    _nav: NavControllerBase;
    _scrollStart: any;
    _scrollEnd: any;
    _type: string;
    _useAssist: boolean;
    _usePadding: boolean;
    _value: any;
    /** @hidden */
    inputControl: NgControl;
    constructor(config: Config, _plt: Platform, _form: Form, _app: App, elementRef: ElementRef, renderer: Renderer, _content: Content, _item: Item, nav: NavController, ngControl: NgControl, _dom: DomController);
    /**
     * @input {string} Instructional text that shows before the input has a value.
     */
    placeholder: string;
    /**
     * @input {boolean} If true, a clear icon will appear in the input when there is a value. Clicking it clears the input.
     */
    clearInput: any;
    /**
     * @input {string} The text value of the input.
     */
    value: any;
    /**
     * @input {string} The type of control to display. The default type is text. Possible values are: `"text"`, `"password"`, `"email"`, `"number"`, `"search"`, `"tel"`, or `"url"`.
     */
    type: any;
    /**
     * @input {boolean} If true, the user cannot interact with this element.
     */
    disabled: boolean;
    /**
     * @hidden
     */
    setDisabled(val: boolean): void;
    /**
     * @hidden
     */
    setDisabledState(isDisabled: boolean): void;
    /**
     * @input {boolean} If true, the user cannot modify the value.
     */
    readonly: boolean;
    /**
     * @input {boolean} If true, the value will be cleared after focus upon edit. Defaults to `true` when `type` is `"password"`, `false` for all other types.
     */
    clearOnEdit: any;
    /**
     * @input {any} The minimum value, which must not be greater than its maximum (max attribute) value.
     */
    min: any;
    /**
     * @hidden
     */
    setMin(val: any): void;
    /**
     * @input {any} The maximum value, which must not be less than its minimum (min attribute) value.
     */
    max: any;
    /**
     * @hidden
     */
    setMax(val: any): void;
    /**
     * @input {any} Works with the min and max attributes to limit the increments at which a value can be set.
     */
    step: any;
    /**
     * @hidden
     */
    setStep(val: any): void;
    /**
     * @hidden
     */
    _nativeInput: NativeInput;
    /**
     * @hidden
     */
    _nativeTextarea: NativeInput;
    /**
     * @hidden
     */
    _nextInput: NextInput;
    /**
     * @output {event} Emitted when the input no longer has focus.
     */
    blur: EventEmitter<Event>;
    /**
     * @output {event} Emitted when the input has focus.
     */
    focus: EventEmitter<Event>;
    /**
     * @hidden
     */
    setNativeInput(nativeInput: NativeInput): void;
    /**
     * @hidden
     */
    initFocus(): void;
    /**
     * @hidden
     */
    setFocus(): void;
    /**
     * @hidden
     */
    scrollHideFocus(ev: ScrollEvent, shouldHideFocus: boolean): void;
    /**
     * @hidden
     */
    inputBlurred(ev: UIEvent): void;
    /**
     * @hidden
     */
    inputFocused(ev: UIEvent): void;
    /**
     * @hidden
     */
    writeValue(val: any): void;
    /**
     * @hidden
     */
    onChange(val: any): void;
    /**
     * @hidden
     */
    onKeydown(val: any): void;
    /**
     * @hidden
     */
    onTouched(val: any): void;
    /**
     * @hidden
     */
    hasFocus(): boolean;
    /**
     * @hidden
     */
    hasValue(): boolean;
    /**
     * @hidden
     */
    checkHasValue(inputValue: any): void;
    /**
     * @hidden
     */
    focusChange(inputHasFocus: boolean): void;
    /**
     * @hidden
     */
    pointerStart(ev: UIEvent): void;
    /**
     * @hidden
     */
    pointerEnd(ev: UIEvent): void;
    /**
     * @hidden
     */
    setItemInputControlCss(): void;
    /**
     * @hidden
     */
    ngOnInit(): void;
    /**
     * @hidden
     */
    ngAfterContentChecked(): void;
    /**
     * @hidden
     */
    ngOnDestroy(): void;
    /**
     * @hidden
     */
    clearTextInput(): void;
    /**
    * Check if we need to clear the text input if clearOnEdit is enabled
    * @hidden
    */
    checkClearOnEdit(inputValue: string): void;
    /**
     * @hidden
     * Angular2 Forms API method called by the view (formControlName) to register the
     * onChange event handler that updates the model (Control).
     * @param {Function} fn  the onChange event handler.
     */
    registerOnChange(fn: any): void;
    /**
     * @hidden
     * Angular2 Forms API method called by the view (formControlName) to register
     * the onTouched event handler that marks model (Control) as touched.
     * @param {Function} fn  onTouched event handler.
     */
    registerOnTouched(fn: any): void;
    /**
     * @hidden
     */
    focusNext(): void;
}
/**
 * @hidden
 */
export declare function getScrollData(inputOffsetTop: number, inputOffsetHeight: number, scrollViewDimensions: ContentDimensions, keyboardHeight: number, plaformHeight: number): ScrollData;
export interface ScrollData {
    scrollAmount: number;
    scrollTo: number;
    scrollPadding: number;
    inputSafeY: number;
}
