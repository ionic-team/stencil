import { Component, h, Prop, Ionic } from '../index';


@Component({
  tag: 'news-list',
  styleUrls: 'main.scss'
})
export class NewsList {

  @Prop() type: any[];
  apiRootUrl: string = 'http://localhost:8100';

  comments(story: any) {
    if (Ionic.isServer) return;

    Ionic.controller('loading', { content: 'fetching comments...' }).then(loading => {
      loading.present();

      fetch(`${this.apiRootUrl}/item/${story.id}`).then(response => {
        return response.json();
      }).then((data: any) => {
        console.log(data);
        data.comments;

        setTimeout(() => {
          loading.dismiss().then(() => {
            Ionic.controller('modal', { component: 'comments-page', componentProps: { comments: data.comments, storyId: story.id } }).then(modal => {
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

    /*const items = this.type.map((story: any) => {
      return h('ion-item',
        [
          h('div.points', { props: { slot: 'start' } }, story.points || 0),
          h('ion-label.item-content',
            [
              h('h2.list-header', { on: { click: () => window.open(story.url) } }, story.title),
              h('h3.comments-text', { on: { click: () => this.comments(story) } }, `Posted by ${story.user} ${story.time_ago} | ${story.comments_count} comments`),
            ]
          )
        ]
      );
    });

    return h(this,
      [
        h('ion-list', items)
      ]
    );*/

    const items = this.type.map((story: any) => {
      return h('li',
        h('div.points', { props: { slot: 'start' } }, story.points || 0),
        h('div',
          [
            h('h2.list-header', { on: { click: () => window.open(story.url) } }, story.title),
             h('h3.comments-text', { on: { click: () => this.comments(story) } }, `Posted by ${story.user} ${story.time_ago} | ${story.comments_count} comments`)
          ]
        )
      );
    });
    console.log(items);

    return h('ul', {}, items);
  }
}
