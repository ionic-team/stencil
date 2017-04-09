import { Input, EventEmitter, ReflectiveInjector } from '@angular/core';
import { convertToView, convertToViews, DIRECTION_BACK, DIRECTION_FORWARD, INIT_ZINDEX, STATE_NEW, STATE_INITIALIZED, STATE_ATTACHED, STATE_DESTROYED } from './nav-util';
import { setZIndex } from './nav-util';
import { isBlank, isNumber, isPresent, isTrueProperty, removeArrayItem } from '../util/util';
import { isViewController, ViewController } from './view-controller';
import { Ion } from '../components/ion';
import { NavController } from './nav-controller';
import { NavParams } from './nav-params';
import { SwipeBackGesture } from './swipe-back';
/**
 * @hidden
 * This class is for internal use only. It is not exported publicly.
 */
export class NavControllerBase extends Ion {
    /**
     * @param {?} parent
     * @param {?} _app
     * @param {?} config
     * @param {?} plt
     * @param {?} _keyboard
     * @param {?} elementRef
     * @param {?} _zone
     * @param {?} renderer
     * @param {?} _cfr
     * @param {?} _gestureCtrl
     * @param {?} _trnsCtrl
     * @param {?} _linker
     * @param {?} _domCtrl
     */
    constructor(parent, _app, config, plt, _keyboard, elementRef, _zone, renderer, _cfr, _gestureCtrl, _trnsCtrl, _linker, _domCtrl) {
        super(config, elementRef, renderer);
        this.parent = parent;
        this._app = _app;
        this.config = config;
        this.plt = plt;
        this._keyboard = _keyboard;
        this._zone = _zone;
        this._cfr = _cfr;
        this._gestureCtrl = _gestureCtrl;
        this._trnsCtrl = _trnsCtrl;
        this._linker = _linker;
        this._domCtrl = _domCtrl;
        this._children = [];
        this._ids = -1;
        this._init = false;
        this._queue = [];
        this._trnsId = null;
        this._trnsTm = false;
        this._views = [];
        this._zIndexOffset = 0;
        this.viewDidLoad = new EventEmitter();
        this.viewWillEnter = new EventEmitter();
        this.viewDidEnter = new EventEmitter();
        this.viewWillLeave = new EventEmitter();
        this.viewDidLeave = new EventEmitter();
        this.viewWillUnload = new EventEmitter();
        this._sbEnabled = config.getBoolean('swipeBackEnabled');
        this.id = 'n' + (++ctrlIds);
    }
    /**
     * @return {?}
     */
    get swipeBackEnabled() {
        return this._sbEnabled;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set swipeBackEnabled(val) {
        this._sbEnabled = isTrueProperty(val);
        this._swipeBackCheck();
    }
    /**
     * @param {?} page
     * @param {?=} params
     * @param {?=} opts
     * @param {?=} done
     * @return {?}
     */
    push(page, params, opts, done) {
        return convertToView(this._linker, page, params).then(viewController => {
            return this._queueTrns({
                insertStart: -1,
                insertViews: [viewController],
                opts: opts,
            }, done);
        }).catch((err) => {
            console.error('Failed to navigate: ', err.message);
            throw err;
        });
    }
    /**
     * @param {?} insertIndex
     * @param {?} page
     * @param {?=} params
     * @param {?=} opts
     * @param {?=} done
     * @return {?}
     */
    insert(insertIndex, page, params, opts, done) {
        return convertToView(this._linker, page, params).then(viewController => {
            return this._queueTrns({
                insertStart: insertIndex,
                insertViews: [viewController],
                opts: opts,
            }, done);
        });
    }
    /**
     * @param {?} insertIndex
     * @param {?} insertPages
     * @param {?=} opts
     * @param {?=} done
     * @return {?}
     */
    insertPages(insertIndex, insertPages, opts, done) {
        return convertToViews(this._linker, insertPages).then(viewControllers => {
            return this._queueTrns({
                insertStart: insertIndex,
                insertViews: viewControllers,
                opts: opts,
            }, done);
        });
    }
    /**
     * @param {?=} opts
     * @param {?=} done
     * @return {?}
     */
    pop(opts, done) {
        return this._queueTrns({
            removeStart: -1,
            removeCount: 1,
            opts: opts,
        }, done);
    }
    /**
     * @param {?} indexOrViewCtrl
     * @param {?=} opts
     * @param {?=} done
     * @return {?}
     */
    popTo(indexOrViewCtrl, opts, done) {
        let /** @type {?} */ config = {
            removeStart: -1,
            removeCount: -1,
            opts: opts
        };
        if (isViewController(indexOrViewCtrl)) {
            config.removeView = indexOrViewCtrl;
            config.removeStart = 1;
        }
        else if (isNumber(indexOrViewCtrl)) {
            config.removeStart = indexOrViewCtrl + 1;
        }
        return this._queueTrns(config, done);
    }
    /**
     * @param {?=} opts
     * @param {?=} done
     * @return {?}
     */
    popToRoot(opts, done) {
        return this._queueTrns({
            removeStart: 1,
            removeCount: -1,
            opts: opts,
        }, done);
    }
    /**
     * @return {?}
     */
    popAll() {
        let /** @type {?} */ promises = [];
        for (var /** @type {?} */ i = this._views.length - 1; i >= 0; i--) {
            promises.push(this.pop(null));
        }
        return Promise.all(promises);
    }
    /**
     * @param {?} startIndex
     * @param {?=} removeCount
     * @param {?=} opts
     * @param {?=} done
     * @return {?}
     */
    remove(startIndex, removeCount = 1, opts, done) {
        return this._queueTrns({
            removeStart: startIndex,
            removeCount: removeCount,
            opts: opts,
        }, done);
    }
    /**
     * @param {?} viewController
     * @param {?=} opts
     * @param {?=} done
     * @return {?}
     */
    removeView(viewController, opts, done) {
        return this._queueTrns({
            removeView: viewController,
            removeStart: 0,
            removeCount: 1,
            opts: opts,
        }, done);
    }
    /**
     * @param {?} pageOrViewCtrl
     * @param {?=} params
     * @param {?=} opts
     * @param {?=} done
     * @return {?}
     */
    setRoot(pageOrViewCtrl, params, opts, done) {
        return convertToView(this._linker, pageOrViewCtrl, params).then((viewController) => {
            return this._setPages([viewController], opts, done);
        });
    }
    /**
     * @param {?} pages
     * @param {?=} opts
     * @param {?=} done
     * @return {?}
     */
    setPages(pages, opts, done) {
        return convertToViews(this._linker, pages).then(viewControllers => {
            return this._setPages(viewControllers, opts, done);
        });
    }
    /**
     * @param {?} viewControllers
     * @param {?=} opts
     * @param {?=} done
     * @return {?}
     */
    _setPages(viewControllers, opts, done) {
        if (isBlank(opts)) {
            opts = {};
        }
        // if animation wasn't set to true then default it to NOT animate
        if (opts.animate !== true) {
            opts.animate = false;
        }
        return this._queueTrns({
            insertStart: 0,
            insertViews: viewControllers,
            removeStart: 0,
            removeCount: -1,
            opts: opts
        }, done);
    }
    /**
     * @param {?} ti
     * @param {?} done
     * @return {?}
     */
    _queueTrns(ti, done) {
        let /** @type {?} */ promise;
        let /** @type {?} */ resolve = done;
        let /** @type {?} */ reject = done;
        if (done === undefined) {
            // only create a promise if a done callback wasn't provided
            // done can be a null, which avoids any functions
            promise = new Promise((res, rej) => {
                resolve = res;
                reject = rej;
            });
        }
        // ti.resolve() is called when the navigation transition is finished successfully
        ti.resolve = (hasCompleted, isAsync, enteringName, leavingName, direction) => {
            this._trnsId = null;
            this._init = true;
            resolve && resolve(hasCompleted, isAsync, enteringName, leavingName, direction);
            // let's see if there's another to kick off
            this.setTransitioning(false);
            this._swipeBackCheck();
            this._nextTrns();
        };
        // ti.reject() is called when the navigation transition fails. ie. it is rejected at some point.
        ti.reject = (rejectReason, transition) => {
            this._trnsId = null;
            this._queue.length = 0;
            // walk through the transition views so they are destroyed
            while (transition) {
                var /** @type {?} */ enteringView = transition.enteringView;
                if (enteringView && (enteringView._state === STATE_ATTACHED)) {
                    this._destroyView(enteringView);
                }
                if (transition.isRoot()) {
                    this._trnsCtrl.destroy(transition.trnsId);
                    break;
                }
                transition = transition.parent;
            }
            reject && reject(false, false, rejectReason);
            // let's see if there's another to kick off
            this.setTransitioning(false);
            this._swipeBackCheck();
            this._nextTrns();
        };
        if (ti.insertViews) {
            // ensure we've got good views to insert
            ti.insertViews = ti.insertViews.filter(v => v !== null);
            if (ti.insertViews.length === 0) {
                ti.reject('invalid views to insert');
                return promise;
            }
        }
        else if (isPresent(ti.removeStart) && this._views.length === 0 && !this._isPortal) {
            ti.reject('no views in the stack to be removed');
            return promise;
        }
        this._queue.push(ti);
        // if there isn't a transition already happening
        // then this will kick off this transition
        this._nextTrns();
        // promise is undefined if a done callbacks was provided
        return promise;
    }
    /**
     * @return {?}
     */
    _nextTrns() {
        // this is the framework's bread 'n butta function
        // only one transition is allowed at any given time
        if (this.isTransitioning()) {
            return false;
        }
        // there is no transition happening right now
        // get the next instruction
        const /** @type {?} */ ti = this._nextTI();
        if (!ti) {
            return false;
        }
        // ensure any of the inserted view are used
        const /** @type {?} */ insertViews = ti.insertViews;
        if (insertViews) {
            for (var /** @type {?} */ i = 0; i < insertViews.length; i++) {
                var /** @type {?} */ nav = insertViews[i]._nav;
                if (nav && nav !== this || insertViews[i]._state === STATE_DESTROYED) {
                    ti.reject('leavingView and enteringView are null. stack is already empty');
                    return false;
                }
            }
        }
        // get entering and leaving views
        const /** @type {?} */ leavingView = this.getActive();
        const /** @type {?} */ enteringView = this._getEnteringView(ti, leavingView);
        if (!leavingView && !enteringView) {
            ti.reject('leavingView and enteringView are null. stack is already empty');
            return false;
        }
        // set that this nav is actively transitioning
        this.setTransitioning(true);
        // Initialize enteringView
        if (enteringView && enteringView._state === STATE_NEW) {
            // render the entering view, and all child navs and views
            // ******** DOM WRITE ****************
            this._viewInit(enteringView);
        }
        // Only test canLeave/canEnter if there is transition
        const /** @type {?} */ requiresTransition = ti.requiresTransition = (ti.enteringRequiresTransition || ti.leavingRequiresTransition) && enteringView !== leavingView;
        if (requiresTransition) {
            // views have been initialized, now let's test
            // to see if the transition is even allowed or not
            return this._viewTest(enteringView, leavingView, ti);
        }
        else {
            return this._postViewInit(enteringView, leavingView, ti);
        }
    }
    /**
     * @return {?}
     */
    _nextTI() {
        const /** @type {?} */ ti = this._queue.shift();
        if (!ti) {
            return null;
        }
        const /** @type {?} */ viewsLength = this._views.length;
        if (isPresent(ti.removeView)) {
            (void 0) /* assert */;
            (void 0) /* assert */;
            var /** @type {?} */ index = this._views.indexOf(ti.removeView);
            if (index >= 0) {
                ti.removeStart += index;
            }
        }
        if (isPresent(ti.removeStart)) {
            if (ti.removeStart < 0) {
                ti.removeStart = (viewsLength - 1);
            }
            if (ti.removeCount < 0) {
                ti.removeCount = (viewsLength - ti.removeStart);
            }
            ti.leavingRequiresTransition = ((ti.removeStart + ti.removeCount) === viewsLength);
        }
        if (ti.insertViews) {
            // allow -1 to be passed in to auto push it on the end
            // and clean up the index if it's larger then the size of the stack
            if (ti.insertStart < 0 || ti.insertStart > viewsLength) {
                ti.insertStart = viewsLength;
            }
            ti.enteringRequiresTransition = (ti.insertStart === viewsLength);
        }
        return ti;
    }
    /**
     * @param {?} ti
     * @param {?} leavingView
     * @return {?}
     */
    _getEnteringView(ti, leavingView) {
        const /** @type {?} */ insertViews = ti.insertViews;
        if (insertViews) {
            // grab the very last view of the views to be inserted
            // and initialize it as the new entering view
            return insertViews[insertViews.length - 1];
        }
        const /** @type {?} */ removeStart = ti.removeStart;
        if (isPresent(removeStart)) {
            var /** @type {?} */ views = this._views;
            var /** @type {?} */ removeEnd = removeStart + ti.removeCount;
            var /** @type {?} */ i;
            var /** @type {?} */ view;
            for (i = views.length - 1; i >= 0; i--) {
                view = views[i];
                if ((i < removeStart || i >= removeEnd) && view !== leavingView) {
                    return view;
                }
            }
        }
        return null;
    }
    /**
     * @param {?} enteringView
     * @param {?} leavingView
     * @param {?} ti
     * @return {?}
     */
    _postViewInit(enteringView, leavingView, ti) {
        (void 0) /* assert */;
        (void 0) /* assert */;
        (void 0) /* assert */;
        const /** @type {?} */ opts = ti.opts || {};
        const /** @type {?} */ insertViews = ti.insertViews;
        const /** @type {?} */ removeStart = ti.removeStart;
        const /** @type {?} */ removeCount = ti.removeCount;
        let /** @type {?} */ view;
        let /** @type {?} */ i;
        let /** @type {?} */ destroyQueue;
        // there are views to remove
        if (isPresent(removeStart)) {
            (void 0) /* assert */;
            (void 0) /* assert */;
            destroyQueue = [];
            for (i = 0; i < removeCount; i++) {
                view = this._views[i + removeStart];
                if (view && view !== enteringView && view !== leavingView) {
                    destroyQueue.push(view);
                }
            }
            // default the direction to "back"
            opts.direction = opts.direction || DIRECTION_BACK;
        }
        const /** @type {?} */ finalBalance = this._views.length + (insertViews ? insertViews.length : 0) - (removeCount ? removeCount : 0);
        (void 0) /* assert */;
        if (finalBalance === 0 && !this._isPortal) {
            console.warn(`You can't remove all the pages in the navigation stack. nav.pop() is probably called too many times.`, this, this.getNativeElement());
            ti.reject('navigation stack needs at least one root page');
            return false;
        }
        // there are views to insert
        if (insertViews) {
            // manually set the new view's id if an id was passed in the options
            if (isPresent(opts.id)) {
                enteringView.id = opts.id;
            }
            // add the views to the
            for (i = 0; i < insertViews.length; i++) {
                view = insertViews[i];
                this._insertViewAt(view, ti.insertStart + i);
            }
            if (ti.enteringRequiresTransition) {
                // default to forward if not already set
                opts.direction = opts.direction || DIRECTION_FORWARD;
            }
        }
        // if the views to be removed are in the beginning or middle
        // and there is not a view that needs to visually transition out
        // then just destroy them and don't transition anything
        // batch all of lifecycles together
        // let's make sure, callbacks are zoned
        if (destroyQueue && destroyQueue.length > 0) {
            this._zone.run(() => {
                for (i = 0; i < destroyQueue.length; i++) {
                    view = destroyQueue[i];
                    this._willLeave(view, true);
                    this._didLeave(view);
                    this._willUnload(view);
                }
            });
            // once all lifecycle events has been delivered, we can safely detroy the views
            for (i = 0; i < destroyQueue.length; i++) {
                this._destroyView(destroyQueue[i]);
            }
        }
        if (!ti.requiresTransition) {
            // transition is not required, so we are already done!
            // they're inserting/removing the views somewhere in the middle or
            // beginning, so visually nothing needs to animate/transition
            // resolve immediately because there's no animation that's happening
            ti.resolve(true, false);
            return true;
        }
        // set which animation it should use if it wasn't set yet
        if (!opts.animation) {
            if (isPresent(ti.removeStart)) {
                opts.animation = (leavingView || enteringView).getTransitionName(opts.direction);
            }
            else {
                opts.animation = (enteringView || leavingView).getTransitionName(opts.direction);
            }
        }
        // huzzah! let us transition these views
        this._transitionInit(enteringView, leavingView, opts, ti.resolve);
        return true;
    }
    /**
     * DOM WRITE
     * @param {?} enteringView
     * @return {?}
     */
    _viewInit(enteringView) {
        (void 0) /* assert */;
        (void 0) /* assert */;
        // entering view has not been initialized yet
        const /** @type {?} */ componentProviders = ReflectiveInjector.resolve([
            { provide: NavController, useValue: this },
            { provide: ViewController, useValue: enteringView },
            { provide: NavParams, useValue: enteringView.getNavParams() }
        ]);
        const /** @type {?} */ componentFactory = this._linker.resolveComponent(enteringView.component);
        const /** @type {?} */ childInjector = ReflectiveInjector.fromResolvedProviders(componentProviders, this._viewport.parentInjector);
        // create ComponentRef and set it to the entering view
        enteringView.init(componentFactory.create(childInjector, []));
        enteringView._state = STATE_INITIALIZED;
        this._preLoad(enteringView);
    }
    /**
     * @param {?} view
     * @param {?} componentRef
     * @param {?} viewport
     * @return {?}
     */
    _viewAttachToDOM(view, componentRef, viewport) {
        (void 0) /* assert */;
        (void 0) /* assert */;
        // fire willLoad before change detection runs
        this._willLoad(view);
        // render the component ref instance to the DOM
        // ******** DOM WRITE ****************
        viewport.insert(componentRef.hostView, viewport.length);
        view._state = STATE_ATTACHED;
        if (view._cssClass) {
            // the ElementRef of the actual ion-page created
            var /** @type {?} */ pageElement = componentRef.location.nativeElement;
            // ******** DOM WRITE ****************
            this._renderer.setElementClass(pageElement, view._cssClass, true);
        }
        componentRef.changeDetectorRef.detectChanges();
        // successfully finished loading the entering view
        // fire off the "didLoad" lifecycle events
        this._zone.run(this._didLoad.bind(this, view));
    }
    /**
     * @param {?} enteringView
     * @param {?} leavingView
     * @param {?} ti
     * @return {?}
     */
    _viewTest(enteringView, leavingView, ti) {
        const /** @type {?} */ promises = [];
        if (leavingView) {
            var /** @type {?} */ leavingTestResult = leavingView._lifecycleTest('Leave');
            if (leavingTestResult === false) {
                // synchronous reject
                ti.reject((leavingTestResult !== false ? leavingTestResult : `ionViewCanLeave rejected`));
                return false;
            }
            else if (leavingTestResult instanceof Promise) {
                // async promise
                promises.push(leavingTestResult);
            }
        }
        if (enteringView) {
            var /** @type {?} */ enteringTestResult = enteringView._lifecycleTest('Enter');
            if (enteringTestResult === false) {
                // synchronous reject
                ti.reject((enteringTestResult !== false ? enteringTestResult : `ionViewCanEnter rejected`));
                return false;
            }
            else if (enteringTestResult instanceof Promise) {
                // async promise
                promises.push(enteringTestResult);
            }
        }
        if (promises.length) {
            // darn, async promises, gotta wait for them to resolve
            Promise.all(promises).then((values) => {
                if (values.some(result => result === false)) {
                    ti.reject(`ionViewCanEnter rejected`);
                }
                else {
                    this._postViewInit(enteringView, leavingView, ti);
                }
            }).catch(ti.reject);
            return true;
        }
        else {
            // synchronous and all tests passed! let's move on already
            return this._postViewInit(enteringView, leavingView, ti);
        }
    }
    /**
     * @param {?} enteringView
     * @param {?} leavingView
     * @param {?} opts
     * @param {?} resolve
     * @return {?}
     */
    _transitionInit(enteringView, leavingView, opts, resolve) {
        // figure out if this transition is the root one or a
        // child of a parent nav that has the root transition
        this._trnsId = this._trnsCtrl.getRootTrnsId(this);
        if (this._trnsId === null) {
            // this is the root transition, meaning all child navs and their views
            // should be added as a child transition to this one
            this._trnsId = this._trnsCtrl.nextId();
        }
        // create the transition options
        const /** @type {?} */ animationOpts = {
            animation: opts.animation,
            direction: opts.direction,
            duration: (opts.animate === false ? 0 : opts.duration),
            easing: opts.easing,
            isRTL: this._config.plt.isRTL(),
            ev: opts.ev,
        };
        // create the transition animation from the TransitionController
        // this will either create the root transition, or add it as a child transition
        const /** @type {?} */ transition = this._trnsCtrl.get(this._trnsId, enteringView, leavingView, animationOpts);
        // ensure any swipeback transitions are cleared out
        this._sbTrns && this._sbTrns.destroy();
        this._sbTrns = null;
        // swipe to go back root transition
        if (transition.isRoot() && opts.progressAnimation) {
            this._sbTrns = transition;
        }
        // transition start has to be registered before attaching the view to the DOM!
        transition.registerStart(() => {
            this._transitionStart(transition, enteringView, leavingView, opts, resolve);
            if (transition.parent) {
                transition.parent.start();
            }
        });
        if (enteringView && (enteringView._state === STATE_INITIALIZED)) {
            // render the entering component in the DOM
            // this would also render new child navs/views
            // which may have their very own async canEnter/Leave tests
            // ******** DOM WRITE ****************
            this._viewAttachToDOM(enteringView, enteringView._cmp, this._viewport);
        }
        if (!transition.hasChildren) {
            // lowest level transition, so kick it off and let it bubble up to start all of them
            transition.start();
        }
    }
    /**
     * @param {?} transition
     * @param {?} enteringView
     * @param {?} leavingView
     * @param {?} opts
     * @param {?} resolve
     * @return {?}
     */
    _transitionStart(transition, enteringView, leavingView, opts, resolve) {
        (void 0) /* assert */;
        this._trnsId = null;
        // set the correct zIndex for the entering and leaving views
        // ******** DOM WRITE ****************
        setZIndex(this, enteringView, leavingView, opts.direction, this._renderer);
        // always ensure the entering view is viewable
        // ******** DOM WRITE ****************
        enteringView && enteringView._domShow(true, this._renderer);
        // always ensure the leaving view is viewable
        // ******** DOM WRITE ****************
        leavingView && leavingView._domShow(true, this._renderer);
        // initialize the transition
        transition.init();
        // we should animate (duration > 0) if the pushed page is not the first one (startup)
        // or if it is a portal (modal, actionsheet, etc.)
        const /** @type {?} */ isFirstPage = !this._init && this._views.length === 1;
        const /** @type {?} */ shouldNotAnimate = isFirstPage && !this._isPortal;
        const /** @type {?} */ canNotAnimate = this._config.get('animate') === false;
        if (shouldNotAnimate || canNotAnimate) {
            opts.animate = false;
        }
        if (opts.animate === false) {
            // if it was somehow set to not animation, then make the duration zero
            transition.duration(0);
        }
        // create a callback that needs to run within zone
        // that will fire off the willEnter/Leave lifecycle events at the right time
        transition.beforeAddRead(this._viewsWillLifecycles.bind(this, enteringView, leavingView));
        // create a callback for when the animation is done
        transition.onFinish(() => {
            // transition animation has ended
            this._zone.run(this._transitionFinish.bind(this, transition, opts, resolve));
        });
        // get the set duration of this transition
        const /** @type {?} */ duration = transition.getDuration();
        if (transition.isRoot()) {
            // this is the top most, or only active transition, so disable the app
            // add XXms to the duration the app is disabled when the keyboard is open
            if (duration > DISABLE_APP_MINIMUM_DURATION && opts.disableApp !== false) {
                // if this transition has a duration and this is the root transition
                // then set that the app is actively disabled
                this._app.setEnabled(false, duration + ACTIVE_TRANSITION_OFFSET, opts.minClickBlockDuration);
            }
            else {
                (void 0) /* console.debug */;
            }
            // cool, let's do this, start the transition
            if (opts.progressAnimation) {
                // this is a swipe to go back, just get the transition progress ready
                // kick off the swipe animation start
                transition.progressStart();
            }
            else {
                // only the top level transition should actually start "play"
                // kick it off and let it play through
                // ******** DOM WRITE ****************
                transition.play();
            }
        }
    }
    /**
     * @param {?} transition
     * @param {?} opts
     * @param {?} resolve
     * @return {?}
     */
    _transitionFinish(transition, opts, resolve) {
        const /** @type {?} */ hasCompleted = transition.hasCompleted;
        const /** @type {?} */ enteringView = transition.enteringView;
        const /** @type {?} */ leavingView = transition.leavingView;
        // mainly for testing
        let /** @type {?} */ enteringName;
        let /** @type {?} */ leavingName;
        if (hasCompleted) {
            // transition has completed (went from 0 to 1)
            if (enteringView) {
                enteringName = enteringView.name;
                this._didEnter(enteringView);
            }
            if (leavingView) {
                leavingName = leavingView.name;
                this._didLeave(leavingView);
            }
            this._cleanup(enteringView);
        }
        else {
            // If transition does not complete, we have to cleanup anyway, because
            // previous pages in the stack are not hidden probably.
            this._cleanup(leavingView);
        }
        if (transition.isRoot()) {
            // this is the root transition
            // it's safe to destroy this transition
            this._trnsCtrl.destroy(transition.trnsId);
            // it's safe to enable the app again
            this._app.setEnabled(true);
            if (!this.hasChildren() && opts.updateUrl !== false) {
                // notify deep linker of the nav change
                // if a direction was provided and should update url
                this._linker.navChange(opts.direction);
            }
            if (opts.keyboardClose !== false) {
                // the keyboard is still open!
                // no problem, let's just close for them
                this._keyboard.close();
            }
        }
        // congrats, we did it!
        resolve(hasCompleted, true, enteringName, leavingName, opts.direction);
    }
    /**
     * @param {?} enteringView
     * @param {?} leavingView
     * @return {?}
     */
    _viewsWillLifecycles(enteringView, leavingView) {
        if (enteringView || leavingView) {
            this._zone.run(() => {
                // Here, the order is important. WillLeave must be called before WillEnter.
                leavingView && this._willLeave(leavingView, !enteringView);
                enteringView && this._willEnter(enteringView);
            });
        }
    }
    /**
     * @param {?} view
     * @param {?} index
     * @return {?}
     */
    _insertViewAt(view, index) {
        const /** @type {?} */ existingIndex = this._views.indexOf(view);
        if (existingIndex > -1) {
            // this view is already in the stack!!
            // move it to its new location
            (void 0) /* assert */;
            this._views.splice(index, 0, this._views.splice(existingIndex, 1)[0]);
        }
        else {
            (void 0) /* assert */;
            // this is a new view to add to the stack
            // create the new entering view
            view._setNav(this);
            // give this inserted view an ID
            this._ids++;
            if (!view.id) {
                view.id = `${this.id}-${this._ids}`;
            }
            // insert the entering view into the correct index in the stack
            this._views.splice(index, 0, view);
        }
    }
    /**
     * @param {?} view
     * @return {?}
     */
    _removeView(view) {
        (void 0) /* assert */;
        const /** @type {?} */ views = this._views;
        const /** @type {?} */ index = views.indexOf(view);
        (void 0) /* assert */;
        if (index >= 0) {
            views.splice(index, 1);
        }
    }
    /**
     * @param {?} view
     * @return {?}
     */
    _destroyView(view) {
        view._destroy(this._renderer);
        this._removeView(view);
    }
    /**
     * DOM WRITE
     * @param {?} activeView
     * @return {?}
     */
    _cleanup(activeView) {
        // ok, cleanup time!! Destroy all of the views that are
        // INACTIVE and come after the active view
        const /** @type {?} */ activeViewIndex = this._views.indexOf(activeView);
        const /** @type {?} */ views = this._views;
        let /** @type {?} */ reorderZIndexes = false;
        let /** @type {?} */ view;
        let /** @type {?} */ i;
        for (i = views.length - 1; i >= 0; i--) {
            view = views[i];
            if (i > activeViewIndex) {
                // this view comes after the active view
                // let's unload it
                this._willUnload(view);
                this._destroyView(view);
            }
            else if (i < activeViewIndex && !this._isPortal) {
                // this view comes before the active view
                // and it is not a portal then ensure it is hidden
                view._domShow(false, this._renderer);
            }
            if (view._zIndex <= 0) {
                reorderZIndexes = true;
            }
        }
        if (!this._isPortal && reorderZIndexes) {
            for (i = 0; i < views.length; i++) {
                view = views[i];
                // ******** DOM WRITE ****************
                view._setZIndex(view._zIndex + INIT_ZINDEX + 1, this._renderer);
            }
        }
    }
    /**
     * @param {?} view
     * @return {?}
     */
    _preLoad(view) {
        (void 0) /* assert */;
        view._preLoad();
    }
    /**
     * @param {?} view
     * @return {?}
     */
    _willLoad(view) {
        (void 0) /* assert */;
        view._willLoad();
    }
    /**
     * @param {?} view
     * @return {?}
     */
    _didLoad(view) {
        (void 0) /* assert */;
        (void 0) /* assert */;
        view._didLoad();
        this.viewDidLoad.emit(view);
        this._app.viewDidLoad.emit(view);
    }
    /**
     * @param {?} view
     * @return {?}
     */
    _willEnter(view) {
        (void 0) /* assert */;
        (void 0) /* assert */;
        view._willEnter();
        this.viewWillEnter.emit(view);
        this._app.viewWillEnter.emit(view);
    }
    /**
     * @param {?} view
     * @return {?}
     */
    _didEnter(view) {
        (void 0) /* assert */;
        (void 0) /* assert */;
        view._didEnter();
        this.viewDidEnter.emit(view);
        this._app.viewDidEnter.emit(view);
    }
    /**
     * @param {?} view
     * @param {?} willUnload
     * @return {?}
     */
    _willLeave(view, willUnload) {
        (void 0) /* assert */;
        (void 0) /* assert */;
        view._willLeave(willUnload);
        this.viewWillLeave.emit(view);
        this._app.viewWillLeave.emit(view);
    }
    /**
     * @param {?} view
     * @return {?}
     */
    _didLeave(view) {
        (void 0) /* assert */;
        (void 0) /* assert */;
        view._didLeave();
        this.viewDidLeave.emit(view);
        this._app.viewDidLeave.emit(view);
    }
    /**
     * @param {?} view
     * @return {?}
     */
    _willUnload(view) {
        (void 0) /* assert */;
        (void 0) /* assert */;
        view._willUnload();
        this.viewWillUnload.emit(view);
        this._app.viewWillUnload.emit(view);
    }
    /**
     * @return {?}
     */
    hasChildren() {
        return this._children.length > 0;
    }
    /**
     * @return {?}
     */
    getActiveChildNav() {
        return this._children[this._children.length - 1];
    }
    /**
     * @param {?} nav
     * @return {?}
     */
    registerChildNav(nav) {
        this._children.push(nav);
    }
    /**
     * @param {?} nav
     * @return {?}
     */
    unregisterChildNav(nav) {
        removeArrayItem(this._children, nav);
    }
    /**
     * @return {?}
     */
    destroy() {
        const /** @type {?} */ views = this._views;
        let /** @type {?} */ view;
        for (var /** @type {?} */ i = 0; i < views.length; i++) {
            view = views[i];
            view._willUnload();
            view._destroy(this._renderer);
        }
        // release swipe back gesture and transition
        this._sbGesture && this._sbGesture.destroy();
        this._sbTrns && this._sbTrns.destroy();
        this._queue = this._views = this._sbGesture = this._sbTrns = null;
        // Unregister navcontroller
        if (this.parent && this.parent.unregisterChildNav) {
            this.parent.unregisterChildNav(this);
        }
    }
    /**
     * @return {?}
     */
    swipeBackStart() {
        if (this.isTransitioning() || this._queue.length > 0) {
            return;
        }
        // default the direction to "back";
        const /** @type {?} */ opts = {
            direction: DIRECTION_BACK,
            progressAnimation: true
        };
        this._queueTrns({
            removeStart: -1,
            removeCount: 1,
            opts: opts,
        }, null);
    }
    /**
     * @param {?} stepValue
     * @return {?}
     */
    swipeBackProgress(stepValue) {
        if (this._sbTrns && this._sbGesture) {
            // continue to disable the app while actively dragging
            this._app.setEnabled(false, ACTIVE_TRANSITION_DEFAULT);
            this.setTransitioning(true);
            // set the transition animation's progress
            this._sbTrns.progressStep(stepValue);
        }
    }
    /**
     * @param {?} shouldComplete
     * @param {?} currentStepValue
     * @param {?} velocity
     * @return {?}
     */
    swipeBackEnd(shouldComplete, currentStepValue, velocity) {
        if (this._sbTrns && this._sbGesture) {
            // the swipe back gesture has ended
            var /** @type {?} */ dur = this._sbTrns.getDuration() / (Math.abs(velocity) + 1);
            this._sbTrns.progressEnd(shouldComplete, currentStepValue, dur);
        }
    }
    /**
     * @return {?}
     */
    _swipeBackCheck() {
        if (this.canSwipeBack()) {
            if (!this._sbGesture) {
                this._sbGesture = new SwipeBackGesture(this.plt, this, this._gestureCtrl, this._domCtrl);
            }
            this._sbGesture.listen();
        }
        else if (this._sbGesture) {
            this._sbGesture.unlisten();
        }
    }
    /**
     * @return {?}
     */
    canSwipeBack() {
        return (this._sbEnabled &&
            !this._isPortal &&
            this._children.length <= 1 &&
            !this.isTransitioning() &&
            this._app.isEnabled() &&
            this.canGoBack());
    }
    /**
     * @return {?}
     */
    canGoBack() {
        const /** @type {?} */ activeView = this.getActive();
        return !!(activeView && activeView.enableBack());
    }
    /**
     * @return {?}
     */
    isTransitioning() {
        return this._trnsTm;
    }
    /**
     * @param {?} isTransitioning
     * @return {?}
     */
    setTransitioning(isTransitioning) {
        this._trnsTm = isTransitioning;
    }
    /**
     * @return {?}
     */
    getActive() {
        return this._views[this._views.length - 1];
    }
    /**
     * @param {?} view
     * @return {?}
     */
    isActive(view) {
        return (view === this.getActive());
    }
    /**
     * @param {?} index
     * @return {?}
     */
    getByIndex(index) {
        return this._views[index];
    }
    /**
     * @param {?=} view
     * @return {?}
     */
    getPrevious(view) {
        // returns the view controller which is before the given view controller.
        if (!view) {
            view = this.getActive();
        }
        const /** @type {?} */ views = this._views;
        return views[views.indexOf(view) - 1];
    }
    /**
     * @return {?}
     */
    first() {
        // returns the first view controller in this nav controller's stack.
        return this._views[0];
    }
    /**
     * @return {?}
     */
    last() {
        // returns the last page in this nav controller's stack.
        return this._views[this._views.length - 1];
    }
    /**
     * @param {?} view
     * @return {?}
     */
    indexOf(view) {
        // returns the index number of the given view controller.
        return this._views.indexOf(view);
    }
    /**
     * @return {?}
     */
    length() {
        return this._views.length;
    }
    /**
     * Return the stack of views in this NavController.
     * @return {?}
     */
    getViews() {
        return this._views;
    }
    /**
     * @return {?}
     */
    isSwipeBackEnabled() {
        return this._sbEnabled;
    }
    /**
     * @return {?}
     */
    dismissPageChangeViews() {
        for (let /** @type {?} */ view of this._views) {
            if (view.data && view.data.dismissOnPageChange) {
                view.dismiss().catch(null);
            }
        }
    }
    /**
     * @param {?} val
     * @return {?}
     */
    setViewport(val) {
        this._viewport = val;
    }
    /**
     * @return {?}
     */
    resize() {
        const /** @type {?} */ active = this.getActive();
        if (!active) {
            return;
        }
        const /** @type {?} */ content = active.getIONContent();
        content && content.resize();
    }
}
NavControllerBase.propDecorators = {
    'swipeBackEnabled': [{ type: Input },],
};
function NavControllerBase_tsickle_Closure_declarations() {
    /** @type {?} */
    NavControllerBase.propDecorators;
    /** @type {?} */
    NavControllerBase.prototype._children;
    /** @type {?} */
    NavControllerBase.prototype._ids;
    /** @type {?} */
    NavControllerBase.prototype._init;
    /** @type {?} */
    NavControllerBase.prototype._isPortal;
    /** @type {?} */
    NavControllerBase.prototype._queue;
    /** @type {?} */
    NavControllerBase.prototype._sbEnabled;
    /** @type {?} */
    NavControllerBase.prototype._sbGesture;
    /** @type {?} */
    NavControllerBase.prototype._sbTrns;
    /** @type {?} */
    NavControllerBase.prototype._trnsId;
    /** @type {?} */
    NavControllerBase.prototype._trnsTm;
    /** @type {?} */
    NavControllerBase.prototype._viewport;
    /** @type {?} */
    NavControllerBase.prototype._views;
    /** @type {?} */
    NavControllerBase.prototype._zIndexOffset;
    /** @type {?} */
    NavControllerBase.prototype.viewDidLoad;
    /** @type {?} */
    NavControllerBase.prototype.viewWillEnter;
    /** @type {?} */
    NavControllerBase.prototype.viewDidEnter;
    /** @type {?} */
    NavControllerBase.prototype.viewWillLeave;
    /** @type {?} */
    NavControllerBase.prototype.viewDidLeave;
    /** @type {?} */
    NavControllerBase.prototype.viewWillUnload;
    /** @type {?} */
    NavControllerBase.prototype.id;
    /** @type {?} */
    NavControllerBase.prototype.parent;
    /** @type {?} */
    NavControllerBase.prototype._app;
    /** @type {?} */
    NavControllerBase.prototype.config;
    /** @type {?} */
    NavControllerBase.prototype.plt;
    /** @type {?} */
    NavControllerBase.prototype._keyboard;
    /** @type {?} */
    NavControllerBase.prototype._zone;
    /** @type {?} */
    NavControllerBase.prototype._cfr;
    /** @type {?} */
    NavControllerBase.prototype._gestureCtrl;
    /** @type {?} */
    NavControllerBase.prototype._trnsCtrl;
    /** @type {?} */
    NavControllerBase.prototype._linker;
    /** @type {?} */
    NavControllerBase.prototype._domCtrl;
}
let /** @type {?} */ ctrlIds = -1;
const /** @type {?} */ DISABLE_APP_MINIMUM_DURATION = 64;
const /** @type {?} */ ACTIVE_TRANSITION_DEFAULT = 5000;
const /** @type {?} */ ACTIVE_TRANSITION_OFFSET = 2000;
//# sourceMappingURL=nav-controller-base.js.map