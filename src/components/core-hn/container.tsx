import { Component, h, Ionic, State } from '../index';


@Component({
  tag: 'news-container',
  styleUrls: 'main.scss'
})
export class NewsContainer {

  @State() stories: any[] = [];
  @State() firstSelectedClass: boolean;
  @State() secondSelectedClass: boolean = false;
  @State() thirdSelectedClass: boolean = false;
  @State() fourthSelectedClass: boolean = false;
  apiRootUrl: string = 'https://node-hnapi.herokuapp.com';
  page: number = 1;
  pageType: string;
  prevClass: any;

  componentWillLoad() {
    if (Ionic.isServer) return;

    this.firstSelectedClass = true;

    // call to firebase function for first view
    // switch this out to hn/ for prod so fancy service
    // worker trick works like it should
    this.fakeFetch('https://us-central1-corehacker-10883.cloudfunctions.net/fetchNews').then((data) => {
      this.stories = data;
      this.pageType = 'news';
    });
  }

  fakeFetch(url: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();

      request.addEventListener('load', function () {
        resolve(JSON.parse(this.responseText));
      });

      request.addEventListener('error', function () {
        reject(`error: ${this.statusText} / ${this.status}`);
      });

      request.open('GET', url, true);
      request.send();
    });
  }

  getStories(type: string) {
    if (Ionic.isServer) return;

    // reset page number
    this.page = 1;

    // this is definitely not the best solution
    // working on something more elegant, but this
    // gets the job done for the moment
    console.log(type);
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

    Ionic.controller('loading', { content: `fetching ${type} articles...` }).then((loading: any) => {
      loading.present().then(() => {

        this.fakeFetch(`${this.apiRootUrl}/${type}?page=1`).then((data) => {
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

          this.page = this.page - 1;

          this.fakeFetch(`${this.apiRootUrl}/${this.pageType}?page=${this.page}`).then((data) => {
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

        this.page = this.page + 1;

        this.fakeFetch(`${this.apiRootUrl}/${this.pageType}?page=${this.page}`).then((data) => {
          if (data.length !== 0) {
            this.stories = data;
          }
          loading.dismiss();
        });

      });
    });
  }

  componentWillUpdate() {
    this.prevClass = this.page === 1 ? { 'no-back': true } : { 'yes-back': true };
  }

  render() {
    return [
      <ion-header mdHeight='56px' iosHeight='61px'>
        <ion-toolbar color='primary'>
          <img class='ionic-icon' src='ionic.svg' alt='ionic'></img>

          <div class='tabs-bar'>
            <ion-button
              class={{
                'header-button': true,
                'header-button-selected': this.firstSelectedClass,
                'no-select': !this.firstSelectedClass
              }}
              onClick={() => this.getStories('news')}
            >
              News
          </ion-button>
            <ion-button
              class={{
                'header-button': true,
                'header-button-selected': this.secondSelectedClass,
                'no-select': !this.secondSelectedClass
              }}
              onClick={() => this.getStories('show')}
            >
              Show
          </ion-button>
            <ion-button
              class={{
                'header-button': true,
                'header-button-selected': this.thirdSelectedClass,
                'no-select': !this.thirdSelectedClass
              }}
              onClick={() => this.getStories('jobs')}
            >
              Jobs
          </ion-button>
            <ion-button
              class={{
                'header-button': true,
                'header-button-selected': this.fourthSelectedClass,
                'no-select': !this.fourthSelectedClass
              }}
              onClick={() => this.getStories('ask')}
            >
              Ask
          </ion-button>
          </div>
        </ion-toolbar>
      </ion-header>,
      <ion-content>
        <news-list type={this.stories}>
        </news-list>
      </ion-content>,
      <ion-footer>
        <ion-toolbar class='pager'>
          <ion-buttons slot='start'>
            <ion-button class={this.prevClass} clear={true} onClick={() => this.previous()}>
              prev
          </ion-button>
          </ion-buttons>
          <span class='page-number'>
            page {this.page}
          </span>
          <ion-buttons slot='end'>
            <ion-button color='primary' clear={true} onClick={() => this.next()}>
              next
          </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-footer>
    ];
  }
}
