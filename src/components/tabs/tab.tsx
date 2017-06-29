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
    console.log('Tab rendering')
    const RootComponent = this.root;

    return <RootComponent />
  }
}
