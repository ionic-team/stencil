import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'site-header',
  styleUrl: 'site-header.scss'
})
export class SiteHeader {
  render() {
    return (
      <ion-header>
        <ion-toolbar color='clear'>
          <ion-grid>
            <ion-row>
              <ion-col>
                <img class="logo" src="img/text-logo.png" />
              </ion-col>
              <ion-col class="links">
                <stencil-route-link router="#router" url="">Home</stencil-route-link>
                <stencil-route-link router="#router" url="docs">Docs</stencil-route-link>
                <stencil-route-link router="#router" url="demos">Demos</stencil-route-link>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-toolbar>
      </ion-header>
    )
  }
}
