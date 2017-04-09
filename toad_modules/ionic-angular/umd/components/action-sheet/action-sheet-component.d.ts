import { ElementRef, Renderer } from '@angular/core';
import { BlockerDelegate, GestureController } from '../../gestures/gesture-controller';
import { Config } from '../../config/config';
import { Platform } from '../../platform/platform';
import { NavParams } from '../../navigation/nav-params';
import { ViewController } from '../../navigation/view-controller';
/**
 * @hidden
 */
export declare class ActionSheetCmp {
    private _viewCtrl;
    private _plt;
    private _elementRef;
    d: {
        title?: string;
        subTitle?: string;
        cssClass?: string;
        buttons?: Array<any>;
        enableBackdropDismiss?: boolean;
        cancelButton: any;
    };
    descId: string;
    enabled: boolean;
    hdrId: string;
    id: number;
    mode: string;
    gestureBlocker: BlockerDelegate;
    constructor(_viewCtrl: ViewController, config: Config, _plt: Platform, _elementRef: ElementRef, gestureCtrl: GestureController, params: NavParams, renderer: Renderer);
    ionViewDidLoad(): void;
    ionViewWillEnter(): void;
    ionViewDidLeave(): void;
    ionViewDidEnter(): void;
    keyUp(ev: KeyboardEvent): void;
    click(button: any): void;
    bdClick(): void;
    dismiss(role: any): Promise<any>;
    ngOnDestroy(): void;
}
