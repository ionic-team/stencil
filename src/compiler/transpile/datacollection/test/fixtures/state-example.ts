import { Component, State } from '../../../../../index';

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

  @State() thing: string;
}
