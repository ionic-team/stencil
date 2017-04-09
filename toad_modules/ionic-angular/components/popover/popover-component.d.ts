import { ComponentFactoryResolver, ElementRef, Renderer, ViewContainerRef } from '@angular/core';
import { Config } from '../../config/config';
import { NavParams } from '../../navigation/nav-params';
import { Platform } from '../../platform/platform';
import { ViewController } from '../../navigation/view-controller';
import { GestureController, BlockerDelegate } from '../../gestures/gesture-controller';
import { ModuleLoader } from '../../util/module-loader';
/**
 * @hidden
 */
export declare class PopoverCmp {
    _cfr: ComponentFactoryResolver;
    _elementRef: ElementRef;
    _renderer: Renderer;
    _config: Config;
    private _plt;
    _navParams: NavParams;
    _viewCtrl: ViewController;
    moduleLoader: ModuleLoader;
    _viewport: ViewContainerRef;
    d: {
        cssClass?: string;
        showBackdrop?: boolean;
        enableBackdropDismiss?: boolean;
    };
    _enabled: boolean;
    _gestureBlocker: BlockerDelegate;
    id: number;
    constructor(_cfr: ComponentFactoryResolver, _elementRef: ElementRef, _renderer: Renderer, _config: Config, _plt: Platform, _navParams: NavParams, _viewCtrl: ViewController, gestureCtrl: GestureController, moduleLoader: ModuleLoader);
    ionViewPreLoad(): void;
    _load(component: any): void;
    _viewWillEnter(): void;
    _viewDidLeave(): void;
    _setCssClass(componentRef: any, className: string): void;
    _bdClick(): Promise<any>;
    _keyUp(ev: KeyboardEvent): void;
    ngOnDestroy(): void;
}
