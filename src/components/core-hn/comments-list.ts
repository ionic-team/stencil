import { Component, Prop, h } from '../index';

@Component({
  tag: 'comments-list',
  styleUrls: {
    default: 'main.scss',
  },
  shadow: false
})
export class CommentsList {

  @Prop() type: any;

  render() {
    console.log('type', this.type);

    const items = this.type.map((comment: any) => {
      return h('ion-card',
        h('ion-card-content',
          [
            h('div', `Posted by ${comment.user} ${comment.time_ago}`),
            h('div', { props: { innerHTML: comment.content } }),
          ]
        )
      );
    });

    return h(this,
      h('div.listWrapper',
        [
          h('ion-list', items)
        ]
      )
    );
  }
}
