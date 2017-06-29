import { Component, h, Ionic } from '../index';
import { VNodeData } from '../../util/interfaces';


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
  @Prop() tabBadge: string;
  @Prop() tabBadgeStyle: string;

  @Prop() onSelected: Function;

  @Prop() isSelected: Boolean = false;

  hostData(): VNodeData {
    return {
      style: {
        display: !this.isSelected && 'none' || ''
      },
      class: {
      }
    };
  }

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
    return <RootComponent />
  }
}
