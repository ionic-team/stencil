import { Component, Prop, h } from '../index';

@Component({
  tag: 'comments-list',
  styleUrls: 'main.scss'
})
export class CommentsList {

  @Prop() type: any;

  render() {
    console.log('type', this.type);

    const items = this.type.map((comment: any) => {
      return h('ion-item',
        h('ion-label',
          [
            h('h2', `Posted by ${comment.user} ${comment.time_ago}`),
            h('div', { props: { innerHTML: comment.content } }),
          ]
        )
      );
    });

    return h(this,
      h('div',
        [
          h('ion-list', items)
        ]
      )
    );
  }
}
