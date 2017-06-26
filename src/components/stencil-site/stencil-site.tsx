import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'stencil-site'
})
export class App {
  constructor() {
    const dynamicRouter = <ion-router></ion-router>
    console.log('Built router', dynamicRouter)
  }
  render() {
    return (
      <div class="app">
        <ion-router id="router">

          <site-header />

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
