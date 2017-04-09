import { ComponentFactoryResolver, ElementRef, NgZone, Renderer, ViewContainerRef } from '@angular/core';
import { App } from '../app/app';
import { Config } from '../../config/config';
import { DeepLinker } from '../../navigation/deep-linker';
import { DomController } from '../../platform/dom-controller';
import { GestureController } from '../../gestures/gesture-controller';
import { Keyboard } from '../../platform/keyboard';
import { NavControllerBase } from '../../navigation/nav-controller-base';
import { Platform } from '../../platform/platform';
import { TransitionController } from '../../transitions/transition-controller';
/**
 * @hidden
 */
export declare class OverlayPortal extends NavControllerBase {
    constructor(app: App, config: Config, plt: Platform, keyboard: Keyboard, elementRef: ElementRef, zone: NgZone, renderer: Renderer, cfr: ComponentFactoryResolver, gestureCtrl: GestureController, transCtrl: TransitionController, linker: DeepLinker, viewPort: ViewContainerRef, domCtrl: DomController);
    _overlayPortal: number;
    ngOnDestroy(): void;
}
