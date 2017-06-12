import { Component, h, Prop, Ionic, State } from '../index';


@Component({
  tag: 'news-list',
  styleUrls: 'main.scss'
})
export class NewsList {

  @Prop() type: any[];
  apiRootUrl: string = 'https://node-hnapi.herokuapp.com';
  @State() fakeData: any[] = [];

  ionViewWillLoad() {
    // this can be simplified or removed once skeleton screens
    // have made it in
    for (let i = 0; i < 11; i++) {
      this.fakeData.push({
        points: 50,
        title: 'PWAs are the future',
        user: 'ionitron',
        time_ago: '1 day ago',
        comments_count: 400
      });
    }
  }

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
    if (this.type.length === 0) {
      // Note to self:
      // change this to skeleton screens
      // once those are in
      return (
        <ion-list>
          {this.fakeData.map((story: any) => (
            <ion-item>
              <div class='points' slot='start'>
                {story.points}
              </div>
              <ion-label>
                <h2 class='list-header'>{story.title}</h2>
                <h3 class='comments-text'>
                  Posted by {story.user} {story.time_ago} | {story.comments_count} comments
                </h3>
              </ion-label>
            </ion-item>
          ))}
        </ion-list>
      );
    }
    return (
      <ion-list>
        {this.type.map((story: any) => (
          <ion-item>
            <div class='points' slot='start'>
              {story.points || 0}
            </div>
            <ion-label>
              <h2 class='list-header'>
                <a href={story.url} alt={story.title}>{story.title}</a>
              </h2>
              <h3 class='comments-text' on-click={() => this.comments(story)}>
                Posted by {story.user} {story.time_ago} | {story.comments_count} comments
                </h3>
            </ion-label>
          </ion-item>
        ))}
      </ion-list>
    );
  }
}
