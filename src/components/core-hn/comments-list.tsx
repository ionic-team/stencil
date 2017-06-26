import { Component, h, Prop } from '../index';


@Component({
  tag: 'comments-list'
})
export class CommentsList {

  @Prop() type: any;

  render() {
    const items = this.type.map((comment: any) => {
      console.log(comment);
      const nestedComments = comment.comments.map((comment: any) => {
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

      return [
        <ion-item>
          <ion-label>
            <h2>
              {`Posted by ${comment.user} ${comment.time_ago}`}
            </h2>
            <div props={{
              innerHTML: comment.content
            }}></div>
          </ion-label>
        </ion-item>,

        <ion-list class='nested-comments'>
          {nestedComments}
        </ion-list>
      ];
    });

    return (
      <ion-list>
        {items}
      </ion-list>
    );
  }
}
