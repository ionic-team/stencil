import { Component, Method, Watch } from '../../../../../index';

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
   * CheckedChanged
   */
  @PropWillChange('prop1')
  protected checkedWillChange(val: boolean) {
    return;
  }

  /**
   * ChcekdChanged
   * @param val value of checked
   */
  @PropDidChange('prop2')
  protected checkedChanged(val: boolean) {
    return;
  }

  @Watch('prop3')
  protected propWatchCallback() {
    return;
  }
}
