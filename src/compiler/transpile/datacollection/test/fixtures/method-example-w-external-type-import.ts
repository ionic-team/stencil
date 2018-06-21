import { Component, Method } from '../../../../../index';
import * as t from '../../../../../declarations/app-global';

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
export class ActionSheet {

  /**
   * Create method for something
   * @param opts action sheet options
   */
  @Method()
  create(opts?: t.CoreContext): Promise<void> {
    return Promise.resolve();
  }
}
