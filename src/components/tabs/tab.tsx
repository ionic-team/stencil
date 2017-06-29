import { Component, h, Ionic } from '../index';


@Component({
  tag: 'ion-tab',
  host: {
    theme: 'tab'
  }
})
export class Tab {
  @Prop() root: string;

  @Prop() tabTitle: string;

  @Prop() tabIcon: string;

  @Prop() onSelected: Function;

  @Prop() isSelected: Boolean = false;

  ionViewDidLoad() {
    console.log('Tab did load')
    setTimeout(() => {
      Ionic.emit(this, 'ionTabDidLoad', {
        detail: {
          tab: this
        }
      })
    }, 0)
  }

  ionViewDidUnload() {
    Ionic.emit(this, 'ionTabDidLoad', {
      detail: {
        tab: this
      }
    })
  }

  render() {
    const RootComponent = this.root;

    if(!this.isSelected) {
      return null;
    }

    return <RootComponent />
  }
}
