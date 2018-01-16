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
   * Create method for something
   * @param opts action sheet options
   */
  @Event() ionGestureMove: EventEmitter;

  @Event({eventName: 'event-emitted'}) eventEmitted: EventEmitter;

}
