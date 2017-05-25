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
  @Prop() prevColor: string;

  ionViewDidLoad() {
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
    // reset page number
    this.page = 1;

    Ionic.overlay('loading', { content: `fetching ${type} articles...` }).then((loading: any) => {
      loading.present().then(() => {
        fetch(`${this.apiRootUrl}/${type}?page=1`).then((response) => {
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
          if (data.length !== 0) {
            this.stories = data;
          }
          loading.dismiss();
        });

      });
    });
  }

  render() {

    // set previous button color
    if (this.page === 1) {
      console.log('im here', this.page);
      this.prevColor = 'dark';
    } else {
      this.prevColor = 'primary';
    }

    return h(this,
      [
        h('ion-header.header.header-md', { props: { mdHeight: '56px', iosHeight: '61px' } },
          [
            h('ion-toolbar', { props: { color: 'primary' } },
              [
                h('ion-icon.header-icon', { props: { name: 'ionic', slot: 'start' } }),
                h('div.button-bar',
                  [
                    h('ion-button.headerButton', { props: { clear: true }, on: { click: () => this.getStories('news') } }, 'News'),
                    h('ion-button.headerButton', { props: { clear: true }, on: { click: () => this.getStories('show') } }, 'Show'),
                    h('ion-button.headerButton', { props: { clear: true }, on: { click: () => this.getStories('jobs') } }, 'Jobs'),
                    h('ion-button.headerButton', { props: { clear: true }, on: { click: () => this.getStories('ask') } }, 'Ask')
                  ]
                )
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
          h('ion-toolbar.pager',
            [
              h('ion-button.previousButton', { props: { clear: true, slot: 'start', color: this.prevColor }, on: { click: () => this.previous() } }, 'prev'),
              h('span.page-number', `page ${this.page}`),
              h('ion-button.nextButton', { props: { clear: true, slot: 'end' }, on: { click: () => this.next() } }, 'next')
            ]
          )
        )
      ]
    );
  }
}
