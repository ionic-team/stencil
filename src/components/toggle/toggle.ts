import { BooleanInputComponent } from '../../util/interfaces';
import { Component, h, Ionic, Prop, Watch } from '../../index';


@Component({
  tag: 'ion-toggle',
  styleUrls: {
    ios: 'toggle.ios.scss',
    md: 'toggle.md.scss',
    wp: 'toggle.wp.scss'
  }
})
export class Toggle implements BooleanInputComponent {
  activated: boolean;
  hasFocus: boolean;
  id: string;
  labelId: string;


  @Prop() checked: boolean;
  @Prop() disabled: boolean;
  @Prop() value: string;


  @Watch('checked')
  changed(val: boolean) {
    Ionic.emit(this, 'ionChange', { checked: val });
  }


  canStart(ev: UIEvent) {
    console.log('canStart', ev);
  }


  onStart(ev: UIEvent) {
    console.log('onStart', ev);
  }


  onMove(ev: UIEvent) {
    console.log('onMove', ev);
  }


  onEnd(ev: UIEvent) {
    console.log('onEnd', ev);
  }


  toggle(ev: UIEvent) {
    this.checked = !this.checked;
    ev.preventDefault();
    ev.stopImmediatePropagation();
    this.fireFocus();
  }


  fireFocus() {
    if (!this.hasFocus) {
      this.hasFocus = true;
      Ionic.emit(this, 'ionFocus');
    }
  }


  fireBlur() {
    if (this.hasFocus) {
      this.hasFocus = false;
      Ionic.emit(this, 'ionBlur');
    }
  }


  render() {
    return h(this,
      h('ion-gesture', Ionic.theme(this, 'toggle', {
        class: {
          'toggle-activated': this.activated,
          'toggle-checked': this.checked,
          'toggle-disabled': this.disabled,
        },
        props: {
          'canStart': this.canStart.bind(this),
          'onStart': this.onStart.bind(this),
          'onMove': this.onMove.bind(this),
          'onEnd': this.onEnd.bind(this),
        }
      }),
        [
          h('div.toggle-icon',
            h('div.toggle-inner')
          ),
          h('button.toggle-cover', {
            attrs: {
              'id': this.id,
              'aria-checked': this.checked ? 'true': false,
              'aria-disabled': this.disabled ? 'true': false,
              'aria-labelledby': this.labelId,
              'role': 'checkbox',
              'type': 'button'
            },
            on: {
              'click': this.toggle.bind(this)
            }
          })
        ]
      )
    );
  }

}
