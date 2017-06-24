import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'stencil-site'
})
export class App {
  render() {
    return (
      <div class="app">
        <ion-button>Click me</ion-button>
        <ion-router>
          <site-header />
          <ion-route url="/">
            <landing-page></landing-page>
          </ion-route>
          <ion-route url="/docs">
            <docs-page></docs-page>
          </ion-route>
        </ion-router>
      </div>
    );
  }
}
