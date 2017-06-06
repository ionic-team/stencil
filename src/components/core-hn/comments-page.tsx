import { Component, Prop, h, Ionic } from '../index';


@Component({
  tag: 'comments-page',
  styleUrls: 'main.scss'
})
export class CommentsPage {

  @Prop() stories: any[] = [];
  @Prop() comments: string;

  close() {
    Ionic.emit(this, 'ionDismiss');
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color='primary'>
          <ion-button class='close-button' clear icon-only slot='start' on-click={this.close.bind(this)}>
            <ion-icon name='close' style={{ color: 'white'}} />
          </ion-button>
          <ion-title class='comments-title' slot='end'>
            Comments
          </ion-title>
        </ion-toolbar>
      </ion-header>,
      <ion-content>
        <comments-list type={this.comments}></comments-list>
      </ion-content>
    ];
  }
}
