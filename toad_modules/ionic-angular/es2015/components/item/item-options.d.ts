import { ElementRef, EventEmitter, Renderer } from '@angular/core';
import { ItemSliding } from './item-sliding';
/**
 * @name ItemOptions
 * @description
 * The option buttons for an `ion-item-sliding`. These buttons can be placed either on the left or right side.
 * You can combine the `(ionSwipe)` event plus the `expandable` directive to create a full swipe action for the item.
 *
 * @usage
 *
 * ```html
 * <ion-item-sliding>
 *   <ion-item>
 *     Item 1
 *   </ion-item>
 *   <ion-item-options side="right" (ionSwipe)="saveItem(item)">
 *     <button ion-button expandable (click)="saveItem(item)">
 *       <ion-icon name="star"></ion-icon>
 *     </button>
 *   </ion-item-options>
 * </ion-item-sliding>
 *```
 */
export declare class ItemOptions {
    private _elementRef;
    private _renderer;
    /**
     * @input {string} The side the option button should be on. Defaults to `"right"`.
     * If you have multiple `ion-item-options`, a side must be provided for each.
     */
    side: string;
    /**
     * @output {event} Emitted when the item has been fully swiped.
     */
    ionSwipe: EventEmitter<ItemSliding>;
    constructor(_elementRef: ElementRef, _renderer: Renderer);
    /**
     * @hidden
     */
    getSides(): number;
    /**
     * @hidden
     */
    width(): any;
}
