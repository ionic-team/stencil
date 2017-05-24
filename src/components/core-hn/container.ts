import { Component, Prop, h } from '../index';

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

    fetch(`${this.apiRootUrl}/news?page=${this.page}`).then((response) => {
      return response.json();
    }).then((data) => {
      console.log(data);
      this.stories = data;
    });

    this.pageType = 'news';
  }

  getStories(type: string) {
    fetch(`${this.apiRootUrl}/${type}?page=${this.page}`).then((response) => {
      return response.json();
    }).then((data) => {
      console.log(data);
      this.stories = data;
    });

    this.pageType = type;
  }

  previous() {
    if (this.page > 1) {
      this.page = this.page--;
      console.log(this.page--);

      fetch(`${this.apiRootUrl}/${this.pageType}?page=${this.page}`).then((response) => {
        return response.json();
      }).then((data) => {
        console.log(data);
        this.stories = data;
      });
    }
  }

  next() {
    this.page = this.page++;
    console.log(this.page++);

    fetch(`${this.apiRootUrl}/${this.pageType}?page=${this.page}`).then((response) => {
      return response.json();
    }).then((data) => {
      console.log(data);
      this.stories = data;
    });
  }

  render() {
    return h(this,
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
    );
  }
}
