import { Component, Event, EventEmitter } from '../../../../../index';

/**
 * This is an actionSheet class
 */
@Component({
  tag: 'ion-action-sheet',
  styleUrls: {
    ios: 'action-sheet.ios.scss',
    md: 'action-sheet.md.scss'
  },
  host: {
    theme: 'action-sheet'
  }
})
class ActionSheet {

  /**
   * Create event for something
   */
  @Event({
    eventName: 'gesture',
    bubbles: false,
    cancelable: false,
    composed: false
  }) ionGestureMove: EventEmitter;
}
