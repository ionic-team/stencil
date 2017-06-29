import { Component, h } from '../index';

@Component({
  tag: 'settings-page'
})
export class SettingsPage {
  @Prop() root: string;

  render() {
    return (
      <ion-page>
        <ion-content>
          <h2>Settings</h2>
        </ion-content>
      </ion-page>
    )
  }
}
