import { Component, Listen, Ionic, Prop } from '../../index';
import { ScrollCallback, ScrollDetail } from '../../util/interfaces';
import { GestureController, GestureDelegate } from '../../controllers/gesture-controller';


@Component({
  tag: 'ion-scroll',
  shadow: false
})
export class Scroll {
  private $el: HTMLElement;
  private detail: ScrollDetail = {};
  private gesture: GestureDelegate;
  private positions: number[] = [];
  private left: number;
  private top: number;
  private tmr: any;
  private queued = false;
  private isScrolling: boolean = false;

  @Prop() jsScroll: boolean = false;
  @Prop() enabled: boolean = true;

  @Prop() ionScrollStart: ScrollCallback;
  @Prop() ionScroll: ScrollCallback;
  @Prop() ionScrollEnd: ScrollCallback;


  ionViewDidLoad() {
    Ionic.controllers.gesture = (Ionic.controllers.gesture || new GestureController());

    this.gesture = (<GestureController>Ionic.controllers.gesture).createGesture('scroll', 100, false);

    if (this.jsScroll) {
      Ionic.listener.enable(this, 'touchstart', true);

    } else {
      Ionic.listener.enable(this, 'scroll', true);
    }
  }


  // Native Scroll *************************

  @Listen('scroll', { passive: true, enabled: false })
  onNativeScroll() {
    const self = this;

    if (!self.queued && self.enabled) {
      self.queued = true;

      Ionic.dom.read(function(timeStamp) {
        self.queued = false;
        self.onScroll(timeStamp || Date.now());
      });
    }
  }

  onScroll(timeStamp: number) {
    const self = this;
    const detail = self.detail;
    const positions = self.positions;

    detail.timeStamp = timeStamp;

    // get the current scrollTop
    // ******** DOM READ ****************
    detail.scrollTop = self.getTop();

    // get the current scrollLeft
    // ******** DOM READ ****************
    detail.scrollLeft = self.getLeft();

    if (!self.isScrolling) {
      // currently not scrolling, so this is a scroll start
      self.isScrolling = true;

      // remember the start positions
      detail.startY = detail.scrollTop;
      detail.startX = detail.scrollLeft;

      // new scroll, so do some resets
      detail.velocityY = detail.velocityX = detail.deltaY = detail.deltaX = positions.length = 0;

      // emit only on the first scroll event
      if (self.ionScrollStart) {
        self.ionScrollStart(detail);
      } else {
        Ionic.emit(this, 'ionScrollStart', detail);
      }
    }

    detail.directionX = detail.velocityDirectionX = (detail.deltaX > 0 ? 'left' : (detail.deltaX < 0 ? 'right' : null));
    detail.directionY = detail.velocityDirectionY = (detail.deltaY > 0 ? 'up' : (detail.deltaY < 0 ? 'down' : null));

    // actively scrolling
    positions.push(detail.scrollTop, detail.scrollLeft, detail.timeStamp);

    if (positions.length > 3) {
      // we've gotten at least 2 scroll events so far
      detail.deltaY = (detail.scrollTop - detail.startY);
      detail.deltaX = (detail.scrollLeft - detail.startX);

      var endPos = (positions.length - 1);
      var startPos = endPos;
      var timeRange = (detail.timeStamp - 100);

      // move pointer to position measured 100ms ago
      for (var i = endPos; i > 0 && positions[i] > timeRange; i -= 3) {
        startPos = i;
      }

      if (startPos !== endPos) {
        // compute relative movement between these two points
        var movedTop = (positions[startPos - 2] - positions[endPos - 2]);
        var movedLeft = (positions[startPos - 1] - positions[endPos - 1]);
        var factor = 16.67 / (positions[endPos] - positions[startPos]);

        // based on XXms compute the movement to apply for each render step
        detail.velocityY = movedTop * factor;
        detail.velocityX = movedLeft * factor;

        // figure out which direction we're scrolling
        detail.velocityDirectionX = (movedLeft > 0 ? 'left' : (movedLeft < 0 ? 'right' : null));
        detail.velocityDirectionY = (movedTop > 0 ? 'up' : (movedTop < 0 ? 'down' : null));
      }
    }

    clearTimeout(self.tmr);
    self.tmr = setTimeout(function() {

      // haven't scrolled in a while, so it's a scrollend
      self.isScrolling = false;

      Ionic.dom.read(function(timeStamp) {
        if (!self.isScrolling) {
          self.onEnd(timeStamp);
        }
      });
    }, 80);

    // emit on each scroll event
    if (self.ionScrollStart) {
      self.ionScroll(detail);
    } else {
      Ionic.emit(this, 'ionScroll', detail);
    }
  }


  onEnd(timeStamp: number) {
    const self = this;
    const detail = self.detail;

    detail.timeStamp = timeStamp || Date.now();

    // emit that the scroll has ended
    if (self.ionScrollEnd) {
      self.ionScrollEnd(detail);

    } else {
      Ionic.emit(this, 'ionScrollEnd', detail);
    }
  }


  // Touch Scroll *************************

  @Listen('touchstart', { passive: true, enabled: false })
  onTouchStart() {
    if (!this.enabled) {
      return;
    }
    throw 'jsScroll: TODO!';
  }

  @Listen('touchmove', { passive: true, enabled: false })
  onTouchMove() {
    if (!this.enabled) {
      return;
    }
  }

  @Listen('touchend', { passive: true, enabled: false })
  onTouchEnd() {
    Ionic.listener.enable(this, 'touchmove', false);
    Ionic.listener.enable(this, 'touchend', false);

    if (!this.enabled) {
      return;
    }
  }

  /**
   * DOM READ
   */
  getTop() {
    if (this.jsScroll) {
      return this.top;
    }
    return this.top = this.$el.scrollTop;
  }

  /**
   * DOM READ
   */
  getLeft() {
    if (this.jsScroll) {
      return 0;
    }
    return this.left = this.$el.scrollLeft;
  }


  ionViewWillUnload() {
    this.gesture && this.gesture.destroy();
    this.gesture = this.detail = this.detail.event = null;
  }

}

