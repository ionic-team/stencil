import { Component, Listen, Ionic, Prop } from '../../index';
import { GestureController, GestureDelegate } from './gesture-controller';
import { GestureCallback, GestureDetail } from '../../util/interfaces';
import { pointerCoordX, pointerCoordY } from '../../util/dom'
import { Recognizer, PanRecognizer } from './recognizers';


@Component({
  tag: 'ion-gesture',
  shadow: false
})
export class Gesture {
  private detail: GestureDetail = {};
  private gesture: GestureDelegate;
  private lastTouch = 0;
  private recognizer: Recognizer;

  @Prop() direction: string = 'x';
  @Prop() gestureName: string = '';
  @Prop() gesturePriority: number = 0;
  @Prop() listenOn: string = 'child';
  @Prop() maxAngle: number = 40;
  @Prop() threshold: number = 20;
  @Prop() type: string = 'pan';

  @Prop() canStart: GestureCallback;
  @Prop() onStart: GestureCallback;
  @Prop() onMove: GestureCallback;
  @Prop() onEnd: GestureCallback;
  @Prop() notCaptured: GestureCallback;


  ionViewDidLoad() {
    Ionic.controllers.gesture = (Ionic.controllers.gesture || new GestureController());

    this.gesture = (<GestureController>Ionic.controllers.gesture).createGesture(this.gestureName, this.gesturePriority, false);

    if (this.type === 'pan') {
      this.recognizer = new PanRecognizer(this.direction, this.threshold, this.maxAngle);
    }

    this.detail.type = this.type;

    Ionic.listener.enable(this, 'touchstart', true, this.listenOn);
    Ionic.listener.enable(this, 'mousedown', true, this.listenOn);
  }


  // DOWN *************************

  @Listen('touchstart', { passive: true, enabled: false })
  onTouchStart(ev: TouchEvent) {
    this.lastTouch = this.detail.timeStamp = now(ev);

    this.enableMouse(false);
    this.enableTouch(true);

    this.pointerDown(ev);
  }


  @Listen('mousedown', { passive: true, enabled: false })
  onMouseDown(ev: MouseEvent) {
    const timeStamp = now(ev);

    if (this.lastTouch === 0 || (this.lastTouch + MOUSE_WAIT < timeStamp)) {
      this.detail.timeStamp = timeStamp;
      this.enableMouse(true);
      this.enableTouch(false);

      this.pointerDown(ev);
    }
  }


  private pointerDown(ev: UIEvent): boolean {
    if (!this.recognizer || !this.gesture || this.detail.hasStarted) {
      return false;
    }

    this.detail.startX = this.detail.currentX = pointerCoordX(ev);
    this.detail.startY = this.detail.currentY = pointerCoordY(ev);
    this.detail.event = ev;

    if (this.canStart(this.detail) === false) {
      return false;
    }

    // Release fallback
    this.gesture.release();

    // Start gesture
    if (!this.gesture.start()) {
      return false;
    }

    this.detail.hasStarted = true;
    this.detail.hasCaptured = false;

    this.recognizer.start(this.detail.startX, this.detail.startY);

    return true;
  }


  // MOVE *************************

  @Listen('touchmove', { passive: true, enabled: false })
  onTouchMove(ev: TouchEvent) {
    this.lastTouch = this.detail.timeStamp = now(ev);

    this.pointerMove(ev);
  }


  @Listen('document:mousemove', { passive: true, enabled: false })
  onMoveMove(ev: TouchEvent) {
    const timeStamp = now(ev);

    if (this.lastTouch === 0 || (this.lastTouch + MOUSE_WAIT < timeStamp)) {
      this.detail.timeStamp = timeStamp;
      this.pointerMove(ev);
    }
  }

  private pointerMove(ev: UIEvent) {
    const detail = this.detail;
    detail.currentX = pointerCoordX(ev);
    detail.currentY = pointerCoordY(ev);
    detail.event = ev;

    if (detail.hasCaptured) {
      // this.debouncer.write(() => {
        if (this.onMove) {
          this.onMove(detail);
        } else {
          Ionic.emit(this, 'ionGestureMove', this.detail);
        }
      // });

    } else if (this.recognizer.detect(detail.currentX, detail.currentY)) {
      if (this.recognizer.isGesture() !== 0) {
        if (!this.tryToCapture(ev)) {
          this.abortGesture();
        }
      }
    }
  }

  private tryToCapture(ev: UIEvent): boolean {
    if (this.gesture && !this.gesture.capture()) {
      return false;
    }

    this.detail.event = ev;

    if (this.onStart) {
      this.onStart(this.detail);
    } else {
      Ionic.emit(this, 'ionGestureStart', this.detail);
    }

    this.detail.hasCaptured = true;

    return true;
  }

  private abortGesture() {
    this.detail.hasStarted = false;
    this.detail.hasCaptured = false;

    this.gesture.release();

    this.enable(false)
    this.notCaptured(this.detail);
  }


  // END *************************

  @Listen('touchend', { passive: true, enabled: false })
  onTouchEnd(ev: TouchEvent) {
    this.lastTouch = this.detail.timeStamp = now(ev);

    this.pointerUp(ev);
    this.enableTouch(false);
  }


  @Listen('document:mouseup', { passive: true, enabled: false })
  onMouseUp(ev: TouchEvent) {
    const timeStamp = now(ev);

    if (this.lastTouch === 0 || (this.lastTouch + MOUSE_WAIT < timeStamp)) {
      this.detail.timeStamp = timeStamp;
      this.pointerUp(ev);
      this.enableMouse(false);
    }
  }


  private pointerUp(ev: UIEvent) {
    const detail = this.detail;
    // this.debouncer.cancel();

    this.gesture && this.gesture.release();

    detail.event = ev;

    if (detail.hasCaptured) {
      if (this.onEnd) {
        this.onEnd(detail);
      } else {
        Ionic.emit(this, 'ionGestureEnd', detail);
      }

    } else {
      if (this.notCaptured) {
        this.notCaptured(detail);
      } else {
        Ionic.emit(this, 'ionGestureNotCaptured', detail);
      }
    }

    detail.hasCaptured = false;
    detail.hasStarted = false;
  }


  // ENABLE LISTENERS *************************

  private enableMouse(shouldEnable: boolean) {
    Ionic.listener.enable(this, 'document:mousemove', shouldEnable);
    Ionic.listener.enable(this, 'document:mouseup', shouldEnable);
  }


  private enableTouch(shouldEnable: boolean) {
    Ionic.listener.enable(this, 'touchmove', shouldEnable);
    Ionic.listener.enable(this, 'touchend', shouldEnable);
  }


  private enable(shouldEnable: boolean) {
    this.enableMouse(shouldEnable);
    this.enableTouch(shouldEnable);
  }


  ionViewWillUnload() {
    this.gesture && this.gesture.destroy();
    this.gesture = this.recognizer = this.detail = this.detail.event = null;
  }

}


const MOUSE_WAIT = 2500;

function now(ev: UIEvent) {
  return ev.timeStamp || Date.now();
}
