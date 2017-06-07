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

    fetch(`${this.apiRootUrl}/news?page=${this.page}`).then((response) => {
      return response.json();
    }).then((data) => {
      console.log(data);
      this.stories = data;

      this.pageType = 'news';
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
      this.prevClass = 'no-back';
    } else {
      this.prevClass = 'yes-back';
    }

    return [
      <ion-header mdHeight='56px' iosHeight='61px'>
        <ion-toolbar color='primary'>
          <ion-icon class='header-icon' name='ionic' slot='start'></ion-icon>

          <div class='tabs-bar'>
            <ion-button
              class={{
                'header-button': true,
                'first-button': true,
                'header-button-selected': this.firstSelectedClass
              }}
              clear
              on-click={() => this.getStories('news')}
            >
              News
          </ion-button>
            <ion-button
              class={{
                'header-button': true,
                'header-button-selected': this.secondSelectedClass
              }}
              clear
              on-click={() => this.getStories('show')}
            >
              Show
          </ion-button>
            <ion-button
              class={{
                'header-button': true,
                'header-button-selected': this.thirdSelectedClass
              }}
              clear
              on-click={() => this.getStories('jobs')}
            >
              Jobs
          </ion-button>
            <ion-button
              class={{
                'header-button': true,
                'header-button-selected': this.fourthSelectedClass
              }}
              clear
              on-click={() => this.getStories('ask')}
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
            <ion-button class={this.prevClass} clear={true} on-click={() => this.previous()}>
              prev
          </ion-button>
          </ion-buttons>
          <span class='page-number'>
            page {this.page}
          </span>
          <ion-buttons slot='end'>
            <ion-button color='primary' clear={true} on-click={() => this.next()}>
              next
          </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-footer>
    ];
  }
}
