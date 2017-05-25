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
    Ionic.overlay('loading', { content: 'fetching comments...' }).then((loading: any) => {
      loading.present();

      fetch(`${this.apiRootUrl}/item/${story.id}`).then((response: any) => {
        return response.json();
      }).then((data: any) => {
        console.log(data);
        data.comments;

        setTimeout(() => {
          loading.dismiss().then(() => {
            Ionic.overlay('modal', { component: 'comments-page', componentProps: { comments: data.comments, storyId: story.id } }).then((modal: any) => {
              console.log('modal created');

              modal.present().then(() => {
                console.log('modal finished transitioning in, commments: ', modal.componentProps.comments);
              });
            });
          });
        }, 300);
      });
    });
  }

  render() {
    console.log(this.type);

    const items = this.type.map((story: any) => {
      /*return h('ion-card',
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
      );*/
      return h('ion-item',
        [
          h('div.points', { props: { slot: 'start' } }, story.points || 0),
          h('ion-label',
            [
              h('h2', { on: { click: () => window.open(story.url) } }, story.title),
              h('h3', { on: { click: () => this.comments(story) } }, `Posted by ${story.user} ${story.time_ago} | ${story.comments_count} comments`)
            ]
          )
        ]
      );
    });

    return h(this,
      [
        h('ion-list', items)
      ]
    );
  }
}
