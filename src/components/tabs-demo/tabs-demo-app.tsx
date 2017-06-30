import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'tabs-demo-app'
})
export class TabsDemoApp {
  render() {
    return (
      <ion-tabs>
        <ion-tab tab-badge="4" tab-badge-style="danger" tab-icon="flash" tab-title="Feed" root="feed-page" />
        <ion-tab tab-icon="heart" tab-title="Friends" root="friends-page" />
        <ion-tab tab-icon="cog" tab-title="Settings" root="settings-page" />
      </ion-tabs>
    );
  }
}
