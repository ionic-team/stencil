import { Component, Method, PropWillChange, PropDidChange, Watch, Prop } from '../../../../../index';

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
  @State() checked: any;
  @Prop() someProp: any;
  @Prop() someProp1: any;
  @Prop() someProp2: any;
  @Prop() someProp3: any;
  @Prop({mutable: true}) prop1: any;
  @Prop({mutable: true}) prop2: any;
  @Prop({mutable: true}) prop3: any;

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

  @PropDidChange('someProp1')
  @PropDidChange('someProp2')
  @PropWillChange('someProp3')
  protected method() {

  }

  @Watch('prop1')
  @Watch('prop2')
  @Watch('prop3')
  protected propWatchCallback() {

  }

  @Watch('someProp')
  protected stateWatchCallback1() {

  }

  @Watch('someProp')
  protected stateWatchCallback2() {

  }

}
