import { Component, Prop, h } from '../index';


@Component({
  tag: 'comments-page',
  styleUrls: {
    default: 'main.scss',
  },
  shadow: false
})
export class CommentsPage {

  @Prop() stories: any[] = [];
  @Prop() comments: string;

  close(uiEvent: any) {
    const ev = new (CustomEvent as any)('ionDismiss', { composed: true, bubbles: true });
    uiEvent.target.dispatchEvent(ev);
  }

  render() {

    return h(this,
      [
        h('ion-header.header.header-md',
          h('ion-toolbar', { props: { color: 'primary' } },
            [
              h('ion-button.closeButton', { props: { clear: true, iconOnly: true, slot: 'start' }, on: { click: () => this.close(event) } },
                h('ion-icon', { props: { name: 'close' }, style: { color: 'white' } })
              ),
              h('ion-title', 'Comments')
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
