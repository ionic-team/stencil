import { GESTURE_PRIORITY_MENU_SWIPE, GESTURE_MENU_SWIPE } from '../../gestures/gesture-controller';
import { SlideEdgeGesture } from '../../gestures/slide-edge-gesture';
/**
 * Gesture attached to the content which the menu is assigned to
 */
export class MenuContentGesture extends SlideEdgeGesture {
    /**
     * @param {?} plt
     * @param {?} menu
     * @param {?} gestureCtrl
     * @param {?} domCtrl
     */
    constructor(plt, menu, gestureCtrl, domCtrl) {
        super(plt, plt.doc().body, {
            direction: 'x',
            edge: menu.side,
            threshold: 5,
            maxEdgeStart: menu.maxEdgeStart || 50,
            zone: false,
            passive: true,
            domController: domCtrl,
            gesture: gestureCtrl.createGesture({
                name: GESTURE_MENU_SWIPE,
                priority: GESTURE_PRIORITY_MENU_SWIPE,
                disableScroll: true
            })
        });
        this.menu = menu;
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    canStart(ev) {
        let /** @type {?} */ menu = this.menu;
        if (!menu.canSwipe()) {
            return false;
        }
        if (menu.isOpen) {
            return true;
        }
        else if (menu.getMenuController().getOpen()) {
            return false;
        }
        return super.canStart(ev);
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    onSlideBeforeStart(ev) {
        (void 0) /* console.debug */;
        this.menu._swipeBeforeStart();
    }
    /**
     * @return {?}
     */
    onSlideStart() {
        (void 0) /* console.debug */;
        this.menu._swipeStart();
    }
    /**
     * @param {?} slide
     * @param {?} ev
     * @return {?}
     */
    onSlide(slide, ev) {
        let /** @type {?} */ z = (this.menu.side === 'right' ? slide.min : slide.max);
        let /** @type {?} */ stepValue = (slide.distance / z);
        this.menu._swipeProgress(stepValue);
    }
    /**
     * @param {?} slide
     * @param {?} ev
     * @return {?}
     */
    onSlideEnd(slide, ev) {
        let /** @type {?} */ z = (this.menu.side === 'right' ? slide.min : slide.max);
        let /** @type {?} */ currentStepValue = (slide.distance / z);
        let /** @type {?} */ velocity = slide.velocity;
        z = Math.abs(z * 0.5);
        let /** @type {?} */ shouldCompleteRight = (velocity >= 0)
            && (velocity > 0.2 || slide.delta > z);
        let /** @type {?} */ shouldCompleteLeft = (velocity <= 0)
            && (velocity < -0.2 || slide.delta < -z);
        (void 0) /* console.debug */;
        this.menu._swipeEnd(shouldCompleteLeft, shouldCompleteRight, currentStepValue, velocity);
    }
    /**
     * @param {?} slide
     * @param {?} ev
     * @return {?}
     */
    getElementStartPos(slide, ev) {
        if (this.menu.side === 'right') {
            return this.menu.isOpen ? slide.min : slide.max;
        }
        // left menu
        return this.menu.isOpen ? slide.max : slide.min;
    }
    /**
     * @return {?}
     */
    getSlideBoundaries() {
        if (this.menu.side === 'right') {
            return {
                min: -this.menu.width(),
                max: 0
            };
        }
        // left menu
        return {
            min: 0,
            max: this.menu.width()
        };
    }
}
function MenuContentGesture_tsickle_Closure_declarations() {
    /** @type {?} */
    MenuContentGesture.prototype.menu;
}
//# sourceMappingURL=menu-gestures.js.map