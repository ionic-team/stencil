import { Component, h } from '../index';

@Component({
  tag: 'feed-page'
})
export class FeedPage {
  @Prop() root: string;

  render() {
    return (
      <ion-page>
        <ion-content>
          <h2>Feed</h2>
        </ion-content>
      </ion-page>
    )
  }
}
