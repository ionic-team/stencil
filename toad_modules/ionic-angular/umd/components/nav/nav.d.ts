import { AfterViewInit, ComponentFactoryResolver, ElementRef, NgZone, Renderer, ViewContainerRef } from '@angular/core';
import { App } from '../app/app';
import { Config } from '../../config/config';
import { DeepLinker } from '../../navigation/deep-linker';
import { DomController } from '../../platform/dom-controller';
import { GestureController } from '../../gestures/gesture-controller';
import { Keyboard } from '../../platform/keyboard';
import { NavController } from '../../navigation/nav-controller';
import { NavControllerBase } from '../../navigation/nav-controller-base';
import { NavOptions } from '../../navigation/nav-util';
import { Platform } from '../../platform/platform';
import { TransitionController } from '../../transitions/transition-controller';
import { ViewController } from '../../navigation/view-controller';
import { RootNode } from '../split-pane/split-pane';
/**
 * @name Nav
 * @description
 *
 * `ion-nav` is the declarative component for a [NavController](../../../navigation/NavController/).
 *
 * For more information on using nav controllers like Nav or [Tab](../../Tabs/Tab/),
 * take a look at the [NavController API Docs](../../../navigation/NavController/).
 *
 *
 * @usage
 * You must set a root page to be loaded initially by any Nav you create, using
 * the 'root' property:
 *
 * ```ts
 * import { Component } from '@angular/core';
 * import { GettingStartedPage } from './getting-started';
 *
 * @Component({
 *   template: `<ion-nav [root]="root"></ion-nav>`
 * })
 * class MyApp {
 *   root = GettingStartedPage;
 *
 *   constructor(){
 *   }
 * }
 * ```
 *
 * @demo /docs/demos/src/navigation/
 * @see {@link /docs/components#navigation Navigation Component Docs}
 */
export declare class Nav extends NavControllerBase implements AfterViewInit, RootNode {
    private _root;
    private _hasInit;
    constructor(viewCtrl: ViewController, parent: NavController, app: App, config: Config, plt: Platform, keyboard: Keyboard, elementRef: ElementRef, zone: NgZone, renderer: Renderer, cfr: ComponentFactoryResolver, gestureCtrl: GestureController, transCtrl: TransitionController, linker: DeepLinker, domCtrl: DomController);
    /**
     * @hidden
     */
    _vp: ViewContainerRef;
    ngAfterViewInit(): Promise<any>;
    goToRoot(opts: NavOptions): void;
    /**
     * @input {Page} The Page component to load as the root page within this nav.
     */
    root: any;
    /**
     * @input {object} Any nav-params to pass to the root page of this nav.
     */
    rootParams: any;
    /**
     * @hidden
     */
    ngOnDestroy(): void;
    initPane(): boolean;
    paneChanged(isPane: boolean): void;
}
