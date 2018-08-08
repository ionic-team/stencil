import { Component, Listen } from '../../../../../index';

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
   * Create listen for something
   */
  @Listen('body:ionActionSheetDidLoad')
  protected viewDidLoad(ev: ActionSheetEvent) {
    const actionSheet = ev.detail.actionSheet;
    const actionSheetResolve = this.actionSheetResolves[actionSheet.actionSheetId];
    if (actionSheetResolve) {
      actionSheetResolve(actionSheet);
      delete this.actionSheetResolves[actionSheet.actionSheetId];
    }
  }

  @Listen('test')
  @Listen('test2, test3', { enabled: false })
  protected method() {

  }
}
