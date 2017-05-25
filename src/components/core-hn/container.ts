import { Component, Prop, h } from '../index';

declare var Ionic: any;

@Component({
  tag: 'news-container',
  styleUrls: {
    default: 'main.scss',
  },
  shadow: false
})
export class NewsContainer {

  @Prop() stories: any[] = [];
  apiRootUrl: string = 'http://localhost:8100';
  page: number = 1;
  pageType: string;

  ionViewDidLoad() {
    console.log('did enter');

    Ionic.overlay('loading', { content: 'fetching articles...' }).then((loading: any) => {

      loading.present().then(() => {
        console.log('start presenting loading');

        fetch(`${this.apiRootUrl}/news?page=${this.page}`).then((response) => {
          return response.json();
        }).then((data) => {
          console.log(data);
          this.stories = data;

          setTimeout(() => {
            loading.dismiss();
          }, 500);
        });

        this.pageType = 'news';
      });
    });
  }

  getStories(type: string) {
    Ionic.overlay('loading', { content: `fetching ${type} articles...` }).then((loading: any) => {
      loading.present().then(() => {
        fetch(`${this.apiRootUrl}/${type}?page=${this.page}`).then((response) => {
          return response.json();
        }).then((data) => {
          this.stories = data;

          loading.dismiss();
        });

        this.pageType = type;

      });
    });
  }

  previous() {
    if (this.page > 1) {
      Ionic.overlay('loading', { content: `fetching articles...` }).then((loading: any) => {
        loading.present().then(() => {

          this.page = this.page--;
          console.log(this.page--);

          fetch(`${this.apiRootUrl}/${this.pageType}?page=${this.page}`).then((response) => {
            return response.json();
          }).then((data) => {
            console.log(data);
            this.stories = data;

            loading.dismiss();
          });

        });
      });
    }
  }

  next() {
    Ionic.overlay('loading', { content: `fetching articles...` }).then((loading: any) => {
      loading.present().then(() => {

        this.page = this.page++;
        console.log(this.page++);

        fetch(`${this.apiRootUrl}/${this.pageType}?page=${this.page}`).then((response) => {
          return response.json();
        }).then((data) => {
          console.log(data);
          this.stories = data;

          loading.dismiss();
        });

      });
    });
  }

  render() {
    /*return h(this,
      [
        h('ion-header',
          [
            h('ion-toolbar', { props: { color: 'primary' } },
              h('ion-title', 'CoreHacker')
            )
          ]
        ),
        h('ion-content',
          [
            h('ion-button.previousButton', { props: { clear: true }, on: { click: () => this.previous() } }, 'prev'),
            h('ion-button.nextButton', { props: { clear: true }, on: { click: () => this.next() } }, 'next'),

            h('news-list', { props: { type: this.stories } })
          ]
        ),

        h('ion-footer',
          h('ion-toolbar',
            [
              h('ion-button.news', { props: { clear: true }, on: { click: () => this.getStories('news') } }, 'News'),
              h('ion-button.show', { props: { clear: true }, on: { click: () => this.getStories('show') } }, 'Show'),
              h('ion-button.jobs', { props: { clear: true }, on: { click: () => this.getStories('jobs') } }, 'Jobs'),
              h('ion-button.ask', { props: { clear: true }, on: { click: () => this.getStories('ask') } }, 'Ask')
            ]
          )
        )
      ]
    );*/
    return h(this,
      [
        h('ion-header',
          [
            h('ion-toolbar', { props: { color: 'primary' } },
              [
                h('ion-button.headerButton', { props: { clear: true }, on: { click: () => this.getStories('news') } }, 'News'),
                h('ion-button.headerButton', { props: { clear: true }, on: { click: () => this.getStories('show') } }, 'Show'),
                h('ion-button.headerButton', { props: { clear: true }, on: { click: () => this.getStories('jobs') } }, 'Jobs'),
                h('ion-button.headerButton', { props: { clear: true }, on: { click: () => this.getStories('ask') } }, 'Ask')
              ]
            )
          ]
        ),
        h('ion-content',
          [
            h('news-list', { props: { type: this.stories } })
          ]
        ),

        h('ion-footer',
          h('ion-toolbar',
            [
              h('ion-buttons', { props: { slot: 'start' } },
                h('ion-button.previousButton', { props: { clear: true }, on: { click: () => this.previous() } }, 'prev'),
              ),
              h('ion-buttons', { props: { slot: 'end' } },
                h('ion-button', { props: { clear: true }, on: { click: () => this.next() } }, 'next')
              )
            ]
          )
        )
      ]
    );
  }
}
