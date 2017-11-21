import { Component, Method, PropWillChange, PropDidChange } from '../../../../../index';

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

  /**
   * CheckedChanged
   */
  @PropWillChange('checked')
  protected checkedWillChange(val: boolean) {
    this.ionChange.emit({ checked: val });
    this.emitStyle();
  }

  /**
   * ChcekdChanged
   * @param val value of checked
   */
  @PropDidChange('checked')
  protected checkedChanged(val: boolean) {
    this.ionChange.emit({ checked: val });
    this.emitStyle();
  }

}
