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

    return h(this,
      [
        h('ion-header',
          h('ion-toolbar', { props: { color: 'primary' } },
            [
              h('ion-button.close-button', { props: { clear: true, iconOnly: true, slot: 'start' }, on: { click: this.close.bind(this) } },
                h('ion-icon', { props: { name: 'close' }, style: { color: 'white' } })
              ),
              h('ion-title.comments-title', { props: { slot: 'end' } }, 'Comments')
            ]
          )
        ),

        h('ion-content',
          h('comments-list', { props: { type: this.comments } })
        )
      ]
    );
  }
}
