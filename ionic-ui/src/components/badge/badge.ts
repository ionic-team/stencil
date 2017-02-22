import { Component, Prop } from 'ionic-core';

import { Config } from '../../config/config';
import { initTheme, setColor, setMode, ComponentTheme } from '../../util/theme-utils';


/**
  * @name Badge
  * @description
  * Badges are simple components in Ionic containing numbers or text. You can display a badge to indicate that there is new information associated with the item it is on.
  * @see {@link /docs/v2/components/#badges Badges Component Docs}
 */
@Component({
  tag: 'ion-badge',
  template: `
    <div class="badge" :class="theme.host">
      <slot></slot>
    </div>
  `
})
export class Badge {
  private theme: ComponentTheme = {};

  constructor(config: Config) {
    config = new Config();
    initTheme(this.theme, 'badge', config);

  }

  /**
   * @input {string} The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/v2/theming/theming-your-app).
   */
  @Prop()
  set color(val: string) {
    setColor(this.theme, val);
  }

  /**
   * @input {string} The mode determines which platform styles to use.
   * Possible values are: `"ios"`, `"md"`, or `"wp"`.
   * For more information, see [Platform Styles](/docs/v2/theming/platform-specific-styles).
   */
  @Prop()
  set mode(val: string) {
    setMode(this.theme, val);
  }

}
/**
if its a proerty and a setter, then keep it as a prop
but instead of a computed property setter, it needs to be
a watcher
 */
