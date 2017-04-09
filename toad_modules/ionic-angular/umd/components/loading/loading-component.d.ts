import { ElementRef, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { GestureController, BlockerDelegate } from '../../gestures/gesture-controller';
import { LoadingOptions } from './loading-options';
import { NavParams } from '../../navigation/nav-params';
import { Platform } from '../../platform/platform';
import { ViewController } from '../../navigation/view-controller';
/**
* @hidden
*/
export declare class LoadingCmp {
    private _viewCtrl;
    private _config;
    private _plt;
    private _elementRef;
    d: LoadingOptions;
    id: number;
    showSpinner: boolean;
    durationTimeout: any;
    gestureBlocker: BlockerDelegate;
    constructor(_viewCtrl: ViewController, _config: Config, _plt: Platform, _elementRef: ElementRef, gestureCtrl: GestureController, params: NavParams, renderer: Renderer);
    ngOnInit(): void;
    ionViewWillEnter(): void;
    ionViewDidLeave(): void;
    ionViewDidEnter(): void;
    dismiss(role: any): Promise<any>;
    ngOnDestroy(): void;
}
