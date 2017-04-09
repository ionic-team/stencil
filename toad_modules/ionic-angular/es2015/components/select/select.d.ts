import { AfterViewInit, ElementRef, EventEmitter, OnDestroy, Renderer, QueryList } from '@angular/core';
import { App } from '../app/app';
import { Config } from '../../config/config';
import { Form } from '../../util/form';
import { BaseInput } from '../../util/base-input';
import { Item } from '../item/item';
import { NavController } from '../../navigation/nav-controller';
import { Option } from '../option/option';
export declare const SELECT_VALUE_ACCESSOR: any;
/**
 * @name Select
 * @description
 * The `ion-select` component is similar to an HTML `<select>` element, however,
 * Ionic's select component makes it easier for users to sort through and select
 * the preferred option or options. When users tap the select component, a
 * dialog will appear with all of the options in a large, easy to select list
 * for users.
 *
 * The select component takes child `ion-option` components. If `ion-option` is not
 * given a `value` attribute then it will use its text as the value.
 *
 * If `ngModel` is bound to `ion-select`, the selected value will be based on the
 * bound value of the model. Otherwise, the `selected` attribute can be used on
 * `ion-option` components.
 *
 * ### Interfaces
 *
 * By default, the `ion-select` uses the {@link ../../alert/AlertController AlertController API}
 * to open up the overlay of options in an alert. The interface can be changed to use the
 * {@link ../../action-sheet/ActionSheetController ActionSheetController API} by passing
 * `action-sheet` to the `interface` property. Read the other sections for the limitations of the
 * action sheet interface.
 *
 * ### Single Value: Radio Buttons
 *
 * The standard `ion-select` component allows the user to select only one
 * option. When selecting only one option the alert interface presents users with
 * a radio button styled list of options. The action sheet interface can only be
 * used with a single value select. If the number of options exceed 6, it will
 * use the `alert` interface even if `action-sheet` is passed. The `ion-select`
 * component's value receives the value of the selected option's value.
 *
 * ```html
 * <ion-item>
 *   <ion-label>Gender</ion-label>
 *   <ion-select [(ngModel)]="gender">
 *     <ion-option value="f">Female</ion-option>
 *     <ion-option value="m">Male</ion-option>
 *   </ion-select>
 * </ion-item>
 * ```
 *
 * ### Multiple Value: Checkboxes
 *
 * By adding the `multiple="true"` attribute to `ion-select`, users are able
 * to select multiple options. When multiple options can be selected, the alert
 * overlay presents users with a checkbox styled list of options. The
 * `ion-select multiple="true"` component's value receives an array of all the
 * selected option values. In the example below, because each option is not given
 * a `value`, then it'll use its text as the value instead.
 *
 * Note: the action sheet interface will not work with a multi-value select.
 *
 * ```html
 * <ion-item>
 *   <ion-label>Toppings</ion-label>
 *   <ion-select [(ngModel)]="toppings" multiple="true">
 *     <ion-option>Bacon</ion-option>
 *     <ion-option>Black Olives</ion-option>
 *     <ion-option>Extra Cheese</ion-option>
 *     <ion-option>Mushrooms</ion-option>
 *     <ion-option>Pepperoni</ion-option>
 *     <ion-option>Sausage</ion-option>
 *   </ion-select>
 * </ion-item>
 * ```
 *
 * ### Select Buttons
 * By default, the two buttons read `Cancel` and `OK`. Each button's text
 * can be customized using the `cancelText` and `okText` attributes:
 *
 * ```html
 * <ion-select okText="Okay" cancelText="Dismiss">
 *   ...
 * </ion-select>
 * ```
 *
 * The action sheet interface does not have an `OK` button, clicking
 * on any of the options will automatically close the overlay and select
 * that value.
 *
 * ### Select Options
 *
 * Since `ion-select` uses the `Alert` and `Action Sheet` interfaces, options can be
 * passed to these components through the `selectOptions` property. This can be used
 * to pass a custom title, subtitle, css class, and more. See the
 * {@link ../../alert/AlertController/#create AlertController API docs} and
 * {@link ../../action-sheet/ActionSheetController/#create ActionSheetController API docs}
 * for the properties that each interface accepts.
 *
 * ```html
 * <ion-select [selectOptions]="selectOptions">
 *   ...
 * </ion-select>
 * ```
 *
 * ```ts
 * this.selectOptions = {
 *   title: 'Pizza Toppings',
 *   subTitle: 'Select your toppings'
 * };
 * ```
 *
 * @demo /docs/demos/src/select/
 */
export declare class Select extends BaseInput<string[]> implements AfterViewInit, OnDestroy {
    private _app;
    config: Config;
    private _nav;
    _multi: boolean;
    _options: QueryList<Option>;
    _texts: string[];
    _text: string;
    /**
     * @input {string} The text to display on the cancel button. Default: `Cancel`.
     */
    cancelText: string;
    /**
     * @input {string} The text to display on the ok button. Default: `OK`.
     */
    okText: string;
    /**
     * @input {string} The text to display when the select is empty.
     */
    placeholder: string;
    /**
     * @input {any} Any additional options that the `alert` or `action-sheet` interface can take.
     * See the [AlertController API docs](../../alert/AlertController/#create) and the
     * [ActionSheetController API docs](../../action-sheet/ActionSheetController/#create) for the
     * create options for each interface.
     */
    selectOptions: any;
    /**
     * @input {string} The interface the select should use: `action-sheet` or `alert`. Default: `alert`.
     */
    interface: string;
    /**
     * @input {string} The text to display instead of the selected option's value.
     */
    selectedText: string;
    /**
     * @output {any} Emitted when the selection was cancelled.
     */
    ionCancel: EventEmitter<Select>;
    constructor(_app: App, form: Form, config: Config, elementRef: ElementRef, renderer: Renderer, item: Item, _nav: NavController);
    ngAfterContentInit(): void;
    _click(ev: UIEvent): void;
    _keyup(): void;
    /**
     * Open the select interface.
     */
    open(): void;
    /**
     * @input {boolean} If true, the element can accept multiple values.
     */
    multiple: any;
    /**
     * @hidden
     */
    readonly text: string | string[];
    /**
     * @private
     */
    options: QueryList<Option>;
    _inputNormalize(val: any): string[];
    _inputShouldChange(val: string[]): boolean;
    /**
     * @hidden
     */
    _inputUpdated(): void;
}
