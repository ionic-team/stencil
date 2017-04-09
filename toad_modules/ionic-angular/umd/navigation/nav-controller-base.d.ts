import { ComponentRef, ComponentFactoryResolver, ElementRef, EventEmitter, NgZone, Renderer, ViewContainerRef } from '@angular/core';
import { App } from '../components/app/app';
import { Config } from '../config/config';
import { NavOptions, TransitionResolveFn, TransitionInstruction } from './nav-util';
import { DeepLinker } from './deep-linker';
import { DomController } from '../platform/dom-controller';
import { GestureController } from '../gestures/gesture-controller';
import { ViewController } from './view-controller';
import { Ion } from '../components/ion';
import { Keyboard } from '../platform/keyboard';
import { NavController } from './nav-controller';
import { Platform } from '../platform/platform';
import { SwipeBackGesture } from './swipe-back';
import { Transition } from '../transitions/transition';
import { TransitionController } from '../transitions/transition-controller';
/**
 * @hidden
 * This class is for internal use only. It is not exported publicly.
 */
export declare class NavControllerBase extends Ion implements NavController {
    parent: any;
    _app: App;
    config: Config;
    plt: Platform;
    _keyboard: Keyboard;
    _zone: NgZone;
    _cfr: ComponentFactoryResolver;
    _gestureCtrl: GestureController;
    _trnsCtrl: TransitionController;
    _linker: DeepLinker;
    private _domCtrl;
    _children: any[];
    _ids: number;
    _init: boolean;
    _isPortal: boolean;
    _queue: TransitionInstruction[];
    _sbEnabled: boolean;
    _sbGesture: SwipeBackGesture;
    _sbTrns: Transition;
    _trnsId: number;
    _trnsTm: boolean;
    _viewport: ViewContainerRef;
    _views: ViewController[];
    _zIndexOffset: number;
    viewDidLoad: EventEmitter<any>;
    viewWillEnter: EventEmitter<any>;
    viewDidEnter: EventEmitter<any>;
    viewWillLeave: EventEmitter<any>;
    viewDidLeave: EventEmitter<any>;
    viewWillUnload: EventEmitter<any>;
    id: string;
    swipeBackEnabled: boolean;
    constructor(parent: any, _app: App, config: Config, plt: Platform, _keyboard: Keyboard, elementRef: ElementRef, _zone: NgZone, renderer: Renderer, _cfr: ComponentFactoryResolver, _gestureCtrl: GestureController, _trnsCtrl: TransitionController, _linker: DeepLinker, _domCtrl: DomController);
    push(page: any, params?: any, opts?: NavOptions, done?: Function): Promise<any>;
    insert(insertIndex: number, page: any, params?: any, opts?: NavOptions, done?: Function): Promise<any>;
    insertPages(insertIndex: number, insertPages: any[], opts?: NavOptions, done?: Function): Promise<any>;
    pop(opts?: NavOptions, done?: Function): Promise<any>;
    popTo(indexOrViewCtrl: any, opts?: NavOptions, done?: Function): Promise<any>;
    popToRoot(opts?: NavOptions, done?: Function): Promise<any>;
    popAll(): Promise<any[]>;
    remove(startIndex: number, removeCount?: number, opts?: NavOptions, done?: Function): Promise<any>;
    removeView(viewController: ViewController, opts?: NavOptions, done?: Function): Promise<any>;
    setRoot(pageOrViewCtrl: any, params?: any, opts?: NavOptions, done?: Function): Promise<any>;
    setPages(pages: any[], opts?: NavOptions, done?: Function): Promise<any>;
    _setPages(viewControllers: ViewController[], opts?: NavOptions, done?: Function): Promise<any>;
    _queueTrns(ti: TransitionInstruction, done: Function): Promise<any>;
    _nextTrns(): boolean;
    _nextTI(): TransitionInstruction;
    _getEnteringView(ti: TransitionInstruction, leavingView: ViewController): ViewController;
    _postViewInit(enteringView: ViewController, leavingView: ViewController, ti: TransitionInstruction): boolean;
    /**
     * DOM WRITE
     */
    _viewInit(enteringView: ViewController): void;
    _viewAttachToDOM(view: ViewController, componentRef: ComponentRef<any>, viewport: ViewContainerRef): void;
    _viewTest(enteringView: ViewController, leavingView: ViewController, ti: TransitionInstruction): boolean;
    _transitionInit(enteringView: ViewController, leavingView: ViewController, opts: NavOptions, resolve: TransitionResolveFn): void;
    _transitionStart(transition: Transition, enteringView: ViewController, leavingView: ViewController, opts: NavOptions, resolve: TransitionResolveFn): void;
    _transitionFinish(transition: Transition, opts: NavOptions, resolve: TransitionResolveFn): void;
    _viewsWillLifecycles(enteringView: ViewController, leavingView: ViewController): void;
    _insertViewAt(view: ViewController, index: number): void;
    _removeView(view: ViewController): void;
    _destroyView(view: ViewController): void;
    /**
     * DOM WRITE
     */
    _cleanup(activeView: ViewController): void;
    _preLoad(view: ViewController): void;
    _willLoad(view: ViewController): void;
    _didLoad(view: ViewController): void;
    _willEnter(view: ViewController): void;
    _didEnter(view: ViewController): void;
    _willLeave(view: ViewController, willUnload: boolean): void;
    _didLeave(view: ViewController): void;
    _willUnload(view: ViewController): void;
    hasChildren(): boolean;
    getActiveChildNav(): any;
    registerChildNav(nav: any): void;
    unregisterChildNav(nav: any): void;
    destroy(): void;
    swipeBackStart(): void;
    swipeBackProgress(stepValue: number): void;
    swipeBackEnd(shouldComplete: boolean, currentStepValue: number, velocity: number): void;
    _swipeBackCheck(): void;
    canSwipeBack(): boolean;
    canGoBack(): boolean;
    isTransitioning(): boolean;
    setTransitioning(isTransitioning: boolean): void;
    getActive(): ViewController;
    isActive(view: ViewController): boolean;
    getByIndex(index: number): ViewController;
    getPrevious(view?: ViewController): ViewController;
    first(): ViewController;
    last(): ViewController;
    indexOf(view: ViewController): number;
    length(): number;
    /**
     * Return the stack of views in this NavController.
     */
    getViews(): Array<ViewController>;
    isSwipeBackEnabled(): boolean;
    dismissPageChangeViews(): void;
    setViewport(val: ViewContainerRef): void;
    resize(): void;
}
