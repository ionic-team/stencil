import { Component, h, Prop, Ionic } from '../index';


@Component({
  tag: 'news-list',
  styleUrls: 'main.scss'
})
export class NewsList {

  @Prop() type: any[];
  apiRootUrl: string = 'https://node-hnapi.herokuapp.com';

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
    return (
      <ion-list>
        {this.type.map((story: any) => (
          <ion-item>
            <div class='points' slot='start'>
              {story.points || 0}
            </div>
            <ion-label>
              <div>
                <h2 class='list-header' on-click={() => window.open(story.url)}>{story.title}</h2>
                <h3 class='comments-text' on-click={() => this.comments(story)}>
                  Posted by {story.user} {story.time_ago} | {story.comments_count} comments
              </h3>
              </div>
            </ion-label>
          </ion-item>
        ))}
      </ion-list>
    );
  }
}
