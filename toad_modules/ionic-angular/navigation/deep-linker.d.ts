import { ComponentFactory, ComponentFactoryResolver } from '@angular/core';
import { Location } from '@angular/common';
import { App } from '../components/app/app';
import { NavLink, NavSegment } from './nav-util';
import { ModuleLoader } from '../util/module-loader';
import { NavController } from './nav-controller';
import { Tab } from '../components/tabs/tab';
import { Tabs } from '../components/tabs/tabs';
import { UrlSerializer } from './url-serializer';
/**
 * @hidden
 */
export declare class DeepLinker {
    _app: App;
    _serializer: UrlSerializer;
    _location: Location;
    _moduleLoader: ModuleLoader;
    _baseCfr: ComponentFactoryResolver;
    /** @internal */
    _segments: NavSegment[];
    /** @internal */
    _history: string[];
    /** @internal */
    _indexAliasUrl: string;
    constructor(_app: App, _serializer: UrlSerializer, _location: Location, _moduleLoader: ModuleLoader, _baseCfr: ComponentFactoryResolver);
    /**
     * @internal
     */
    init(): void;
    /**
     * The browser's location has been updated somehow.
     * @internal
     */
    _urlChange(browserUrl: string): void;
    /**
     * Update the deep linker using the NavController's current active view.
     * @internal
     */
    navChange(direction: string): void;
    /**
     * @internal
     */
    _updateLocation(browserUrl: string, direction: string): void;
    getComponentFromName(componentName: string): Promise<any>;
    getNavLinkComponent(link: NavLink): Promise<any>;
    /**
     * @internal
     */
    resolveComponent(component: any): ComponentFactory<any>;
    /**
     * @internal
     */
    createUrl(nav: any, nameOrComponent: any, data: any, prepareExternalUrl?: boolean): string;
    /**
     * Build a browser URL out of this NavController. Climbs up the tree
     * of NavController's to create a string representation of all the
     * NavControllers state.
     *
     * @internal
     */
    _pathFromNavs(nav: NavController, component?: any, data?: any): NavSegment[];
    /**
     * @internal
     */
    _getTabSelector(tab: Tab): string;
    /**
     * @internal
     */
    getSelectedTabIndex(tabsNav: Tabs, pathName: string, fallbackIndex?: number): number;
    /**
     * Each NavController will call this method when it initializes for
     * the first time. This allows each NavController to figure out
     * where it lives in the path and load up the correct component.
     * @internal
     */
    initNav(nav: any): NavSegment;
    /**
     * @internal
     */
    initViews(segment: NavSegment): Promise<any>;
    /**
     * Using the known Path of Segments, walk down all descendents
     * from the root NavController and load each NavController according
     * to each Segment. This is usually called after a browser URL and
     * Path changes and needs to update all NavControllers to match
     * the new browser URL. Because the URL is already known, it will
     * not update the browser's URL when transitions have completed.
     *
     * @internal
     */
    _loadNavFromPath(nav: NavController, done?: Function): void;
    /**
     * @internal
     */
    _loadViewFromSegment(navInstance: any, done: Function): void;
    /**
     * @internal
     */
    _isBackUrl(browserUrl: string): boolean;
    /**
     * @internal
     */
    _isCurrentUrl(browserUrl: string): boolean;
    /**
     * @internal
     */
    _historyPush(browserUrl: string): void;
    /**
     * @internal
     */
    _historyPop(): void;
}
export declare function setupDeepLinker(app: App, serializer: UrlSerializer, location: Location, moduleLoader: ModuleLoader, cfr: ComponentFactoryResolver): DeepLinker;
export declare function normalizeUrl(browserUrl: string): string;
