import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'stencil-site'
})
export class App {
  render() {
    return (
      <div class="app">
        <ion-router id="router">

          <site-header />

          <p style={{
            marginTop: '100px'
          }}>
            <ion-route-link router="#router" url="">Home</ion-route-link>
            <ion-route-link router="#router" url="docs">Docs</ion-route-link>
            <ion-route-link router="#router" url="demos">Demos</ion-route-link>
          </p>

          <ion-route url="/" router="#router">
            <landing-page></landing-page>
          </ion-route>
          <ion-route url="/docs" router="#router">
            <docs-page></docs-page>
          </ion-route>
          <ion-route url="/demos" router="#router">
            <demos-page></demos-page>
          </ion-route>

        </ion-router>
      </div>
    );
  }
}
