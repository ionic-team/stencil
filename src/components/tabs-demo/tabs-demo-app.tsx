import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'tabs-demo-app'
})
export class TabsDemoApp {
  @State() selectedTab: Number = 0;

  render() {
    console.log('Rendering', this.selectedTab);
    
    return (
      <ion-tabs selectedTab={this.selectedTab}>
        <ion-tab tab-icon="flash" tab-title="Feed" root="feed-page" isSelected={this.selectedTab == 0} onSelected={() => this.selectedTab = 0}/>
        <ion-tab tab-icon="heart" tab-title="Friends" root="friends-page" isSelected={this.selectedTab == 1} onSelected={() => this.selectedTab = 1} />
        <ion-tab tab-icon="cog" tab-title="Settings" root="settings-page" isSelected={this.selectedTab == 2} onSelected={() => this.selectedTab = 2}/>
      </ion-tabs>
    );
  }
}
