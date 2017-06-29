import { Component, h, Listen } from '../index';


@Component({
  tag: 'ion-tabs',
  styleUrls: {
    ios: 'tabs.ios.scss',
    md: 'tabs.md.scss',
    wp: 'tabs.wp.scss'
  },
  host: {
    theme: 'tabs'
  }
})
export class Tabs {
  @State() selectedTab: Number = 0;

  @State() tabs: [Tab] = []

  @Listen('ionTabDidLoad')
  tabDidLoad(ev) {
    console.log('Tabs load', ev)
    this.tabs = [ ...this.tabs, ev.detail.tab ]
  }

  @Listen('ionTabDidUnload')
  tabDidUnload(ev) {
    this.tabs = this.tabs.filter(t => t !== ev.detail.tab)
  }


  handleTabButtonClick(tab) {
    console.log('Handling tab button click')
    tab.onSelected()
  }

  render() {
    const tabs = this.tabs

    console.log('Tabs rendering', tabs)

    return [
      <div class="tabbar" role="tablist">
        {tabs.map(tab => {
        return (
          <ion-tab-button role="tab" tab={tab} onClick={this.handleTabButtonClick.bind(this, tab)}></ion-tab-button>
        )
        })}
      </div>,
      <slot></slot>
    ]
  }
}
