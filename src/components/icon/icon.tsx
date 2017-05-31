import { Component, h, Ionic, Prop } from '../index';
import { CssClassObject, VNodeData } from '../../util/interfaces';

@Component({
  tag: 'ion-icon',
  styleUrls: {
    ios: 'icon.ios.scss',
    md: 'icon.md.scss',
    wp: 'icon.wp.scss'
  },
  host: {
    theme: 'icon'
  }
})
export class Icon {
  mode: string;

  @Prop() color: string;

  /**
   * @input {string} Specifies the label to use for accessibility. Defaults to the icon name.
   */
  @Prop() label: string = '';

  /**
   * @input {string} Specifies the mode to use for the icon.
   */
  @Prop() iconMode: string = '';

  /**
   * @input {string} Specifies which icon to use. The appropriate icon will be used based on the mode.
   * For more information, see [Ionicons](/docs/ionicons/).
   */
  @Prop() name: string = '';

  /**
   * @input {string} Specifies which icon to use on `ios` mode.
   */
  @Prop() ios: string = '';

  /**
   * @input {string} Specifies which icon to use on `md` mode.
   */
  @Prop() md: string = '';

  /**
   * @input {boolean} If true, the icon is styled with an "active" appearance.
   * An active icon is filled in, and an inactive icon is the outline of the icon.
   * The `isActive` property is largely used by the tabbar. Only affects `ios` icons.
   */
  @Prop() isActive: boolean = null;

  /**
   * @input {boolean} If true, the icon is hidden.
   */
  @Prop() hidden: boolean = false;

  getElementClass(): string {
    let iconName: string;

    // If no name was passed set iconName to null
    if (!this.name) {
      iconName = null;
    } else if (!(/^md-|^ios-|^logo-/.test(this.name))) {
      // this does not have one of the defaults
      // so lets auto add in the mode prefix for them
      iconName = this.iconMode + '-' + this.name;
    } else if (this.name) {
      iconName = this.name;
    }

    // If an icon was passed in using the ios or md attributes
    // set the iconName to whatever was passed in
    if (this.ios && this.iconMode === 'ios') {
      iconName = this.ios;
    } else if (this.md && this.iconMode === 'md') {
      iconName = this.md;
    }

    if ((iconName === null) || (this.hidden === true)) {
      console.warn('Icon is hidden.');
      return 'hide';
    }

    let iconMode = iconName.split('-', 2)[0];
    if (
      iconMode === 'ios' &&
      this.isActive === false &&
      iconName.indexOf('logo-') < 0 &&
      iconName.indexOf('-outline') < 0) {
      iconName += '-outline';
    }

    let label = iconName
      .replace('ios-', '')
      .replace('md-', '')
      .replace('-', ' ');
    this.label = label;

    return `ion-${iconName}`;
  }

  hostData(): VNodeData {
    // TODO set the right iconMode based on the config
    let iconMode = this.mode === 'md' ? 'md' : 'ios';
    this.iconMode = iconMode || Ionic.config.get('iconMode');

    const iconClasses: CssClassObject = []
      .concat(
        this.getElementClass(),
      )
      .reduce((prevValue, cssClass) => {
        prevValue[cssClass] = true;
        return prevValue;
       }, {});

    return {
      class: iconClasses,
      attrs: {
        'role': 'img'
      }
    };
  }

  render() {
    return <slot></slot>;
  }
}
