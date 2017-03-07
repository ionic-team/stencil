import { IonElement, Component, Prop, h, VNode, VNodeData } from '../../element/ion-element';


@Component({
  tag: 'ion-button',
  styleUrl: 'button.css',
  preprocessStyles: [
    'button.scss'
  ]
})
export class IonButton extends IonElement {

  @Prop()
  role = 'button';

  @Prop({ type: 'boolean'})
  large: boolean;

  @Prop({ type: 'boolean'})
  small: boolean;

  @Prop({ type: 'boolean'})
  default: boolean;

  @Prop({ type: 'boolean'})
  outline: boolean;

  @Prop({ type: 'boolean'})
  clear: boolean;

  @Prop({ type: 'boolean'})
  solid: boolean;

  @Prop({ type: 'boolean'})
  round: boolean;

  @Prop({ type: 'boolean'})
  block: boolean;

  @Prop({ type: 'boolean'})
  full: boolean;

  @Prop({ type: 'boolean'})
  strong: boolean;


  render(): VNode {
    const vnodeData: VNodeData = { class: {} };
    const hostCss = vnodeData.class;
    const host = this;
    const role = host.role;
    const mode = host.mode;

    function setCssClass(type: string) {
      if (type) {
        type = type.toLocaleLowerCase();
        hostCss[`${role}-${type}`] = true;
        hostCss[`${role}-${type}-${mode}`] = true;
      }
    }

    hostCss[role] = true;
    hostCss[`${role}-${mode}`] = true;

    let size = host.large ? 'large' : host.small ? 'small' : 'default';
    setCssClass(size);

    let style = host.outline ? 'outline' : host.clear ? 'clear' : host.solid ? 'solid' : null;
    style = (role !== 'bar-button' && style === 'solid' ? 'default' : style);
    setCssClass(style);

    let display = host.block ? 'block' : host.full ? 'full' : null;
    setCssClass(display);

    if (host.round) {
      setCssClass('round');
    }

    if (host.strong) {
      setCssClass('strong');
    }

    return h('.button', vnodeData, [
      h('span.button-inner', [
        h('slot')
      ]),
      h('div.button-effect')
    ]);
  }

}
