import { Component, Method, OtherThing } from '../../../../../index';

type Color = 'primary' | 'secondary';

export interface Config {
  duration: number;
  timeout: number;
}

export type ConfigProps = keyof Config;

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
   */
  @Prop() objectAnyThing: (_) => Promise<OtherThing>;

  @Prop() size: string;

  @Prop({
    attr: 'my-custom-attr-name',
    reflectToAttr: true
  }) withOptions = 88;

  @Prop() width?: number;

  @Prop() setting?: 'auto' | 'manual';

  @Prop() values?: number | number[];

  @Prop() enabled?: boolean | string;

  @Prop() color?: Color = "primary";

  @Prop() config?: ConfigProps;

  @Prop() mode!: string;

  @Prop() required!: string;
}
