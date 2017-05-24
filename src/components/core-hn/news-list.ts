import { Component, Prop, h } from '../index';

declare var Ionic: any;

@Component({
  tag: 'news-list',
  styleUrls: {
    default: 'main.scss',
  },
  shadow: false
})
export class NewsList {

  @Prop() type: any[];
  apiRootUrl: string = 'http://localhost:8100';

  comments(story: any) {
    Ionic.overlay('modal', { component: 'comments-page', componentProps: { comments: `${this.apiRootUrl}/item/${story.id}`, storyId: story.id } }).then((modal: any) => {
      console.log('modal created');

      modal.present().then(() => {
        console.log('modal finished transitioning in, commments: ', modal.componentProps.comments);
      });
    });
  }

  render() {
    console.log(this.type);

    const items = this.type.map((story: any) => {
      return h('ion-card',
        [
          h('ion-card-header', { style: { whiteSpace: 'normal' } },
            h('ion-card-title', story.title)
          ),
          h('ion-card-content',
            [
              h('div', `${story.points} points`),
              h('div', `Posted by ${story.user} ${story.time_ago}`),
            ]
          ),
          h('ion-button', { props: { clear: true }, on: { click: () => window.open(story.url) } }, 'visit'),
          h('ion-button', { props: { clear: true }, on: { click: () => this.comments(story) } }, 'comments')
        ]
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
