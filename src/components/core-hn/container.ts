import { Component, h, Prop, Ionic } from '../index';


@Component({
  tag: 'news-container',
  styleUrls: 'main.scss'
})
export class NewsContainer {

  @Prop() stories: any[] = [];
  apiRootUrl: string = 'https://node-hnapi.herokuapp.com';
  page: number = 1;
  pageType: string;
  @Prop() prevClass: string;
  @Prop() selectedClass: boolean = false;
  @Prop() firstSelectedClass: boolean;
  @Prop() secondSelectedClass: boolean = false;
  @Prop() thirdSelectedClass: boolean = false;
  @Prop() fourthSelectedClass: boolean = false;

  ionViewDidLoad() {
    if (Ionic.isServer) return;

    this.firstSelectedClass = true;

    /* Ionic.controller('loading', { content: 'fetching articles...' }).then((loading: any) => {
 
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
     });*/

    fetch(`${this.apiRootUrl}/news?page=${this.page}`).then((response) => {
      return response.json();
    }).then((data) => {
      console.log(data);
      this.stories = data;
    });
  }

  getStories(type: string) {
    if (Ionic.isServer) return;

    // reset page number
    this.page = 1;

    // this is definitely not the best solution
    // working on something more elegant, but this
    // gets the job done for the moment
    switch (type) {
      case 'news':
        this.firstSelectedClass = true;
        this.secondSelectedClass = false;
        this.thirdSelectedClass = false;
        this.fourthSelectedClass = false;
        break;
      case 'show':
        this.secondSelectedClass = true;
        this.firstSelectedClass = false;
        this.thirdSelectedClass = false;
        this.fourthSelectedClass = false;
        break;
      case 'jobs':
        this.thirdSelectedClass = true;
        this.firstSelectedClass = false;
        this.fourthSelectedClass = false;
        this.secondSelectedClass = false;
        break;
      case 'ask':
        this.fourthSelectedClass = true;
        this.thirdSelectedClass = false;
        this.secondSelectedClass = false;
        this.firstSelectedClass = false;
        break;
    }

    this.selectedClass = true;

    Ionic.controller('loading', { content: `fetching ${type} articles...` }).then((loading: any) => {
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

      Ionic.controller('loading', { content: `fetching articles...` }).then(loading => {
        loading.present().then(() => {

          this.page = this.page--;
          console.log(this.page--);

          fetch(`${this.apiRootUrl}/${this.pageType}?page=${this.page}`).then(response => {
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
    Ionic.controller('loading', { content: `fetching articles...` }).then(loading => {
      loading.present().then(() => {

        this.page = this.page++;
        console.log(this.page++);

        fetch(`${this.apiRootUrl}/${this.pageType}?page=${this.page}`).then(response => {
          return response.json();
        }).then(data => {
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
      this.prevClass = '.disabled-nav';
    } else {
      this.prevClass = '';
    }

    console.log(this.firstSelectedClass);

    return h('div',
      [
        h('ion-header', { props: { mdHeight: '56px', iosHeight: '61px' } },
          [
            h('ion-toolbar', { props: { color: 'primary' } },
              [
                h('ion-icon.header-icon', { props: { name: 'ionic', slot: 'start' } }),
                h('ion-button.header-button.first-button', { class: { 'header-button-selected': this.firstSelectedClass }, props: { clear: true }, on: { click: () => this.getStories('news') } }, 'News'),
                h('ion-button.header-button', { class: { 'header-button-selected': this.secondSelectedClass }, props: { clear: true }, on: { click: () => this.getStories('show') } }, 'Show'),
                h('ion-button.header-button', { class: { 'header-button-selected': this.thirdSelectedClass }, props: { clear: true }, on: { click: () => this.getStories('jobs') } }, 'Jobs'),
                h('ion-button.header-button', { class: { 'header-button-selected': this.fourthSelectedClass }, props: { clear: true }, on: { click: () => this.getStories('ask') } }, 'Ask')
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
              h(`ion-button${this.prevClass}`, { props: { clear: true, slot: 'start' }, on: { click: () => this.previous() } }, 'prev'),
              h('span.page-number', `page ${this.page}`),
              h('ion-button.next-button', { props: { clear: true }, on: { click: () => this.next() } }, 'next')
            ]
          )
        )
      ]
    );
  }
}
