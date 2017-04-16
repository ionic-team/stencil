import { Component, h, Ionic } from '../../index';


@Component({
  tag: 'ion-toggle',
  styleUrls: {
    ios: 'toggle.ios.scss',
    md: 'toggle.md.scss',
    wp: 'toggle.wp.scss'
  }
})
export class Toggle {
  activated: boolean;
  checked: boolean;
  disabled: boolean;
  id: string;
  labelId: string;


  render() {
    return h(this,
      h('div', Ionic.theme(this, 'toggle', {
        class: {
          'toggle-activated': this.activated,
          'toggle-checked': this.checked,
          'toggle-disabled': this.disabled,
        }
      }),
        [
          h('div.toggle-icon',
            h('div.toggle-inner')
          ),
          h('button.toggle-item-cover', {
            attrs: {
              'id': this.id,
              'aria-checked': this.checked,
              'aria-labelledby': this.labelId,
              'aria-disabled': this.disabled,
              'roll': 'checkbox',
              'type': 'button',
              'disable-activated': '',
            }
          })
        ]
      )
    );
  }

}
