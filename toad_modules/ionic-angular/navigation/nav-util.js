import { isArray, isPresent } from '../util/util';
import { isViewController, ViewController } from './view-controller';
/**
 * @param {?} linker
 * @param {?} nameOrPageOrView
 * @param {?=} params
 * @return {?}
 */
export function getComponent(linker, nameOrPageOrView, params) {
    if (typeof nameOrPageOrView === 'function') {
        return Promise.resolve(new ViewController(nameOrPageOrView, params));
    }
    if (typeof nameOrPageOrView === 'string') {
        return linker.getComponentFromName(nameOrPageOrView).then(function (component) {
            return new ViewController(component, params);
        });
    }
    return Promise.resolve(null);
}
/**
 * @param {?} linker
 * @param {?} nameOrPageOrView
 * @param {?} params
 * @return {?}
 */
export function convertToView(linker, nameOrPageOrView, params) {
    if (nameOrPageOrView) {
        if (isViewController(nameOrPageOrView)) {
            // is already a ViewController
            return Promise.resolve(/** @type {?} */ (nameOrPageOrView));
        }
        return getComponent(linker, nameOrPageOrView, params);
    }
    console.error("invalid page component: " + nameOrPageOrView);
    return Promise.resolve(null);
}
/**
 * @param {?} linker
 * @param {?} pages
 * @return {?}
 */
export function convertToViews(linker, pages) {
    var /** @type {?} */ views = [];
    if (isArray(pages)) {
        for (var /** @type {?} */ i = 0; i < pages.length; i++) {
            var /** @type {?} */ page = pages[i];
            if (page) {
                if (isViewController(page)) {
                    views.push(page);
                }
                else if (page.page) {
                    views.push(convertToView(linker, page.page, page.params));
                }
                else {
                    views.push(convertToView(linker, page, null));
                }
            }
        }
    }
    return Promise.all(views);
}
var /** @type {?} */ portalZindex = 9999;
/**
 * @param {?} nav
 * @param {?} enteringView
 * @param {?} leavingView
 * @param {?} direction
 * @param {?} renderer
 * @return {?}
 */
export function setZIndex(nav, enteringView, leavingView, direction, renderer) {
    if (enteringView) {
        if (nav._isPortal) {
            if (direction === DIRECTION_FORWARD) {
                enteringView._setZIndex(nav._zIndexOffset + portalZindex, renderer);
            }
            portalZindex++;
            return;
        }
        leavingView = leavingView || nav.getPrevious(enteringView);
        if (leavingView && isPresent(leavingView._zIndex)) {
            if (direction === DIRECTION_BACK) {
                enteringView._setZIndex(leavingView._zIndex - 1, renderer);
            }
            else {
                enteringView._setZIndex(leavingView._zIndex + 1, renderer);
            }
        }
        else {
            enteringView._setZIndex(INIT_ZINDEX + nav._zIndexOffset, renderer);
        }
    }
}
/**
 * @param {?} nav
 * @return {?}
 */
export function isTabs(nav) {
    // Tabs (ion-tabs)
    return !!nav && !!nav.getSelected;
}
/**
 * @param {?} nav
 * @return {?}
 */
export function isTab(nav) {
    // Tab (ion-tab)
    return !!nav && isPresent(nav._tabId);
}
/**
 * @param {?} nav
 * @return {?}
 */
export function isNav(nav) {
    // Nav (ion-nav), Tab (ion-tab), Portal (ion-portal)
    return !!nav && !!nav.push;
}
/**
 * @hidden
 */
var DeepLinkMetadata = (function () {
    function DeepLinkMetadata() {
    }
    return DeepLinkMetadata;
}());
export { DeepLinkMetadata };
function DeepLinkMetadata_tsickle_Closure_declarations() {
    /** @type {?} */
    DeepLinkMetadata.prototype.component;
    /** @type {?} */
    DeepLinkMetadata.prototype.loadChildren;
    /** @type {?} */
    DeepLinkMetadata.prototype.name;
    /** @type {?} */
    DeepLinkMetadata.prototype.segment;
    /** @type {?} */
    DeepLinkMetadata.prototype.defaultHistory;
    /** @type {?} */
    DeepLinkMetadata.prototype.priority;
}
/**
 * @hidden
 */
export var DeepLinkMetadataFactory;
export var /** @type {?} */ STATE_NEW = 1;
export var /** @type {?} */ STATE_INITIALIZED = 2;
export var /** @type {?} */ STATE_ATTACHED = 3;
export var /** @type {?} */ STATE_DESTROYED = 4;
export var /** @type {?} */ INIT_ZINDEX = 100;
export var /** @type {?} */ DIRECTION_BACK = 'back';
export var /** @type {?} */ DIRECTION_FORWARD = 'forward';
export var /** @type {?} */ DIRECTION_SWITCH = 'switch';
//# sourceMappingURL=nav-util.js.map