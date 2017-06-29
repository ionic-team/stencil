import { Component, h } from '../index';

@Component({
  tag: 'friends-page'
})
export class FriendsPage {
  @Prop() root: string;

  render() {
    return (
      <h2>Friends</h2>
    )
  }
}
