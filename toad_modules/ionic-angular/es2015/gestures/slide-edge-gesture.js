import { SlideGesture } from './slide-gesture';
import { defaults } from '../util/util';
import { pointerCoord } from '../util/dom';
/**
 * @hidden
 */
export class SlideEdgeGesture extends SlideGesture {
    /**
     * @param {?} plt
     * @param {?} element
     * @param {?=} opts
     */
    constructor(plt, element, opts = {}) {
        defaults(opts, {
            edge: 'left',
            maxEdgeStart: 50
        });
        super(plt, element, opts);
        // Can check corners through use of eg 'left top'
        this.edges = opts.edge.split(' ');
        this.maxEdgeStart = opts.maxEdgeStart;
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    canStart(ev) {
        let /** @type {?} */ coord = pointerCoord(ev);
        this._d = this.getContainerDimensions();
        return this.edges.every(edge => this._checkEdge(edge, coord));
    }
    /**
     * @return {?}
     */
    getContainerDimensions() {
        return {
            left: 0,
            top: 0,
            width: this.plt.width(),
            height: this.plt.height()
        };
    }
    /**
     * @param {?} edge
     * @param {?} pos
     * @return {?}
     */
    _checkEdge(edge, pos) {
        switch (edge) {
            case 'left': return pos.x <= this._d.left + this.maxEdgeStart;
            case 'right': return pos.x >= this._d.width - this.maxEdgeStart;
            case 'top': return pos.y <= this._d.top + this.maxEdgeStart;
            case 'bottom': return pos.y >= this._d.height - this.maxEdgeStart;
        }
    }
}
function SlideEdgeGesture_tsickle_Closure_declarations() {
    /** @type {?} */
    SlideEdgeGesture.prototype.edges;
    /** @type {?} */
    SlideEdgeGesture.prototype.maxEdgeStart;
    /** @type {?} */
    SlideEdgeGesture.prototype._d;
}
//# sourceMappingURL=slide-edge-gesture.js.map