import { Component, Method } from '../../../../../index';

/**
 * This is an actionSheet class
 */
@Component({
  tag: 'ion-action-sheet',
  styleUrls: {
    ios: 'action-sheet.ios.scss',
    md: 'action-sheet.md.scss'
  }
})
class ActionSheet {

  /**
   * Create method for something
   * @param opts action sheet options
   */
  @Method()
  create(opts?: ActionSheetOptions): Promise<ActionSheet> {
  }
}
