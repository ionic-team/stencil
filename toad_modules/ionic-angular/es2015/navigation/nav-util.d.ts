import { Renderer, TypeDecorator } from '@angular/core';
import { DeepLinker } from './deep-linker';
import { IonicPageMetadata } from './ionic-page';
import { ViewController } from './view-controller';
import { NavControllerBase } from './nav-controller-base';
import { Transition } from '../transitions/transition';
export declare function getComponent(linker: DeepLinker, nameOrPageOrView: any, params?: any): Promise<any>;
export declare function convertToView(linker: DeepLinker, nameOrPageOrView: any, params: any): Promise<any>;
export declare function convertToViews(linker: DeepLinker, pages: any[]): Promise<ViewController[]>;
export declare function setZIndex(nav: NavControllerBase, enteringView: ViewController, leavingView: ViewController, direction: string, renderer: Renderer): void;
export declare function isTabs(nav: any): boolean;
export declare function isTab(nav: any): boolean;
export declare function isNav(nav: any): boolean;
/**
 * @hidden
 */
export declare class DeepLinkMetadata implements IonicPageMetadata {
    component?: any;
    loadChildren?: string;
    name?: string;
    segment?: string;
    defaultHistory?: string[];
    priority?: string;
}
export interface DeepLinkDecorator extends TypeDecorator {
}
export interface DeepLinkMetadataFactory {
    (obj: IonicPageMetadata): DeepLinkDecorator;
    new (obj: IonicPageMetadata): DeepLinkMetadata;
}
/**
 * @hidden
 */
export declare var DeepLinkMetadataFactory: DeepLinkMetadataFactory;
/**
 * @hidden
 */
export interface DeepLinkConfig {
    links: DeepLinkMetadata[];
}
export interface NavLink {
    component?: any;
    loadChildren?: string;
    name?: string;
    segment?: string;
    parts?: string[];
    partsLen?: number;
    staticLen?: number;
    dataLen?: number;
    dataKeys?: {
        [key: string]: boolean;
    };
    defaultHistory?: any[];
}
export interface NavSegment {
    id: string;
    name: string;
    component?: any;
    loadChildren?: string;
    data: any;
    navId?: string;
    defaultHistory?: NavSegment[];
}
export interface NavOptions {
    animate?: boolean;
    animation?: string;
    direction?: string;
    duration?: number;
    easing?: string;
    id?: string;
    keyboardClose?: boolean;
    progressAnimation?: boolean;
    disableApp?: boolean;
    minClickBlockDuration?: number;
    ev?: any;
    updateUrl?: boolean;
    isNavRoot?: boolean;
}
export interface Page extends Function {
    new (...args: any[]): any;
}
export interface TransitionResolveFn {
    (hasCompleted: boolean, requiresTransition: boolean, enteringName?: string, leavingName?: string, direction?: string): void;
}
export interface TransitionRejectFn {
    (rejectReason: any, transition?: Transition): void;
}
export interface TransitionInstruction {
    opts: NavOptions;
    insertStart?: number;
    insertViews?: ViewController[];
    removeView?: ViewController;
    removeStart?: number;
    removeCount?: number;
    resolve?: TransitionResolveFn;
    reject?: TransitionRejectFn;
    leavingRequiresTransition?: boolean;
    enteringRequiresTransition?: boolean;
    requiresTransition?: boolean;
}
export declare const STATE_NEW = 1;
export declare const STATE_INITIALIZED = 2;
export declare const STATE_ATTACHED = 3;
export declare const STATE_DESTROYED = 4;
export declare const INIT_ZINDEX = 100;
export declare const DIRECTION_BACK = "back";
export declare const DIRECTION_FORWARD = "forward";
export declare const DIRECTION_SWITCH = "switch";
