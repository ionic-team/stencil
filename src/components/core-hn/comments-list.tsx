import { Component, Prop, h } from '../index';

@Component({
  tag: 'comments-list',
  styleUrls: 'main.scss'
})
export class CommentsList {

  @Prop() type: any;

  render() {
    const items = this.type.map((comment: any) => {
      return (
        <ion-item>
          <ion-label>
            <h2>
              {`Posted by ${comment.user} ${comment.time_ago}`}
            </h2>
            <div props={{
              innerHTML: comment.content
            }}></div>
          </ion-label>
        </ion-item>
      );
    });

    return (
      <div>
        <ion-list>
          {items}
        </ion-list>
      </div>
    );
  }
}
